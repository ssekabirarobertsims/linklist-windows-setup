import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ApplicationRecentBackupsDashboardWindow from "./windows/Application.Recent.Data.Backups.Dashboard.Window";
import ApplicationOpenedLinksDashboardWindow from "./windows/Application.Opened.Links.Dashboard.Window";
import ApplicationSharedLinksDashboardWindow from "./windows/Application.Shared.Links.Dashboard.Window";

/**
 * @author LinkList Dev Team
 * @description Main Application component that sets up routing for different dashboard windows.
 * @access public
 * @returns {JSX.Element} The Application component with routing.
 */

const ApplicationLinksDashboardWindow = lazy(
  () => import("./windows/Application.Links.Dashboard.Window"),
);
const ApplicationArchivesDashboardWindow = lazy(
  () => import("./windows/Application.Archives.Dashboard.Window"),
);
const ApplicationLinksReadDashboardWindow = lazy(
  () => import("./windows/Application.Links.Read.Dashboard.Window"),
);
const ApplicationHomeDashboardWindow = lazy(
  () => import("./windows/Application.Home.Dashboard.Window"),
);
const ApplicationCreateLinkDashboardWindow = lazy(
  () => import("./windows/Application.Create.Link.Dashboard.Window"),
);
const ApplicationSettingsDashboardWindow = lazy(
  () => import("./windows/Application.Settings.Dashboard.Window.Stylesheet"),
);
const ApplicationCollectionsDashboardWindow = lazy(
  () => import("./windows/Application.Collections.Dashboard.Window"),
);
const UserProfile = lazy(
  () => import("./windows/Application.User.Profile.Dashboard.Window"),
);
const ApplicationExportFormatsDashboardWindow = lazy(
  () => import("./windows/Application.Export.Formats.Dashboard.Window"),
);
const ApplicationDataBackupDashboardWindow = lazy(
  () => import("./windows/Application.Data.Backup.Dashboard.Window"),
);

/**
 * @description<user type>
 */
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

function Application() {
  const [user, setUser] = useState<user>({} as user);
  const navigate = useNavigate();
  const getUserInformation = async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userInformation = await window.app_api.readUserInformation();
    setUser(userInformation);
    return userInformation;
  };

  console.log(user);

  useEffect(() => {
    getUserInformation();
  }, []);

  // Global keyboard shortcuts handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTypingField = !!(
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)
      );

      if (isTypingField) return; // don't hijack typing or native copy

      const key = e.key?.toLowerCase();
      const modifierPressed = e.ctrlKey || e.metaKey;

      if (!modifierPressed || !key) return;

      // Map shortcuts (Ctrl/Cmd + key) to routes
      switch (key) {
        case "c": // create
          e.preventDefault();
          navigate("/new");
          break;
        case "b": // backup
          e.preventDefault();
          navigate("/backup");
          break;
        case "e": // export
          e.preventDefault();
          navigate("/export/formats");
          break;
        case "l": // links
          e.preventDefault();
          navigate("/links");
          break;
        case "a": // archives
          e.preventDefault();
          navigate("/archives");
          break;
        case "s": // settings
          e.preventDefault();
          navigate("/settings");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    // lazy load components to allow minimizing on the mem usage while Application loading
    <Suspense
      fallback={
        <div className="page-content-loader-wrapper">
          <div className="loader"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<ApplicationHomeDashboardWindow />} />
        <Route path="/home" element={<ApplicationHomeDashboardWindow />} />
        <Route path={"/links"} element={<ApplicationLinksDashboardWindow />} />
        <Route
          path={"/links/opened"}
          element={<ApplicationOpenedLinksDashboardWindow />}
        />
        <Route
          path={"/links/shared"}
          element={<ApplicationSharedLinksDashboardWindow />}
        />
        <Route
          path={"/read"}
          element={<ApplicationLinksReadDashboardWindow />}
        />
        <Route
          path={"/new"}
          element={<ApplicationCreateLinkDashboardWindow />}
        />
        <Route
          path={"/archives"}
          element={<ApplicationArchivesDashboardWindow />}
        />
        <Route
          path={"/settings"}
          element={<ApplicationSettingsDashboardWindow />}
        />
        <Route
          path={"/collections"}
          element={<ApplicationCollectionsDashboardWindow />}
        />
        <Route
          path={"/export/formats"}
          element={<ApplicationExportFormatsDashboardWindow />}
        />
        <Route
          path={"/backup"}
          element={<ApplicationDataBackupDashboardWindow />}
        />
        <Route
          path={"/backups"}
          element={<ApplicationRecentBackupsDashboardWindow />}
        />
        <Route path={"/profile"} element={<UserProfile />} />
      </Routes>
    </Suspense>
  );
}

export default Application;
