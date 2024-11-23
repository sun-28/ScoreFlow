import { useState, useEffect } from "react";
import axiosInstance from "../util/axiosInstance";
import { toast } from "react-toastify";

const AddTest = () => {
  const [formData, setFormData] = useState({
    subject: "",
    startTime: "",
    duration: "",
    questions: [],
    allowedLanguages: "",
    semester: "",
    batches: "",
    numberOfQuestions: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get("/ques/get");
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, questions: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, numberOfQuestions: formData.questions.length });
    try {
      await axiosInstance.post("/test/create", formData);
      toast.success("Test added successfully!");
      setFormData({
        subject: "",
        startTime: "",
        duration: "",
        questions: [],
        allowedLanguages: "",
        semester: "",
        batches: "",
      });
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Add Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration (in minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="allowedLanguages"
            className="block text-sm font-medium"
          >
            Allowed Languages
          </label>
          <input
            type="text"
            id="allowedLanguages"
            name="allowedLanguages"
            value={formData.allowedLanguages}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Python, Java, C++"
            required
          />
        </div>
        <div>
          <label htmlFor="semester" className="block text-sm font-medium">
            Semester
          </label>
          <input
            type="number"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="batches" className="block text-sm font-medium">
            Batches
          </label>
          <input
            type="text"
            id="batches"
            name="batches"
            value={formData.batches}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., A, B, C"
            required
          />
        </div>
        <div>
          <label htmlFor="questions" className="block text-sm font-medium">
            Select Questions
          </label>
          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <select
              id="questions"
              name="questions"
              multiple
              value={formData.questions}
              onChange={handleQuestionSelection}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {questions.map((question) => (
                <option key={question._id} value={question._id}>
                  {question.title}
                </option>
              ))}
            </select>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Hold Ctrl (or Cmd on Mac) to select multiple questions.
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700"
        >
          Add Test
        </button>
      </form>
    </div>
  );
};

export default AddTest;
