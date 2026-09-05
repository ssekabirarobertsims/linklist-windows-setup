import { Notification, app } from "electron";
import { autoUpdater } from "electron-updater";
import CreateAutomaticUserDataBackup from "../backups/automatic.user.data.backup";

const backgroundCheckIntervalMs = 60 * 60 * 1000;

const notifyUser = (title: string, body: string): void => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
};

const checkForUpdates = async (): Promise<void> => {
  if (!app.isPackaged) {
    return;
  }

  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    console.error("Update check failed:", error);
    notifyUser("LinkList update check failed", "Could not check for updates.");
  }
};

const startBackgroundManager = (): void => {
  autoUpdater.on("update-available", () => {
    notifyUser(
      "LinkList update available",
      "A new update is being downloaded.",
    );
  });
  autoUpdater.on("update-downloaded", () => {
    notifyUser(
      "LinkList update ready",
      "Restart LinkList to install the downloaded update.",
    );
  });

  const runBackgroundChecks = (): void => {
    try {
      const backupCreated = CreateAutomaticUserDataBackup(app);
      if (backupCreated) {
        notifyUser(
          "LinkList backup complete",
          "Your LinkList data was backed up.",
        );
      }
    } catch (error) {
      console.error("Automatic backup failed:", error);
      notifyUser(
        "LinkList backup failed",
        "Your automatic backup could not be completed.",
      );
    }
    void checkForUpdates();
  };

  const beginBackgroundChecks = (): void => {
    runBackgroundChecks();
    setInterval(runBackgroundChecks, backgroundCheckIntervalMs);
  };

  if (app.isReady()) {
    beginBackgroundChecks();
  } else {
    app.once("ready", beginBackgroundChecks);
  }
};

export { notifyUser };
export default startBackgroundManager;
