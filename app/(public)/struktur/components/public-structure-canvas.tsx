"use client"

import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StructureNode from '@/app/admin/struktur/components/structure-node'
import { getLayoutedElements } from '@/lib/structure-layout'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

type PublicStructureCanvasProps = {
  members: StructureMember[]
}

const nodeTypes = {
  structureNode: StructureNode,
}

export default function PublicStructureCanvas({ members }: PublicStructureCanvasProps) {
  const [nodes, setNodes] = useNodesState<Node>([])
  const [edges, setEdges] = useEdgesState<Edge>([])
  const [isMobile, setIsMobile] = useState(false)
  const reactFlowInstance = useRef<any>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      draggable: false,
      selectable: false,
      connectable: false,
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
        selectable: false,
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
    } else {
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [members, buildNodesAndEdges, setNodes, setEdges])

  const handleZoomIn = () => {
    reactFlowInstance.current?.zoomIn()
  }

  const handleZoomOut = () => {
    reactFlowInstance.current?.zoomOut()
  }

  const handleFitView = () => {
    reactFlowInstance.current?.fitView({ padding: 0.15 })
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onInit={(instance) => {
          reactFlowInstance.current = instance
        }}
        panOnDrag={isMobile ? [1, 2] : false}
        zoomOnScroll={false}
        zoomOnPinch={isMobile}
        zoomOnDoubleClick={false}
        preventScrolling={!isMobile}
        fitView
        fitViewOptions={{
          padding: 0.15,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1,
        }}
        minZoom={0.3}
        maxZoom={1}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        
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
    </div>
  )
}
