import { useEffect, useState, type FunctionComponent } from "react";

import { TbApiApp } from "react-icons/tb";
import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";
import { GrUserWorker } from "react-icons/gr";
import { MdFeedback, MdPrivacyTip } from "react-icons/md";
import { GiHelp } from "react-icons/gi";
import { HiInformationCircle } from "react-icons/hi";
import { LuBellDot } from "react-icons/lu";
import { BiWifi, BiWifiOff } from "react-icons/bi";

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

const ApplicationMiniAsideNavigationDashboardBarAtomicComponent: FunctionComponent =
  () => {
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

    const isOnline: boolean = window.navigator.onLine as boolean;

    return (
      <>
        <aside className="full-desktop-mini-aside-navigation-bar-component">
          <div id="_wrapper">
            <p></p>
            <img
              src="/avatars/laptop-avatar.avif"
              className="profile-avatar"
              alt="device avatar"
              title={`Device @${deviceInfo?.deviceName} ${deviceInfo?.systemVersion} Edition `}
            />
            <br />
            <ul>
              <li>
                <a
                  href=""
                  id="_wrapper"
                  title="Developer"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://ssekabirarobertsims.netlify.app/info/about",
                    );
                  }}
                >
                  <span>
                    <GrUserWorker />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href=""
                  id="_wrapper"
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
                  <span>
                    <HiInformationCircle />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href=""
                  id="_wrapper"
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
                  <span>
                    <MdFeedback />
                  </span>
                </a>
              </li>

              {/*  */}
              <li>
                <a
                  id="_wrapper"
                  href="https://linklists.netlify.app/info/about"
                  title="get help"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <span>
                    <GiHelp />
                  </span>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  id="_wrapper"
                  href="https://api-linklist-restapi.onrender.com/"
                  title="api"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <span>
                    <TbApiApp />
                  </span>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  href=""
                  id="_wrapper"
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
                  <span>
                    <MdPrivacyTip />
                  </span>
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="notification-button"
              title="Notifications are enabled by default"
            >
              <LuBellDot />
            </button>
            <button
              type="button"
              className="internet-status-button"
              title={`${isOnline ? "Device is online" : "Device is offline"}`}
            >
              {isOnline ? <BiWifi /> : <BiWifiOff />}
            </button>
            {/*  */}
            {/* <ul>
              {list.map((item: NavigationListItemProps) => (
                <li key={item.id}>
                  <Link
                    id="_wrapper"
                    title={item.content}
                    to={{
                      pathname: item.link as Required<Readonly<string>>,
                      search: item.query,
                    }}
                  >
                    <span>{item.icon as ReactNode}</span>
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
        </aside>
      </>
    );
  };

export default ApplicationMiniAsideNavigationDashboardBarAtomicComponent;
