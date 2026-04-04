// src/components/Documents/DocumentHistoryMock.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, RotateCw, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Version {
  id: string;
  updatedAt: Date;
  author: string;
  comment?: string;
  content?: any;
}

const MOCK_VERSIONS: Version[] = [
  { id: "v1", updatedAt: new Date("2026-04-01T10:00:00"), author: "Steven", comment: "Versión inicial" },
  { id: "v2", updatedAt: new Date("2026-04-02T14:30:00"), author: "Luis", comment: "Correcciones menores" },
  { id: "v3", updatedAt: new Date("2026-04-03T09:15:00"), author: "Ana", comment: "Actualización de secciones" },
];

const DocumentHistory = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [versions, setVersions] = useState<Version[]>(MOCK_VERSIONS);
  const [newComment, setNewComment] = useState("");



  const handleViewVersion = (version: Version) => {
    alert(`Viendo versión:\nID: ${version.id}\nAutor: ${version.author}\nComentario: ${version.comment}`);
  };



  return (
    <div className={`my-4 rounded-2xl flex flex-col gap-6 p-4 transition-colors
      ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      

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
                    {version.updatedAt.toLocaleString()} - {version.author}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewVersion(version)}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                    title="Ver versión"
                  >
                    <Eye size={16} />
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