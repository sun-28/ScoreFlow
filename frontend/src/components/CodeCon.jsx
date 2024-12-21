import React, { useState, useEffect } from "react";

const sampleCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to ScoreFlow!" << endl;
    cout << "Optimizing your code assessments!" << endl;
    return 0;
}
`;

function CodeCon() {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < sampleCode.length) {
      const timeout = setTimeout(() => {
        setText((prevText) => prevText + sampleCode[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const highlightCode = (code) => {
    return code.split(/(\s+|<.*?>|".*?")/).map((part, index) => {
      if (/^\s*$/.test(part)) {
        return <span key={index}>{part}</span>;
      }
      if (/\b(namespace|int)\b/.test(part)) {
        return (
          <span key={index} className="text-blue-400">
            {part}
          </span>
        );
      }
      if (/\b(#include|using|return)\b/.test(part)) {
        return (
          <span key={index} className="text-purple-400">
            {part}
          </span>
        );
      }
      if (/(#include)/.test(part)) {
        return (
          <span key={index} className="text-purple-300">
            {part}
          </span>
        );
      }
      if (/^".*"$/.test(part)) {
        return (
          <span key={index} className="text-orange-300">
            {part}
          </span>
        );
      }
      if (/\bstd\b/.test(part)) {
        return (
          <span key={index} className="text-green-300">
            {part}
          </span>
        );
      }
      if (/^[(){}]$/.test(part)) {
        return (
          <span key={index} className="text-yellow-300">
            {part}
          </span>
        );
      }
      if (
        /\bmain\b/.test(part) ||
        /\bendl\b/.test(part) ||
        /<<|>>/.test(part)
      ) {
        return (
          <span key={index} className="text-yellow-100">
            {part}
          </span>
        );
      }
      if (/\bcout\b/.test(part)) {
        return (
          <span key={index} className="text-blue-300">
            {part}
          </span>
        );
      }
      if (/^<.*>$/.test(part)) {
        return (
          <span key={index} className="text-orange-300">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const highlightedCode = highlightCode(text);

  return (
    <div className="rounded-lg bg-stone-800 p-4 shadow-lg overflow-hidden bg-opacity-90">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-stone-400">welcome.cpp</div>
      </div>
      <pre className="language-cpp overflow-x-auto">
        <code className="text-sm sm:text-base">{highlightedCode}</code>
      </pre>
    </div>
  );
}

export default CodeCon;
