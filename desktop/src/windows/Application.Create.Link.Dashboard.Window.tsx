import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/Windows/Application.Create.Link.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";

// import { format } from "date-fns";

import { format } from "date-fns";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { v4 } from "uuid";
import { Link } from "react-router-dom";

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

const ApplicationCreateLinkDashboardWindow: React.FunctionComponent = () => {
  // State for form fields
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buttonRef = useRef<any>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const handleSaveLink = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation(); // prevent event bubbling
    // validate required fields
    const missingFields: string[] = [];
    if (!title || title.trim() === "") missingFields.push("Title");
    if (!link || link.trim() === "") missingFields.push("URL");
    // Description is optional

    if (missingFields.length > 0) {
      window.alert(
        `Please provide the following required field(s): ${missingFields.join(", ")}`,
      );
      return;
    }

    // check for duplicate title (case-insensitive)
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const existingLinks = (await window.app_api.readAllExistingLinks()) as
        | { title?: string }[]
        | undefined;

      const normalized = title.trim().toLowerCase();
      if (
        existingLinks &&
        existingLinks.some(
          (l) => (l.title ?? "").trim().toLowerCase() === normalized,
        )
      ) {
        window.alert(
          "A link with that title already exists. Please choose a different title.",
        );
        return;
      }
    } catch (err) {
      console.warn("Could not validate duplicate titles", err);
      // allow proceed if validation can't run
    }

    // prepare the link data
    const LinkData = {
      id: v4(),
      title: title.trim(),
      originalUrl: link.trim(),
      link: link.trim(),
      shortUrl: `ll://${generateShortCode()}`,
      customAlias: createCustomAlias(title.trim()),
      user_id: "", // replace with actual user ID if available
      _date: format(new Date(), "EEE, MMMM d, yyyy"),
      description: description.trim() || "Saved from manual entry",
    };

    // show loader on immediate function call
    setShowLoader(true);

    // create new link via context bridge api
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response: string = await window.app_api.createNewLink(LinkData);
    console.log("Create link response:", response);
    // hide loader if response includes success
    if (response.toLocaleLowerCase().includes("success")) {
      window.alert(`Link saved successfully. Short URL: ${LinkData.shortUrl}`);
      window.setTimeout(() => {
        setShowLoader(false); // hider loader
        // redirect to links page after a short delay
        window.location.href = "/links";
      }, 1200);
    }

    // disable button to prevent multiple requests
    if (buttonRef && (buttonRef.current as HTMLButtonElement | null)) {
      const btn = buttonRef.current as unknown as HTMLButtonElement | null;
      if (btn) btn.disabled = true;
    }
  };

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Create Link | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* <OfflineElementsComponent /> */}
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-create-link-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-create-link-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Create Link"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>
          {/* user welcome banner and stats */}
          <div className="_application-create-link-dashboard-window-components-wrapper">
            <h1>Create a new link</h1>
            <br />
            <form
              action=""
              method="post"
              encType="multipart/form-data"
              className="create-link-form"
              id="create-link-form"
            >
              <article className="_wrapper">
                <h3>Link details</h3>
                <p>
                  Please provide the necessary details for the new link you want
                  to create below in a structured format.
                </p>
                <br />
                {/* Input for link title */}
                <label htmlFor="create-link-form-title-input">Link title</label>
                <p></p>
                <input
                  type="text"
                  name="title"
                  id="create-link-form-title-input"
                  placeholder="Sample title"
                  aria-placeholder="Sample title"
                  required
                  maxLength={50}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                {/* Input for link URL */}
                <label htmlFor="create-link-form-link-input">Link URL</label>
                <p></p>
                <input
                  type="text"
                  name="link"
                  id="create-link-form-link-input"
                  placeholder="https://example.com"
                  aria-placeholder="https://example.com"
                  required
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                />
                {/* Input for link description */}
                <label htmlFor="create-link-form-description-input">
                  Link Description
                </label>
                <p></p>
                <textarea
                  name="create-link-form-description-input"
                  id="create-link-form-description-input"
                  placeholder="This is my favorite link..."
                  aria-placeholder="This is my favorite link..."
                  value={description}
                  onChange={(event) =>
                    setDescription((event.target as HTMLTextAreaElement).value)
                  }
                ></textarea>
                <p></p>
                <p></p>
                <div className="form-buttons-container">
                  {/* Save button */}
                  <button
                    type="button"
                    ref={buttonRef}
                    onClick={handleSaveLink}
                  >
                    {showLoader && (
                      <article className="create-link-request-loader-wrapper">
                        <div className="create-link-request-loader"></div>
                      </article>
                    )}
                    submit
                  </button>
                  {/* Save button */}
                  <Link
                    to={{
                      pathname: "/",
                    }}
                  >
                    <button type="button">cancel</button>
                  </Link>
                </div>
              </article>
            </form>
          </div>
        </section>
      </main>
      {/* Footer and prime sidebar */}
      {/* <DashboardFooterComponent /> */}
    </>
  );
};

export default ApplicationCreateLinkDashboardWindow;
