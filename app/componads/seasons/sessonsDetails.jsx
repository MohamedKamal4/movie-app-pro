'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

export default function SessonsDetails({ data , openDetails , seasonDetails , setOPenDetails}) {
  const [item, setItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  handleResize()
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  useEffect(() => {
  if (seasonDetails?.episodes?.length > 0) {
      setItem(seasonDetails.episodes[0]);
  }
  }, [seasonDetails]);



  const uniqueEpisodes = seasonDetails.episodes?.filter(
    (ep, index, self) => index === self.findIndex(e => e.id === ep.id)
  );
  const uniqueGuestStars = item?.guest_stars?.filter(
    (ep, index, self) => index === self.findIndex(e => e.id === ep.id)
  );
  const uniqueCrew = item?.crew?.filter(
    (ep, index, self) => index === self.findIndex(e => e.id === ep.id)
  );

  console.log(data)

  return (
    <>
      {screenWidth > 430 ? 
        
        <div className={`w-screen overflow-auto h-screen fixed ${openDetails ? 'bottom-0' : 'bottom-[-100%]'} season-datails right-0 z-[10000]`}
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <div className="w-full" style={{ backgroundColor: '#0000009e', backdropFilter: 'blur(5px)' }}>
            <div className="container py-10 w-full m-auto relative z-[9000]">
              <div className="w-full flex gap-10 ">
                <div className="w-[25%]">
                  <div className="w-[100%] relative rounded-2xl overflow-hidden h-[300px]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`}
                      fill
                      sizes="250px"
                      alt=""
                    />
                  </div>
                </div>
                <div className="w-[75%] flex flex-col gap-5 justify-between items-start">
                  <h1 className="text-9xl font-bold text-amber-300">{seasonDetails.name}</h1>
                  <p className="text-xs max-h-[200px] overflow-hidden">{seasonDetails.overview || data.overview}</p>
                  <div className="w-full flex gap-10 text-xs">
                    <span>{seasonDetails.air_date}</span>
                    <span className="flex items-center gap-1">{seasonDetails.vote_average} <MdOutlineStar className="text-amber-300" /></span>
                  </div>
                </div>
              
              </div>

              <div className="w-full flex items-center flex-col">
                <div className="flex w-[25%] flex-col mb-20 justify-center items-center">
                  <span className="text-[200px]">{seasonDetails.episodes?.length}</span>
                  <h2 className="font-bold text-amber-300">Episodes</h2>
                </div>
                <div className="w-full flex">
                  <div className="w-[15%]"></div>
                  <div className="w-[35%] border-t-2 border-s-2 border-amber-300 relative h-[30px]">
                    <span className="absolute top-[-50px] right-[0] w-[2px] bg-amber-300 h-[50px]"></span>
                  </div>
                  <div className="w-[50%]"></div>
                </div>

                <div className="w-full flex mt-10 h-screen">
                  <div className="w-[30%] h-[100%] mb-5 relative slide-card">
                    <Swiper
                      direction="vertical"
                      slidesPerView={3}
                      spaceBetween={150}
                      centeredSlides
                      modules={[Mousewheel]}
                      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                      onSlideChange={swiper => {
                        setActiveIndex(swiper.activeIndex);
                        setItem(uniqueEpisodes?.[swiper.activeIndex]);
                      }}
                      className="h-full"
                    >
                      {uniqueEpisodes?.map((el, idx) => (
                        <SwiperSlide key={`${el.id}-${idx}`}>
                          <div
                            className={`h-[200px] relative w-[150px] overflow-hidden flex items-center justify-center rounded-xl 
                              ${activeIndex === idx ? 'scale-150 shadow-lg' : 'scale-75 opacity-70'} 
                              transition-transform duration-300`}
                            style={{ position: 'relative', zIndex: '1000' }}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${el.still_path || data.poster_path}`}
                              height={300}
                              width={1280}
                              alt=''
                              className="w-full h-full object-cover"
                              loading={idx === 0 ? 'eager' : 'lazy'}
                            />
                            <div className=" absolute top-[5px] right-[5px] bg-black py-1 rounded-2xl px-2 ">
                              <p className="text-[8px] capitalize">{el.episode_type}</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {item &&
                    <div className="w-[70%] ps-5 flex flex-col justify-center items-stat gap-2">
                      <h3 className="text-2xl text-amber-300">Episode {item.episode_number}</h3>
                      <h4 className="text-5xl font-bold">{item.name}</h4>
                      <p className="w-[90%] text-xs">{item.overview}</p>
                      <div className="flex gap-10 mb-5 text-xs">
                        <span>{item.runtime} Min</span>
                        <span className="flex items-center gap-1">{item.vote_average}  <MdOutlineStar className="text-amber-300" /></span>
                      </div>

                      {uniqueGuestStars.length > 0 &&
                          <div className="w-full">
                              <div className="w-full flex justify-between py-3">
                                  <h5 className="text-amber-300 font-bold text-2xl">Guest Stars</h5>
                                  { uniqueGuestStars.length > 6 &&
                                      <span className="flex gap-1 text-xs items-center">Scroll <FaArrowRight size={10} /></span>
                                  }
                              </div>
                              <div className="flex">
                                  <Swiper slidesPerView={4} spaceBetween={30} className="mySwiper">
                                  {uniqueGuestStars?.map((el, idx) => {
                                      if (!el.profile_path) return null
                                      return (
                                      <SwiperSlide key={`${el.id}-${idx}`}>
                                          <div className="bg-amber-100 m-auto w-[50px] h-[50px] relative p-5 rounded-full overflow-hidden">
                                          <Image
                                              src={`https://image.tmdb.org/t/p/w500${el.profile_path}`}
                                              fill
                                              sizes="50px"
                                              alt=""
                                          />
                                          </div>
                                          <div className="py-2">
                                          <h6 className="text-[10px] font-bold">{el.character}</h6>
                                          <p className="text-[10px]">{el.name}</p>
                                          </div>
                                      </SwiperSlide>
                                      )
                                  })}
                                  </Swiper>
                              </div>
                          </div>
                      }

                      {uniqueCrew.length > 0 && 
                          <div className="w-full">
                              <div className="w-full flex justify-between py-3">
                                  <h5 className="text-amber-300 font-bold text-2xl">Crew</h5>
                                  {uniqueCrew.length > 6 &&
                                      <span className="flex gap-1 text-xs items-center">Scroll <FaArrowRight size={10} /></span>
                                  }
                              </div>
                              <div className="flex">
                                  <Swiper slidesPerView={4} spaceBetween={30} className="mySwiper">
                                  {uniqueCrew?.map((el, idx) => {
                                      if (!el.profile_path) return null
                                      return (
                                      <SwiperSlide key={`${el.id}-${idx}`}>
                                          <div className="bg-amber-100 m-auto w-[50px] h-[50px] relative p-5 rounded-full overflow-hidden">
                                          <Image
                                              src={`https://image.tmdb.org/t/p/w500${el.profile_path}`}
                                              fill
                                              sizes="50px"
                                              alt=""
                                          />
                                          </div>
                                          <div className="py-2">
                                          <p className="text-[10px] font-bold">{el.name}</p>
                                          <h6 className="text-[10px]">{el.department}</h6>
                                          </div>
                                      </SwiperSlide>
                                      )
                                  })}
                                  </Swiper>
                              </div>
                          </div>
                      }
                      
                    </div>
                  }
                </div>
              </div>

              <div className=" absolute top-[20px] right-[0px]">
                <button onClick={() => { setOPenDetails(false) }}
                  className="text-xs cursor-pointer flex gap-1 items-center">Back <FaArrowRight size={10} /></button>
              </div>
            </div>
          </div>
        </div>
        :
        
        <div className={`w-screen overflow-auto h-screen fixed ${openDetails ? 'bottom-0 z-[10000]' : 'bottom-[-200%] z-0'} season-datails right-0`}
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <div className="w-full" style={{ backgroundColor: '#0000009e', backdropFilter: 'blur(5px)' }}>
            <div className="container pt-10 w-full m-auto relative z-[9000]">
              <div className="w-full flex flex-col gap-10 ">
                <div className="w-full flex justify-center items-center">
                  <div className="w-[60%] relative rounded-2xl overflow-hidden h-[300px]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`}
                      fill
                      sizes="70vw"
                      alt=""
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-5 justify-center items-center">
                  <h1 className="text-3xl font-bold text-amber-300">{seasonDetails.name}</h1>
                  <p className="text-sm text-center max-h-[200px] px-5 overflow-hidden">{seasonDetails.overview || data.overview}</p>
                  <div className="w-full flex justify-center items-center gap-10 text-xs">
                    <span>{seasonDetails.air_date}</span>
                    <span className="flex items-center gap-1">{seasonDetails.vote_average} <MdOutlineStar className="text-amber-300" /></span>
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center flex-col">
                <div className="flex w-[25%] flex-col mb-20 justify-center items-center">
                  <span className="text-[200px]">{seasonDetails.episodes?.length}</span>
                  <h2 className="font-bold text-amber-300">Episodes</h2>
                </div>
                <div className="w-full flex">
                  <div className="w-[15%]"></div>
                  <div className="w-[35%] relative h-[30px]">
                    <span className="absolute top-[-50px] right-[0] w-[2px] bg-amber-300 h-[50px]"></span>
                  </div>
                  <div className="w-[50%]"></div>
                </div>

                <div className="w-full flex h-[600px]">
                  <div className="size-full relative slide-card">
                    <Swiper
                      direction="vertical"
                      slidesPerView={1}
                      spaceBetween={100}
                      centeredSlides
                      modules={[Mousewheel]}
                      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                      onSlideChange={swiper => {
                        setActiveIndex(swiper.activeIndex);
                        setItem(uniqueEpisodes?.[swiper.activeIndex]);
                      }}
                      className="size-full"
                    >
                      {uniqueEpisodes?.map((el, idx) => (
                        <SwiperSlide className="p-5" key={`${el.id}-${idx}`}>
                          <div className="size-full flex flex-col">
                            <div className={`w-full h-[30%] relative overflow-hidden flex items-center justify-center rounded-xl`}>
                              <Image
                                src={`https://image.tmdb.org/t/p/w500${el.still_path || data.poster_path}`}
                                fill
                                alt=''
                                loading={idx === 0 ? 'eager' : 'lazy'}
                              />
                              <div className=" absolute top-[5px] right-[5px] bg-black p-1 rounded-2xl ">
                                <p className="text-[5px] p-0 capitalize">{el.episode_type}</p>
                              </div>
                            </div>
                            {item &&
                              <div className="w-[100%] h-[70%] pt-5 flex justify-center items-center flex-col gap-2">
                                <h3 className="w-[100%] text-xs text-amber-300">Episode {item.episode_number}</h3>
                                <h4 className="w-[100%] text-xl font-bold">{item.name}</h4>
                                <p className="w-[100%] text-xs">{item.overview}</p>
                                <div className="flex gap-10 mb-5 text-xs">
                                  <span>{item.runtime} Min</span>
                                  <span className="flex items-center gap-1">{item.vote_average}  <MdOutlineStar className="text-amber-300" /></span>
                                </div>

                                {uniqueGuestStars.length > 0 &&
                                    <div className="w-full">
                                        <div className="w-full flex justify-between pb-5">
                                            <h5 className="text-amber-300 font-bold text-xs">Guest Stars</h5>
                                            { uniqueGuestStars.length > 2 &&
                                                <span className="flex gap-1 pe-5 text-[10px] items-center">Scroll <FaArrowRight size={10} /></span>
                                            }
                                        </div>
                                        <div className="flex">
                                            <Swiper slidesPerView={2} spaceBetween={30} className="mySwiper">
                                            {uniqueGuestStars?.map((el, idx) => {
                                                if (!el.profile_path) return null
                                                return (
                                                <SwiperSlide key={`${el.id}-${idx}`}>
                                                    <div className="m-auto w-[25px] h-[25px] relative p-5 rounded-full overflow-hidden">
                                                      <Image
                                                          src={`https://image.tmdb.org/t/p/w500${el.profile_path}`}
                                                          fill
                                                          sizes="50px"
                                                          alt=""
                                                      />
                                                    </div>
                                                    <div className="ps-3">
                                                      <h6 className="text-[10px] text-start font-bold">{el.character}</h6>
                                                      <p className="text-[10px] text-start">{el.name}</p>
                                                    </div>
                                                </SwiperSlide>
                                                )
                                            })}
                                            </Swiper>
                                        </div>
                                    </div>
                                }

                                {uniqueCrew.length > 0 && 
                                    <div className="w-full">
                                        <div className="w-full flex justify-between pb-5">
                                            <h5 className="text-amber-300 font-bold text-xs">Crew</h5>
                                            {uniqueCrew.length > 2 &&
                                                <span className="flex gap-1 pe-5 text-[10px] items-center">Scroll <FaArrowRight size={10} /></span>
                                            }
                                        </div>
                                        <div className="flex">
                                            <Swiper slidesPerView={2} spaceBetween={30} className="mySwiper">
                                            {uniqueCrew?.map((el, idx) => {
                                                if (!el.profile_path) return null
                                                return (
                                                <SwiperSlide key={`${el.id}-${idx}`}>
                                                    <div className="bg-amber-100 m-auto w-[25px] h-[25px] relative p-5 rounded-full overflow-hidden">
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w500${el.profile_path}`}
                                                        fill
                                                        sizes="50px"
                                                        alt=""
                                                    />
                                                    </div>
                                                    <div className="ps-3">
                                                    <p className="text-[10px] text-start font-bold">{el.name}</p>
                                                    <h6 className="text-[10px] text-start">{el.department}</h6>
                                                    </div>
                                                </SwiperSlide>
                                                )
                                            })}
                                            </Swiper>
                                        </div>
                                    </div>
                                }
                                
                              </div>
                            }
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>

              <div className=" absolute top-[20px] right-[20px] ">
                <button onClick={() => { setOPenDetails(false) }}
                  className="text-xs cursor-pointer flex gap-1 items-center">Back <FaArrowRight size={10} /></button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
