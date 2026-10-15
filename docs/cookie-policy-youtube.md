# Cookie Policy: aggiornamento per i video di YouTube [DA REVISIONARE]

Borrador para la Cookie Policy del sitio en marcha. Los videos de YouTube del
blog (bloque «Video o audio» y copertine de video) se cargan solo cuando el
visitante pulsa play, desde `youtube-nocookie.com`, y nunca se muestra la
miniatura de Google. Aun así, al pulsar play YouTube recibe datos del visitante,
y la política tiene que decirlo.

**Lo tiene que revisar un profesional (consulente privacy o legale) antes de
publicarlo.** El texto está en italiano, como el resto del sitio.

## Cómo aplicarlo

La página «Cookie Policy» de producción no se toca desde el código (el seed no
pisa contenido existente). En el panel: «Pagine» › «Cookie Policy» › editar la
sección de texto:

1. En el primer párrafo, sustituir «e non installa cookie di terze parti» por el
   texto del punto A.
2. Añadir los párrafos del punto B después de «Strumenti tecnici utilizzati».
3. Actualizar la fecha de «Ultimo aggiornamento».

El mismo texto ya está en el contenido de ejemplo (`shared/src/seedContent.ts`,
`youtubeCookiePolicyHtml`), que usan el modo demo y las instalaciones nuevas.

## A. Primer párrafo

> Questo sito non utilizza cookie di profilazione né strumenti di analisi
> statistica (analytics), e durante la navigazione non installa cookie di terze
> parti. Per questo motivo non viene mostrato alcun banner per la raccolta del
> consenso. I video di YouTube si caricano solo se il visitatore lo richiede
> (vedi sotto).

## B. Nueva sección (título en negrita)

> **Video di YouTube**
>
> Alcune pagine del blog contengono video ospitati su YouTube, servizio di Google
> Ireland Limited. Per tutelare la Sua riservatezza, il video non viene caricato
> all'apertura della pagina: al suo posto compare un riquadro con il pulsante di
> riproduzione, e nessun dato viene inviato a YouTube finché non lo preme.
>
> Premendo il pulsante, il video viene caricato in modalità «privacy avanzata»
> (dominio youtube-nocookie.com). Da quel momento YouTube può raccogliere dati come
> l'indirizzo IP e salvare informazioni sul dispositivo, secondo la propria
> informativa: policies.google.com/privacy (enlace a
> https://policies.google.com/privacy). Se preferisce, può guardare il video
> direttamente sul sito di YouTube.

## Puntos a valorar con el profesional

- Si el clic en play basta como acción del usuario o hace falta un aviso o
  consentimiento previo explícito (hoy, bajo el recuadro se lee: «Il video viene
  caricato da YouTube (Google) solo quando si preme play.»).
- Si hay que nombrar a Google como destinatario en la Privacy Policy.
- Los enlaces a Spotify o a la web de una radio no cargan nada en el sitio: solo
  abren otra pestaña, así que no afectan a la Cookie Policy.
