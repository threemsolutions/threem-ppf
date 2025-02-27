import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context/UseAuth"; // ✅ Ensure correct path

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ✅ Wrap the app inside BrowserRouter */}
      <UserProvider>
        {" "}
        {/* ✅ Ensure UserProvider is inside BrowserRouter */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
