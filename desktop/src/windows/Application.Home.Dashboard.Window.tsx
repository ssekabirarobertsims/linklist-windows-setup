import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Home.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import { Link } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";

// bar graph chart component for displaying links data
import LinksBarGraphChartComponent from "../components/charts/Bar.Graph.Component";
// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  date_created?: string;
};

interface user {
  username: string;
  name: string;
  email: string;
  profile_picture_path: string;
  token: string;
  id: string;
  loggedIn: boolean;
  login_date: string;
  bio: string;
  joined: string;
}

// Define the shape of a saved backup item
type backupProps = {
  id: string;
  filename: string;
  filepath: string;
  _date: string;
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
import ApplicationMiniAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Mini.Aside.Navigation.Bar.Atomic.Component";
import ApplicationCalendarComponent from "../components/calendar/Calendar.Component";

const ApplicationHomeDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linkArchivesList, setLinkArchivesList] = useState<
    ListItemProperties[]
  >([] as ListItemProperties[]);

  // fetch all existing links archives on component mount and display them
  useEffect(() => {
    const fetchLinkArchives = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllLinkArchives()) as ListItemProperties[];
      // set the links list state
      setLinkArchivesList(links);
      // return an arr[] for the links
      return links;
    };

    fetchLinkArchives();
  }, []);

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

  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[],
  );

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const fetchLinks = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllExistingLinks()) as ListItemProperties[];
      // set the links list state
      setLinksList(links);
      // return an arr[] for the links
      return links;
    };

    fetchLinks();
  }, []);

  // set state for the link list
  useEffect(() => {
    setLinksList(linksList);
  }, [linksList]);

  const [user, setUser] = useState<user>({} as user);
  const getUserInformation = async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userInformation = await window.app_api.readUserInformation();
    setUser(userInformation);
    return userInformation;
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  // State for all Backups, search results, search value, and selected link for editing
  // Initialize state for the list of Backups, search results, search value, and selected link
  // State to hold the list of Backups
  const [backups, setBackups] = useState<backupProps[]>([] as backupProps[]);

  useEffect(() => {
    // fetch Backups data from the main process
    const readBackupsData = async (): Promise<backupProps[]> => {
      const data: backupProps[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllRecentBackup()) as backupProps[];
      // set the collection state with fetched data
      setBackups(data);
      return data;
    };

    // call function to fetch Backups data on component mount
    readBackupsData();
  }, []);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Home | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-home-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-home-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent window={"Home"} />
          <br />
          <p></p>
          <p></p>
          <p></p>
          {/* user welcome banner and stats */}
          <div className="_application-home-dashboard-window-components-wrapper">
            {/* <img src="/avatars/avatar-1.webp" alt="" /> */}
            <h1>
              Welcome back,{" "}
              {String(user.username ?? "User").toLocaleLowerCase()}
            </h1>

            {/* <button
              type="button"
              className="desktop-widget-launch-button"
              onClick={() => {
                const appApi = (
                  window as unknown as {
                    app_api: { openDesktopWidget: () => Promise<unknown> };
                  }
                ).app_api;
                void appApi.openDesktopWidget();
              }}
            >
              Pin LinkList widget to desktop
            </button> */}

            {/* Display saved and trashed links counts and stats */}
            <ul id="content-ul">
              <li
                className="content-ul-li"
                id="dashboard-home-page-content-component-li-1"
              >
                <aside>
                  <span id="content-ul-li-p-2">
                    <p id="content-ul-li-p-1">
                      {" "}
                      {
                        Number(
                          linksList?.length ?? [].length,
                        ) as Required<number>
                      }{" "}
                    </p>
                    Total saved link(s)
                  </span>
                  <p>Manage your saved links here. </p>
                  <Link
                    to={{
                      pathname: `/links`,
                    }}
                  >
                    <button type="button">checkout</button>
                  </Link>
                </aside>
              </li>
              <li
                className="content-ul-li"
                id="dashboard-home-page-content-component-li-2"
              >
                <aside>
                  <span id="content-ul-li-p-2">
                    <p id="content-ul-li-p-2">
                      {" "}
                      {
                        Number(
                          linkArchivesList.length ?? [].length,
                        ) as Required<number>
                      }{" "}
                    </p>
                    Total Trashed link(s)
                  </span>
                  <p>Manage your trashed links here. </p>
                  <Link
                    to={{
                      pathname: `/archives`,
                    }}
                  >
                    <button type="button">checkout</button>
                  </Link>
                </aside>
              </li>
              <li
                className="content-ul-li"
                id="dashboard-home-page-content-component-li-3"
              >
                <aside>
                  <span id="content-ul-li-p-3">
                    <p id="content-ul-li-p-3">
                      {" "}
                      {
                        Number(
                          collection?.length ?? [].length,
                        ) as Required<number>
                      }{" "}
                    </p>
                    Total link(s) collections.
                  </span>
                  <p>Manage all links collections here. </p>
                  <Link
                    to={{
                      pathname: `/collections`,
                    }}
                  >
                    <button type="button">checkout</button>
                  </Link>
                </aside>
              </li>
              <li
                className="content-ul-li"
                id="dashboard-home-page-content-component-li-4"
              >
                <aside>
                  <span id="content-ul-li-p-4">
                    <p id="content-ul-li-p-4">
                      {" "}
                      {
                        Number(backups?.length ?? [].length) as Required<number>
                      }{" "}
                    </p>
                    Total Data Backup(s).
                  </span>
                  <p>Manage all recent data backups here. </p>
                  <Link
                    to={{
                      pathname: `/backups`,
                    }}
                  >
                    <button type="button">checkout</button>
                  </Link>
                </aside>
              </li>
            </ul>
            {/* banner for the home window */}
            <div className="application-home-dashboard-window-banner">
              <p>
                Welcome to your dashboard, where you can manage your saved
                contents including links, backups among others
                <Link
                  to={{
                    pathname: "/calendar",
                  }}
                >
                  <p></p>
                  <button type="button" className="calendar-button">
                    <BiCalendar /> Calendar
                  </button>
                </Link>
              </p>
            </div>
            {/* Chart showing links created over time */}
            <span>Saved links analytics</span>
            <div id="chart-container">
              <LinksBarGraphChartComponent />
            </div>
          </div>
        </section>
        <ApplicationCalendarComponent />
      </main>
    </>
  );
};

export default ApplicationHomeDashboardWindow;
