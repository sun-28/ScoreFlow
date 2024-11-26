import React from "react";
import SideContent from "./SideContent";

const SideBar = () => {
  return (
    <div className="flex sticky top-0">
      <div
        className=" min-h-full hidden md:block bg-white border-gray-900 border border-t-0 border-b-0 text-black w-64"
        style={{ height: "calc(100vh - 3rem)" }}
      >
        <div className="p-4 pt-6">
          <SideContent />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
