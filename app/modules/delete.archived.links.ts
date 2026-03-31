/**
 * @description delete an existing links from json file
 * @access public
 * @returns {Promise<string>}
 *  @argument {IpcMain, app}
 */
import path from "node:path";
import fs from "node:fs";
import { shell } from "electron";

const DeleteExistingArchivedLinks = async (
  process: {
    handle: (arg0: string, arg1: (event: any) => Promise<any>) => void;
  },
  application: any
): Promise<string> => {
  // path to archived links *.json file
  const archivedLinksFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json"
  );

  //
  process.handle(
    "delete-existing-archived-links",
    async (event: any): Promise<any> => {
      // rewrite file to update the links
      fs.writeFileSync(archivedLinksFilePath, JSON.stringify([], null, 2));

      // beep window
      shell.beep();

      return "Archive link has been deleted!";
    }
  );
  return "";
};

export default DeleteExistingArchivedLinks;
