'use client';
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
const Reviews = dynamic(() => import("../../detailsCompnads/reviews")) 
const Details = dynamic(() => import('./tabs/details')) 
const CastDetails = dynamic(() => import('./tabs/cast'))
const SimilarDetails = dynamic(() => import('./tabs/similar')) 
const ImagesDetails  = dynamic(() => import('./tabs/images')) 
const SeasonsDetails = dynamic(() => import('./tabs/seasons')) 
import { Suspense } from "react";
import Loading from "../../loadingComponads";

export default function MainScreen({ 
  text, 
  openTwo, 
  video,
  item, 
  type, 
  genre, 
  open, 
  setText, 
  handleOpenDetails,
}) {
  const [play, setPlay] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [data, setData] = useState({
    cast: [],
    similar: [],
    reviews: [],
    images: [],
  });

  const API_URL = "https://api.themoviedb.org/3";
  const options = useMemo(() => ({
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
    },
    next: { revalidate: 3600 },
  }), []);

  useEffect(() => {
    if (!item?.id) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const endpoints = [
          `${API_URL}/${type}/${item.id}/credits?language=en-US`,
          `${API_URL}/${type}/${item.id}/similar?language=en-US`,
          `${API_URL}/${type}/${item.id}/reviews?language=en-US&page=1`,
          `${API_URL}/${type}/${item.id}/images`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) => fetch(url, { ...options, signal: controller.signal }))
        );

        const [credits, similar, reviews, images] = await Promise.all(
          responses.map((res) => res.json())
        );

        setData({
          cast: credits.cast || [],
          similar: similar.results || [],
          reviews: reviews.results || [],
          images: images.backdrops || [],
        });

      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [item?.id, type, options]);

  return (
    <div
      className={`fixed flex justify-center items-center intro ${open ? 'bottom-0 z-[3000]' : 'bottom-[-200%] z-0'} transition-all left-0 bg-black h-screen w-screen`}
    >
      <h2>{text}</h2>
      <div
        className={`fixed overflow-hidden flex justify-center items-center intro-details intro ${openTwo ? 'bottom-0' : 'bottom-[-100%]'} transition-all left-0 size-full`}
        style={{
          zIndex: 3100,
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${item?.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {text === 'Details' && (
          <Suspense fallback={<Loading />}> 
            <Details video={video} play={play} setPlay={setPlay} item={item} genre={genre} type={type} />
          </Suspense>
        )}

        {text === 'Cast' &&
        <Suspense fallback={<Loading />}> 
          <CastDetails cast={data.cast} />
        </Suspense>
        }
        {text === 'Similar' &&
        <Suspense fallback={<Loading />}> 
          <SimilarDetails similar={data.similar} type={type} genre={genre} />
        </Suspense>
        }
        
        {text === 'Reviews' && (
          <div className='size-full overflow-auto relative bg-black/60 backdrop-blur-sm pt-20' style={{ zIndex: 3200 }}>
            <Suspense fallback={<Loading />}> 
              <Reviews reviews={data.reviews} state="no title" />
            </Suspense>
          </div>
        )}

        {text === 'Images' &&
        <Suspense fallback={<Loading />}> 
          <ImagesDetails images={data.images} />
        </Suspense>
        }
        {text === 'Sessons' && 
        <Suspense fallback={<Loading />}> 
          <SeasonsDetails item={item} type={type} />
        </Suspense>
        }

        {/* التابز */}
        <div className={`w-full h-[10%] ${screenWidth > 430 ? 'px-20' : ''} flex justify-between items-center absolute bottom-0 left-0 z-[5000]`}>
          <ul className='flex justify-between w-[80%] px-3'>
            {['Details', 'Cast', 'Similar', ...(type === 'tv' ? ['Sessons'] : []), 'Reviews', 'Images'].map(tab => (
              <li
                key={tab}
                className={`cursor-pointer transition-all ${text === tab ? screenWidth > 430 ? 'text-sm' : 'text-[10px]' : screenWidth > 430 ? 'text-xs opacity-70' : 'text-[8px] opacity-70'}`}
                onClick={() => setText(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              handleOpenDetails();
              setPlay(false);
            }}
            className={`${screenWidth > 430 ? 'text-sm' : 'text-[8px]'} flex justify-center items-center w-[20%] opacity-70 hover:opacity-100 transition-all cursor-pointer`}
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
}
