import React from "react";
// import CodeEditor from "./components/CodeEditor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Workspace from "./pages/Workspace/Workspace";
import Home from "./pages/Main/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import GLogin from "./components/GLogin";
import AddQues from "./components/AddQues";

const App = () => {
  return (
    <>
    <ToastContainer />
    <Navbar />
      {/* <CodeEditor /> */}
      <div className="main">
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/problem/:id" element={<Workspace/>} />
          <Route exact path="/auth" element={<GLogin/>} />
          <Route exact path="/add" element={<AddQues/>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
