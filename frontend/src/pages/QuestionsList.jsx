import React, { useState, useEffect } from "react";
import axiosInstance from "../util/axiosInstance";
import { toast } from "react-toastify";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get("/ques/all");
        console.log(data);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        toast.error("Failed to load questions. Please try again.");
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Questions</h1>
      {questions.length === 0 ? (
        <p className="text-lg text-gray-600">No questions available</p>
      ) : (
        <ul className="space-y-6">
          {questions.map((question, index) => (
            <li key={index} className="bg-white shadow-lg rounded-lg p-6 border border-slate-900">
              <h2 className="text-xl font-semibold text-gray-800">
                Q {question.title}
              </h2>
              <div className="mt-4">
                <p className="text-lg text-gray-700">
                  <strong>Problem Statement:</strong>{" "}
                  {question.problemStatement}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Output Statement:</strong> {question.outputStatement}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Input Statement:</strong> {question.inputStatement}
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  <strong>Marks:</strong> {question.marks}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Number of Test Cases:</strong>{" "}
                  {question.numberOfTestCases}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Sample Test Cases
                </h3>
                <ul className="space-y-4 mt-2">
                  {question.sampleTestCases.map((testCase, idx) => (
                    <li key={idx} className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-md text-gray-800">
                        <strong>Input:</strong> {testCase.input}
                      </p>
                      <p className="text-md text-gray-800">
                        <strong>Output:</strong> {testCase.output}
                      </p>
                      {testCase.explanation && (
                        <p className="text-md text-gray-700 mt-2">
                          <strong>Explanation:</strong> {testCase.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Hidden Test Cases
                </h3>
                <ul className="space-y-4 mt-2">
                  {question.hiddenTestCases.map((testCase, idx) => (
                    <li key={idx} className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-md text-gray-800">
                        <strong>Input:</strong> {testCase.input}
                      </p>
                      <p className="text-md text-gray-800">
                        <strong>Output:</strong> {testCase.output}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionsList;
