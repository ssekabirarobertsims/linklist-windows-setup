/**
 * @description read user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
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

import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { format } from "date-fns/format";
import { v4 } from "uuid";

const ReadUserInformation = async (
  process: {
    handle: (arg0: string, arg1: () => Promise<object>) => void;
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
  let userInformation: user = {} as user;

  process.handle("read-user-information", async (): Promise<object> => {
    try {
      if (userInformationFilePath) {
        // read the existing user default or updated information in the *.json file
        userInformation = JSON.parse(
          fs.readFileSync(userInformationFilePath, {
            encoding: "utf8",
          })
        );
      } else null;
    } catch (error) {
      console.log("Error while reading user information", error);
    }

    return userInformationFilePath ? userInformation : {
      error: "user is not logged in"
    };
  });

  return "User information created successfully!";
};

export default ReadUserInformation;
