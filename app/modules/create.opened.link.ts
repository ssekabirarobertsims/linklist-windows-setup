/**
 * @description create links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import { shell } from "electron";
import path from "node:path";

const CreateNewOpenedLink = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkData: object) => Promise<string>,
    ) => void;
  },
  application: any,
): Promise<any> => {
  const savedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "opened_links.json",
  );

  //
  process.handle(
    "create-new-opened-link",
    async (event, LinkData: object): Promise<string> => {
      // save the link data to opened_links.json file
      const fs = require("fs");

      // read existing links
      let existingLinks = [];

      // append the new link data
      if (fs.existsSync(savedLinksFilePath)) {
        try {
          existingLinks = JSON.parse(
            fs.readFileSync(savedLinksFilePath, "utf8"),
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
        JSON.stringify(existingLinks, null, 2),
      );

      // beep window
      shell.beep();

      return "New opened link created successfully.";
    },
  );
};

export default CreateNewOpenedLink;
