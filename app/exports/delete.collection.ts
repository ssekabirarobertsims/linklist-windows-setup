import path from "node:path";
import fs from "node:fs";
import { dialog, Notification } from "electron";

/**
 * @description delete an existing link from json file
 * @access public
 * @returns {Promise<string>}
 */

const DeleteExistingCollection = async (
  process: {
    handle: (
      arg0: string,
      arg1: (
        event: any,
        collectionId: string,
        collectionPath: string
      ) => Promise<string>
    ) => void;
  },
  application: any,
  _shell: any
): Promise<string> => {
  //
  const collectionsFilePath = path.join(
    application.getPath("userData"),
    "Collections",
    "collections.json"
  );

  //
  process.handle(
    "delete-existing-collection",
    async (
      event,
      collectionId: string,
      collectionPath: string
    ): Promise<string> => {
      // read existing collections
      let updatedCollections = [];

      // read file and return arr for the collections
      try {
        if (collectionsFilePath) {
          // parse collections arr into from stringified obj to an arr[] and filter out collections !== id
          updatedCollections = JSON.parse(
            fs.readFileSync(collectionsFilePath, "utf8")
          ).filter(
            (collection: { id: string }) => collection.id !== collectionId
          );
        }
      } catch (error) {
        console.error("Failed to parse collections file:", error);
        updatedCollections = [];
      }

      // const result = dialog.showMessageBoxSync({
      //   type: "none",
      //   title: "Delete Collection",
      //   message: "Are you sure you want to delete collection?",
      //   buttons: ["Continue", "Cancel"],
      //   defaultId: 0,
      //   detail: "Action can not be undone!",
      // });

      // if (result === 0) {
      // rewrite file to update the collections
      fs.writeFileSync(
        collectionsFilePath,
        JSON.stringify(updatedCollections, null, 2)
      );
      // delete the actual collection file from disk
      if (fs.existsSync(collectionPath)) fs.unlinkSync(collectionPath);

      // make windows sound for alert
      _shell.beep();

      // send notification of successful deletion
      new Notification({
        title: "Export Deleted",
        body: `Deleted export ${collectionPath}`,
        icon: "", // replace with native icon
      }).show();

      return "Collection has been deleted!";
      // } else {
      //   console.log("did not delete coll");
      //   return "Collection has not been deleted!";
      // }
    }
  );
  return "";
};

export default DeleteExistingCollection;
