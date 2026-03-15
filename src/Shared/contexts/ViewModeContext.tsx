import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface ViewModeContextValue {
  viewAsStudent: boolean;
  setViewAsStudent: (value: boolean) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewAsStudent, setViewAsStudent] = useState(false);
  return (
    <ViewModeContext.Provider value={{ viewAsStudent, setViewAsStudent }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextValue {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
