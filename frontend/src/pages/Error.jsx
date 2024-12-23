import { Unplug } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Error = () => {
  return (
    <div className="bg-gradient-to-b from-stone-900 from- via-stone-950 to-black h-[100vh] flex flex-col gap-4 justify-center items-center">
      <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      >
      <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
      <Unplug className=" size-40 text-red-500" />
      </motion.div>
      </motion.div>
      <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
      >
      <h1 className="text-3xl font-bold text-white text-center">
        "Uh oh, something broke... probably not your fault!" 😅{" "}
      </h1>
      </motion.div>
    </div>
  );
};

export default Error;
