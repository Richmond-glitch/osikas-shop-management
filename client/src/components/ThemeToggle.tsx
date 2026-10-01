import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`relative flex items-center w-16 h-8 rounded-full px-1 transition-colors duration-300 ${
        isDark ? "bg-purple-900" : "bg-purple-200"
      }`}
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-purple-800" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
}
