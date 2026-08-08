import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Collections.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type collectionProps = {
  id: string;
  filename: string;
  filepath: string;
  date_created?: string;
};

import { v4 as uuidV4 } from "uuid";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { TiDocumentDelete } from "react-icons/ti";
import { TbReload } from "react-icons/tb";
import { ContentLoaderComponent } from "../components/utils/Content.Loader.Util.Components";
import { LuFolderOpenDot } from "react-icons/lu";

const ApplicationCollectionsDashboardWindow: React.FunctionComponent = () => {
  // State for all collections, search results, search value, and selected link for editing
  // Initialize state for the list of collections, search results, search value, and selected link
  // State to hold the list of collections
  const [collection, setCollection] = useState<collectionProps[]>(
    [] as collectionProps[],
  );

  useEffect(() => {
    // fetch collections data from the main process
    const readCollectionsData = async (): Promise<collectionProps[]> => {
      const data: collectionProps[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readCollectionsData()) as collectionProps[];
      // set the collection state with fetched data
      setCollection(data);
      return data;
    };

    // call function to fetch collections data on component mount
    readCollectionsData();
  }, []);

  // set state for the link list
  useEffect(() => {
    setCollection(collection);
  }, [collection]);

  //   state to handle collections list saving options
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

  // hide the save collections options when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // check if the click is outside the save collections collection button wrapper
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

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Collections | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-collections-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-collections-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Collections/Exports"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>

          <div className="_application-collections-dashboard-window-components-wrapper">
            <ul id="_collections-actions-navigation-ul">
              <li>Delete All</li>
              <li>Do Something</li>
            </ul>
            <p>
              <strong>NOTE:</strong> All your saved collections are listed
              below. You can manage them as you wish.
            </p>

            {/* Show the number of saved collections */}
            <span className="collections_count">
              {collection.length} available exported collection(s)
            </span>
            <p></p>

            <span className="selected-collections-count-placeholder"></span>
            {/*  */}
            <ul id="_collections-list">
              {collection.length > 0 ? (
                collection.map((collection: collectionProps) => (
                  <li
                    key={uuidV4()}
                    id={collection.id}
                    title={`${collection.filepath}`}
                  >
                    <aside>
                      <span>
                        <MdOutlineCollectionsBookmark />
                        {collection.id}
                      </span>
                      {/* add event to open external collection if clicked */}

                      <p>{`Exported to: ${collection.filepath}`}</p>
                      <p>{`Created on: ${collection.date_created}`}</p>
                      <p></p>
                      <button
                        className="show-collection-in-folder-button"
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
                      <span
                        className="remove-from-list"
                        onClick={async (event) => {
                          event.stopPropagation(); // prevent event bubbling
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          await window.app_api.deleteExistingCollection(
                            collection.id ? collection.id : "",
                            collection.filepath,
                          ); // delete existing collection
                          // reload for new data
                          window.location.href = "/collections";
                        }}
                      >
                        <TiDocumentDelete />
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
                    <h2>No collections found!</h2>
                    <p>
                      Your collections list is empty. Please add a collections
                      to your list.
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

export default ApplicationCollectionsDashboardWindow;
