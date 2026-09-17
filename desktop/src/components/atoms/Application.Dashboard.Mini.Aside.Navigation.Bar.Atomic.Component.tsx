import { useEffect, useState, type FunctionComponent } from "react";
import Tooltip from "../utils/Tooltip.Util.Component";

import { TbApiApp } from "react-icons/tb";
import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";
import { GrUserWorker } from "react-icons/gr";
import { MdFeedback, MdOutlineWidgets, MdPrivacyTip } from "react-icons/md";
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
            <Tooltip
              content={`Device @${deviceInfo?.deviceName} ${deviceInfo?.systemVersion} Edition `}
              position="right"
            >
              <img
                src="/avatars/laptop-avatar.avif"
                className="profile-avatar"
                alt="device avatar"
              />
            </Tooltip>
            <br />
            <ul>
              <Tooltip content="About Linklist" position="right">
                <li className="mini-aside-li">
                  <a
                    href=""
                    id="_wrapper"
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
              </Tooltip>
              <Tooltip content="Give Feedback" position="right">
                <li className="mini-aside-li">
                  <a
                    href=""
                    id="_wrapper"
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
              </Tooltip>

              {/*  */}
              <Tooltip content="Get Help" position="right">
                <li className="mini-aside-li">
                  <a
                    id="_wrapper"
                    href="https://linklists.netlify.app/info/about"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <span>
                      <GiHelp />
                    </span>
                  </a>
                </li>
              </Tooltip>
              {/*  */}
              <Tooltip content="Api" position="right">
                <li className="mini-aside-li">
                  <a
                    id="_wrapper"
                    href="https://api-linklist-restapi.onrender.com/"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <span>
                      <TbApiApp />
                    </span>
                  </a>
                </li>
              </Tooltip>
              {/*  */}
              <Tooltip content="Privacy" position="right">
                <li className="mini-aside-li">
                  <a
                    href=""
                    id="_wrapper"
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
              </Tooltip>
              <Tooltip content="Developer" position="right">
                <li className="mini-aside-li">
                  <a
                    href=""
                    id="_wrapper"
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
              </Tooltip>
            </ul>
            <Tooltip content="Control Desktop Widget" position="right">
              <button
                type="button"
                className="notification-button"
                onClick={() => {
                  const appApi = (
                    window as unknown as {
                      app_api: { openDesktopWidget: () => Promise<unknown> };
                    }
                  ).app_api;
                  void appApi.openDesktopWidget();
                }}
              >
                <MdOutlineWidgets />
              </button>
            </Tooltip>
            <Tooltip content="Notifications Enabled" position="right">
              <button type="button" className="notification-button">
                <LuBellDot />
              </button>
            </Tooltip>
            <Tooltip
              content={`${isOnline ? "Device Wi-Fi is online" : "Device Wi-Fi is offline"}`}
              position="right"
            >
              <button type="button" className="internet-status-button">
                {isOnline ? <BiWifi /> : <BiWifiOff />}
              </button>
            </Tooltip>
            {/*  */}
          </div>
        </aside>
      </>
    );
  };

export default ApplicationMiniAsideNavigationDashboardBarAtomicComponent;
