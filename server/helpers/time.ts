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
