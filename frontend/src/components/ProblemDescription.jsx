import React from "react";

function ProblemDescription({ details }) {
  return (
    <div className="select-none h-[100vh] bg-none rounded-md p-4 overflow-y-scroll">
      <div className="text-lg font-semibold mb-2 border-b border-green-600 pb-2">
        Problem Description
      </div>
      <div className="font-semibold text-3xl py-1">{details?.title}</div>
      <div className="text-md my-6">{details?.problemStatement}</div>
      <div className="py-1"></div>
      <div className="text-md mb-3">
        <span className="font-semibold text-green-600">Input:</span> {details?.inputStatement}
      </div>
      <div className="text-md mb-3">
        <span className="font-semibold text-green-600">Output:</span>{" "}
        {details?.outputStatement}
      </div>
      <div className="space-y-4">
        {details.sampleTestCases?.map((example, index) => (
          <div
            className="p-4 bg-stone-800 bg-opacity-90 rounded-md"
            key={index}
          >
            <div className="font-semibold">Example {index + 1}:</div>
            <div className="text-md mt-2">
              <strong>Input:</strong> {example?.input} <br />
              <strong>Output:</strong> {example?.output}
              <br />
              <strong>Explanation:</strong> {example?.explanation}
            </div>
          </div>
        ))}
      </div>
      <div className="text-md mt-5">
        <span className="font-semibold text-green-600">Note:</span> {details?.note}
      </div>
      {/* <div className="mt-8 space-y-2">
        <div className="font-semibold">Constraints:</div>
        {details.constraints?.map((constraint, index) => (
          <li key={index} className="text-sm">
            {constraint}
          </li>
        ))}
      </div> */}
    </div>
  );
}

export default ProblemDescription;
