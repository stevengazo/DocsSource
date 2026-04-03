import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, RotateCw, Plus } from "lucide-react";
import type { Document } from "../../types/Document";
import { useTheme } from "../../context/ThemeContext";

interface Version {
  id: string;
  updatedAt: Date;
  author: string;
  comment?: string;
  content: any;
}

interface DocumentHistoryProps {
  versions: Version[];
  onViewVersion: (version: Version) => void;
  onRestoreVersion: (version: Version) => void;
}

const DocumentHistory = ({ versions, onViewVersion, onRestoreVersion }: DocumentHistoryProps) => {
  const [newComment, setNewComment] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleAddVersion = () => {
    if (!newComment.trim()) return;
    alert(`Nueva versión confirmada: "${newComment}"`);
    setNewComment("");
  };

  return (
    <div
      className={`my-2 rounded-2xl flex flex-col gap-4 transition-colors
        ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Campo de nueva versión */}
      <div className="flex flex-col gap-2">
        <h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>Nueva versión</h3>
        <div className="flex flex-row gap-1.5 items-center">
          <input
            type="text"
            placeholder="Comentario para la nueva versión..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded border transition
              ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
          />
          <button
            onClick={handleAddVersion}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition relative group"
          >
            <Plus size={16} />
            Confirmar
            {/* Tooltip */}
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Agregar nueva versión
            </span>
          </button>
        </div>
      </div>

      {/* Historial de versiones */}
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-800"}`}>Historial de versiones</h3>
        <ul className="flex flex-col gap-2">
          <AnimatePresence>
            {versions.map((version) => (
              <motion.li
                key={version.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className={`flex justify-between items-center p-3 rounded-lg transition cursor-pointer
                  ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {version.comment || "Sin comentario"}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {new Date(version.updatedAt).toLocaleString()} - {version.author}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewVersion(version)}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                    title="Ver versión"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onRestoreVersion(version)}
                    className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                    title="Restaurar versión"
                  >
                    <RotateCw size={16} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default DocumentHistory;