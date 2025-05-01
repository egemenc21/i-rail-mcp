// Helper function to format Unix timestamp to readable time
// Example input: "1696165200" (Unix timestamp for Oct 1, 2023 14:00:00 UTC)
// Example output: "16:00" (assuming UTC+2 timezone)
export function formatTime(unixTime: string): string {
  const date = new Date(parseInt(unixTime) * 1000);

  // Format as HH:MM
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Reduces a time by specified number of hours
 * @param time Time in HHMM format (e.g. "1200")
 * @param hours Number of hours to reduce the time by (default: 1)
 * @returns Formatted time string in HHMM format
 */
export function reduceTime(time: string, hours: number = 1): string {
  const timeNum = parseInt(time);
  const hour = Math.floor(timeNum / 100);
  const minute = timeNum % 100;
  const newHour = (hour - hours + 24) % 24; // Subtract hours, handle wrapping around midnight
  return `${newHour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;
}
