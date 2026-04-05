import type { NotificationItemProps } from "./NotificationItem.model";
import styles from "./NotificationItemStyles.module.css";

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const { title, description, read, createdAt } = notification;

  return (
    <button
      type="button"
      className={styles.item}
      onClick={onClick}
      aria-label={`${read ? "" : "Unread: "}${title}`}
    >
      <span
        className={read ? styles.readDot : styles.unreadDot}
        aria-hidden="true"
      />
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
      <time className={styles.timestamp} dateTime={createdAt}>
        {formatRelativeTime(createdAt)}
      </time>
    </button>
  );
}
