/**
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const ReadAllSharedLinks = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
  },
  application: any,
): Promise<object> => {
  // path to shared_links.json file
  const sharedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "shared_links.json",
  );

  //
  process.handle(
    "read-all-existing-shared-links",
    async (): Promise<object> => {
      // read existing links
      let existingLinks = [];

      // read file and return arr for the links
      try {
        if (sharedLinksFilePath) {
          // parse links arr into from stringified obj to an arr[]
          existingLinks = JSON.parse(
            fs.readFileSync(sharedLinksFilePath, "utf8"),
          );
        }
      } catch (error) {
        console.error("Failed to parse links file:", error);
        existingLinks = [];
      }

      return existingLinks;
    },
  );

  return {};
};

export default ReadAllSharedLinks;
