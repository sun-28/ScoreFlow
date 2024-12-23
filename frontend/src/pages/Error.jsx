import { Unplug } from "lucide-react";
import React from "react";

const Error = () => {
  return (
    <div className="bg-gradient-to-b from-stone-900 from- via-stone-950 to-black h-[100vh] flex flex-col gap-4 justify-center items-center">
      <Unplug className=" size-40 text-red-500" />
      <h1 className="text-3xl font-bold text-white">
        "Uh oh, something broke... probably not your fault!" 😅{" "}
      </h1>
    </div>
  );
};

export default Error;
