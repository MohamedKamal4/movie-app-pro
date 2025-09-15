'use client';
import { useEffect, useState, useMemo } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel } from 'swiper/modules';
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import Loading from '../../../componads/loadingComponads';

export default function Pop() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [details, setDetails] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize()
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',

    }
  };

  useEffect(() => {
    setMounted(true);
    AOS.init({ duration: 1000, once: true });

    const controller = new AbortController();
    fetch('https://api.themoviedb.org/3/person/popular?language=en-US', { ...options, signal: controller.signal })
      .then(res => res.json())
      .then(res => { setData(res.results); setItem(res.results[0]); })
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!item) return;
    const controller = new AbortController();
    fetch(`https://api.themoviedb.org/3/person/${item.id}?language=en-US`, { ...options, signal: controller.signal })
      .then(res => res.json())
      .then(res => setDetails(res))
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [item]);

  const slides = useMemo(() => data.map((person, idx) => (
    <SwiperSlide className='h-[33.33%] p-2' key={person.id}>
      <div className={`w-[100px] h-full overflow-hidden flex items-center justify-center rounded-xl ${activeIndex === idx ?  screenWidth > 430 ? 'scale-150 shadow-lg' : 'scale-105 shadow-lg' : 'scale-75 opacity-70'} transition-transform duration-300 relative z-[1000]`}>
        {!imgLoaded[person.id] && <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-xl"></div>}
        <Image
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={person.name}
          fill
          loading={idx === 0 ? 'eager' : 'lazy'}
          onLoad={() => setImgLoaded(prev => ({ ...prev, [person.id]: true }))}
        />
      </div>
    </SwiperSlide>
  )), [data, activeIndex, imgLoaded]);

  const worksSlides = useMemo(() => item?.known_for?.map((el, idx) => (
    <>
      {screenWidth > 430 ? 
      <SwiperSlide className='h-[90%] p-5' key={el.id}>
        <div className={`h-full w-[100px] overflow-hidden flex items-center justify-center rounded-xl transition-transform duration-300 relative z-[1000]`}>
          {!imgLoaded[el.id] && <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-xl"></div>}
          <Link href={`/details/${el.media_type}/${el.id}`}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
              alt={el.title || el.name || ''}
              fill
              loading={idx === 0 ? 'eager' : 'lazy'}
              onLoad={() => setImgLoaded(prev => ({ ...prev, [el.id]: true }))}
              />
            </Link>
        </div>
      </SwiperSlide>
      :
      <SwiperSlide className='size-full' key={el.id}>
          <div className={`size-full flex items-center justify-center transition-transform duration-300 z-[1000]`}>
            <div className='overflow-hidden rounded-xl relative w-[30%] h-[90%]'>
              {!imgLoaded[el.id] && <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-xl"></div>}
              <Link href={`/details/${el.media_type}/${el.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
                alt={el.title || el.name || ''}
                fill
                loading={idx === 0 ? 'eager' : 'lazy'}
                onLoad={() => setImgLoaded(prev => ({ ...prev, [el.id]: true }))}
                />
              </Link>
            </div>
          </div>
      </SwiperSlide>
      }
    </>
    
  )), [item , imgLoaded]);

  if (!mounted || !item) return <Loading /> ;
  

  return (
    <section className='w-screen'>
      <div className='relative h-[550px] container pop p-10 overflow-hidden rounded-2xl my-25 m-auto flex flex-col'>
        <div className='flex gap-10 size-full'>
          <div className='h-full w-[30%]'>
            <div className='flex h-[10%] pb-10 w-full justify-start gap-5 items-center'>
              <div data-aos='fade-right' className='border-e-2 z-20 flex items-center pe-5 border-white'>
                <h2 className={`${screenWidth > 430 ? 'text-xl' : 'text-[10px]'} font-semibold`}>Super Star</h2>
              </div>
              <p data-aos='fade-right' data-aos-delay='500' className={`${screenWidth > 430 ? 'text-[10px]' : 'text-[8px]'}`}>Popular</p>
            </div>
            <div className='w-[100%] h-[90%] mx-auto'>
              <Swiper direction='vertical' slidesPerView={3} centeredSlides modules={[Mousewheel]} mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                onSlideChange={swiper => { setActiveIndex(swiper.activeIndex); setItem(data[swiper.activeIndex]); }} className='h-full'>
                {slides}
              </Swiper>
            </div>
          </div>
          
          <div 
          data-aos="fade-left" key={activeIndex}
          className='w-[70%] flex flex-col gap-5 h-full'>
            {item && (
              <div className={`w-[100%] ${screenWidth > 430 ? 'h-[50%] flex' : 'h-[70%] flex-col gap-10'} `}>
                <div className={`${screenWidth > 430 ? 'h-full w-[50%]' : 'w-full h-[50%] text-xs'} space-y-2`}>
                  <h2>Name : {details.name}</h2>
                  <p>Gender : {details.gender === 1 ? 'Female' : 'Male'}</p>
                  {details.birthday && <p>Birthday : {details.birthday}</p>}
                  <p>Known For Department : {details.known_for_department}</p>
                  <p>Popularity : {details.popularity}</p>
                  {details.place_of_birth && <p>Place Of Birth : {details.place_of_birth}</p>}
                </div>
                <div className={`${screenWidth > 430 ? 'h-full w-[50%]' : 'w-full h-[50%]'}`}>
                  {details.biography && (
                   <>
                     <h2 className={`${screenWidth > 430 ? 'pb-10' : 'text-xs py-2'}`}>
                        Biography
                      </h2>
                      <p className={`${screenWidth > 430 ? 'text-xs' : 'text-[10px]'}`}>
                        {details.biography.slice(0, 400)}
                        {details.biography.length > 400 && <button className=' text-amber-300 ms-1 cursor-pointer' onClick={() => setExpanded(true)}>... show more</button>}
                      </p>
                   </>
                  )}
                </div>
              </div>
            )}
            <div className={`w-[100%] ${screenWidth > 430 ? 'h-[50%]' : 'h-[30%]'} flex flex-col justify-between items-center `}>
              <div className='w-full h-[20%]'>
                <h2 className={`${screenWidth > 430 ? 'text-2xl' : 'text-xs'} font-bold text-white`}>Prominent Works</h2>
              </div>
              <Swiper slidesPerView={screenWidth > 430 ? 3 : 1} className='h-[80%] works'>
                {worksSlides}
              </Swiper>
            </div>
          </div>
          
        </div>

        {details.biography && (
          <div className={`w-screen h-screen pt-20 scrollbar-hide overflow-y-auto p-10 z-50 fixed transition-all top-0 ${expanded ? 'left-0' : 'left-[-100%]'}`} style={{ backgroundColor: 'oklch(0 0 0 / 0.72)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
            <button onClick={() => setExpanded(false)} className='text-white cursor-pointer w-full flex pb-10 justify-end'>
              <IoCloseOutline size={28} />
            </button>
            <p className={`${screenWidth > 430 ? 'text-2xl' : 'text-xs'}`}>{details.biography}</p>
          </div>
        )}
      </div>
    </section>
  );
}
