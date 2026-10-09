import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/PublicLayout";
import { NotFound } from "./pages/NotFound";
import { PublicPage } from "./pages/PublicPage";

export function App() {
  return (
    // Los "future flags" adoptan ya el comportamiento de React Router 7 (y callan sus avisos).
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Fase 4: las rutas de /admin van aquí, antes de las públicas. */}

        {/* Sitio público: cada página sale de la base de datos según su dirección. */}
        <Route element={<PublicLayout />}>
          <Route index element={<PublicPage />} />
          <Route path=":slug" element={<PublicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
