'use client'

import { FaRegEye, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../store/slices/favoriteSlice";
import { toggleWatchlist } from "../../store/slices/watchlistSlice";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkAdd } from "react-icons/md";

export default function HeroDetails({ data, type }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite.items);
  const watchlist = useSelector((state) => state.watchlist.items);
  const [screenWidth, setScreenWidth] = useState(0);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const [isSession, setIsSession] = useState(false);
  useEffect(() => {
    const session = localStorage.getItem('tmdb_session') || sessionStorage.getItem('tmdb_session');
    if (session) setIsSession(true);
  }, []);
  useEffect(() => {
    setMounted(true);
    AOS.init();
  }, []);
  
  function TruncatedText({ text, maxLength = 150 }) {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;

    const isLong = text.length > maxLength;
    const displayText = expanded ? text : text.slice(0, maxLength) + (isLong ? "..." : "");

    return (
      <p className={`text-sm ${screenWidth > 430 ? 'text-start w-[50%]' : 'text-center w-full'}`}>
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-300 ml-1 cursor-pointer"
          >
            {expanded ? "Show less" : "more"}
          </button>
        )}
      </p>
    );
  }

  const isFav = favorites.some((item) => item.id === data.id);
  const isInWatchlist = watchlist.some((item) => item.id === data.id);


  return (
    <>
      {data && (
        <main className="w-screen h-screen">
          <div className="head w-screen h-screen">
            {mounted && (
              <Swiper pagination={{ clickable: true }} modules={[Pagination]} className="mySwiper">
                <SwiperSlide key={data.id} className="item">
                  <div className="size-full relative">
                    <div className="size-full cover absolute top-0 left-0 z-20"></div>

                    <div
                      {...(mounted ? { "data-aos": "fade-left", "data-aos-duration": "1000" } : {})}
                      className="w-[70%] z-10 absolute top-0 right-0 h-screen img"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path || data.poster_path}`}
                        alt={data.title || data.original_name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>

                    <div
                      {...(mounted ? { "data-aos": "fade-up", "data-aos-duration": "1000" } : {})}
                      className="container flex items-end size-full relative m-auto z-30"
                    >
                      <div className={`w-[100%] gap-3 h-[100%] flex flex-col justify-center ${screenWidth > 430 ? 'items-start ps-10' : 'items-center'}`}>
                        <h1 className={`font-bold ${screenWidth > 430 ? 'text-9xl text-start' : 'text-4xl w-[90%] flex flex-wrap justify-center'}`}>
                          {data.title || data.original_name || data.original_title}
                        </h1>
                        <div className="flex justify-center flex-wrap gap-2 text-xs">
                          <span>{type}</span> •
                          <span>{data.first_air_date || data.release_date}</span> •
                          <span>{data.original_language}</span>
                          {data.runtime || data.episode_run_time?.[0] ? (
                            <span>{data.runtime || data.episode_run_time?.[0]} min</span>
                          ) : null}
                          {data.genres?.map((g) => (
                            <span key={g.id}>• {g.name}</span>
                          ))}
                        </div>
                        <TruncatedText text={data.overview} maxLength={500} />

                        <div className="flex gap-3">
                          <span className="py-2 px-4 flex gap-2 items-center text-xs rounded-xl bg-amber-300 text-black">
                            {data.popularity} <FaRegEye />
                          </span>
                          <span className="py-2 px-4 flex gap-2 items-center text-xs rounded-xl bg-amber-300 text-black">
                            {data.vote_average} <FaStar />
                          </span>
                          {isSession && (
                            <div className='backdrop-opacity-100 flex justify-center items-center gap-2'>
                              <div 
                                className="flex gap-2 p-1 justify-center items-center rounded-2xl"
                                style={{
                                  backgroundColor: '#0000009e',
                                  backdropFilter: 'blur(5px)',
                                  WebkitBackdropFilter: 'blur(5px)'
                                }}
                              >
                                <button 
                                  className='p-1 cursor-pointer'
                                  onClick={() => dispatch(toggleFavorite({ ...data, type: type || data.media_type }))}
                                >
                                  <FaHeart size={15} color={isFav ? 'red' : 'white'} />
                                </button>
  
                                <button 
                                  className='p-1 cursor-pointer'
                                  onClick={() => dispatch(toggleWatchlist({ ...data, type: type || data.media_type }))}
                                >
                                  <MdBookmarkAdd className={isInWatchlist ? 'text-amber-300' : 'text-white'} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            )}
          </div>
        </main>
      )}
    </>
  );
}
