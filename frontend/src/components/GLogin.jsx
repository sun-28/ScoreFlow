import React from "react";

const GLogin = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_SERVER_URL}/auth/google`;
  };

  return (
    <button
      className=" w-80 px-4 py-2 border flex justify-center items-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      onClick={handleLogin}
    >
      <img
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span className="text-2xl">Login with Google</span>
    </button>
  );
};

export default GLogin;
