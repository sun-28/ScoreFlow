import React from "react";
import SideContent from "./SideContent";

const SideBar = () => {
  return (
    <div className="flex h-screen sticky top-0">
      <div className="hidden md:block bg-white border-gray-900 border border-t-0 text-black w-64">
        <div className="p-4 pt-6">
          <SideContent />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
