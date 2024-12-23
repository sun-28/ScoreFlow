import React, { useEffect, useState } from "react";

const TestCases = ({ handleSubmit, handleRun, testCases, processing }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="p-4 bg-none rounded-md overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {testCases.map((_, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 border rounded-md ${
                idx === activeTab
                  ? "bg-stone-800 text-white border-green-600"
                  : "bg-stone-800 text-white hover:bg-stone-400"
              } `}
              onClick={() => handleTabChange(idx)}
            >
              Sample Case {idx + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2 bg-none border-stone-800">
        <div className="mb-2">
          <p className="font-semibold mb-2">Input:</p>
          <textarea
            value={testCases[activeTab]?.input || ""}
            readOnly
            className="p-2 rounded-md bg-stone-800 w-full"
            rows="1"
          />
        </div>
        <div>
          <p className="font-semibold mb-2">Expected Output:</p>
          <textarea
            value={testCases[activeTab]?.output || ""}
            readOnly
            className="p-2 rounded-md bg-stone-800 w-full"
            rows="1"
          />
        </div>
      </div>
      <div className="mt-1 flex gap-4">
        <button
          onClick={() => {
            handleRun();
          }}
          className={`w-full py-2 rounded-md text-white text-lg font-semibold ${
            processing ? "bg-stone-500" : "bg-blue-700"
          } hover:${
            processing ? "bg-stone-600" : "bg-stone-500"
          } focus:outline-none focus:ring-2 focus:ring-stone-500 transform transition-transform duration-200 hover:scale-105`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Run Sample Test Cases"}
        </button>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className={`w-full py-2 rounded-md font-semibold text-lg text-white ${
            processing
              ? "bg-stone-800 hover:bg-stone-800"
              : "bg-green-600 hover:bg-stone-600"
          } focus:outline-none focus:ring-2 focus:ring-green-600 transform transition-transform duration-200 hover:scale-105`}
          disabled={processing}
        >
          {processing ? "Processing..." : "SUBMIT"}
        </button>
      </div>
    </div>
  );
};

export default TestCases;
