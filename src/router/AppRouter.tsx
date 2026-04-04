// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import EditorPage from "../pages/EditorPage";
import NotFound from "../pages/NotFound";
import DocumentsPage from "../pages/DocumentsPage";
import DepartamentsPage from '../pages/DepartamentsPage'
import SettingsPage from "../pages/SettingsPage";
import MyProfilePage from "../pages/MyProfilePage";
import DocumentView from "../pages/DocumentView";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/departaments" element={<DepartamentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/document/:id" element={<DocumentView />} />

        </Route>

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}