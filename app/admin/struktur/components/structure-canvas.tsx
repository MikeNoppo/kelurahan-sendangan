"use client"

import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeMouseHandler,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Panel,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StructureNode from './structure-node'
import FloatingToolbar from './floating-toolbar'
import { getLayoutedElements } from '@/lib/structure-layout'
import { useToast } from '@/hooks/use-toast'
import { ZoomIn, ZoomOut, Maximize2, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

type StructureMember = {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  fotoUrl: string | null
  positionX: number
  positionY: number
  parentId: string | null
}

type StructureCanvasProps = {
  members: StructureMember[]
  onRefresh: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

type HistoryState = {
  nodes: Node[]
  edges: Edge[]
}

const nodeTypes = {
  structureNode: StructureNode,
}

export default function StructureCanvas({
  members,
  onRefresh,
  onEdit,
  onDelete,
}: StructureCanvasProps) {
  const { toast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [contextMenuNode, setContextMenuNode] = useState<string | null>(null)
  const [clipboard, setClipboard] = useState<Node | null>(null)
  
  // Undo/Redo state
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isUndoRedo, setIsUndoRedo] = useState(false)
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<any>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save to history (for undo/redo)
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (isUndoRedo) return
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push({ nodes: newNodes, edges: newEdges })
      // Keep max 50 history items
      if (newHistory.length > 50) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setHistoryIndex(prev => Math.min(prev + 1, 49))
  }, [historyIndex, isUndoRedo])

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedo(true)
      const prevState = history[historyIndex - 1]
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setHistoryIndex(prev => prev - 1)
      
      // Save positions to DB
      saveAllPositions(prevState.nodes)
      
      setTimeout(() => setIsUndoRedo(false), 100)
      
      toast({
        title: 'Undo',
        description: 'Perubahan dibatalkan',
      })
    }
  }, [history, historyIndex, setNodes, setEdges, toast])

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true)
      const nextState = history[historyIndex + 1]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex(prev => prev + 1)
      
      // Save positions to DB
      saveAllPositions(nextState.nodes)
      
      setTimeout(() => setIsUndoRedo(false), 100)
      
      toast({
        title: 'Redo',
        description: 'Perubahan dikembalikan',
      })
    }
  }, [history, historyIndex, setNodes, setEdges, toast])

  const calculateLevel = useCallback((memberId: string, allMembers: StructureMember[]): number => {
    const member = allMembers.find(m => m.id === memberId)
    if (!member || !member.parentId) return 0
    return 1 + calculateLevel(member.parentId, allMembers)
  }, [])

  const buildNodesAndEdges = useCallback((membersList: StructureMember[]) => {
    const newNodes: Node[] = membersList.map((member) => ({
      id: member.id,
      type: 'structureNode',
      position: { x: member.positionX, y: member.positionY },
      data: {
        id: member.id,
        jabatan: member.jabatan,
        nama: member.nama,
        nip: member.nip,
        fotoUrl: member.fotoUrl,
        level: calculateLevel(member.id, membersList),
      },
    }))

    const newEdges: Edge[] = membersList
      .filter(m => m.parentId)
      .map(m => ({
        id: `${m.parentId}-${m.id}`,
        source: m.parentId!,
        target: m.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      }))

    return { nodes: newNodes, edges: newEdges }
  }, [calculateLevel])

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(members)
    
    const needsLayout = members.length > 0 && members.every(m => m.positionX === 0 && m.positionY === 0)
    
    if (needsLayout) {
      const { nodes: layoutedNodes } = getLayoutedElements(newNodes, newEdges)
      setNodes(layoutedNodes)
      setEdges(newEdges)
      
      saveAllPositions(layoutedNodes)
      saveToHistory(layoutedNodes, newEdges)
    } else {
      setNodes(newNodes)
      setEdges(newEdges)
      saveToHistory(newNodes, newEdges)
    }
  }, [members, buildNodesAndEdges, setNodes, setEdges, saveToHistory])

  const saveAllPositions = async (nodesToSave: Node[]) => {
    try {
      await Promise.all(
        nodesToSave.map(node =>
          fetch(`/api/admin/structure/${node.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              positionX: node.position.x,
              positionY: node.position.y,
            }),
          })
        )
      )
    } catch (error) {
      console.error('Failed to save positions:', error)
    }
  }

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    // Multi-select dengan Shift+Click
    if (event.shiftKey) {
      setSelectedNodes(prev => {
        if (prev.includes(node.id)) {
          return prev.filter(id => id !== node.id)
        }
        return [...prev, node.id]
      })
    } else {
      setSelectedNode(node.id)
      setSelectedNodes([node.id])
      setContextMenuNode(node.id)
      
      const rect = reactFlowWrapper.current?.getBoundingClientRect()
      if (rect) {
        setToolbarPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    }
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedNodes([])
    setContextMenuNode(null)
  }, [])

  const handleNodesChangeWithSave: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    
    const positionChanges = changes.filter(c => c.type === 'position' && c.dragging === false)
    if (positionChanges.length > 0) {
      // Save to history
      setNodes(currentNodes => {
        saveToHistory(currentNodes, edges)
        return currentNodes
      })
      
      positionChanges.forEach(async (change) => {
        if (change.type === 'position' && change.position) {
          try {
            await fetch(`/api/admin/structure/${change.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                positionX: change.position.x,
                positionY: change.position.y,
              }),
            })
          } catch (error) {
            console.error('Failed to save position:', error)
          }
        }
      })
    }
  }, [onNodesChange, edges, saveToHistory, setNodes])

  const handleConnect: OnConnect = useCallback(async (connection: Connection) => {
    if (!connection.source || !connection.target) return
    
    if (connection.source === connection.target) {
      toast({
        title: 'Error',
        description: 'Tidak bisa menghubungkan node ke dirinya sendiri',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch(`/api/admin/structure/${connection.target}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: connection.source,
        }),
      })

      if (res.ok) {
        setEdges((eds) => addEdge(connection, eds))
        toast({
          title: 'Berhasil',
          description: 'Koneksi berhasil dibuat',
        })
        onRefresh()
      } else {
        throw new Error('Failed to connect')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal membuat koneksi',
        variant: 'destructive',
      })
    }
  }, [setEdges, toast, onRefresh])

  const handleZoomIn = () => {
    reactFlowInstance.current?.zoomIn()
  }

  const handleZoomOut = () => {
    reactFlowInstance.current?.zoomOut()
  }

  const handleFitView = () => {
    reactFlowInstance.current?.fitView({ padding: 0.2 })
  }

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeWithSave}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          reactFlowInstance.current = instance
        }}
        fitView
        minZoom={0.1}
        maxZoom={2}
        panOnDrag={isMobile ? [1, 2] : true}
        panOnScroll={!isMobile}
        zoomOnScroll={!isMobile}
        zoomOnPinch={isMobile}
        zoomOnDoubleClick={!isMobile}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        
        {!isMobile && <Controls />}
        
        {isMobile && (
          <Panel position="bottom-right" className="flex flex-col gap-2 mb-4 mr-4">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              className="bg-white shadow-lg hover:bg-slate-50"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              className="bg-white shadow-lg hover:bg-slate-50"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleFitView}
              className="bg-white shadow-lg hover:bg-slate-50"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </Panel>
        )}
      </ReactFlow>
      
      {selectedNode && !isMobile && (
        <FloatingToolbar
          nodeId={selectedNode}
          position={toolbarPosition}
          onEdit={() => {
            onEdit(selectedNode)
            setSelectedNode(null)
          }}
          onDelete={() => {
            onDelete(selectedNode)
            setSelectedNode(null)
          }}
        />
      )}
      
      {selectedNode && isMobile && (
        <div className="absolute bottom-20 left-0 right-0 mx-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 flex gap-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                onEdit(selectedNode)
                setSelectedNode(null)
              }}
            >
              Edit
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                onDelete(selectedNode)
                setSelectedNode(null)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
