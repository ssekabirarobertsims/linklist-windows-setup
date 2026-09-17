import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Archives.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
import "../stylesheets/Configurations/Application.Styles.Configurations.css";
import { parse } from "date-fns";
// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  _date: string;
  description: string;
};

import { BiArchive, BiCopy, BiTrash } from "react-icons/bi";

import { v4 as uuidV4 } from "uuid";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import { HiArrowDown } from "react-icons/hi";
import ExportCollectionOptionsUtilComponent from "../components/utils/Export.Collection.Options.Util.Component";
import {
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdRestore,
} from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { TbFileExport, TbReload } from "react-icons/tb";
import { ContentLoaderComponent } from "../components/utils/Content.Loader.Util.Components";
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

const ApplicationArchivesDashboardWindow: React.FunctionComponent = () => {
  const CopyTextToClipboard = (text: string | number | boolean | object) => {
    // copy text passed in as arg to the windows clipboard
    window.navigator.clipboard.writeText(text as string); // as a string
  };
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linkArchivesList, setLinkArchivesList] = useState<
    ListItemProperties[]
  >([] as ListItemProperties[]);

  // fetch all existing links archives on component mount and display them
  useEffect(() => {
    const fetchLinkArchives = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllLinkArchives()) as ListItemProperties[];
      // sort links by date in reverse chronological order (most recent first)
      const sortedLinks = sortLinksByDateDescending(links);
      // set the links list state
      setLinkArchivesList(sortedLinks);
      // return an arr[] for the links
      return sortedLinks;
    };

    fetchLinkArchives();
  }, []);

  //   state to handle links list saving options
  const [showSavingOptions, setShowSavingOptions] = useState<boolean>(
    false as boolean,
  );
  //   state to handle selected links list actions options
  const [
    showSelectedArchivedLinksActions,
    setShowSelectedArchivedLinksActions,
  ] = useState<boolean>(false as boolean);

  // This state holds the title of the link being shared
  //   const [sharedLinkTitle, setSharedLinkTitle] = useState<string | null>(null);
  // This state holds the URL of the link being shared
  // const [sharedLink, setSharedLink] = useState<string | null>(null);

  // state to handle selected links
  const [selectedArchivedLinks, setSelectedArchivedLinks] = useState<
    ListItemProperties[]
  >([] as ListItemProperties[]);

  useEffect(() => {
    setSelectedArchivedLinks(selectedArchivedLinks);
  }, [selectedArchivedLinks]);

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

  // set state for showing the content loader
  const [showContentLoader, setShowContentLoader] = useState<boolean>(true);

  // Effect to hide the content loader after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContentLoader(false);
    }, 10000); // Hide loader after 1 second

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Trash | LinkList";
  }, []);

  // Helper to compute favicon URL for a given link, falling back to local image
  const getFaviconUrl = (url?: string): string => {
    try {
      if (!url) return "/favicon/OIP.webp";
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      return "/favicon/OIP.webp";
    }
  };

  // Render the dashboard home page layout and content
  return (
    <>
      {showSelectedArchivedLinksActions && (
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
                  // Check all visible archived links
                  setSelectedArchivedLinks(
                    linkArchivesList as ListItemProperties[],
                  );
                  // Update UI
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = `${linkArchivesList.length} selected link(s)`;

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
                CopyTextToClipboard(JSON.stringify(selectedArchivedLinks)); // copy all the links selected as plain text to clipboard!
              }}
            >
              <BiCopy />
              <span>Copy</span>
            </li>{" "}
            {/* generate txt file and include list for the lists */}
            <li
              onClick={async (event): Promise<void> => {
                event.stopPropagation(); // stop event bubbling
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await window.app_api.exportDataToTXTFile(
                  linkArchivesList?.map((item) => item) ?? [],
                  `txt`,
                );
              }}
            >
              <TbFileExport />
              <span>Export</span>
            </li>
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
                  setSelectedArchivedLinks([] as ListItemProperties[]);
                  // Update UI
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder",
                    ) as HTMLSpanElement
                  ).innerHTML = `0 selected link(s)`;

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
            <li
              onClick={async (event): Promise<void> => {
                event.stopPropagation(); // prevent event bubbling
                // create new link via context bridge api
                const response: string =
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  await window.app_api.restoreArchivedLinks(linkArchivesList);
                //
                console.log("Restore links response:", response);
                // hide loader if response includes success
                if (response.toLocaleLowerCase().includes("success"))
                  window.setTimeout(() => {
                    // redirect to links page after a short delay
                    window.location.href = "/links";
                  }, 1200);

                // disable button to prevent multiple requests
                (event.target as HTMLButtonElement).disabled = true;
              }}
            >
              <MdRestore />
              <span>Restore</span>
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
                setShowSelectedArchivedLinksActions(false);

                // uncheck all inputs
                inputs.forEach(
                  (input: HTMLInputElement) =>
                    (input.checked = false as boolean),
                );

                // set the selected links count to 0
                setSelectedArchivedLinks([] as ListItemProperties[]);
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
          "application-archives-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationMiniAsideNavigationDashboardBarAtomicComponent />
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-archives-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent window={"Trash"} />
          <br />
          <p></p>
          <p></p>
          <p></p>

          <div className="_application-archives-dashboard-window-components-wrapper">
            <h1>Trash</h1>
            <p></p>
            <p>
              <strong>NOTE:</strong> Some trashed links are forever deleted
              after some period of time!
            </p>
            <p></p>
            <ul id="_links-actions-navigation-ul">
              <li
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // prevent event bubbling
                  if (linkArchivesList.length > 0) {
                    // create new link via context bridge api
                    const response: string =
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.restoreArchivedLinks(
                        linkArchivesList,
                      );
                    //
                    console.log("Restore links response:", response);
                    // hide loader if response includes success
                    if (response.toLocaleLowerCase().includes("success"))
                      window.setTimeout(() => {
                        // redirect to links page after a short delay
                        window.location.href = "/links";
                      }, 1200);

                    // disable button to prevent multiple requests
                    (event.target as HTMLButtonElement).disabled = true;
                  } else {
                    window.alert("System cannot restore an empty list!");
                  }
                }}
              >
                <span>
                  <MdRestore />
                </span>{" "}
                Restore All
              </li>
              <li
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // prevent event bubbling
                  if (linkArchivesList.length > 0) {
                    // delete archived link from the saved links
                    const response: string =
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      await window.app_api.deleteExistingArchivedLinks(); // arr = []
                    // reload app
                    window.location.href = "/archives";
                    console.log("Delete archived links response:", response);
                  } else {
                    window.alert("System cannot delete an empty list!");
                  }
                }}
              >
                <span>
                  <BiTrash />
                </span>{" "}
                Empty Trash
              </li>
              <li
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // prevent event bubbling
                  window.navigator.clipboard.writeText(
                    String(JSON.stringify(linkArchivesList)),
                  );
                }}
              >
                <span>
                  <BiCopy />
                </span>{" "}
                Copy Trash
              </li>
            </ul>
            <p></p>

            {/* Show the number of saved links */}
            <span className="links_count">
              {linkArchivesList.length} available trashed link(s)
            </span>
            <p></p>
            <div className="_save-links-collection-button-wrapper">
              <button
                type="button"
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // stop event bubbling
                  if (linkArchivesList.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    await window.app_api.exportDataToHTMLFile(
                      linkArchivesList?.map((item) => item) ?? [],
                      `html`,
                      "Archives",
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
                  if (linkArchivesList.length > 0) {
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
                  collection={linkArchivesList}
                  category={"Archives"}
                />
              )}
            </div>
            <span className="selected-links-count-placeholder"></span>
            {/*  */}
            <ul id="_links-list">
              {linkArchivesList.length > 0 ? (
                linkArchivesList.map((link: ListItemProperties) => (
                  <li key={uuidV4()} id={link.id}>
                    <img
                      src={getFaviconUrl(link.link)}
                      alt={`${link.title} favicon`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/favicon/OIP.webp";
                      }}
                    />
                    <aside>
                      <span>{link.title}</span>
                      {/* add event to open external link if clicked */}

                      <p>{`${link.link}`}</p>
                      <div>
                        {/* Delete archived link button */}
                        <button
                          type="button"
                          onClick={async (event): Promise<void> => {
                            event.stopPropagation(); // prevent event bubbling
                            // delete archived link from the saved links
                            const response: string =
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              await window.app_api.deleteExistingArchivedLink(
                                link?.id,
                              ); // filter out links.id !== LinkID: O(1) // Constant time
                            // reload app
                            window.location.href = "/archives";
                            console.log(
                              "Delete archived link response:",
                              response,
                            );
                          }}
                        >
                          <BiTrash />
                        </button>
                        {/* Copy link button */}
                        <button
                          type="button"
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
                        {/* restore link button */}
                        <button
                          type="button"
                          onClick={async (event): Promise<void> => {
                            event.stopPropagation(); // prevent event bubbling
                            // prepare the link data
                            const LinkData = {
                              title: link.title,
                              link: link.link,
                              user_id: "", // replace with actual user ID if available
                              _date: link._date,
                              description: link.description,
                              id: link.id,
                            };

                            // create new link via context bridge api
                            const response: string =
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              await window.app_api.restoreArchivedLink(
                                LinkData,
                              );
                            console.log("Restore link response:", response);
                            // hide loader if response includes success
                            if (
                              response.toLocaleLowerCase().includes("success")
                            )
                              window.setTimeout(() => {
                                // redirect to links page after a short delay
                                window.location.href = "/links";
                              }, 1200);

                            // disable button to prevent multiple requests
                            (event.target as HTMLButtonElement).disabled = true;
                          }}
                        >
                          <MdRestore />
                        </button>
                      </div>
                      <input
                        type="checkbox"
                        name="select"
                        id="select-link-1"
                        title="select link"
                        checked={selectedArchivedLinks.some(
                          (item) => item.id === link.id,
                        )}
                        onChange={(event) => {
                          // show actions component
                          setShowSelectedArchivedLinksActions(true);
                          // if the input is checked, add link to selected links
                          if ((event.target as HTMLInputElement).checked) {
                            // add the link to the selected links state
                            setSelectedArchivedLinks([
                              ...selectedArchivedLinks,
                              {
                                id: link.id,
                                title: link.title,
                                link: link.link,
                                user_id: "",
                                _date: link._date,
                                description: link.description,
                              },
                            ]);
                            // Update UI
                            const newCount = selectedArchivedLinks.length + 1;
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder",
                              ) as HTMLSpanElement
                            ).textContent = `${newCount} link(s) selected`;
                          } else {
                            // remove the specific link from selected links
                            setSelectedArchivedLinks(
                              selectedArchivedLinks.filter(
                                (item) => item.id !== link.id,
                              ),
                            );
                            // Update UI
                            const newCount = selectedArchivedLinks.length - 1;
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder",
                              ) as HTMLSpanElement
                            ).textContent =
                              newCount > 0
                                ? `${newCount} link(s) selected`
                                : ``;
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
                      <BiArchive />
                    </span>
                    <h2>No link archives found!</h2>
                    <p>
                      Your archived links list is empty. Deleted links will
                      appear here.
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

export default ApplicationArchivesDashboardWindow;
