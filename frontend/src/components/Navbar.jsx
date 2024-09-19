import React from "react";

const Navbar = () => {
  return (
    <nav className="h-12 flex justify-center items-center px-8 bg-white shadow-md">
      <button
        className="cursor-pointer bg-gray-800 text-white text-sm rounded border border-transparent px-2 py-1"
      >
        ScoreFlow
      </button>
    </nav>
  );
};

export default Navbar;
