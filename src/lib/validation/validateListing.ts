export interface ListingInput {
  title: string;
  description: string;
  photos: File[] | string[];
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  propertyType?: string;
  address?: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

const TITLE_MIN = 5;
const TITLE_MAX = 100;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 2000;
const PHOTOS_MIN = 3;
const PHOTOS_MAX = 15;

function validateTitle(title: string): string | undefined {
  if (!title.trim()) return "Title is required";
  if (title.trim().length < TITLE_MIN) {
    return `Title must be at least ${TITLE_MIN} characters`;
  }
  if (title.trim().length > TITLE_MAX) {
    return `Title must be at most ${TITLE_MAX} characters`;
  }
  return undefined;
}

function validateDescription(description: string): string | undefined {
  if (!description.trim()) return "Description is required";
  if (description.trim().length < DESCRIPTION_MIN) {
    return `Description must be at least ${DESCRIPTION_MIN} characters`;
  }
  if (description.trim().length > DESCRIPTION_MAX) {
    return `Description must be at most ${DESCRIPTION_MAX} characters`;
  }
  return undefined;
}

function validatePhotos(photos: File[] | string[]): string | undefined {
  if (photos.length < PHOTOS_MIN) {
    return `At least ${PHOTOS_MIN} photos are required`;
  }
  if (photos.length > PHOTOS_MAX) {
    return `At most ${PHOTOS_MAX} photos are allowed`;
  }
  return undefined;
}

function validatePositiveNumber(
  value: number,
  fieldName: string,
): string | undefined {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
  if (!Number.isFinite(value) || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return undefined;
}

function validatePositiveInteger(
  value: number,
  fieldName: string,
): string | undefined {
  const numError = validatePositiveNumber(value, fieldName);
  if (numError) return numError;
  if (!Number.isInteger(value)) {
    return `${fieldName} must be a whole number`;
  }
  return undefined;
}

export function validateListing(input: ListingInput): ValidationErrors {
  const errors: ValidationErrors = {};

  errors.title = validateTitle(input.title);
  errors.description = validateDescription(input.description);
  errors.photos = validatePhotos(input.photos);
  errors.rentAmount = validatePositiveNumber(input.rentAmount, "Rent amount");
  errors.depositAmount = validatePositiveNumber(
    input.depositAmount,
    "Deposit amount",
  );
  errors.bedrooms = validatePositiveInteger(input.bedrooms, "Bedrooms");
  errors.bathrooms = validatePositiveInteger(input.bathrooms, "Bathrooms");
  errors.areaSqm = validatePositiveInteger(input.areaSqm, "Area");

  // Remove undefined entries
  for (const key of Object.keys(errors)) {
    if (errors[key] === undefined) {
      delete errors[key];
    }
  }

  return errors;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
