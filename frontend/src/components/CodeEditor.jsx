import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001");

// Sample code templates
const sampleCode = {
  javascript: `// JavaScript sample code
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));`,
  cpp: `// C++ sample code
#include <iostream>
using namespace std;

int add(int a, int b) {
  return a + b;
}

int main() {
  cout << add(2, 3) << endl;
  return 0;
}`,
  python: `# Python sample code
def add(a, b):
    return a + b

print(add(2, 3))`,
  java: `// Java sample code
public class Main {
  public static int add(int a, int b) {
    return a + b;
  }

  public static void main(String[] args) {
    System.out.println(add(2, 3));
  }
}`
};

const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode.javascript);
  const [language, setLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "" },
  ]);
  const [socketId, setSocketId] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("test-case-result", (data) => {
      setResults((prevResults) => [...prevResults, data]);
    });

    socket.on("job-completed", () => {
      console.log("All test cases completed");
    });

    socket.on("job-failed", (error) => {
      console.error("Job failed:", error);
    });

    return () => {
      socket.off("test-case-result");
      socket.off("job-completed");
      socket.off("job-failed");
    };
  }, []);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(sampleCode[selectedLanguage]);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/submit", {
        code,
        language,
        testCases,
        socketId,
      });
      console.log(response.data);
      setResults([]);
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <div className="flex flex-grow">
        {/* Left side: Code Editor */}
        <div className="flex flex-col w-2/3 pr-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Code Editor</h2>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="p-2 border border-gray-300 rounded-md bg-white shadow-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          <Editor
            width="100%"
            height="600px"
            language={language}
            theme="vs-dark"
            value={code}
            options={editorOptions}
            onChange={(newValue) => setCode(newValue)}
            className="border rounded-lg shadow-md"
          />
        </div>

        {/* Right side: Test cases and results */}
        <div className="flex flex-col w-1/3 pl-4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex-grow">
            <h3 className="font-semibold text-lg mb-2">Test Cases</h3>
            <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                >
                  <textarea
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) =>
                      handleTestCaseChange(index, "input", e.target.value)
                    }
                    className="w-full h-24 p-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    placeholder="Expected Output"
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      handleTestCaseChange(
                        index,
                        "expectedOutput",
                        e.target.value
                      )
                    }
                    className="w-full h-24 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTestCase}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Test Case
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Run Test Cases
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Results</h3>
            <ul className="list-disc pl-5">
              {results.map((result, index) => (
                <li key={index} className="mb-2">
                  <div className="font-semibold">
                    Test Case {result.testCase}
                  </div>
                  <div>
                    <strong>Input:</strong> {result.input}
                  </div>
                  <div>
                    <strong>Expected Output:</strong> {result.expectedOutput}
                  </div>
                  <div>
                    <strong>Actual Output:</strong> {result.actualOutput}
                  </div>
                  <div
                    className={`mt-1 ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </div>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
