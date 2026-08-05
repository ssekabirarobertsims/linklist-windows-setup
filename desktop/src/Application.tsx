import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ApplicationLoginFormWindow from "./windows/Application.Login.Form.Window";
import ApplicationSignupFormWindow from "./windows/Application.Signup.Form.Window";

/**
 * @author LinkList Dev Team
 * @description Main Application component that sets up routing for different dashboard windows.
 * @access public
 * @returns {JSX.Element} The Application component with routing.
 */

const ApplicationAuthRedirectWindow = lazy(
  () => import("./windows/Application.Auth.Redirect.Window"),
);
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
          path={"/read"}
          element={<ApplicationLinksReadDashboardWindow />}
        />
        <Route
          path={"/new"}
          element={<ApplicationCreateLinkDashboardWindow />}
        />
        <Route
          path={
            user.loggedIn === Boolean(true)
              ? "/auth/redirect/login"
              : "/archives"
          }
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
        <Route path={"/profile"} element={<UserProfile />} />
        <Route
          path="/auth/redirect"
          element={<ApplicationAuthRedirectWindow />}
        />
        <Route
          path="/auth/redirect/login"
          element={<ApplicationLoginFormWindow />}
        />
        <Route
          path="/auth/redirect/signup"
          element={<ApplicationSignupFormWindow />}
        />
      </Routes>
    </Suspense>
  );
}

export default Application;
