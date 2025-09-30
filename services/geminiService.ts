
import { GoogleGenAI, Type } from "@google/genai";
import { Stage2TemplateData, Stage3AppData, OrchestrationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamChatCompletion = async (prompt: string, onChunk: (text: string) => void) => {
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    for await (const chunk of responseStream) {
        onChunk(chunk.text);
    }
};

export const analyzePromptForStage2 = async (prompt: string): Promise<Stage2TemplateData> => {
    const instruction = `Analise a seguinte solicitação do usuário. Sua tarefa é transformá-la em um "template de prompt" reutilizável, identificando a parte central da instrução (o template) e a parte que pode ser alterada (a variável). Responda no mesmo idioma da solicitação do usuário.

- promptTemplate: A instrução principal com um placeholder para a parte variável. O placeholder deve estar entre chaves, ex: "{tema}".
- variableName: Um nome em camelCase para a variável (ex: "temaDoPoema").
- variableLabel: Uma etiqueta amigável para o campo de entrada da variável (ex: "Tema do Poema").
- initialValue: O valor original da variável extraído da solicitação.

Solicitação do usuário: "${prompt}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: instruction,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    promptTemplate: { type: Type.STRING, description: "O template do prompt com um placeholder, ex: 'Crie uma imagem de {objeto}'." },
                    variableName: { type: Type.STRING, description: "O nome da variável em camelCase, ex: 'objeto'." },
                    variableLabel: { type: Type.STRING, description: "A etiqueta para o campo de formulário, ex: 'Objeto Principal'." },
                    initialValue: { type: Type.STRING, description: "O valor inicial da variável extraído do prompt do usuário." }
                },
                required: ["promptTemplate", "variableName", "variableLabel", "initialValue"]
            }
        }
    });

    return JSON.parse(response.text) as Stage2TemplateData;
};


export const generateAppInterfaceForStage3 = async (prompt: string): Promise<Stage3AppData> => {
    const instruction = `Analise o seguinte prompt estruturado de um usuário. Sua tarefa é projetar uma interface de mini-aplicativo simples para atender à solicitação. Descreva esta interface como um objeto JSON. Responda no mesmo idioma do prompt.
- appName: Um nome curto e descritivo para o aplicativo (ex: "Gerador de Receitas", "Criador de Poemas").
- appDescription: Uma frase descrevendo o que o aplicativo faz.
- fields: Uma matriz de objetos de campo de formulário. Extraia os parâmetros variáveis do prompt para criar esses campos. Cada campo deve ter 'name' (em camelCase, ex: 'mainIngredient'), 'label' (ex: 'Ingrediente Principal'), 'type' ('text', 'textarea', ou 'select'), e opcionalmente 'placeholder', 'options', ou 'defaultValue' (um valor inicial extraído diretamente do prompt).
- buttonText: O texto para o botão de envio (ex: "Gerar Receita", "Criar Poema").
- promptTemplate: Um modelo de string para reconstruir o prompt original usando os nomes dos campos do formulário. Use chaves para os placeholders, ex: "Crie uma receita de {cuisine} com {mainIngredient} de dificuldade {difficulty}".

Prompt Estruturado: "${prompt}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: instruction,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    appName: { type: Type.STRING },
                    appDescription: { type: Type.STRING },
                    fields: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                label: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['text', 'textarea', 'select'] },
                                placeholder: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                defaultValue: { type: Type.STRING }
                            },
                             required: ["name", "label", "type"]
                        }
                    },
                    buttonText: { type: Type.STRING },
                    promptTemplate: { type: Type.STRING }
                },
                required: ["appName", "appDescription", "fields", "buttonText", "promptTemplate"]
            }
        }
    });

    return JSON.parse(response.text) as Stage3AppData;
};

export const orchestrateMission = async (mission: string): Promise<OrchestrationResult> => {
    const instruction = `Você é um Agente Orquestrador de IA. Sua tarefa é receber uma missão complexa do usuário, quebrá-la em 3 a 4 subtarefas e delegá-las a agentes especialistas. Para cada subtarefa, defina o nome do agente, uma descrição da tarefa que ele está realizando, um resultado conciso que ele encontrou, e um tipo de ícone ('search', 'logistics', 'budget', 'writer') que represente a natureza da tarefa. Finalmente, compile todos os resultados em um relatório final coeso e bem escrito em primeira pessoa, como se você fosse o orquestrador apresentando a solução.

Missão do Usuário: "${mission}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: instruction,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                agentName: { type: Type.STRING, description: "Ex: 'Agente de Pesquisa'" },
                                taskDescription: { type: Type.STRING, description: "Ex: 'Pesquisando as principais trilhas...'" },
                                result: { type: Type.STRING, description: "Ex: 'Principais trilhas: Pai Inácio, Fumaça.'" },
                                agentIcon: { type: Type.STRING, enum: ['search', 'logistics', 'budget', 'writer'] }
                            },
                            required: ["agentName", "taskDescription", "result", "agentIcon"]
                        }
                    },
                    finalReport: { type: Type.STRING, description: "O relatório final consolidado." }
                },
                required: ["tasks", "finalReport"]
            }
        }
    });

    return JSON.parse(response.text) as OrchestrationResult;
};
