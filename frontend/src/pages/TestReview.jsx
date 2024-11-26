import React, { useEffect, useState } from "react";
import axiosInstance from "../util/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ReviewTestPage = () => {
  const { testid } = useParams();
  const [testData, setTestData] = useState([]);
  const [adjustedMarks, setAdjustedMarks] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [maxMarks, setMaxMarks] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plag, setPlag] = useState(null);
  const navigate = useNavigate();

  const checkPlagiarism = async () => {
    try {
      const response = await axiosInstance.get(`/plag/${testid}`);
      setPlag(response.data.detectedPlagiarism);
      console.log(response.data.detectedPlagiarism);
    } catch (err) {
      console.error("Error checking plagiarism:", err);
      toast.error("Failed to check plagiarism. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axiosInstance.get(`/review/test/${testid}`);

        setMaxMarks(response.data.maxMarks);
        setTestData(response.data.result);
        const initialMarks = {};
        response.data.result.forEach((student) => {
          initialMarks[student.enroll] = student.totalMarks;
        });
        setAdjustedMarks(initialMarks);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestData();
  }, [testid]);

  const handleMarksChange = (enroll, increment) => {
    setAdjustedMarks((prevMarks) => {
      const newMarks = prevMarks[enroll] + (increment ? 0.5 : -0.5);
      return {
        ...prevMarks,
        [enroll]: Math.min(maxMarks, Math.max(0, newMarks)),
      };
    });
  };

  const openDetailsModal = (student) => {
    setSelectedStudent(student);
  };

  const closeDetailsModal = () => {
    setSelectedStudent(null);
  };

  const handleCompleteReview = async () => {
    setIsSubmitting(true);
    try {
      const payload = { testId: testid, adjustedMarks };
      const response = await axiosInstance.post("/review/complete", payload);
      toast.success("Test review completed successfully!");
      navigate("/tests");
    } catch (error) {
      console.error("Error completing test review:", error);
      toast.error("Failed to complete test review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mr-2">
        <h1 className="text-2xl font-bold mb-6">Review Test</h1>
        <button
          onClick={checkPlagiarism}
          className="p-1 text-white border border-gray-800 rounded-md bg-gray-800 shadow-sm hover:bg-slate-300 hover:text-black "
        >
          Check Plagiarism
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-md p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Enroll</th>
              <th className="border-b p-4">Name</th>
              <th className="border-b p-4">Marks</th>
              <th className="border-b p-4">Plag Record</th>
              <th className="border-b p-4">Details</th>
              <th className="border-b p-4">Give Marks</th>
            </tr>
          </thead>
          <tbody>
            {testData.map((student) => (
              <tr key={student.enroll}>
                <td className="border-b p-4">{student.enroll}</td>
                <td className="border-b p-4">{student.studentName}</td>
                <td className="border-b p-4">{student.totalMarks}</td>
                <td className="border-b p-4">
                  {plag == null
                    ? "Run Plag Check"
                    : plag[student.enroll]?.map((plagStudent, idx) => {
                        return (
                          <div key={idx}>
                            Q {plagStudent.question} - {plagStudent.student} -{" "}
                            {Math.round(plagStudent.plagiarismScore * 100)}%
                          </div>
                        );
                      })}
                </td>
                <td className="border-b p-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => openDetailsModal(student)}
                  >
                    Show Details
                  </button>
                </td>
                <td className="border-b p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                      onClick={() => handleMarksChange(student.enroll, true)}
                    >
                      +
                    </button>
                    <span className="font-semibold">
                      {adjustedMarks[student.enroll]}
                    </span>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleMarksChange(student.enroll, false)}
                    >
                      -
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={`bg-green-600 text-white px-6 py-2 rounded-md ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
          onClick={handleCompleteReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Complete Test Review"}
        </button>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-md p-6 w-3/4  overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 3rem)" }}
          >
            <h2 className="text-xl font-bold mb-4">
              Details for {selectedStudent.studentName}
            </h2>
            <ul className="space-y-4">
              {selectedStudent.questions.map((question, index) => (
                <li key={index} className="p-4 border rounded-md">
                  <h3 className="text-lg font-semibold">
                    {question.questionName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Test Cases Passed: {question.numberOfTestCasesPassed}/
                    {question.numberOfTestCases}
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto">
                    {question.code}
                  </pre>
                </li>
              ))}
            </ul>
            <button
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={closeDetailsModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTestPage;
