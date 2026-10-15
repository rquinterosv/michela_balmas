// Datos estructurados (schema.org) para los buscadores. Google los lee también
// dentro de <body>. "<" se escribe como < para que un texto no pueda cerrar el <script>.
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
