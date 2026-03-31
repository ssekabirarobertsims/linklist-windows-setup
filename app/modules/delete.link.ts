/**
 * @description delete an existing link from json file
 * @access public
 * @returns {Promise<string>}
 *  @argument {IpcMain, app}
 */
import path from "node:path";
import fs from "node:fs";
import RecordNewLinkArchive from "./record.archive";

const DeleteExistingLink = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, LinkData: object, LinkID: string) => Promise<any>
    ) => void;
  },
  application: any
): Promise<string> => {
  // path to saved_links.json file
  const savedLinksFilePath = path.join(
    application.getPath("userData"),
    "Links",
    "saved_links.json"
  );

  //
  process.handle(
    "delete-existing-link",
    async (event: any, LinkData: object, LinkID: string): Promise<any> => {
      // read existing links
      let updatedLinks = [];

      // read file and return arr for the links
      try {
        if (savedLinksFilePath) {
          // parse links arr into from stringified obj to an arr[] and filter out links !== id
          updatedLinks = JSON.parse(
            fs.readFileSync(savedLinksFilePath, "utf8")
          ).filter((link: { id: string }) => link.id !== LinkID);
        }
      } catch (error) {
        console.error("Failed to parse links file:", error);
        updatedLinks = [];
      }

      // rewrite file to update the links
      fs.writeFileSync(
        savedLinksFilePath,
        JSON.stringify(updatedLinks, null, 2)
      );

      RecordNewLinkArchive(application, LinkData, LinkID); // record new link archive

      return "Link has been deleted!";
    }
  );
  return "";
};

export default DeleteExistingLink;
