// Pantallas del panel. App.tsx las carga con import() dinámico a través de este
// archivo, para que todo el código del panel (Firebase Auth incluido) quede en un
// trozo aparte que solo se descarga al entrar en /admin.
export { AdminLayout } from "./AdminLayout";
export { CategoriesPage } from "./CategoriesPage";
export { Dashboard } from "./Dashboard";
export { MessagesPage } from "./MessagesPage";
export { PageEditor } from "./PageEditor";
export { PagesList } from "./PagesList";
export { PostEditor } from "./PostEditor";
export { PostsList } from "./PostsList";
export { SettingsPage } from "./SettingsPage";
