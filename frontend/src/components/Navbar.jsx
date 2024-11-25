import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../context/user/userContext";
import axiosInstance from "../util/axiosInstance";

const Navbar = () => {
  const context = useContext(userContext);
  const { currUser, setCurrUser } = context;
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    axiosInstance.get("/auth/logout");
    setCurrUser(null);
    document.cookie =
      "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  useEffect(() => {
    // Preload images
    currUser?.photos.forEach((photo) => {
      new Image().src = photo.value;
    });
  }, [currUser]);

  const getFirstName = (fullName) => {
    return fullName?.split(" ")[0] || "";
  };

  return (
    <nav className="h-12 flex items-center justify-between px-8 dark:bg-gray-800 shadow-md relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-3xl">
        ScoreFlow
      </div>
      <div></div> {/* Placeholder for flex alignment */}
      {currUser && (
        <div className="relative flex items-center space-x-2">
          <img
            src={currUser.photos[0]?.value}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          />
          <span
            className="text-white text-sm font-medium cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {getFirstName(currUser.displayName)}
          </span>
          {isDropdownOpen && (
            <div className="absolute top-7 right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-10">
              {currUser.role === "teacher" ? (
                <></>
              ) : (
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/profile");
                    setIsDropdownOpen(false);
                  }}
                >
                  Go to Profile
                </button>
              )}
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  navigate("/tests");
                  setIsDropdownOpen(false);
                }}
              >
                Home
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
