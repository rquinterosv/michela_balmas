# CLAUDE.md

Sitio web de una psicóloga italiana: sitio público con páginas editables por bloques,
formulario de contacto y panel de administración. Monorepo con npm workspaces.

## Reglas que no se rompen

1. **Toda la interfaz en italiano, vía `client/src/i18n/it.ts`.** Ningún texto visible
   escrito a mano en un componente: se agrega una clave en `it.ts` y se usa `it.x.y`.
   Esto incluye el panel de administración, `aria-label`, `alt` fijos y `placeholder`.
2. **Código en inglés** (variables, funciones, archivos, commits). **Comentarios y
   documentación en español.**
3. **Registro del italiano:** en el sitio público el tono (tu o Lei) lo decide la
   profesional: toda frase que se dirige al visitante es editable desde el panel
   (`siteTexts.it.ts`, hoy en "tu"), no va en `it.ts`. Forma impersonal en los mensajes
   de validación y de la API, y forma impersonal y lenguaje no técnico en el panel. En el
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
- **El sitio público en producción no llama a la API para leer.** El build descarga
  todo el contenido publicado (`GET /api/content`) con `client/siteContentPlugin.ts`:
  datos del sitio y páginas dentro de `index.html`, el blog en `/content/blog.json` y
  las imágenes en `/images/uploads/<id>.jpg`; además, una copia de `index.html` por
  dirección (`/chi-sono/index.html`…) con su título, descripción e imagen para la
  vista previa de enlaces (`shared/src/seo.ts`). Por eso Vite carga la configuración
  con `--configLoader runner`. `lib/api.ts` lo lee con
  `lib/staticApi.ts` (lo mismo que usa el modo demo). Tras cada cambio del panel el
  backend llama al Deploy Hook de Vercel (`DEPLOY_HOOK_URL`, `services/siteRebuild.ts`)
  y el cambio se ve en 1-2 minutos. En desarrollo no hay copia: se lee de la API.
  El formulario de contacto y el panel sí van a la API (`wakeUpBackend` la despierta).
- **Fechas:** en Firestore son `Timestamp`; por la API viajan como texto ISO 8601. La
  conversión se hace en `server/src/repositories/`. En pantalla se formatean con
  `Intl.DateTimeFormat("it-IT")`.
- **Errores de la API:** siempre `{ error: string, fields?: Record<string, string> }`,
  con textos en italiano listos para mostrar.

### Frontend

- `client/src/blocks/`: una carpeta por tipo de bloque (`XRender.tsx`, `XEditor.tsx`,
  CSS) y `registry.ts`, que los une. `BlockRenderer` dibuja un bloque en el sitio;
  `admin/BlockListEditor` lo edita en el panel.
- `client/src/blog/`: el blog público (`/blog`, `/blog/categoria/:slug`, `/blog/:slug`).
  Lo enmarca la página normal con slug `blog`: su título, su lugar en el menú, su SEO y
  sus secciones (el texto introductorio) se editan en «Pagine»; si no existe o no está
  publicada, el blog da 404. `BlogShell` arma el 60/40 con la barra lateral.
- `client/src/admin/`: el panel (`/admin`, rutas en italiano: `pagine`, `blog`,
  `blog/categorie`, `messaggi`, `impostazioni`). `AdminLayout` decide entre login, "no autorizado" y el panel según
  `AuthContext`. Las llamadas van por `adminApi.ts`, que añade el token. Todas las
  pantallas comparten `Admin.module.css`.
- Los formularios validan con el mismo esquema zod que el backend (`safeParse` +
  `zodFieldErrors`) y muestran los errores por campo con `Field`/`TextField`.
- La vista previa de una página dibuja el borrador con `PageContent`, el mismo
  componente del sitio público, dentro de un contenedor `inert`.
- El router es `createBrowserRouter` porque el aviso de cambios sin guardar
  (`useUnsavedChangesWarning`) necesita `useBlocker`.
- Iconos: `lucide-react` (SVG, se importan uno a uno). Solo los de la lista cerrada
  `ICON_NAMES` (`shared/src/blocks.ts`), cada uno con su componente en
  `client/src/lib/icons.tsx` y su nombre en `it.admin.icons`. Los usan los bloques
  `features` (tarjetas) y `timeline` (percorso a tappe); en el panel se eligen con
  `admin/IconPicker`. Siempre decorativos (`aria-hidden`).
- El editor de texto (TipTap) solo ofrece negrita, cursiva, listas y enlaces. Si se
  activa un formato nuevo, hay que permitir su etiqueta en
  `server/src/services/sanitizeHtml.ts` o el backend la borrará al guardar.

### Dónde viven los textos en italiano

| Qué                                         | Dónde                                 |
| ------------------------------------------- | ------------------------------------- |
| Interfaz (sitio público y panel)            | `client/src/i18n/it.ts`               |
| Validación de formularios (client y server) | `shared/src/validationMessages.it.ts` |
| Errores de la API y plantilla de email      | `server/src/messages.it.ts`           |
| Contenido de ejemplo (seed y modo demo)     | `shared/src/seedContent.ts`           |
| Rótulos y frases al visitante (editables)   | `shared/src/siteTexts.it.ts`          |
| Contenido de ejemplo del blog               | `shared/src/seedBlog.ts`              |

Los rótulos del pie y de los recapiti no están en `it.ts`: son editables desde el panel
("Impostazioni del sito" > "Testi del sito") y se guardan en `siteSettings.texts`.
`siteTexts.it.ts` solo da el valor inicial. Un texto visible en el sitio público que la
profesional pueda querer cambiar va ahí, no en `it.ts`.

### Modelo de datos (Firestore)

```
pages/{pageId}      title, slug, order, published, showInMenu, seo{title,description,imageUrl},
                    blocks[{id,type,data}], updatedAt
siteSettings/main   siteName, professionalTitle, albo{region,number}, vatNumber, email,
                    phone, address, onlineSessions, social{facebook,instagram,linkedin},
                    showAboutInMenu, photoUrl, officeHours, contactReasons[],
                    seo{description,imageUrl} (vista previa por defecto),
                    texts{onlineSessions,alboPrefix,vatLabel,copyright,emailLabel,
                    phoneLabel,addressLabel,aboutMenu,blog…,officeHoursLabel,contactCardButton,
                    whatsappButton,whatsappMessage,socialTitle,emergencyNotice,form…,
                    notFoundText}
posts/{id}          title, slug, categoryId, date (Timestamp a medianoche UTC; por la API
                    "2026-10-15"), excerpt, cover{type:none|image|video,imageUrl,imageAlt,
                    videoUrl}, author{name,photoUrl} (vacíos = los de siteSettings),
                    blocks[] (solo richText, image, zigzag, video), published,
                    seo{title,description,imageUrl}, createdAt, updatedAt
seedState/main      appliedAdditions[] (añadidos de una sola vez del seed, p. ej. "home-faq")
categories/{id}     name, slug, parentId (null o una categoría sin padre: un nivel),
                    order, seo{title,description}
images/{id}         data (bytes del JPEG), createdAt
messages/{id}       name, email, phone, reason, message, consent, consentAt,
                    status ("nuovo" | "letto" | "risposto"), createdAt
```

La página con `slug: "home"` se sirve en `/` y no se puede eliminar. Los slugs `admin`,
`api`, `images` y `assets` están reservados (`shared/src/slug.ts`).

### API

Públicos: `GET /api/content` (todo lo publicado, para el build), `GET /api/pages`,
`GET /api/pages/:slug`, `GET /api/settings`,
`GET /api/images/:id`, `POST /api/contact`, `GET /api/blog/categories` (con artículos
publicados, contados con los de sus hijas), `GET /api/blog/posts?categoria=&pagina=`
(de 4 en 4), `GET /api/blog/posts/:slug` (+ relacionados) y `GET /sitemap.xml` (fuera
de `/api`; Vercel la sirve en el dominio del sitio con un rewrite en `vercel.json`).

Admin (`requireAdmin`): `GET/POST /api/admin/pages`,
`PATCH /api/admin/pages/reorder`, `GET/PUT/DELETE /api/admin/pages/:id`,
`GET/PUT /api/admin/settings`, `GET /api/admin/messages`,
`PATCH/DELETE /api/admin/messages/:id`, `GET/POST /api/admin/images` (GET: lista sin bytes), `GET /api/admin/status`
(`autoPublish`: si hay Deploy Hook; sin él, el Dashboard avisa),
`GET/POST /api/admin/posts`, `GET/PUT/DELETE /api/admin/posts/:id`,
`GET/POST /api/admin/categories`, `PATCH /api/admin/categories/reorder`,
`PUT/DELETE /api/admin/categories/:id` (estas devuelven la lista entera).

Las rutas lanzan `HttpError` (o dejan que falle `schema.parse`) y `errorHandler` arma la
respuesta. La página `home` no puede eliminarse, despublicarse ni cambiar de slug; la
página `blog`, ni eliminarse ni cambiar de slug. Una categoría con artículos o con
subcategorías no se puede eliminar. Las consultas del blog (recuentos, paginación,
relacionados) son funciones puras de `shared/src/blog.ts`: las usan el backend y el
modo demo. El
email de aviso (opcional, Resend) no incluye el texto del mensaje, por privacidad.

### Imágenes

Se suben desde el panel (`admin/ImageField`), que también deja elegir una ya subida
(`admin/ImagePicker`) y no muestra su dirección interna. Cada campo guarda su propia
dirección: elegir la misma imagen en dos sitios no los une. Al subir, `ImageField` usa
el `onChange` más reciente (no el de cuando empezó la subida), para no deshacer lo
cambiado mientras tanto. El navegador las reduce y las pasa a JPEG
(`admin/resizeImage.ts`), y el backend las guarda en Firestore, no en Storage (plan de
pago). En la página se guarda la dirección `/api/images/<id>`, relativa al backend: todo
`<img>` de contenido tiene que pasar su dirección por `imageSrc()` (`lib/images.ts`), o
la imagen no se verá en producción, donde frontend y backend están en dominios distintos.
En el sitio público de producción esas direcciones ya llegan cambiadas por las de la
copia del build (`/images/uploads/<id>.jpg`), servida por Vercel con caché de un año.

## Comandos (desde la raíz)

```
npm run dev          # emuladores + server + client en paralelo
npm run emulators    # solo emuladores (Auth :9099, Firestore :8080, UI :4000)
npm run typecheck    # tsc en los tres workspaces
npm run lint         # eslint
npm run format       # prettier --write
npm test             # tests del backend (vitest + supertest)
npm run build        # build del frontend
npm run seed         # crea el contenido inicial que falta (-- --force lo sobrescribe;
                     # -- --production va contra el proyecto real aunque .env use emuladores;
                     # -- --only-additions solo añade secciones a páginas existentes)
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
  de Node. Los pasos completos están en el README. El build del frontend necesita el
  backend en marcha (descarga el contenido) y falla si no responde: Vercel deja
  publicada la versión anterior.
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
