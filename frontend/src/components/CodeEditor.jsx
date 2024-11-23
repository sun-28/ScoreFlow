import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ onChange, language, onLanguageChange }) => {
  const [value, setValue] = useState("");

  const defaultCode = {
    javascript: `// JavaScript Code Here\n\n// Write your code here`,
    cpp: `// C++ Code Here\n#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your code here\n  return 0;\n}`,
    python: `# Python Code Here\n\n# Write your code here\n\nif __name__ == "__main__":\n    pass`,
    java: `// Java Code Here\npublic class Main {\n  public static void main(String[] args) {\n    // Write your code here\n  }\n}`,
  };

  useEffect(() => {
    setValue(defaultCode[language] || "");
  }, [language]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  const handleLanguageChange = (event) => {
    onLanguageChange(event.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-md p-4">
      <div className="flex items-center border-b mb-2 pb-2">
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
        height={`100%`}
        language={language}
        value={value}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
