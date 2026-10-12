import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PageLoading } from "./components/PageStatus";
import { PublicLayout } from "./components/PublicLayout";
import { RouteError } from "./components/RouteError";
import { NotFound } from "./pages/NotFound";
import { PublicPage } from "./pages/PublicPage";

// Las pantallas del panel se cargan con import() dinámico: su código (Firebase
// Auth, editor de texto…) va en un archivo aparte que solo se descarga al entrar
// en /admin. Los visitantes del sitio público no lo pagan.
type AdminScreen = keyof typeof import("./admin");

function adminScreen(name: AdminScreen) {
  return async () => {
    const screens = await import("./admin");
    return { Component: screens[name] };
  };
}

// Se usa createBrowserRouter (y no <BrowserRouter>) porque el aviso de "cambios
// sin guardar" del panel necesita useBlocker, que solo existe con este tipo de router.
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Panel de administración. Va antes para que "/admin" no se tome por una página. */}
      <Route path="/admin" lazy={adminScreen("AdminLayout")} errorElement={<RouteError />}>
        <Route index lazy={adminScreen("Dashboard")} />
        <Route path="pagine" lazy={adminScreen("PagesList")} />
        <Route path="pagine/nuova" lazy={adminScreen("PageEditor")} />
        <Route path="pagine/:id" lazy={adminScreen("PageEditor")} />
        <Route path="messaggi" lazy={adminScreen("MessagesPage")} />
        <Route path="impostazioni" lazy={adminScreen("SettingsPage")} />
      </Route>

      {/* Sitio público: cada página sale de la base de datos según su dirección. */}
      <Route element={<PublicLayout />} errorElement={<RouteError />}>
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
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export function App() {
  return (
    <RouterProvider
      router={router}
      // Lo que se ve mientras se descarga el código del panel al entrar directo en /admin.
      fallbackElement={<PageLoading />}
      future={{ v7_startTransition: true }}
    />
  );
}
