'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import Link from "next/link"
import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import React from 'react'
import { IoStarSharp } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../store/slices/favoriteSlice";
import { toggleWatchlist } from "../../store/slices/watchlistSlice";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkAdd } from "react-icons/md";


function CardDataComponent({ data, title, type, genre = [] }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite.items);
  const watchlist = useSelector((state) => state.watchlist.items);
  const [isSession, setIsSession] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const session = localStorage.getItem('tmdb_session') || sessionStorage.getItem('tmdb_session');
    if (session) setIsSession(true);
  }, []);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(
      (el, index, self) =>
        el?.poster_path && index === self.findIndex(item => item.id === el.id)
    );
  }, [data]);

  return (
    <>
      {filteredData.length > 0 && (
        <section>
          <div className="container m-auto">
            {title && <h2 className="text-3xl text-center py-30">{title}</h2>}
            <Swiper
              slidesPerView={screenWidth > 885 ? 5 : screenWidth > 430 ? 3 : 1}
              pagination={{ clickable: true }}
              className="mySwiper"
            >
              {filteredData.map((el) => {
                const isFav = favorites.some((item) => item.id === el.id);
                const isInWatchlist = watchlist.some((item) => item.id === el.id);

                return (
                  <SwiperSlide className={`${screenWidth > 885 ? 'w-[20%]' : screenWidth > 430 ? 'w-[33.33%]' : 'w-[33.33%] px-20'} `} key={el.id}>
                    <div className="w-full p-5 cursor-pointer flex justify-center items-center">
                      <div className={`w-full card rounded-2xl overflow-hidden hover:scale-105 transition-all ${screenWidth > 430 ? 'h-[300px]' : 'h-[300px]'} relative`}>
                        <Link href={`/details/${type || el.media_type}/${el.id}`}>
                          <ImageWithSkeleton
                            src={`https://image.tmdb.org/t/p/w1280${el.poster_path}`}
                            alt={el.title || el.name || ''}
                          />

                        <div className='size-full opacity-0 card-details absolute top-0 left-0'>
                          <div className='w-full h-[20%] text-xs p-5 flex justify-start items-center'>
                            <div className="flex gap-1 items-center">
                              <IoStarSharp className='text-amber-300' size={15} />
                              <span className='text-xs'>{el.vote_average}</span>
                            </div>
                          </div>
                          <div className='w-full flex-col h-[80%] flex justify-center items-center'>
                            <h1 className='p-5 text-center'>{el.title || el.name}</h1>
                            <div className='flex items-center text-[10px]'>
                              {genre
                                .filter(g => el.genre_ids.includes(g.id)).slice(0, 2)
                                .map(g => (
                                  <span key={g.id} className='px-1'>{g.name}</span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </Link>


                        {isSession && (
                          <div className='backdrop-opacity-100 pt-4 absolute flex flex-col justify-center items-center gap-2 top-0 right-[5px] z-[999999]'>
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
                                onClick={() => dispatch(toggleFavorite({ ...el, type: type || el.media_type }))}
                              >
                                <FaHeart size={15} color={isFav ? 'red' : 'white'} />
                              </button>

                              <button 
                                className='p-1 cursor-pointer'
                                onClick={() => dispatch(toggleWatchlist({ ...el, type: type || el.media_type }))}
                              >
                                <MdBookmarkAdd className={isInWatchlist ? 'text-amber-300' : 'text-white'} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </section>
      )}
    </>
  )
}

function ImageWithSkeleton({ src, alt }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full relative">
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoadingComplete={() => setLoading(false)}
      />
      {loading && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl" />}
    </div>
  );
}

const CardData = React.memo(CardDataComponent);
export default CardData;
