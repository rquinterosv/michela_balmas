import { ICON_NAMES, type IconName } from "@studio/shared";
import { it } from "../i18n/it";
import { Icon } from "../lib/icons";
import styles from "./Admin.module.css";

interface IconPickerProps {
  // Nombre del grupo de opciones: único en la pantalla.
  name: string;
  label: string;
  value: IconName;
  onChange: (icon: IconName) => void;
}

// Selector visual de icono: una cuadrícula con todos los iconos disponibles.
// Por dentro es un grupo de botones de opción (radio), así funciona con teclado
// (flechas) y el lector de pantalla lee el nombre de cada icono.
export function IconPicker({ name, label, value, onChange }: IconPickerProps) {
  return (
    <fieldset className={styles.iconPicker}>
      <legend>{label}</legend>
      <div className={styles.iconGrid}>
        {ICON_NAMES.map((icon) => (
          <label key={icon} className={styles.iconOption} title={it.admin.icons[icon]}>
            <input
              type="radio"
              name={name}
              value={icon}
              checked={value === icon}
              onChange={() => onChange(icon)}
              className="visually-hidden"
            />
            <Icon name={icon} />
            <span className="visually-hidden">{it.admin.icons[icon]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
