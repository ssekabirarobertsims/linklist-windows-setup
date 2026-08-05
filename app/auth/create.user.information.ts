/**
 * @description create user information after maybe login
 * @access public
 * @returns {Promise<string>}
 * @argument {IpcMain, app}
 */

interface user {
  registered_username: string;
  email: string;
  username: string;
  name: string;
  profile_picture_path: string;
  token: string;
  id: string;
  loggedIn: boolean;
  signed_in: boolean;
  login_date: string;
  bio: string;
  joined: string;
}

import path from "node:path";
import fs from "node:fs";
import { format } from "date-fns";
import os from "os";
import { v4 as uuidV4 } from "uuid";

const CreateUserInformation = async (
  process: {
    handle: (
      arg0: string,
      arg1: (_: any, user: user) => Promise<string>,
    ) => void;
  },
  application: any,
): Promise<string> => {
  // main dir for user information
  const userInformationDirPath = path.join(
    application.getPath("appData"),
    "Linklist",
    "User",
  );

  // main file for user information
  const userInformationFilePath = path.join(
    application.getPath("appData"),
    "Linklist",
    "User",
    "user_information.json",
  );

  //
  const userInformation: user = {
    registered_username: "",
    email: "",
    username: os.userInfo().username,
    name: os.hostname(),
    id: `${uuidV4()}`,
    loggedIn: true,
    signed_in: true,
    login_date: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
    bio: `Hi, i am ${os.hostname()}, i am a user of Linklist, i am using this software to manage my links and bookmarks in a more efficient way. I enjoy saving links in order to cut on the cost of saving videos and webpages.
                      `,
    joined: `${format(new Date(), "EEE, MMMM d, yyyy")}`,
  } as user;

  process.handle(
    "create-user-information",
    async (_: any, user: user): Promise<string> => {
      try {
        if (userInformationFilePath) {
          // read the existing user default or updated information in the *.json file
          fs.readFileSync(userInformationFilePath, {
            encoding: "utf8",
          });
        } else null;
      } catch (error) {
        console.log("Error while reading user information", error);
      }

      // write new data to the user information *.json file
      fs.writeFileSync(
        userInformationFilePath,
        JSON.stringify(userInformation, null, 2),
      );

      return "User information created successfully!";
    },
  );

  return "User information created successfully!";
};

export default CreateUserInformation;
