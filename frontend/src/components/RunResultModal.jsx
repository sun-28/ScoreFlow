import React from "react";

const RunResultModal = ({ show, onClose, runResults }) => {
  if (!show) return null;
  console.log(runResults);
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
        <ul className="space-y-2">
          {runResults.map((result, index) => (
            <li
              key={index}
              className={`p-3 border rounded-md ${
                result.passed === null
                  ? "bg-gray-100 border-gray-400"
                  : result.passed
                  ? "bg-green-100 border-green-400"
                  : "bg-red-100 border-red-400"
              }`}
            >
              <div>
                <strong>Input:</strong> {result.input}
              </div>
              <div>
                <strong>Expected:</strong> {result.expectedOutput}
              </div>
              <div>
                <strong>Output:</strong>{" "}
                {result.passed === null ? "Running..." : result.actualOutput}
              </div>
              <div className="flex items-center gap-1">
                <strong>Status:</strong>{" "}
                {result.passed === null ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 animate-spin"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288"
                    />
                  </svg>
                ) : (
                  result.verdict
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RunResultModal;
