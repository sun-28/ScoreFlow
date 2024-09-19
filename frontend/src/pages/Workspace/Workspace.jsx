import React, { useState, useEffect } from "react";
import Split from "react-split";
import { toast } from "react-toastify";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import ResultModal from "./ResultModal";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001");

function Workspace() {
  const details = {
    id: "1",
    title: "Add Two Numbers",
    difficulty: "Easy",
    category: "Math",
    order: 1,
    description:
      "Write a function that takes two integers and returns their sum. Make sure your function handles both positive and negative numbers.",
    examples: [
      {
        input: "2 3",
        expectedOutput: "5",
        explanation: "The sum of 2 and 3 is 5.",
      },
      {
        input: "-1 5",
        expectedOutput: "4",
        explanation: "The sum of -1 and 5 is 4.",
      },
    ],
    constraints: [
      "The input integers must be between -1000 and 1000.",
      "The function should return a single integer.",
    ]
  };
  const [testCases, setTestCases] = useState([
    { input: "2 3", expectedOutput: "5" },
    { input: "10 20", expectedOutput: "30" },
    { input: "-5 15", expectedOutput: "10" },
  ]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);


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
      const response = await axios.post("http://localhost:3000/code/submit", {
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
