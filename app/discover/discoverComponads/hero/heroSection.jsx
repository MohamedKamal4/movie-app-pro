'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FaRegEye, FaStar } from "react-icons/fa";
import Link from "next/link";
import Loading from "../../../componads/loadingComponads";

export default function DiscovrSection({ movies , genre , series }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [imgLoaded, setImgLoaded] = useState({});
  const [mounted, setMounted] = useState(false);
  const [type , setType] = useState('movie')
  const [data , setData] = useState(movies)
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
    if (data.length > 0) {
      setItem(data[0]);
    }
  }, [data]);

  useEffect(() => {
    if (mounted) AOS.refresh();
  }, [item, mounted]);


  const slides = useMemo(() => {
    return data.map((person, idx) => (
      <SwiperSlide key={person.id}>
        <div className="size-full flex justify-center items-center">
          <div
            className={`
              w-[100%] ${screenWidth > 885 ? 'h-[90%]' : screenWidth > 430 ? 'h-[70%]' : 'h-[60%]' } overflow-hidden flex items-center justify-center rounded-xl
              ${activeIndex === idx ? "scale-105 shadow-lg" : "scale-75 opacity-70"}
              transition-transform duration-300
            `}
            style={{ position: "relative", zIndex: 1000 }}
          >
            {!imgLoaded[person.id] && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-xl"></div>
            )}
            <Image
              src={`https://image.tmdb.org/t/p/w500${person.poster_path}`}
              alt={person.title || person.name}
              loading={idx === 0 ? "eager" : "lazy"}
              fill
              onLoad={() =>
                setImgLoaded(prev => ({ ...prev, [person.id]: true }))
              }
            />
          </div>
        </div>
      </SwiperSlide>
    ));
  }, [data, activeIndex, imgLoaded]);

  if (!item) return <Loading />;

  function handleTap(tap){
    if(tap === 'movies'){
      setData(movies)
      setType('movie')
    }else{
      setData(series)
      setType('tv')
    }
  }

  const poster = item.backdrop_path || item.poster_path || "/fallback.jpg";
  return (
    <main>
      <div 
      className='mainHead w-screen h-screen relative' >
        <div className='size-full mainHead cover absolute top-0 left-0 z-20'></div>
        <div className="w-[70%] z-10 absolute top-0 right-0 h-screen img">
          {mounted && (
            <Image
            key={activeIndex}
              data-aos='fade-left'
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/w1280${poster}`}
              fill
              priority
              alt={item.title || item.original_name}
            />
          )}
        </div>

        <div className='container relative overflow-hidden flex flex-col justify-between items-start size-full m-auto z-50'>
          <div className='p-5 w-[100%] mt-20 h-[50%] gap-3 details'>
            {mounted && (
              <div key={activeIndex} data-aos='fade-right' className="size-full flex flex-col gap-2 justify-center items-start">
                <div className="w-full mb-5 flex justify-between items-center">
                  <h1 className={`w-[70%] ${screenWidth > 430 ? 'text-4xl' : 'text-3xl'} flex flex-wrap text-start`}>
                    {item.title || item.original_name || item.original_title}
                  </h1>
                  <div className="flex flex-col justify-center px-5 ms-5 border-s-2 border-amber-300 items-end gap-5 ">
                    <button onClick={() => {
                      handleTap('movies')
                    }} className={`cursor-pointer transition-all ${type === 'movie' ? 'text-2xl' : 'text-sm opacity-70'}`}>Movie</button>
                    <button onClick={() => {
                      handleTap('series')
                    }} className={`cursor-pointer transition-all ${type === 'tv' ? 'text-2xl' : 'text-sm opacity-70'}`}>Series</button>
                  </div>
                </div>
                <div className={`flex flex-wrap gap-2 ${screenWidth > 430 ? 'text-xs' : 'text-[10px]'}`}>
                  <span className='text-amber-300'>TRENDING</span> •
                  <span>{item.first_air_date || item.release_date}</span> •
                  <span>{item.original_language}</span>
                    {genre
                    .filter(g => item.genre_ids.includes(g.id))
                    .map(g => (
                      <span key={g.id}> • {g.name} </span>
                    ))}
                </div>
                <p className={`text-[10px] ${screenWidth > 430 ? 'w-[50%]' : 'w-[100%]'}`}>{item.overview}</p>
                <div className='flex gap-3'>
                  <span className='py-2 px-4 flex gap-2 items-center text-xs rounded-xl bg-amber-300 text-black'>
                    {item.popularity} <FaRegEye />
                  </span>
                  <span className='py-2 px-4 flex gap-2 items-center text-xs rounded-xl bg-amber-300 text-black'>
                    {item.vote_average} <FaStar />
                  </span>
                  <Link
                    prefetch={true}
                    className='text-xs py-2 px-4 rounded-xl border border-amber-300'
                    href={`/details/${type}/${item.id}`}
                  >
                    view more
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div data-aos='fade-up' className='w-[100%] h-[50%] relative slide-card'>
            <Swiper
              slidesPerView={screenWidth > 885 ? 6 : 3}
              spaceBetween={30}
              centeredSlides
              modules={[Mousewheel]}
              mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
                setItem(data[swiper.activeIndex]);
              }}
              className="h-full "
            >
              {slides}
            </Swiper>

          </div>
        </div>
      </div>
    </main>
  )
}
