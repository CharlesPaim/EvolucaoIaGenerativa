import React from 'react';
import { StageContainer } from './common/StageContainer';
import EvolutionGraph from './common/EvolutionGraph';
import AgentOrchestrationAnimation from './AgentOrchestrationAnimation';

interface Stage4Props {
    onRestart: () => void;
}

const Stage4: React.FC<Stage4Props> = ({ onRestart }) => {
    return (
        <StageContainer
            title="4. O Futuro: A IA como Agente"
            description="Você concluiu a jornada pela evolução da interação com a IA. Vamos recapitular e olhar para o futuro."
        >
            <div className="bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20 p-8 prose prose-invert max-w-none text-gray-300">
                <h3 className="text-cyan-300">Sua Jornada de Evolução:</h3>
                
                <EvolutionGraph />

                <ul>
                    <li>
                        <strong>Estágio 1: Conversa Direta</strong>
                        <p>Você começou com a forma mais fundamental de interação: uma pergunta, uma resposta. Simples, direto, mas exigindo que você formulasse a pergunta perfeita a cada vez.</p>
                    </li>
                    <li>
                        <strong>Estágio 2: Templates Reutilizáveis</strong>
                        <p>Em seguida, você viu como a IA pode entender a estrutura de uma solicitação, transformando-a em um template. Isso permitiu reutilizar a mesma lógica complexa, mudando apenas as variáveis, economizando tempo e esforço.</p>
                    </li>
                    <li>
                        <strong>Estágio 3: IA Integrada e Invisível</strong>
                        <p>No terceiro estágio, o template se materializou em um aplicativo. A complexidade da IA foi completamente abstraída por uma interface de usuário. A IA tornou-se uma ferramenta poderosa e invisível, trabalhando nos bastidores.</p>
                    </li>
                </ul>
                <h3 className="text-cyan-300 mt-6">O Próximo Salto: Agentes Autônomos</h3>
                <p>
                    O que vem a seguir? A próxima fronteira é a IA agindo como um <strong>agente autônomo</strong>. Para ilustrar como isso funciona, veja a simulação abaixo:
                </p>

                <AgentOrchestrationAnimation />

                <p>
                    Como você viu, um <strong>Agente Orquestrador</strong> central recebe um objetivo complexo. Ele então quebra a tarefa e delega as subtarefas para múltiplos <strong>Agentes Especialistas</strong> (como um para pesquisa, outro para análise de dados e um terceiro para escrever o relatório final). O orquestrador consolida os resultados para entregar a solução completa.
                </p>
                <p>
                    Isso permite que a IA execute missões de múltiplos passos, como "planeje minhas férias para o Japão dentro do meu orçamento" ou "lance uma campanha de marketing para o meu novo produto". A interação evolui de dar uma tarefa para delegar uma responsabilidade.
                </p>

                <div className="text-center mt-8">
                    <button
                        onClick={onRestart}
                        className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-md hover:bg-cyan-500 transition duration-200 text-lg"
                    >
                        Recomeçar a Jornada
                    </button>
                </div>
            </div>
        </StageContainer>
    );
};

export default Stage4;