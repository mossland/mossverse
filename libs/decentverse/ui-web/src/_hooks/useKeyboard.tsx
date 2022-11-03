import { MutableRefObject, useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import { isMobile } from "react-device-detect";

export interface KeyboardProps {
  keyState: MutableRefObject<gql.Keyboard>;
  lockState: MutableRefObject<boolean>;
}

export const useKeyboard = ({ keyState, lockState }: KeyboardProps) => {
  const keyboard = store.game.use.keyboard();
  const keyLock = store.game.use.keyLock();
  const setKey = store.game.use.setKey();
  const lockKey = store.game.use.lockKey();

  useEffect(() => {
    const handleFocus = () => lockKey(false);
    const handleBlur = () => {
      lockKey(true);
      store.game.setState({
        keyboard: { ...gql.initialKeyboard },
      });
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat || lockState.current) return;
      const code: gql.Key = event.code;
      const key = gql.keyMap[code];
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
    // if (keyLock) keyState.current = gql.keyboard;
  }, [keyLock]);
};
