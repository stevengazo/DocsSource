// src/pages/DocumentsPage.tsx
import { useCallback, useState, useMemo } from "react";
import DocumentsTable from "../Components/Documents/DocumentsTable";
import DocumentCard from "../Components/Documents/DocumentCard";
import { useTheme } from "../context/ThemeContext";
import { useDocumentsContext } from "../context/DocumentsContext";
import { PlusCircle, Table, Grid } from "lucide-react"; // Iconos lucide
import { motion, AnimatePresence } from "framer-motion";

const DocumentsPage = () => {
  const { documents, addDocument } = useDocumentsContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards"); // cards por defecto
  const [search, setSearch] = useState("");

  const handleAddDocument = useCallback(() => {
    addDocument(
      `Documento ${documents.length + 1}`,
      "",
      {
        type: "root",
        version: 1,
        format: "",
        indent: 0,
        direction: null,
        children: [],
      }
    );
  }, [documents.length, addDocument]);

  // Filtrar documentos según búsqueda
  const filteredDocuments = useMemo(() => {
    const term = search.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        doc.author.toLowerCase().includes(term)
    );
  }, [documents, search]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          Documentos
        </h1>

        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          <button
            onClick={() =>
              setViewMode(viewMode === "cards" ? "table" : "cards")
            }
            className={`p-2 rounded-lg flex items-center gap-1 transition ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            title="Cambiar vista"
          >
            {viewMode === "cards" ? <Table size={18} /> : <Grid size={18} />}
            {viewMode === "cards" ? "Tabla" : "Cards"}
          </button>

          {/* Botón nuevo documento */}
          <button
            onClick={handleAddDocument}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition
              ${isDark ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
            `}
          >
            <PlusCircle className="w-5 h-5" />
            Nuevo Documento
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 px-3 py-2 rounded-lg border transition ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Contenido: Cards o Tabla con animación */}
      <AnimatePresence mode="wait">
        {filteredDocuments.length > 0 ? (
          viewMode === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentCard documents={filteredDocuments} />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl shadow transition-colors ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <DocumentsTable documents={filteredDocuments} />
            </motion.div>
          )
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 text-center text-sm transition-colors ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No hay documentos registrados.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;