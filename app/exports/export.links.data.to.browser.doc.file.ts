import { format } from "date-fns";
import { v4 } from "uuid";
import { generateExportFilename } from "../functions/generate.file.names";
import path from "path";
import { Notification } from "electron";

/**
 *  @description exports data to an html file
 * @access public
 * @returns {Promise<any>}
 * @argument {IpcMain, app, shell}
 */
const ExportDataToBrowserDoc = async (
  process: {
    handle: (
      arg0: string,
      arg1: (
        event: any,
        data: any[],
        extension: string,
        category: string
      ) => Promise<string>
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
   *  @description exports data to an html file
   * @access public
   * @returns {Promise<any>}
   * @argument {IpcMain, app, shell}
   */
  process.handle(
    "export-data-to-html-file",
    async (
      event,
      data: any[],
      extension: string,
      category: string
    ): Promise<any> => {
      console.log("Exporting data to file:", extension);

      const fs = require("fs");

      // normalize data
      const arrayData = Array.isArray(data) ? data : [data];

      // generate output file path
      const filePath = generateExportFilename(
        `${Math.ceil(Math.random() * 100)}`,
        extension || "html"
      );

      // Build HTML table rows
      const tableRows = arrayData
        .map((item) => {
          return `
        <tr>
          <td>${item?.id || ""}</td>
          <td>${item?.title || ""}</td>
          <td>${item?.link || ""}</td>
        </tr>
      `;
        })
        .join(""); // <-- IMPORTANT

      // Full HTML content
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Exported Collection</title>
<style>
  body {
    font-family: Arial, sans-serif;
    padding: 2em;
    background: #fff;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
  }
  th, td {
    padding: 0.5em;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  th {
    background: #f0f0f0;
    font-weight: bold;
  }
</style>
</head>
<body>

<h1>Exported Collection from ${category}</h1>
<h2>Export Id: ${v4()}</h2>
<span style="font-size: 1em; color: hsl(0, 0%, 10%)">Successfully exported ${
        arrayData.length
      } links.</span>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Title</th>
      <th>Link</th>
    </tr>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>

<p style="margin-top: 2em; color: #2e2e2eff;">
  Export Date: ${format(new Date(), "EEE, MMMM d, yyyy")}
</p>

</body>
</html>
`;

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

      // Write the HTML file
      fs.writeFile(filePath, htmlContent, (err: Error) => {
        if (err) {
          console.error("Error writing HTML file:", err);
        } else {
          console.log("HTML file written successfully:", filePath);
        }
      });
    }
  );

  return "";
};

export default ExportDataToBrowserDoc;
