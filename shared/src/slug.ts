// Slug de la página de inicio: se sirve en "/" y no se puede eliminar.
export const HOME_SLUG = "home";

// Rutas que usa la aplicación y que ninguna página puede ocupar.
export const RESERVED_SLUGS = ["admin", "api", "images", "assets"];

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// "Chi sono: perché?" -> "chi-sono-perche"
export function slugify(title: string): string {
  return title
    .normalize("NFD") // separa cada letra de su acento
    .replace(/[̀-ͯ]/g, "") // quita los acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
