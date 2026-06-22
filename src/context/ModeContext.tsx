import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface ModeContextType {
  tema: string;
  toggleTema: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("tema") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () =>
    setTema((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ModeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ModeProvider");
  return ctx;
}
