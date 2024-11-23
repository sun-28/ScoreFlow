import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Workspace from "./pages/Workspace/Workspace";
import Home from "./pages/Main/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import GLogin from "./components/GLogin";
import AddQues from "./components/AddQues";
import AddTest from "./components/AddTest";
import Tests from "./pages/Tests";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="main">
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/problem/:id" element={<Workspace />} />
          <Route exact path="/auth" element={<GLogin />} />
          <Route exact path="/add/Ques" element={<AddQues />} />
          <Route exact path="/add/Test" element={<AddTest />} />
          <Route exact path="/tests" element={<Tests semester={5} batch="F1"/>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
