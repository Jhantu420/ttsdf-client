import React from "react";
import { ArrowRight } from "lucide-react";
import HeaderStudent from "../assets/headerStudent.png";
import RecentHighLight from "./RecentHighLight";
import DirectorMsg from "./DirectorMsg";
import AffiliatedLogo from "./AffiliatedLogo";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/apply-course");
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 p-5 lg:p-10 m-5 lg:m-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src={HeaderStudent}
            alt="Header Student"
            className="rounded-md w-full"
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1>Hii</h1>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            RYIT initiative by TTSDF - FOUNDATION
          </p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Find Your Course <br /> & Strengthen Your Knowledge
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
            "Your journey to mastering technology starts here. Empower yourself
            with the skills of tomorrow, today. <br /> Learn, grow, and innovate
            with expert guidance every step of the way."
          </p>
          <button
            onClick={handleClick}
            className="flex items-center justify-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition-all shadow-xl text-lg mx-auto lg:mx-0 cursor-pointer"
          >
            Enroll Now
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
      <div className="p-6 md:p-12 bg-gray-100">
        <h3 className="text-3xl md:text-4xl text-center font-extrabold mb-26 md:mb-30">
          Our Recent Activity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-x-6 gap-y-24 px-4 sm:px-6">
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/hp5JdmB_pnk"
              title="YouTube video player"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/UVpn0f2_90g"
              title="YouTube video player"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      {/* Additional Components */}
      <RecentHighLight />
      <DirectorMsg />
      <AffiliatedLogo />
    </>
  );
};

export default Header;
