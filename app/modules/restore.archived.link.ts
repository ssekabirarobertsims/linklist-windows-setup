/**
 * @description restore-archived links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import { shell } from "electron";
//
interface _Data {
  id: string;
}

const RestoreArchivedLink = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkData: _Data) => Promise<string>
    ) => void;
  },
  application: any
): Promise<any> => {
  const savedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "saved_links.json"
  );
  //
  const archivedLinksFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json"
  );

  //
  process.handle(
    "restore-archived-link",
    async (_: any, LinkData: _Data): Promise<string> => {
      // restore the link data to saved_links.json file
      const fs = require("fs");

      // read existing links
      let existingLinks = [];

      // append the new link data
      if (fs.existsSync(savedLinksFilePath)) {
        try {
          existingLinks = JSON.parse(
            fs.readFileSync(savedLinksFilePath, "utf8")
          );
        } catch (error) {
          console.error("Failed to parse collections file:", error);
          existingLinks = [];
        }
      }

      // add new link data
      existingLinks.push(LinkData);

      // write back to file
      fs.writeFileSync(
        savedLinksFilePath,
        JSON.stringify(existingLinks, null, 2)
      );

      // read existing links
      let updatedArchivedLinks = [];

      // read file and return arr for the links
      try {
        if (archivedLinksFilePath) {
          // parse links arr into from stringified obj to an arr[] and filter out links !== id
          updatedArchivedLinks = JSON.parse(
            fs.readFileSync(archivedLinksFilePath, "utf8")
          ).filter((link: { id: string }) => link.id !== LinkData.id);
        }
      } catch (error) {
        console.error("Failed to parse links file:", error);
        updatedArchivedLinks = [];
      }

      // rewrite file to update the links
      fs.writeFileSync(
        archivedLinksFilePath,
        JSON.stringify(updatedArchivedLinks, null, 2)
      );

      // beep window
      shell.beep();

      return "Link restored successfully.";
    }
  );
};

export default RestoreArchivedLink;
