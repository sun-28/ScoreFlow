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

  const fetchTests = async () => {
    try {
      const response = await axiosInstance.get(
        `/test/sem/${semester}/batch/${batch}`
      );
      setUpcomingTests(response.data.upcomingTests);
      setPastTests(response.data.pastTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Failed to load tests.");
    }
  };

  useEffect(() => {
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
          fetchTests={fetchTests}
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

const TestList = ({ tests, label, currUser, isTestActive, showCountdown , fetchTests }) => {
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
          fetchTests={fetchTests}
        />
      ))}
    </div>
  );
};

const TestCard = ({ test, currUser, isTestActive, showCountdown, fetchTests }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(0, new Date(test.startTime) - new Date())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    subject: test.subject,
    startTime: test.startTime,
    duration: test.duration,
  });

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

  const handleEditButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (editFormData.subject !== test.subject)
      updatedFields.subject = editFormData.subject;
    if (editFormData.startTime !== test.startTime)
      updatedFields.startTime = editFormData.startTime;
    if (editFormData.duration !== test.duration)
      updatedFields.duration = editFormData.duration;

    try {
      if (Object.keys(updatedFields).length > 0) {
        await axiosInstance.post(`/test/edit/${test._id}`, updatedFields);
        toast.success("Test updated successfully!");
        fetchTests();
        handleCloseModal();
      } else {
        toast.info("No changes made.");
      }
    } catch (error) {
      console.error("Error editing test:", error);
      toast.error("Failed to update test.");
    }
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
            <button
              onClick={handleEditButtonClick}
              className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
            >
              Edit
            </button>
          )}
      </div>

      {/* Modal for Editing Test */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Test</h3>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={editFormData.subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={editFormData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration (in minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={editFormData.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
