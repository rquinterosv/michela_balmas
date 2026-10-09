import { contactSchema, zodFieldErrors } from "@studio/shared";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Field, describedBy } from "../../components/Field";
import { it } from "../../i18n/it";
import { api, ApiRequestError } from "../../lib/api";
import { pagePath } from "../../lib/paths";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import styles from "./ContactForm.module.css";

const PHONE_PREFIX = "+39";

const EMPTY_VALUES = {
  name: "",
  email: "",
  phone: `${PHONE_PREFIX} `,
  reason: "",
  message: "",
  consent: false,
  website: "", // honeypot: las personas no lo ven y lo dejan vacío
};

type FormValues = typeof EMPTY_VALUES;
type FieldErrors = Record<string, string>;

// id del control de cada campo, para las etiquetas y para llevar el foco al error.
const fieldId = (name: keyof FormValues) => `contact-${name}`;

export function ContactForm() {
  const settings = useSiteSettings();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const successRef = useRef<HTMLDivElement>(null);

  // Al enviar con éxito, el foco pasa al mensaje de confirmación para que
  // quien usa lector de pantalla o teclado se entere.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function setValue<K extends keyof FormValues>(name: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function showErrors(fieldErrors: FieldErrors, message: string) {
    setErrors(fieldErrors);
    setFormError(message);
    // Foco en el primer campo con error.
    const firstInvalid = Object.keys(fieldErrors)[0] as keyof FormValues | undefined;
    if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Si solo queda el prefijo, el teléfono cuenta como vacío.
    const phone = values.phone.trim() === PHONE_PREFIX ? "" : values.phone;

    // Misma validación que hace el backend, para avisar sin esperar a la red.
    const result = contactSchema.safeParse({ ...values, phone });
    if (!result.success) {
      showErrors(zodFieldErrors(result.error), it.contactForm.errorValidation);
      return;
    }

    setStatus("submitting");
    setErrors({});
    setFormError("");

    try {
      await api.sendContact(result.data);
      setValues(EMPTY_VALUES);
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      const apiError = error instanceof ApiRequestError ? error : null;
      const hasFieldErrors = apiError !== null && Object.keys(apiError.fields).length > 0;

      if (hasFieldErrors) {
        showErrors(apiError.fields, it.contactForm.errorValidation);
      } else if (apiError?.status === 429) {
        // Demasiados envíos: el backend ya explica qué pasa.
        showErrors({}, apiError.message);
      } else {
        showErrors({}, it.contactForm.errorGeneric);
      }
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={styles.success}>
        <h3>{it.contactForm.successTitle}</h3>
        <p>{it.contactForm.successText}</p>
        <button type="button" className="button button-secondary" onClick={() => setStatus("idle")}>
          {it.contactForm.sendAnother}
        </button>
      </div>
    );
  }

  return (
    // noValidate: se usan nuestros mensajes en italiano, no los del navegador.
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Field id={fieldId("name")} label={it.contactForm.name} error={errors.name}>
        <input
          id={fieldId("name")}
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(event) => setValue("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy(fieldId("name"), undefined, errors.name)}
        />
      </Field>

      <Field id={fieldId("email")} label={it.contactForm.email} error={errors.email}>
        <input
          id={fieldId("email")}
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(event) => setValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy(fieldId("email"), undefined, errors.email)}
        />
      </Field>

      <Field id={fieldId("phone")} label={it.contactForm.phone} optional error={errors.phone}>
        <input
          id={fieldId("phone")}
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => setValue("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy(fieldId("phone"), undefined, errors.phone)}
        />
      </Field>

      <Field id={fieldId("reason")} label={it.contactForm.reason} error={errors.reason}>
        <select
          id={fieldId("reason")}
          required
          value={values.reason}
          onChange={(event) => setValue("reason", event.target.value)}
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={describedBy(fieldId("reason"), undefined, errors.reason)}
        >
          <option value="">{it.contactForm.reasonPlaceholder}</option>
          {settings.contactReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </Field>

      <Field id={fieldId("message")} label={it.contactForm.message} error={errors.message}>
        <textarea
          id={fieldId("message")}
          required
          rows={6}
          value={values.message}
          onChange={(event) => setValue("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy(fieldId("message"), undefined, errors.message)}
        />
      </Field>

      {/* Honeypot anti-spam: fuera de la pantalla y fuera del orden de tabulación. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={fieldId("website")}>{it.contactForm.honeypot}</label>
        <input
          id={fieldId("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setValue("website", event.target.value)}
        />
      </div>

      <div className={styles.consent}>
        <input
          id={fieldId("consent")}
          type="checkbox"
          required
          checked={values.consent}
          onChange={(event) => setValue("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy(fieldId("consent"), undefined, errors.consent)}
        />
        <label htmlFor={fieldId("consent")}>
          {it.contactForm.consentBefore}
          <Link to={pagePath("privacy-policy")}>{it.contactForm.consentLink}</Link>
          {it.contactForm.consentAfter}
        </label>
      </div>
      {errors.consent && (
        <p id={`${fieldId("consent")}-error`} className={styles.consentError}>
          {errors.consent}
        </p>
      )}

      {/* role="alert": el lector de pantalla lo anuncia en cuanto aparece. */}
      {formError && (
        <p role="alert" className={styles.formError}>
          {formError}
        </p>
      )}

      <button type="submit" className="button" disabled={status === "submitting"}>
        {status === "submitting" ? it.contactForm.submitting : it.contactForm.submit}
      </button>

      <p className={styles.notice}>{it.contactForm.notice}</p>
    </form>
  );
}
