import React, { useEffect } from "react";
import "../stylesheets/Windows/Application.Signup.Form.Window.Stylesheet.css";

const ApplicationSignupFormWindow: React.FunctionComponent = () => {
  // Set the document title on mount
  useEffect(() => {
    document.title = "Auth - Signup | LinkList";
  }, []);

  // Render the window layout and content
  return (
    <>
      {/* Main dashboard page elements */}
      <main className="application-signup-form-window">
        <section className="_application-signup-form-window-wrapper">
          {/*  */}
          <form method="post">
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
            />
            <input
              type="email"
              name="email"
              id="email"
              title="input your email"
              placeholder="example@gmail.com"
              aria-placeholder="example@gmail.com"
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
              onInput={(event) => {
                console.log((event.target as HTMLInputElement).value);
              }}
            />
            <p></p>
            {/* add event to be triggered to open an external link */}
            <button type="button" title="click to signup">
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
