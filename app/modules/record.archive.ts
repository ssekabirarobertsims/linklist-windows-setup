/**
 * @description create links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";

const RecordNewLinkArchive = async (
  application: any,
  LinkData: object,
  LinkID: string
): Promise<any> => {
  const archivedLinksFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json"
  );

  const fs = require("fs");

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

  // add new link data
  existingLinkArchives.push(LinkData);

  // write back to file
  fs.writeFileSync(
    archivedLinksFilePath,
    JSON.stringify(existingLinkArchives, null, 2)
  );

  return "New link archive recorded.";
};

export default RecordNewLinkArchive;
