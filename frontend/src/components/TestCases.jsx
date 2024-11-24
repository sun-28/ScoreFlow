import React, { useEffect, useState } from "react";

const TestCases = ({ handleCompile, testCases, processing }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="p-4 bg-white border rounded-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {testCases.map((_, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 border rounded-md ${
                idx === activeTab
                  ? "dark:bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-400"
              } `}
              onClick={() => handleTabChange(idx)}
            >
              Sample Case {idx + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <div className="mb-4">
          <p className="font-semibold">Input:</p>
          <textarea
            value={testCases[activeTab]?.input || ""}
            readOnly
            className="p-2 border border-gray-300 rounded-md bg-gray-100 w-full"
            rows="1"
          />
        </div>
        <div>
          <p className="font-semibold">Expected Output:</p>
          <textarea
            value={testCases[activeTab]?.output || ""}
            readOnly
            className="p-2 border border-gray-300 rounded-md bg-gray-100 w-full"
            rows="1"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => {
            handleCompile();
          }}
          className={`w-full py-2 rounded-md ${
            processing ? "bg-gray-500" : "bg-gray-800"
          } text-white hover:${
            processing ? "bg-gray-600" : "bg-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-gray-500`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Run Sample Test Cases"}
        </button>
        <button
          onClick={() => {
            handleCompile();
          }}
          className={`w-full py-2 rounded-md ${
            processing ? "bg-gray-500" : "bg-green-500"
          } text-white hover:${
            processing ? "bg-gray-600" : "bg-green-600"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default TestCases;
