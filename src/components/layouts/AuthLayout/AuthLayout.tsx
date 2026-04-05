import { Container } from "@pliq/ui";
import type { AuthLayoutProps } from "./AuthLayout.model";
import styles from "./AuthLayoutStyles.module.css";

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Container size="sm">
        <div className={styles.card}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Pliq</span>
            <span className={styles.logoSubtext}>
              Privacy-preserving rentals
            </span>
          </div>
          {children}
        </div>
      </Container>
    </div>
  );
}
