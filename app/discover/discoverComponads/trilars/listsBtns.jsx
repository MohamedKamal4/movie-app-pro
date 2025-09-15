'use client'

import { useEffect, useState, useMemo } from "react";
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FaArrowRightLong } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from "swiper/modules";
import Loading from "../../../componads/loadingComponads";

export default function BtnsLists({ movieVideos = [], seriesVideos = [], title }) {
  const [clicked, setClicked] = useState('movieVideos');
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

  const datasets = useMemo(() => ({ movieVideos, seriesVideos }), [movieVideos, seriesVideos]);
  const currentData = datasets[clicked] || [];

  const trailers = useMemo(() => {
    return currentData
      .map(el => el.videos?.find(video => video?.type === 'Trailer' && video?.site === 'YouTube'))
      .filter(Boolean);
  }, [currentData]);

    if (!mounted ) return <Loading /> ;


  const btns = [
    { name: "Movies", value: "movieVideos" },
    { name: "Series", value: "seriesVideos" }
  ];

  return (
    <section>
      <div className="container m-auto py-30">
        <div className="w-full flex gap-5 justify-between items-center mb-6">
          <div className="flex justify-start items-center">
            <div
              data-aos='fade-right'
              className="border-e-2 flex items-center pe-2 me-2 border-white"
            >
              <h2 className={`${screenWidth > 430 ? 'text-xl' : 'text-[10px]'} font-semibold`}>{title}</h2>
            </div>
            <ul className="list-none flex gap-3">
              {btns.map((btn, index) => (
                <li key={btn.value} data-aos='fade-right' data-aos-delay={index * 500}>
                  <button
                    onClick={() => setClicked(btn.value)}
                    className={`${screenWidth > 430 ? 'px-5 ' : 'px-1 text-[10px]'} py-2 rounded-md relative cursor-pointer transition-all duration-200
                      ${clicked === btn.value ? "bg-amber-300 text-black" : "bg-transparent"}
                      ${index === 0 ? 'z-50' : 'z-40'}`}
                  >
                    {btn.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className={`flex gap-3 items-center ${screenWidth > 430 ? 'text-xs' : 'text-[10px]'}`}>SCROLL <FaArrowRightLong /></p>
        </div>

        <div className="py-10">
          {trailers.length ? (
            <Swiper
              slidesPerView={screenWidth > 885 ? 3 : screenWidth > 430 ? 2 : 1}
              spaceBetween={30}
              navigation
              modules={[Navigation]}
              className="mySwiper custom-swiper"
            >
              {trailers.map(trailer => (
                <SwiperSlide key={trailer.id}>
                  <div className="w-[400px] h-[200px] flex justify-center items-center">
                    <div className="w-[90%] h-[90%] rounded-2xl overflow-hidden aspect-video transition-all hover:scale-105">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1&showinfo=0&controls=1&autohide=1`}
                        title={trailer.name || 'Trailer'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-[400px] h-[200px] bg-gray-300 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
