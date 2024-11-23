import React, { useContext, useEffect } from "react";
import GLogin from "../components/GLogin";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { currUser } = useContext(userContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (currUser != null) {
      navigate("/tests");
    }
  }, [currUser]);
  return (
    <div className="h-screen w-full flex flex-col items-center gap-6 pt-60 text-white dark:bg-gray-800">
      <div className="flex flex-col justify-center items-center gap-2">
        <h2 className=" text-3xl">Welcome to ScoreFlow!</h2>
        <p className="text-xl">Please Login To Continue</p>
        <p className="text-lg">Make Sure To Use College G-Suite</p>
      </div>
      <GLogin />
    </div>
  );
};

export default Auth;
