/**
 * @description create a tag and save it to the tags JSON file
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

const maximumTagsPerLink = 5;
const maximumTagLength = 15;

const CreateNewLinkTag = async (
  process: {
    handle: (
      channel: string,
      listener: (event: unknown, tagData: LinkTag) => Promise<string>,
    ) => void;
  },
  application: { getPath: (name: "userData") => string },
): Promise<void> => {
  const tagsFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "tags.json",
  );

  process.handle(
    "create-new-link-tag",
    async (_event: unknown, tagData: LinkTag): Promise<string> => {
      let existingTags: LinkTag[] = [];

      if (fs.existsSync(tagsFilePath)) {
        try {
          existingTags = JSON.parse(
            fs.readFileSync(tagsFilePath, "utf8"),
          ) as LinkTag[];
        } catch (error) {
          console.error("Failed to parse tags file:", error);
        }
      }

      const linkTagCount = existingTags.filter(
        (existingTag) => existingTag.taggedLinkId === tagData.taggedLinkId,
      ).length;

      if (linkTagCount >= maximumTagsPerLink) {
        return "A link can have a maximum of 5 tags.";
      }

      if (tagData.tag.trim().length > maximumTagLength) {
        return "Tags must be 15 characters or fewer.";
      }

      existingTags.push(tagData);
      fs.writeFileSync(tagsFilePath, JSON.stringify(existingTags, null, 2));

      return "Link tag created successfully.";
    },
  );
};

export default CreateNewLinkTag;
