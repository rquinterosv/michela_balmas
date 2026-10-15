// Id de un video de YouTube a partir de su dirección, o null si no es de YouTube.
// Acepta las formas habituales: youtube.com/watch?v=…, youtu.be/…, /embed/…,
// /shorts/…, /live/… y youtube-nocookie.com. Un id tiene 11 caracteres: letras,
// números, "-" y "_".
//
//   youtubeVideoId("https://youtu.be/dQw4w9WgXcQ?t=10") -> "dQw4w9WgXcQ"
const YOUTUBE_PATTERNS = [
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([\w-]{11})(?![\w-])/,
  /^https?:\/\/youtu\.be\/([\w-]{11})(?![\w-])/,
  /^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([\w-]{11})(?![\w-])/,
];

export function youtubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const id = pattern.exec(url.trim())?.[1];
    if (id) return id;
  }
  return null;
}

// Dirección del reproductor sin cookies de YouTube, para el iframe.
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
