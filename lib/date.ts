const defaultDateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export function formatDateTime(
  value: string | Date | null | undefined,
  locale = "en-SG",
  options: Intl.DateTimeFormatOptions = defaultDateTimeOptions,
) {
  if (!value) {
    return "Not available";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDate(
  value: string | Date | null | undefined,
  locale = "en-SG",
) {
  return formatDateTime(value, locale, { dateStyle: "medium" });
}

export function formatRelativeDate(
  value: string | Date | null | undefined,
  locale = "en-SG",
) {
  if (!value) {
    return "Not available";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) <= 1) {
    return diffDays === 0 ? "Today" : diffDays > 0 ? "Tomorrow" : "Yesterday";
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    diffDays,
    "day",
  );
}

