import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Zap,
  Globe,
  Lock,
  Clipboard,
  ScanText,
  Eye,
  EyeOff,
  History,
  AppWindow,
} from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "Plagiarism Detection",
    description: "Advanced algorithms to detect and prevent code plagiarism.",
  },
  {
    icon: Clipboard,
    title: "Strict Integrity Checks",
    description:
      "No external copy-paste, ensuring authentic problem-solving skills.",
  },
  {
    icon: AppWindow,
    title: "Focused Environment",
    description:
      "No tab switching, keeping candidates focused on the task at hand.",
  },
  {
    icon: Code,
    title: "Multi-Language Support",
    description: "Submissions in C, C++, Java, Python, JavaScript and more.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Run your code instantly any number of times!",
  },
  {
    icon: EyeOff,
    title: "Hidden Test Cases",
    description: "Hidden test cases to prevent pre-emptive optimization.",
  },
  {
    icon: Eye,
    title: "Sample Test Cases",
    description: "Test your solution with sample cases before submitting.",
  },
  {
    icon: History,
    title: "Score History",
    description:
      "Track and review your performance over time with score history.",
  },
];

function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-10">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className="bg-stone-800 p-6 rounded-lg shadow-lg relative overflow-hidden bg-opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <feature.icon className="text-green-500 w-8 h-8 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-stone-400">{feature.description}</p>
          <motion.div
            className="absolute inset-0 bg-green-500 opacity-0"
            animate={{ opacity: hoveredIndex === index ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default Features;
