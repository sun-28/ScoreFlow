import React from "react";
import Navbar2 from "../components/Navbar2";
import HomeCon from "../components/HomeCon";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar2 />
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 from- via-stone-950 to-black text-white pt-16">
        <HomeCon/>
      </main>
      <Footer/>
    </div>
  );
};

export default Home;
