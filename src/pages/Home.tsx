// src/pages/Home.tsx
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FileText, Users, Layers } from "lucide-react"; // Lucide icons

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = "Inicio | Sistema de Gestión Documental";
  }, []);

  const cards = [
    {
      title: "Documentos",
      value: 0,
      subtitle: "Total registrados",
      icon: <FileText className="w-5 h-5 mr-2" />,
      color: "bg-orange-500", // color activo naranja
    },
    {
      title: "Usuarios",
      value: 0,
      subtitle: "Activos en el sistema",
      icon: <Users className="w-5 h-5 mr-2" />,
      color: "bg-red-500", // color activo rojo
    },
    {
      title: "Categorías",
      value: 0,
      subtitle: "Clasificaciones disponibles",
      icon: <Layers className="w-5 h-5 mr-2" />,
      color: "bg-yellow-500", // color activo amarillo/naranja
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="mb-6">
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Sistema de Gestión de Documentos
        </h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
          Administra, organiza y consulta tus documentos de forma eficiente.
        </p>
      </header>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`shadow rounded-2xl p-5 transition-colors flex items-center ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`p-3 rounded-full flex items-center justify-center text-white mr-3 ${
                isDark ? "bg-gray-600" : card.color
              }`}
            >
              {card.icon}
            </div>
            <div>
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {card.title}
              </h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="mt-10">
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Actividad reciente
        </h2>

        <div
          className={`shadow rounded-2xl p-5 transition-colors ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-400">
            No hay actividad reciente por mostrar.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;