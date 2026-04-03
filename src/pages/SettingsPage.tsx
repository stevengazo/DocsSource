// src/pages/SettingsPage.tsx
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Configuraciones
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Personaliza el comportamiento del sistema
        </p>
      </div>

      {/* Config Sections */}
      <div className="space-y-6">
        {/* Tema */}
        <div
          className={`p-6 rounded-2xl shadow transition-colors ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-lg">Tema</h2>
              <p className="text-sm text-gray-400">
                Cambia entre modo claro y oscuro
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {isDark ? "Modo Claro" : "Modo Oscuro"}
            </button>
          </div>
        </div>

        {/* Placeholder futuras configuraciones */}
        <div
          className={`p-6 rounded-2xl shadow ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white"
          }`}
        >
          <h2 className="font-medium text-lg mb-2">
            Preferencias del sistema
          </h2>
          <p className="text-sm text-gray-400">
            Próximamente podrás configurar notificaciones, idioma y más.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;