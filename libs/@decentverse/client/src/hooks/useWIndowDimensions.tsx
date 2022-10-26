import { useEffect } from "react";
import { gameStore } from "../stores";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  // const { innerHeight: width, innerWidth: height } = document.documentElement;

  return [width, height];
};

export const useWindowDimensions = () => {
  const screen = gameStore.use.screen();
  const changeScreenSize = gameStore.use.changeScreenSize();
  useEffect(() => {
    const handleResize = () => {
      changeScreenSize({ size: getWindowDimensions(), offset: [0, 0] });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screen.size;
};
