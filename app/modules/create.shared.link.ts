/**
 * @description create links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import { shell } from "electron";
import path from "node:path";
import { v4 } from "uuid";

const CreateNewSharedLink = async (
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
    "shared_links.json",
  );

  //
  process.handle(
    "create-new-shared-link",
    async (event, LinkData: object): Promise<string> => {
      // save the link data to shared_links.json file
      const fs = require("fs");
      const normalizedLinkData = LinkData as Record<string, string>;
      const title = normalizedLinkData.title?.trim() || "Shared link";
      const originalUrl =
        normalizedLinkData.originalUrl || normalizedLinkData.link || "";
      const shortUrl =
        normalizedLinkData.shortUrl ||
        `ll://${Math.random().toString(36).slice(2, 8)}`;
      const customAlias =
        normalizedLinkData.customAlias ||
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        `link-${v4().slice(0, 6)}`;

      const linkEntry = {
        ...normalizedLinkData,
        id: normalizedLinkData.id || v4(),
        title,
        originalUrl,
        link: originalUrl,
        shortUrl,
        customAlias,
        description:
          normalizedLinkData.description || "Saved from shared links",
      };

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
      existingLinks.push(linkEntry);

      // write back to file
      fs.writeFileSync(
        savedLinksFilePath,
        JSON.stringify(existingLinks, null, 2),
      );

      // beep window
      shell.beep();

      return "New shared link created successfully.";
    },
  );
};

export default CreateNewSharedLink;
