import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AdminLayout } from "./admin/AdminLayout";
import { Dashboard } from "./admin/Dashboard";
import { MessagesPage } from "./admin/MessagesPage";
import { PageEditor } from "./admin/PageEditor";
import { PagesList } from "./admin/PagesList";
import { SettingsPage } from "./admin/SettingsPage";
import { PublicLayout } from "./components/PublicLayout";
import { NotFound } from "./pages/NotFound";
import { PublicPage } from "./pages/PublicPage";

// Se usa createBrowserRouter (y no <BrowserRouter>) porque el aviso de "cambios
// sin guardar" del panel necesita useBlocker, que solo existe con este tipo de router.
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Panel de administración. Va antes para que "/admin" no se tome por una página. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pagine" element={<PagesList />} />
        <Route path="pagine/nuova" element={<PageEditor />} />
        <Route path="pagine/:id" element={<PageEditor />} />
        <Route path="messaggi" element={<MessagesPage />} />
        <Route path="impostazioni" element={<SettingsPage />} />
      </Route>

      {/* Sitio público: cada página sale de la base de datos según su dirección. */}
      <Route element={<PublicLayout />}>
        <Route index element={<PublicPage />} />
        <Route path=":slug" element={<PublicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>,
  ),
  {
    // "Future flags": adoptan ya el comportamiento de React Router 7 (y callan sus avisos).
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
