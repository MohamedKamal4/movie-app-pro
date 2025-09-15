'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css'
import AOS from 'aos'
import { Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function Cast({ cast }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [castDetails, setCastDetails] = useState(null);
  const [works, setWorks] = useState([]);
   const [screenWidth, setScreenWidth] = useState(0);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  const options = useMemo(() => ({
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw'
    }
  }), []);

  const handleCastDetails = useCallback((id, character) => {
    setOpenProfile(true);

    fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, options)
      .then(res => res.json())
      .then(res => setCastDetails({ ...res, character }))
      .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
        setWorks(res.cast?.slice(0, 10) || []);
      })
      .catch(err => console.error(err));
  }, [options]);

  const uniqueCast = useMemo(() => {
    return cast.cast?.filter(
      (item, index, self) => index === self.findIndex(c => c.id === item.id)
    ) || [];
  }, [cast.cast]);

  function TruncatedText({ text, maxLength = 150 }) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const isLong = text.length > maxLength;
    const displayText = expanded ? text : text.slice(0, maxLength) + (isLong ? "..." : "");

    return (
      <p className="text-sm">
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

  return (
    <section className="mb-20">
      <div className="container m-auto">
        <div className="w-full py-20">
          <h1 className="text-3xl text-center">Cast</h1>
        </div>

        {uniqueCast.length > 0 ? (
          <div className="flex flex-col w-full">
            <div className={`flex w-full ${screenWidth > 430 ? '' : 'flex-col'}`}>
              <div className={`${openProfile ? screenWidth > 430 ? 'w-[60%]' : 'w-[100%]' : 'w-full'}`}>
                <div className="w-full h-[300px]">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      640: { slidesPerView: 2, spaceBetween: 20 },
                      768: { slidesPerView: 3, spaceBetween: 40 },
                      1024: { slidesPerView: 5, spaceBetween: 50 },
                    }}
                    className="mySwiper"
                  >
                    {uniqueCast.map(el =>
                      el.profile_path ? (
                        <SwiperSlide key={el.id}>
                          <div className="flex items-center justify-center size-full">
                            <div
                              onClick={() => handleCastDetails(el.id, el.character)}
                              className="w-[133px] h-[200px] relative overflow-hidden scale-when-hover cursor-pointer rounded-2xl"
                            >
                              <Image
                                src={`https://image.tmdb.org/t/p/w300${el.profile_path}`}
                                alt={el.name}
                                fill
                              />
                            </div>
                          </div>
                        </SwiperSlide>
                      ) : null
                    )}
                  </Swiper>
                </div>
              </div>
              {openProfile && castDetails && (
                <div key={castDetails.id} data-aos="fade-left" className={`${screenWidth > 430 ? 'w-[40%]' : 'w-[100%]'} px-5 overflow-hidden pt-13`}>
                  <div className="w-full relative mb-5 h-[180px] flex justify-center items-start">
                    <div data-aos="zoom-in" className="w-[133px] h-[200px] z-1">
                      <Image
                        src={castDetails.profile_path ? `https://image.tmdb.org/t/p/w300${castDetails.profile_path}` : "/placeholder.png"}
                        alt={castDetails.name}
                        width={133}
                        height={200}
                      />
                    </div>
                    <div className="w-[80%] h-full flex flex-col justify-between items-start ps-10">
                      <h3 className="text-sm text-white">Name: {castDetails.name}</h3>
                      <p className="text-xs text-white">Character: {castDetails.character}</p>
                      {castDetails.birthday && <p className="text-xs text-white">Birthday: {castDetails.birthday}</p>}
                      {castDetails.deathday && <p className="text-xs text-white">Deathday: {castDetails.deathday}</p>}
                      <p className="text-xs text-white">Gender: {castDetails.gender === 1 ? 'Female' : 'Male'}</p>
                      <p className="text-xs text-white">Department: {castDetails.known_for_department}</p>
                      {castDetails.place_of_birth && <p className="text-xs text-white">Place Of Birth: {castDetails.place_of_birth}</p>}
                      <p className="text-xs text-white">Popularity: {castDetails.popularity}</p>
                    </div>
                    <div className="absolute top-0 right-[-20px]">
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          setCastDetails(null);
                          setOpenProfile(false);
                        }}
                      >
                        <IoCloseOutline size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {openProfile && castDetails && (
              <div key={castDetails.id}className="w-[100%] flex flex-col px-5 overflow-hidden py-5">
                <div className="flex flex-col gap-5">
                  {castDetails.biography ? 
                    <h2>Biography</h2>
                      :
                    null
                  }
                  <p>{castDetails.biography}</p>
                </div>
              </div>
            )}

            {openProfile && works.length > 0 && (
            <div className="w-full relative rounded-2xl overflow-hidden">
              <h2 className="text-2xl px-5 absolute top-0 left-0 font-bold text-white py-5 z-[1000]">Prominent Works</h2>
              <Swiper
                speed={600}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {works.filter(el => el.backdrop_path || el.poster_path).map((el, index) => (
                  <SwiperSlide key={`${el.id || "work"}-${index}`}>
                    <div className="h-[600px] w-full flex bg-cover relative bg-center">
                      <Image 
                        src={`https://image.tmdb.org/t/p/w1280${el.backdrop_path || el.poster_path}`}
                        alt=""
                        fill
                      />
                      <div className="flex gap-3 p-5 absolute top-0 left-0 works-cover w-full h-full flex-col items-start justify-center bg-gradient-to-r from-black/70 to-transparent">
                        <h2 className="text-6xl font-semibold">{el.title || el.name}</h2>
                        <p className="text-xl text-start w-[300px] line-clamp-3">
                          {el.overview || "No description available."}
                        </p>
                        <Link
                          className="text-xs py-2 px-4 text-black rounded-xl bg-amber-300 hover:bg-amber-400 transition"
                          href={`/details/${el.media_type}/${el.id}`}
                        >
                          View more
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          <h2 className="w-full h-[300px] flex justify-center items-center text-white">No Data Found</h2>
        )}
      </div>
    </section>
  );
}
