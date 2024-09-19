import React, { useState } from "react";
import { FaPlus, FaChevronRight, FaChevronLeft } from "react-icons/fa"; // Importing icons

const TestCases = ({ handleCompile, testcases, processing, onAddTestCase }) => {
  const [activeTab, setActiveTab] = useState(0); // Manage the active test case tab

  const handleTabChange = (index) => {
    setActiveTab(index); // Change the active tab
  };

  const handleAddTestCase = () => {
    onAddTestCase(); // Call the function to add a new test case
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          {testcases?.map((_, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 border rounded-md ${idx === activeTab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-400`}
              onClick={() => handleTabChange(idx)}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddTestCase}
          className="px-3 py-1 flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaPlus className="mr-1" /> Add Test Case
        </button>
      </div>
      <div>
        {testcases[activeTab] && (
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
            <div className="mb-4">
              <p className="font-semibold">Input:</p>
              <div className="p-2 border border-gray-300 rounded-md bg-white">
                {testcases[activeTab].input}
              </div>
            </div>
            <div>
              <p className="font-semibold">Output:</p>
              <div className="p-2 border border-gray-300 rounded-md bg-white">
                {testcases[activeTab].output}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={handleCompile}
          className={`w-full py-2 rounded-md ${processing ? 'bg-gray-500' : 'bg-blue-500'} text-white hover:${processing ? 'bg-gray-600' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Compile and Execute"}
        </button>
      </div>
    </div>
  );
};

export default TestCases;
