import React, { useContext, useEffect, useState } from "react";
import userContex from "../context/user/userContext";
import axiosInstance from "../util/axiosInstance";

const StudentProfile = () => {
  const context = useContext(userContex);
  const { currUser } = context;
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile/${currUser._id}`);
        new Image().src = response.data.photo; // preloading image
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load student data");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-md p-6 max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <img
            src={studentData.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold">{studentData.displayName}</h1>
            <p className="text-gray-600">Enrollment: {studentData.enroll}</p>
            <p className="text-gray-600">Semester: {studentData.semester}</p>
            <p className="text-gray-600">Batch: {studentData.batch}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Test Scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4">Subject</th>
                <th className="border-b p-4">Marks</th>
              </tr>
            </thead>
            <tbody>
              {studentData.testScores.map((test, index) => (
                <tr key={index}>
                  <td className="border-b p-4">{test.test?.subject || "N/A"}</td>
                  <td className="border-b p-4">{test.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
