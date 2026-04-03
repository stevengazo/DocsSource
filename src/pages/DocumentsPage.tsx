// src/pages/DocumentsPage.tsx
import { useCallback } from "react";
import DocumentsTable from "../Components/Documents/DocumentsTable";
import { useTheme } from "../context/ThemeContext";
import { useDocumentsContext } from "../context/DocumentsContext";

const DocumentsPage = () => {
  const { documents, addDocument } = useDocumentsContext();
  const { theme } = useTheme();

  const isDark = theme === "dark";

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

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1
          className={`text-2xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Documentos
        </h1>

        <button
          onClick={handleAddDocument}
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Nuevo Documento
        </button>
      </div>

      {/* Table Container */}
      <div
        className={`rounded-2xl shadow transition-colors ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white"
        }`}
      >
        <DocumentsTable documents={documents} />
      </div>

      {/* Empty State (opcional) */}
      {documents.length === 0 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          No hay documentos registrados.
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;