import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import UserState from "./context/user/UserState.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserState>
      <App />
    </UserState>
  </BrowserRouter>
);
