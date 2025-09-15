'use client'
import { FaArrowRightLong } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Parallax, Pagination  } from 'swiper/modules';
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

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
                            <div className='container h-[1000px] m-auto'>
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
                                                        <div className="size-full relative flex p-3">
                                                            <div className={`text-collections absolute top-0 left-0 z-[2000] flex gap-3 p-3 size-full ${screenWidth > 430 ? 'text-xs' : 'text-[10px]'} flex-col items-start justify-center`}>
                                                                <h2 className="text-2xl z-[2500] text-start font-bold">{el.title}</h2>
                                                                <p className="text-start w-[70%] z-[2500]">{el.overview}</p>
                                                                <Link className='py-2 px-4 z-[2500] text-black rounded-xl bg-amber-300' href={`/details/${el.media_type}/${el.id}`}>view more</Link>
                                                            </div>
                                                            <Image 
                                                                src={`https://image.tmdb.org/t/p/w1280${el.backdrop_path || el.poster_path}`}
                                                                alt=""
                                                                fill
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </div>
                                    <div className="w-[100%] flex justify-end pt-10 h-[20%] text-sm">
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