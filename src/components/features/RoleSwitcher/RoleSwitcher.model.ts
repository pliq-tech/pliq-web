export type UserRole = "tenant" | "landlord";

export interface RoleSwitcherProps {
  currentRole: UserRole;
  onSwitch: (role: UserRole) => void;
}
