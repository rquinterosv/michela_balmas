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

### Diagnóstico (confirmado el 23/10/2026)

| Qué                                              | Tiempo |
| ------------------------------------------------ | ------ |
| Primera petición al API tras un rato sin visitas | 52,5 s |
| La misma, justo después                          | 0,3 s  |
| Primera lectura de Firestore tras despertar      | 2,4 s  |
| Página de la Home, API despierto                 | 0,38 s |

La causa es el **arranque en frío del backend**: Render (`plan: free`) lo apaga tras
15 minutos sin uso y tarda unos 50 s en arrancar. Como todo el contenido (textos e
imágenes) salía del API, el visitante veía «Caricamento…» todo ese tiempo. El peso
del JavaScript (~120 kB comprimido), las fuentes, las imágenes (43–181 kB, ya con
caché de un año) y las regiones (Render, Vercel y Firestore en Europa) no son el
problema. Además, el contenido de la página se pedía después de los datos del sitio
y el menú, no a la vez.

Firebase Storage se descartó: no resuelve la espera (los textos seguirían saliendo
del backend dormido) y los buckets nuevos exigen el plan Blaze, con tarjeta.

### Qué se hizo (sin coste)

1. **Contenido en el build** (ver «Contenido en el build» en el README, punto 6):
   el build de Vercel descarga todo lo publicado (`GET /api/content`) y las
   imágenes, y el sitio público se sirve sin pedir nada al API. Desaparecen la
   espera y la doble petición. Tras cada cambio del panel el backend llama al Deploy
   Hook de Vercel (`DEPLOY_HOOK_URL`) y el cambio se ve en 1-2 minutos.
2. **Despertar el backend antes de usarlo:** el formulario de contacto y el panel
   llaman a `/api/health` al abrirse, para que al pulsar «Invia» o «Accedi» ya esté
   despierto.
3. **Caché de un año** en `vercel.json` para `/assets/*` (archivos con hash) y
   `/images/uploads/*`.

### Recomendado además: ping externo

Con lo anterior los visitantes ya no esperan, pero el formulario de contacto (si
se envía en menos de un minuto) y el panel sí pueden esperar al backend. Se evita
con un servicio gratuito que llame a `/api/health` cada 10 minutos. El plan
gratuito de Render da 750 horas al mes y un servicio encendido todo el mes usa
~744: alcanza para este único servicio (no para dos).

Con [cron-job.org](https://cron-job.org) (gratuito):

1. Crear una cuenta.
2. «Create cronjob».
3. URL: `https://michela-balmas-api.onrender.com/api/health`
4. Ejecución: cada 10 minutos. Guardar.

Alternativa equivalente: [UptimeRobot](https://uptimerobot.com), monitor HTTP
cada 5 minutos (además avisa por email si el backend se cae).

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
- [ ] Nuevo diseño de «Come lavoro» (tarjetas con iconos y percorso a tappe): volver
      a ejecutar `npm run seed -- --production` desde `server/`. Como la página sigue
      exactamente igual que la versión anterior del contenido inicial, el seed le pone
      las secciones nuevas; si alguien la hubiera editado, no la tocaría.
- [ ] Preguntas frecuentes al final de la Home: la misma ejecución de
      `npm run seed -- --production` añade la sección «Domande frequenti» (5 preguntas
      «[DA REVISIONARE]») al final de la Home. Es un añadido de una sola vez: si después
      se borra desde el panel, el seed no la vuelve a poner.
