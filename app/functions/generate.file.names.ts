import { app } from "electron";

/**
 * Generate a safe, timestamped filename for link exports
 * @param prefix Optional prefix for the filename (default: "links")
 * @param extension File extension (default: "txt")
 * @returns Full file path on desktop
 */
export function generateExportFilename(
  prefix: string = "links",
  extension: string = "txt"
): string {
  const date = new Date();

  // Format: YYYY-MM-DD-HH-MM-SS
  const timestamp = date
    .toISOString() // e.g., 2025-11-22T08:45:30.123Z
    .replace(/[:.]/g, "-") // replace : and . with -
    .replace("T", "-") // replace T with dash
    .replace("Z", ""); // remove trailing Z

  // Ensure the prefix has only safe characters
  const safePrefix = prefix.replace(/[^a-zA-Z0-9-_]/g, "-");

  // Build the filename
  const filename = `${safePrefix}-${timestamp}.${extension}`;

  // Return full path on desktop
  return `${app.getPath("desktop")}/${filename}`;
}
