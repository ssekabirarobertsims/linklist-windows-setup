import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Home.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import { Link } from "react-router-dom";

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
                    <button type="button" title="saved links">
                      checkout
                    </button>
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
                    Total archived link(s)
                  </span>
                  <p>Manage your archived links here. </p>
                  <Link
                    to={{
                      pathname: `/archives`,
                    }}
                  >
                    <button type="button" title="saved links">
                      checkout
                    </button>
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
                  <p>Manage all your saved links collections here. </p>
                  <Link
                    to={{
                      pathname: `/collections`,
                    }}
                  >
                    <button type="button" title="saved links">
                      checkout
                    </button>
                  </Link>
                </aside>
              </li>
            </ul>
            {/* banner for the home window */}
            <div className="application-home-dashboard-window-banner">
              <p>
                Welcome to your dashboard, where you can manage your saved and
                archived links, view your link collections,{" "}
                <Link
                  to={{
                    pathname: "/new",
                  }}
                >
                  start saving.
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
      </main>
    </>
  );
};

export default ApplicationHomeDashboardWindow;
