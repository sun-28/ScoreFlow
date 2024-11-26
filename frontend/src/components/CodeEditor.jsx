import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../util/axiosInstance";

const CodeEditor = ({ code, onChange, language, onLanguageChange, testid }) => {
  const defaultCode = {
    javascript: `// JavaScript Code Here\n\n// Write your code here`,
    cpp: `// C++ Code Here\n#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your code here\n  return 0;\n}`,
    python: `# Python Code Here\n\n# Write your code here\n\nif __name__ == "__main__":\n    pass`,
    java: `// Java Code Here\npublic class Main {\n  public static void main(String[] args) {\n    // Write your code here\n  }\n}`,
  };

  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [previousContent, setPreviousContent] = useState("");

  const fetchTimeRemaining = async () => {
    try {
      const response = await axiosInstance.get(`/test/remainingTime/${testid}`);
      setTimeRemaining(response.data.timeRemaining);
    } catch (err) {
      console.error("Error fetching time remaining:", err);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${hours > 0 ? `${hours}:` : ""}${pad(minutes)}:${pad(seconds)}`;
  };

  useEffect(() => {
    fetchTimeRemaining();
  }, [testid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(prevTime - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  useEffect(() => {
    onChange(defaultCode[language] || "");
  }, [language]);

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    setPreviousContent(editor.getValue());

    editor.onKeyDown((e) => {
      if (e.code === "KeyV" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard
          .readText()
          .then((clipboardText) => {
            const currentContent = editor.getValue();

            if (currentContent.includes(clipboardText)) {
              const selection = editor.getSelection();
              editor.executeEdits("paste", [
                {
                  range: selection,
                  text: clipboardText,
                  forceMoveMarkers: true,
                },
              ]);
            } else {
              alert("Pasting from external sources is not allowed!");
            }
          })
          .catch((err) => {
            alert("Pasting from external sources is not allowed!");
          });
      }
    });
  };

  const handleEditorChange = (value) => {
    setPreviousContent(value);
    onChange(value);
  };

  const handleLanguageChange = (event) => {
    onLanguageChange(event.target.value);
  };

  return (
    <div className="editor-container">
      <div className="code-editor-heading p-1 flex items-center justify-between mb-1">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-1 border border-gray-800 rounded-md bg-gray-100 shadow-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <div className="flex gap-1">
          <div className="w-24 flex gap-2 items-center p-1 border border-gray-800 rounded-md bg-gray-100 shadow-s">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {timeRemaining > 0 ? formatTime(timeRemaining) : "Time's up!"}
          </div>
          <Link
            to={`/test/${testid}`}
            className="p-1 border border-gray-800 rounded-md bg-gray-100 shadow-sm hover:bg-slate-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
        </div>
      </div>
      <Editor
        width={`100%`}
        height={`86%`}
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
