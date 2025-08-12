import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Added explicit return type and default export for better compatibility
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Default export for compatibility
export default cn
