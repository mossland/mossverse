"use client";
import { usePage } from "@shared/client";

export const DebugConsole = () => {
  const { lang, setLang } = usePage();
  return (
    <button
      className="fixed btn btn-circle bottom-10 right-6 drop-shadow-lg"
      onClick={() => setLang(lang === "en" ? "ko" : "en")}
    >
      {lang}
    </button>
  );
};
