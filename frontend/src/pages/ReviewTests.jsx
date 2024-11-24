import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../util/axiosInstance";

const ReviewTests = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get("/review/tests");
        console.log(response.data);
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/test/review/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Review Pending Tests</h1>
      {tests.length > 0 ? (
        <ul className="space-y-4">
          {tests.map((test) => (
            <li
              key={test._id}
              className="flex justify-between items-center bg-white shadow-md p-4 rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => handleTestClick(test._id)}
            >
              <span className="font-medium text-lg">{test.subject}</span>
              <span className="text-sm text-gray-600">
                {new Date(test.startTime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pending tests for review</p>
      )}
    </div>
  );
};

export default ReviewTests;
