/**
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const ReadAllLinks = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
  },
  application: any
): Promise<object> => {
  // path to saved_links.json file
  const savedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "saved_links.json"
  );

  //
  process.handle("read-all-existing-links", async (): Promise<object> => {
    // read existing links
    let existingLinks = [];

    // read file and return arr for the links
    try {
      if (savedLinksFilePath) {
        // parse links arr into from stringified obj to an arr[]
        existingLinks = JSON.parse(fs.readFileSync(savedLinksFilePath, "utf8"));
      }
    } catch (error) {
      console.error("Failed to parse links file:", error);
      existingLinks = [];
    }

    return existingLinks;
  });

  return {};
};

export default ReadAllLinks;
