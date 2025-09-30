import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';

const nodeDefaults = {
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  style: {
    width: 180,
    textAlign: 'center',
  },
};

const allNodes: Record<string, Node> = {
  goal: {
    id: 'goal',
    type: 'input',
    data: { label: '🎯 Objetivo do Usuário' },
    position: { x: 250, y: 0 },
    ...nodeDefaults,
  },
  orchestrator: {
    id: 'orchestrator',
    data: { label: '🤖 Agente Orquestrador' },
    position: { x: 250, y: 120 },
    ...nodeDefaults,
  },
  researcher: {
    id: 'researcher',
    data: { label: '🔎 Agente de Pesquisa' },
    position: { x: 0, y: 240 },
    ...nodeDefaults,
  },
  analyzer: {
    id: 'analyzer',
    data: { label: '📊 Agente de Análise' },
    position: { x: 250, y: 240 },
    ...nodeDefaults,
  },
  synthesizer: {
    id: 'synthesizer',
    data: { label: '✍️ Agente de Síntese' },
    position: { x: 500, y: 240 },
    ...nodeDefaults,
  },
  result: {
    id: 'result',
    type: 'output',
    data: { label: '✅ Plano Concluído' },
    position: { x: 250, y: 360 },
    ...nodeDefaults,
    sourcePosition: Position.Bottom,
  },
};

const allEdges: Record<string, Edge> = {
  e1: { id: 'e-goal-orchestrator', source: 'goal', target: 'orchestrator', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  e2: { id: 'e-orchestrator-researcher', source: 'orchestrator', target: 'researcher', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  e3: { id: 'e-orchestrator-analyzer', source: 'orchestrator', target: 'analyzer', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  e4: { id: 'e-orchestrator-synthesizer', source: 'orchestrator', target: 'synthesizer', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  e5: { id: 'e-analyzer-result', source: 'analyzer', target: 'result', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
};

const proOptions = { hideAttribution: true };

const Flow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    // This effect ensures the view is adjusted whenever nodes change
    if (nodes.length > 0) {
      // Adding a short delay and duration makes the transition smoother
      const timer = setTimeout(() => fitView({ duration: 800, padding: 0.1 }), 50);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  useEffect(() => {
    setNodes([allNodes.goal]);

    const timer1 = setTimeout(() => {
      setNodes((nds) => [...nds, allNodes.orchestrator]);
      setEdges((eds) => [...eds, allEdges.e1]);
    }, 1000);

    const timer2 = setTimeout(() => {
      setNodes((nds) => [...nds, allNodes.researcher, allNodes.analyzer, allNodes.synthesizer]);
      setEdges((eds) => [allEdges.e1, allEdges.e2, allEdges.e3, allEdges.e4]);
    }, 2000);

    const timer3 = setTimeout(() => {
      setNodes((nds) => [...nds, allNodes.result]);
      setEdges((eds) => [allEdges.e1, allEdges.e2, allEdges.e3, allEdges.e4, allEdges.e5]);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      proOptions={proOptions}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      elementsSelectable={false}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

const AgentOrchestrationAnimation: React.FC = () => {
  return (
    <div style={{ height: '400px' }} className="bg-gray-900 border border-cyan-700/30 rounded-lg my-6">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
};

export default AgentOrchestrationAnimation;
