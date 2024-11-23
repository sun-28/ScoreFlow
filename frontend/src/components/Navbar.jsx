import React, { useContext } from "react";
import userContext from "../context/user/userContext";
import axiosInstance from "../util/axiosInstance";

const Navbar = () => {
  const context = useContext(userContext);
  const { currUser, setCurrUser } = context;
  const handleLogout = () => {
    axiosInstance.get("/auth/logout");
    setCurrUser(null);
    document.cookie =
      "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };
  return (
    <nav
      className={`h-12 flex items-center ${
        currUser ? "justify-between" : "justify-center"
      }  px-8 dark:bg-gray-800 shadow-md`}
    >
      {currUser && <div></div>}
      <div className="cursor-pointe text-white text-3xl">ScoreFlow</div>
      {currUser && (
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-600 text-white text-sm rounded border border-transparent px-2 py-1 hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
