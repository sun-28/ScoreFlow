import { useState, useEffect } from "react";
import axiosInstance from "../../util/axiosInstance";
import userContext from "./userContext";

const UserState = (props) => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/user");
      setCurrUser(data);
      console.log(currUser);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <userContext.Provider value={{ currUser, setCurrUser, getUser }}>
      {props.children}
    </userContext.Provider>
  );
};

export default UserState;
