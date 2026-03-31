import React, { useEffect } from "react";
import "../stylesheets/Windows/Application.Auth.Redirect.Window.Stylesheet.css";

const ApplicationAuthRedirectWindow: React.FunctionComponent = () => {
  // Set the document title on mount
  useEffect(() => {
    document.title = "Auth - Redirect | LinkList";
  }, []);

  // Render the window layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main className="application-auth-redirect-window">
        <section className="_application-auth-redirect-window-wrapper">
          <h1>Welcome To Linklist</h1>
          <img
            src="/imgs/business-woman-working-computer-desk-office_116089-4.png"
            alt=""
          />
          <p></p>
          {/* add event to be triggered to open an external link */}
          <p>
            Log in with your registered email to continue or{" "}
            <a href="">Sign up</a> for a new account.
          </p>
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
              Linklist © 2024. Links Management System. All Rights Reserved
            </span>
          </div>
        </section>
      </main>
    </>
  );
};

export default ApplicationAuthRedirectWindow;
