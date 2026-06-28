const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const MULTIPLE_SPACES = /\s+/g;

export function sanitizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARACTERS, "")
    .replace(MULTIPLE_SPACES, " ")
    .trim();
}

export function sanitizeNullableText(value: string | null | undefined) {
  if (value == null) {
    return null;
  }

  const sanitized = sanitizeText(value);
  return sanitized.length > 0 ? sanitized : null;
}

export function sanitizeEmail(value: string) {
  return sanitizeText(value).toLowerCase();
}

export function sanitizeSearchText(value: string) {
  return sanitizeText(value).replace(/[<>]/g, "");
}
