import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem('theme') as Theme | null;
            if (storedTheme) {
                return storedTheme;
            }
            // Check system preference
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        try {
            const root = document.documentElement;
            const isDark = theme === 'dark';
            
            // Use toggle with the 'force' boolean parameter for a more robust switch
            root.classList.toggle('dark', isDark);

            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Could not save theme state:", error);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};
