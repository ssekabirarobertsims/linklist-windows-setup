import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

/**
 * @author LinkList Dev Team
 * @description Main Application component that sets up routing for different dashboard windows.
 * @access public
 * @returns {JSX.Element} The Application component with routing.
 */

const ApplicationAuthRedirectWindow = lazy(
  () => import("./windows/Application.Auth.Redirect.Window")
);
const ApplicationLinksDashboardWindow = lazy(
  () => import("./windows/Application.Links.Dashboard.Window")
);
const ApplicationArchivesDashboardWindow = lazy(
  () => import("./windows/Application.Archives.Dashboard.Window")
);
const ApplicationLinksReadDashboardWindow = lazy(
  () => import("./windows/Application.Links.Read.Dashboard.Window")
);
const ApplicationHomeDashboardWindow = lazy(
  () => import("./windows/Application.Home.Dashboard.Window")
);
const ApplicationCreateLinkDashboardWindow = lazy(
  () => import("./windows/Application.Create.Link.Dashboard.Window")
);
const ApplicationSettingsDashboardWindow = lazy(
  () => import("./windows/Application.Settings.Dashboard.Window.Stylesheet")
);
const ApplicationCollectionsDashboardWindow = lazy(
  () => import("./windows/Application.Collections.Dashboard.Window")
);
const UserProfile = lazy(
  () => import("./windows/Application.User.Profile.Dashboard.Window")
);
const ApplicationExportFormatsDashboardWindow = lazy(
  () => import("./windows/Application.Export.Formats.Dashboard.Window")
);
const ApplicationDataBackupDashboardWindow = lazy(
  () => import("./windows/Application.Data.Backup.Dashboard.Window")
);

function Application() {
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
        <Route path="/links" element={<ApplicationLinksDashboardWindow />} />
        <Route path="/read" element={<ApplicationLinksReadDashboardWindow />} />
        <Route path="/new" element={<ApplicationCreateLinkDashboardWindow />} />
        <Route
          path="/archives"
          element={<ApplicationArchivesDashboardWindow />}
        />
        <Route
          path="/settings"
          element={<ApplicationSettingsDashboardWindow />}
        />
        <Route
          path="/collections"
          element={<ApplicationCollectionsDashboardWindow />}
        />
        <Route
          path="/export/formats"
          element={<ApplicationExportFormatsDashboardWindow />}
        />
        <Route
          path="/backup"
          element={<ApplicationDataBackupDashboardWindow />}
        />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/auth/redirect"
          element={<ApplicationAuthRedirectWindow />}
        />
      </Routes>
    </Suspense>
  );
}

export default Application;
