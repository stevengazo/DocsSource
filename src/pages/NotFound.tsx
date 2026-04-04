// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { AlertCircle, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleClick404 = () => {
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 2000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="text-center max-w-md">
        {/* Código 404 con easter egg */}
        <motion.h1
          className={`text-6xl font-bold ${isDark ? "text-white" : "text-gray-800"} cursor-pointer`}
          onClick={handleClick404}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
        >
          404
        </motion.h1>

        {/* Easter Egg */}
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center mt-4 text-3xl text-orange-400"
          >
            <Smile className="w-12 h-12 mr-2" />
            ¡Ups! Te perdiste
          </motion.div>
        )}

        {/* Mensaje */}
        <p className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Página no encontrada
        </p>

        <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}>
          La ruta que intentas acceder no existe o fue movida.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className={`inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-md text-sm font-medium transition ${
            isDark
              ? "bg-orange-500 text-gray-900 hover:bg-orange-400"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}