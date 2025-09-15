'use client';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel } from 'swiper/modules';
import { useEffect, useState, useMemo } from 'react';
import { FaStar } from "react-icons/fa";
import Image from 'next/image';
import Loading from '../../loadingComponads';
import MainScreen from '../details/mainScreen';



export default function Hero({ data, genre }) {
  const [dataState, setDataState] = useState(data.trending);
  const [title, setTitle] = useState('Trending');
  const [type, setType] = useState('movie');
  const [item, setItem] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open , setOpen] = useState(false)
  const [text , setText] = useState('Details')
  const [openTwo , setOpenTwo] = useState(false)
  const [video , setVideo] = useState({})
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


 

  const btns = [
    { name: 'Trending', value: 'trending' },
    { name: 'Now Playing', value: 'nowPlaying' },
    { name: 'Popular', value: 'popular' },
    { name: 'Top Rated', value: 'topRated' },
    { name: 'Up Coming', value: 'upcoming' },
    { name: 'On The Air', value: 'onTheAir' },
    { name: 'Airing Today', value: 'airingToday' },
    { name: 'Popular Series', value: 'popularSeries' },
    { name: 'Top Rated Series', value: 'topRatedSeries' }
  ];

  const dataMap = {
    trending: { list: data.trending, title: 'Trending', type: 'movie' },
    nowPlaying: { list: data.nowPlaying, title: 'Now Playing', type: 'movie' },
    popular: { list: data.popular, title: 'Popular', type: 'movie' },
    topRated: { list: data.topRated, title: 'Top Rated', type: 'movie' },
    upcoming: { list: data.upcoming, title: 'Up Coming', type: 'movie' },
    onTheAir: { list: data.onTheAir, title: 'On The Air', type: 'tv' },
    airingToday: { list: data.airingToday, title: 'Airing Today', type: 'tv' },
    popularSeries: { list: data.popularSeries, title: 'Popular Series', type: 'tv' },
    topRatedSeries: { list: data.topRatedSeries, title: 'Top Rated Series', type: 'tv' },
  };

  const validData = useMemo(
    () => dataState.filter(el => el.backdrop_path || el.poster_path),
    [dataState]
  );

  useEffect(() => {
    if(open){
      setTimeout(() => {
        setOpenTwo(true)
      },1000)
    }
  },[open])

  const options = {
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
    },
    next: { revalidate: 3600 },
  };

  useEffect(() => {
    if(item){
      fetch(`https://api.themoviedb.org/3/${type}/${item.id}/videos?language=en-US` , options)
      .then((res) => res.json())
      .then((res) => {
        const trailer = Array.isArray(res?.results)
          ? res.results.filter(
              (video) =>
                video.type === "Trailer" &&
                video.site === "YouTube" &&
                video.name === "Official Trailer"
            )
          : [];

        setVideo(trailer[0]);
      })}
  },[type , item])

  function handleOpenDetails(){
    setOpenTwo(false)
    setText('Home')
    setTimeout(() => {
      setOpen(false)
      setTimeout(() => {
        setText('Details')
      },1100)
    },1000)
  }

  useEffect(() => {
    if (validData.length > 0) {
      setItem(validData[0]);
      setActiveIndex(0);
    }
  }, [validData]);

  useEffect(() => {
    setMounted(true);
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (item?.id) AOS.refresh();
  }, [item?.id]);


  const slides = useMemo(() =>
    validData.map((el, idx) => {
      return(
        <>
          {
            screenWidth > 430 ? 
              <SwiperSlide key={el.id}>
                  <div className={`w-[200px] h-[250px] p-5 ${activeIndex === idx ? 'scale-150 shadow-lg' : 'scale-75 opacity-70' }`}>
                    <div className={`size-full relative z-[1000] overflow-hidden flex items-center justify-center rounded-xl  transition-transform duration-300`}>
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${el.poster_path || el.backdrop_path}`}
                            fill
                            alt={el.title || el.name || el.original_name}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                  </div>
              </SwiperSlide>
              :
              <SwiperSlide key={el.id}>
                  <div className={`w-[200px] h-[200px] px-7 py-5 ${activeIndex === idx ? 'scale-150 shadow-lg' : 'scale-75 opacity-70' }`}>
                    <div className={`size-full relative z-[1000] overflow-hidden flex items-center justify-center rounded-xl  transition-transform duration-300`}>
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${el.poster_path || el.backdrop_path}`}
                            fill
                            alt={el.title || el.name || el.original_name}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                  </div>
              </SwiperSlide>
          }
        </>
      )
    })
  , [validData, activeIndex , screenWidth]);

  function handleData(value) {
    const selected = dataMap[value] || dataMap['trending'];
    setDataState(selected.list);
    setTitle(selected.title);
    setType(selected.type);
  }

  if (!mounted || !item) return <Loading />;


  return (
    <main>
      <div className="mainHead w-screen h-screen relative">
        <div className="size-full mainHead cover absolute top-0 left-0 z-20"></div>

        <div
          key={item.id}
          data-aos="fade-left"
          className={`${screenWidth > 430 ? 'w-[70%]' : 'w-[100%]'} z-10 absolute top-0 right-0 h-screen img`}
        >
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path || item.poster_path}`}
            width={1280}
            height={720}
            priority
            alt={item.title || item.original_name}
          />
        </div>

        <div className="container overflow-hidden flex justify-between items-end size-full relative m-auto z-50">
          <div className="size-full relative flex items-end">
            <div className={`w-[100%] ${screenWidth > 430 ? 'h-full' : 'h-[80%]' } flex`}>
                <div key={title} data-aos="fade-right" className={`${screenWidth > 430 ? 'w-[35%]' : 'w-[40%]'} h-[100%] mb-5 relative slide-card`}>
                    <Swiper
                        direction="vertical"
                        slidesPerView={3}
                        centeredSlides
                        modules={[Mousewheel]}
                        spaceBetween={200}
                        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                        onSlideChange={swiper => {
                        setActiveIndex(swiper.activeIndex);
                        setItem(validData[swiper.activeIndex]);
                        }}
                        className="size-full"
                    >
                        {slides}
                    </Swiper>
                </div>
                <div className={`${screenWidth > 430 ? 'w-[65%]' : 'w-[60%]'} flex flex-col justify-center items-start h-full`}>
                    <div data-aos='fade-right' key={item.id} className='w-full ps-5 ms-5 border-s-2 border-amber-300'>
                      <div className='flex items-center '>
                        <span className={`flex items-center pe-5 justify-start gap-1 ${screenWidth > 430 ? 'text-xs' : 'text-[8px]'}`}><FaStar className='text-amber-300' /> {item.vote_average}</span>
                      </div>
                        <h2 className={`${screenWidth > 885 ? 'text-6xl' : screenWidth > 430 ? 'text-5xl' : 'text-2xl'} py-5 font-bold flex-col w-[74%]`}>{item.name || item.title || item.original_name}</h2>
                        <div className='flex'>
                            {item.genre_ids?.length > 0 && (
                            <span className={`${screenWidth > 430 ? 'text-xs' : 'text-[8px]'}`}>
                                {item.genre_ids
                                .map(id => genre.find(g => g.id === id)?.name)
                                .filter(Boolean) 
                                .join(' • ')} 
                            </span>
                            )}

                        </div>
                    </div>
                </div>
            </div>

             <div className={`${screenWidth > 430 ? 'w-[20%]' : 'w-[40%]'} absolute top-0 right-0 flex pt-20 flex-col justify-between items-end h-[100%]`}>
                <div className=' flex h-[80%] pe-10 flex-col justify-start items-end'>
                    {btns.map((btn, index) => (
                        <button
                        key={index}
                        className={`cursor-pointer ${screenWidth > 430 ? ' text-xs' : ' text-[8px]'} ${
                            title === btn.name
                            ? 'transition-all border-0 outline-0 font-bold text-white'
                            : 'text-white opacity-70'
                        } py-1 `}
                        onClick={() => handleData(btn.value)}
                        >
                        {btn.name}
                        </button>
                    ))}
                </div>
                <div className='flex justify-end items-end py-5 w-full h-[20%]'>
                    <button onClick={() => {setOpen(true)}} className='px-5 py-2 cursor-pointer hover:opacity-70 transition-all text-white text-xs'>View Details</button>
                </div>
            </div>
          </div>
        </div>
      </div>      

      <MainScreen 
      text = {text}
      openTwo = {openTwo}
      video = {video}
      item = {item}
      type = {type}
      genre = {genre}
      open = {open}
      setText = {setText}
      setOpen = {setOpen}
      handleOpenDetails={handleOpenDetails}
      />
    </main>
  );
}
