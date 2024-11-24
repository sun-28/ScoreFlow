import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideContent = () => {
  const location = useLocation();
  return (
    <div className="w-full flex justify-center flex-col items-center gap-8">
      <div className="text-gray-900 text-2xl">Dashboard</div>
      <div className="flex flex-col gap-8">
        <Link to="/tests" className="flex gap-5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9088 2C19.0528 2 21.1648 4.153 21.1648 7.357V16.553C21.1648 19.785 19.1178 21.887 15.9498 21.907L8.25676 21.91C5.11276 21.91 2.99976 19.757 2.99976 16.553V7.357C2.99976 4.124 5.04676 2.023 8.21476 2.004L15.9078 2H15.9088ZM15.9088 3.5L8.21976 3.504C5.89176 3.518 4.49976 4.958 4.49976 7.357V16.553C4.49976 18.968 5.90476 20.41 8.25576 20.41L15.9448 20.407C18.2728 20.393 19.6648 18.951 19.6648 16.553V7.357C19.6648 4.942 18.2608 3.5 15.9088 3.5ZM15.7159 15.4737C16.1299 15.4737 16.4659 15.8097 16.4659 16.2237C16.4659 16.6377 16.1299 16.9737 15.7159 16.9737H8.49586C8.08186 16.9737 7.74586 16.6377 7.74586 16.2237C7.74586 15.8097 8.08186 15.4737 8.49586 15.4737H15.7159ZM15.7159 11.2872C16.1299 11.2872 16.4659 11.6232 16.4659 12.0372C16.4659 12.4512 16.1299 12.7872 15.7159 12.7872H8.49586C8.08186 12.7872 7.74586 12.4512 7.74586 12.0372C7.74586 11.6232 8.08186 11.2872 8.49586 11.2872H15.7159ZM11.2506 7.1104C11.6646 7.1104 12.0006 7.4464 12.0006 7.8604C12.0006 8.2744 11.6646 8.6104 11.2506 8.6104H8.49556C8.08156 8.6104 7.74556 8.2744 7.74556 7.8604C7.74556 7.4464 8.08156 7.1104 8.49556 7.1104H11.2506Z"
              fill={location.pathname == "/tests" ? "#3399F0" : "black"}
            />
          </svg>
          <h3
            className={
              location.pathname == "/tests" ? " text-sky-500 font-medium" : ""
            }
          >
            Show Tests
          </h3>
        </Link>
        <Link to="/questions" className="flex gap-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={location.pathname == "/questions" ? "#3399F0" : "black"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
          <h3
            className={
              location.pathname == "/questions" ? " text-sky-500 font-medium" : ""
            }
          >
            Show Questions
          </h3>
        </Link>
        <Link to="/ques/add" className="flex gap-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={location.pathname == "/ques/add" ? "#3399F0" : "black"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <h3
            className={
              location.pathname == "/ques/add"
                ? " text-sky-500 font-medium"
                : ""
            }
          >
            Add New Question
          </h3>
        </Link>
        <Link to="/test/add" className="flex gap-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={location.pathname == "/test/add" ? "#3399F0" : "black"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3
            className={
              location.pathname == "/test/add"
                ? " text-sky-500 font-medium"
                : ""
            }
          >
            Schedule New Test
          </h3>
        </Link>
        <Link to="/tests/review" className="flex gap-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={location.pathname == "/tests/review" ? "#3399F0" : "black"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>

          <h3
            className={
              location.pathname == "/tests/review"
                ? " text-sky-500 font-medium"
                : ""
            }
          >
            Review Tests
          </h3>
        </Link>
      </div>
    </div>
  );
};

export default SideContent;
