import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../util/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddQues = () => {
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    outputStatement: "",
    inputStatement: "",
    marks: 0,
    note: "",
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTestCase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: "", output: "", explanation: "" }],
    });
  };

  const handleTestCaseChange = (index, type, field, value) => {
    const updatedCases = formData[type].map((testCase, idx) =>
      idx === index ? { ...testCase, [field]: value } : testCase
    );
    setFormData({ ...formData, [type]: updatedCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/ques/create", formData);
      console.log("Question added:", response.data);
      toast.success("Question added successfully!");
      setFormData({
        title: "",
        problemStatement: "",
        outputStatement: "",
        inputStatement: "",
        marks: 0,
        note: "",
        sampleTestCases: [{ input: "", output: "", explanation: "" }],
        hiddenTestCases: [{ input: "", output: "" }],
      });
      navigate("/tests");
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add question. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Problem Statement</label>
          <textarea
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Input Statement</label>
          <textarea
            name="inputStatement"
            value={formData.inputStatement}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Output Statement</label>
          <textarea
            name="outputStatement"
            value={formData.outputStatement}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Marks</label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-lg font-medium">Sample Test Cases</h3>
          {formData.sampleTestCases.map((testCase, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    "sampleTestCases",
                    "input",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Output"
                value={testCase.output}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    "sampleTestCases",
                    "output",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Explanation"
                value={testCase.explanation || ""}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    "sampleTestCases",
                    "explanation",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 mb-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTestCase("sampleTestCases")}
            className="px-3 py-2 text-white bg-blue-500 rounded"
          >
            Add Sample Test Case
          </button>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-lg font-medium">Hidden Test Cases</h3>
          {formData.hiddenTestCases.map((testCase, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    "hiddenTestCases",
                    "input",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Output"
                value={testCase.output}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    "hiddenTestCases",
                    "output",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 mb-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTestCase("hiddenTestCases")}
            className="px-3 py-2 text-white bg-blue-500 rounded"
          >
            Add Hidden Test Case
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-500 rounded"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default AddQues;
