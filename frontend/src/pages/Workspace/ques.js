export const ques = [
  {
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
    ],
  },
  {
    id: "2",
    title: "Find Maximum in Array",
    difficulty: "Medium",
    category: "Array",
    order: 2,
    description:
      "Write a function to find the maximum element in an array of integers.",
    examples: [
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "5",
        explanation: "The maximum element in the array is 5.",
      },
      {
        input: "4\n-10 -5 -3 -1",
        expectedOutput: "-1",
        explanation: "The maximum element in the array is -1.",
      },
    ],
    constraints: [
      "The array size will not exceed 1000.",
      "Elements in the array must be between -10000 and 10000.",
    ],
  },
];
