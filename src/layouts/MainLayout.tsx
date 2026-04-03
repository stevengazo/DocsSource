// src/layouts/MainLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Home, FileText, Users, Settings, User, Sun, Moon } from "lucide-react"; // Agregamos Sun y Moon

export default function MainLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  // Define los íconos para cada ruta
  const iconsMap: Record<string, JSX.Element> = {
    "/": <Home className="w-4 h-4 mr-1" />,
    "/documents": <FileText className="w-4 h-4 mr-1" />,
    "/departaments": <Users className="w-4 h-4 mr-1" />,
    "/settings": <Settings className="w-4 h-4 mr-1" />,
    "/my-profile": <User className="w-4 h-4 mr-1" />,
  };

  const navItem = (path: string, label: string) => {
    const active = location.pathname === path;

    const baseText = active
      ? "text-white"
      : isDark
      ? "text-gray-300"
      : "text-gray-600";

    const bgColor = active
      ? "bg-orange-500"
      : "bg-gray-200 dark:bg-gray-700";

    return (
      <Link to={path} className="relative px-3 py-1.5 text-sm rounded-md flex items-center">
        {iconsMap[path]}
        <span className={`relative z-10 ${baseText}`}>{label}</span>

        {active && (
          <motion.div
            layoutId="nav-pill"
            className={`absolute inset-0 rounded-md ${bgColor}`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} min-h-screen flex flex-col`}>

      {/* Top Bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} h-14 border-b flex items-center justify-between px-6 sticky top-0 z-20`}
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className='text-orange-500 font-extrabold text-2xl'>
            DocuDan
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
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center justify-center"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
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