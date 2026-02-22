export function joinedDate(createdAt: string) {

  const date = new Date(createdAt);

  // ("Month: f.e: February")
  const month = date.toLocaleString('de-DE', { month: 'long' });

  // ("Year: f.e: 2025")
  const year = date.getFullYear();

  return `Joined ${month} ${year}`
}