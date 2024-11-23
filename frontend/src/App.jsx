import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddQues from "./pages/AddQues";
import AddTest from "./pages/AddTest";
import Tests from "./pages/Tests";
import UserState from "./context/user/UserState";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import SideBar from "./components/SideBar";
import TestPage from "./pages/TestPage";

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/auth"];
  const hideSideBarRoutes = ["/auth"];
  return (
    <UserState>
      <ToastContainer />
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <div className="flex">
        {!hideSideBarRoutes.includes(location.pathname) && <SideBar />}

        <div className="main flex-1">
          <Routes>
            <Route exact path="/auth" element={<Auth />} />
            <Route
              exact
              path="/home"
              element={<ProtectedRoute element={<Home />} />}
            />
            <Route
              exact
              path="/ques/add"
              element={<ProtectedRoute element={<AddQues />} />}
            />
            <Route
              exact
              path="/test/add"
              element={<ProtectedRoute element={<AddTest />} />}
            />
            <Route
              exact
              path="/tests"
              element={
                <ProtectedRoute element={<Tests semester={5} batch="F1" />} />
              }
            />
            <Route
              exact
              path="/test/:testid"
              element={<ProtectedRoute element={<TestPage />} />}
            />
          </Routes>
        </div>
      </div>
    </UserState>
  );
};

export default App;
