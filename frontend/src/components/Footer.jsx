import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="text-sm md:text-md  md:fixed bottom-0 left-0 right-0 z-50 bg-black md:bg-stone-900 text-stone-400 md:bg-opacity-85 backdrop-blur-sm md:px-8 py-2">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 ">
            <p className="text-md">
              &copy; 2024 ScoreFlow. All rights reserved.
            </p>
          </div>
          <div className="mt-0 flex justify-center items-center">
            <p className="text-md flex flex-col md:flex-row gap-3 justify-center items-center md:gap-8">
              <p>Developed by </p>

              <div className="flex md:flex-col justify-center items-center gap-2">
                <a
                  href="https://sun28.xyz"
                  className="font-semibold  text-green-500 w-28 md:w-auto"
                >
                  Sunpreet Singh
                </a>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/sun-28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/sun28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=sunpahwa28@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Mail</span>
                  </a>
                </div>
              </div>
              <div className="flex md:flex-col justify-center items-center gap-2">
                <a
                  href="https://samarpreet.me"
                  className="font-semibold  text-green-500 w-28 md:w-auto"
                >
                  Samarpeet Singh
                </a>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/samar-28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/samar28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=sampahwa28@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Mail</span>
                  </a>
                </div>
              </div>
              <div className="flex md:flex-col justify-center items-center gap-2">
                <a
                  href="https://sun28.xyz"
                  className="font-semibold  text-green-500 w-28 md:w-auto"
                >
                  Krishna Deol
                </a>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/Krishnadeol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/krishna-deol-449873251/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=dps.krishnadeol.12a@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Mail</span>
                  </a>
                </div>
              </div>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
