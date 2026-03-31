import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Application from "./Application";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// stylesheet import for application configs
import "./stylesheets/Configurations/Application.Styles.Configurations.css";
// stylesheet import for reusable components
import "./stylesheets/Components/Reusable.Components.Stylesheet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Application />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
