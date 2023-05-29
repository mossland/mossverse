"use client";
import { Utils } from "@util/client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTheme = (e) => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="form-control">
      <label className="cursor-pointer label">
        <span className="mr-2 text-sm label-text whitespace-nowrap">{Utils.capitalize(theme ?? "")}</span>
        <input type="checkbox" className="toggle toggle-sm" checked={theme === "dark"} onChange={handleTheme} />
      </label>
    </div>
  );
};
