import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { v4 as uuidV4 } from "uuid";
import "./stylesheets/Windows/Application.Links.Dashboard.Window.Stylesheet.css";
import ApplicationRecentBackupsDashboardWindow from "./windows/Application.Recent.Data.Backups.Dashboard.Window";
import ApplicationOpenedLinksDashboardWindow from "./windows/Application.Opened.Links.Dashboard.Window";
import ApplicationSharedLinksDashboardWindow from "./windows/Application.Shared.Links.Dashboard.Window";
import ApplicationTaggedLinksDashboardWindow from "./windows/Application.Tagged.Links.Dashboard.Window";
import ApplicationDesktopWidgetWindow from "./windows/Application.Desktop.Widget.Window";

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

const generateShortCode = (): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";

  for (let index = 0; index < 6; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return value;
};

const createCustomAlias = (value: string): string => {
  const normalizedValue = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalizedValue || `link-${generateShortCode()}`;
};

function Application() {
  const [user, setUser] = useState<user>({} as user);
  console.log(user);
  const navigate = useNavigate();
  const [clipboardPrompt, setClipboardPrompt] = useState<{
    title: string;
    url: string;
    description: string;
  } | null>(null);
  const [clipboardTitle, setClipboardTitle] = useState<string>("");
  const [clipboardUrl, setClipboardUrl] = useState<string>("");
  const [clipboardDescription, setClipboardDescription] = useState<string>("");
  const [clipboardSaving, setClipboardSaving] = useState<boolean>(false);

  const generateRandomDescription = (): string => {
    const descriptions = [
      "This link was quickly saved from your clipboard for convenient access later. It has not yet been reviewed or categorized, so the information shown may be incomplete. Open the link when you're ready, add notes, assign tags, or move it into a collection to keep your workspace organized",
      "A new link has been captured directly from your clipboard and securely stored in your local LinkList library. This temporary description serves as a placeholder until you personalize it. Consider updating the title, adding meaningful notes, assigning tags, or placing it into the appropriate collection to make it easier to find and manage in the future.",
      "This resource was automatically saved after being detected in your clipboard, ensuring you don't lose important web pages, articles, videos, or documents. While the original URL has been preserved, you can improve its organization by editing the description, attaching files, adding reminders, marking it as a favorite, or retrieving additional online information using the About This Link feature whenever you're connected to the internet.",
      "This link is waiting to be reviewed and organized. It was added through the Clipboard Monitor for quick and effortless saving, allowing you to continue your work without interruption. Before archiving or sharing this resource, you may wish to verify its contents, customize its details, assign tags, add personal notes, and fetch website information to create a richer and more searchable entry in your LinkList library..",
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  useEffect(() => {
    const appApi = (
      window as unknown as Window & {
        app_api?: {
          listenForClipboardLink?: (
            callback: (payload: unknown) => void,
          ) => () => void;
          saveClipboardLinkFromPrompt?: (
            linkData: Record<string, string>,
          ) => Promise<string>;
        };
      }
    ).app_api;

    if (!appApi?.listenForClipboardLink) {
      return undefined;
    }

    const removeListener = appApi.listenForClipboardLink((payload: unknown) => {
      const clipboardPayload = payload as {
        title?: string;
        url?: string;
        description?: string;
      };
      const promptData = {
        title: clipboardPayload?.title || "Clipboard link",
        url: clipboardPayload?.url || "",
        description: generateRandomDescription(),
      };

      setClipboardPrompt(promptData);
      setClipboardTitle(promptData.title);
      setClipboardUrl(promptData.url);
      setClipboardDescription(generateRandomDescription());
    });

    return () => removeListener();
  }, []);

  const handleClipboardSave = async (): Promise<void> => {
    const appApi = (
      window as unknown as Window & {
        app_api?: {
          saveClipboardLinkFromPrompt?: (
            linkData: Record<string, string>,
          ) => Promise<string>;
        };
      }
    ).app_api;

    if (!clipboardPrompt || !appApi?.saveClipboardLinkFromPrompt) {
      return;
    }

    const trimmedUrl = clipboardUrl.trim() || clipboardPrompt.url.trim();
    if (!trimmedUrl) {
      window.alert("The clipboard URL is empty.");
      return;
    }

    setClipboardSaving(true);

    try {
      const linkData = {
        id: uuidV4(),
        title: clipboardTitle.trim() || clipboardPrompt.title,
        originalUrl: trimmedUrl,
        link: trimmedUrl,
        shortUrl: `ll://${generateShortCode()}`,
        customAlias: createCustomAlias(
          clipboardTitle.trim() || clipboardPrompt.title,
        ),
        user_id: "",
        _date: format(new Date(), "EEE, MMMM d, yyyy"),
        description: clipboardDescription.trim() || clipboardPrompt.description,
      };

      await appApi.saveClipboardLinkFromPrompt(linkData);
      setClipboardPrompt(null);
      setClipboardTitle("");
      setClipboardUrl("");
      setClipboardDescription("");
    } catch (error) {
      console.error("Failed to save clipboard link:", error);
      window.alert("Could not save this clipboard link.");
    } finally {
      setClipboardSaving(false);
    }
  };
  const getUserInformation = async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userInformation = await window.app_api.readUserInformation();
    setUser(userInformation);
    return userInformation;
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  // Global keyboard shortcuts handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTypingField = !!(
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
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
          path={"/links/shared"}
          element={<ApplicationSharedLinksDashboardWindow />}
        />
        <Route
          path={"/links/tagged"}
          element={<ApplicationTaggedLinksDashboardWindow />}
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

      {clipboardPrompt && (
        <div
          className="clipboard-link-prompt-overlay"
          onClick={() => setClipboardPrompt(null)}
        >
          <div
            className="clipboard-link-prompt-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="clipboard-link-prompt-header">
              <div>
                <p className="clipboard-link-prompt-eyebrow">
                  Clipboard detected
                </p>
              </div>
              <button
                type="button"
                className="clipboard-link-prompt-close"
                onClick={() => setClipboardPrompt(null)}
                disabled={clipboardSaving}
              >
                ×
              </button>
            </div>

            <label className="clipboard-link-prompt-field">
              <span>Title</span>
              <input
                type="text"
                value={clipboardTitle}
                onChange={(event) => setClipboardTitle(event.target.value)}
                placeholder="Suggested title"
              />
            </label>

            <label className="clipboard-link-prompt-field">
              <span>Link</span>
              <input
                type="text"
                value={clipboardUrl}
                onChange={(event) => setClipboardUrl(event.target.value)}
                placeholder="https://"
              />
            </label>

            <label className="clipboard-link-prompt-field">
              <span>Description</span>
              <textarea
                value={generateRandomDescription()}
                onChange={(event) =>
                  setClipboardDescription(event.target.value)
                }
                rows={3}
                placeholder="Add a note"
              />
            </label>

            <div className="clipboard-link-prompt-actions">
              <button
                type="button"
                className="clipboard-link-prompt-action clipboard-link-prompt-action-primary"
                onClick={handleClipboardSave}
                disabled={clipboardSaving}
              >
                {clipboardSaving ? "Saving..." : "Save link"}
              </button>
              <button
                type="button"
                className="clipboard-link-prompt-action clipboard-link-prompt-action-secondary"
                onClick={() => setClipboardPrompt(null)}
                disabled={clipboardSaving}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}

function ApplicationEntry() {
  if (new URLSearchParams(window.location.search).has("widget")) {
    return <ApplicationDesktopWidgetWindow />;
  }

  return <Application />;
}

export default ApplicationEntry;
