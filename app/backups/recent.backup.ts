/**
 * @description fetch the last created backup by user
 * @access public
 * @returns {Promise<object>}
 * @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const FindRecentBackup = async (
  process: { handle: (arg0: string, arg1: () => Promise<object>) => void },
  application: any
): Promise<object> => {
  process.handle("read-recent-backup", async (): Promise<object> => {
    // all backups file path
    const backupsFilePath = path.join(
      application.getPath("appData"),
      "Linklist",
      "Backups",
      "Data",
      "data_backups.json"
    );

    // initial state for backups arr[]
    let existingBackups = [];

    try {
      if (backupsFilePath) {
        // read the data from the *.json file and parse the data
        existingBackups = JSON.parse(
          fs.readFileSync(backupsFilePath, { encoding: "utf8" })
        );
      } else null;
    } catch (error) {
      // handle errors
      console.log(`Error while reading existing backups file`, error);
      existingBackups = [];
    }

    // find and return the last backup by user
    const recentBackup = existingBackups[existingBackups.length - 1]; // O(1) time complexity
    return recentBackup;
  });

  return {};
};

export default FindRecentBackup;
