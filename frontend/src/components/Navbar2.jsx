import { Github } from "lucide-react";

const Navbar2 = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900 bg-opacity-90 backdrop-blur-sm px-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.png" className="h-10 w-10 text-green-500" />

            <span className="text-3xl font-bold text-white">ScoreFlow</span>
          </a>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="https://github.com/sun-28/scoreFlow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:bg-stone-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <Github size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
