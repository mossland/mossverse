// interface DebugConsoleProps

import { useLocale } from "@shared/data-access";
import { FloatButton } from "antd";

export const DebugConsole = () => {
  const { lang, setLang } = useLocale();
  return <FloatButton icon={lang} onClick={() => setLang(lang === "en" ? "ko" : "en")} />;
};
