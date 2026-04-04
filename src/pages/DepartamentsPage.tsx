// src/pages/DepartamentPage.tsx
import { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import DocumentCard from "../Components/Documents/DocumentCard";
import DocumentsTable from "../Components/Documents/DocumentsTable";
import { Grid, List } from "lucide-react";
import type { Document } from "../types/Document";
import type { RootNode } from "../types/DocumentNodes";

// Datos de prueba
const mockDepartments = ["IT", "Recursos Humanos", "Marketing"];
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Planilla Enero",
    author: "Steven",
    description: "Planilla de pagos de enero 2026",
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Informe Q1",
    author: "Ana",
    description: "Informe de resultados del primer trimestre",
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Manual de Procedimientos",
    author: "Luis",
    description: "Documento interno de procedimientos",
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Reporte de Incidencias",
    author: "Marta",
    description: "Reporte semanal de incidencias",
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DepartamentPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [documents] = useState<Document[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedDepartment, setSelectedDepartment] = useState(mockDepartments[0]);

  // Filtrado de documentos por búsqueda
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
        <h1 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          Departamentos
        </h1>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          + Nuevo Departamento
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-5 rounded-2xl shadow ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
          <h2 className="text-sm text-gray-400">Total Documentos</h2>
          <p className="text-3xl font-bold mt-2">{documents.length}</p>
        </div>

        <div className={`p-5 rounded-2xl shadow ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
          <h2 className="text-sm text-gray-400">Resultados</h2>
          <p className="text-3xl font-bold mt-2">{filteredDocuments.length}</p>
        </div>

        <div className={`p-5 rounded-2xl shadow ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
          <h2 className="text-sm text-gray-400">Búsqueda activa</h2>
          <p className="text-lg mt-2">{search ? `"${search}"` : "Ninguna"}</p>
        </div>
      </section>

      {/* Departamentos + Documents Panel */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Departamentos */}
        <div className={`w-full md:w-1/4 border rounded p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-lg font-semibold mb-2">Departamentos</h3>
          <ul className="flex flex-col gap-1">
            {mockDepartments.map((dep) => (
              <li
                key={dep}
                className={`cursor-pointer px-2 py-1 rounded transition ${
                  dep === selectedDepartment
                    ? "bg-orange-500 text-white"
                    : isDark
                      ? "hover:bg-gray-700 text-gray-100"
                      : "hover:bg-gray-100 text-gray-900"
                }`}
                onClick={() => setSelectedDepartment(dep)}
              >
                {dep}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Panel */}
        <div className="flex-1 border rounded border-gray-50 p-4 shadow-sm flex flex-col gap-4">
          {/* Search + View Toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full md:w-1/2 px-3 py-2 rounded border transition ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded transition ${
                  viewMode === "cards" ? "bg-orange-500 text-white" : isDark ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-900"
                }`}
                title="Vista en tarjetas"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded transition ${
                  viewMode === "table" ? "bg-orange-500 text-white" : isDark ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-900"
                }`}
                title="Vista en tabla"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Document List */}
          {viewMode === "cards" ? (
            <DocumentCard documents={filteredDocuments} />
          ) : (
            <DocumentsTable documents={filteredDocuments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartamentPage;