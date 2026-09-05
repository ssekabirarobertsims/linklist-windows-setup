import { contextBridge, ipcRenderer } from "electron";

/**
 * @author ssekabira robert sims
 * @access public
 * @description context bridge to expose apis to the main app
 * @returns {void} - exposes apis to the main app
 */

// create context bridge and expose it to main app
contextBridge?.exposeInMainWorld("app_api", {
  // close app manually
  exitApplication: (): Promise<any> => ipcRenderer.invoke("close-application"),
  // open external links
  openExternalLink: (url: string): Promise<any> =>
    ipcRenderer.invoke("open-external-link", url),
  // export data to *.html file
  exportDataToHTMLFile: (
    data: (string | number)[],
    extension: string,
    category: string,
  ): Promise<any> =>
    ipcRenderer.invoke("export-data-to-html-file", data, extension, category),
  // export data to *.txt file
  exportDataToTXTFile: (
    data: (string | number)[],
    extension: string,
    category: string,
  ): Promise<any> =>
    ipcRenderer.invoke("export-data-to-txt-file", data, extension, category),
  // export data to *.json file
  exportDataToJSONFile: (
    data: (string | number)[],
    extension: string,
    category: string,
  ): Promise<any> =>
    ipcRenderer.invoke("export-data-to-json-file", data, extension, category),
  // provide system information for the machine running the app
  systemInformation: (): Promise<any> =>
    ipcRenderer.invoke("get-system-information"),
  // fetch collections data from json file
  readCollectionsData: (): Promise<any> =>
    ipcRenderer.invoke("read-collections-data"),
  deleteExistingCollection: (
    collectionId: string,
    collectionPath: string,
  ): Promise<string> =>
    ipcRenderer.invoke(
      "delete-existing-collection",
      collectionId,
      collectionPath,
    ), // filter out links.id !== collectionId
  // create new links to a json file or db
  createNewLink: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("create-new-link", LinkData),
  // create new links to a json file or db
  createNewOpenedLink: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("create-new-opened-link", LinkData),
  // create new links to a json file or db
  createNewSharedLink: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("create-new-shared-link", LinkData),
  // create a tag for an existing link
  createNewLinkTag: (tagData: object): Promise<string> =>
    ipcRenderer.invoke("create-new-link-tag", tagData),
  // fetch all link tags
  readAllLinkTags: (): Promise<object> =>
    ipcRenderer.invoke("read-all-link-tags"),
  // fetch all existing links
  readAllExistingLinks: (): Promise<object> =>
    ipcRenderer.invoke("read-all-existing-links"),
  // fetch all existing links
  readAllExistingOpenedLinks: (): Promise<object> =>
    ipcRenderer.invoke("read-all-existing-opened-links"),
  // fetch all existing links
  readAllExistingSharedLinks: (): Promise<object> =>
    ipcRenderer.invoke("read-all-existing-shared-links"),
  // update existing link data
  updateExistingLink: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("update-existing-link", LinkData),
  // delete existing link data
  deleteExistingLink: (LinkData: object, LinkID: string): Promise<string> =>
    ipcRenderer.invoke("delete-existing-link", LinkData, LinkID), // filter out links.id !== LinkID
  // restore archive link to a json file or db
  restoreArchivedLink: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("restore-archived-link", LinkData),
  // restore archive links to a json file or db
  restoreArchivedLinks: (archivedLinks: any): Promise<string> =>
    ipcRenderer.invoke("restore-archived-links", archivedLinks),
  recordNewLinkArchive: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("record-new-link-archive", LinkData),
  // fetch all existing link archives
  readAllLinkArchives: (LinkData: object): Promise<string> =>
    ipcRenderer.invoke("read-all-link-archives", LinkData),
  // delete existing archive link data
  deleteExistingArchivedLink: (LinkID: string): Promise<string> =>
    ipcRenderer.invoke("delete-existing-archived-link", LinkID), // filter out links.id !== LinkID
  // delete existing link data
  deleteExistingArchivedLinks: (): Promise<string> =>
    ipcRenderer.invoke("delete-existing-archived-links"), // arr = []
  // backup for data
  createLocalDataBackup: (): Promise<string> =>
    ipcRenderer.invoke("create-local-data-backup"),
  // backup for application
  createLocalApplicationBackup: (): Promise<string> =>
    ipcRenderer.invoke("create-local-application-backup"),
  // fetch the last backup created by user
  readRecentBackup: (): Promise<object> =>
    ipcRenderer.invoke("read-recent-backup"),
  // fetch the last backup created by user
  readAllRecentBackup: (): Promise<object> =>
    ipcRenderer.invoke("read-all-recent-backup"),
  /**
   * @description handle all user CRUD operations
   * @author ssekabira robert sims
   * @return {user information}
   */
  // read user saved information
  readUserInformation: async (): Promise<any> =>
    ipcRenderer.invoke("read-user-information"),
  // update user information
  updateUserInformation: async (): Promise<any> =>
    ipcRenderer.invoke("update-user-information"),
  // save user information
  createUserInformation: async (user: object): Promise<any> =>
    ipcRenderer.invoke("create-user-information", user),
  // delete user information
  deleteUserInformation: async (): Promise<any> =>
    ipcRenderer.invoke("delete-user-information"),
  // copy profile img
  copyFiles: async (): Promise<any> => ipcRenderer.invoke("copy-files"),
  // open file location in windows explorer
  showItemInFolder: async (pathToShowItemInFolder: string): Promise<any> =>
    ipcRenderer.invoke("show-item-in-folder", pathToShowItemInFolder),

  /**
   * @description alert requests from renderer(ui)
   * @function alert-users
   */
  copyLink: async (): Promise<void> => ipcRenderer.invoke("copy-link"),
  listenForClipboardLink: (
    callback: (payload: unknown) => void,
  ): (() => void) => {
    const handler = (_event: unknown, payload: unknown): void =>
      callback(payload);
    ipcRenderer.on("clipboard-link-detected", handler);
    return (): void => {
      ipcRenderer.removeListener("clipboard-link-detected", handler);
    };
  },
  saveClipboardLinkFromPrompt: async (linkData: object): Promise<any> =>
    ipcRenderer.invoke("save-clipboard-link", linkData),
  // ///////////
});
