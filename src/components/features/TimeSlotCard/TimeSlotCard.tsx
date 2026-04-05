import type { TimeSlotCardProps } from "./TimeSlotCard.model";
import styles from "./TimeSlotCardStyles.module.css";

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TimeSlotCard({
  date,
  startTime,
  endTime,
  isAvailable,
  isSelected,
  onSelect,
}: TimeSlotCardProps) {
  const cardClasses = [
    styles.card,
    isSelected ? styles.selected : "",
    !isAvailable ? styles.unavailable : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dotClass = `${styles.indicator} ${isAvailable ? styles.available : styles.unavailableDot}`;

  return (
    <button
      type="button"
      className={cardClasses}
      onClick={isAvailable ? onSelect : undefined}
      tabIndex={isAvailable ? 0 : -1}
      aria-disabled={!isAvailable}
      aria-pressed={isSelected}
    >
      <span className={dotClass} aria-hidden="true" />
      <div className={styles.info}>
        <span className={styles.date}>{formatDisplayDate(date)}</span>
        <span className={styles.time}>
          {startTime} - {endTime}
        </span>
      </div>
    </button>
  );
}
