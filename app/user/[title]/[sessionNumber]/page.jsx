'use client'

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeFavorite } from "../../../store/slices/favoriteSlice";
import { removeFromWatchlist } from "../../../store/slices/watchlistSlice";
import Image from "next/image"

export default function UserContent() {
  const { title } = useParams()
  const dispatch = useDispatch()
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  const favorites = useSelector((state) => state.favorite.items)
  const watchlist = useSelector((state) => state.watchlist.items)

  const data = useMemo(() => {
    return title === "favorite" ? favorites : watchlist
  }, [title, favorites, watchlist])

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  function handleRemove(id){
    if(title === 'favorite'){
      dispatch(removeFavorite(id))
    }else{
      dispatch(removeFromWatchlist(id))
    }
  }

  function ImageWithSkeleton({ src, alt }) {
    const [loading, setLoading] = useState(true)
    return (
      <div className="w-full h-full relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl" />
        )}
        <Image
          src={src}
          alt={alt}
          width={300}
          height={450}
          loading="lazy"
          className={`transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
        />
      </div>
    )
  }

  console.log(data)

  return (
    <section>
      <div className="container py-20 m-auto">
        <div className="py-5 pt-10 w-fit">
          <h1 className="capitalize text-6xl pe-5 border-e-2 border-amber-300">
            {title}
          </h1>
        </div>

        <div className="mb-50 mt-20 flex flex-wrap justify-center">
          {data.length === 0 ? (
            <p className="text-gray-400 text-xl my-50">No items found in {title}</p>
          ) : (
            data.map((el) => {
              const elType = el.type || el.media_type || "movie"

              return (
                  <div key={el.id} className={`${screenWidth > 885 ? 'w-[20%]' : screenWidth > 430 ? 'w-[33.33%]' : 'w-[50%]'} p-5 cursor-pointer flex flex-col justify-center items-center`}>
                    <div className={`${screenWidth > 430 ? 'h-[300px]' : 'h-[250px]' } w-full card rounded-2xl overflow-hidden hover:scale-105 transition-all relative`}>
                      <Link href={`/details/${elType}/${el.id}`}>
                        <ImageWithSkeleton
                          src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
                          alt={el.title || el.name || ""}
                          fill
                        />
                      </Link>
                    </div>
                    <div className="w-full py-3 flex justify-center items-center">
                      <button onClick={() => {
                        handleRemove(el.id)
                      }} className="py-2 font-bold text-xs cursor-pointer w-[80%]">Remove</button>
                    </div>
                  </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
