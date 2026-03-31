import React, { useEffect, useState } from "react";
// import { DashboardFooterComponent } from "../components/Footer.Components";
import "../stylesheets/Windows/Application.Links.Read.Dashboard.Window.Stylesheet.css";
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
  user_id: string;
  _date: string;
  description: string;
};

// import { format } from "date-fns";
import { BiCopy, BiPencil, BiTrash } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
// import { PiNoteFill } from "react-icons/pi";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
import LinksSharingFormUtilsComponent from "../components/utils/Links.Sharing.Form.Utils.Component";
import CopyTextToClipboard from "../functions/Copy.Text.To.Clipboard.Function";
import { useSearchParams } from "react-router-dom";
import { TbFileExport } from "react-icons/tb";
import { FaLink } from "react-icons/fa";
import { MdDateRange, MdOutlineOpenInNew } from "react-icons/md";

const ApplicationLinksReadDashboardWindow: React.FunctionComponent = () => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[]
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

  // filter out the link to be read
  const _ReadLink: ListItemProperties[] = linksList.filter(
    (link: ListItemProperties) => link.id === searchParams.get("id")
  ) as ListItemProperties[];

  // set state for showing the links share buttons components
  // This state controls the visibility of the links share buttons components
  const [showLinksShareButtonsComponents, setShowLinksShareButtonsComponents] =
    useState<boolean>(false);
  // This state holds the title of the link being shared
  //   const [sharedLinkTitle, setSharedLinkTitle] = useState<string | null>(null);
  // This state holds the URL of the link being shared
  const [sharedLink, setSharedLink] = useState<string | null>(null);
  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Read Link | LinkList";
  }, []);

  // Render the dashboard home page layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-read-links-dashboard-window"
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />
        <section
          className={String(
            "_application-read-links-dashboard-window-wrapper"
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
            {_ReadLink.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2em" }}>
                <p>Link not found</p>
              </div>
            ) : (
              <>
                {/* Share link buttons component */}
                {showLinksShareButtonsComponents && (
                  <div
                    className="links-sharing-form"
                    onClick={(event) => {
                      event.stopPropagation(); // stop event propagation
                      setShowLinksShareButtonsComponents(false);
                      setSharedLink(sharedLink);
                    }}
                  >
                    <LinksSharingFormUtilsComponent
                      url={`${_ReadLink[0].link}`}
                      title={`${_ReadLink[0].title}`}
                    />
                  </div>
                )}
                {/* <Link
                  to={{
                    pathname: "/links",
                  }}
                  id="fallback-page-arrow"
                >
                  <BiLeftArrowAlt />
                </Link> */}
                <h2 id={_ReadLink[0]?.id}>{`${_ReadLink[0]?.title} `}</h2>

                <p></p>
                <img
                  src="/favicon/OIP.webp"
                  alt={`${_ReadLink[0]?.title} favicon`} // O(1) -- Constant time
                />
                <br />
                <span>{_ReadLink[0]?.id}</span>
                <p>
                  <MdDateRange /> Created on {_ReadLink[0]?._date}
                </p>
                <a
                  href=""
                  title={`${_ReadLink[0]?.title}`}
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(String(_ReadLink[0]?.link)); // O(1) -- Constant time
                  }}
                >
                  <FaLink /> {`${_ReadLink[0]?.link}`}
                </a>
                <br />
                <h4>Description</h4>
                <p>{`${
                  _ReadLink[0].description === "" ||
                  _ReadLink[0].description === null ||
                  _ReadLink[0].description === undefined
                    ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere natus, deleniti fugit labore adipisci incidunt autem minus vero cum architecto sunt, sint possimus unde ipsum. Praesentium, sit veritatis? Sapiente, ratione?"
                    : _ReadLink[0].description
                }`}</p>
                <br />

                {/*  */}
                {/* <h4>Link actions</h4> */}
                <ul>
                  <li>
                    <BiPencil />
                    <span>Edit</span>
                  </li>{" "}
                  <li
                    onClick={(event) => {
                      event.stopPropagation(); // prevent event bubbling
                      CopyTextToClipboard(_ReadLink[0]?.link); // copy link to windows clipboard // O(1) -- Constant time
                    }}
                  >
                    <BiCopy />
                    <span>Copy</span>
                  </li>{" "}
                  {/* generate txt file and include list for the lists */}
                  <li
                    onClick={(event) => {
                      event.stopPropagation(); // prevent event bubbling
                      setShowLinksShareButtonsComponents(true); // make form visible
                    }}
                  >
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
                            id: _ReadLink[0].id, // O(1) -- Constant time
                            title: _ReadLink[0].title, // O(1) -- Constant time
                            link: _ReadLink[0].link, // O(1) -- Constant time
                            _date: _ReadLink[0]._date, // O(1) -- Constant time
                          },
                        ],
                        `txt`
                      );
                    }}
                  >
                    <TbFileExport />
                    <span>Export</span>
                  </li>
                  {/* invoke event to the application to open external links */}
                  <li
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // prevent event bubbling
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      window.app_api.openExternalLink(
                        String(_ReadLink[0]?.link) // filter out links.id !== LinkID: O(1) // Constant time
                      );
                    }}
                  >
                    <MdOutlineOpenInNew />
                    <span>Open</span>
                  </li>
                  <li
                    onClick={async (event): Promise<void> => {
                      event.stopPropagation(); // prevent event bubbling
                      // delete link from the saved links
                      const response: string =
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        await window.app_api.deleteExistingLink(
                          _ReadLink[0],
                          _ReadLink[0]?.id
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
