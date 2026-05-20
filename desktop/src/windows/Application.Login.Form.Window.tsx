import React, { useEffect } from "react";
import "../stylesheets/Windows/Application.Login.Form.Window.Stylesheet.css";
import { Link } from "react-router-dom";

const ApplicationLoginFormWindow: React.FunctionComponent = () => {
  // Set the document title on mount
  useEffect(() => {
    document.title = "Auth - Login | LinkList";
  }, []);

  // Render the window layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main className="application-login-form-window">
        <section className="_application-login-form-window-wrapper">
          <h1>Welcome To Linklist</h1>
          {/* add event to be triggered to open an external link */}
          <p>
            Log in with your registered username to continue or{" "}
            <Link
              to={{
                pathname: "/auth/redirect/signup",
              }}
            >
              Sign up
            </Link>{" "}
            for a new account.
          </p>
          <p></p>
          {/*  */}
          <input
            type="text"
            name="username"
            id="username"
            title="input your registered username"
            placeholder="registered username"
            aria-placeholder="registered username"
          />
          <p></p>
          {/* add event to be triggered to open an external link */}
          <button type="button" title="click to log in">
            Log in
          </button>
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

export default ApplicationLoginFormWindow;
