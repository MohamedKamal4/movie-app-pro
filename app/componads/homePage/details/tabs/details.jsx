'use client'

import { useEffect, useState } from "react";
import { FaPlay, FaStar } from "react-icons/fa";
import { HiMiniPause } from "react-icons/hi2";

export default function Details({ video, play, setPlay, item, genre, type }) {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 👉 بناء لينك الفيديو
  const videoUrl = (autoplay = false) =>
    `https://www.youtube.com/embed/${video?.key}?${autoplay ? "autoplay=1" : ""}${!autoplay ? "&mute=1" : ""}`;

  return (
    <>
      {screenWidth > 430 ? 
        <>
          {video && screenWidth > 885 && (
            <div
              className={`absolute bg-amber-50 left-0 h-[4000px] transition-all w-screen ${play ? "" : "opacity-0"}`}
              style={{ zIndex: 3105, top: -680 }}
            >
              <div className="w-full aspect-video" style={{ scale: 1.5 }}>
                <iframe
                  width="100%"
                  height="2000px"
                  src={videoUrl(play)}
                  title={video.name || "Trailer"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="w-full h-full flex flex-col relative" style={{ zIndex: 3110 }}>
            <div className="w-full h-[90%] flex p-10">
              {/* النصوص */}
              <div className="w-full h-full">
                <div className={`h-[50%] px-10 border-s-2 border-amber-300 w-[100%] `}>
                  <div className="flex h-[10%] items-center text-xs">
                    <span className="flex items-center gap-1 pe-5 border-e-2 border-white">
                      {type.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 px-5 border-e-2 border-white">
                      <FaStar className="text-amber-300" /> {item.vote_average}
                    </span>
                    <span className="ps-5">{item.release_date}</span>
                  </div>
                  <h1 className={`text-8xl h-[90%] flex items-center font-bold`}>{item.title || item.original_name}</h1>
                </div>

                <div className="w-full flex h-[25%]">
                  <div className="w-[20%] h-full border-t-2 border-e-2 border-amber-300" />
                  <div className="w-[30%] h-full flex flex-col justify-center gap-5 ps-10">
                    <p className={`text-[10px] `}>{item.overview?.slice(0, 400)}</p>
                    {item.genre_ids?.length > 0 && (
                      <span className={`text-[10px] py-2 mt-2 w-fit border-t-2 border-white`}>
                        {item.genre_ids.map((id) => genre.find((g) => g.id === id)?.name).filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                </div>
                {/* الفيديو + الزرار */}
                {video &&
                  <div className="flex w-full h-[25%]">
                  <div className="w-[20%] h-full" />
                  <div className="w-[30%] h-full border-e-2 border-t-2 border-amber-300"/>
                  <div className="w-[50%] h-full">
                    {video && (
                      <div className="w-[100%] relative h-full ps-10 flex justify-start items-center">

                        {screenWidth > 885 ? (
                          <div className="relative flex gap-5">
                            <button
                              className="w-[50px] h-[50px] z-[9000] flex justify-center items-center bg-amber-300"
                              onClick={() => setPlay(!play)}
                            >
                              {play ? <HiMiniPause size={20} /> : <FaPlay size={20} />}
                            </button>
                            <div className="flex font-bold flex-col">
                              {play ? 
                                  <span>STOP</span>
                                  :
                                  <span>PLAY</span>
                              }
                              <span>TRAILER</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="aspect-video w-[100%] h-[80%]">
                              <iframe
                                width="100%"
                                height="100%"
                                src={videoUrl(play)}
                                title={video.name || "Trailer"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                }
              </div>
            </div>
            {play && <div className="ripple"></div>}
          </div>
        </>
      :
        <>
          {video && screenWidth > 885 && (
            <div
              className={`absolute bg-amber-50 left-0 h-[4000px] transition-all w-screen ${play ? "" : "opacity-0"}`}
              style={{ zIndex: 3105, top: -680 }}
            >
              <div className="w-full aspect-video" style={{ scale: 1.5 }}>
                <iframe
                  width="100%"
                  height="2000px"
                  src={videoUrl(play)}
                  title={video.name || "Trailer"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="w-full h-full flex flex-col relative" style={{ zIndex: 3110 }}>
            <div className="w-full h-[90%] flex p-5">
              {/* النصوص */}
              <div className="w-full ps-5 border-s-2 border-amber-300 h-full">
                <div className={`h-[40%] w-full`}>
                  <div className="flex h-[10%] items-center text-xs">
                    <span className="pe-5 border-e-2 border-white">
                      {type.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 px-5 border-e-2 border-white">
                      <FaStar className="text-amber-300" /> {item.vote_average}
                    </span>
                    <span className="ps-5">{item.release_date}</span>
                  </div>
                  <h1 className={`text-5xl h-[90%] flex items-center font-bold`}>{item.title || item.original_name}</h1>
                </div>

                <div className="w-full flex py-5 h-[30%]">
                  <div className="w-[100%] h-full flex flex-col justify-between">
                    <p className={`text-xs`}>{item.overview?.slice(0, 181)}</p>
                    {item.genre_ids?.length > 0 && (
                      <span className={`text-xs py-2 mt-2 w-fit border-t-2 border-white`}>
                        {item.genre_ids.map((id) => genre.find((g) => g.id === id)?.name).filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* الفيديو + الزرار */}
                {video &&
                  <div className="flex w-full h-[30%] ">
                    <div className="w-full h-full">
                      {video && (
                        <div className="w-[100%] relative h-full flex justify-start items-end">

                          {screenWidth > 885 ? (
                            <div className="relative flex gap-5">
                              <button
                                className="w-[50px] h-[50px] z-[9000] flex justify-center items-center"
                                onClick={() => setPlay(!play)}
                              >
                                {play ? <HiMiniPause size={20} /> : <FaPlay size={20} />}
                              </button>
                              <div className="flex font-bold flex-col">
                                {play ? 
                                    <span>STOP</span>
                                    :
                                    <span>PLAY</span>
                                }
                                <span>TRAILER</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="aspect-video w-[100%] h-[100%]">
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={videoUrl(play)}
                                  title={video.name || "Trailer"}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                }
              </div>
            </div>
            {play && <div className="ripple"></div>}
          </div>
        </>
      } 
    </>
  );
}
