// src/Components/Documents/DocumentCard.tsx
import { useNavigate } from "react-router-dom";
import { Eye, Edit } from "lucide-react";
import type { Document } from "../../types/Document";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

interface DocumentCardProps {
  documents: Document[];
}

const DocumentCard = ({ documents }: DocumentCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Animación de entrada de cada card
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-2xl shadow p-4 flex flex-col justify-between transition hover:shadow-lg
            ${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
          `}
        >
          {/* Información del documento */}
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {doc.title || "Documento sin título"}
            </h3>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Autor: {doc.author || "Desconocido"}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Última actualización: {new Date(doc.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-auto">
            <motion.button
              onClick={() => navigate(`/document/${doc.id}`)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition
                ${isDark ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}
              `}
              title="Ver documento"
            >
              <Eye size={18} />
            </motion.button>
            <motion.button
              onClick={() => navigate(`/editor/${doc.id}`)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition
                ${isDark ? "bg-red-600 hover:bg-red-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
              `}
              title="Editar documento"
            >
              <Edit size={18} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentCard;