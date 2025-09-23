import React from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  MarkerType
} from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Estágio 1: Pergunta Direta' },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '2',
    data: { label: 'Estágio 2: Prompt Template' },
    position: { x: 250, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    data: { label: 'Estágio 3: App Gerado' },
    position: { x: 500, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Estágio 4: Futuro (Agentes)' },
    position: { x: 750, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

const proOptions = { hideAttribution: true };

const EvolutionGraph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: '200px' }} className="bg-gray-900 border border-cyan-700/30 rounded-lg my-6">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={proOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        elementsSelectable={false}
        minZoom={0.5}
        maxZoom={1}
      >
      </ReactFlow>
    </div>
  );
};

export default EvolutionGraph;