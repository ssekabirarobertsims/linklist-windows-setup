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

      // update data
      userInformation = {
        username: os.userInfo()?.username,
        name: "",
        email: "sampleuser@example.com",
        profile_picture_path:
          "E:_ProjectsDesktopAppsLinklist.desktop-appdesktoppublicavatarsavatar-1.webp",
        token: "Bearer token",
        id: v4(),
        loggedIn: true,
        login_date: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
        bio: "This is my bio",
        joined: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
      };

      // write back to file
      fs.writeFileSync(
        userInformationFilePath,
        JSON.stringify(userInformation, null, 2)
      );
    } catch (error) {
      console.log("Error while reading user information", error);
    }

    return userInformation;
  });

  return "User information created successfully!";
};

export default ReadUserInformation;
