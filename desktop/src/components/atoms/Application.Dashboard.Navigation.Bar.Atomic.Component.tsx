import { type FunctionComponent } from "react";
// import { BiBell } from "react-icons/bi";
// import { LuBellDot } from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
// import { FaCaretDown } from "react-icons/fa";

interface propTypes {
  window: string;
}

// interface DeviceInfo {
//   appVersion: string;
//   systemVersion: string;
//   platform: string;
//   release: string;
//   deviceName: string;
//   registeredUser: string;
//   totalMemoryGB: number;
//   usedMemoryGB: number;
//   freeMemoryGB: number;
//   diskTotalGB: number;
//   diskFreeGB: number;
//   diskUsedGB: number;
//   diskUsagePercent: number;
//   now: string;
// }

const ApplicationDashboardNavigationBarAtomicComponent: FunctionComponent<
  propTypes
> = ({ window }) => {
  // const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({} as DeviceInfo);

  // const getDeviceInformation = async (): Promise<void> => {
  //   try {
  //     const systemInformation =
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-expect-error
  //       (await window.app_api.systemInformation()) as DeviceInfo;
  //     setDeviceInfo(systemInformation);
  //   } catch (error) {
  //     console.warn("Failed to read device information", error);
  //   }
  // };

  // useEffect(() => {
  //   getDeviceInformation();
  // }, []);

  return (
    <>
      <nav>
        <article>
          <div id="_a">
            <button type="button" title="show/hide menu">
              <MdSpaceDashboard />
            </button>
            <span>{window}</span>
          </div>
          <div id="_b">
            <img src="/icons/logo.png" alt="" />
            {/* <span>
              <LuBellDot />
            </span> */}
          </div>
        </article>
      </nav>
    </>
  );
};

export default ApplicationDashboardNavigationBarAtomicComponent;
