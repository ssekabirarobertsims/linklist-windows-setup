/**
 * @description create user information after maybe login
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
import { format } from "date-fns";

const CreateUserInformation = async (
  process: {
    handle: (
      arg0: string,
      arg1: (_: any, user: user) => Promise<string>
    ) => void;
  },
  application: any
): Promise<string> => {
  // main dir for user information
  const userInformationDirPath = path.join(
    application.getPath("appData"),
    "Linklist",
    "User"
  );

  // main file for user information
  const userInformationFilePath = path.join(
    application.getPath("appData"),
    "Linklist",
    "User",
    "user_information.json"
  );

  //
  const userInformation: user = {} as user;

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

      //   update the user information
      userInformation.username = user.username;
      userInformation.name = user.name;
      userInformation.email = user.email;
      userInformation.profile_picture_path = user.profile_picture_path;
      userInformation.token = user.token;
      userInformation.id = user.id;
      userInformation.loggedIn = user.loggedIn ?? true;
      userInformation.login_date = `${format(new Date(), "EEE, MMMM d, yyyy")}`;
      (userInformation.bio =
        "Software Engineer | Building productivity tools and dashboards."),
        (userInformation.joined = `${format(new Date(), "EEE, MMMM d, yyyy")}`);

      // write new data to the user information *.json file
      fs.writeFileSync(
        userInformationFilePath,
        JSON.stringify(userInformation, null, 2)
      );

      return "User information created successfully!";
    }
  );

  return "User information created successfully!";
};

export default CreateUserInformation;
