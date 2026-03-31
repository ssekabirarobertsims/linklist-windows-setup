import { type FunctionComponent } from "react";
import * as motion from "motion/react-client";
import { PiFileHtml, PiFileTxtLight } from "react-icons/pi";
import { BsFiletypeJson } from "react-icons/bs";

// type guard for the collection prop
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  date_created?: string;
  status?: string;
};

// define props for the component
interface ExportCollectionOptionsUtilComponentProps {
  collection: ListItemProperties[];
  category: string;
}

const ExportCollectionOptionsUtilComponent: FunctionComponent<
  ExportCollectionOptionsUtilComponentProps
> = ({ collection, category }) => {
  // hide the component if opt clicked

  return (
    <>
      <motion.article
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.1,
          scale: { type: "spring", visualDuration: 0.1, bounce: 0.0 },
        }}
        className="_save-links-collection-options-util-component-wrapper"
      >
        <ul>
          {/* each li triggers an event sent through ipc and handled by man process to allow saving of the collection as a file */}
          <li
            className="save-collection-opt"
            onClick={async (event): Promise<void> => {
              event.stopPropagation(); // stop event bubbling
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              await window.app_api.exportDataToTXTFile(
                collection?.map((item) => item) ?? [],
                `txt`,
                category
              );
              //
              window.alert("Successfully exported links to *.txt file!");
            }}
          >
            <span>
              <p>
                <PiFileTxtLight />
              </p>
              Export as *.txt file
            </span>
          </li>{" "}
          <li
            className="save-collection-opt"
            onClick={async (event): Promise<void> => {
              event.stopPropagation(); // stop event bubbling
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              await window.app_api.exportDataToJSONFile(
                collection?.map((item) => item) ?? [],
                `json`,
                category
              );
              //
              window.alert("Successfully exported links to *.json file!");
            }}
          >
            <span>
              <p>
                <BsFiletypeJson />
              </p>
              Export as *.json file
            </span>
          </li>{" "}
          {/* generate json file for the collection */}
          <li
            className="save-collection-opt"
            onClick={async (event): Promise<void> => {
              event.stopPropagation(); // stop event bubbling
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              await window.app_api.exportDataToHTMLFile(
                collection?.map((item) => item) ?? [],
                `html`,
                category
              );
              //
              window.alert("Successfully exported links to *.html file!");
            }}
          >
            <span>
              <p>
                <PiFileHtml />
              </p>
              Export as *.html file
            </span>
          </li>{" "}
          {/* generate doc and include list for the lists */}
        </ul>
      </motion.article>
    </>
  );
};

export default ExportCollectionOptionsUtilComponent;
