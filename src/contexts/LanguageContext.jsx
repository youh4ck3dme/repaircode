/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

import skStrings from "../../locales/sk.json";
import enStrings from "../../locales/en.json";

const LOCALES = { sk: skStrings, en: enStrings };
const STORAGE_KEY = "repaircode_lang";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "sk" ? stored : "sk";
  });

  const t = useCallback(
    (keyPath) => {
      const keys = keyPath.split(".");
      let value = LOCALES[lang];
      for (const key of keys) {
        if (value == null) return keyPath;
        value = value[key];
      }
      return value ?? keyPath;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    const next = lang === "sk" ? "en" : "sk";
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};

export default LanguageContext;
