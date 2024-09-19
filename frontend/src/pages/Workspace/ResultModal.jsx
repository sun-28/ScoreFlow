// ResultModal.js
import React from "react";

const ResultModal = ({ show, onClose, results, processing }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Test Case Results</h2>
        {processing ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Running test cases...</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={index}
                className={`p-3 border rounded-md ${
                  result.passed
                    ? "bg-green-100 border-green-400"
                    : "bg-red-100 border-red-400"
                }`}
              >
                <div>
                  <strong>Input:</strong> {result.input}
                </div>
                <div>
                  <strong>Expected:</strong> {result.expected}
                </div>
                <div>
                  <strong>Output:</strong> {result.output}
                </div>
                <div>
                  <strong>Status:</strong> {result.passed ? "Passed" : "Failed"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
