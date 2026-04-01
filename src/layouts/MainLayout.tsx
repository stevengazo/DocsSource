// src/layouts/MainLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MainLayout() {
  const location = useLocation();

  const navItem = (path: string, label: string) => {
    const active = location.pathname === path;

    return (
      <Link to={path} className="relative px-3 py-1.5 text-sm">
        <span
          className={`relative z-10 ${
            active ? "text-white" : "text-gray-600"
          }`}
        >
          {label}
        </span>

        {/* Animated background */}
        {active && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 bg-gray-900 rounded-md"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20"
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-800">
            Mi App
          </span>

          <nav className="flex items-center gap-2">
            {navItem("/", "Inicio")}
            {navItem("/editor", "Editor")}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-500 hover:text-gray-800 transition">
            Docs
          </button>

          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
            SG
          </div>
        </div>
      </motion.header>

      {/* Page Transition */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}