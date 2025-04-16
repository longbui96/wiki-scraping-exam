import dayjs from "dayjs";

export function formatValue(value) {
  const raw = value.trim();

  // Number
  if (!isNaN(raw) && raw !== "") {
    return parseFloat(raw);
  }

  // Height format: "2.07 m (6 ft 9¼ in)"
  const heightMatch = raw.match(/^(\d+(\.\d+)?)\s*m/);
  if (heightMatch) {
    return parseFloat(heightMatch[1]);
  }

  // Date
  const date = dayjs(
    raw,
    [
      "D MMM YYYY",
      "DD MMM YYYY",
      "MMM D, YYYY",
      "MMMM D, YYYY",
      "YYYY-MM-DD",
      "D/M/YYYY",
    ],
    true
  );

  if (date.isValid()) {
    return date.toDate();
  }

  // Clean duplicate space in text
  return raw.replace(/\s+/g, " ").trim();
}
