import React, { useState, useEffect } from "react";
import Split from "react-split";
import { toast } from "react-toastify";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
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
        output: "5",
        explanation: "The sum of 2 and 3 is 5.",
      },
      {
        input: "-1 5",
        output: "4",
        explanation: "The sum of -1 and 5 is 4.",
      },
    ],
    constraints: [
      "The input integers must be between -1000 and 1000.",
      "The function should return a single integer.",
    ],
    testcases: [
      { input: "2 3", output: "5" },
      { input: "10 20", output: "30" },
      { input: "-5 15", output: "10" },
    ],
  };

  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const testcases = details.testcases;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("test-case-result", (data) => {
      setResults((prevResults) => [...prevResults, data]);
    });

    socket.on("job-completed", () => {
      console.log("All test cases completed");
      toast.success("All test cases completed");
    });

    socket.on("job-failed", (error) => {
      console.error("Job failed:", error);
      toast.error("Job failed: " + error.message);
    });

    return () => {
      socket.off("test-case-result");
      socket.off("job-completed");
      socket.off("job-failed");
    };
  }, []);

  const onChange = (data) => {
    setCode(data);
  };

  const handleCompile = async () => {
    setProcessing(true);
    try {
      // Send code and test cases to the server
      const response = await axios.post("http://localhost:3000/submit", {
        code,
        testcases,
      });

      console.log("Server response:", response.data);
      // Optionally handle server response here

    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Error submitting code: " + error.message);
    }
    setProcessing(false);
  };

  return (
    <Split className="split" minSize={0}>
      <ProblemDescription details={details} />
      <Split className="split-vertical" direction="vertical">
        <CodeEditor onChange={onChange} />
        <TestCases
          handleCompile={handleCompile}
          testcases={testcases}
          processing={processing}
          results={results}
        />
      </Split>
    </Split>
  );
}

export default Workspace;
