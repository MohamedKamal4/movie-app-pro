'use client'

import { useEffect, useState } from "react";
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FaArrowRightLong } from "react-icons/fa6";
import CardData from "../../../componads/card/cardData";
import Loading from "../../../componads/loadingComponads";

export default function BtnsLists({ movieReco, seriesReco, title, genre }) {
  const [clicked, setClicked] = useState("movieReco");
  const [mounted, setMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize()
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMounted(true);
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (mounted) AOS.refresh();
  }, [clicked, mounted]);

    if (!mounted) return <Loading /> ;


  const currentData = clicked === "movieReco" ? movieReco : seriesReco;

  const btns = [
    { name: "Movies", value: "movieReco" },
    { name: "Series", value: "seriesReco" },
  ];


  return (
    <section>
      <div className="container m-auto py-30">
        <div className="w-full flex gap-5 justify-between items-center mb-6">
          <div className="flex justify-start items-center">
            <div
              data-aos="fade-right"
              className="border-e-2 flex items-center pe-2 me-2 border-white"
            >
              <h2 className={` ${screenWidth > 430 ? 'text-xl' : 'text-[10px]'} font-semibold`}>{title}</h2>
            </div>
            <ul className="list-none flex gap-3">
              {btns.map((btn, index) => (
                <li
                  key={btn.value}
                  data-aos="fade-right"
                  data-aos-delay={index * 500}
                >
                  <button
                    onClick={() => setClicked(btn.value)}
                    className={`${screenWidth > 430 ? 'px-5' : 'px-1 text-[10px]'} py-2 rounded-md relative cursor-pointer transition-all duration-200 
                      ${clicked === btn.value ? "bg-amber-300 text-black" : "bg-transparent"} 
                      ${index === 0 ? "z-50" : "z-40"}`}
                  >
                    {btn.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className={`flex gap-3 items-center ${screenWidth > 430 ? 'text-xs' : 'text-[10px]'}`}>
            SCROLL <FaArrowRightLong />
          </p>
        </div>

        <CardData genre={genre} data={currentData} type="" />
      </div>
    </section>
  );
}
