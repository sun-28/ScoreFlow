import React, { useState, useEffect } from "react";
import Split from "react-split";
import { toast } from "react-toastify";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import TestCases from "../components/TestCases";
import io from "socket.io-client";
import axiosInstance from "../util/axiosInstance";
import RunResultModal from "../components/RunResultModal";
import SubmitResultModal from "../components/SumbitResultModal";
import Navbar2 from "../components/Navbar2";
import "../loader.scss";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
const socket = io(SOCKET_SERVER_URL,{
    path: '/socket.io/', 
    transports: ['websocket'], 
});
const Demo = () => {
  const [details, setDetails] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const quesid = "674600623e68305c4422833d";
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [processing, setProcessing] = useState(false);
  const [runResults, setRunResults] = useState([]);
  const [submitResults, setSubmitResults] = useState([]);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);

  const getDemo = async () => {
    try {
      const response = await axiosInstance.get(`/demo/getDetails/${quesid}`);
      setDetails(response.data.question);
      setTestCases(response.data.question.sampleTestCases);
      setRunResults(
        Array(response.data.question.sampleTestCases.length).fill({})
      );
      setSubmitResults(
        Array(
          response.data.question.sampleTestCases.length +
            response.data.question.hiddenTestCases.length
        ).fill({})
      );
    } catch (error) {
      console.error("Error fetching question details:", error);
      toast.error("Failed to load question.");
    }
  };

  useEffect(() => {
    getDemo();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("sample-testcase-result", (data) => {
      setRunResults((prevrunResults) => {
        const newrunResults = [...prevrunResults];
        newrunResults[data.testCase - 1] = data;
        return newrunResults;
      });
    });

    socket.on("job-started", (data) => {
      setJobStarted(true);
      if (data.type === "submit") {
        setShowSubmitModal(true);
      } else {
        setShowRunModal(true);
      }
      console.log("Job started");
    });

    socket.on("job-completed", (data) => {
      toast.success("Run Successful");
      setProcessing(false);
      if (data.type === "submit") {
        setShowSubmitModal(true);
      } else {
        setShowRunModal(true);
      }
    });

    socket.on("job-failed", (data) => {
      console.error("Job failed:", error);
      toast.error("Job failed: " + error.message);
      setProcessing(false);
    });

    socket.on("testcase-result", (data) => {
      console.log(data);
      setSubmitResults((prev) => {
        const newRes = [...prev];
        newRes[data.testCase - 1] = data;
        return newRes;
      });
    });

    return () => {
      socket.off("sample-testcase-result");
      socket.off("testcase-result");
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

  const handleSubmit = async () => {
    setProcessing(true);
    setJobStarted(false);
    setSubmitResults((data) =>
      data.map((testCase) => ({
        ...testCase,
        output: "Running...",
        passed: null,
      }))
    );

    try {
      const response = await axiosInstance.post(`/demo/submit`, {
        code,
        language,
        socketId: socket.id,
        questionId: quesid,
      });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Error submitting code: " + error.message);
      setProcessing(false);
    }
  };

  const handleRun = async () => {
    setProcessing(true);
    setJobStarted(false);
    setRunResults(
      testCases.map((testCase) => ({
        ...testCase,
        output: "Running...",
        passed: null,
      }))
    );

    try {
      const response = await axiosInstance.post(`/demo/run`, {
        code,
        language,
        socketId: socket.id,
        questionId: quesid,
      });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Error submitting code: " + error.message);
      setProcessing(false);
    }
  };

  const handleCloseRunModal = () => {
    setShowRunModal(false);
  };
  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
  };

  return (
    <div className="workspace text-white">
      <div className={ loading ?" bg-gradient-to-b from-stone-900 from- via-stone-950 to-black h-[100vh] flex justify-center items-center pr-6":"hidden"}>
        <div class="container">
          <div class="h1Container">
            <div class="cube h1 w1 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w1 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w1 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w2 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w2 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w2 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w3 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w3 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h1 w3 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>
          </div>

          <div class="h2Container">
            <div class="cube h2 w1 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w1 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w1 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w2 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w2 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w2 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w3 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w3 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h2 w3 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>
          </div>

          <div class="h3Container">
            <div class="cube h3 w1 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w1 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w1 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w2 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w2 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w2 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w3 l1">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w3 l2">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>

            <div class="cube h3 w3 l3">
              <div class="face top"></div>
              <div class="face left"></div>
              <div class="face right"></div>
            </div>
          </div>
        </div>
      </div>
      {details && (
        <div className={loading ? "hidden" : ""}>
          <Split
            className="split mt-16 bg-gradient-to-b from-stone-900 from- via-stone-950 to-black"
            minSize={0}
          >
            <ProblemDescription details={details} />
            <Split
              className="split-vertical"
              direction="vertical"
              sizes={[45, 60]}
              gutterSize={15}
             >
              <CodeEditor
                code={code}
                onChange={onChange}
                language={language}
                onLanguageChange={onLanguageChange}
                testid={"demo"}
              />
              <TestCases
                handleSubmit={handleSubmit}
                handleRun={handleRun}
                testCases={testCases}
                setTestCases={setTestCases}
                processing={processing}
                runResults={runResults}
              />
            </Split>
          </Split>
          <RunResultModal
            show={showRunModal}
            onClose={handleCloseRunModal}
            runResults={runResults}
          />
          <SubmitResultModal
            show={showSubmitModal}
            onClose={handleCloseSubmitModal}
            submitResults={submitResults}
          />
        </div>
      )}
    </div>
  );
};

export default Demo;
