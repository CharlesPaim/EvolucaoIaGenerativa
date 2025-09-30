import React from 'react';
import { Stage } from '../../types';
import { QuestionMarkIcon, BoxIcon, AppIcon } from '../icons/Icons';

interface PromptJourneyProps {
  stage1Prompt?: string;
  stage2Prompt?: string;
  stage3Prompt?: string;
  currentStage: Stage;
}

const JourneyStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  prompt?: string;
  isActive: boolean;
}> = ({ icon, title, prompt, isActive }) => (
  <div className={`flex flex-col items-center text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full border-2 ${isActive ? 'border-cyan-500' : 'border-gray-600'} mb-2`}>
      {icon}
    </div>
    <h3 className="font-semibold text-sm text-cyan-300">{title}</h3>
    <div className="mt-2 text-xs text-gray-400 bg-gray-900/50 p-2 rounded-md h-24 w-full overflow-y-auto custom-scrollbar min-w-[150px]">
      <p className="font-mono break-words">{prompt || '...'}</p>
    </div>
  </div>
);

export const PromptJourney: React.FC<PromptJourneyProps> = ({
  stage1Prompt,
  stage2Prompt,
  stage3Prompt,
  currentStage,
}) => {
  return (
    <div className="mb-8 p-4 bg-gray-800/40 border border-cyan-700/20 rounded-lg">
      <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">A Jornada do Seu Prompt</h3>
      <div className="flex flex-col md:flex-row items-stretch justify-around gap-4 md:gap-2">
        <div className="flex-1">
          <JourneyStep
            icon={<QuestionMarkIcon className="w-6 h-6 text-cyan-400" />}
            title="1. Pergunta Direta"
            prompt={stage1Prompt}
            isActive={!!stage1Prompt}
          />
        </div>
        
        <div className="self-center text-center text-cyan-700 text-2xl font-mono hidden md:block mx-2">&rarr;</div>
        <div className="self-center text-center text-cyan-700 text-2xl font-mono md:hidden my-2">&darr;</div>

        <div className="flex-1">
          <JourneyStep
            icon={<BoxIcon className="w-6 h-6 text-cyan-400" />}
            title="2. Template Estruturado"
            prompt={stage2Prompt}
            isActive={['stage2', 'stage3', 'stage4'].includes(currentStage)}
          />
        </div>

        <div className="self-center text-center text-cyan-700 text-2xl font-mono hidden md:block mx-2">&rarr;</div>
        <div className="self-center text-center text-cyan-700 text-2xl font-mono md:hidden my-2">&darr;</div>

        <div className="flex-1">
          <JourneyStep
            icon={<AppIcon className="w-6 h-6 text-cyan-400" />}
            title="3. Chamada de App"
            prompt={stage3Prompt}
            isActive={['stage3', 'stage4'].includes(currentStage)}
          />
        </div>
      </div>
    </div>
  );
};
