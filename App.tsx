
import React, { useState } from 'react';
import Header from './components/Header';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import { Stage, JourneyState, Stage2TemplateData } from './types';
import { analyzePromptForStage2, generateAppInterfaceForStage3, streamChatCompletion } from './services/geminiService';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('stage1');
  const [unlockedStages, setUnlockedStages] = useState<Stage[]>(['stage1']);
  const [journeyState, setJourneyState] = useState<JourneyState>({
    stage1: { prompt: '', response: '', isComplete: false },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');

  // --- Restart Handler ---
  const handleRestart = () => {
    setCurrentStage('stage1');
    setUnlockedStages(['stage1']);
    setJourneyState({
        stage1: { prompt: '', response: '', isComplete: false },
    });
    setIsLoading(false);
    setIsTransitioning(false);
    setTransitionMessage('');
  };

  // --- Stage 1 Handlers ---
  const handleStage1PromptChange = (prompt: string) => {
    setJourneyState(prev => ({ ...prev, stage1: { ...prev.stage1, prompt, isComplete: false, response: '' } }));
  };

  const handleStage1Execute = async () => {
    if (!journeyState.stage1.prompt.trim()) return;
    setIsLoading(true);
    setJourneyState(prev => ({ ...prev, stage1: { ...prev.stage1, response: '', isComplete: false } }));
    try {
      await streamChatCompletion(journeyState.stage1.prompt, (chunk) => {
        setJourneyState(prev => ({ ...prev, stage1: { ...prev.stage1, response: prev.stage1.response + chunk } }));
      });
      setJourneyState(prev => ({ ...prev, stage1: { ...prev.stage1, isComplete: true } }));
    } catch (error) {
      console.error("Stage 1 execution failed:", error);
      alert("Falha ao comunicar com a IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStage1Complete = async () => {
    setIsTransitioning(true);
    setTransitionMessage('Analisando seu prompt para o Estágio 2...');
    try {
      const stage2Data = await analyzePromptForStage2(journeyState.stage1.prompt);
      const generatedPrompt = stage2Data.promptTemplate.replace(`{${stage2Data.variableName}}`, stage2Data.initialValue);
      setJourneyState(prev => ({
        ...prev,
        stage2: { 
            data: stage2Data, 
            variableValue: stage2Data.initialValue,
            generatedPrompt, 
            response: '', 
            isComplete: false 
        }
      }));
      setUnlockedStages(['stage1', 'stage2']);
      setCurrentStage('stage2');
    } catch (error) {
      console.error("Failed to transition to stage 2:", error);
      alert("Não foi possível analisar o prompt. Tente um prompt diferente.");
    } finally {
      setIsTransitioning(false);
    }
  };

  // --- Stage 2 Handlers ---
  const handleStage2VariableChange = (value: string) => {
    if (!journeyState.stage2) return;
    const { data } = journeyState.stage2;
    const generatedPrompt = data.promptTemplate.replace(`{${data.variableName}}`, value);
    setJourneyState(prev => ({
      ...prev,
      stage2: { ...prev.stage2!, variableValue: value, generatedPrompt, isComplete: false, response: '' }
    }));
  };

  const handleStage2Execute = async () => {
    if (!journeyState.stage2?.generatedPrompt.trim()) return;
    setIsLoading(true);
    setJourneyState(prev => ({ ...prev, stage2: { ...prev.stage2!, response: '', isComplete: false } }));
    try {
      await streamChatCompletion(journeyState.stage2.generatedPrompt, (chunk) => {
        setJourneyState(prev => ({ ...prev, stage2: { ...prev.stage2!, response: prev.stage2!.response + chunk } }));
      });
      setJourneyState(prev => ({ ...prev, stage2: { ...prev.stage2!, isComplete: true } }));
    } catch (error) {
      console.error("Stage 2 execution failed:", error);
      alert("Falha ao comunicar com a IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStage2Complete = async () => {
    if (!journeyState.stage2?.generatedPrompt) return;
    setIsTransitioning(true);
    setTransitionMessage('Gerando interface do aplicativo para o Estágio 3...');
    try {
      const appData = await generateAppInterfaceForStage3(journeyState.stage2.generatedPrompt);
      
      const initialFormState: Record<string, string> = {};
      appData.fields.forEach(field => {
        initialFormState[field.name] = field.defaultValue || '';
      });

      setJourneyState(prev => ({
        ...prev,
        stage3: { appData, formState: initialFormState, response: '', isComplete: false }
      }));
      setUnlockedStages(['stage1', 'stage2', 'stage3']);
      setCurrentStage('stage3');
    } catch (error) {
      console.error("Failed to transition to stage 3:", error);
      alert("Não foi possível gerar a interface para o próximo estágio. Tente ajustar o prompt.");
    } finally {
      setIsTransitioning(false);
    }
  };

  // --- Stage 3 Handlers ---
  const handleStage3FormChange = (formState: Record<string, string>) => {
     setJourneyState(prev => ({ ...prev, stage3: { ...prev.stage3!, formState } }));
  };

  const handleStage3Execute = async () => {
    if (!journeyState.stage3?.appData) return;
    const { appData, formState } = journeyState.stage3;

    let finalPrompt = appData.promptTemplate;
    for (const key in formState) {
        finalPrompt = finalPrompt.replace(`{${key}}`, formState[key]);
    }

    setIsLoading(true);
    setJourneyState(prev => ({ ...prev, stage3: { ...prev.stage3!, response: '', isComplete: false } }));
    try {
      await streamChatCompletion(finalPrompt, (chunk) => {
        setJourneyState(prev => ({ ...prev, stage3: { ...prev.stage3!, response: prev.stage3!.response + chunk } }));
      });
      setJourneyState(prev => ({ ...prev, stage3: { ...prev.stage3!, isComplete: true } }));
    } catch (error) {
        console.error("Stage 3 execution failed:", error);
        alert("Falha ao executar o aplicativo dinâmico.");
    } finally {
        setIsLoading(false);
    }
  };

  const renderStage = () => {
    if (isTransitioning) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px]">
                <LoadingSpinner />
                <p className="mt-4 text-cyan-300">{transitionMessage}</p>
            </div>
        );
    }

    switch (currentStage) {
      case 'stage1':
        return <Stage1 state={journeyState.stage1} onPromptChange={handleStage1PromptChange} onExecute={handleStage1Execute} onComplete={handleStage1Complete} isLoading={isLoading} />;
      case 'stage2':
        return journeyState.stage2 ? <Stage2 state={journeyState.stage2} onVariableChange={handleStage2VariableChange} onExecute={handleStage2Execute} onComplete={handleStage2Complete} isLoading={isLoading} /> : null;
      case 'stage3':
        return journeyState.stage3 ? <Stage3 state={journeyState.stage3} onFormChange={handleStage3FormChange} onExecute={handleStage3Execute} isLoading={isLoading} /> : null;
      default:
        return <Stage1 state={journeyState.stage1} onPromptChange={handleStage1PromptChange} onExecute={handleStage1Execute} onComplete={handleStage1Complete} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header 
          currentStage={currentStage} 
          setCurrentStage={setCurrentStage} 
          unlockedStages={unlockedStages} 
          onRestart={handleRestart}
        />
        <main className="mt-8">
          {renderStage()}
        </main>
      </div>
    </div>
  );
};

export default App;
