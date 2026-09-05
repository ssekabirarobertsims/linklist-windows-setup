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
  clipboard,
} from "electron";
import os from "node:os";
import { v4 } from "uuid";
const checkDiskSpace = require("check-disk-space").default;

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
console.log(os.userInfo());
console.log(os.hostname());

// native icon for the application
const nativeIcon: string = nativeImage.createFromPath(
  path.join("../../public/icons/linklist-logo.jpg"),
) as unknown as string;

// set application name before starting up
app.setName("Linklist");

const savedLinksFilePath = path.join(
  app.getPath("userData"),
  "Links",
  "saved_links.json",
);

const normalizeClipboardUrl = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return trimmedValue;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (/^www\./i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  return trimmedValue;
};

const isLikelyUrl = (value: string): boolean => {
  const normalizedValue = normalizeClipboardUrl(value);

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(
      normalizedValue.startsWith("http")
        ? normalizedValue
        : `https://${normalizedValue}`,
    );
    return Boolean(parsedUrl.hostname);
  } catch (error) {
    return false;
  }
};

const generateShortCode = (): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";

  for (let index = 0; index < 6; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return value;
};

const createCustomAlias = (value: string): string => {
  const normalizedValue = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalizedValue || `link-${generateShortCode()}`;
};

const buildClipboardLinkEntry = (
  value: string,
  overrides: Partial<Record<string, string>> = {},
): Record<string, string> => {
  const normalizedValue = normalizeClipboardUrl(value);
  const parsedUrl = new URL(
    normalizedValue.startsWith("http")
      ? normalizedValue
      : `https://${normalizedValue}`,
  );
  const title =
    overrides.title?.trim() ||
    parsedUrl.hostname.replace(/^www\./i, "") ||
    "Clipboard link";
  const description =
    overrides.description?.trim() || "Saved from clipboard automatically";
  const shortUrl = `ll://${generateShortCode()}`;

  return {
    id: v4(),
    title,
    originalUrl: normalizedValue,
    link: normalizedValue,
    shortUrl,
    customAlias: createCustomAlias(title),
    user_id: "",
    _date: format(new Date(), "EEE, MMMM d, yyyy"),
    description,
  };
};

const persistLinkEntry = (linkEntry: Record<string, string>): boolean => {
  let existingLinks: Array<Record<string, string>> = [];

  if (fs.existsSync(savedLinksFilePath)) {
    try {
      const fileContent = fs.readFileSync(savedLinksFilePath, "utf8");
      existingLinks = JSON.parse(fileContent) as Array<Record<string, string>>;
    } catch (error) {
      console.error("Failed to parse saved links file:", error);
      existingLinks = [];
    }
  }

  const originalUrl = String(
    linkEntry.originalUrl ?? linkEntry.link ?? "",
  ).trim();
  const alreadySaved = existingLinks.some((existingLink) => {
    const existingUrl = String(
      existingLink.originalUrl ?? existingLink.link ?? "",
    ).trim();
    return existingUrl.toLowerCase() === originalUrl.toLowerCase();
  });

  if (alreadySaved) {
    return false;
  }

  existingLinks.push(linkEntry);
  fs.writeFileSync(savedLinksFilePath, JSON.stringify(existingLinks, null, 2));
  shell.beep();

  return true;
};

const saveClipboardLink = (value: string): boolean => {
  const normalizedValue = normalizeClipboardUrl(value);

  if (!isLikelyUrl(normalizedValue)) {
    return false;
  }

  return persistLinkEntry(buildClipboardLinkEntry(normalizedValue));
};

let lastClipboardCheckValue = "";
let isClipboardPromptOpen = false;

const triggerClipboardCheck = (): void => {
  if (!app.isReady() || isClipboardPromptOpen) {
    return;
  }

  try {
    const clipboardValue = clipboard.readText().trim();

    if (!clipboardValue || clipboardValue === lastClipboardCheckValue) {
      return;
    }

    if (!isLikelyUrl(clipboardValue)) {
      lastClipboardCheckValue = clipboardValue;
      return;
    }

    lastClipboardCheckValue = clipboardValue;
    isClipboardPromptOpen = true;

    const mainWindow = BrowserWindow.getAllWindows().find(
      (windowInstance) => !windowInstance.isDestroyed(),
    );
    const promptPayload = {
      title: new URL(
        clipboardValue.startsWith("http")
          ? clipboardValue
          : `https://${clipboardValue}`,
      ).hostname.replace(/^www\./i, ""),
      url: clipboardValue,
      description: `Saved from clipboard on ${format(new Date(), "MMM d, yyyy")}`,
    };

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send("clipboard-link-detected", promptPayload);
    }
    isClipboardPromptOpen = false;
  } catch (error) {
    isClipboardPromptOpen = false;
    console.error("Clipboard monitor failed:", error);
  }
};

const startClipboardMonitor = (): void => {
  triggerClipboardCheck();
  setInterval(() => {
    triggerClipboardCheck();
  }, 3000);
};

// import function to check user information file tree
import CreateRequiredApplicationFileSystem from "../functions/create.required.application.file.system";
CreateRequiredApplicationFileSystem(); // invoke the function to check user information file tree on app start

import StartBackgroundManager from "../background/background.manager";
StartBackgroundManager();

const isBackgroundLaunch = process.argv.includes("--background");

import PurgeExpiredArchivedLinks from "../modules/purge.expired.archived.links.js";
PurgeExpiredArchivedLinks(app);
setInterval(() => PurgeExpiredArchivedLinks(app), 60 * 1000);

// open application to start
app.on("ready", (): void => {
  app.setLoginItemSettings({
    openAtLogin: true,
    args: ["--background"],
  });

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
    path.join(__dirname, "../../../app/windows/Application.Splash.Window.html"),
  );
  if (!isBackgroundLaunch) {
    ApplicationSplashWindow.show(); // show the application splash window
  }

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
        "../context/application.context.bridge.js",
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
    if (isBackgroundLaunch) {
      ApplicationSplashWindow.close();
      startClipboardMonitor();
      return;
    }

    global.setTimeout((): void => {
      ApplicationSplashWindow.close(); // close the application splash window
      ApplicationMainWindow.show(); // show the application main window
      ApplicationMainWindow.maximize(); // maximize the application main window
      startClipboardMonitor();
    }, 7000);
  });
});

/**
 * @description provide info about the sys for the machine and the app it'self
 * @function get-system-information
 * @return {Promise<object>}
 */

ipcMain.handle("get-system-information", async (): Promise<object> => {
  const diskPath = os.platform() === "win32" ? "C:/" : "/";
  const diskInfo = await checkDiskSpace(diskPath);
  const totalMemoryGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
  const freeMemoryGB = Math.round(os.freemem() / (1024 * 1024 * 1024));
  const usedMemoryGB = totalMemoryGB - freeMemoryGB;

  return {
    appVersion: app.getVersion(),
    systemVersion: os.version(),
    platform: os.platform(),
    release: os.release(),
    deviceName: os.hostname(),
    registeredUser: os.userInfo().username,
    totalMemoryGB,
    usedMemoryGB,
    freeMemoryGB,
    diskTotalGB: Number((diskInfo.size / (1024 * 1024 * 1024)).toFixed(2)),
    diskFreeGB: Number((diskInfo.free / (1024 * 1024 * 1024)).toFixed(2)),
    diskUsedGB: Number(
      ((diskInfo.size - diskInfo.free) / (1024 * 1024 * 1024)).toFixed(2),
    ),
    diskUsagePercent: Number(
      (((diskInfo.size - diskInfo.free) / diskInfo.size) * 100).toFixed(1),
    ),
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
  },
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
  },
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
  "collections.json",
);
const archivesFilePath = path.join(
  app.getPath("userData"),
  "Archives",
  "archived_links.json",
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

const generateRandomDescription = (): string => {
  const descriptions = [
    "This link was quickly saved from your clipboard for convenient access later. It has not yet been reviewed or categorized, so the information shown may be incomplete. Open the link when you're ready, add notes, assign tags, or move it into a collection to keep your workspace organized",
    "A new link has been captured directly from your clipboard and securely stored in your local LinkList library. This temporary description serves as a placeholder until you personalize it. Consider updating the title, adding meaningful notes, assigning tags, or placing it into the appropriate collection to make it easier to find and manage in the future.",
    "This resource was automatically saved after being detected in your clipboard, ensuring you don't lose important web pages, articles, videos, or documents. While the original URL has been preserved, you can improve its organization by editing the description, attaching files, adding reminders, marking it as a favorite, or retrieving additional online information using the About This Link feature whenever you're connected to the internet.",
    "This link is waiting to be reviewed and organized. It was added through the Clipboard Monitor for quick and effortless saving, allowing you to continue your work without interruption. Before archiving or sharing this resource, you may wish to verify its contents, customize its details, assign tags, add personal notes, and fetch website information to create a richer and more searchable entry in your LinkList library..",
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

ipcMain.handle(
  "save-clipboard-link",
  async (_event, linkData: Record<string, string>): Promise<string> => {
    if (
      !linkData ||
      !String(linkData.originalUrl ?? linkData.link ?? "").trim()
    ) {
      return "No link data was provided.";
    }

    const entry = {
      ...linkData,
      id: linkData.id || v4(),
      title: linkData.title || "Clipboard link",
      originalUrl: normalizeClipboardUrl(
        String(linkData.originalUrl ?? linkData.link ?? ""),
      ),
      link: normalizeClipboardUrl(
        String(linkData.originalUrl ?? linkData.link ?? ""),
      ),
      shortUrl: linkData.shortUrl || `ll://${generateShortCode()}`,
      customAlias:
        linkData.customAlias ||
        createCustomAlias(linkData.title || "Clipboard link"),
      user_id: linkData.user_id || "",
      _date: linkData._date || format(new Date(), "EEE, MMMM d, yyyy"),
      description: linkData.description || generateRandomDescription(),
    };

    const didSave = persistLinkEntry(entry);
    return didSave ? "Link saved successfully." : "Link was already saved.";
  },
);

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
import CreateNewLink from "../modules/create.link";
CreateNewLink(ipcMain, app);

/**
 * @function
 * @description create opened links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */
// path to opened_links.json file
const openedLinksFilePath = path.join(
  app.getPath("userData"),
  "Links",
  "opened_links.json",
);
import CreateNewOpenedLink from "../modules/create.opened.link";
CreateNewOpenedLink(ipcMain, app);

/**
 * @function
 * @description create shared links and save to json file
 * @access public
 * @returns {Promise<any>}
 *  @argument {IpcMain, app}
 */
// path to shared_links.json file
const sharedLinksFilePath = path.join(
  app.getPath("userData"),
  "Links",
  "shared_links.json",
);
import CreateNewSharedLink from "../modules/create.shared.link";
CreateNewSharedLink(ipcMain, app);

/**
 * @description create tags and save them to a JSON file
 */
import CreateNewLinkTag from "../modules/create.link.tag.js";
CreateNewLinkTag(ipcMain, app);

/**
 * @description fetch tags from the tags JSON file
 */
import ReadAllLinkTags from "../modules/read.link.tags";
ReadAllLinkTags(ipcMain, app);

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
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import ReadAllOpenedLinks from "../modules/read.opened.links";
ReadAllOpenedLinks(ipcMain, app);

/**
 * @function
 * @description fetch all existing links from json file
 * @access public
 * @returns {Promise<object>}
 *  @argument {IpcMain, app}
 */
import ReadAllSharedLinks from "../modules/read.shared.links";
ReadAllSharedLinks(ipcMain, app);

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
 * @description fetch the last created backup by user
 * @access public
 * @returns {Promise<object>}
 * @argument {IpcMain, app}
 */
import FindAllRecentBackup from "../backups/all.backups";
FindAllRecentBackup(ipcMain, app);

/**
 * @function
 * @description create user information after maybe sign up
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
