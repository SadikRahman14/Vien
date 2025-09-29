import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // run once on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const startDark = stored ? stored === "dark" : systemDark;

    document.documentElement.classList.toggle("dark", startDark);
    setIsDark(startDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg
                 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                 hover:scale-110 transition-transform"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
