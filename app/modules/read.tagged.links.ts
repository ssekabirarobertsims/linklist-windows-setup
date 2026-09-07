/**
 * @description fetch all existing tagged links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const ReadAllTaggedLinks = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
  },
  application: any,
): Promise<object> => {
  // path to tagged_links.json file
  const taggedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "tagged_links.json",
  );

  //
  process.handle(
    "read-all-existing-tagged-links",
    async (): Promise<object> => {
      // read existing tagged links
      let existingTaggedLinks = [];

      // read file and return arr for the links
      try {
        if (taggedLinksFilePath && fs.existsSync(taggedLinksFilePath)) {
          // parse links arr into from stringified obj to an arr[]
          existingTaggedLinks = JSON.parse(
            fs.readFileSync(taggedLinksFilePath, "utf8"),
          );
        }
      } catch (error) {
        console.error("Failed to parse tagged links file:", error);
        existingTaggedLinks = [];
      }

      return existingTaggedLinks;
    },
  );

  return {};
};

export default ReadAllTaggedLinks;
