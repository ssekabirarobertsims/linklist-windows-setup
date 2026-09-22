import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Windows/Application.Data.Backup.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import ApplicationMiniAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Mini.Aside.Navigation.Bar.Atomic.Component";
import ApplicationCalendarComponent from "../components/calendar/Calendar.Component";

const ApplicationUserDataBackupDashboardWindow: React.FunctionComponent =
  () => {
    // state to hold the date for the last backup
    const [recentBackupDate, setRecentBackupDate] = useState<string | number>(
      "",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buttonRef = useRef<any>(null);

    const getRecentBackupDate = async (): Promise<string> => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const recentBackup = await window.app_api.readRecentBackup();
      setRecentBackupDate(recentBackup?._date);
      return recentBackup?._date || "No backups found";
    };

    useEffect(() => {
      getRecentBackupDate();
    }, []);

    // Set the document title on mount
    useEffect(() => {
      document.title = "Dashboard - Data Backup | LinkList";
    }, []);

    // Render the dashboard home page layout and content
    return (
      <>
        {/* Main dashboard page elements */}
        <main
          className={String(
            "application-user-data-backup-dashboard-window",
          ).toLocaleLowerCase()}
        >
          <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
          <ApplicationAsideNavigationDashboardBarAtomicComponent />

          <section
            className={String(
              "_application-user-data-backup-dashboard-window-wrapper",
            ).toLocaleLowerCase()}
          >
            {/* Navigation bar and sidebar for user profile */}
            <ApplicationDashboardNavigationBarAtomicComponent
              window={"Backup Data"}
            />
            <br />
            <p></p>
            <p></p>
            <p></p>

            <div className="_application-user-data-backup-dashboard-window-components-wrapper">
              <article>
                <div>
                  <aside className="notifications">
                    {/* <article className="content-wrapper">
                      <span>
                        <LuDatabaseBackup /> Auto Backups
                      </span>
                      <p>
                        Automatic backups for the application data are enabled
                        by default for every 7 days interval.
                      </p>
                    </article> */}
                    <article className="switch-wrapper-3">
                      <input
                        className="tgl tgl-light"
                        id="switch-basic-3"
                        type="checkbox"
                        checked
                        aria-checked
                      />

                      <label
                        className="tgl-btn"
                        htmlFor="switch-basic-3"
                      ></label>
                    </article>
                  </aside>
                  {/* <h1>Create Backup Now</h1> */}
                  <img src="/imgs/OIP.webp" alt="" />
                  <h2>
                    {(recentBackupDate as string | number)
                      ? `Last backed up application on ${
                          recentBackupDate as string | number
                        }`
                      : "No backups made for the application yet"}
                  </h2>
                  <p>
                    You can create a local backup of your application data. This
                    backup will include all your saved links, collections,
                    archives, and settings. It's recommended to create backups
                    regularly to prevent data loss. Click the button below to
                    create a new backup for all your application data.
                  </p>
                  <p></p>
                  <p></p>
                  <button
                    type="button"
                    className="create-local-app-backup"
                    id="create-local-app-backup"
                    ref={buttonRef.current}
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // prevent event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.createLocalDataBackup();

                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.createLocalApplicationBackup();

                      // reload application window
                      window.location.reload();
                    }}
                  >
                    Create a Backup
                  </button>
                  <br />
                  {/* <Link
                    className="recent-backups-link"
                    to={{
                      pathname: "/backups",
                    }}
                  >
                    --See Recent Backups--
                  </Link> */}
                </div>
              </article>
            </div>
          </section>
          <ApplicationCalendarComponent />
        </main>
      </>
    );
  };

export default ApplicationUserDataBackupDashboardWindow;
