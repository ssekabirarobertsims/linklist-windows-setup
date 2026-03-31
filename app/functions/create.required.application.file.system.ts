import fs from "node:fs";
import { app } from "electron";
import path from "node:path";
import { v4 } from "uuid";
import { format } from "date-fns";

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
      "collections.json"
    )
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
        "collections.json"
      ),
      JSON.stringify([])
    );
  };

  !collectionsFile ? generateCollectionsFileStructure() : null;

  // settings.json file
  const settingsFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Settings", "settings.json")
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
        "settings.json"
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
      })
    );
  };

  !settingsFile ? generateSettingsFileStructure() : null;

  // user information file (username, name, email, profile pic path etc)
  const userInformationFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "User",
      "user_information.json"
    )
  );

  const generateUserInformationFileStructure = async (): Promise<void> => {
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
        "user_information.json"
      ),
      JSON.stringify(
        {
          username: "username",
          name: "@name",
          email: "sampleuser@example.com",
          profile_picture_path:
            "E:_ProjectsDesktopAppsLinklist.desktop-appdesktoppublicavatarsavatar-1.webp",
          token: "Bearer token",
          id: v4(),
          loggedIn: false,
          login_date: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
          bio: "This is my bio",
          joined: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
        },
        null,
        2
      )
    );
  };

  !userInformationFile ? generateUserInformationFileStructure() : null;

  // saved links information file
  const savedLinksFile = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Links", "saved_links.json")
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
        "saved_links.json"
      ),
      JSON.stringify([])
    );
  };

  !savedLinksFile ? generateSavedLinksFileStructure() : null;

  // saved archived links information file
  const archivedLinksFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "Archives",
      "archived_links.json"
    )
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
        "archived_links.json"
      ),
      JSON.stringify([])
    );
  };

  !archivedLinksFile ? generateArchivedLinksFileStructure() : null;

  // application information file
  const appInformationFile = fs.existsSync(
    path.join(
      app.getPath("appData"),
      "Linklist",
      "About",
      "app_information.json"
    )
  );

  // import data from application information file
  const aboutApplication = fs.readFileSync(
    path.join(__dirname, "..", "json", "about.software.information.json"),
    { encoding: "utf-8" }
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
          "app_information.json"
        ),
        aboutApplication
      );
    };

  !appInformationFile ? generateApplicationInformationFileStructure() : null;

  // backups information file
  const Backups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups")
  );

  const generateBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(path.join(app.getPath("appData"), "Linklist", "Backups"), {
      recursive: true,
    });
    // then create the file
    fs.writeFileSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "backups.json"),
      JSON.stringify([])
    );

    // backup settings
    const _settings = fs.readFileSync(
      path.join(__dirname, "..", "json", "user.data.backup.settings.json"),
      { encoding: "utf8" }
    );

    // backup settings
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "backup.settings.json"
      ),
      JSON.stringify(JSON.stringify(_settings))
    );
  };

  !Backups ? generateBackupsFileStructure() : null;

  // user data backups information file
  const UserDataBackups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups", "Data")
  );

  const generateUserDataBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "Data"),
      {
        recursive: true,
      }
    );
    // create file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "Data",
        "data_backups.json"
      ),
      JSON.stringify([])
    );
  };

  !UserDataBackups ? generateUserDataBackupsFileStructure() : null;

  // application backups information file
  const ApplicationBackups = fs.existsSync(
    path.join(app.getPath("appData"), "Linklist", "Backups", "Application")
  );

  const generateApplicationBackupsFileStructure = async (): Promise<void> => {
    // make directory first
    fs.mkdirSync(
      path.join(app.getPath("appData"), "Linklist", "Backups", "Application"),
      {
        recursive: true,
      }
    );
    // create file
    fs.writeFileSync(
      path.join(
        app.getPath("appData"),
        "Linklist",
        "Backups",
        "Application",
        "application_backups.json"
      ),
      JSON.stringify([])
    );
  };

  !ApplicationBackups ? generateApplicationBackupsFileStructure() : null;
};

export default CreateRequiredApplicationFileSystem;
