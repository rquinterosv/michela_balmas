# Antes de pasar a producción

Lista de lo que hay que hacer antes (y justo después) de subir los últimos cambios
a producción, y plan para mejorar el tiempo de carga del sitio sin pagar nada.

Fecha del análisis: 15/10/2026.

## 1. Comprobaciones antes del push

- [ ] `npm run typecheck && npm run lint && npm test` sin errores.
- [ ] Probar el panel con los emuladores (`npm run dev`, necesita Java 21). Lo
      nuevo solo se ha probado en el sitio público (modo demo), no en el panel:
  - Bloque «Immagini e testi alternati» (zigzag): añadir, editar, reordenar y
    eliminar filas; subir una imagen; guardar y ver el resultado en el sitio.
  - Bloque «Chi sono»: campos «Testo del pulsante» y «Collegamento del pulsante».
  - «Impostazioni del sito» > «Menu del sito»: mostrar u ocultar la voce
    «Chi sono» y cambiar su texto.
- [ ] `npm run seed` contra los emuladores con datos ya existentes: debe crear
      solo la página `chi-sono` y no tocar nada más.
- [ ] Decidir si se suben `client/public/images/logo.jpg` y `logo.svg` (no están
      en git; el sitio usa `logo.png`). `logo.svg` pesa 570 kB: si se usa, conviene
      optimizarlo antes.

## 2. Después del deploy

- [ ] **Comprobar que Vercel desplegó el último commit.** El 15/10/2026
      `https://michelabalmas.vercel.app/images/logo.png` devolvía el HTML del sitio
      en vez de la imagen: el deploy publicado era anterior al commit del logo
      (`aea9c21`). Revisar en el panel de Vercel qué commit está publicado.
- [ ] Ejecutar `npm run seed` **sin `--force`** con `server/.env` apuntando al
      proyecto real: crea la página `/chi-sono` (con textos «DA REVISIONARE») sin
      tocar el contenido existente. Con `--force` se pisaría todo lo editado.
- [ ] Botón «Scopri di più» de la Home: no hace falta rellenarlo. Un bloque «Chi sono»
      guardado antes de existir el botón muestra «Scopri di più» → `/chi-sono` en cuanto
      esa página está publicada (antes no, para no llevar a un 404). Se cambia o se
      quita (campos vacíos) desde el panel.
- [ ] Revisar en móvil (375 px) y en escritorio: menú, voce «Chi sono», botón
      «Scopri di più» y página `/chi-sono`.

## 3. Tiempo de carga

### Diagnóstico

Medido en producción con el backend despierto:

| Qué                                   | Tiempo      | Tamaño            |
| ------------------------------------- | ----------- | ----------------- |
| HTML (Vercel)                         | 0,16 s      | 1 kB              |
| JavaScript principal                  | 0,18 s      | 101 kB comprimido |
| API `settings`, `pages`, `pages/home` | 0,14–0,24 s | < 2 kB cada una   |
| Imágenes de la Home (desde el API)    | 0,23–0,25 s | 181 kB y 84 kB    |

Con el backend despierto la página completa carga en torno a 1 segundo: el peso
del JavaScript, las fuentes y las imágenes no es el problema.

**Causa probable (sin confirmar): el arranque en frío del backend.** Está en Render con
`plan: free` (`render.yaml`): tras 15 minutos sin visitas el servidor se apaga y
la siguiente petición espera a que arranque de nuevo (30–60 segundos). Mientras
tanto el sitio no puede mostrar nada, porque todo el contenido (textos e
imágenes) sale del API: el visitante solo ve «Caricamento…». Con pocas visitas,
el servidor está dormido casi siempre.

Para confirmarlo: no abrir el sitio durante 20–30 minutos, abrirlo y cronometrar
(30 s o más en «Caricamento…» = arranque en frío), o mirar los «Logs» de Render.
Una medición del 15/10/2026 tras 18 minutos no sirvió: alguien visitó el sitio
mientras tanto y el servidor seguía despierto (0,2–0,4 s).

Detalle menor: el contenido de la página se pide después de recibir los datos
del sitio y el menú, no a la vez (dos viajes al API seguidos, ~0,2 s de más).

### Plan sin coste

**1. Mantener despierto el backend con un «ping» externo (lo más importante).**

Un servicio gratuito llama a `/api/health` cada 10 minutos y el servidor no se
duerme nunca. Elimina la espera para todos los visitantes, imágenes incluidas,
sin tocar código. El plan gratuito de Render da 750 horas al mes y un servicio
encendido todo el mes usa ~744: alcanza para este único servicio (no para dos).

Con [cron-job.org](https://cron-job.org) (gratuito):

1. Crear una cuenta.
2. «Create cronjob».
3. URL: `https://michela-balmas-api.onrender.com/api/health`
4. Ejecución: cada 10 minutos. Guardar.

Alternativa equivalente: [UptimeRobot](https://uptimerobot.com), monitor HTTP
cada 5 minutos (además avisa por email si el backend se cae).

**2. Mejoras en el código (pendientes de implementar).**

- **Despertar el backend antes y pedir todo a la vez.** Una llamada a
  `/api/health` desde `client/index.html` en cuanto se abre la página, antes de
  descargar el JavaScript, y pedir la página a la vez que los datos del sitio y
  el menú (hoy `PublicPage` espera a `PublicLayout`). Ahorro: 0,3–0,5 s.
- **Guardar el contenido en el navegador del visitante.** Guardar en
  `localStorage` los datos del sitio, el menú y las páginas visitadas, mostrarlos
  al instante en la siguiente visita y actualizarlos cuando responda el API. Solo
  ayuda a quien ya visitó el sitio. Es una comodidad: si falla o está vacío, el
  sitio funciona igual que ahora.

Con el ping y estas dos mejoras, la carga debería quedar en torno a 1 segundo
siempre, sin coste.

### Descartado por ahora

- **Leer los textos directamente de Firestore (API REST).** Las reglas ya lo
  permiten para las páginas publicadas y los datos del sitio, y evitaría el
  arranque en frío para los textos. Pero las imágenes seguirían saliendo del
  backend y va contra la regla «el frontend no habla con Firestore» de CLAUDE.md.
  Solo tendría sentido si no se usa el ping.
- **Incluir una copia del contenido en el build.** Mismo problema con las
  imágenes y, tras un cambio en el panel, se vería la versión anterior unos
  segundos.

### Opciones de pago (como referencia)

| Opción                           | Coste              | Notas                                      |
| -------------------------------- | ------------------ | ------------------------------------------ |
| Render de pago (`plan: starter`) | ~USD 7 al mes      | El servidor no se duerme. Solución limpia. |
| API en Vercel (funciones)        | Pro: USD 20 al mes | Arranque en frío de ~1 s.                  |

**Ojo con Vercel:** el plan gratuito (Hobby) es solo para uso personal no
comercial, y el sitio de una profesional es comercial. Esto afecta también al
frontend, que hoy está en Vercel. Alternativa gratuita que permite uso
comercial: Firebase Hosting (plan Spark), ya configurado en `firebase.json`
(ver la sección 6 del README).

## 4. Blog y «Come lavoro»: puesta en marcha (15/10/2026)

El código ya está en producción, pero el blog y la página «Come lavoro» no se ven
hasta que existan en la base de datos. Pasos, en orden:

- [ ] Crear el contenido inicial en la base real: la página «Come lavoro», la página
      `blog`, las categorías «Interviste», «Radio» y «Articoli», y 6 artículos, todo
      con textos «[DA REVISIONARE]». No toca nada de lo que ya existe y coloca las
      páginas nuevas en su sitio del menú (Home · Chi sono · Come lavoro · Blog ·
      Contatti). Desde la carpeta `server/`:

      npm run seed -- --production

- [ ] Publicar las reglas de Firestore actualizadas (lectura pública solo de los
      artículos publicados): `firebase deploy --only firestore:rules`. El sitio no
      depende de ellas (todo pasa por el backend), pero así quedan coherentes.
- [ ] En «Impostazioni del sito» › «Blog: scheda contatti e autore»: subir la foto
      profesional y escribir el horario de atención.
- [ ] En el artículo «Intervista: prendersi cura della propria salute psicologica»:
      sustituir el enlace provisional de YouTube (`DA_INSERIRE`) por el real. En
      «In radio: ansia e stress…», sustituir el enlace provisional de la puntata.
- [ ] Revisar los textos «[DA REVISIONARE]» de «Come lavoro» (completar duración y
      frecuencia de las sedute), de los 6 artículos y del texto introductorio del
      blog (o despublicar lo que no sirva).
- [ ] Cookie Policy: aplicar el borrador de
      [cookie-policy-youtube.md](./cookie-policy-youtube.md), después de revisarlo
      con un profesional.
- [ ] Comprobar `https://michelabalmas.vercel.app/sitemap.xml` y darlo de alta en
      Google Search Console.
