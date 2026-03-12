export type QuestionType = 'text' | 'number' | 'multiple_choice';

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options?: string[]; // Para multiple choice
    optionsRaw?: string; // Para mantener el string sin procesar en la UI
}

export interface SurveyTemplate {
    id: string;
    title: string;
    questions: Question[];
}

export interface SurveyResponse {
    id: string;
    templateId: string;
    answers: Record<string, string | number>; // questionId -> respuesta
    timestamp: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    photos?: string[]; // Array de strings base64
}
