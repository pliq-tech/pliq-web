import type { RoleSwitcherProps } from "./RoleSwitcher.model";
import styles from "./RoleSwitcherStyles.module.css";

export function RoleSwitcher({ currentRole, onSwitch }: RoleSwitcherProps) {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Role switcher">
      <button
        type="button"
        className={`${styles.tab} ${currentRole === "tenant" ? styles.active : ""}`}
        onClick={() => onSwitch("tenant")}
        role="tab"
        aria-selected={currentRole === "tenant"}
      >
        Tenant
      </button>
      <button
        type="button"
        className={`${styles.tab} ${currentRole === "landlord" ? styles.active : ""}`}
        onClick={() => onSwitch("landlord")}
        role="tab"
        aria-selected={currentRole === "landlord"}
      >
        Landlord
      </button>
    </div>
  );
}
