import fs from "node:fs";
import path from "node:path";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const backupIntervalMs = 7 * 24 * 60 * 60 * 1000;

const copyJsonFiles = (
  sourceDirectory: string,
  targetDirectory: string,
): void => {
  if (!fs.existsSync(sourceDirectory)) {
    return;
  }

  fs.mkdirSync(targetDirectory, { recursive: true });

  for (const entry of fs.readdirSync(sourceDirectory, {
    withFileTypes: true,
  })) {
    if (entry.name === "Backups") {
      continue;
    }

    const sourcePath = path.join(sourceDirectory, entry.name);
    const targetPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
      copyJsonFiles(sourcePath, targetPath);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
};

const CreateAutomaticUserDataBackup = (application: {
  getPath: (name: "userData" | "appData") => string;
}): boolean => {
  const dataDirectory = path.join(application.getPath("appData"), "Linklist");
  const backupRootDirectory = path.join(dataDirectory, "Backups", "Data");
  const backupIndexPath = path.join(backupRootDirectory, "data_backups.json");
  const legacyBackupIndexPath = path.join(
    application.getPath("userData"),
    "Backups",
    "Data",
    "data_backups.json",
  );

  fs.mkdirSync(backupRootDirectory, { recursive: true });

  let backups: Array<{ id: string; filepath: string; _date: string }> = [];
  if (fs.existsSync(backupIndexPath)) {
    try {
      backups = JSON.parse(fs.readFileSync(backupIndexPath, "utf8")) as Array<{
        id: string;
        filepath: string;
        _date: string;
      }>;
    } catch (error) {
      console.error("Failed to parse automatic backup index:", error);
    }
  }

  if (
    legacyBackupIndexPath !== backupIndexPath &&
    fs.existsSync(legacyBackupIndexPath)
  ) {
    try {
      const legacyBackups = JSON.parse(
        fs.readFileSync(legacyBackupIndexPath, "utf8"),
      ) as Array<{ filepath: string; createdAt?: string }>;
      const existingBackupPaths = new Set(
        backups.map((backup) => backup.filepath),
      );
      const migratedBackups = legacyBackups
        .filter((backup) => !existingBackupPaths.has(backup.filepath))
        .map((backup) => ({
          id: uuidv4(),
          filepath: backup.filepath,
          _date: backup.createdAt
            ? format(new Date(backup.createdAt), "EEE, MMMM d, yyyy")
            : "Unknown date",
        }));
      backups.push(...migratedBackups);
      fs.writeFileSync(backupIndexPath, JSON.stringify(backups, null, 2));
    } catch (error) {
      console.error("Failed to migrate automatic backup index:", error);
    }
  }

  const lastBackup =
    backups.length > 0 ? backups[backups.length - 1] : undefined;
  const lastBackupTime =
    lastBackup && fs.existsSync(lastBackup.filepath)
      ? fs.statSync(lastBackup.filepath).mtimeMs
      : 0;
  if (
    lastBackup &&
    lastBackupTime > 0 &&
    Date.now() - lastBackupTime < backupIntervalMs
  ) {
    return false;
  }

  const createdAt = new Date().toISOString();
  const backupDirectory = path.join(
    backupRootDirectory,
    `${uuidv4()}-${createdAt.replace(/[:.]/g, "-")}`,
  );

  copyJsonFiles(dataDirectory, backupDirectory);
  backups.push({
    id: uuidv4(),
    filepath: backupDirectory,
    _date: format(new Date(createdAt), "EEE, MMMM d, yyyy"),
  });
  fs.writeFileSync(backupIndexPath, JSON.stringify(backups, null, 2));
  return true;
};

export { CreateAutomaticUserDataBackup, backupIntervalMs };
export default CreateAutomaticUserDataBackup;
