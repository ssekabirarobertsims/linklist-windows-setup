/**
 * @description delete an existing link from json file
 * @access public
 * @returns {Promise<string>}
 *  @argument {IpcMain, app}
 */
import path from "node:path";
import fs from "node:fs";
import { shell } from "electron";

const DeleteExistingArchivedLink = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkID: string) => Promise<any>
    ) => void;
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
    "delete-existing-archived-link",
    async (event: any, LinkID: string): Promise<any> => {
      // read existing links
      let updatedLinksArchives = [];

      // read file and return arr for the links
      try {
        if (archivedLinksFilePath) {
          // parse links arr into from stringified obj to an arr[] and filter out links !== id
          updatedLinksArchives = JSON.parse(
            fs.readFileSync(archivedLinksFilePath, "utf8")
          ).filter((link: { id: string }) => link.id !== LinkID);
        }
      } catch (error) {
        console.error("Failed to parse links file:", error);
        updatedLinksArchives = [];
      }

      // rewrite file to update the links
      fs.writeFileSync(
        archivedLinksFilePath,
        JSON.stringify(updatedLinksArchives, null, 2)
      );

      // beep window
      shell.beep();

      return "Archive link has been deleted!";
    }
  );
  return "";
};

export default DeleteExistingArchivedLink;
