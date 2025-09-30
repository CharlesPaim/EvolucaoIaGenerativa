export type Stage = 'stage1' | 'stage2' | 'stage3' | 'stage4';

export interface StageInfo {
  id: Stage;
  title: string;
  // FIX: Add 'description' property to match its usage in components/Header.tsx
  description: string;
}

// --- State for each Stage ---

export interface Stage1State {
    prompt: string;
    response: string;
    isComplete: boolean;
}

export interface Stage2TemplateData {
    promptTemplate: string;
    variableName: string;
    variableLabel: string;
    initialValue: string;
}

export interface Stage2State {
    data: Stage2TemplateData;
    variableValue: string; // The current value of the input field
    generatedPrompt: string;
    response: string;
    isComplete: boolean;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: string[];
    defaultValue?: string;
}

export interface Stage3AppData {
    appName: string;
    appDescription: string;
    fields: FormField[];
    buttonText: string;
    promptTemplate: string;
}

export interface Stage3State {
    appData?: Stage3AppData;
    formState: Record<string, string>;
    response: string;
    isComplete: boolean;
}

// --- Stage 4 Agent Orchestration Types ---
export type AgentIconType = 'search' | 'logistics' | 'budget' | 'writer';

export interface SpecialistTask {
    agentName: string;
    taskDescription: string;
    result: string;
    agentIcon: AgentIconType;
}

export interface OrchestrationResult {
    tasks: SpecialistTask[];
    finalReport: string;
}


// --- Overall Journey State ---

export interface JourneyState {
    stage1: Stage1State;
    stage2?: Stage2State;
    stage3?: Stage3State;
    metaPrompt?: string;
}