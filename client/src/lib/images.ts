import { UPLOADED_IMAGE_PREFIX } from "@studio/shared";
import { API_URL } from "./api";

// Dirección lista para usar en <img src>. Las imágenes subidas desde el panel se
// guardan como "/api/images/<id>" y las sirve el backend, que en producción está en
// otro dominio: hay que anteponerle su URL. El resto (https://…, /images/foto.jpg)
// se usa tal cual.
export function imageSrc(url: string): string {
  return url.startsWith(UPLOADED_IMAGE_PREFIX) ? `${API_URL}${url}` : url;
}
