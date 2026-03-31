import { format } from "date-fns";
import { v4 } from "uuid";
import { generateExportFilename } from "../functions/generate.file.names";
import path from "path";
import { Notification } from "electron";

/**
 * @description exports data to an json file
 * @access public
 * @returns {Promise<any>}
 * @argument {IpcMain, app, shell}
 */
const ExportDataToText = async (
  process: {
    handle: (
      arg0: string,
      arg1: (event: any, data: any[], extension: string) => Promise<string>
    ) => void;
  },
  application: any,
  _shell: any
): Promise<string> => {
  //
  const collectionsFilePath = path.join(
    application.getPath("userData"),
    "Collections",
    "collections.json"
  );

  /**
   * @description exports data to an txt file
   * @access public
   * @returns {Promise<any>}
   * @argument {IpcMain, app, shell}
   */
  process.handle(
    "export-data-to-txt-file",
    async (event, data: any[], extension: string): Promise<any> => {
      console.log("Exporting data to file:", extension);
      // ensure data is an array
      const arrayData = Array.isArray(data) ? data : [data]; // convert to array if not already
      // write data to file on desktop
      const fs = require("fs");

      // convert objects to human-readable strings
      const content = arrayData
        .map((item) => {
          if (typeof item === "string" || typeof item === "number") return item;
          // for objects, format nicely
          return `${item.id} - ${item.title} - ${item.link} - ${
            item._date || ""
          }`;
        })
        .join("\n");

      // Read existing collections.json
      let collections = [];

      if (fs.existsSync(collectionsFilePath)) {
        try {
          collections = JSON.parse(
            fs.readFileSync(collectionsFilePath, "utf8")
          );
        } catch (err) {
          console.error("Failed to parse collections file:", err);
          collections = [];
        }
      }

      // join array elements with new line
      const filePath = generateExportFilename(
        `${Math.ceil(Math.random() * 100)}`,
        extension ? extension : "txt"
      ); // save to desktop

      // Create new collection entry
      const newCollection = {
        id: v4(),
        date_created: format(new Date(), "EEE, MMMM d, yyyy"),
        filepath: filePath,
      };

      // Add to collections array
      collections.push(newCollection); // O(1) -- Constant time complexity -> LIFO

      // Write updated collections.json back to disk
      fs.writeFileSync(
        collectionsFilePath,
        JSON.stringify(collections, null, 2)
      );

      // make window sound for alert
      _shell.beep();

      // send notification of successful deletion
      new Notification({
        title: "Export Created",
        body: `Created export at ${filePath}`,
        icon: "", // replace with native icon
      }).show();

      fs.writeFile(filePath, content, (err: Error) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully to", filePath);
        }
      });
    }
  );

  return "";
};

export default ExportDataToText;
