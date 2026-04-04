// src/pages/SettingsPage.tsx
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data de departamentos y usuarios
const mockDepartments = [
  { name: "IT", users: [{ id: "u1", name: "Steven" }, { id: "u2", name: "Luis" }] },
  { name: "Recursos Humanos", users: [{ id: "u3", name: "Ana" }, { id: "u4", name: "Marta" }] },
  { name: "Marketing", users: [{ id: "u5", name: "Carlos" }, { id: "u6", name: "Sofía" }] },
];

const permissionTypes = ["Lectura", "Escritura", "Administrador"];

const tabs = ["Tema", "Permisos", "Empresa", "Colores", "Usuarios"];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    mockDepartments.forEach((dep) => {
      dep.users.forEach((user) => {
        init[user.id] = {};
        permissionTypes.forEach((perm) => (init[user.id][perm] = false));
      });
    });
    return init;
  });

  const togglePermission = (userId: string, perm: string) => {
    setPermissions((prev) => ({
      ...prev,
      [userId]: { ...prev[user.id], [perm]: !prev[user.id][perm] },
    }));
  };

  const [companyInfo, setCompanyInfo] = useState({
    name: "Grupo Mecsa",
    address: "San José, Costa Rica",
    phone: "+506 2222 3333",
    email: "info@grupomecsa.com",
  });

  const [colors, setColors] = useState({
    primary: "#F97316", // naranja
    secondary: "#3B82F6", // azul
    accent: "#10B981", // verde
  });

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  };

  const allUsers = mockDepartments.flatMap((dep) => dep.users.map((user) => ({ ...user, department: dep.name })));

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Configuraciones</h1>
        <p className="text-sm text-gray-400 mt-1">Personaliza el comportamiento del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? isDark
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Tema" && (
          <motion.div
            key="tema"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl shadow transition-colors ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-lg">Tema</h2>
                <p className="text-sm text-gray-400">Cambia entre modo claro y oscuro</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-gray-800 text-white hover:bg-gray-700"}`}
              >
                {isDark ? "Modo Claro" : "Modo Oscuro"}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "Permisos" && (
          <motion.div
            key="permisos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl shadow transition-colors ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <h2 className="font-medium text-lg mb-4">Permisos por Departamento</h2>
            {mockDepartments.map((dep, depIndex) => (
              <motion.div
                key={dep.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: depIndex * 0.1 }}
                className="mb-6"
              >
                <h3 className="font-semibold mb-2 text-orange-500">{dep.name}</h3>
                <div className="overflow-x-auto">
                  <table className={`min-w-full border-collapse rounded-lg overflow-hidden ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    <thead>
                      <tr className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                        <th className="border p-3 text-left">Usuario</th>
                        {permissionTypes.map((perm) => (
                          <th key={perm} className="border p-3 text-left">{perm}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dep.users.map((user, userIndex) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: userIndex * 0.05 }}
                          className={isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"}
                        >
                          <td className="border p-3 font-medium">{user.name}</td>
                          {permissionTypes.map((perm) => (
                            <td key={perm} className="border p-3 text-center">
                              <motion.input
                                type="checkbox"
                                checked={permissions[user.id][perm]}
                                onChange={() => togglePermission(user.id, perm)}
                                className="w-5 h-5 accent-orange-500 cursor-pointer"
                                whileTap={{ scale: 1.2 }}
                              />
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "Empresa" && (
          <motion.div
            key="empresa"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl shadow transition-colors ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <h2 className="font-medium text-lg mb-4">Datos básicos de la compañía</h2>
            <div className="space-y-3">
              {Object.entries(companyInfo).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="font-medium text-sm text-gray-400">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCompanyChange(key, e.target.value)}
                    className={`mt-1 p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Colores" && (
          <motion.div
            key="colores"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl shadow transition-colors ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <h2 className="font-medium text-lg mb-4">Paleta de colores</h2>
            <div className="flex gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: value }}></div>
                  <span className="text-xs mt-1">{key}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Usuarios" && (
          <motion.div
            key="usuarios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-2xl shadow transition-colors ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <h2 className="font-medium text-lg mb-4">Lista de Usuarios</h2>
            <div className="overflow-x-auto">
              <table className={`min-w-full border-collapse rounded-lg overflow-hidden ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                <thead>
                  <tr className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                    <th className="border p-3 text-left">Usuario</th>
                    <th className="border p-3 text-left">Departamento</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id} className={isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"}>
                      <td className="border p-3 font-medium">{user.name}</td>
                      <td className="border p-3">{user.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;