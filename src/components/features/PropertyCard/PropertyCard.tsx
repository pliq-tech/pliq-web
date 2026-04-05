import { Card, Text } from "@pliq/ui";
import Image from "next/image";
import type { PropertyCardProps } from "./PropertyCard.model";
import styles from "./PropertyCardStyles.module.css";

function formatCurrency(amount: number, currency: string): string {
  const label = currency.toUpperCase();
  return `${amount.toLocaleString()} ${label}/mo`;
}

export function PropertyCard({ listing, onClick }: PropertyCardProps) {
  const { title, rentAmount, currency, city, bedrooms, bathrooms, photos } =
    listing;
  const photo = photos.length > 0 ? photos[0] : null;

  return (
    <Card isClickable={!!onClick} onClick={onClick} className={styles.card}>
      <div className={styles.imageWrapper}>
        {photo ? (
          <Image
            src={photo}
            alt={title}
            className={styles.image}
            fill
            sizes="(max-width: 48em) 100vw, 33vw"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <Text size="lg" weight="bold" color="primary">
          {formatCurrency(rentAmount, currency)}
        </Text>
        <Text size="sm" color="secondary">
          {city}
        </Text>
        <div className={styles.details}>
          <span className={styles.detail}>{bedrooms} bed</span>
          <span className={styles.detail}>{bathrooms} bath</span>
        </div>
      </div>
    </Card>
  );
}
