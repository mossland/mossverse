import { MutableRefObject, useEffect } from "react";
import { gameStore, types, initialKeyboard } from "../stores";
import { isMobile } from "react-device-detect";

export interface KeyboardProps {
  keyState: MutableRefObject<types.Keyboard>;
  lockState: MutableRefObject<boolean>;
}

export const useKeyboard = ({ keyState, lockState }: KeyboardProps) => {
  const keyboard = gameStore.use.keyboard();
  const keyLock = gameStore.use.keyLock();
  const setKey = gameStore.use.setKey();
  const lockKey = gameStore.use.lockKey();

  useEffect(() => {
    const handleFocus = () => lockKey(false);
    const handleBlur = () => {
      lockKey(true);
      gameStore.setState({
        keyboard: { ...initialKeyboard },
      });
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat || lockState.current) return;
      const code: types.Key = event.code;
      const key = types.keyMap[code];
      if (!key) return;
      if (isMobile && key !== "interaction") return;
      else if (keyState.current[key] === state) return;
      keyState.current[key] = state;
      setKey(key, state);
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
  useEffect(() => {
    keyState.current = keyboard;
  }, [keyboard]);
  useEffect(() => {
    lockState.current = keyLock;
    // if (keyLock) keyState.current = types.keyboard;
  }, [keyLock]);
};
