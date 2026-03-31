import {
  useEffect,
  useState,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiArchive, BiLink } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import { IoCreateOutline, IoSettingsOutline } from "react-icons/io5";
import { LuDatabaseBackup } from "react-icons/lu";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
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
};

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
      },
      {
        id: uuidV4(),
        content: "Archives",
        icon: <BiArchive />,
        link: `/archives`,
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
      },
      {
        id: uuidV4(),
        content: "Export",
        icon: <TbFileImport />,
        link: `/export/formats`,
      },
      {
        id: uuidV4(),
        content: "Backup",
        icon: <LuDatabaseBackup />,
        link: `/backup`,
      },
    ] as NavigationListItemProps[]);

    // Sidebar navigation list, dynamically generates links based on user username
    const [list_2, setList_2] = useState<NavigationListItemProps[]>([
      {
        id: uuidV4(),
        content: "My Profile",
        link: `/profile`,
        icon: <CgProfile />,
      },
      {
        id: uuidV4(),
        content: "Settings",
        link: `/settings`,
        icon: <IoSettingsOutline />,
      },
    ] as NavigationListItemProps[]);

    // Keep the sidebar list in sync (not strictly necessary here)
    useEffect(() => setList(list), [list]);
    useEffect(() => setList_2(list_2), [list_2]);

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

                      <label>{item.amount ? `(${item.amount})` : ""}</label>
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
            <button className="logout-btn">
              <FaSignOutAlt />
              Log Out
            </button>
          </div>
        </aside>
      </>
    );
  };

export default ApplicationAsideNavigationDashboardBarAtomicComponent;
