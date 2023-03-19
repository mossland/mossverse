import { MutableRefObject, useEffect } from "react";
import { st, gql } from "@decentverse/data-access";
import { isMobile } from "react-device-detect";

export const useKeyboard = () => {
  useEffect(() => {
    const handleFocus = () => st.set({ keyLock: false });
    const handleBlur = () => st.set({ keyLock: true, keyboard: gql.defaultKeyboard });
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat || st.get().keyLock) return;
      const code: gql.Key = event.code;
      const key = gql.keyMap[code];
      if (!key) return;
      if (isMobile && key !== "webview") return;
      if (st.get().keyboard[key] === state) return;
      st.set((s) => (s.keyboard[key] = state));
    };
    const handleKeyDown = (event: any) => handleKeyEvent(event, true);
    const handleKeyUp = (event: any) => handleKeyEvent(event, false);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("focus", handleFocus);
      document.removeEventListener("blur", handleBlur);
      // if (!isMobile) {
      // };
    };
  }, []);
};
