import path from "path";
import {
  nativeImage,
  BrowserWindow,
  app,
  Menu,
  ipcMain,
  shell,
  Notification,
  IpcMain,
} from "electron";

/**
 *
 * @function @author ssekabira robert sims
 * @description main process for the application
 * @returns {void}
 * @access public
 * @license MIT
 *
 */

// UUID for generating unique filenames
// import { v4 } from "uuid";
// function to generate export filename
import { generateExportFilename } from "../functions/generate.file.names";
import fs from "node:fs";
import { format } from "date-fns";
import os from "node:os";
// console.log(os.userInfo());

// native icon for the application
const nativeIcon: string = nativeImage.createFromPath(
  path.join("../../public/icons/linklist-logo.jpg")
) as unknown as string;

// set application name before starting up
app.setName("Linklist");

// import function to check user information file tree
import CreateRequiredApplicationFileSystem from "../functions/create.required.application.file.system";
CreateRequiredApplicationFileSystem(); // invoke the function to check user information file tree on app start

// open application to start
app.on("ready", (): void => {
  // // hide all templates for menus
  // const menu = Menu.buildFromTemplate([]);
  // Menu.setApplicationMenu(menu); // set it to be shown at the application level of the application window

  /**
   *
   * @function @return {void}
   * @description splash window for the application
   */
  const ApplicationSplashWindow = new BrowserWindow({
    height: 500,
    width: 800,
    resizable: false,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    movable: true,
    icon: nativeIcon,
  });

  // remove menu from the splash window
  // ApplicationSplashWindow.setMenu(null);

  // load file for the splash window
  ApplicationSplashWindow.loadFile(
    path.join(__dirname, "../../../app/windows/Application.Splash.Window.html")
  );
  ApplicationSplashWindow.show(); // show the application splash window

  /**
   *
   * @function @return {void}
   * @description main window for the application
   */
  const ApplicationMainWindow = new BrowserWindow({
    height: 5012,
    minHeight: 5012,
    width: 1800,
    // icon: nativeIcon,
    webPreferences: {
      preload: path.resolve(
        app.getAppPath(),
        "../context/application.context.bridge.js"
      ),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  // remove menu from the main window
  // ApplicationMainWindow.setMenu(null);

  // load file for the application or server to show app window
  // development area
  ApplicationMainWindow.loadURL("http://localhost:5173");
  // production area
  // ApplicationMainWindow.loadFile(
  //   path.join(__dirname, "../../desktop/index.html")
  // );

  /**
   *
   * @function @return {void}
   * @description load the main window after sometime then hide the splash windows
   */
  ApplicationMainWindow.on("ready-to-show", () => {
    global.setTimeout((): void => {
      ApplicationSplashWindow.close(); // close the application splash window
      ApplicationMainWindow.show(); // show the application main window
      ApplicationMainWindow.maximize(); // maximize the application main window
    }, 7000);
  });
});

/**
 * @description provide info about the sys for the machine and the app it'self
 * @function get-system-information
 * @return {Promise<object>}
 */

ipcMain.handle("get-system-information", async (): Promise<object> => {
  return {
    appVersion: app.getVersion(),
    systemVersion: os.version(),
    now: format(new Date(), "EEE, MMMM d, yyyy"),
  };
});

// handle opening external links
/**
 * @function export-data-to-file
 *
 * @function @author ssekabira robert sims
 * @description opens external links in the user's default browser
 * @returns {Promise<any>}
 */
ipcMain.handle(
  "open-external-link",
  async (event, url: string): Promise<any> => {
    await shell.openExternal(url);
    shell.beep(); // make window sound for alert
    await console.log(`Opened external link: ${url}`);
  }
);

/**
 *
 * @function @function show-item-in-folder
 * @description show item in folder in windows explorer
 * @access public
 * @returns {Promise<void>}
 * @argument {_, path}
 */
ipcMain.handle(
  "show-item-in-folder",
  async (_: any, pathToShowItemInFolder: string): Promise<void> => {
    // open in windows file explorer
    await shell.showItemInFolder(pathToShowItemInFolder);
  }
);

/**
 * @function export-data-to-file
 * @function @author ssekabira robert sims
 * @description exports data to different files of diff formats (*.html, *.json & *.txt) on the user's desktop
 * @returns {Promise<any>}
 */

// Helper function to ensure directory exists
const ensureDirectoryExists = (filePath: string): void => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const collectionsFilePath = path.join(
  app.getPath("userData"),
  "Collections",
  "collections.json"
);
const archivesFilePath = path.join(
  app.getPath("userData"),
  "Archives",
  "archived_links.json"
);

/**
 * @function
 * @description exports data to an txt file
 * @access public
 * @returns {Promise<any>}
 * @argument {IpcMain, app, shell}
 */
import ExportDataToText from "../exports/export.data.to.text";
ExportDataToText(ipcMain, app, shell);

/**
 * @function
 * @description exports data to an json file
 * @access public
 * @returns {Promise<any>}
 * @argument {IpcMain, app, shell}
 */
import ExportDataToJSObjects from "../exports/export.data.to.javascript.objects";
ExportDataToJSObjects(ipcMain, app, shell);

/**
 * @function
 *  @description exports data to an html file
 * @access public
 * @returns {Promise<any>}
 * @argument {IpcMain, app, shell}
 */
import ExportDataToBrowserDoc from "../exports/export.links.data.to.browser.doc.file";
ExportDataToBrowserDoc(ipcMain, app, shell);

/**
 * @function
 * @description close applications manually
 * @access public
 * @returns {Promise<void>}
 */
ipcMain.handle("close-application", async (): Promise<void> => {
  // quit the application
  app.quit();
});

/**
 * @function
 * @description fetch collections data from json file
 * @access public
 * @returns {Promise<any>}
 */
ipcMain.handle("read-collections-data", async (): Promise<any> => {
  const fs = require("fs");
  // Read existing collections.json
  let collections = [];
  if (fs.existsSync(collectionsFilePath)) {
    try {
      collections = JSON.parse(fs.readFileSync(collectionsFilePath, "utf8"));
    } catch (err) {
      console.error("Failed to parse collections file:", err);
      collections = [];
    }
  }
  return collections;
});

/**
 * @function
 * @description delete an existing link from json file
 * @access public
 * @returns {Promise<string>}
 */
import DeleteExistingCollection from "../exports/delete.collection";
DeleteExistingCollection(ipcMain, app, shell);

/**
 * @function
 * @description create links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */
// path to saved_links.json file
const savedLinksFilePath = path.join(
  app.getPath("userData"),
  "Links",
  "saved_links.json"
);
import CreateNewLink from "../modules/create.link";
CreateNewLink(ipcMain, app);

/**
 * @function
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import ReadAllLinks from "../modules/read.links";
ReadAllLinks(ipcMain, app);

/**
 * @function
 * @description delete an existing link from json file
 * @access public
 * @returns {Promise<string>}
 *  @argument {IpcMain, app}
 */
import DeleteExistingLink from "../modules/delete.link";
DeleteExistingLink(ipcMain, app);

/**
 * @function
 * @description restore a single link and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */
import RestoreArchivedLink from "../modules/restore.archived.link";
RestoreArchivedLink(ipcMain, app);

/**
 * @function
 * @description restore multiple links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */
import RestoreArchivedLinks from "../modules/restore.archived.links";
RestoreArchivedLinks(ipcMain, app);

/**
 * @function
 * @description create backup for all user saved data
 * @access public
 * @returns {Promise<void>}
 * @argument {IpcMain, app}
 */
import UserDataBackups from "../backups/user.data.backup";
UserDataBackups(ipcMain, app);

/**
 * @function
 * @description create backup for the application
 * @access public
 * @returns {Promise<void>}
 * @argument {IpcMain, app}
 */
import ApplicationBackups from "../backups/application.backup";
ApplicationBackups(ipcMain, app);

/**
 * @function
 * @description fetch the last created backup by user
 * @access public
 * @returns {Promise<object>}
 * @argument {IpcMain, app}
 */
import FindRecentBackup from "../backups/recent.backup";
FindRecentBackup(ipcMain, app);

/**
 * @function
 * @description create user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
 */
import CreateUserInformation from "../auth/create.user.information";
CreateUserInformation(ipcMain, app);

/**
 * @function
 * @description read user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
 */
import ReadUserInformation from "../auth/read.user.information";
ReadUserInformation(ipcMain, app);

/**
 * @function
 * @description delete user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
 */
import DeleteUserInformation from "../auth/delete.user.information";
DeleteUserInformation(ipcMain, app);

/**
 * @function
 * @description fetch all existing link archives from *.json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import ReadAllLinkArchives from "../modules/read.link.archives";
ReadAllLinkArchives(ipcMain, app);

/**
 * @function
 * @description fetch all existing link archives from *.json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import DeleteExistingArchivedLink from "../modules/delete.archived.link";
DeleteExistingArchivedLink(ipcMain, app);

/**
 * @function
 * @description fetch all existing link archives from *.json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import DeleteExistingArchivedLinks from "../modules/delete.archived.links";
DeleteExistingArchivedLinks(ipcMain, app);
