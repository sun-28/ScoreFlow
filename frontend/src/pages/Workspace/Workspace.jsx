import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get route params
import Split from "react-split";
import { toast } from "react-toastify";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import ResultModal from "./ResultModal";
import io from "socket.io-client";
import axios from "axios";
import { ques } from "./ques";

const SOCKET_SERVER_URL = "http://localhost:3001";
// const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
// const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
const API_SERVER_URL = "http://localhost:3000";
const socket = io(SOCKET_SERVER_URL);

function Workspace() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);

  useEffect(() => {
    const question = ques.find((q) => q.id === id);

    if (question) {
      setDetails(question);
      setTestCases(question.examples);
    } else {
      toast.error("Question not found");
    }
  }, [id]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("test-case-result", (data) => {
      setResults((prevResults) => {
        const updatedResults = prevResults.map((result) =>
          result.input === data.input ? data : result
        );
        return updatedResults;
      });
    });

    socket.on("job-started", () => {
      setJobStarted(true);
      setShowModal(true);
      console.log("Job started");
    });

    socket.on("job-completed", () => {
      console.log("All test cases completed");
      toast.success("All test cases completed");
      setProcessing(false);
      setShowModal(true);
    });

    socket.on("job-failed", (error) => {
      console.error("Job failed:", error);
      toast.error("Job failed: " + error.message);
      setProcessing(false);
    });

    return () => {
      socket.off("test-case-result");
      socket.off("job-started");
      socket.off("job-completed");
      socket.off("job-failed");
    };
  }, []);

  const onChange = (data) => {
    setCode(data);
  };

  const onLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleCompile = async () => {
    setProcessing(true);
    setJobStarted(false);
    setResults(
      testCases.map((testCase) => ({
        ...testCase,
        output: "Running...",
        passed: null,
      }))
    );

    try {
      const response = await axios.post(`${API_SERVER_URL}/code/submit`, {
        code,
        language,
        testCases,
        socketId: socket.id,
      });

      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Error submitting code: " + error.message);
      setProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!details) return <div>Loading...</div>;

  return (
    <div className="workspace">
      <Split className="split" minSize={0}>
        <ProblemDescription details={details} />
        <Split className="split-vertical" direction="vertical">
          <CodeEditor
            code={code}
            onChange={onChange}
            language={language}
            onLanguageChange={onLanguageChange}
          />
          <TestCases
            handleCompile={handleCompile}
            testCases={testCases}
            setTestCases={setTestCases}
            processing={processing}
            results={results}
          />
        </Split>
      </Split>
      <ResultModal
        show={showModal}
        onClose={handleCloseModal}
        results={results}
        processing={processing}
        jobStarted={jobStarted}
      />
    </div>
  );
}

export default Workspace;
