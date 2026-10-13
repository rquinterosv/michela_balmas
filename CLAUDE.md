# CLAUDE.md

Sitio web de una psicóloga italiana: sitio público con páginas editables por bloques,
formulario de contacto y panel de administración. Monorepo con npm workspaces.

## Reglas que no se rompen

1. **Toda la interfaz en italiano, vía `client/src/i18n/it.ts`.** Ningún texto visible
   escrito a mano en un componente: se agrega una clave en `it.ts` y se usa `it.x.y`.
   Esto incluye el panel de administración, `aria-label`, `alt` fijos y `placeholder`.
2. **Código en inglés** (variables, funciones, archivos, commits). **Comentarios y
   documentación en español.**
3. **Registro del italiano:** forma de cortesía ("Lei") con el paciente en el sitio
   público y en los emails; forma impersonal y lenguaje no técnico en el panel. En el
   panel nunca se muestran JSON, IDs ni la palabra "slug" (es "Indirizzo della pagina").
4. **Código simple y legible, sin magia.** No agregar librerías sin una razón clara.
5. **Sin Cloud Functions** (plan Spark). El backend es Express y se despliega aparte.
6. **Sin analytics ni cookies de terceros.** Si se agregan, hace falta un banner de
   consentimiento conforme al Garante Privacy (hay un TODO en `client/index.html`).
7. **Credenciales solo por variables de entorno**, nunca en el repo.

## Arquitectura

```
shared/   Esquemas zod, tipos y utilidades que usan client y server
server/   API Express + firebase-admin (único que escribe en Firestore)
client/   React 18 + Vite + React Router v6, estilos con CSS Modules
```

- **`shared`** se consume como código TypeScript, sin build (`main: src/index.ts`).
  Vite y `tsx` lo resuelven solos. Se importa siempre como `@studio/shared`.
- **Los tipos salen de los esquemas zod** (`z.infer`), no se escriben aparte.
- **El frontend no habla con Firestore.** Lee y escribe todo por la API. Usa el SDK de
  Firebase solo para el login del panel (Auth) y envía el ID token en
  `Authorization: Bearer`. El backend lo verifica en `requireAdmin` (claim `admin: true`).
- **Fechas:** en Firestore son `Timestamp`; por la API viajan como texto ISO 8601. La
  conversión se hace en `server/src/repositories/`. En pantalla se formatean con
  `Intl.DateTimeFormat("it-IT")`.
- **Errores de la API:** siempre `{ error: string, fields?: Record<string, string> }`,
  con textos en italiano listos para mostrar.

### Frontend

- `client/src/blocks/`: una carpeta por tipo de bloque (`XRender.tsx`, `XEditor.tsx`,
  CSS) y `registry.ts`, que los une. `BlockRenderer` dibuja un bloque en el sitio;
  `admin/BlockListEditor` lo edita en el panel.
- `client/src/admin/`: el panel (`/admin`, rutas en italiano: `pagine`, `messaggi`,
  `impostazioni`). `AdminLayout` decide entre login, "no autorizado" y el panel según
  `AuthContext`. Las llamadas van por `adminApi.ts`, que añade el token. Todas las
  pantallas comparten `Admin.module.css`.
- Los formularios validan con el mismo esquema zod que el backend (`safeParse` +
  `zodFieldErrors`) y muestran los errores por campo con `Field`/`TextField`.
- La vista previa de una página dibuja el borrador con `PageContent`, el mismo
  componente del sitio público, dentro de un contenedor `inert`.
- El router es `createBrowserRouter` porque el aviso de cambios sin guardar
  (`useUnsavedChangesWarning`) necesita `useBlocker`.
- El editor de texto (TipTap) solo ofrece negrita, cursiva, listas y enlaces. Si se
  activa un formato nuevo, hay que permitir su etiqueta en
  `server/src/services/sanitizeHtml.ts` o el backend la borrará al guardar.

### Dónde viven los textos en italiano

| Qué                                           | Dónde                                 |
| --------------------------------------------- | ------------------------------------- |
| Interfaz (sitio público y panel)              | `client/src/i18n/it.ts`               |
| Validación de formularios (client y server)   | `shared/src/validationMessages.it.ts` |
| Errores de la API y plantilla de email        | `server/src/messages.it.ts`           |
| Contenido de ejemplo (seed y modo demo)       | `shared/src/seedContent.ts`           |
| Rótulos del pie y de los recapiti (iniciales) | `shared/src/siteTexts.it.ts`          |

Los rótulos del pie y de los recapiti no están en `it.ts`: son editables desde el panel
("Impostazioni del sito" > "Testi del sito") y se guardan en `siteSettings.texts`.
`siteTexts.it.ts` solo da el valor inicial. Un texto visible en el sitio público que la
profesional pueda querer cambiar va ahí, no en `it.ts`.

### Modelo de datos (Firestore)

```
pages/{pageId}      title, slug, order, published, showInMenu, seo{title,description},
                    blocks[{id,type,data}], updatedAt
siteSettings/main   siteName, professionalTitle, albo{region,number}, vatNumber, email,
                    phone, address, onlineSessions, social{instagram,linkedin},
                    contactReasons[], texts{onlineSessions,alboPrefix,vatLabel,copyright,
                    emailLabel,phoneLabel,addressLabel}
images/{id}         data (bytes del JPEG), createdAt
messages/{id}       name, email, phone, reason, message, consent, consentAt,
                    status ("nuovo" | "letto" | "risposto"), createdAt
```

La página con `slug: "home"` se sirve en `/` y no se puede eliminar. Los slugs `admin`,
`api`, `images` y `assets` están reservados (`shared/src/slug.ts`).

### API

Públicos: `GET /api/pages`, `GET /api/pages/:slug`, `GET /api/settings`,
`GET /api/images/:id`, `POST /api/contact`.

Admin (`requireAdmin`): `GET/POST /api/admin/pages`,
`PATCH /api/admin/pages/reorder`, `GET/PUT/DELETE /api/admin/pages/:id`,
`GET/PUT /api/admin/settings`, `GET /api/admin/messages`,
`PATCH/DELETE /api/admin/messages/:id`, `POST /api/admin/images`.

Las rutas lanzan `HttpError` (o dejan que falle `schema.parse`) y `errorHandler` arma la
respuesta. La página `home` no puede eliminarse, despublicarse ni cambiar de slug. El
email de aviso (opcional, Resend) no incluye el texto del mensaje, por privacidad.

### Imágenes

Se suben desde el panel (`admin/ImageField`): el navegador las reduce y las pasa a JPEG
(`admin/resizeImage.ts`), y el backend las guarda en Firestore, no en Storage (plan de
pago). En la página se guarda la dirección `/api/images/<id>`, relativa al backend: todo
`<img>` de contenido tiene que pasar su dirección por `imageSrc()` (`lib/images.ts`), o
la imagen no se verá en producción, donde frontend y backend están en dominios distintos.

## Comandos (desde la raíz)

```
npm run dev          # emuladores + server + client en paralelo
npm run emulators    # solo emuladores (Auth :9099, Firestore :8080, UI :4000)
npm run typecheck    # tsc en los tres workspaces
npm run lint         # eslint
npm run format       # prettier --write
npm test             # tests del backend (vitest + supertest)
npm run build        # build del frontend
npm run seed         # contenido inicial (-- --force para sobrescribirlo)
npm run set-admin -- <email> ["password"]   # da el claim admin (crea el usuario si hay password)
```

`seed` y `set-admin` actúan sobre lo que diga `server/.env` (emuladores o proyecto real).
Los tests no usan emuladores: simulan `src/firebase.ts` y los repositorios con `vi.mock`.

Los emuladores necesitan Java (JDK 21 o superior). El proyecto local es `demo-studio`:
un ID que empieza por `demo-` solo existe en los emuladores, no puede tocar producción.

Antes de dar un cambio por terminado: `npm run typecheck && npm run lint && npm test`.

## Convenciones

- TypeScript estricto (`tsconfig.base.json`); nada de `any`.
- Imports sin extensión (`moduleResolution: Bundler`).
- Componentes React como funciones con nombre y export nombrado; estilos en un
  `.module.css` junto al componente.
- Colores, tipografías y espacios solo desde las variables de
  `client/src/styles/variables.css`.
- En el backend, solo `server/src/repositories/` toca Firestore; las rutas validan con
  zod y delegan.
- Accesibilidad: `label` en todos los campos, foco visible, contraste AA, errores de
  formulario asociados al campo con `aria-describedby`.

## Cómo agregar un tipo de bloque

Ejemplo: un bloque `quote` ("Citazione").

1. **`shared/src/blocks.ts`**: crear `quoteDataSchema` y agregar una línea a
   `blockSchema`:
   `z.object({ id: blockId, type: z.literal("quote"), data: quoteDataSchema })`.
   Con esto el backend ya lo valida y existe el tipo `BlockData<"quote">`.
2. **`client/src/i18n/it.ts`**: agregar `quote` a `blockNames` y `blockDescriptions`
   (TypeScript da error hasta que estén) y las etiquetas del formulario en
   `admin.blockEditors.quote`.
3. **`client/src/blocks/quote/`**: crear `QuoteRender.tsx` (cómo se ve en el sitio) y
   `QuoteEditor.tsx` (formulario del panel; recibe `BlockEditorProps<"quote">` y tiene
   que ser `export default`, porque el registro lo carga con `lazy()`).
4. **`client/src/blocks/registry.ts`**: agregar la entrada
   `quote: { label, description, zodSchema, defaultData, EditorComponent, RenderComponent }`,
   con `EditorComponent: lazy(() => import("./quote/QuoteEditor"))`.
5. Si el bloque guarda HTML del editor de texto, sanearlo en el backend igual que
   `richText` (`server/src/services/sanitizeHtml.ts`).

No hay que tocar rutas, repositorios ni reglas de Firestore.

## Despliegue y estado

- Frontend: sitio estático (`client/dist`). `vercel.json` lo configura para Vercel;
  `firebase.json` para Firebase Hosting. Backend: `npm run start` en cualquier hosting
  de Node. Los pasos completos están en el README.
- El código del panel va en trozos aparte (`lazy` en `App.tsx` y en el registro de
  bloques): el sitio público no carga Firebase Auth ni TipTap, y funciona aunque
  falten las variables `VITE_FIREBASE_*` (el panel no).
- **Modo demo:** un build de producción sin `VITE_API_URL` (o con
  `VITE_DEMO_MODE=true`) muestra el sitio público con el contenido de
  `shared/src/seedContent.ts`, sin backend ni Firebase (`client/src/lib/demoApi.ts`).
  El formulario no envía nada (lo avisa) y no hay panel. Se apaga al definir
  `VITE_API_URL`.
- Las cinco fases del plan inicial están hechas. Lo que queda pendiente y las
  limitaciones conocidas están en el punto 10 del README.
- Verificado solo con Firebase simulado (tests con `vi.mock` y pruebas manuales con
  una API falsa): al tocar repositorios, `seed`, `set-admin` o el login, probar con
  los emuladores (`npm run dev`), que necesitan Java.
