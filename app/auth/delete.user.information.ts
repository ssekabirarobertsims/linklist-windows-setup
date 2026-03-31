/**
 * @description delete user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
 */

import path from "node:path";
import fs from "node:fs";

const DeleteUserInformation = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<string>) => void;
  },
  application: any
): Promise<string> => {
  // main file for user information
  const userInformationFilePath = path.join(
    application.getPath("appData"),
    "Linklist",
    "User",
    "user_information.json"
  );

  //
  process.handle("delete-user-information", async (): Promise<string> => {
    // delete user information *.json file
    fs.unlinkSync(userInformationFilePath);

    return "User information deleted successfully!";
  });

  return "User information deleted successfully!";
};

export default DeleteUserInformation;
