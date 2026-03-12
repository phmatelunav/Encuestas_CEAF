import React, { createContext, useContext, useState, useEffect } from 'react';
import { SurveyTemplate, SurveyResponse } from '../types';

interface SurveyContextType {
    templates: SurveyTemplate[];
    responses: SurveyResponse[];
    addTemplate: (template: SurveyTemplate) => void;
    updateTemplate: (id: string, updatedTemplate: SurveyTemplate) => void;
    deleteTemplate: (id: string) => void;
    addResponse: (response: SurveyResponse) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [templates, setTemplates] = useState<SurveyTemplate[]>(() => {
        const saved = localStorage.getItem('templates');
        return saved ? JSON.parse(saved) : [];
    });

    const [responses, setResponses] = useState<SurveyResponse[]>(() => {
        const saved = localStorage.getItem('responses');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('templates', JSON.stringify(templates));
    }, [templates]);

    useEffect(() => {
        localStorage.setItem('responses', JSON.stringify(responses));
    }, [responses]);

    const addTemplate = (template: SurveyTemplate) => {
        setTemplates(prev => [...prev, template]);
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        // Opcional: eliminar respuestas asociadas
        // setResponses(prev => prev.filter(r => r.templateId !== id));
    };

    const updateTemplate = (id: string, updatedTemplate: SurveyTemplate) => {
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
    };

    const addResponse = (response: SurveyResponse) => {
        setResponses(prev => [...prev, response]);
    };

    return (
        <SurveyContext.Provider value={{ templates, responses, addTemplate, updateTemplate, deleteTemplate, addResponse }}>
            {children}
        </SurveyContext.Provider>
    );
};

export const useSurveyContext = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurveyContext must be used within a SurveyProvider');
    }
    return context;
};
