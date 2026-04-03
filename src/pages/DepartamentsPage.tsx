// src/pages/DepartamentPage.tsx
import { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useDocumentsContext } from "../context/DocumentsContext";

const DepartamentPage = () => {
  const { theme } = useTheme();
  const { documents } = useDocumentsContext();

  const [search, setSearch] = useState("");

  const isDark = theme === "dark";

  // 🔍 Filtrado de documentos
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [documents, search]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1
          className={`text-2xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Departamentos
        </h1>

        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          + Nuevo Departamento
        </button>
      </div>

      {/* Tarjetas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`p-5 rounded-2xl shadow ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-sm text-gray-400">Total Documentos</h2>
          <p className="text-3xl font-bold mt-2">{documents.length}</p>
        </div>

        <div
          className={`p-5 rounded-2xl shadow ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-sm text-gray-400">Resultados</h2>
          <p className="text-3xl font-bold mt-2">
            {filteredDocuments.length}
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl shadow ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-sm text-gray-400">Búsqueda activa</h2>
          <p className="text-lg mt-2">
            {search ? `"${search}"` : "Ninguna"}
          </p>
        </div>
      </section>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar documentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-3 rounded-xl outline-none transition ${
            isDark
              ? "bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
              : "bg-white border border-gray-300 placeholder-gray-400"
          }`}
        />
      </div>

      {/* Resultados */}
      <div
        className={`rounded-2xl shadow p-6 ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}
      >
        {filteredDocuments.length === 0 ? (
          <p className="text-sm text-gray-400">
            No se encontraron documentos.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredDocuments.map((doc) => (
              <li
                key={doc.id}
                className={`p-4 rounded-xl ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p className="font-medium">{doc.title}</p>
                {doc.description && (
                  <p className="text-sm text-gray-400">
                    {doc.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DepartamentPage;