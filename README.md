# Sitio web — studio di psicologia

Sitio web para una psicóloga italiana: sitio público con páginas editables por
secciones, formulario de contacto y panel de administración (`/admin`). Toda la
interfaz está en italiano.

Monorepo con npm workspaces:

| Carpeta   | Qué es                                                 |
| --------- | ------------------------------------------------------ |
| `client/` | Frontend: React 18 + Vite + TypeScript, CSS Modules    |
| `server/` | Backend: Node + Express + TypeScript, `firebase-admin` |
| `shared/` | Esquemas zod y tipos que usan los dos                  |

Base de datos (Firestore) y login del panel (Authentication) con Firebase en el
plan gratuito **Spark**. No se usan Cloud Functions. La arquitectura y las
convenciones del código están en [CLAUDE.md](./CLAUDE.md).

## Índice

1. [Requisitos](#1-requisitos)
2. [Desarrollo en local con emuladores](#2-desarrollo-en-local-con-emuladores)
3. [Crear el proyecto en Firebase](#3-crear-el-proyecto-en-firebase)
4. [Service account](#4-service-account-credenciales-del-backend)
5. [Desplegar el backend](#5-desplegar-el-backend)
6. [Desplegar el frontend](#6-desplegar-el-frontend)
7. [Contenido inicial y usuario administrador](#7-contenido-inicial-y-usuario-administrador-en-producción)
8. [Antes de publicar](#8-antes-de-publicar)
9. [Comandos](#9-comandos)
10. [Cosas pendientes y limitaciones](#10-cosas-pendientes-y-limitaciones)

## 1. Requisitos

- **Node 22 o superior** (probado con Node 24). `firebase-admin` 14 lo exige: con
  Node 20, npm se salta en silencio su dependencia de Firestore y el backend no arranca.
- **Java (JDK 21 o superior)**, solo para los emuladores de Firebase.
  En Windows: `winget install EclipseAdoptium.Temurin.21.JDK`.
- **Firebase CLI**: `npm install -g firebase-tools`.

## 2. Desarrollo en local con emuladores

En local todo corre contra los emuladores de Firebase, con el proyecto ficticio
`demo-studio`. Un ID que empieza por `demo-` solo existe en los emuladores, así
que es imposible tocar datos reales por error. No hace falta cuenta de Firebase.

```
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

`npm run dev` levanta en paralelo:

| Qué                 | Dónde                 |
| ------------------- | --------------------- |
| Sitio (Vite)        | http://localhost:5173 |
| API (Express)       | http://localhost:3001 |
| Panel de emuladores | http://localhost:4000 |
| Emulador Firestore  | 127.0.0.1:8080        |
| Emulador Auth       | 127.0.0.1:9099        |

La primera vez, con `npm run dev` en marcha, en otra terminal:

```
npm run seed
npm run set-admin -- admin@esempio.it "una-password"
```

- `seed` crea las páginas Home, Contatti, Privacy Policy, Cookie Policy y Chi sono
  y los datos del sitio, con textos de ejemplo en italiano y datos ficticios.
- `set-admin` crea el usuario (porque se le pasa contraseña) y le da permisos
  de administrador.

Después: el sitio está en http://localhost:5173 y el panel en
http://localhost:5173/admin.

Los datos de los emuladores se guardan en `.emulator-data/` al cerrar con
Ctrl+C y se recuperan en el siguiente arranque. Para empezar de cero, borra esa
carpeta.

> En Windows, si al cerrar no se guardan los datos, arranca los emuladores en
> una terminal aparte (`npm run emulators`) y el resto con
> `npm run dev -w server` y `npm run dev -w client`.

## 3. Crear el proyecto en Firebase

1. En https://console.firebase.google.com crea un proyecto. Google Analytics no
   hace falta: desactívalo (el sitio no usa analytics; ver el punto 10).
2. **Firestore Database > Crear base de datos.**
   - Ubicación **europea**, por el GDPR: `eur3 (europe-west)` o
     `europe-west8 (Milán)`. **La ubicación no se puede cambiar después.**
   - Modo de producción.
3. **Authentication > Comenzar > Sign-in method:** activa **Correo
   electrónico/contraseña** (sin "vínculo por correo").
4. **Authentication > Templates:** en "Restablecimiento de contraseña", cambia
   el **idioma de la plantilla a italiano** (icono del lápiz > idioma). El código
   ya pide los emails en italiano (`auth.languageCode = "it"`), pero la
   plantilla se elige aquí.
5. **Authentication > Settings > Dominios autorizados:** añade el dominio del
   sitio (por ejemplo `www.tusitio.it` y el dominio que dé Vercel).
6. **Configuración del proyecto > General > Tus apps > Web (`</>`):** registra
   una app web. Los valores de `firebaseConfig` que muestra son los
   `VITE_FIREBASE_*` del frontend (punto 6).
7. Publica las reglas de Firestore desde la raíz del repo:

   ```
   firebase login
   cp .firebaserc.example .firebaserc   # y pon dentro el ID de tu proyecto
   firebase deploy --only firestore:rules
   ```

   Las reglas (`firestore.rules`) solo permiten leer las páginas publicadas y
   los datos del sitio; nadie puede escribir desde el navegador ni leer los
   mensajes. Todo se escribe desde el backend.

## 4. Service account (credenciales del backend)

El backend entra en Firebase con una service account.

1. Consola de Firebase > **Configuración del proyecto > Cuentas de servicio >
   Generar nueva clave privada**. Se descarga un archivo JSON.
2. **Ese archivo no va al repo** (el `.gitignore` ya ignora `*service-account*.json`,
   pero mejor guárdalo fuera de la carpeta del proyecto).
3. Del JSON salen tres variables de entorno del backend:

   | Variable                | Campo del JSON |
   | ----------------------- | -------------- |
   | `FIREBASE_PROJECT_ID`   | `project_id`   |
   | `FIREBASE_CLIENT_EMAIL` | `client_email` |
   | `FIREBASE_PRIVATE_KEY`  | `private_key`  |

   `FIREBASE_PRIVATE_KEY` se copia tal cual, en una sola línea y con los `\n`
   literales. En un archivo `.env` va entre comillas dobles.

## 5. Desplegar el backend

El backend es un servidor Express normal. Sirve cualquier hosting de Node:
Render, Railway o Fly.io tienen plan gratuito; elige una **región europea** si
se puede (en Render: Frankfurt).

Ejemplo con Render. El repo trae un `render.yaml` (New > Blueprint) que rellena lo
siguiente solo; a mano sería New > Web Service, conectando el repo:

| Ajuste         | Valor                       |
| -------------- | --------------------------- |
| Root Directory | _(vacío: la raíz del repo)_ |
| Build Command  | `npm install`               |
| Start Command  | `npm run start`             |
| Health Check   | `/api/health`               |

Variables de entorno (todas explicadas en `server/.env.example`):

| Variable                 | Valor en producción                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `CORS_ORIGINS`           | URL del frontend, p. ej. `https://www.tusitio.it`. Varias, separadas por coma (sin barra final) |
| `SITE_URL`               | URL pública del sitio                                                                           |
| `FIREBASE_PROJECT_ID`    | del JSON (punto 4)                                                                              |
| `FIREBASE_CLIENT_EMAIL`  | del JSON                                                                                        |
| `FIREBASE_PRIVATE_KEY`   | del JSON                                                                                        |
| `CONTACT_RATE_LIMIT_MAX` | opcional, por defecto 5 envíos cada 15 minutos por IP                                           |

**No definas** `FIRESTORE_EMULATOR_HOST` ni `FIREBASE_AUTH_EMULATOR_HOST` en
producción. `PORT` lo pone el hosting.

Comprueba que responde: `https://tu-backend.onrender.com/api/health` debe
devolver `{"ok":true}`.

### Aviso por email de mensajes nuevos (opcional)

Desactivado por defecto. Para activarlo hace falta una cuenta en
https://resend.com con un dominio verificado:

```
EMAIL_NOTIFICATIONS_ENABLED=true
RESEND_API_KEY=...
NOTIFY_EMAIL_TO=psicologa@tusitio.it
NOTIFY_EMAIL_FROM=notifiche@tusitio.it
```

El email solo avisa de que hay un mensaje (nombre, motivo y fecha) y enlaza al
panel. A propósito no incluye el texto del mensaje.

## 6. Desplegar el frontend

### Modo demo (sin backend ni Firebase)

Si el build se hace **sin `VITE_API_URL`**, el sitio público se muestra con el
contenido de ejemplo de `shared/src/seedContent.ts`, que va incluido en el
JavaScript. Sirve para enseñar el diseño antes de conectar nada: basta con
desplegar el repo en Vercel sin definir ninguna variable.

En modo demo el formulario de contacto no envía ni guarda nada (lo avisa en
pantalla), no hay panel (`/admin` necesita Firebase) y para cambiar un texto hay
que editar `seedContent.ts` y volver a desplegar. Se apaga solo al definir
`VITE_API_URL`. En local se prueba con `VITE_DEMO_MODE=true` en `client/.env`.

### Con backend

El frontend es un sitio estático (`client/dist`). Necesita estas variables **en
el momento del build** (explicadas en `client/.env.example`):

| Variable                    | Valor en producción                    |
| --------------------------- | -------------------------------------- |
| `VITE_API_URL`              | URL del backend, sin barra final       |
| `VITE_SITE_URL`             | URL pública del sitio, sin barra final |
| `VITE_USE_EMULATORS`        | `false`                                |
| `VITE_FIREBASE_API_KEY`     | `apiKey` de la app web (punto 3.6)     |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain`                           |
| `VITE_FIREBASE_PROJECT_ID`  | `projectId`                            |
| `VITE_FIREBASE_APP_ID`      | `appId`                                |

Estas variables acaban en el JavaScript público: no son secretas (la `apiKey`
de Firebase web no lo es), pero aquí no debe ir nunca nada de la service account.

### Vercel

El repo incluye `vercel.json`, así que basta importar el repositorio:

- **Root Directory:** la raíz del repo (no `client`).
- Build, carpeta de salida y la regla que hace funcionar las direcciones como
  `/contatti` al recargar ya están en `vercel.json`.
- Añade las variables `VITE_*` en **Settings > Environment Variables** y vuelve
  a desplegar: si cambian, hace falta un build nuevo.

Sin backend desplegado y sin `VITE_API_URL`, el sitio carga pero muestra un
mensaje de error en lugar del contenido: las páginas salen de la API.

### Firebase Hosting (alternativa)

`firebase.json` ya está preparado:

```
npm run build          # con las variables VITE_* en client/.env
firebase deploy --only hosting
```

## 7. Contenido inicial y usuario administrador (en producción)

`seed` y `set-admin` actúan sobre lo que diga `server/.env`. Para ejecutarlos
contra el proyecto real desde tu ordenador:

1. Pon en `server/.env` las tres variables de la service account (punto 4) y
   **borra las dos líneas de los emuladores**.
2. Ejecuta:

   ```
   npm run seed
   npm run set-admin -- psicologa@tusitio.it "contraseña-provisional"
   ```

   Los dos comandos dicen al empezar contra qué proyecto van a actuar.
   Si el usuario ya existe (creado en la consola de Firebase), basta
   `npm run set-admin -- psicologa@tusitio.it`.

3. **Vuelve a dejar `server/.env` como estaba** (copia `server/.env.example`)
   para que el desarrollo siga yendo contra los emuladores.

La psicóloga entra en `https://www.tusitio.it/admin` y puede cambiar la
contraseña con "Password dimenticata?". Un usuario al que se le acaba de dar el
permiso tiene que cerrar sesión y volver a entrar.

`seed` solo crea lo que falta: una página, categoría o artículo se salta si ya hay
otro con su id o con su dirección, y los datos del sitio si ya existen.
`npm run seed -- --production` hace lo mismo contra el proyecto real aunque
`server/.env` apunte a los emuladores (usa sus credenciales de la service account),
sin tener que tocar el archivo. Así se puede usar en producción
para agregar una página nueva del contenido inicial (p. ej. "Chi sono") sin tocar
lo que ya está editado. `npm run seed -- --force` sobrescribe las páginas iniciales
y los datos del sitio: **no lo uses en producción** después de que se haya editado
el contenido.

## 8. Antes de publicar

La lista de comprobaciones de los últimos cambios (antes y después del deploy) está en
[docs/antes-de-produccion.md](./docs/antes-de-produccion.md).

- [ ] En el panel, **Impostazioni del sito**: sustituir los datos ficticios
      (nombre, número de iscrizione all'Albo, Partita IVA, recapiti).
- [ ] **Privacy Policy y Cookie Policy** son borradores marcados con `[BOZZA]`
      y con huecos (`[DA DEFINIRE]`, `[ELENCO DEI FORNITORI DA COMPLETARE]`,
      `[DATA]`). Tienen que revisarlos un profesional. Entre los proveedores hay
      que citar a Google (Firebase) y a los hostings del frontend y del backend.
- [ ] Sustituir las imágenes de ejemplo (`/images/placeholder-*.svg`).
- [ ] Comprobar que `VITE_API_URL` está definida en el hosting del frontend: sin
      ella el sitio queda en modo demo y el formulario no envía nada.
- [ ] Revisar los textos de Home y Contatti.
- [ ] Probar el formulario de contacto y comprobar que el mensaje llega al panel.

## 9. Comandos

Desde la raíz:

```
npm run dev          # emuladores + backend + frontend
npm run emulators    # solo los emuladores
npm run seed         # crea el contenido inicial que falta (-- --force lo sobrescribe)
npm run set-admin -- <email> ["password"]
npm run typecheck    # tipos en los tres workspaces
npm run lint         # eslint
npm run format       # prettier
npm test             # tests del backend (no necesitan emuladores)
npm run build        # build del frontend en client/dist
npm run start        # backend en modo producción
```

## 10. Cosas pendientes y limitaciones

- **Imágenes:** se suben desde el panel. El navegador las reduce (lado mayor de
  1600 px como mucho) y las convierte a JPEG de menos de 600 kB, y el backend las
  guarda en Firestore (colección `images`), no en Firebase Storage, que exige el
  plan Blaze. Consecuencias: un PNG con transparencia queda con fondo blanco; las
  imágenes las sirve el backend, así que la primera tarda si el hosting gratuito
  estaba dormido; y una imagen que se deja de usar no se borra sola (ocupa sitio
  en el 1 GB gratuito de Firestore, que da para unas 2.000). También se puede
  pegar la dirección de una imagen externa.
- **Cookies y analytics:** el sitio no usa analytics ni cookies de terceros, y
  las fuentes se sirven desde el propio sitio; por eso no hay banner. Si se
  añade analytics u otro servicio externo, hay que poner un banner de
  consentimiento conforme a las directrices del Garante Privacy (hay un `TODO`
  en `client/index.html`) y actualizar la Cookie Policy.
- **Arranque en frío del backend:** en los planes gratuitos el servidor se
  duerme tras un rato sin visitas y la primera carga tarda 30-60 segundos. Se
  evita con un plan de pago o con un servicio gratuito que llame a `/api/health`
  cada 10 minutos. Diagnóstico y plan sin coste en
  [docs/antes-de-produccion.md](./docs/antes-de-produccion.md#3-tiempo-de-carga).
- **Blog:** el sitemap (`/sitemap.xml`) lo genera el backend; `vercel.json` lo
  reenvía con un rewrite a `https://michela-balmas-api.onrender.com` y
  `client/public/robots.txt` lo anuncia con el dominio de Vercel. Si cambia el
  dominio del sitio o del backend, hay que actualizar esos dos archivos (y
  `SITE_URL` del backend). Firebase Hosting no admite ese rewrite a otro dominio.
  Los videos de YouTube se cargan solo al pulsar play (ver
  [docs/cookie-policy-youtube.md](./docs/cookie-policy-youtube.md)).
- **Vista previa de enlaces en redes:** al ser una aplicación de una sola
  página, WhatsApp, Facebook, etc. solo ven el título y la descripción fijos de
  `client/index.html`, no los de cada página. Google sí ejecuta JavaScript.
- **Rate limit en memoria:** el límite del formulario de contacto se reinicia
  si el servidor se reinicia. Vale para una sola instancia.
- **Conservación de mensajes:** los mensajes se guardan hasta que se eliminan
  desde el panel; no hay borrado automático. El plazo que diga la Privacy
  Policy hay que cumplirlo a mano.
