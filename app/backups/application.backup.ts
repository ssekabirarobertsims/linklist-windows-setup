import fs from "node:fs";
import { format } from "date-fns";
import path from "node:path";
import { v4 } from "uuid";
import { shell, Notification } from "electron";

/**
 * @description create backup for the application
 * @access public
 * @returns {Promise<void>}
 * @argument {IpcMain, app}
 */

const ApplicationBackups = async (
  process: { handle: (arg0: string, arg1: () => Promise<string>) => void },
  application: any
): Promise<void> => {
  process.handle(
    "create-local-application-backup",
    async (): Promise<string> => {
      //
      const backupsFilePath = path.join(
        application.getPath("appData"),
        "Linklist",
        "Backups",
        "Application",
        "application_backups.json"
      );

      // single random id to use on backups to match synchronously
      const randomId: string = `${v4()}-${format(
        new Date(),
        "EEE, MMMM d, yyyy"
      )}` as string;

      //
      !fs.existsSync(
        path.join(
          application.getPath("appData"),
          "Linklist",
          "Backups",
          "Application",
          "application_backups.json"
        )
      )
        ? fs.writeFileSync(backupsFilePath, JSON.stringify([]))
        : null;

      // if file exists for backups then lets read file data
      let existingBackups = [];
      //
      //
      const _backupBackupFileName = path.join(
        application.getPath("appData"),
        "Linklist",
        "Backups",
        "Application",
        randomId
      );

      try {
        if (backupsFilePath) {
          existingBackups = JSON.parse(
            fs.readFileSync(backupsFilePath, { encoding: "utf8" })
          );
        } else null;
      } catch (error) {
        console.log(`Error while reading existing backups file`, error);
        existingBackups = [];
      }

      //push in a new backup to the file
      existingBackups.push({
        id: v4(),
        filepath: _backupBackupFileName,
        _date: format(new Date(), "EEE, MMMM d, yyyy"),
      });

      // file system to write a json file to contain all the backups
      fs.writeFileSync(
        backupsFilePath,
        JSON.stringify(existingBackups, null, 2)
      );

      // create random dir for the backups
      fs.mkdirSync(_backupBackupFileName, { recursive: true });
      //
      const data = path.join(
        __dirname,
        "..",
        "json",
        "about.software.information.json"
      ); // replace with small data with settings also
      //
      fs.writeFileSync(
        path.join(_backupBackupFileName, "application.json"),
        JSON.stringify(fs.readFileSync(data, { encoding: "utf8" }), null, 2)
      );

      // make windows sound for alert
      shell.beep();

      // send notification of successful backup
      new Notification({
        title: "Application Backup",
        body: `Application was successfully backed up!`,
        icon: "", // replace with native icon
      }).show();

      return "Application Backed Up Successfully";
    }
  );
};

export default ApplicationBackups;
