import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebase";

// Estado de la sesión del panel.
// isAdmin sale del claim `admin: true` del token (se asigna con `npm run set-admin`).
// Es solo para decidir qué mostrar: quien manda es el backend, que verifica el
// token en cada petición (requireAdmin).
export type AuthState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "signedIn"; user: User; isAdmin: boolean };

const AuthContext = createContext<AuthState>({ status: "loading" });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    // Firebase avisa al cargar la página (sesión guardada) y en cada login/logout.
    // onAuthStateChanged devuelve la función para dejar de escuchar.
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ status: "signedOut" });
        return;
      }
      const token = await user.getIdTokenResult();
      setState({ status: "signedIn", user, isAdmin: token.claims.admin === true });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
