'use client'
import { FaArrowRightLong } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Parallax, Pagination  } from 'swiper/modules';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Collection({collection}){
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <>
            {collection && Object.keys(collection).length > 0 ? (
                    <section>
                        <div className="mt-30" >
                            <div className='container h-[600px] m-auto'>
                                <div 
                                    className="flex size-full flex-col p-5" 
                                >
                                    <div className="w-[100%] flex justify-between items-center h-[20%]">
                                        <div>
                                            <span className="text-xs text-amber-300">Belongs To Collection</span>
                                            <h2 className="text-5xl">{collection.name}</h2>
                                        </div>
                                        <p className="flex gap-3 items-center">SCROLL  <FaArrowRightLong /></p>
                                    </div>
                                    <div className="h-[60%]">
                                        <Swiper
                                            style={{
                                            '--swiper-navigation-color': '#fff',
                                            '--swiper-pagination-color': '#fff',
                                            }}
                                            speed={600}
                                            parallax={true}
                                            pagination={{
                                            clickable: true,
                                            }}
                                            modules={[Parallax, Pagination]}
                                            className="mySwiper"
                                        >
                                            <div
                                            slot="container-start"
                                            className="parallax-bg"
                                            style={{
                                                'background':
                                                'url(https://swiperjs.com/demos/images/nature-1.jpg)',
                                            }}
                                            data-swiper-parallax="-23%"
                                            ></div>
                                            {collection.parts.map((el) => {
                                                return (
                                                    <SwiperSlide key={el.id} className="flex justify-between flex-row" >
                                                        <div className="size-full flex p-3">
                                                            <div className={`text flex gap-3 p-3 ${screenWidth > 430 ? 'w-[50%] text-xs' : 'w-[100%] text-[10px]'} bg-black flex-col items-start justify-center`}>
                                                                <h2 className="text-2xl text-start font-bold">{el.title}</h2>
                                                                <p className="text-start">{el.overview}</p>
                                                                <Link className='py-2 px-4 text-black rounded-xl bg-amber-300' href={`/details/${el.media_type}/${el.id}`}>view more</Link>
                                                            </div>
                                                            <div className="w-[50%] h-[100%] img relative" style={{ background: `url(https://image.tmdb.org/t/p/w1280${el.backdrop_path || el.poster_path})`,backgroundRepeat: 'no-repeat' , backgroundSize: 'cover', backgroundPosition: 'center' }}>

                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </div>
                                    <div className="w-[100%] flex justify-end h-[20%] text-sm">
                                        <p className={`${screenWidth > 430 ? 'w-[50%]' : 'w-[100%]'}`}>{collection.overview}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null
                }
        </>
    )
}