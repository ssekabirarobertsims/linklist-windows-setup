import React, { useEffect, useState } from "react";
import "../stylesheets/Windows/Application.Signup.Form.Window.Stylesheet.css";

const ApplicationSignupFormWindow: React.FunctionComponent = () => {
  // Set the document title on mount
  useEffect(() => {
    document.title = "Auth - Signup | LinkList";
  }, []);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let profile_picture_path = filePath;
    if (filePath) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile_picture_path = await (window as any).app_api.copyProfileImage(
          filePath,
        );
      } catch (copyError) {
        console.error("Error copying profile image:", copyError);
        setStatus("Failed to copy profile image. Check console for details.");
        return;
      }
    }

    const user = {
      username,
      name: username,
      email,
      profile_picture_path,
      token: "",
      id: `${Date.now()}`,
      loggedIn: true,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (window as any).app_api.createUserInformation(user);
      console.log("createUserInformation result:", result);
      setStatus("Signup complete. User data saved locally.");
    } catch (err) {
      console.error("Error creating user information:", err);
      setStatus("Failed to save user information. Check console for details.");
    }
  };

  // Render the window layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main className="application-signup-form-window">
        <section className="_application-signup-form-window-wrapper">
          {/*  */}
          <form method="post" onSubmit={handleRegister}>
            <h1>Welcome To Linklist</h1>
            {/* add event to be triggered to open an external link */}
            <p>Fill the inputs in this form to continue with this software.</p>
            <p></p>
            <input
              type="text"
              name="username"
              id="username"
              title="input your username"
              placeholder="username"
              aria-placeholder="username"
              value={username}
              onChange={(e) =>
                setUsername((e.target as HTMLInputElement).value)
              }
            />
            <input
              type="email"
              name="email"
              id="email"
              title="input your email"
              placeholder="example@gmail.com"
              aria-placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <b>
              <p>Choose a profile picture (*)</p>
            </b>
            <input
              type="file"
              name="file"
              id="file"
              title="input your file"
              placeholder="file"
              aria-placeholder="file"
              onChange={(event) => {
                const files = (event.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  // In Electron renderer, File object may expose a `path` property
                  const path =
                    (files[0] as unknown as { path: string }).path || "";
                  setFilePath(path);
                }
              }}
            />
            <p></p>
            {status && <p className="signup-status">{status}</p>}
            <p></p>
            {/* add event to be triggered to open an external link */}
            <button type="submit" title="click to signup">
              Register
            </button>
          </form>

          <br />
          <br />
          <div>
            <span>
              {" "}
              Linklist © 2019. Links Management System. All Rights Reserved
            </span>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationSignupFormWindow;
