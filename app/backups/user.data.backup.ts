import fs from "node:fs";
import { format } from "date-fns";
import path from "node:path";
import { v4 } from "uuid";
import { notifyUser } from "../background/background.manager";

/**
 * @description create backup for all user saved data
 * @access public
 * @returns {Promise<void>}
 * @argument {IpcMain, app}
 */

const UserDataBackups = async (
  process: { handle: (arg0: string, arg1: () => Promise<string>) => void },
  application: any,
): Promise<void> => {
  // path to saved_links.json file
  const savedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "saved_links.json",
  );
  // path to collections.json file
  const collectionsFilePath = path.join(
    application.getPath("userData"),
    "Collections",
    "collections.json",
  );
  // path to archived_links.json file
  const archivesFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json",
  );

  //
  process.handle("create-local-data-backup", async (): Promise<string> => {
    try {
      // single random id to use on backups to match synchronously
      const randomId: string = `${v4()}-${format(
        new Date(),
        "EEE, MMMM d, yyyy",
      )}` as string;

      const _savedLinks = JSON.parse(
        fs.readFileSync(savedLinksFilePath, { encoding: "utf8" }),
      ); // saved links to make a backup for
      const _collections = JSON.parse(
        fs.readFileSync(collectionsFilePath, { encoding: "utf8" }),
      ); // collections to backup
      const _archives = JSON.parse(
        fs.readFileSync(archivesFilePath, { encoding: "utf8" }),
      ); // archives to backup

      // create backup files for user info / recordings
      let existingBackups = [];
      //
      const backupsFilePath = path.join(
        application.getPath("appData"),
        "Linklist",
        "Backups",
        "Data",
        "data_backups.json",
      );

      try {
        if (backupsFilePath) {
          existingBackups = JSON.parse(
            fs.readFileSync(backupsFilePath, { encoding: "utf8" }),
          );
        } else null;
      } catch (error) {
        console.log(`Error while reading existing backups file`, error);
        existingBackups = [];
      }

      //
      const _backupBackupFileName = path.join(
        application.getPath("appData"),
        "Linklist",
        "Backups",
        "Data",
        randomId,
      );

      //push in a new backup to the file
      existingBackups.push({
        id: v4(),
        filepath: _backupBackupFileName,
        _date: format(new Date(), "EEE, MMMM d, yyyy"),
      });

      fs.writeFileSync(
        backupsFilePath,
        JSON.stringify(existingBackups, null, 2),
      );

      // create dir for each backup randomly
      fs.mkdirSync(path.join(_backupBackupFileName), { recursive: true });

      //
      fs.writeFileSync(
        path.join(_backupBackupFileName, "archives.json"),
        JSON.stringify(_archives, null, 2),
      );
      fs.writeFileSync(
        path.join(_backupBackupFileName, "links.json"),
        JSON.stringify(_savedLinks),
      );
      fs.writeFileSync(
        path.join(_backupBackupFileName, "collections.json"),
        JSON.stringify(_collections, null, 2),
      );

      notifyUser(
        "LinkList backup complete",
        "Your LinkList data was backed up successfully.",
      );

      return `Backup created ${_backupBackupFileName}`;
    } catch (error) {
      console.error("Data backup failed:", error);
      notifyUser(
        "LinkList backup failed",
        "Your LinkList data could not be backed up.",
      );
      throw error;
    }
  });
};

export default UserDataBackups;
