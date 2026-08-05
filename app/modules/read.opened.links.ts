/**
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const ReadAllOpenedLinks = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
  },
  application: any,
): Promise<object> => {
  // path to opened_links.json file
  const openedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "opened_links.json",
  );

  //
  process.handle(
    "read-all-existing-opened-links",
    async (): Promise<object> => {
      // read existing links
      let existingLinks = [];

      // read file and return arr for the links
      try {
        if (openedLinksFilePath) {
          // parse links arr into from stringified obj to an arr[]
          existingLinks = JSON.parse(
            fs.readFileSync(openedLinksFilePath, "utf8"),
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

export default ReadAllOpenedLinks;
