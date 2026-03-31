import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Archives.Dashboard.Window.Stylesheet.css";
import "../stylesheets/Components/Reusable.Components.Stylesheet.css";
// // Ensure that the environment variables are loaded correctly
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
import CopyTextToClipboard from "../functions/Copy.Text.To.Clipboard.Function";
import { MdRadioButtonUnchecked, MdRestore } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { TbFileExport, TbReload } from "react-icons/tb";
import { ContentLoaderComponent } from "../components/utils/Content.Loader.Util.Components";

const ApplicationArchivesDashboardWindow: React.FunctionComponent = () => {
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
      // set the links list state
      setLinkArchivesList(links);
      // return an arr[] for the links
      return links;
    };

    fetchLinkArchives();
  }, []);

  //   state to handle links list saving options
  const [showSavingOptions, setShowSavingOptions] = useState<boolean>(
    false as boolean
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
  // arr to handle the selected links
  const selectedArchivedLinksArr: ListItemProperties[] =
    [] as ListItemProperties[];

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
    document.title = "Dashboard - Archives | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {showSelectedArchivedLinksActions && (
        <article className="selected-links-actions-util-component">
          <ul>
            <li
              onClick={(event) => {
                event.stopPropagation(); // prevent event bubbling
                CopyTextToClipboard(JSON.stringify(selectedArchivedLinksArr)); // copy all the links selected as plain text to clipboard!
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
                  `txt`
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
                      ".select-link-checkbox"
                    ) as unknown as HTMLInputElement[];
                  // remove label and its content
                  (
                    window.document.querySelector(
                      ".selected-links-count-placeholder"
                    ) as HTMLSpanElement
                  ).innerHTML = `${
                    selectedArchivedLinks.length - selectedArchivedLinks.length
                  } selected link(s)`;

                  // uncheck all inputs
                  inputs.forEach((input: HTMLInputElement) => {
                    input.checked = false as boolean;
                  });

                  // set the selected links count to 0
                  setSelectedArchivedLinks([] as ListItemProperties[]);
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
                    ".select-link-checkbox"
                  ) as unknown as HTMLInputElement[];
                // remove label and its content
                (
                  window.document.querySelector(
                    ".selected-links-count-placeholder"
                  ) as HTMLSpanElement
                ).innerHTML = ``;

                // hide the actions options list
                setShowSelectedArchivedLinksActions(false);

                // uncheck all inputs
                inputs.forEach(
                  (input: HTMLInputElement) =>
                    (input.checked = false as boolean)
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
          "application-archives-dashboard-window"
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-archives-dashboard-window-wrapper"
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Archives"}
          />
          <br />
          <p></p>
          <p></p>
          <p></p>

          <div className="_application-archives-dashboard-window-components-wrapper">
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
                        linkArchivesList
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
                Delete Forever
              </li>
            </ul>
            <p>
              <strong>NOTE:</strong> Only 25 archived links are allowed to be
              stored for some period of time!
            </p>

            {/* Show the number of saved links */}
            <span className="links_count">
              {linkArchivesList.length} available archived link(s)
            </span>
            <p></p>
            <div className="_save-links-collection-button-wrapper">
              <button
                type="button"
                title={`save collection`}
                onClick={async (event): Promise<void> => {
                  event.stopPropagation(); // stop event bubbling
                  if (linkArchivesList.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    await window.app_api.exportDataToHTMLFile(
                      linkArchivesList?.map((item) => item) ?? [],
                      `html`,
                      "Archives"
                    );
                  } else {
                    window.alert(
                      "System cannot export if links list is empty!"
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
                      "System cannot export if links list is empty!"
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
                  <li key={uuidV4()} id={link.id} title={`${link.title}`}>
                    <img
                      src="/favicon/OIP.webp"
                      alt={`${link.title} favicon`}
                    />
                    <aside>
                      <span>{link.title}</span>
                      {/* add event to open external link if clicked */}

                      <p>{`${link.link}`}</p>
                      <div>
                        {/* Delete archived link button */}
                        <button
                          type="button"
                          title="t"
                          onClick={async (event): Promise<void> => {
                            event.stopPropagation(); // prevent event bubbling
                            // delete archived link from the saved links
                            const response: string =
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              await window.app_api.deleteExistingArchivedLink(
                                link?.id
                              ); // filter out links.id !== LinkID: O(1) // Constant time
                            // reload app
                            window.location.href = "/archives";
                            console.log(
                              "Delete archived link response:",
                              response
                            );
                          }}
                        >
                          <BiTrash />
                        </button>
                        {/* Copy link button */}
                        <button
                          type="button"
                          title="t"
                          onClick={(event) => {
                            event.stopPropagation(); // prevent event bubbling
                            CopyTextToClipboard(link.link); // copy link to windows clipboard
                            window.alert(
                              `Copied Link: ${
                                link.link.length < 65
                                  ? link.link
                                  : `${link.link.slice(0, 40)}...`
                              }`
                            );
                          }}
                        >
                          <BiCopy />
                        </button>
                        {/* restore link button */}
                        <button
                          type="button"
                          title="t"
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
                                LinkData
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
                        onClick={(event) => {
                          // show actions component
                          setShowSelectedArchivedLinksActions(true);
                          // if the input is checked, let the arr[].length increase by 1
                          if ((event.target as HTMLInputElement).checked) {
                            selectedArchivedLinks.length++; // auto increment number for each link selected
                            // console.log(link.title);
                            selectedArchivedLinks.length++; // auto increment number for each link selected
                            // add the link to the selected links arr
                            selectedArchivedLinksArr.push({
                              id: link.id,
                              title: link.title,
                              link: link.link,
                              user_id: "",
                              _date: link._date,
                              description: link.description,
                            }); // O(n) -- FIFO(First In, First Out)

                            // console.log(selectedArchivedLinksArr);
                            // show and update the number of selected links
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder"
                              ) as HTMLSpanElement
                            ).textContent = `${selectedArchivedLinksArr.length} link(s) selected`;
                          } else {
                            selectedArchivedLinks.length--; // auto decrement number for each link selected
                            // remove the last element of the selected links arr
                            selectedArchivedLinksArr.pop(); // O(n) -- LIFO(Last In, First Out)
                            // show and update the number of selected links
                            (
                              window.document.querySelector(
                                ".selected-links-count-placeholder"
                              ) as HTMLSpanElement
                            ).textContent = `${selectedArchivedLinksArr.length} link(s) selected`;
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
