import {
  useEffect,
  useState,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiArchive, BiExit, BiLink } from "react-icons/bi";
import { IoCreateOutline, IoSettingsOutline } from "react-icons/io5";
import { LuDatabaseBackup } from "react-icons/lu";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
import { TbFileImport } from "react-icons/tb";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
// Define the type for sidebar navigation items
type NavigationListItemProps = {
  id: string;
  content: string;
  icon: ReactNode;
  link: string;
  query?: string;
  amount?: number;
  shortcut?: string;
};

import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";
import { GrPersonalComputer } from "react-icons/gr";

const ApplicationAsideNavigationDashboardBarAtomicComponent: FunctionComponent =
  () => {
    // Sidebar navigation list, dynamically generates links based on user username
    const [list, setList] = useState<NavigationListItemProps[]>([
      {
        id: uuidV4(),
        content: "Home",
        icon: <AiOutlineHome />,
        link: `/`,
      },
      {
        id: uuidV4(),
        content: "Links",
        icon: <BiLink />,
        link: `/links`,
        shortcut: "Ctrl + L",
      },
      {
        id: uuidV4(),
        content: "Archives",
        icon: <BiArchive />,
        link: `/archives`,
        shortcut: "Ctrl + A",
      },
      {
        id: uuidV4(),
        content: "Collections",
        icon: <MdOutlineCollectionsBookmark />,
        link: `/collections`,
      },
      {
        id: uuidV4(),
        content: "Create",
        icon: <IoCreateOutline />,
        link: `/new`,
        shortcut: "Ctrl + C",
      },
      {
        id: uuidV4(),
        content: "Export",
        icon: <TbFileImport />,
        link: `/export/formats`,
        shortcut: "Ctrl + E",
      },
      {
        id: uuidV4(),
        content: "Backup",
        icon: <LuDatabaseBackup />,
        link: `/backup`,
        shortcut: "Ctrl + B",
      },
    ] as NavigationListItemProps[]);

    // Sidebar navigation list, dynamically generates links based on user username
    const [list_2, setList_2] = useState<NavigationListItemProps[]>([
      {
        id: uuidV4(),
        content: "Device",
        icon: <GrPersonalComputer />,
        link: `/profile`,
      },
      {
        id: uuidV4(),
        content: "Settings",
        link: `/settings`,
        icon: <IoSettingsOutline />,
        shortcut: "Ctrl + s",
      },
    ] as NavigationListItemProps[]);

    // Keep the sidebar list in sync (not strictly necessary here)
    useEffect(() => setList(list), [list]);
    useEffect(() => setList_2(list_2), [list_2]);

    // Fetch counts for various resources and update the sidebar amounts
    useEffect(() => {
      const fetchCounts = async (): Promise<void> => {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const allLinks = (await window.app_api.readAllExistingLinks()) as
            | { length: number }
            | undefined;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const archives = (await window.app_api.readAllLinkArchives()) as
            | { length: number }
            | undefined;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const collections = (await window.app_api.readCollectionsData()) as
            | { length: number }
            | undefined;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const backups = (await window.app_api.readAllRecentBackup()) as
            | { length: number }
            | undefined;

          const linksCount = allLinks?.length ?? 0;
          const archivesCount = archives?.length ?? 0;
          const collectionsCount = collections?.length ?? 0;
          const backupsCount = backups?.length ?? 0;

          setList((prev) =>
            prev.map((item) => {
              switch (item.content.toLowerCase()) {
                case "links":
                  return { ...item, amount: linksCount };
                case "archives":
                  return { ...item, amount: archivesCount };
                case "collections":
                  return { ...item, amount: collectionsCount };
                case "backup":
                case "backups":
                  return { ...item, amount: backupsCount };
                case "export":
                case "exports":
                  return { ...item, amount: collectionsCount };
                default:
                  return item;
              }
            }),
          );
        } catch (err) {
          // non-fatal; keep defaults
          console.warn("Failed to fetch sidebar counts", err);
        }
      };

      fetchCounts();
    }, []);

    const handleExitApplication = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.app_api.exitApplication();
    };

    return (
      <>
        <aside className="full-desktop-aside-navigation-bar-component">
          <div id="_wrapper">
            <p></p>
            <span>Main Navigation</span>

            <ul>
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
                    <p>
                      {item.content as Required<Readonly<string>>}
                      {item.amount ? (
                        <label className="nav-count">{`${item.amount}`}</label>
                      ) : (
                        ""
                      )}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <span>Others</span>
            <ul id="others">
              {list_2.map((item: NavigationListItemProps) => (
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
                    <p>
                      {item.content as Required<Readonly<string>>}

                      <label>{item.amount ? `(${item.amount})` : ""}</label>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              className="exit-application-btn"
              onClick={handleExitApplication}
            >
              <BiExit />
              Exit Application
            </button>
          </div>
        </aside>
      </>
    );
  };

export default ApplicationAsideNavigationDashboardBarAtomicComponent;
