import { useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';

export type Language = 'en' | 'pa';

export const useLanguage = () => {
    const [language, setLanguage] = useState<Language>(() => {
        try {
            const storedLang = localStorage.getItem('language') as Language | null;
            return storedLang && ['en', 'pa'].includes(storedLang) ? storedLang : 'en';
        } catch {
            return 'en';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('language', language);
        } catch (error) {
            console.error("Could not save language state:", error);
        }
    }, [language]);

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
        let translation = translations[language]?.[key] || translations['en']?.[key] || key;
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }
        return translation;
    }, [language]);

    return { language, setLanguage, t };
};
