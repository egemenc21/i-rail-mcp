/**
 * Parse string values to appropriate types
 */
export function parseValue(value: string): boolean | number {
    if (value === "0" || value === "false" || value === "no") return false;
    if (value === "1" || value === "true" || value === "yes") return true;
    const num = parseInt(value);
    return isNaN(num) ? 0 : num;
  }