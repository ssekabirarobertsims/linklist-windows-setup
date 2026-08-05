import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.User.Profile.Dashboard.Window.Stylesheet.css";
import ApplicationAsideNavigationDashboardBarAtomicComponent from "../components/atoms/Application.Dashboard.Aside.Navigation.Bar.Atomic.Component";
import ApplicationDashboardNavigationBarAtomicComponent from "../components/atoms/Application.Dashboard.Navigation.Bar.Atomic.Component";
// import { CiEdit } from "react-icons/ci";
import { GiHelp } from "react-icons/gi";
import { MdFeedback, MdPrivacyTip } from "react-icons/md";
import { Link } from "react-router-dom";
// import { TiTick } from "react-icons/ti";

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

const ApplicationUserProfileDashboardWindow: React.FC = () => {
  const [user, setUser] = useState<user>({} as user);
  const getUserInformation = async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userInformation = await window.app_api.readUserInformation();
    setUser(userInformation);
    return userInformation;
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  // state to handle editing
  // const [editing, setEditing] = useState<boolean>(false);
  // state to set the user bio
  const [userBio, setUserBio] = useState<string>(user.bio || "");
  // state to set the user profile picture file path
  const [profilePictureFilePath, setProfilePictureFilePath] =
    useState<string>();
  // state set profile picture information
  const [profilePictureInformation, setProfilePictureInformation] = useState<{
    size: number;
  }>(
    {} as {
      size: number;
    },
  );

  // set user bio on user information change
  useEffect(() => {
    setUserBio(user.bio || "");
  }, [user.bio]);
  // Set the document title on mount
  useEffect(() => {
    document.title = "Dashboard - Profile | LinkList";
  }, []);

  return (
    <>
      {/* Main dashboard page elements */}
      <main
        className={String(
          "application-user-profile-dashboard-window",
        ).toLocaleLowerCase()}
      >
        <ApplicationAsideNavigationDashboardBarAtomicComponent />

        <section
          className={String(
            "_application-user-profile-dashboard-window-wrapper",
          ).toLocaleLowerCase()}
        >
          {/* Navigation bar and sidebar for user profile */}
          <ApplicationDashboardNavigationBarAtomicComponent
            window={"Profile"}
          />
          <br />
          <div className="_application-user-profile-dashboard-window-components-wrapper">
            {/*  */}
            <p></p>
            <h2>LINKLIST USER'S PROFILE</h2>
            {/* Header */}
            <header className="profile-header">
              <aside>
                <img
                  src={user.profile_picture_path}
                  className="profile-avatar"
                  alt="avatar"
                />
              </aside>
              <div>
                <p>{user.username?.toLocaleUpperCase()}'S PROFILE.</p>
                <p>@{user.name ? user.name : "name"}.</p>
                <p>Random Id: {user.id?.slice(0, 20)}...</p>
                <p>
                  {profilePictureInformation?.size ? (
                    <span>
                      Current File Size{" "}
                      {Math.floor(profilePictureInformation?.size / 1024)}kbs
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                {/* {editing && <label htmlFor="file">Upload Profile Photo</label>} */}
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="file-input"
                  onChange={async (event) => {
                    const files = (event.target as HTMLInputElement)?.files;
                    const file = files?.[0];

                    if (file) {
                      const reader = new FileReader();

                      reader.addEventListener(
                        "load",
                        async (): Promise<void> => {
                          return (
                            window.document.querySelector(
                              ".profile-avatar",
                            ) as HTMLImageElement
                          ).setAttribute("src", reader.result as string);
                        },
                      );

                      // set the data as url
                      reader.readAsDataURL(file);
                      // set profile picture file path
                      setProfilePictureFilePath(`${await file.name}`);
                      // set profile picture information
                      setProfilePictureInformation(file);
                    }
                  }}
                />
                {/* <button
                  className="edit-btn"
                  onClick={() => {
                    // change state for editing the profile
                    setEditing(!editing);
                    // set andd show profile edit button
                  }}
                >
                  {editing ? (
                    <>
                      <span>
                        {""}
                        <TiTick />
                      </span>
                      Save
                    </>
                  ) : (
                    <>
                      <span>
                        {" "}
                        <CiEdit />
                      </span>
                      Edit
                    </>
                  )}
                </button> */}
              </div>
            </header>
            {/*  */}

            <br />
            {/* User Info Section */}

            {/* Details */}
            {/* <div className="profile-details">
              <h3>Personal Info</h3>
              <aside>
                <div className="detail-row">
                  <span className="detail-label">Unique Id:</span>
                  <p className="detail-value">{user.id?.slice(0, 20)}...</p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <p className="detail-value">{user.email}</p>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joined:</span>
                  <p className="detail-value">{user.joined}</p>
                </div>
              </aside>
            </div> */}
            {/*  */}

            {/*  */}
            <div className="profile-section">
              <h3>Add an email</h3>
              <p>
                Sing up so as to add an email account to your profile for more
                security purposes.
              </p>
              <Link
                to={{
                  pathname: "/auth/redirect/signup",
                }}
              >
                <button title="add email">Add Your Email</button>
              </Link>
              {/* {editing ? (
                <textarea
                  className="user-bio-input-field"
                  value={user.bio}
                  onChange={(e) => {
                    // set value for the bio
                    setUser({ ...user, bio: e.target.value });
                    // set the user bio
                    setUserBio(e.target.value);
                    console.log(userBio);
                  }}
                />
              ) : ( */}
              {/* <p className="profile-bio">{userBio}</p> */}
              {/* )} */}
            </div>

            <br />
            <ul>
              <br />
              <li>
                <a
                  href=""
                  title="give feedback"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://linklists.netlify.app/users/feedback",
                    );
                  }}
                >
                  <MdFeedback />
                  <p>Give Feedback</p>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  href=""
                  title="get help"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <GiHelp />
                  <p>Get Help</p>
                </a>
              </li>
              {/*  */}
              <li>
                <a
                  href=""
                  title="privacy policy"
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    window.app_api.openExternalLink(
                      "https://linklists.netlify.app/policy",
                    );
                  }}
                >
                  <MdPrivacyTip />
                  <p>Privacy Policy</p>
                </a>
              </li>
            </ul>
            {/*  */}
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationUserProfileDashboardWindow;
