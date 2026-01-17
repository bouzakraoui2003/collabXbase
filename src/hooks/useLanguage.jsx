import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('fr'); // Default to French as in original

    useEffect(() => {
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.style.fontFamily = "'Noto Sans Arabic', sans-serif";
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.style.fontFamily = "'Inter', sans-serif";
        }
    }, [lang]);

    const t = (key) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
