
import React from 'react';
import { Stage, StageInfo } from '../types';
import { QuestionMarkIcon, BoxIcon, AppIcon, LockIcon, RestartIcon } from './icons/Icons';

interface HeaderProps {
  currentStage: Stage;
  setCurrentStage: (stage: Stage) => void;
  unlockedStages: Stage[];
  onRestart: () => void;
}

const stages: StageInfo[] = [
  { id: 'stage1', title: '1. O Início: Fazendo Perguntas', description: 'Interação direta e simples com a IA.' },
  { id: 'stage2', title: '2. Empacotando Prompts', description: 'Estruturando instruções para tarefas complexas.' },
  { id: 'stage3', title: '3. Materializando em Apps', description: 'Integrando a IA de forma invisível em aplicações.' },
];

const Header: React.FC<HeaderProps> = ({ currentStage, setCurrentStage, unlockedStages, onRestart }) => {
  const getIcon = (stageId: Stage, isUnlocked: boolean) => {
    if (!isUnlocked) return <LockIcon className="w-6 h-6 mr-3" />;
    switch (stageId) {
      case 'stage1': return <QuestionMarkIcon className="w-6 h-6 mr-3" />;
      case 'stage2': return <BoxIcon className="w-6 h-6 mr-3" />;
      case 'stage3': return <AppIcon className="w-6 h-6 mr-3" />;
    }
  };

  return (
    <header className="text-center relative">
       <button
        onClick={onRestart}
        className="absolute top-0 right-0 mt-1 mr-1 text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700 hover:border-cyan-500 z-10"
        aria-label="Recomeçar a jornada"
        title="Recomeçar a jornada"
      >
        <RestartIcon className="w-4 h-4" />
        <span>Recomeçar</span>
      </button>
      <h1 className="text-5xl md:text-6xl font-bold text-cyan-300">Evolução da IA Generativa</h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        Uma jornada interativa mostrando como nossa forma de interagir com IAs mudou desde 2022.
      </p>
      <nav className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 border border-cyan-700/50 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
        {stages.map((stage) => {
          const isUnlocked = unlockedStages.includes(stage.id);
          return (
            <button
              key={stage.id}
              onClick={() => isUnlocked && setCurrentStage(stage.id)}
              disabled={!isUnlocked}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center text-left p-3 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 ${
                currentStage === stage.id
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-lg border border-cyan-500/50'
                  : isUnlocked
                  ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  : 'text-gray-600 bg-gray-800/50 cursor-not-allowed'
              }`}
            >
              {getIcon(stage.id, isUnlocked)}
              <span className="font-semibold text-sm">{stage.title.split(':')[0]}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
