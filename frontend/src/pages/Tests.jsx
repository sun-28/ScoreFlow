import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../util/axiosInstance";

const Tests = ({ semester, batch }) => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [pastTests, setPastTests] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming"); // default tab

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get(`/test/${semester}/${batch}`);
        setUpcomingTests(response.data.upcomingTests);
        setPastTests(response.data.pastTests);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error(error);
      }
    };

    fetchTests();
  }, [semester, batch]);

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Tests for Semester {semester}, Batch {batch}
      </h1>

      {/* Tabs */}
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

      {/* Tab Content */}
      {activeTab === "upcoming" && (
        <TestList tests={upcomingTests} label="No upcoming tests." />
      )}
      {activeTab === "past" && (
        <TestList tests={pastTests} label="No past tests." />
      )}
    </div>
  );
};

const TestList = ({ tests, label }) => {
  if (!tests.length) {
    return <p className="text-gray-500">{label}</p>;
  }

  return (
    <div className="grid gap-4">
      {tests.map((test) => (
        <div
          key={test._id}
          className="p-4 bg-white shadow rounded border hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            {test.subject}
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Start Time:</strong>{" "}
            {new Date(test.startTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Duration:</strong> {test.duration} minutes
          </p>
          <p className="text-sm text-gray-600">
            <strong>Questions:</strong> {test.numberOfQuestions}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Created By:</strong> {test.createdBy?.name || "Unknown"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tests;
