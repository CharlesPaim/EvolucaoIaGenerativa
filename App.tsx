
import React, { useState } from 'react';
import Header from './components/Header';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import { Stage, JourneyState } from './types';
import { analyzePromptForStage2, generateAppInterfaceForStage3, streamChatCompletion } from './services/geminiService';
import { TransitionScreen } from './components/common/TransitionScreen';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('stage1');
  const [unlockedStages, setUnlockedStages] = useState<Stage[]>(['stage1']);
  const [journeyState, setJourneyState] = useState<JourneyState>({
    stage1: { prompt: '', response: '', isComplete: false },
    metaPrompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionInfo, setTransitionInfo] = useState({ title: '', message: '' });


  // --- Restart Handler ---
  const handleRestart = () => {
    setCurrentStage('stage1');
    setUnlockedStages(['stage1']);
    setJourneyState({
        stage1: { prompt: '', response: '', isComplete: false },
        metaPrompt: '',
    });
    setIsLoading(false);
    setIsTransitioning(false);
    setTransitionInfo({ title: '', message: '' });
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
    const promptToIA = `Analise a seguinte solicitação do usuário. Sua tarefa é transformá-la em um "template de prompt" reutilizável, identificando a parte central da instrução (o template) e a parte que pode ser alterada (a variável). Responda no mesmo idioma da solicitação do usuário.

- promptTemplate: A instrução principal com um placeholder para a parte variável. O placeholder deve estar entre chaves, ex: "{tema}".
- variableName: Um nome em camelCase para a variável (ex: "temaDoPoema").
- variableLabel: Uma etiqueta amigável para o campo de entrada da variável (ex: "Tema do Poema").
- initialValue: O valor original da variável extraído da solicitação.

Solicitação do usuário: "${journeyState.stage1.prompt}"`;
    
    setJourneyState(prev => ({ ...prev, metaPrompt: promptToIA }));
    
    setTransitionInfo({
        title: 'Analisando seu prompt...',
        message: 'Para transformar sua pergunta em um template, nós não enviamos apenas a sua pergunta para a IA. Nós a envolvemos em uma instrução mais complexa, como esta:',
    });
    setIsTransitioning(true);
    
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
    
    const promptToIA = `Analise o seguinte prompt estruturado de um usuário. Sua tarefa é projetar uma interface de mini-aplicativo simples para atender à solicitação. Descreva esta interface como um objeto JSON. Responda no mesmo idioma do prompt.
- appName: Um nome curto e descritivo para o aplicativo (ex: "Gerador de Receitas", "Criador de Poemas").
- appDescription: Uma frase descrevendo o que o aplicativo faz.
- fields: Uma matriz de objetos de campo de formulário. Extraia os parâmetros variáveis do prompt para criar esses campos. Cada campo deve ter 'name' (em camelCase, ex: 'mainIngredient'), 'label' (ex: 'Ingrediente Principal'), 'type' ('text', 'textarea', ou 'select'), e opcionalmente 'placeholder', 'options', ou 'defaultValue' (um valor inicial extraído diretamente do prompt).
- buttonText: O texto para o botão de envio (ex: "Gerar Receita", "Criar Poema").
- promptTemplate: Um modelo de string para reconstruir o prompt original usando os nomes dos campos do formulário. Use chaves para os placeholders, ex: "Crie uma receita de {cuisine} com {mainIngredient} de dificuldade {difficulty}".

Prompt Estruturado: "${journeyState.stage2.generatedPrompt}"`;

    setJourneyState(prev => ({ ...prev, metaPrompt: promptToIA }));

    setTransitionInfo({
        title: 'Gerando interface do aplicativo...',
        message: 'A IA está projetando uma interface de usuário com base no seu prompt estruturado do Estágio 2.',
    });
    setIsTransitioning(true);
    
    try {
      const appData = await generateAppInterfaceForStage3(journeyState.stage2.generatedPrompt);
      
      const initialFormState: Record<string, string> = {};
      appData.fields.forEach(field => {
        initialFormState[field.name] = field.defaultValue || '';
      });

      // PATCH: The AI model may not consistently extract default values for all
      // fields. This logic uses the known variable from Stage 2 to fill in a
      // likely candidate field in Stage 3 if it was left empty.
      if (journeyState.stage2) {
        const stage2VarValue = journeyState.stage2.variableValue;
        const emptyTextFields = appData.fields.filter(f =>
          (f.type === 'textarea' || f.type === 'text') && !initialFormState[f.name]
        );

        if (emptyTextFields.length === 1) {
          const fieldToPatch = emptyTextFields[0];
          const isValueAlreadyPresent = Object.values(initialFormState).includes(stage2VarValue);
          if (!isValueAlreadyPresent) {
            initialFormState[fieldToPatch.name] = stage2VarValue;
          }
        }
      }

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

  const handleStage3Complete = () => {
    // FIX: Explicitly provide the type argument to `new Set()` to ensure TypeScript
    // correctly infers the resulting array as `Stage[]` instead of `string[]`.
    setUnlockedStages(prev => [...new Set<Stage>([...prev, 'stage4'])]);
    setCurrentStage('stage4');
  };

  const renderStage = () => {
    if (isTransitioning) {
        return <TransitionScreen 
            title={transitionInfo.title}
            message={transitionInfo.message}
            promptToIA={journeyState.metaPrompt || ''}
        />;
    }

    switch (currentStage) {
      case 'stage1':
        return <Stage1 state={journeyState.stage1} onPromptChange={handleStage1PromptChange} onExecute={handleStage1Execute} onComplete={handleStage1Complete} isLoading={isLoading} />;
      case 'stage2':
        return journeyState.stage2 ? <Stage2 state={journeyState.stage2} onVariableChange={handleStage2VariableChange} onExecute={handleStage2Execute} onComplete={handleStage2Complete} isLoading={isLoading} /> : null;
      case 'stage3':
        return journeyState.stage3 ? <Stage3 state={journeyState.stage3} onFormChange={handleStage3FormChange} onExecute={handleStage3Execute} onComplete={handleStage3Complete} isLoading={isLoading} /> : null;
      case 'stage4':
        return <Stage4 onRestart={handleRestart} />;
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
