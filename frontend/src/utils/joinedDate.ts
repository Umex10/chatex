/**
 * Formats an ISO date string into a human-readable "Joined Month Year" string.
 * The month name is resolved using the German locale (de-DE).
 *
 * @example
 * joinedDate("2024-03-15") // "Joined März 2024"
 */
export function joinedAccountDate(createdAt: string) {

  const date = new Date(createdAt);

  if (isNaN(date.getTime())) {
    return "Date unkown"; 
  }

  // ("Month: f.e: February")
  const month = date.toLocaleString('en-EN', { month: 'long' });

  // ("Year: f.e: 2025")
  const year = date.getFullYear();

  return `Joined ${month} ${year}`
}

/**
 * Formats an ISO date string into a relative or absolute human-readable timestamp for shout cards.
 * Returns "X hours ago" for same-day posts, "Yesterday" for the prior day,
 * or "Day. Month Year" for older posts.
 */
export function joinedShoutDate(createdAt: string) {

  const date = new Date(createdAt);

  if (isNaN(date.getTime())) {
    return "Date unknown";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return hours <= 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  if (diffHours < 48) {
    return "Yesterday";
  }

  const day = date.getDate();
  const month = date.toLocaleString('en-EN', { month: 'long' });
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
}