import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import TableData from "./TableData";

function Home() {
  // Define hardcoded example problems
  const exampleProblems = [
    {
      id: "1",
      title: "Two Sum",
      difficult: "Easy",
      category: "Array",
      order: 1,
    },
    {
      id: "2",
      title: "Longest Substring Without Repeating Characters",
      difficult: "Medium",
      category: "String",
      order: 2,
    },
    {
      id: "3",
      title: "Add Two Numbers",
      difficult: "Medium",
      category: "Linked List",
      order: 3,
    },
    // Add more problems as needed
  ];

  const [problems, setProblems] = useState(exampleProblems);

  // Remove the fetchProbelems function since it's no longer needed

  // Optionally use useEffect to show a success message
  // useEffect(() => {
  //   toast.success("Loaded example problems successfully");
  // }, []);

  return (
    <>
      <TableData problems={problems} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default Home;
