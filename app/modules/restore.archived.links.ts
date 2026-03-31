/**
 * @description restore-archived links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import { shell } from "electron";
import path from "node:path";

const RestoreArchivedLinks = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkData: object) => Promise<string>
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
  process.handle(
    "restore-archived-links",
    async (_: any, archivedLinks: any): Promise<string> => {
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
      const newExistingLinksArr = [...existingLinks, ...archivedLinks];

      // write back to file
      fs.writeFileSync(
        savedLinksFilePath,
        JSON.stringify(newExistingLinksArr, null, 2)
      );

      //
      const archivedLinksFilePath = path.join(
        application.getPath("userData"),
        "Archives",
        "archived_links.json"
      );
      // empty archived links back to file
      // read existing links
      let existingLinkArchives = [];

      // append the new link data
      if (fs.existsSync(archivedLinksFilePath)) {
        try {
          existingLinkArchives = JSON.parse(
            fs.readFileSync(archivedLinksFilePath, "utf8")
          );
        } catch (error) {
          console.error("Failed to parse collections file:", error);
          existingLinkArchives = [];
        }
      }

      // write back to file
      fs.writeFileSync(archivedLinksFilePath, JSON.stringify([], null, 2));
      // beep window
      shell.beep();

      return "Links restored successfully.";
    }
  );
};

export default RestoreArchivedLinks;
