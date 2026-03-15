import { Moon, Sun } from "lucide-react";
import { Button } from "@/Shared/components/ui/button";
import { useTheme } from "@/Shared/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="transition-colors"
    >
      {theme === "light" ? (
        <Sun className="size-[1.2rem] transition-all" />
      ) : (
        <Moon className="size-[1.2rem] transition-all" />
      )}
    </Button>
  );
}
