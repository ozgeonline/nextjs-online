const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 8;
const maxPasswordLength = 128;

export function normalizeEmail(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getPassword(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value : "";
}

export function isValidEmail(email: string) {
  return email.length <= 254 && emailRegex.test(email);
}

export function isValidPassword(password: string) {
  return password.length >= minPasswordLength && password.length <= maxPasswordLength;
}
