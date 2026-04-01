// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* Código */}
        <h1 className="text-6xl font-bold text-gray-800">404</h1>

        {/* Mensaje */}
        <p className="mt-4 text-lg text-gray-600">
          Página no encontrada
        </p>

        <p className="mt-2 text-sm text-gray-400">
          La ruta que intentas acceder no existe o fue movida.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className="inline-block mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}