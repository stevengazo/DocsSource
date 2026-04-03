import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '../Components/Editor/Editor';
import type { Document } from '../types/Document';
import type { RootNode } from '../types/DocumentNodes';
import DocumentInfo from '../Components/Documents/DocumentInfo';
import { useTheme } from '../context/ThemeContext';
import DocumentHistory from '../Components/Documents/DocumentHistory';

const mockVersions = [
  { id: "1", updatedAt: new Date(), author: "Steven", comment: "Versión inicial", content: {} },
  { id: "2", updatedAt: new Date(), author: "Steven", comment: "Agregado sección de resumen", content: {} },
  { id: "3", updatedAt: new Date(), author: "Steven", comment: "Corrección de typos", content: {} },
];


export default function EditorPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [collapsed, setCollapsed] = useState(false);

  const [document, setDocument] = useState<Document>({
    id: 'local-doc',
    title: '',
    author: '',
    description: '',
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleUpdateDocument = (updatedContent: RootNode) => {
    setDocument({
      ...document,
      content: updatedContent,
      updatedAt: new Date(),
    });
  };

  return (
    <div
      className={`
        h-screen-85 flex flex-row
        ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}
      `}
    >
      {/* Panel lateral */}
      <motion.div
        className={`
          px-4 py-6 border-r
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}
        animate={{ width: collapsed ? 0 : '30%' }}
        initial={{ width: '30%' }}
        transition={{ duration: 0.4 }}
      >
        {!collapsed && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">
                Información del Documento
              </h1>

              <button
                onClick={() => setCollapsed(true)}
                className={`
                  text-sm px-2 py-1 rounded transition
                  ${isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                `}
              >
                Ocultar
              </button>
            </div>

            <div>
              <DocumentInfo doc={document} />

              <DocumentHistory
                versions={mockVersions}
                onViewVersion={(v) => console.log("Ver:", v)}
                onRestoreVersion={(v) => console.log("Restaurar:", v)}
              />

            </div>


          </>
        )}
      </motion.div>

      {/* Editor */}
      <motion.div
        className="flex flex-col justify-center px-4 py-6 gap-4"
        animate={{
          width: collapsed ? '100%' : '70%',
          margin: collapsed ? '0 auto' : '0',
        }}
        initial={{ width: '70%' }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-end mb-2">
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className={`
                text-sm px-2 py-1 rounded transition
                ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
              `}
            >
              Mostrar información
            </button>
          )}
        </div>

        <Editor />
      </motion.div>
    </div>
  );
}