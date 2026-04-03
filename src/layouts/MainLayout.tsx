// src/layouts/MainLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItem = (path: string, label: string) => {
    const active = location.pathname === path;

    return (
      <Link to={path} className="relative px-3 py-1.5 text-sm">
        <span
          className={`relative z-10 ${active
            ? theme === "dark"
              ? "text-gray-900"
              : "text-white"
            : theme === "dark"
              ? "text-gray-300"
              : "text-gray-600"
            }`}
        >
          {label}
        </span>

        {/* Animated background */}
        {active && (
          <motion.div
            layoutId="nav-pill"
            className={`absolute inset-0 rounded-md ${theme === "dark" ? "bg-gray-200" : "bg-gray-900"
              }`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} min-h-screen flex flex-col`}>

      {/* Top Bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} h-14 border-b flex items-center justify-between px-6 sticky top-0 z-20`}
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className={`${theme === "dark" ? "text-gray-100" : "text-gray-800"} font-semibold`}>
            Mi App
          </span>

          <nav className="flex items-center gap-2">
            {navItem("/", "Inicio")}
            {navItem("/documents", "Mis Documentos")}
            {navItem("/departaments", "Departamentos")}
            {navItem("/settings", "Configuración")}
            {navItem("/my-profile", "Mi Perfil")}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-sm hover:text-blue-400 transition"
          >
            {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
          </button>

          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-gray-700">
            SG
          </div>
        </div>
      </motion.header>

      {/* Page Transition */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}