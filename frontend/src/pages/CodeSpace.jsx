import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get route params
import Split from "react-split";
import { toast } from "react-toastify";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import TestCases from "../components/TestCases";
import ResultModal from "../components/ResultModal";
import io from "socket.io-client";
import axios from "axios";
import axiosInstance from "../util/axiosInstance";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
const socket = io(SOCKET_SERVER_URL);

const CodeSpace = () => {
  const { testid, quesid } = useParams();
  const [details, setDetails] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);

  const getQuestionDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/ques/${quesid}?testid=${testid}`
      );
      console.log(response.data.question);
      setDetails(response.data.question);
      setTestCases(response.data.question.sampleTestCases);
    } catch (error) {
      console.error("Error fetching question details:", error);
      toast.error("Failed to load question.");
    }
  };

  useEffect(() => {
    getQuestionDetails();
  }, []);

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
      <Split
        className="split"
        minSize={0}
        // gutterStyle={{
        //   backgroundColor: "#101124",
        //   cursor: "col-resize",
        // }}
      >
        <ProblemDescription details={details} />
        <Split className="split-vertical" direction="vertical">
          <CodeEditor
            code={code}
            onChange={onChange}
            language={language}
            onLanguageChange={onLanguageChange}
            testid={testid}
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
};

export default CodeSpace;
