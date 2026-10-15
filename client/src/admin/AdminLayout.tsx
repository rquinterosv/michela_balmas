import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PageLoading } from "../components/PageStatus";
import { auth } from "../firebase";
import { it } from "../i18n/it";
import { setPageMeta } from "../lib/seo";
import styles from "./Admin.module.css";
import { AuthProvider, useAuth } from "./AuthContext";
import { LoginPage } from "./LoginPage";
import { ToastProvider } from "./Toast";

// Marco del panel (/admin): sesión, avisos y, si el usuario es admin, el menú.
export function AdminLayout() {
  // El panel no debe salir en buscadores.
  useEffect(() => {
    setPageMeta({
      title: it.admin.login.title,
      description: "",
      path: "/admin",
      siteName: "",
      index: false,
    });
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <AdminGate />
      </ToastProvider>
    </AuthProvider>
  );
}

// Decide qué se ve según la sesión: cargando, login, "no autorizado" o el panel.
function AdminGate() {
  const authState = useAuth();

  if (authState.status === "loading") return <PageLoading />;
  if (authState.status === "signedOut") return <LoginPage />;

  if (!authState.isAdmin) {
    return (
      <main className={styles.centered}>
        <p role="alert">{it.admin.login.notAuthorized}</p>
        <button type="button" className="button" onClick={() => signOut(auth)}>
          {it.admin.nav.logout}
        </button>
      </main>
    );
  }

  const links = [
    { to: "/admin", label: it.admin.nav.dashboard, end: true },
    { to: "/admin/pagine", label: it.admin.nav.pages, end: false },
    { to: "/admin/blog", label: it.admin.nav.blog, end: false },
    { to: "/admin/messaggi", label: it.admin.nav.messages, end: false },
    { to: "/admin/impostazioni", label: it.admin.nav.settings, end: false },
  ];

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <p className={styles.topbarTitle}>{it.admin.login.title}</p>
          <div className={styles.topbarActions}>
            {/* El sitio público se abre en otra pestaña para no perder el trabajo en curso. */}
            <a href="/" target="_blank" rel="noopener noreferrer">
              {it.admin.nav.viewSite}
            </a>
            <button type="button" className={styles.textButton} onClick={() => signOut(auth)}>
              {it.admin.nav.logout}
            </button>
          </div>
        </div>
        <nav aria-label={it.admin.nav.label} className={`container ${styles.nav}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? styles.navActive : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={`container ${styles.content}`}>
        <Outlet />
      </main>
    </div>
  );
}
