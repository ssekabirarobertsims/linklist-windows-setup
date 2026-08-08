import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.User.Profile.Dashboard.Window.Stylesheet.css";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
// import { Link } from "react-router-dom";
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
                  LinkList is running on this device as a dedicated link manager
                  application. You can manage your links, archives, and backups
                  from this device.
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
            <span id={"device-info-spans"}>
              Device @{deviceInfo?.deviceName}
            </span>
            <span id={"device-info-spans"}>
              Current Build {deviceInfo?.appVersion}
            </span>
            <span id={"device-info-spans"}>
              {" "}
              <AiFillWindows /> {deviceInfo?.systemVersion} Edition
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
            <span id={"copyright"}>
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
