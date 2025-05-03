// Helper function to format Unix timestamp to readable time
export function formatTime(unixTime: string): string {
  const date = new Date(parseInt(unixTime) * 1000);
  
  // Get time in Belgian timezone (Central European Time)
  // Use the 'en-US' locale with the 'Europe/Brussels' timezone
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Brussels'
  };
  
  // Format time in Belgian timezone
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
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
