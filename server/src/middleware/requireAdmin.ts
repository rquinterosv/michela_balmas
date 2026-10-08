import type { NextFunction, Request, Response } from "express";
import { auth } from "../firebase";
import { messages } from "../messages.it";
import { HttpError } from "./errorHandler";

// Protege /api/admin/*. El frontend envía el ID token de Firebase Auth en
// "Authorization: Bearer <token>"; aquí se verifica y se exige el claim admin: true
// (se asigna con scripts/set-admin.ts).
export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, messages.unauthenticated);
  }

  let claims;
  try {
    claims = await auth.verifyIdToken(token);
  } catch {
    // Token caducado, mal formado o de otro proyecto.
    throw new HttpError(401, messages.sessionExpired);
  }

  if (claims.admin !== true) {
    throw new HttpError(403, messages.forbidden);
  }

  next();
}
