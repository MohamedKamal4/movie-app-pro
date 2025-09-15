'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo, useCallback } from "react"
import { IoStarSharp } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../store/slices/favoriteSlice";
import { toggleWatchlist } from "../store/slices/watchlistSlice";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkAdd } from "react-icons/md";

export default function Content({ movieReco, seriesReco }) {
  const [data, setData] = useState(movieReco)
  const [type, setType] = useState("movie") 
  const [collection, setCollection] = useState(28)
  const [loading, setLoading] = useState(false)
  const [genreElement, setGenreElement] = useState({ movie: [], series: [] })
  const [genre, setGenre] = useState([])
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite.items);
  const watchlist = useSelector((state) => state.watchlist.items);
  const [isSession, setIsSession] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ تحقق من الـ localStorage بأمان
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem('tmdb_session') || sessionStorage.getItem('tmdb_session');
      if (session) setIsSession(true);
    }
  }, []);

  // ✅ options ثابتة (مفيش داعي تتغير كل render)
  const options = useMemo(() => ({
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw",
    },
    next: { revalidate: 3600 },
  }), [])

  // ✅ جلب الجانرز مرة واحدة
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options).then(r => r.json()),
          fetch("https://api.themoviedb.org/3/genre/tv/list?language=en", options).then(r => r.json()),
        ])
        setGenreElement({
          movie: moviesRes.genres || [],
          series: seriesRes.genres || [],
        })
        setGenre(moviesRes.genres || []) 
      } catch (err) {
        console.error(err)
      }
    }
    fetchGenres()
  }, [options])

  // ✅ فلترة البيانات باستخدام useMemo
  const filteredData = useMemo(() => {
    return Array.from(
      new Map(
        data
          .filter(el => el.genre_ids.includes(collection))
          .map(item => [item.id, item])
      ).values()
    )
  }, [data, collection])

  // ✅ switchType ثابت باستخدام useCallback
  const switchType = useCallback((newType) => {
    setType(newType)
    setData(newType === "movie" ? movieReco : seriesReco)
    setGenre(genreElement[newType])
    setCollection(28) 
  }, [movieReco, seriesReco, genreElement])

  return (
    <section>
      <div className="container m-auto pt-20">
        {/* Header Buttons */}
        <div className="flex flex-col py-5 w-full gap-5 sticky top-0 bg-black z-[1000]">
          <ul className="list-none gap-5 flex items-center">
            <li>
              <button
                onClick={() => switchType("movie")}
                className={`cursor-pointer hover:opacity-70 transition-all ${
                  type === "movie" ? "text-4xl" : "text-xs"
                }`}
              >
                Movies
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => switchType("series")}
                className={`cursor-pointer hover:opacity-70 transition-all ${
                  type === "series" ? "text-4xl" : "text-xs"
                }`}
              >
                Series
              </button>
            </li>
          </ul>

          {/* Genres */}
          <ul className="list-none gap-5 flex flex-wrap text-xs items-center w-[100%]">
            {genre.map((el) => (
              <li key={el.id}>
                <button
                  onClick={() => {
                    setCollection(el.id)
                    setLoading(true)
                    setTimeout(() => setLoading(false), 500) 
                  }}
                  className={`cursor-pointer hover:opacity-70 transition-all ${
                    collection === el.id
                      ? "text-sm px-5 py-2 rounded-2xl bg-amber-300 text-black"
                      : ""
                  }`}
                >
                  {el.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Section */}
        {!loading ? (
          <div className="flex justify-center flex-wrap mb-50 w-full">
            {filteredData.length === 0 ? (
              <p className="text-center w-full h-screen flex justify-center items-center text-xl text-gray-400">
                No items found for this category
              </p>
            ) : (
              filteredData.map((el) => {
                const isFav = favorites.some((item) => item.id === el.id);
                const isInWatchlist = watchlist.some((item) => item.id === el.id);
                if (!el.poster_path) return null
                return (
                  <div key={el.id} className={`${screenWidth > 885 ? 'w-[20%]' : screenWidth > 430 ? 'w-[33.33%]' : 'w-[60%]'} p-5`}>
                    <div className="w-full h-[300px] card hover:scale-105 transition-all relative rounded-2xl overflow-hidden">
                      <Link href={`/details/${el.media_type || type}/${el.id}`}>
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
                          fill
                          alt={el.title || el.name}
                          loading="lazy"
                        />
                        {/* Overlay Details */}
                        <div className="size-full opacity-0 card-details absolute top-0 left-0">
                          <div className="w-full h-[20%] text-xs p-5 flex justify-start items-center">
                            <div className="flex pe-2 me-1 border-e-2 border-white justify-start items-center gap-1">
                              <IoStarSharp className="text-amber-300" size={15} />
                              <span>{el.vote_average.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-center items-center text-xs">
                              {genre
                                .filter(g => el.genre_ids.includes(g.id))
                                .slice(0, 2)
                                .map(g => (
                                  <span key={g.id} className="px-1">
                                    {g.name}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="w-full h-[80%] flex justify-center items-center">
                            <h1 className="py-10 px-5 text-center">
                              {el.title || el.name}
                            </h1>
                          </div>
                        </div>
                      </Link>

                      {/* Favorite & Watchlist */}
                      {isSession && (
                        <div className='pt-4 absolute top-[0px] right-[5px] z-[50]'>
                          <div 
                            className="flex gap-2 p-1 flex-col justify-center items-center rounded-2xl"
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
                )
              })
            )}
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </section>
  )
}

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <span className="loader"></span>
    </div>
  )
}
