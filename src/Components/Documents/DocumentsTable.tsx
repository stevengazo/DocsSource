// src/Components/DocumentsTable.tsx
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import type { Document } from '../../types/Document';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentsTableProps {
  documents: Document[];
}

const DocumentsTable = ({ documents }: DocumentsTableProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900';
  const headerBg = isDark ? 'bg-gray-800' : 'bg-orange-50';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-orange-100';

  return (
    <div className={`overflow-x-auto rounded-xl shadow-sm ${bg} border ${borderColor} transition-colors`}>
      <table className="min-w-full divide-y divide-transparent">
        <thead className={`${headerBg} border-b border-transparent`}>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wide">Título</th>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wide">Última edición</th>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wide">Autor</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.id || index}
                onClick={() => navigate(`/editor/${doc.id}`)}
                className={`cursor-pointer transition ${hoverBg}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 text-sm">{doc.title || "Documento sin título"}</td>
                <td className="px-6 py-4 text-sm">{new Date(doc.updatedAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{doc.author || "Desconocido"}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;