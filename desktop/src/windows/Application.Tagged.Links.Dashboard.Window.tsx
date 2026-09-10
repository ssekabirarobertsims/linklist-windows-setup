import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import "../stylesheets/Windows/Application.Links.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
import { Link } from "react-router-dom";
import { parse } from "date-fns";
// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  _date: string;
  description: string;
  tags?: string[];
  notes?: string;
};

import { BiCopy, BiLink, BiTrash } from "react-icons/bi";
import { TbFileExport, TbReload } from "react-icons/tb";
import { v4 as uuidV4 } from "uuid";
import { BsSearch } from "react-icons/bs";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { HiArrowDown } from "react-icons/hi";
import ExportCollectionOptionsUtilComponent from "../components/utils/Export.Collection.Options.Util.Component";
import CopyTextToClipboard from "../functions/Copy.Text.To.Clipboard.Function";
import { IoCloseSharp, IoReaderOutline } from "react-icons/io5";
import { ContentLoaderComponent } from "../components/utils/Content.Loader.Util.Components";
import {
  MdOutlineOpenInNew,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
} from "react-icons/md";
import ApplicationMiniAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Mini.Aside.Navigation.Bar.Atomic.Component";

// Helper function to sort links by date in reverse chronological order (most recent first)
const sortLinksByDateDescending = (
  links: ListItemProperties[],
): ListItemProperties[] => {
  return [...links].sort((a, b) => {
    try {
      const dateA = parse(a._date, "EEE, MMMM d, yyyy", new Date());
      const dateB = parse(b._date, "EEE, MMMM d, yyyy", new Date());
      return dateB.getTime() - dateA.getTime(); // Most recent first
    } catch {
      return 0; // If parsing fails, maintain original order
    }
  });
};

const ApplicationTaggedLinksDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[],
  );

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const readLinks = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllExistingTaggedLinks()) as ListItemProperties[];
      // sort links by date in reverse chronological order (most recent first)
      const sortedLinks = sortLinksByDateDescending(links);
      // set the links list state
      setLinksList(sortedLinks);
      // return an arr[] for the links
      return sortedLinks;
    };

    readLinks();
  }, []);

  // set state for the link list
  useEffect(() => {
    setLinksList(linksList);
  }, [linksList]);

  const [value, setValue] = useState<string>("");

  //   state to handle links list saving options
  const [showSavingOptions, setShowSavingOptions] = useState<boolean>(
    false as boolean,
  );
  //   state to handle selected links list actions options
  const [showSelectedLinksActions, setShowSelectedLinksActions] =
    useState<boolean>(false as boolean);

  // State to hold the search results
  // This state will be updated based on the search input value
  const [searchResults, setSearchResults] = useState<ListItemProperties[]>([
    linksList as unknown as ListItemProperties,
  ]);

  // Filter links based on search value across multiple fields (title, link, description, tags, notes)
  useEffect(() => {
    const query = value.trim().toLowerCase();

    if (query === "") {
      setSearchResults(linksList);
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);

    const filteredResults = linksList.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const link = item.link?.toLowerCase() ?? "";
      const description = item.description?.toLowerCase() ?? "";
      const tags = (item.tags ?? []).join(" ").toLowerCase();
      const notes = item.notes?.toLowerCase() ?? "";

      return tokens.every(
        (token) =>
          title.includes(token) ||
          link.includes(token) ||
          description.includes(token) ||
          tags.includes(token) ||
          notes.includes(token),
      );
    });

    setSearchResults(filteredResults);
  }, [value, linksList]);

  // set state for showing the content loader
  const [showContentLoader, setShowContentLoader] = useState<boolean>(true);

  //
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // arr to handle the selected links
  const searchResultsArr: ListItemProperties[][] = [];

  // Effect to hide the content loader after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContentLoader(false);
    }, 10000); // Hide loader after 1 second

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // state to handle selected links
  const [selectedLinks, setSelectedLinks] = useState<ListItemProperties[]>(
    [] as ListItemProperties[],
  );
  // arr to handle the selected links
  const selectedLinksArr: ListItemProperties[] = [] as ListItemProperties[];

  // hide the save collections options when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // check if the click is outside the save links collection button wrapper
      if (
        !target.closest("._save-links-collection-button-wrapper") &&
        showSavingOptions
      ) {
        setShowSavingOptions(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSavingOptions]);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Shared Links | LinkList";
  }, []);

  // Helper to compute favicon URL for a given link, falling back to local image
  const getFaviconUrl = (url?: string): string => {
    try {
      if (!url) return "/favicon/OIP.webp";
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return "/favicon/OIP.webp";
    }
  };

  // Render the dashboard Links page layout and content
  return (
    <>
      {showSelectedLinksActions && (
        <article className="selected-links-actions-util-component">
          <ul>
            {/* check all inputs*/}
            <li
              onClick={(event) => {
                {
                  event.stopPropagation(); // stop event bubbling

                  const inputs: HTMLInputElement[] =
                    window.document.querySelectorAll(
                      ".select-link-checkbox",
                    ) as unknown as HTMLInputElement[];
                  // Check all visible search results
                  setSelectedLinks(searchResults as ListItemProperties[]);
                  // Update UI
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = `${searchResults.length} selected link(s)`;
                  // empty search results count
                  (
                    window.document.querySelector(
                      ".search-results-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = ``;

                  // Check all visible inputs
                  inputs.forEach((input: HTMLInputElement) => {
                    input.checked = true as boolean;
                  });
                }
              }}
            >
              <MdRadioButtonChecked />
              <span>Check</span>
            </li>
            <li
              onClick={(event) => {
                event.stopPropagation(); // prevent event bubbling
                CopyTextToClipboard(JSON.stringify(selectedLinks)); // copy all the links selected as plain text to clipboard!
              }}
            >
              <BiCopy />
              <span>Copy</span>
            </li>{" "}
            {/* uncheck all inputs*/}
            <li
              onClick={(event) => {
                {
                  event.stopPropagation(); // stop event bubbling

                  const inputs: HTMLInputElement[] =
                    window.document.querySelectorAll(
                      ".select-link-checkbox",
                    ) as unknown as HTMLInputElement[];
                  // Clear all selections
                  setSelectedLinks([] as ListItemProperties[]);
                  // Update UI
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = `0 selected link(s)`;
                  // empty search results count
                  (
                    window.document.querySelector(
                      ".search-results-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = ``;

                  // uncheck all inputs
                  inputs.forEach((input: HTMLInputElement) => {
                    input.checked = false as boolean;
                  });
                }
              }}
            >
              <MdRadioButtonUnchecked />
              <span>Uncheck</span>
            </li>
            {/*  */}
            <li
              onClick={async (event): Promise<void> => {
                event.stopPropagation(); // stop event bubbling
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await window.app_api.exportDataToHTMLFile(
                  selectedLinks?.map((item) => item) ?? [],
                  `html`,
                  "Saved links",
                );
              }}
            >
              <TbFileExport />
              <span>Export</span>
            </li>
            <li>
              <BiTrash />
              <span>Delete</span>
            </li>{" "}
            {/* generate doc and include list for the lists */}
          </ul>
          <span
            onClick={(event) => {
              {
                event.stopPropagation(); // stop event bubbling

                const inputs: HTMLInputElement[] =
                  window.document.querySelectorAll(
                    ".select-link-checkbox",
                  ) as unknown as HTMLInputElement[];
                // remove label and its content
                (
                  window.document.querySelector(
                    ".selected-links-count-placeholder",
                  ) as HTMLSpanElement
                ).innerHTML = ``;

                // hide the actions options list
                setShowSelectedLinksActions(false);

                // uncheck all inputs
                inputs.forEach((input: HTMLInputElement) => {
                  input.checked = false as boolean;
                });

                // set the selected links count to 0
                setSelectedLinks([] as ListItemProperties[]);
              }
            }}
          >
            <IoCloseSharp />
          </span>
        </article>
      )}

      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-links-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-links-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Tagged Links"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>
          <div className="_application-links-dashboard-window-components-wrapper">
            {/* Search input for filtering links */}
            <div className="search-input-wrapper">
              <input
                type="search"
                name="search"
                id="search"
                onInput={(event) => {
                  setValue((event.target as HTMLInputElement).value);

                  // filter out a new arr[] to create a new one with the search results and the links needed to be filtered out
                  searchResultsArr.push(
                    searchResults.filter((link: ListItemProperties) =>
                      link.title
                        .toLocaleLowerCase()
                        .includes(
                          (
                            event.target as HTMLInputElement
                          ).value.toLocaleLowerCase(),
                        ),
                    ),
                  );

                  // fill search results count
                  (
                    window.document.querySelector(
                      ".search-results-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML =
                    `Found ${searchResultsArr[0].length} search results`;

                  // empty selected links count
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = ``;

                  // remove the search results arr[].length placeholder if the input.value === ""
                  if (
                    (
                      event.target as HTMLInputElement
                    ).value.toLocaleLowerCase() === ""
                  )
                    (
                      window.document.querySelector(
                        ".search-results-count-placeholder",
                      ) as HTMLSpanElement
                    ).innerHTML = ``;
                }}
                value={value}
                placeholder="search"
                aria-placeholder="search"
              />
              <span>
                <BsSearch />
              </span>
              <p></p>
            </div>
            <p></p>
            <p></p>
            <ul id="_links-tabs-navigation-ul">
              <li>
                <Link
                  to={{
                    pathname: "/links",
                    search: "",
                  }}
                >
                  All
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: "/links/opened",
                    search: "",
                  }}
                >
                  Opened
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: "/links/shared",
                    search: "",
                  }}
                >
                  Shared
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: "/links/tagged",
                    search: "",
                  }}
                >
                  Tagged
                </Link>
              </li>
            </ul>
            {/* Show the number of saved links */}
            <span className="links_count">
              {linksList.length} available saved link(s)
            </span>
            <div className="_save-links-collection-button-wrapper">
              <button
                ref={buttonRef}
                type="button"
                title={`save collection`}
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // stop event bubbling

                  if (linksList.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    await window.app_api.exportDataToHTMLFile(
                      linksList?.map((item) => item) ?? [],
                      `html`,
                      "Saved links",
                    );
                  } else {
                    window.alert(
                      "System cannot export if links list is empty!",
                    );
                  }
                }}
              >
                Export collection
              </button>
              <span
                onClick={(event) => {
                  event.stopPropagation(); // prevent event bubbling
                  if (linksList.length > 0) {
                    // show links list saving options
                    setShowSavingOptions(true);
                  } else {
                    window.alert(
                      "System cannot export if links list is empty!",
                    );
                  }
                }}
              >
                <HiArrowDown />
              </span>
              {showSavingOptions && (
                <ExportCollectionOptionsUtilComponent
                  collection={linksList}
                  category={"Saved links"}
                />
              )}
            </div>
            <span className="selected-links-count-placeholder"></span>
            <span className="search-results-count-placeholder"></span>
            {/*  */}
            <ul id="_links-list">
              {/* make sure to add event to be triggered and listen by main process to handle opening of external links */}
              {searchResults.length > 0 ? (
                searchResults.map((link: ListItemProperties) => (
                  <li key={uuidV4()} id={link.id} title={`${link.title}`}>
                    <img
                      src={getFaviconUrl(link.link)}
                      alt={`${link.title} favicon`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/favicon/OIP.webp";
                      }}
                    />
                    <aside>
                      <span>{`${link.title}`}</span>
                      {/* add event to open external link if clicked */}
                      <a href="" target="_blank" title={`${link.title}`}>
                        {link.link}
                      </a>
                      <div>
                        {/* Copy link button */}
                        <button
                          ref={buttonRef}
                          type="button"
                          title="copy link to clipboard"
                          onClick={(event) => {
                            event.stopPropagation(); // prevent event bubbling
                            CopyTextToClipboard(link.link); // copy link to windows clipboard
                            window.alert(
                              `Copied Link: ${
                                link.link.length < 65
                                  ? link.link
                                  : `${link.link.slice(0, 40)}...`
                              }`,
                            );
                          }}
                        >
                          <BiCopy />
                        </button>
                        {/* open link button */}
                        <button
                          ref={buttonRef}
                          type="button"
                          title="open link in default browser"
                          onClick={(event) => {
                            event.preventDefault();
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            window.app_api.openExternalLink(String(link?.link)); // O(1) -- Constant time
                          }}
                        >
                          <MdOutlineOpenInNew />
                        </button>
                        <Link
                          to={{
                            pathname: `/read`,
                            search: `id=${link.id}`,
                          }}
                        >
                          <button
                            ref={buttonRef}
                            type="button"
                            title="open link read mode"
                          >
                            <IoReaderOutline />
                          </button>
                        </Link>
                      </div>
                      <input
                        type="checkbox"
                        name="select"
                        id="select-link-checkbox"
                        className="select-link-checkbox"
                        title="select link"
                        onClick={(event) => {
                          // show actions component
                          setShowSelectedLinksActions(true);
                          // if the input is checked, let the arr[].length increase by 1
                          if ((event.target as HTMLInputElement).checked) {
                            // console.log(link.title);
                            selectedLinks.length++; // auto increment number for each link selected
                            // add the link to the selected links arr
                            selectedLinksArr.push({
                              id: link.id,
                              title: link.title,
                              link: link.link,
                              user_id: "",
                              _date: link._date,
                              description: link.description,
                            }); // O(n) -- FIFO(First In, First Out)

                            // console.log(selectedLinksArr);
                            // show and update the number of selected links
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder",
                              ) as HTMLSpanElement
                            ).innerHTML =
                              `${selectedLinksArr.length} selected link(s)`;
                            // empty search results count
                            (
                              window.document.querySelector(
                                ".search-results-count-placeholder",
                              ) as HTMLSpanElement
                            ).innerHTML = ``;
                          } else {
                            selectedLinks.length--; // auto decrement number for each link selected
                            // remove the last element of the selected links arr
                            selectedLinksArr.pop(); // O(n) -- LIFO(Last In, First Out)
                            // show and update the number of selected links
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder",
                              ) as HTMLSpanElement
                            ).innerHTML =
                              `${selectedLinksArr.length} selected link(s)`;
                            // empty search results count
                            (
                              window.document.querySelector(
                                ".search-results-count-placeholder",
                              ) as HTMLSpanElement
                            ).innerHTML = ``;
                          }
                        }}
                      />
                    </aside>
                  </li>
                ))
              ) : (
                // Message displayed when no links are found
                // This message is shown when the search results are empty
                <>
                  <div className="no-results-message">
                    {showContentLoader && <ContentLoaderComponent />}
                    <span>
                      <BiLink />
                    </span>
                    <h2>No links found!</h2>
                    <p>
                      Your link list is empty. Please add a link to your list.
                    </p>
                    <span
                      id="refresh"
                      onClick={(event: React.MouseEvent) => {
                        // prevent or stop event bubbling
                        event.stopPropagation();
                        window.location.reload();
                      }}
                    >
                      <TbReload /> refresh
                    </span>
                  </div>
                  <br />
                </>
              )}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationTaggedLinksDashboardWindow;
