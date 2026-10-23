// Error de una llamada a la API. `message` está en italiano y se puede mostrar;
// `fields` trae los errores por campo cuando falla la validación.
// `status` es 0 si ni siquiera hubo respuesta (sin conexión, backend caído).
export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}
