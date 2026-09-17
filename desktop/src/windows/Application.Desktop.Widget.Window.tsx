import {
  useEffect,
  useState,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { FiExternalLink } from "react-icons/fi";
import "../stylesheets/Windows/Application.Desktop.Widget.Window.Stylesheet.css";
import { BiLink } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdOutlineBackupTable } from "react-icons/md";
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

type WidgetTab = "links" | "trash" | "exports" | "backups";

type WidgetItem = {
  id?: string;
  title?: string;
  link?: string;
  filepath?: string;
  _date?: string;
  date_created?: string;
};

type WidgetAppApi = {
  readAllExistingLinks: () => Promise<unknown>;
  readAllLinkArchives: () => Promise<unknown>;
  readCollectionsData: () => Promise<unknown>;
  readAllRecentBackup: () => Promise<unknown>;
  closeDesktopWidget: () => Promise<unknown>;
  openExternalLink: (url: string) => Promise<unknown>;
};

const appApi = (window as unknown as { app_api: WidgetAppApi }).app_api;

const tabs: Array<{ id: WidgetTab; label: ReactNode }> = [
  { id: "links", label: <BiLink /> },
  { id: "trash", label: <BsTrash2 /> },
  { id: "exports", label: <FaRegFolderOpen /> },
  { id: "backups", label: <MdOutlineBackupTable /> },
];

const itemLabel = (item: WidgetItem, tab: WidgetTab): string => {
  if (tab === "links" || tab === "trash") {
    return item.title || item.link || "Untitled link";
  }

  return `${item.filepath?.slice(0, 30) + "..."}` || "Unnamed file";
};

const itemDate = (item: WidgetItem): string =>
  item._date || item.date_created || "No date";

const ApplicationDesktopWidgetWindow: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<WidgetTab>("links");
  const [items, setItems] = useState<Record<WidgetTab, WidgetItem[]>>({
    links: [],
    trash: [],
    exports: [],
    backups: [],
  });

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

  const loadWidgetData = async (): Promise<void> => {
    try {
      const [links, trash, exports, backups] = await Promise.all([
        appApi.readAllExistingLinks(),
        appApi.readAllLinkArchives(),
        appApi.readCollectionsData(),
        appApi.readAllRecentBackup(),
      ]);

      setItems({
        links: Array.isArray(links) ? (links as WidgetItem[]) : [],
        trash: Array.isArray(trash) ? (trash as WidgetItem[]) : [],
        exports: Array.isArray(exports) ? (exports as WidgetItem[]) : [],
        backups: Array.isArray(backups) ? (backups as WidgetItem[]) : [],
      });
    } finally {
      console.log(false);
    }
  };

  useEffect(() => {
    document.title = "LinkList Widget";
    void loadWidgetData();
    const refreshTimer = window.setInterval(() => void loadWidgetData(), 10000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const activeItems = items[activeTab];

  const getFaviconUrl = (url?: string): string => {
    try {
      if (!url) return "/favicon/OIP.webp";
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch {
      return "/favicon/OIP.webp";
    }
  };

  return (
    <main className="desktop-widget-window">
      <header className="desktop-widget-header">
        {/* <div className="desktop-widget-drag-region">
          <span className="desktop-widget-kicker">LinkList</span>
          <h1>Desktop widget</h1>
        </div>
        <div className="desktop-widget-actions">
          <button
            type="button"
            aria-label="Refresh widget data"
            title="Refresh widget data"
            onClick={() => void loadWidgetData()}
            disabled={isRefreshing}
          >
            <FiRefreshCw className={isRefreshing ? "is-spinning" : ""} />
          </button>
          <button
            type="button"
            aria-label="Hide widget"
            title="Hide widget"
            onClick={() => void appApi.closeDesktopWidget()}
          >
            <FiX />
          </button>
        </div> */}
      </header>
      <nav className="desktop-widget-tabs" aria-label="Widget sections">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "is-active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            <strong>{items[tab.id].length}</strong>
          </button>
        ))}
      </nav>
      <br />
      <span className="item-count">{activeItems.length} available items</span>
      <br />
      <section className="desktop-widget-list" aria-live="polite">
        {activeItems.length === 0 ? (
          <p className="desktop-widget-empty">Nothing here yet.</p>
        ) : (
          activeItems.map((item, index) => (
            <article
              className="desktop-widget-item"
              key={item.id || `${activeTab}-${index}`}
            >
              <div>
                {item.link && (
                  <img
                    src={getFaviconUrl(item.link)}
                    alt={`${item.title} favicon`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/favicon/OIP.webp";
                    }}
                  />
                )}
                {item.filepath && (
                  <img src="/imgs/folder.png" alt={`${item.title} favicon`} />
                )}

                <article>
                  <strong>{itemLabel(item, activeTab)}</strong>
                  <small>{itemDate(item)}</small>
                </article>
              </div>
              {item.link && (
                <button
                  type="button"
                  aria-label={`Open ${item.title || item.link}`}
                  title="Open link"
                  onClick={() => void appApi.openExternalLink(item.link || "")}
                >
                  <FiExternalLink />
                </button>
              )}
            </article>
          ))
        )}
      </section>
      <br />
      <span className="device-info">
        Current Build {deviceInfo?.appVersion}
      </span>
      <span className="device-info">
        {" "}
        <AiFillWindows /> {deviceInfo?.systemVersion} Edition
      </span>
      <br />
    </main>
  );
};

export default ApplicationDesktopWidgetWindow;
