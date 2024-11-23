import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../util/axiosInstance";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";

const Tests = ({ semester, batch }) => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [pastTests, setPastTests] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const context = useContext(userContext);

  const { currUser } = context;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get(`/test/${semester}/${batch}`);
        setUpcomingTests(response.data.upcomingTests);
        setPastTests(response.data.pastTests);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error("Failed to load tests.");
      }
    };

    fetchTests();
  }, [semester, batch]);

  const isTestActive = (startTime, duration) => {
    const currentTime = new Date();
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return currentTime >= new Date(startTime) && currentTime <= endTime;
  };
  return (
    <div className="p-6 bg-gray-50 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Tests for Semester {semester}, Batch {batch}
      </h1>
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`py-2 px-4 ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          Upcoming Tests
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`py-2 px-4 ${
            activeTab === "past"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          Past Tests
        </button>
      </div>
      {activeTab === "upcoming" && (
        <TestList
          tests={upcomingTests}
          label="No upcoming tests."
          currUser={currUser}
          isTestActive={isTestActive}
          showCountdown
        />
      )}
      {activeTab === "past" && (
        <TestList tests={pastTests} label="No past tests." />
      )}
    </div>
  );
};

const TestList = ({ tests, label, currUser, isTestActive, showCountdown }) => {
  if (!tests.length) {
    return <p className="text-gray-500">{label}</p>;
  }

  return (
    <div className="grid gap-4">
      {tests.map((test) => (
        <TestCard
          key={test._id}
          test={test}
          currUser={currUser}
          isTestActive={isTestActive}
          showCountdown={showCountdown}
        />
      ))}
    </div>
  );
};

const TestCard = ({ test, currUser, isTestActive, showCountdown }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(0, new Date(test.startTime) - new Date())
  );

  useEffect(() => {
    if (!showCountdown || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, showCountdown]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 bg-white shadow rounded border hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">{test.subject}</h2>
      <p className="text-sm text-gray-600">
        <strong>Start Time:</strong> {new Date(test.startTime).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Duration:</strong> {test.duration} minutes
      </p>
      <p className="text-sm text-gray-600">
        <strong>Questions:</strong> {test.numberOfQuestions}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Created By:</strong> {test.createdBy.displayName}
      </p>
      <div className="mt-4">
        {currUser?.role === "student" && showCountdown && timeRemaining > 0 ? (
          <button
            disabled
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
          >
            Starts in {formatTime(timeRemaining)}
          </button>
        ) : (
          currUser?.role === "student" &&
          isTestActive(test.startTime, test.duration) && (
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => navigate(`/test/${test._id}`)}
            >
              Start
            </button>
          )
        )}

        {currUser?.role === "teacher" &&
          test.createdBy._id === currUser._id && (
            <button className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2">
              Edit
            </button>
          )}
      </div>
    </div>
  );
};

export default Tests;
