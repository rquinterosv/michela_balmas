import { MESSAGE_STATUSES, type Message, type MessageStatus } from "@studio/shared";
import { useEffect, useState } from "react";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { formatDateTime } from "../lib/format";
import { phoneHref } from "../lib/paths";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

// "Messaggi": los mensajes del formulario de contacto. Lista con filtro por
// estado; al abrir uno se ve el detalle con sus acciones.
export function MessagesPage() {
  const { state, reload } = useLoad(() => adminApi.listMessages(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<MessageStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const showToast = useToast();
  const labels = it.admin.messages;

  useEffect(() => {
    if (state.status === "ready") setMessages(state.data);
  }, [state]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  function showError(error: unknown) {
    showToast(error instanceof ApiRequestError ? error.message : it.admin.common.error, "error");
  }

  async function setStatus(message: Message, status: MessageStatus) {
    try {
      const updated = await adminApi.updateMessageStatus(message.id, status);
      setMessages((current) => current.map((old) => (old.id === updated.id ? updated : old)));
    } catch (error) {
      showError(error);
    }
  }

  async function confirmDelete() {
    const message = messageToDelete;
    if (!message) return;
    setMessageToDelete(null);
    try {
      await adminApi.deleteMessage(message.id);
      setMessages((current) => current.filter((old) => old.id !== message.id));
      setOpenId(null);
      showToast(labels.deleted);
    } catch (error) {
      showError(error);
    }
  }

  const openMessage = messages.find((message) => message.id === openId);
  const visible = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const confirmDialog = (
    <ConfirmDialog
      open={messageToDelete !== null}
      title={labels.deleteTitle}
      text={messageToDelete ? labels.deleteText(messageToDelete.name) : ""}
      confirmLabel={it.admin.common.delete}
      onConfirm={confirmDelete}
      onCancel={() => setMessageToDelete(null)}
    />
  );

  // --- Detalle de un mensaje ---
  if (openMessage) {
    const mailto =
      `mailto:${openMessage.email}` +
      `?subject=${encodeURIComponent(labels.replySubject(openMessage.reason))}`;

    return (
      <>
        <p>
          <button type="button" className={styles.textButton} onClick={() => setOpenId(null)}>
            ← {labels.backToMessages}
          </button>
        </p>
        <article className={styles.card}>
          <div className={styles.pageHeader}>
            <h1>{openMessage.name}</h1>
            <StatusBadge status={openMessage.status} />
          </div>
          <dl className={styles.details}>
            <dt>{labels.receivedAt}</dt>
            <dd>{formatDateTime(openMessage.createdAt)}</dd>
            <dt>{labels.email}</dt>
            <dd>
              <a href={`mailto:${openMessage.email}`}>{openMessage.email}</a>
            </dd>
            {openMessage.phone && (
              <>
                <dt>{labels.phone}</dt>
                <dd>
                  <a href={phoneHref(openMessage.phone)}>{openMessage.phone}</a>
                </dd>
              </>
            )}
            <dt>{labels.reason}</dt>
            <dd>{openMessage.reason}</dd>
            <dt>{labels.message}</dt>
            {/* pre-wrap: respeta los saltos de línea que escribió la persona. */}
            <dd className={styles.messageText}>{openMessage.message}</dd>
          </dl>
          <p className={styles.help}>{labels.consentAt(formatDateTime(openMessage.consentAt))}</p>

          <div className={styles.actions}>
            <a href={mailto} className="button">
              {labels.replyByEmail}
            </a>
            {openMessage.status !== "risposto" && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setStatus(openMessage, "risposto")}
              >
                {labels.markReplied}
              </button>
            )}
            {openMessage.status !== "letto" && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setStatus(openMessage, "letto")}
              >
                {labels.markRead}
              </button>
            )}
            {openMessage.status !== "nuovo" && (
              <button
                type="button"
                className={styles.textButton}
                onClick={() => setStatus(openMessage, "nuovo")}
              >
                {labels.markNew}
              </button>
            )}
            <button
              type="button"
              className={styles.textButtonDanger}
              onClick={() => setMessageToDelete(openMessage)}
            >
              {it.admin.common.delete}
            </button>
          </div>
        </article>
        {confirmDialog}
      </>
    );
  }

  // --- Lista ---
  return (
    <>
      <h1>{labels.title}</h1>
      <p className={styles.help}>{labels.intro}</p>

      <div className={styles.filters} role="group" aria-label={labels.filterLabel}>
        {(["all", ...MESSAGE_STATUSES] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={styles.filterButton}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? labels.filterAll : it.messageStatus[value]}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p>{messages.length === 0 ? labels.empty : labels.emptyFiltered}</p>}

      <ul className={styles.list}>
        {visible.map((message) => (
          <li key={message.id}>
            <button
              type="button"
              className={`${styles.card} ${styles.messageRow}`}
              onClick={() => setOpenId(message.id)}
            >
              <span className={styles.cardMain}>
                <strong className={message.status === "nuovo" ? styles.unread : undefined}>
                  {message.name}
                </strong>
                <span>{message.reason}</span>
                <span className={styles.help}>{formatDateTime(message.createdAt)}</span>
              </span>
              <StatusBadge status={message.status} />
            </button>
          </li>
        ))}
      </ul>
      {confirmDialog}
    </>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <span className={status === "nuovo" ? styles.badgeOn : styles.badgeOff}>
      {it.messageStatus[status]}
    </span>
  );
}
