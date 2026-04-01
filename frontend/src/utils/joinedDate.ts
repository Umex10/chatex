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

  let dateString = createdAt;
  if (dateString && !dateString.endsWith("Z") && dateString.includes("T")) {
    dateString += "Z"; // Assuming backend sends unzoned UTC
  }
  
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Date unknown";
  }

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffHours < 48) return "Yesterday";

  const day = date.getDate();
  const month = date.toLocaleString('en-EN', { month: 'long' });
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
}