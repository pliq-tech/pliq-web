interface ProfileInput {
  displayName: string;
  role: string;
  avatarFile?: File | null;
  preferredLanguage?: string;
}

interface ValidationErrors {
  displayName?: string;
  role?: string;
  avatarFile?: string;
}

const VALID_ROLES = ["tenant", "landlord", "both"];
const MAX_DISPLAY_NAME_LENGTH = 50;
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png"];

export function validateProfile(input: ProfileInput): ValidationErrors {
  const errors: ValidationErrors = {};

  validateDisplayName(input.displayName, errors);
  validateRole(input.role, errors);
  validateAvatar(input.avatarFile, errors);

  return errors;
}

function validateDisplayName(
  displayName: string,
  errors: ValidationErrors,
): void {
  if (!displayName || displayName.trim().length === 0) {
    errors.displayName = "Display name is required";
  } else if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    errors.displayName = "Display name must be 50 characters or less";
  }
}

function validateRole(role: string, errors: ValidationErrors): void {
  if (!role || !VALID_ROLES.includes(role)) {
    errors.role = "Please select a valid role";
  }
}

function validateAvatar(
  avatarFile: File | null | undefined,
  errors: ValidationErrors,
): void {
  if (!avatarFile) return;

  if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
    errors.avatarFile = "Avatar must be 2MB or less";
  }

  if (!ALLOWED_AVATAR_TYPES.includes(avatarFile.type)) {
    errors.avatarFile = "Avatar must be JPG or PNG";
  }
}

export type { ProfileInput, ValidationErrors };
