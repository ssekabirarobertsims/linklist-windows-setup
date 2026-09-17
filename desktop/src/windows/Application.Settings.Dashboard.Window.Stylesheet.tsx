import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Settings.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
//
interface sysInfo {
  appVersion: string;
  systemVersion: string;
  now: string;
}

interface ApplicationSettings {
  appTheme: "dark" | "light";
  enableNotifications: boolean;
  autoBackupsEnabled: boolean;
  startAppOnSystemStartup: boolean;
  startWidgetOnSystemStartup: boolean;
}

import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { GrNotification, GrUpdate } from "react-icons/gr";
import { AiFillWindows } from "react-icons/ai";
// import { MdDarkMode, MdLightMode } from "react-icons/md";

// import { format } from "date-fns";
import ApplicationMiniAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Mini.Aside.Navigation.Bar.Atomic.Component";
import { LuDatabaseBackup } from "react-icons/lu";
import { MdOutlineWidgets } from "react-icons/md";

const ApplicationSettingsDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [systemInfo, setSystemInfo] = useState<sysInfo>({} as sysInfo);
  const [settings, setSettings] = useState<ApplicationSettings>({
    appTheme: "dark",
    enableNotifications: true,
    autoBackupsEnabled: true,
    startAppOnSystemStartup: true,
    startWidgetOnSystemStartup: true,
  });

  const updateSetting = async (
    changes: Partial<ApplicationSettings>,
  ): Promise<void> => {
    const appApi = (
      window as unknown as {
        app_api: {
          updateApplicationSettings: (
            value: Partial<ApplicationSettings>,
          ) => Promise<ApplicationSettings>;
        };
      }
    ).app_api;
    const updatedSettings = await appApi.updateApplicationSettings(changes);
    setSettings(updatedSettings);
  };

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const readSystemInfo = async (): Promise<sysInfo> => {
      const links: sysInfo =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.systemInformation()) as sysInfo;
      // set the info state
      setSystemInfo(links);
      return links;
    };

    readSystemInfo();
  }, []);

  useEffect(() => {
    const readSettings = async (): Promise<void> => {
      const appApi = (
        window as unknown as {
          app_api: {
            readApplicationSettings: () => Promise<ApplicationSettings>;
          };
        }
      ).app_api;
      const applicationSettings = await appApi.readApplicationSettings();
      setSettings(applicationSettings);
      document.documentElement.dataset.theme = applicationSettings.appTheme;
    };

    void readSettings();
  }, []);

  // set state for the link list
  useEffect(() => {
    setSystemInfo(systemInfo);
  }, [systemInfo]);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Settings | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-settings-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-settings-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Settings"}
          />
          <br />

          <div className="_application-settings-dashboard-window-components-wrapper">
            {/*  */}
            <h1>App Updates</h1>
            <div className="application-updates">
              <aside>
                <h4>
                  {" "}
                  <GrUpdate />
                  You're upto date
                </h4>
                <p>
                  Application updates automatically if update releases are
                  available on the application{" "}
                  <a
                    href=""
                    id="_wrapper"
                    onClick={(event) => {
                      event.preventDefault();
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      window.app_api.openExternalLink(
                        "https://github.com/ssekabirarobertsims/Linklist-Desktop-Application",
                      );
                    }}
                  >
                    repository
                  </a>
                  {/* date.now time - 2 hrs */}
                </p>
              </aside>
            </div>
            <p></p>
            <p></p>
            {/*  */}
            {/* <h1>Themes</h1>
            <ul className="themes">
              <li>
                <aside className="_a">
                  <span>
                    <MdDarkMode />
                  </span>
                  <p> Dark Theme</p>
                </aside>
                <aside className="_b">
                  <div className="switch-wrapper-1">
                    <input
                      className="tgl tgl-light"
                      id="switch-basic-1"
                      title="switch"
                      type="checkbox"
                      checked={settings.appTheme === "dark"}
                      onChange={() => void updateSetting({ appTheme: "dark" })}
                    />
                    <label className="tgl-btn" htmlFor="switch-basic-1"></label>
                  </div>
                </aside>
              </li>
              <li>
                <aside className="_a">
                  <span>
                    <MdLightMode />
                  </span>
                  <p> Light Theme</p>
                </aside>
                <aside className="_b">
                  <div className="switch-wrapper-2">
                    <input
                      className="tgl tgl-light"
                      id="switch-basic-2"
                      title="switch"
                      type="checkbox"
                      checked={settings.appTheme === "light"}
                      onChange={() => void updateSetting({ appTheme: "light" })}
                    />
                    <label className="tgl-btn" htmlFor="switch-basic-2"></label>
                  </div>
                </aside>
              </li>
            </ul> */}
            {/*  */}
            <h1>Default Settings</h1>
            <div className="notifications">
              <div className="content-wrapper">
                <span>
                  <GrNotification /> Notifications
                </span>
                <p>
                  Notifications are allowed by default to ensure notifying user
                  all time.{" "}
                </p>
              </div>
              <div className="switch-wrapper-3">
                <input
                  className="tgl tgl-light"
                  id="switch-basic-3"
                  title="switch"
                  type="checkbox"
                  checked={settings.enableNotifications}
                  // onChange={(event) =>
                  //   void updateSetting({
                  //     enableNotifications: event.target.checked,
                  //   })
                  // }
                />
                <label className="tgl-btn" htmlFor="switch-basic-3"></label>
              </div>
            </div>

            {/*  */}
            <p></p>
            <div className="notifications">
              <div className="content-wrapper">
                <span>
                  <LuDatabaseBackup /> Auto Backups
                </span>
                <p>
                  Automatic backups for the application data are enabled by
                  default for every 7 days interval.
                </p>
              </div>
              <div className="switch-wrapper-3">
                <input
                  className="tgl tgl-light"
                  id="switch-basic-3"
                  title="switch"
                  type="checkbox"
                  checked={settings.autoBackupsEnabled}
                  onChange={(event) =>
                    void updateSetting({
                      autoBackupsEnabled: event.target.checked,
                    })
                  }
                />
                <label className="tgl-btn" htmlFor="switch-basic-3"></label>
              </div>
            </div>
            <h1>Application Start</h1>

            <div className="notifications">
              <div className="content-wrapper">
                <span>
                  <AiFillWindows /> Start LinkList with Windows
                </span>
                <p>
                  Keeps LinkList available in the background after Windows
                  starts.
                </p>
              </div>
              <div className="switch-wrapper-3">
                <input
                  className="tgl tgl-light"
                  id="switch-start-app"
                  title="Start LinkList with Windows"
                  type="checkbox"
                  checked={settings.startAppOnSystemStartup}
                  onChange={(event) =>
                    void updateSetting({
                      startAppOnSystemStartup: event.target.checked,
                    })
                  }
                />
                <label className="tgl-btn" htmlFor="switch-start-app"></label>
              </div>
            </div>

            <div className="notifications">
              <div className="content-wrapper">
                <span>
                  <MdOutlineWidgets /> Start desktop widget with Windows
                </span>
                <p>
                  Restores the widget automatically after a computer restart.
                </p>
              </div>
              <div className="switch-wrapper-3">
                <input
                  className="tgl tgl-light"
                  id="switch-start-widget"
                  title="Start desktop widget with Windows"
                  type="checkbox"
                  checked={settings.startWidgetOnSystemStartup}
                  onChange={(event) =>
                    void updateSetting({
                      startWidgetOnSystemStartup: event.target.checked,
                    })
                  }
                />
                <label
                  className="tgl-btn"
                  htmlFor="switch-start-widget"
                ></label>
              </div>
            </div>

            <br />
            <span>Current Build {systemInfo?.appVersion}</span>
            <span>
              {" "}
              <AiFillWindows /> {systemInfo?.systemVersion} Edition
            </span>
            <span>
              {" "}
              Linklist © 2019. Links Management System. All Rights Reserved
            </span>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationSettingsDashboardWindow;
