import React from "react";
import { useParams } from "react-router-dom";

const TestReview = () => {
  const { testid } = useParams();
  return <div>Test Review: {testid}</div>;
};

export default TestReview;
