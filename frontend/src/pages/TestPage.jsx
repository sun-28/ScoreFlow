import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../util/axiosInstance";
import userContext from "../context/user/userContext";

const TestPage = () => {
  const { testid } = useParams();
  const navigate = useNavigate();
  const { currUser } = useContext(userContext);

  const [testDetails, setTestDetails] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/test/${testid}`);
        console.log(new Date(response.data.startTime).toLocaleString());
        console.log(response.data);
        setTestDetails(response.data);
        const { startTime, duration } = response.data;
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);
        const timeRemaining = endTime - new Date();
        setTimeRemaining(timeRemaining);
      } catch (error) {
        console.error("Error fetching test details:", error);
        toast.error(error.response?.data?.message || "Failed to load test.");
        navigate("/tests");
      }
    };

    fetchTestDetails();
  }, [testid, navigate]);

  useEffect(() => {
    if (!timeRemaining) return;

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  const isAllTestCasesPassed = (questionId) => {
    const studentSubmissions = testDetails?.submissions[currUser.enroll] || {};
    const questionSubmission = studentSubmissions[questionId];
    return questionSubmission?.isAccepted === true;
  };

  const getTestCaseRatio = (questionId) => {
    const studentSubmissions = testDetails?.submissions[currUser.enroll] || {};
    const questionSubmission = studentSubmissions[questionId];
    const numberOfTestCasesPassed =
      questionSubmission?.numberOfTestCasesPassed || 0;
    return `${numberOfTestCasesPassed} / ${
      testDetails.questions.find((q) => q._id === questionId).numberOfTestCases
    }`;
  };

  if (!testDetails) {
    return <p>Loading test details...</p>;
  }

  const { subject, numberOfQuestions, questions } = testDetails;
  const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">{subject} Test</h1>
      <div className="mb-4">
        <p className="text-gray-700">
          <strong>Total Questions:</strong> {numberOfQuestions}
        </p>
        <p className="text-gray-700">
          <strong>Total Marks:</strong> {totalMarks}
        </p>
        <p className="text-gray-700">
          <strong>Time Remaining:</strong>{" "}
          {timeRemaining > 0 ? formatTime(timeRemaining) : "Time's up!"}
        </p>
      </div>
      <div className="grid gap-4">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className={`p-4 ${
              isAllTestCasesPassed() ? "bg-green-200" : "bg-white"
            } shadow rounded flex justify-between items-center`}
            onClick={() => navigate(`/test/${testid}/${question._id}`)}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Question {index + 1}
              </h2>
              <p className="text-gray-700">{question.title}</p>
              <p className="text-sm text-gray-500">
                <strong>Marks:</strong> {question.marks}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">
                <strong>Test Cases:</strong> {getTestCaseRatio(question._id)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
