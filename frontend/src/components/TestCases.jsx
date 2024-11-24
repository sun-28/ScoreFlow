import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const TestCases = ({
  handleCompile,
  testCases,
  setTestCases,
  processing,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [input, setInput] = useState(testCases[0]?.input || "");
  const [expectedOutput, setExpectedOutput] = useState(
    testCases[0]?.expectedOutput || ""
  );


  useEffect(() => {
    handleEditTestCase();
  }, [input, expectedOutput]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setInput(testCases[index]?.input || "");
    setExpectedOutput(testCases[index]?.expectedOutput || "");
  };

  const handleAddTestCase = () => {
      const newTestCases = [...testCases, { input:"", expectedOutput:"" }];
      setTestCases(newTestCases);
  };

  const handleEditTestCase = () => {
    const updatedTestCases = testCases.map((testCase, index) =>
      index === activeTab ? { input, expectedOutput } : testCase
    );
    setTestCases(updatedTestCases);
  };

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = testCases.filter((_, idx) => idx !== index);
    setTestCases(updatedTestCases);
    if (activeTab === index) {
      setActiveTab(0);
      handleTabChange(0);
    }
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
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-blue-400`}
              onClick={() => handleTabChange(idx)}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAddTestCase}
            className="px-3 py-1 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-1" /> Add Test Case
          </button>
          {testCases.length > 1 && (
            <button
              onClick={() => handleRemoveTestCase(activeTab)}
              className="px-3 py-1 flex items-center text-red-500 hover:text-red-700"
            >
              <FaTrash className="mr-1" /> Remove Test Case
            </button>
          )}
        </div>
      </div>
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <div className="mb-4">
          <p className="font-semibold">Input:</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white w-full"
            rows="1"
          />
        </div>
        <div>
          <p className="font-semibold">Expected Output:</p>
          <textarea
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white w-full"
            rows="1"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            handleCompile();
          }}
          className={`w-full py-2 rounded-md ${
            processing ? "bg-gray-500" : "bg-blue-500"
          } text-white hover:${
            processing ? "bg-gray-600" : "bg-blue-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Compile and Execute"}
        </button>
      </div>
    </div>
  );
};

export default TestCases;
