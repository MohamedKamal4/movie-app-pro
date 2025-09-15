'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'aos/dist/aos.css';
import AOS from 'aos';

export default function CastDetails({ cast }){
    const [person, setPerson] = useState(null);
    const [activePersonIndex, setActivePersonIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
    if (cast.length > 0 && activePersonIndex < cast.length) {
      setPerson(cast[activePersonIndex]);
    }
    }, [cast, activePersonIndex]);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [person]);

    return(
        <div className='size-full relative bg-black/60 backdrop-blur-sm' style={{ zIndex: 3200 }}>
            <div className='h-full flex items-center w-full container m-auto'>
              <div className='h-full w-1/2'>
                <Swiper
                  direction="vertical"
                  slidesPerView={3}
                  spaceBetween={150}
                  centeredSlides
                  modules={[Mousewheel]}
                  mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                  onSlideChange={swiper => {
                    setActivePersonIndex(swiper.activeIndex);
                    setPerson(cast[swiper.activeIndex]);
                  }}
                  className="h-full"
                >
                  {cast.filter(el => el.profile_path).map((el, idx) => (
                    <SwiperSlide key={el.id}>
                      <div
                        className={`h-[200px] w-[150px] relative p-5 overflow-hidden flex items-center justify-center rounded-xl transition-transform duration-300 
                          ${activePersonIndex === idx ? screenWidth > 430 ? 'scale-150 shadow-lg' : 'scale-110 shadow-lg' : 'scale-75 opacity-70'}`}
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/w1280${el.profile_path}`}
                          alt={el.name}
                          fill
                          loading={idx === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {person && (
                <div
                key={activePersonIndex}
                data-aos='fade-right'
                className={`w-1/2 border-s-2 border-amber-300 overflow-hidden ${screenWidth > 430 ? 'text-2xl p-10' : 'text-xs p-5'} flex flex-col gap-5`}>
                  <h1>Name : {person.name}</h1>
                  <p>Character : {person.character}</p>
                  <p>Known For Department : {person.known_for_department}</p>
                  <p>Popularity : {person.popularity}</p>
                </div>
              )}
            </div>
          </div>
    )
}