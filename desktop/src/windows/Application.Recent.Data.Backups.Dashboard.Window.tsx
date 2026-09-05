import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Recent.Data.Backups.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type collectionProps = {
  id: string;
  filename: string;
  filepath: string;
  _date: string;
};

import { v4 as uuidV4 } from "uuid";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { ContentLoaderComponent } from "../components/utils/Content.Loader.Util.Components";
import { GrOfflineStorage } from "react-icons/gr";
import { LuFolderOpenDot } from "react-icons/lu";

const ApplicationRecentBackupsDashboardWindow: React.FunctionComponent = () => {
  // State for all Backups, search results, search value, and selected link for editing
  // Initialize state for the list of Backups, search results, search value, and selected link
  // State to hold the list of Backups
  const [collection, setCollection] = useState<collectionProps[]>(
    [] as collectionProps[],
  );

  useEffect(() => {
    // fetch Backups data from the main process
    const readBackupsData = async (): Promise<collectionProps[]> => {
      const data: collectionProps[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllRecentBackup()) as collectionProps[];
      // set the collection state with fetched data
      setCollection(data);
      return data;
    };

    // call function to fetch Backups data on component mount
    readBackupsData();
  }, []);

  // set state for the link list
  useEffect(() => {
    setCollection(collection);
  }, [collection]);
  console.log(collection); //////////////////////////////////////////////////////////

  //   state to handle Backups list saving options
  const [showSavingOptions, setShowSavingOptions] = useState<boolean>(
    false as boolean,
  );

  // set state for showing the content loader
  const [showContentLoader, setShowContentLoader] = useState<boolean>(true);

  // Effect to hide the content loader after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContentLoader(false);
    }, 10000); // Hide loader after 1 second

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // hide the save Backups options when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // check if the click is outside the save Backups collection button wrapper
      if (
        !target.closest("._save-collections-collection-button-wrapper") &&
        showSavingOptions
      ) {
        setShowSavingOptions(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSavingOptions]);

  // ////////////////////////////////////////
  // state to hold the date for the last backup
  const [recentBackupId, setRecentBackupId] = useState<string | number>("");

  const getRecentBackupId = async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const recentBackup = await window.app_api.readRecentBackup();
    setRecentBackupId(recentBackup?.id);
    return recentBackup?.id || "No backup id found";
  };

  useEffect(() => {
    getRecentBackupId();
  }, []);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Recent Backups | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-backups-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-backups-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Recent Backups"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>

          <div className="_application-backups-dashboard-window-components-wrapper">
            <p>
              <strong>NOTE:</strong> All your recent backups are listed below
              including application settings, links, user data etc. You can
              manage them as you wish.
            </p>

            {/* Show the number of saved backups */}
            <span className="backups_count">
              {collection.length ?? 0} available backup(s) made
            </span>
            <p></p>

            <span className="selected-backups-count-placeholder"></span>
            {/*  */}
            <ul id="_backups-list">
              {collection.length > 0 ? (
                collection.map((collection: collectionProps) => (
                  <li
                    className={
                      collection?.id === recentBackupId
                        ? `recent-backup`
                        : undefined
                    }
                    key={uuidV4()}
                    id={collection.id}
                    title={
                      collection?.id === recentBackupId
                        ? `Recent Backup`
                        : `Backup made on ${collection?._date}`
                    }
                  >
                    <aside>
                      <span>
                        <MdOutlineCollectionsBookmark />
                        {collection?.id}{" "}
                        {collection?.id === recentBackupId ? (
                          <p>(Last Backup Made)</p>
                        ) : undefined}
                      </span>
                      {/* add event to open external collection if clicked */}

                      <p>{`Created on: ${collection?._date}`}</p>
                      <p>{`Backup Type: Local Backup`}</p>
                      <p></p>
                      <button
                        className="show-backup-in-folder-button"
                        title="Open collection in folder"
                        onClick={async (event): Promise<void> => {
                          event?.stopPropagation(); // stop event bubbling
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          await window.app_api.showItemInFolder(
                            `${collection.filepath}`,
                          ); // open collection in windows file explorer
                        }}
                      >
                        <LuFolderOpenDot />
                        Open In Folder
                      </button>
                      <span className="remove-from-list">
                        <GrOfflineStorage />
                      </span>
                    </aside>
                  </li>
                ))
              ) : (
                // Message displayed when no links are found
                // This message is shown when the search results are empty
                <>
                  <div className="no-results-message">
                    {showContentLoader && <ContentLoaderComponent />}
                    <span>
                      <MdOutlineCollectionsBookmark />
                    </span>
                    <h2>No Backups found!</h2>
                    <p>
                      Your Backups list is empty. Please add a Backups to your
                      list.
                    </p>
                    <span
                      id="refresh"
                      onClick={(event: React.MouseEvent) => {
                        // prevent or stop event bubbling
                        event.stopPropagation();
                        window.location.reload();
                      }}
                    >
                      <TbReload /> refresh
                    </span>
                  </div>
                  <br />
                </>
              )}
            </ul>
          </div>
        </section>
      </main>
      {/* Footer and prime sidebar */}
      {/* <DashboardFooterComponent /> */}
    </>
  );
};

export default ApplicationRecentBackupsDashboardWindow;
