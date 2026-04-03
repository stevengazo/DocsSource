// src/pages/MyProfilePage.tsx
import { useTheme } from "../context/ThemeContext";

const MyProfilePage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ⚠️ Esto luego debería venir de tu contexto/auth (ej: Supabase)
  const user = {
    name: "Usuario Demo",
    email: "usuario@email.com",
    role: "Administrador",
  };

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
          Mi Perfil
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Información personal y configuración de tu cuenta
        </p>
      </div>

      {/* Profile Card */}
      <div
        className={`rounded-2xl shadow p-6 transition-colors ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white"
        }`}
      >
        {/* Avatar + Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Nombre</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Correo</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Rol</p>
            <p className="font-medium">{user.role}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Editar Perfil
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;