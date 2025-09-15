'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoStarSharp } from "react-icons/io5";

export default function SimilarDetails({ similar , type , genre }){
    const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <div className='size-full overflow-auto relative bg-black/60 backdrop-blur-sm pt-20' style={{ zIndex: 3200 }}>
            <div className="container m-auto flex flex-wrap justify-center ">
                {similar.map((item) => {
                if(!item.poster_path){
                    return null
                }

                return(
                    <div key={item.id} className={`${screenWidth > 885 ? 'w-[25%]' : screenWidth > 430 ? 'w-[33.33%]' : 'w-[70%]'} py-5 px-10`}>
                        <Link href={`/details/${type}/${item.id}`}>
                            <div className="w-full h-[300px] card rounded-2xl overflow-hidden relative">
                            <Image
                                src={`https://image.tmdb.org/t/p/w1280${item.poster_path}`}
                                alt={item.title || item.name}
                                fill
                            />
                                <div className='size-full opacity-0 card-details absolute top-0 left-0'>
                                    <div className='w-full h-[20%] text-xs p-5 flex justify-start items-center'>
                                    <div className="flex pe-2 me-1 border-e-2 border-white justify-start items-center gap-1">
                                        <IoStarSharp className='text-amber-300' size={15} />
                                        <span>{item.vote_average}</span>
                                    </div>
                                    <div className='flex justify-center items-center text-xs'>
                                        {genre
                                        .filter(g => item.genre_ids.includes(g.id))
                                        .slice(0, 2)
                                        .map(g => (
                                            <span key={g.id} className='px-1'>{g.name}</span>
                                        ))
                                        }
                                    </div>
                                    </div>
                                    <div className='w-full h-[80%] flex justify-center items-center'>
                                    <h1 className='py-10 px-5 text-center'>{item.title || item.name}</h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
                })}
            </div>
        </div>
    )
}