"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export const ThemeProvider = ({ children }) => {
  return <NextThemeProvider>{children}</NextThemeProvider>;
};
