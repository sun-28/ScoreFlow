import React, { useContext, useEffect } from "react";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const context = useContext(userContext);
  const { currUser } = context;
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img
              src={currUser?.photos[0]?.value}
              alt="Profile"
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currUser?.name?.givenName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {currUser?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <ul className="space-y-2">
              <li className="text-gray-700 dark:text-gray-300">
                <strong>Enrollment Number:</strong> {currUser?.name?.familyName}
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                <strong>Batch:</strong> {currUser?.batch}
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                <strong>Semester:</strong> {currUser?.semester}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
