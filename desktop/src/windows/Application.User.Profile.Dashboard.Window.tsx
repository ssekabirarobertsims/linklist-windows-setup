import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.User.Profile.Dashboard.Window.Stylesheet.css";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
// import { CiEdit } from "react-icons/ci";
import { GiHelp } from "react-icons/gi";
import { MdFeedback, MdPrivacyTip } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsExclamation } from "react-icons/bs";
// import { TiTick } from "react-icons/ti";
import { TbApiApp } from "react-icons/tb";
import { AiFillWindows } from "react-icons/ai";

interface DeviceInfo {
  appVersion: string;
  systemVersion: string;
  platform: string;
  release: string;
  deviceName: string;
  registeredUser: string;
  totalMemoryGB: number;
  usedMemoryGB: number;
  freeMemoryGB: number;
  diskTotalGB: number;
  diskFreeGB: number;
  diskUsedGB: number;
  diskUsagePercent: number;
  now: string;
}

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

const ApplicationUserProfileDashboardWindow: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({} as DeviceInfo);

  const getDeviceInformation = async (): Promise<void> => {
    try {
      const systemInformation =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.systemInformation()) as DeviceInfo;
      setDeviceInfo(systemInformation);
    } catch (error) {
      console.warn("Failed to read device information", error);
    }
  };

  useEffect(() => {
    getDeviceInformation();
  }, []);

  const [profilePictureInformation, setProfilePictureInformation] = useState<{
    size: number;
  }>(
    {} as {
      size: number;
    },
  );
  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Device Profile | LinkList";
  }, []);

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

  // set state for the collections list
  useEffect(() => {
    setCollection(collection);
  }, [collection]);

  // State for all links, used to count saved links in device profile
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

  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-user-profile-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-user-profile-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Profile"}
          />
          <br />
          <div className="_application-user-profile-dashboard-window-components-wrapper">
            <p></p>
            <h2>DEVICE PROFILE</h2>
            <header className="profile-header">
              <aside>
                <img
                  src="/avatars/laptop-avatar.avif"
                  className="profile-avatar"
                  alt="device avatar"
                />
              </aside>
              <div>
                <p className="profile-name">
                  {deviceInfo.deviceName || "Unknown Device"}
                </p>
                <p className="profile-username">
                  Registered user: {deviceInfo.registeredUser || "Unknown"}
                </p>
                <p>
                  {deviceInfo.platform || "Platform"} •{" "}
                  {deviceInfo.release || "OS Release"}
                </p>
                <p className="device-summary">
                  LinkList is running on this device as a dedicated link
                  manager. The page shows storage, memory, and OS details so you
                  can see the host system at a glance.
                </p>
                <p>
                  {profilePictureInformation?.size ? (
                    <span>
                      Current upload size{" "}
                      {Math.floor(profilePictureInformation?.size / 1024)} KB
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="file-input"
                  onChange={async (event) => {
                    const files = (event.target as HTMLInputElement)?.files;
                    const file = files?.[0];

                    if (file) {
                      const reader = new FileReader();

                      reader.addEventListener(
                        "load",
                        async (): Promise<void> => {
                          return (
                            window.document.querySelector(
                              ".profile-avatar",
                            ) as HTMLImageElement
                          ).setAttribute("src", reader.result as string);
                        },
                      );

                      reader.readAsDataURL(file);
                      setProfilePictureInformation(file);
                    }
                  }}
                />
              </div>
            </header>
            {/*  */}

            <br />
            {/* User Info Section */}

            {/* Details */}
            {/* <div className="profile-details">
              <aside>
                <div className="detail-row">
                  <span className="detail-label">
                    {" "}
                    {
                      Number(linksList?.length ?? [].length) as Required<number>
                    }{" "}
                  </span>
                  <p className="detail-value">
                    {" "}
                    <Link
                      to={{
                        pathname: `/links`,
                      }}
                    >
                      Saved link(s)
                    </Link>
                  </p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    {" "}
                    {
                      Number(
                        linkArchivesList.length ?? [].length,
                      ) as Required<number>
                    }{" "}
                  </span>
                  <p className="detail-value">
                    {" "}
                    <Link
                      to={{
                        pathname: `/archives`,
                      }}
                    >
                      Archived link (s)
                    </Link>
                  </p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">OS Version</span>
                  <p className="detail-value">
                    {deviceInfo.systemVersion || "Unknown"}
                  </p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Installed Build</span>
                  <p className="detail-value">
                    {deviceInfo.appVersion || "N/A"}
                  </p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Memory</span>
                  <p className="detail-value">
                    {deviceInfo.usedMemoryGB ?? 0}GB used of{" "}
                    {deviceInfo.totalMemoryGB ?? 0}GB
                  </p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Storage</span>
                  <p className="detail-value">
                    {deviceInfo.diskUsedGB ?? 0}GB used of{" "}
                    {deviceInfo.diskTotalGB ?? 0}GB (
                    {deviceInfo.diskUsagePercent ?? 0}% full)
                  </p>
                </div>
              </aside>
            </div>
             */}
            <br />
            <span>Current Build {deviceInfo?.appVersion}</span>
            <span>
              {" "}
              <AiFillWindows /> {deviceInfo?.systemVersion} Home Edition
            </span>
            <br />
            {/*  */}
            <div className="profile-section">
              <h3>Download Updates Manually</h3>
              <p>
                Check out new updates and download new features if application
                did not update automatically when connected to the internet!
              </p>
              <br />
              <a
                href="https://github.com/ssekabirarobertsims/linklist-windows-setup"
                title="Download Manually"
                onClick={(event) => {
                  event.preventDefault();
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  window.app_api.openExternalLink(
                    "https://github.com/ssekabirarobertsims/linklist-windows-setup",
                  );
                }}
              >
                <button title="Download Updates Manually">Download</button>
              </a>
            </div>

            <p></p>
            <span>
              {" "}
              Linklist © 2019. Links Management System. All Rights Reserved
            </span>

            {/*  */}
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationUserProfileDashboardWindow;
