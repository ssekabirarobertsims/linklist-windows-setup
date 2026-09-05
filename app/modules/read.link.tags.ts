/**
 * @description fetch all link tags from the tags JSON file
 * @access public
 * @returns {Promise<void>}
 */

import fs from "node:fs";
import path from "node:path";

type LinkTag = {
  tagId: string;
  taggedLinkId: string;
  _tagDate: string;
  _tagTime: string;
  tag: string;
};

const ReadAllLinkTags = async (
  process: {
    handle: (channel: string, listener: () => Promise<LinkTag[]>) => void;
  },
  application: { getPath: (name: "userData") => string },
): Promise<void> => {
  const tagsFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "tags.json",
  );

  process.handle("read-all-link-tags", async (): Promise<LinkTag[]> => {
    if (!fs.existsSync(tagsFilePath)) {
      return [];
    }

    try {
      return JSON.parse(fs.readFileSync(tagsFilePath, "utf8")) as LinkTag[];
    } catch (error) {
      console.error("Failed to parse tags file:", error);
      return [];
    }
  });
};

export default ReadAllLinkTags;
