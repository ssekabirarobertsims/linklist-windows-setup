/**
 * @description fetch all existing link archives from *.json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";
import PurgeExpiredArchivedLinks from "./purge.expired.archived.links";

const ReadAllLinkArchives = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
  },
  application: any,
): Promise<object> => {
  // path to archived links *.json file
  const archivedLinksFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json",
  );

  //
  process.handle("read-all-link-archives", async (): Promise<object> => {
    PurgeExpiredArchivedLinks(application);

    // read existing links
    let existingLinkArchives = [];

    // read file and return arr for the link archives
    try {
      if (archivedLinksFilePath) {
        // parse links arr into from stringified obj to an arr[]
        existingLinkArchives = JSON.parse(
          fs.readFileSync(archivedLinksFilePath, "utf8"),
        );

        existingLinkArchives = existingLinkArchives.sort(
          (left: any, right: any) => {
            const leftTime = new Date(left?.archivedAt ?? 0).getTime();
            const rightTime = new Date(right?.archivedAt ?? 0).getTime();
            return leftTime - rightTime;
          },
        );
      }
    } catch (error) {
      console.error("Failed to parse links file:", error);
      existingLinkArchives = [];
    }

    return existingLinkArchives;
  });

  return {};
};

export default ReadAllLinkArchives;
