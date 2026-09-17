import fs from "node:fs";
import path from "node:path";
import { app } from "electron";

export type ApplicationSettings = {
  appTheme: "dark" | "light";
  appLanguage: string;
  autoCheckForUpdates: boolean;
  defaultBrowserNewTab: boolean;
  defaultSaveFileFormat: string;
  enableNotifications: boolean;
  autoBackupsEnabled: boolean;
  autoBackupIntervalDays: number;
  showAppInMenuBar: boolean;
  startAppOnSystemStartup: boolean;
  startWidgetOnSystemStartup: boolean;
};

export const defaultApplicationSettings: ApplicationSettings = {
  appTheme: "dark",
  appLanguage: "en",
  autoCheckForUpdates: true,
  defaultBrowserNewTab: false,
  defaultSaveFileFormat: "*.json",
  enableNotifications: true,
  autoBackupsEnabled: true,
  autoBackupIntervalDays: 7,
  showAppInMenuBar: false,
  startAppOnSystemStartup: true,
  startWidgetOnSystemStartup: true,
};

const settingsFilePath = (): string =>
  path.join(app.getPath("appData"), "Linklist", "Settings", "settings.json");

const normalizeSettings = (
  settings: Partial<ApplicationSettings> = {},
): ApplicationSettings => ({
  ...defaultApplicationSettings,
  ...settings,
  appTheme: settings.appTheme === "light" ? "light" : "dark",
  autoBackupIntervalDays: Math.max(
    1,
    Math.round(
      settings.autoBackupIntervalDays ??
        defaultApplicationSettings.autoBackupIntervalDays,
    ),
  ),
});

export const readApplicationSettings = (): ApplicationSettings => {
  try {
    const filePath = settingsFilePath();
    if (fs.existsSync(filePath)) {
      const storedSettings = JSON.parse(
        fs.readFileSync(filePath, "utf8"),
      ) as Partial<ApplicationSettings>;
      const normalizedSettings = normalizeSettings(storedSettings);
      const hasAllSettings = Object.keys(defaultApplicationSettings).every(
        (key) => Object.prototype.hasOwnProperty.call(storedSettings, key),
      );

      if (!hasAllSettings) {
        writeApplicationSettings(normalizedSettings);
      }

      return normalizedSettings;
    }
  } catch (error) {
    console.error("Failed to read application settings:", error);
  }

  const settings = normalizeSettings();
  writeApplicationSettings(settings);
  return settings;
};

export const writeApplicationSettings = (
  settings: Partial<ApplicationSettings>,
): ApplicationSettings => {
  const normalizedSettings = normalizeSettings(settings);
  const filePath = settingsFilePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(normalizedSettings, null, 2));
  return normalizedSettings;
};

export const updateApplicationSettings = (
  changes: Partial<ApplicationSettings>,
): ApplicationSettings =>
  writeApplicationSettings({ ...readApplicationSettings(), ...changes });
