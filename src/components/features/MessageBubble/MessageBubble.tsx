import type { MessageBubbleProps } from "./MessageBubble.model";
import styles from "./MessageBubbleStyles.module.css";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const containerClass = `${styles.container} ${isOwn ? styles.alignRight : styles.alignLeft}`;
  const bubbleClass = `${styles.bubble} ${isOwn ? styles.own : ""}`;

  return (
    <div className={containerClass} data-alignment={isOwn ? "right" : "left"}>
      <div className={bubbleClass}>
        <p className={styles.content}>{message.content}</p>
        <time className={styles.timestamp} dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
