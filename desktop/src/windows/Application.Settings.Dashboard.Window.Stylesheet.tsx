import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Settings.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
//
interface sysInfo {
  appVersion: string;
  systemVersion: string;
  now: string;
}

import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { GrNotification, GrUpdate } from "react-icons/gr";
import { AiFillWindows } from "react-icons/ai";
import {
  MdDarkMode,
  MdFeedback,
  MdLightMode,
  MdPrivacyTip,
} from "react-icons/md";

import { format } from "date-fns";
import { GiHelp } from "react-icons/gi";
import { BsExclamation } from "react-icons/bs";
import { TbApiApp } from "react-icons/tb";

const ApplicationSettingsDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [systemInfo, setSystemInfo] = useState<sysInfo>({} as sysInfo);

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
                  Application updates automatically last today (
                  {format(new Date(), "EEE, MMMM d, yyyy")}) about{" "}
                  {Math.floor(Math.random() * 5)} hr(s) ago
                  {/* date.now time - 2 hrs */}
                </p>
              </aside>
            </div>
            <p></p>
            <p></p>
            {/*  */}
            <h1>Themes</h1>
            <ul className="themes">
              <li>
                <aside className="_a">
                  <span>
                    <MdDarkMode />
                  </span>
                  <p> Dark Theme</p>
                </aside>
                <aside className="_b">
                  {/*  */}
                  <div className="switch-wrapper-1">
                    <input
                      className="tgl tgl-light"
                      id="switch-basic-1"
                      title="switch"
                      type="checkbox"
                      checked
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
                      checked={false}
                    />
                    <label className="tgl-btn" htmlFor="switch-basic-2"></label>
                  </div>
                </aside>
              </li>
            </ul>
            <p></p>
            <p></p>
            {/*  */}
            <h1>Notifications</h1>
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
                  checked
                  aria-checked
                />
                <label className="tgl-btn" htmlFor="switch-basic-3"></label>
              </div>
            </div>

            <br />
            <span>Current Build {systemInfo?.appVersion}</span>
            <span>
              {" "}
              <AiFillWindows /> {systemInfo?.systemVersion} Home Edition
            </span>
            <span>
              {" "}
              Linklist © 2019. Links Management System. All Rights Reserved
            </span>
            <br />
            <ul>
              <li>
                <a
                  href=""
                  title="About linklist"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://linklists.netlify.app/info/about",
                    );
                  }}
                >
                  <BsExclamation />
                  <p>About</p>
                </a>
              </li>
              <li>
                <a
                  href=""
                  title="give feedback"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://linklists.netlify.app/users/feedback",
                    );
                  }}
                >
                  <MdFeedback />
                  <p>Feedbacks</p>
                </a>
              </li>

              {/*  */}
              <li>
                <a
                  href="https://linklists.netlify.app/info/about"
                  title="get help"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <GiHelp />
                  <p>Help</p>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  href="https://api-linklist-restapi.onrender.com/"
                  title="api"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <TbApiApp />
                  <p>Api</p>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  href=""
                  title="privacy policy"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://linklists.netlify.app/policy",
                    );
                  }}
                >
                  <MdPrivacyTip />
                  <p>Privacy Policy</p>
                </a>
              </li>
            </ul>
            {/*  */}
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationSettingsDashboardWindow;
