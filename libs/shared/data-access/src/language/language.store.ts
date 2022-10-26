import create from "zustand";
import i18n from "i18next";

export interface LanguageState {
  isOpen: boolean;
  toggleOpen: () => void;
  handleChange: (lang: string) => void;
}
export const useSetting = create<LanguageState>((set, get) => ({
  isOpen: false,
  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
  handleChange: (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    set({ isOpen: false });
  },
}));
