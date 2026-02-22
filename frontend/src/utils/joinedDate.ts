/**
 * Formats an ISO date string into a human-readable "Joined Month Year" string.
 * The month name is resolved using the German locale (de-DE).
 *
 * @example
 * joinedDate("2024-03-15") // "Joined März 2024"
 */
export function joinedDate(createdAt: string) {

  const date = new Date(createdAt);

  // ("Month: f.e: February")
  const month = date.toLocaleString('de-DE', { month: 'long' });

  // ("Year: f.e: 2025")
  const year = date.getFullYear();

  return `Joined ${month} ${year}`
}