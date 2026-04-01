// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import EditorPage from "../pages/EditorPage";
import NotFound from "../pages/NotFound";
import DocumentsPage from "../pages/DocumentsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<EditorPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}