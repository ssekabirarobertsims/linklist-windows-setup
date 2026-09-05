import React, { useEffect, useState } from "react";
// import { DashboardFooterComponent } from "../components/Footer.Components";
import "../stylesheets/Windows/Application.Links.Read.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
// import {
//   MobileViewSideBarComponent,
//   WebViewSideBarComponent,
// } from "../components/Side.Bars.Components";
// import { DashboardPageNavigationBarComponent } from "../components/Navigation.Bar.Components";
// // Ensure that the environment variables are loaded correctly
// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  originalUrl?: string;
  shortUrl?: string;
  customAlias?: string;
  user_id: string;
  _date: string;
  description: string;
  tags?: string[];
  notes?: string;
};

type LinkTag = {
  tagId: string;
  taggedLinkId: string;
  _tagDate: string;
  _tagTime: string;
  tag: string;
};

// import { format } from "date-fns";
import { BiCopy, BiLeftArrowAlt, BiPencil, BiTrash } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
// import { PiNoteFill } from "react-icons/pi";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import LinksSharingFormUtilsComponent from "../components/utils/Links.Sharing.Form.Utils.Component";
import CopyTextToClipboard from "../functions/Copy.Text.To.Clipboard.Function";
import { Link, useSearchParams } from "react-router-dom";
import { TbFileExport } from "react-icons/tb";
import { FaHashtag, FaLink } from "react-icons/fa";
import { MdDateRange, MdOutlineOpenInNew } from "react-icons/md";
import { format } from "date-fns/format";
import { v4 as uuidv4 } from "uuid";

const maximumTagsPerLink = 5;
const maximumTagLength = 15;

const ApplicationLinksReadDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[],
  );

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const fetchLinks = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllExistingLinks()) as ListItemProperties[];
      // set the links list state
      setLinksList(links);
      // return an arr[] for the links
      return links;
    };

    fetchLinks();
  }, []);

  // set state for the link list
  useEffect(() => {
    setLinksList(linksList);
  }, [linksList]);

  // get id for link to be read from the request params
  const [searchParams] = useSearchParams();

  // select the link to read
  const selectedLink: ListItemProperties | undefined = linksList.find(
    (link: ListItemProperties) => link.id === searchParams.get("id"),
  );

  // set state for showing the links share buttons components
  // This state controls the visibility of the links share buttons components
  const [showLinksShareButtonsComponents, setShowLinksShareButtonsComponents] =
    useState<boolean>(false);
  // This state holds the title of the link being shared
  //   const [sharedLinkTitle, setSharedLinkTitle] = useState<string | null>(null);
  // This state holds the URL of the link being shared
  const [sharedLink, setSharedLink] = useState<string | null>(null);
  const [linkTags, setLinkTags] = useState<LinkTag[]>([]);
  const [showAddTagForm, setShowAddTagForm] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");
  const [tagLimitWarning, setTagLimitWarning] = useState<string>("");

  const fetchLinkTags = async (linkId: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const tags = (await window.app_api.readAllLinkTags()) as LinkTag[];
    setLinkTags(tags.filter((tag) => tag.taggedLinkId === linkId));
  };

  useEffect(() => {
    if (selectedLink) {
      fetchLinkTags(selectedLink.id);
    } else {
      setLinkTags([]);
    }
  }, [selectedLink?.id]);

  // //////////////////////
  const handleSaveOpenedLink = async (
    event: React.MouseEvent,
  ): Promise<void> => {
    event.stopPropagation(); // prevent event bubbling

    console.log("Opening link:", selectedLink); // Log the link being opened

    if (!selectedLink) {
      console.warn("No link found for the requested id.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.app_api.openExternalLink(
      String(selectedLink.link), // filter out links.id !== LinkID: O(1) // Constant time
    );

    // prepare the link data
    const LinkData = {
      title: selectedLink.title ?? "Title",
      link: selectedLink.link ?? "https://www.example.com",
      user_id: selectedLink.user_id, // replace with actual user ID if available
      _date: format(new Date(), "EEE, MMMM d, yyyy"),
      description: selectedLink.description,
      id: selectedLink.id,
    };

    // create new link via context bridge api
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response: string = await window.app_api.createNewOpenedLink(LinkData);
    console.log("Create opened link response:", response);
  };

  // ///////////////////////////////
  const handleSaveSharedLink = async (
    event: React.MouseEvent,
  ): Promise<void> => {
    event.stopPropagation(); // prevent event bubbling
    setShowLinksShareButtonsComponents(true); // make form visible

    if (!selectedLink) {
      console.warn("No link found for the requested id.");
      return;
    }

    // prepare the link data
    const LinkData = {
      title: selectedLink.title ?? "Title",
      link: selectedLink.link ?? "https://www.example.com",
      user_id: selectedLink.user_id, // replace with actual user ID if available
      _date: format(new Date(), "EEE, MMMM d, yyyy"),
      description: selectedLink.description,
      id: selectedLink.id,
    };

    // create new link via context bridge api
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response: string = await window.app_api.createNewSharedLink(LinkData);
    console.log("Create Shared link response:", response);
  };

  const handleAddLinkTag = (event: React.MouseEvent): void => {
    event.stopPropagation();

    if (linkTags.length >= maximumTagsPerLink) {
      setShowAddTagForm(false);
      setTagLimitWarning("A link can have a maximum of 5 tags.");
      return;
    }

    setTagLimitWarning("");
    setTagInput("");
    setShowAddTagForm(true);
  };

  const handleSaveLinkTag = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    const tag = tagInput.trim();
    if (!selectedLink || !tag) {
      return;
    }

    if (tag.length > maximumTagLength) {
      setTagLimitWarning("Tags must be 15 characters or fewer.");
      return;
    }

    const now = new Date();
    const tagData: LinkTag = {
      tagId: uuidv4(),
      taggedLinkId: selectedLink.id,
      _tagDate: format(now, "EEE, MMMM d, yyyy"),
      _tagTime: format(now, "HH:mm:ss"),
      tag,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response: string = await window.app_api.createNewLinkTag(tagData);
    console.log("Create link tag response:", response);

    if (response !== "Link tag created successfully.") {
      setShowAddTagForm(false);
      setTagLimitWarning(response);
      return;
    }

    setShowAddTagForm(false);
    setTagInput("");
    await fetchLinkTags(selectedLink.id);
  };

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Read Link | LinkList";
  }, []);

  // Helper to compute favicon URL for a given link, falling back to local image
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

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-read-links-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-read-links-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Read Link"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>

          <div className="_application-read-links-dashboard-window-components-wrapper">
            {/* present data on ui  */}
            {selectedLink === undefined ? (
              <div style={{ textAlign: "center", padding: "2em" }}>
                <p>Link not found</p>
              </div>
            ) : (
              <>
                {/* Share link buttons component */}
                {showLinksShareButtonsComponents && selectedLink && (
                  <div
                    className="links-sharing-form"
                    onClick={(event) => {
                      event.stopPropagation(); // stop event propagation
                      setShowLinksShareButtonsComponents(false);
                      setSharedLink(sharedLink);
                    }}
                  >
                    <LinksSharingFormUtilsComponent
                      url={selectedLink.link}
                      title={selectedLink.title}
                    />
                  </div>
                )}
                <Link
                  to={{
                    pathname: "/links",
                  }}
                  id="fallback-page-arrow"
                >
                  <BiLeftArrowAlt />
                </Link>
                <h2
                  id={selectedLink?.id}
                >{`${selectedLink?.title ? selectedLink?.title : "Saved Link"} `}</h2>

                <p></p>
                <img
                  src={getFaviconUrl(selectedLink?.link)}
                  alt={`${selectedLink?.title} favicon`} // O(1) -- Constant time
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/favicon/OIP.webp";
                  }}
                />
                <br />
                <span>{selectedLink?.id}</span>
                <p>
                  <MdDateRange /> Created on {selectedLink?._date}
                </p>
                <a
                  href={`${selectedLink?.link}`}
                  title={`${selectedLink?.title}`}
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(String(selectedLink?.link)); // O(1) -- Constant time
                  }}
                >
                  <FaLink /> {`${selectedLink?.link}`}
                </a>
                <a
                  href={`${selectedLink?.link}`}
                  title={`${selectedLink?.title}`}
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(String(selectedLink?.link)); // O(1) -- Constant time
                  }}
                >
                  <b>Short Link:</b>{" "}
                  {`${selectedLink?.shortUrl ? selectedLink?.shortUrl : null}`}
                </a>
                <br />
                <h4>Description</h4>
                <p>{`${
                  selectedLink?.description === "" ||
                  selectedLink?.description === null ||
                  selectedLink?.description === undefined
                    ? `"${selectedLink?.title ? selectedLink?.title : "Saved Link"}" — saved to LinkList as a convenient reference for future use. This resource contains material I anticipate consulting again, so I preserved the link here to ensure reliable, quick access to the original source. The title and URL are recorded to make relocation straightforward; consider adding personal notes to capture context or why this link was particularly useful.`
                    : selectedLink?.description
                }`}</p>
                <br />

                <section className="link-tags-section">
                  <h4>Tags</h4>
                  {tagLimitWarning && (
                    <p className="link-tags-limit-warning">{tagLimitWarning}</p>
                  )}
                  {linkTags.length > 0 ? (
                    <ul className="link-tags-list">
                      {linkTags.map((linkTag) => (
                        <li key={linkTag.tagId}>{linkTag.tag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="link-tags-empty">No tags added</p>
                  )}
                  {showAddTagForm && (
                    <form
                      className="add-link-tag-form"
                      onSubmit={handleSaveLinkTag}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <label htmlFor="link-tag-input">Add a tag</label>
                      <input
                        id="link-tag-input"
                        type="text"
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        placeholder="Enter tag"
                        maxLength={maximumTagLength}
                        autoFocus
                      />
                      <div className="add-link-tag-form-actions">
                        <button type="submit">Add Tag</button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddTagForm(false);
                            setTagInput("");
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                {/*  */}
                <h4>Link actions</h4>
                <ul>
                  <li>
                    <BiPencil />
                    <span>Edit</span>
                  </li>{" "}
                  <li
                    onClick={(event) => {
                      event.stopPropagation(); // prevent event bubbling
                      CopyTextToClipboard(selectedLink?.link); // copy link to windows clipboard // O(1) -- Constant time
                    }}
                  >
                    <BiCopy />
                    <span>Copy</span>
                  </li>{" "}
                  {/* generate txt file and include list for the lists */}
                  <li onClick={handleSaveSharedLink}>
                    <RiShareForwardLine />
                    <span>Share</span>
                  </li>
                  {/* export links into a file */}
                  <li
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // stop event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.exportDataToFile(
                        [
                          {
                            id: selectedLink?.id ?? "", // O(1) -- Constant time
                            title: selectedLink?.title ?? "", // O(1) -- Constant time
                            link: selectedLink?.link ?? "", // O(1) -- Constant time
                            _date: selectedLink?._date ?? "", // O(1) -- Constant time
                          },
                        ],
                        `txt`,
                      );
                    }}
                  >
                    <TbFileExport />
                    <span>Export</span>
                  </li>
                  {/* invoke event to the application to open external links */}
                  <li onClick={handleSaveOpenedLink}>
                    <MdOutlineOpenInNew />
                    <span>Open</span>
                  </li>
                  <li onClick={handleAddLinkTag}>
                    <FaHashtag />
                    <span>Tag Link</span>
                  </li>
                  <li
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // prevent event bubbling
                      // delete link from the saved links
                      const response: string =
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        await window.app_api.deleteExistingLink(
                          selectedLink,
                          selectedLink?.id,
                        ); // filter out links.id !== LinkID: O(1) // Constant time
                      // reload app
                      window.location.href = "/links";
                      console.log("Delete link response:", response);
                    }}
                  >
                    <BiTrash />
                    <span>Delete</span>
                  </li>{" "}
                </ul>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationLinksReadDashboardWindow;
