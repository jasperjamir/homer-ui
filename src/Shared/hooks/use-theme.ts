import { useEffect } from "react";

/** App is dark-only. No theme toggle. */
export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  }, []);

  return {
    theme: "dark" as const,
    setTheme: () => {},
    toggleTheme: () => {},
  };
}
