import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddQues from "./pages/AddQues";
import AddTest from "./pages/AddTest";
import TestPage from "./pages/TestPage";
import Tests from "./pages/Tests";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import SideBar from "./components/SideBar";
import userContext from "./context/user/userContext";
import CodeSpace from "./pages/CodeSpace";
import Profile from "./pages/Profile";
import QuestionsList from "./pages/QuestionsList";
import ReviewTests from "./pages/ReviewTests";
import TestReview from "./pages/TestReview";

const App = () => {
  const location = useLocation();
  const { currUser } = useContext(userContext);

  const hide = ["/auth"];
  const isStudent = currUser?.role === "student";

  return (
    <>
      <ToastContainer />
      {!hide.includes(location.pathname) && <Navbar />}

      <div className="flex">
        {!hide.includes(location.pathname) && !isStudent && <SideBar />}

        <div className="main flex-1">
          <Routes>
            <Route exact path="/auth" element={<Auth />} />
            <Route
              exact
              path="/home"
              element={
                <ProtectedRoute element={<Home />} roles={["teacher"]} />
              }
            />
            <Route
              exact
              path="/ques/add"
              element={
                <ProtectedRoute element={<AddQues />} roles={["teacher"]} />
              }
            />
            <Route
              exact
              path="/test/add"
              element={
                <ProtectedRoute element={<AddTest />} roles={["teacher"]} />
              }
            />
            <Route
              exact
              path="/test/:testid"
              element={
                <ProtectedRoute element={<TestPage />} roles={["student"]} />
              }
            />
            <Route
              exact
              path="/tests"
              element={
                <ProtectedRoute
                  element={
                    <Tests
                      semester={currUser?.semester || 5}
                      batch={currUser?.batch || "F1"}
                    />
                  }
                  roles={["student", "teacher"]}
                />
              }
            />
            <Route
              exact
              path="/test/:testid/ques/:quesid"
              element={
                <ProtectedRoute
                  element={<CodeSpace />}
                  roles={["student", "teacher"]}
                />
              }
            />
            <Route
              exact
              path="/profile"
              element={
                <ProtectedRoute element={<Profile />} roles={["student"]} />
              }
            />
            <Route
              exact
              path="/questions"
              element={
                <ProtectedRoute
                  element={<QuestionsList />}
                  roles={["teacher"]}
                />
              }
            />
            <Route
              exact
              path="/test/review/:testid"
              element={
                <ProtectedRoute element={<TestReview />} roles={["teacher"]} />
              }
            />
            <Route
              exact
              path="/tests/review"
              element={
                <ProtectedRoute element={<ReviewTests />} roles={["teacher"]} />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
