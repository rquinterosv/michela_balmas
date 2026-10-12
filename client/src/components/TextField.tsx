import { describedBy, Field } from "./Field";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  type?: "text" | "email" | "tel" | "url" | "password";
  // true = <textarea> en lugar de <input>.
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}

// Campo de texto completo (etiqueta + control + ayuda + error) para los
// formularios del panel, donde casi todos los campos son iguales.
export function TextField(props: TextFieldProps) {
  const { id, label, value, onChange, error, hint, optional, multiline } = props;

  const controlProps = {
    id,
    value,
    placeholder: props.placeholder,
    disabled: props.disabled,
    autoComplete: props.autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy(id, hint, error),
  };

  return (
    <Field id={id} label={label} optional={optional} hint={hint} error={error}>
      {multiline ? (
        <textarea
          {...controlProps}
          rows={props.rows ?? 3}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...controlProps}
          type={props.type ?? "text"}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({ id, label, checked, onChange, disabled }: CheckboxFieldProps) {
  return (
    <div className="checkbox-field">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
