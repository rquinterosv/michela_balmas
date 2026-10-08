import { env } from "../src/env";
import { auth } from "../src/firebase";

// Da permisos de administrador (claim admin: true) a un usuario de Firebase Auth.
//
//   npm run set-admin -- psicologa@esempio.it
//   npm run set-admin -- psicologa@esempio.it "una-password"   (crea el usuario si no existe)
//
// Actúa sobre lo que diga server/.env: emuladores o el proyecto real.
// El usuario tiene que cerrar sesión y volver a entrar para que el permiso se aplique.

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email) {
    console.error('Uso: npm run set-admin -- <email> ["password"]');
    process.exit(1);
  }

  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(`Firebase: ${target}`);

  let user = await auth.getUserByEmail(email).catch(() => null);

  if (!user) {
    if (!password) {
      console.error(
        `No existe ningún usuario con el email ${email}.\n` +
          "Créalo en la consola de Firebase (Authentication > Users) o pasa una " +
          "contraseña como segundo argumento para crearlo ahora.",
      );
      process.exit(1);
    }
    user = await auth.createUser({ email, password, emailVerified: true });
    console.log(`Usuario creado: ${email}`);
  }

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Listo: ${email} es administrador.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
