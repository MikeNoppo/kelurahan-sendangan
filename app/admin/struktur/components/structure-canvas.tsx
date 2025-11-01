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
import { ZoomIn, ZoomOut, Maximize2, Copy, Trash2, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type StructureMember = {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  fotoUrl: string | null
  positionX: number
  positionY: number
  parentId: string | null
  isDraft: boolean
  publishedAt: Date | null
}

type StructureCanvasProps = {
  members: StructureMember[]
  onRefresh: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPositionChange?: () => void
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
  onPositionChange,
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
  const [showShortcuts, setShowShortcuts] = useState(false)
  
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
        isDraft: member.isDraft,
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
      
      // Mark as unpublished
      onPositionChange?.()
      
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
  }, [onNodesChange, edges, saveToHistory, setNodes, onPositionChange])

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

  // Copy node to clipboard
  const handleCopy = useCallback(() => {
    if (selectedNode) {
      const node = nodes.find(n => n.id === selectedNode)
      if (node) {
        setClipboard(node)
        toast({
          title: 'Copied',
          description: 'Node telah disalin ke clipboard',
        })
      }
    }
  }, [selectedNode, nodes, toast])

  // Paste node from clipboard
  const handlePaste = useCallback(async () => {
    if (!clipboard) return

    try {
      const newNode = {
        jabatan: clipboard.data.jabatan,
        nama: `${clipboard.data.nama} (Copy)`,
        nip: clipboard.data.nip || '',
        parentId: clipboard.data.parentId || null,
      }

      const res = await fetch('/api/admin/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNode),
      })

      if (res.ok) {
        toast({
          title: 'Berhasil',
          description: 'Node berhasil dipaste',
        })
        onRefresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal paste node',
        variant: 'destructive',
      })
    }
  }, [clipboard, toast, onRefresh])

  // Duplicate node (from context menu)
  const handleDuplicate = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    try {
      const newNode = {
        jabatan: node.data.jabatan,
        nama: `${node.data.nama} (Copy)`,
        nip: node.data.nip || '',
        parentId: members.find(m => m.id === nodeId)?.parentId || null,
      }

      const res = await fetch('/api/admin/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNode),
      })

      if (res.ok) {
        toast({
          title: 'Berhasil',
          description: 'Node berhasil diduplikasi',
        })
        onRefresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal duplikasi node',
        variant: 'destructive',
      })
    }
  }, [nodes, members, toast, onRefresh])

  // Delete selected nodes
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length === 1 && selectedNode) {
      onDelete(selectedNode)
    } else if (selectedNodes.length > 1) {
      // Bulk delete
      toast({
        title: 'Bulk Delete',
        description: `Menghapus ${selectedNodes.length} nodes...`,
      })
      selectedNodes.forEach(nodeId => onDelete(nodeId))
    }
    setSelectedNode(null)
    setSelectedNodes([])
  }, [selectedNode, selectedNodes, onDelete, toast])

  // Select all nodes
  const handleSelectAll = useCallback(() => {
    const allNodeIds = nodes.map(n => n.id)
    setSelectedNodes(allNodeIds)
    toast({
      title: 'Select All',
      description: `${allNodeIds.length} nodes selected`,
    })
  }, [nodes, toast])

  // Move selected node with arrow keys
  const moveSelectedNode = useCallback((dx: number, dy: number) => {
    if (!selectedNode) return

    setNodes(nds =>
      nds.map(node => {
        if (node.id === selectedNode) {
          const newPosition = {
            x: node.position.x + dx,
            y: node.position.y + dy,
          }
          
          // Save to DB
          fetch(`/api/admin/structure/${node.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              positionX: newPosition.x,
              positionY: newPosition.y,
            }),
          }).catch(console.error)

          return { ...node, position: newPosition }
        }
        return node
      })
    )
    
    // Save to history
    setNodes(currentNodes => {
      saveToHistory(currentNodes, edges)
      return currentNodes
    })
  }, [selectedNode, setNodes, edges, saveToHistory])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl+Z - Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        handleRedo()
      }

      // Ctrl+C - Copy
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        handleCopy()
      }

      // Ctrl+V - Paste
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault()
        handlePaste()
      }

      // Ctrl+A - Select All
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        handleSelectAll()
      }

      // Delete - Delete selected
      if (e.key === 'Delete' && (selectedNode || selectedNodes.length > 0)) {
        e.preventDefault()
        handleDeleteSelected()
      }

      // Escape - Deselect
      if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedNode(null)
        setSelectedNodes([])
      }

      // Arrow keys - Move selected node
      const moveDistance = e.shiftKey ? 20 : 5
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveSelectedNode(0, -moveDistance)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveSelectedNode(0, moveDistance)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveSelectedNode(-moveDistance, 0)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveSelectedNode(moveDistance, 0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    handleSelectAll,
    handleDeleteSelected,
    moveSelectedNode,
    selectedNode,
    selectedNodes,
  ])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                selected: selectedNodes.includes(node.id),
              }))}
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
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={!isMobile}
              multiSelectionKeyCode="Shift"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
              
              {/* Zoom controls - always visible */}
              <Controls 
                showZoom={true}
                showFitView={true}
                showInteractive={false}
                position="bottom-right"
              />
              
              {/* Mobile-only custom controls */}
              {isMobile && (
                <Panel position="bottom-right" className="flex flex-col gap-2 mb-20 mr-4">
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
              
              {/* Keyboard Shortcuts Button */}
              {!isMobile && (
                <Panel position="top-right" className="mt-2 mr-2">
                  <Sheet open={showShortcuts} onOpenChange={setShowShortcuts}>
                    <SheetTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-slate-50"
                      >
                        <Keyboard className="h-4 w-4 mr-2" />
                        Shortcuts
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 sm:w-80 px-6">
                      <SheetHeader className="px-0">
                        <SheetTitle>Keyboard Shortcuts</SheetTitle>
                        <SheetDescription>
                          Gunakan shortcuts untuk navigasi lebih cepat
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6 px-0">
                        {/* Undo/Redo */}
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-slate-700">Undo/Redo</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Undo</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Ctrl+Z</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Redo</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Ctrl+Y</kbd>
                            </div>
                          </div>
                        </div>

                        {/* Copy/Paste */}
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-slate-700">Copy/Paste</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Copy</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Ctrl+C</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Paste</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Ctrl+V</kbd>
                            </div>
                          </div>
                        </div>

                        {/* Selection */}
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-slate-700">Selection</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Multi-select</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Shift+Click</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Select All</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Ctrl+A</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Deselect</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Esc</kbd>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-slate-700">Actions</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Delete</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Del</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Duplicate</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Right-click</kbd>
                            </div>
                          </div>
                        </div>

                        {/* Movement */}
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-slate-700">Movement</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Move (5px)</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">↑ ↓ ← →</kbd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-600">Move (20px)</span>
                              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono whitespace-nowrap">Shift+Arrow</kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-64">
          {contextMenuNode && (
            <>
              <ContextMenuItem onClick={() => handleDuplicate(contextMenuNode)}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate Node</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onEdit(contextMenuNode)}>
                <span className="mr-2">✏️</span>
                <span>Edit Node</span>
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => onDelete(contextMenuNode)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Node</span>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
      
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
