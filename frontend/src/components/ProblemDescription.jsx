import React from "react";

function ProblemDescription({ details }) {
  return (
    <div className="select-none h-[90vh] border-2 border-white bg-white rounded-md p-4 overflow-y-scroll">
      <div className="text-xs font-semibold mb-2 border-b border-gray-200 pb-2">
        Description
      </div>
      <div className="font-semibold text-lg py-2">{details?.title}</div>
      <div className="py-4"></div>
      <div className="text-sm mb-8">{details?.problemStatement}</div>
      <div className="py-1"></div>
      <div className="text-sm mb-3"><span className="font-semibold">Input:</span> {details?.inputStatement}</div>
      <div className="text-sm mb-8">{details?.outputStatement}</div>
      <div className="space-y-4">
        {details.sampleTestCases?.map((example, index) => (
          <div className="p-4 bg-gray-100 rounded-md" key={index}>
            <div className="font-semibold">Example {index + 1}:</div>
            <div className="text-sm mt-2">
              <strong>Input:</strong> {example?.input} <br />
              <strong>Output:</strong> {example?.output}
              <br />
              <strong>Explanation:</strong> {example?.explanation}
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm mt-5"><span className="font-semibold">Note:</span> {details?.note}</div>
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
