import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Export.Formats.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";

// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  date_created?: string;
};

// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type collectionProps = {
  id: string;
  filename: string;
  filepath: string;
  date_created?: string;
};

import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { TbFileTypeTxt } from "react-icons/tb";
import { PiFileHtmlBold } from "react-icons/pi";
import { BsFiletypeJson } from "react-icons/bs";
import { v4 as uuidV4 } from "uuid";
import { Link } from "react-router-dom";
import ApplicationMiniAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Mini.Aside.Navigation.Bar.Atomic.Component";

const ApplicationExportFormatsDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[],
  );

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const readLinks = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllExistingLinks()) as ListItemProperties[];
      // set the links list state
      setLinksList(links);
      // return an arr[] for the links
      return links;
    };

    readLinks();
  }, []);

  // set state for the link list
  useEffect(() => {
    setLinksList(linksList);
  }, [linksList]);

  const [recentExportsList, setRecentExportsList] = useState<collectionProps[]>(
    [],
  );

  useEffect(() => {
    // fetch collections data from the main process
    const readCollectionsData = async (): Promise<collectionProps[]> => {
      const data: collectionProps[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readCollectionsData()) as collectionProps[];
      // set the collection state with fetched data
      setRecentExportsList(data);
      return data;
    };

    // call function to fetch collections data on component mount
    readCollectionsData();
  }, []);

  // use effect to set recent exports list
  useEffect(() => {
    setRecentExportsList(recentExportsList);
  }, [recentExportsList]);

  // set state for the link list
  useEffect(() => {
    setLinksList(linksList);
  }, [linksList]);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Export | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-export-formats-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-export-formats-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent window={"Export"} />
          <br />
          <p></p>
          <p></p>
          <p></p>
          {/* user welcome banner and stats */}
          <div className="_application-export-formats-dashboard-window-components-wrapper">
            <h1>Export saved links</h1>
            <p>
              Choose your preferred export format for your saved links. You can
              export your links in various formats such as CSV, JSON, TXT, HTML,
              PDFs, or XML to easily back them up or transfer them to other
              applications.
            </p>
            <br />
            {/* export formats for the links  */}
            <ul id="content-ul">
              <li
                className="content-ul-li"
                id="dashboard-export-page-content-component-li-1"
              >
                <aside>
                  <span id="content-ul-li-p-1">
                    <BsFiletypeJson />
                  </span>
                  <p>
                    Export your saved links in JSON format for easy data
                    interchange and compatibility with various applications.
                  </p>
                  <button
                    type="button"
                    title="export saved links"
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // stop event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.exportDataToJSONFile(
                        linksList?.map((item) => item) ?? [],
                        `json`,
                        "Saved links",
                      );
                      // reload application window
                      window.location.reload();
                    }}
                  >
                    Start Export
                  </button>
                </aside>
              </li>

              <li
                className="content-ul-li"
                id="dashboard-export-page-content-component-li-2"
              >
                <aside>
                  <span id="content-ul-li-p-2">
                    <TbFileTypeTxt />
                  </span>
                  <p>
                    Export your saved links in TXT format for easy data
                    interchange and compatibility with various applications.
                  </p>
                  <button
                    type="button"
                    title="export saved links"
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // stop event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.exportDataToTXTFile(
                        linksList?.map((item) => item) ?? [],
                        `txt`,
                        "Saved links",
                      );
                      // reload application window
                      window.location.reload();
                    }}
                  >
                    Start Export
                  </button>
                </aside>
              </li>

              <li
                className="content-ul-li"
                id="dashboard-export-page-content-component-li-3"
              >
                <aside>
                  <span id="content-ul-li-p-3">
                    <PiFileHtmlBold />
                  </span>
                  <p>
                    Export your saved links in HTML format for easy data
                    interchange and compatibility with various applications.
                  </p>
                  <button
                    type="button"
                    title="export saved links"
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // stop event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.exportDataToHTMLFile(
                        linksList?.map((item) => item) ?? [],
                        `html`,
                        "Saved links",
                      );
                      // reload application window
                      window.location.reload();
                    }}
                  >
                    Start Export
                  </button>
                </aside>
              </li>
              {/*  */}
            </ul>
            <p></p>
            <p></p>
            <h1>Recent exports</h1>
            {recentExportsList.length === 0 ? (
              <p>No recent exports found.</p>
            ) : (
              <>
                {recentExportsList[recentExportsList.length - 1] ? (
                  <div key={uuidV4()} className="recent-exports-item">
                    <aside>
                      {/* add event to open external link if clicked */}
                      <p>{`Exported to: ${
                        recentExportsList[recentExportsList.length - 1]
                          ?.filepath
                      }`}</p>
                      <p>{`Date: ${
                        recentExportsList[recentExportsList.length - 1]
                          ?.date_created
                      }`}</p>
                    </aside>
                  </div>
                ) : (
                  <></>
                )}
                {recentExportsList[recentExportsList.length - 2] ? (
                  <div key={uuidV4()} className="recent-exports-item">
                    <aside>
                      {/* add event to open external link if clicked */}
                      <p>{`Exported to: ${
                        recentExportsList[recentExportsList.length - 2]
                          ?.filepath
                      }`}</p>
                      <p>{`Date: ${
                        recentExportsList[recentExportsList.length - 2]
                          ?.date_created
                      }`}</p>
                    </aside>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
            <p></p>
            <Link
              to={{
                pathname: "/collections",
              }}
            >
              <button type="button" title="view all exports">
                View All Exports
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationExportFormatsDashboardWindow;
