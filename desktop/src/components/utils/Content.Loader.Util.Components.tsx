import React from "react";
import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";

// content loader
export const ContentLoaderComponent: React.FunctionComponent = () => {
  return (
    <div className="content-loader-wrapper">
      <div className="loader"></div>
    </div>
  );
};

// page loader
export const PrimaryPageLoaderComponent: React.FunctionComponent = () => {
  return (
    <>
      <div className={String("primary-spinner-wrapper").toLocaleLowerCase()}>
        <div className="loader"></div>
        <p>please be patient as we process request...</p>
      </div>
    </>
  );
};
