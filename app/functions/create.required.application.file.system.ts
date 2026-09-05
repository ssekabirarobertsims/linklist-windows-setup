import fs from "node:fs";
import { app } from "electron";
import path from "node:path";
import { v4 } from "uuid";
import { format } from "date-fns";
import os from "os";

/**
 * @description Checks and creates user information file tree if not exists
 * @access public
 * @author ssekabira robert sims
 * @arguments none
 * @returns {Promise<void>}
 */

const CreateRequiredApplicationFileSystem = async (): Promise<void> => {
  // root dir file for linklist
  const rootDir = fs.existsSync(path.join(app.getPath("appData"), "Linklist"));
  !rootDir ? fs.mkdirSync(path.join(app.getPath("appData"), "Linklist")) : null;

  // collections.json file
  const collectionsFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "Collections",
      "collections.json",
    ),
  );

  const generateCollectionsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Collections"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Collections",
        "collections.json",
      ),
      JSON.stringify([]),
    );
  };

  !collectionsFile ? generateCollectionsFileStructure() : null;

  // settings.json file
  const settingsFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Settings", "settings.json"),
  );

  const generateSettingsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Settings"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Settings",
        "settings.json",
      ),
      JSON.stringify({
        appTheme: "dark",
        appLanguage: "en",
        autoCheckForUpdates: true,
        defaultBrowserNewTab: false,
        defaultSaveFileFormat: "*.json",
        enableNotifications: true,
        showAppInMenuBar: false,
        startAppOnSystemStartup: false,
      }),
    );
  };

  !settingsFile ? generateSettingsFileStructure() : null;

  // user information file (username, name, email, profile pic path etc)
  const userInformationFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "User",
      "user_information.json",
    ),
  );

  const generateUserInformationFileStructure = async (): Promise<void> => {
    // random number
    const randomAvatarNumber: number = Math.floor(Math.random() * 11);
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "User"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "User",
        "user_information.json",
      ),
      JSON.stringify(
        {
          username: os.userInfo().username,
          name: os.hostname(),
          id: `${v4()}`,
          avatar: `/avatars/avatar-${randomAvatarNumber}.webp`,
          loggedIn: false,
          signed_in: false,
          login_date: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
          bio: `Hi, i am ${os.hostname()}, i am a user of Linklist, i am using this software to manage my links and bookmarks in a more efficient way. I enjoy saving links in order to cut on the cost of saving videos and webpages.
                   `,
          joined: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
        },
        null,
        2,
      ),
    );
  };

  !userInformationFile ? generateUserInformationFileStructure() : null;

  // saved links information file
  const savedLinksFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Links", "saved_links.json"),
  );

  const generateSavedLinksFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Links"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Links",
        "saved_links.json",
      ),
      JSON.stringify([]),
    );
  };

  !savedLinksFile ? generateSavedLinksFileStructure() : null;

  // link tags information file
  const tagsFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Links", "tags.json"),
  );

  const generateTagsFileStructure = async (): Promise<void> => {
    fs.writeFileSync(
      path.join(app.getPath("appData"), "Linklist", "Links", "tags.json"),
      JSON.stringify([]),
    );
  };

  !tagsFile ? generateTagsFileStructure() : null;

  // shared links information file
  const sharedLinksFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Links", "shared_links.json"),
  );

  const generateSharedLinksFileStructure = async (): Promise<void> => {
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Links",
        "shared_links.json",
      ),
      JSON.stringify([]),
    );
  };

  !sharedLinksFile ? generateSharedLinksFileStructure() : null;

  // opened links information file
  const openedLinksFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Links", "opened_links.json"),
  );

  const generateOpenedLinksFileStructure = async (): Promise<void> => {
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Links",
        "opened_links.json",
      ),
      JSON.stringify([]),
    );
  };

  !openedLinksFile ? generateOpenedLinksFileStructure() : null;

  // saved archived links information file
  const archivedLinksFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "Archives",
      "archived_links.json",
    ),
  );

  const generateArchivedLinksFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Archives"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Archives",
        "archived_links.json",
      ),
      JSON.stringify([]),
    );
  };

  !archivedLinksFile ? generateArchivedLinksFileStructure() : null;

  // application information file
  const appInformationFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "About",
      "app_information.json",
    ),
  );

  // import data from application information file
  const aboutApplication = fs.readFileSync(
    path.join(__dirname, "..", "json", "about.software.information.json"),
    { encoding: "utf-8" },
  );

  const generateApplicationInformationFileStructure =
    async (): Promise<void> => {
      // make directory first
      fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "About"), {
        recursive: true,
      });
      // then create the file
      fs.writeFileSync(
        path.join(
          app.getPath("appData"),
          "Linklist",
          "About",
          "app_information.json",
        ),
        aboutApplication,
      );
    };

  !appInformationFile ? generateApplicationInformationFileStructure() : null;

  // backups information file
  const Backups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups"),
  );

  const generateBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Backups"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "backups.json"),
      JSON.stringify([]),
    );

    // backup settings
    const _settings = fs.readFileSync(
      path.join(__dirname, "..", "json", "user.data.backup.settings.json"),
      { encoding: "utf8" },
    );

    // backup settings
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "backup.settings.json",
      ),
      JSON.stringify(JSON.stringify(_settings)),
    );
  };

  !Backups ? generateBackupsFileStructure() : null;

  // user data backups information file
  const UserDataBackups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups", "Data"),
  );

  const generateUserDataBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "Data"),
      {
        recursive: true,
      },
    );
    // create file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "Data",
        "data_backups.json",
      ),
      JSON.stringify([]),
    );
  };

  !UserDataBackups ? generateUserDataBackupsFileStructure() : null;

  // application backups information file
  const ApplicationBackups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups", "Application"),
  );

  const generateApplicationBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "Application"),
      {
        recursive: true,
      },
    );
    // create file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "Application",
        "application_backups.json",
      ),
      JSON.stringify([]),
    );
  };

  !ApplicationBackups ? generateApplicationBackupsFileStructure() : null;
};

export default CreateRequiredApplicationFileSystem;
