/**
 * @description create a tagged link entry and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import { shell } from "electron";
import path from "node:path";
import fs from "node:fs";

const CreateTaggedLink = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkData: object) => Promise<string>,
    ) => void;
  },
  application: any,
): Promise<any> => {
  const taggedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "tagged_links.json",
  );

  //
  process.handle(
    "create-tagged-link",
    async (event, LinkData: object): Promise<string> => {
      // save the link data to tagged_links.json file
      const normalizedLinkData = LinkData as Record<string, string>;
      const title = normalizedLinkData.title?.trim() || "Tagged link";
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
        `link-${Math.random().toString(36).slice(2, 8)}`;

      const linkEntry = {
        ...normalizedLinkData,
        id: normalizedLinkData.id,
        title,
        originalUrl,
        link: originalUrl,
        shortUrl,
        customAlias,
        description:
          normalizedLinkData.description || "Saved from tagged links",
      };

      // read existing tagged links
      let existingTaggedLinks = [];

      // append the new link data
      if (fs.existsSync(taggedLinksFilePath)) {
        try {
          existingTaggedLinks = JSON.parse(
            fs.readFileSync(taggedLinksFilePath, "utf8"),
          );
        } catch (error) {
          console.error("Failed to parse tagged links file:", error);
          existingTaggedLinks = [];
        }
      }

      // check if link already exists in tagged links
      const linkExists = existingTaggedLinks.some(
        (existingLink: { id: string }) => existingLink.id === linkEntry.id,
      );

      if (!linkExists) {
        // add new link data only if it doesn't already exist
        existingTaggedLinks.push(linkEntry);

        // write back to file
        fs.writeFileSync(
          taggedLinksFilePath,
          JSON.stringify(existingTaggedLinks, null, 2),
        );
      }

      // beep window
      shell.beep();

      return "Tagged link created successfully.";
    },
  );
};

export default CreateTaggedLink;
