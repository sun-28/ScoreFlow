import { motion } from "framer-motion";
import { FlaskConical, LaptopMinimal } from "lucide-react";
import CodeCon from "../components/CodeCon";
import Features from "../components/Features";
function HomeCon() {
  return (
    <div className="mx-auto px-10 py-8 sm:py-12 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.h1
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Code The Challenge,</span>
            <motion.span
              className="text-green-500 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Conquer The Test
            </motion.span>
          </motion.h1>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-stone-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Test your skills with confidence on our cheat-proof platform.
            Assess, improve, and prove your coding abilities, securely and
            efficiently.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <LaptopMinimal className="mr-2 h-5 w-5" />
              Get Started
            </a>
            <a
              href="/demo"
              className="inline-flex ml-5 items-center justify-center rounded-md bg-stone-700 bg-opacity-90 px-5 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <FlaskConical className="mr-2 h-5 w-5" />
              Demo
            </a>
          </motion.div>
        </div>
        <div className="mt-8 lg:mt-0">
          <CodeCon />
        </div>
      </div>
      <Features />
    </div>
  );
}

export default HomeCon;
