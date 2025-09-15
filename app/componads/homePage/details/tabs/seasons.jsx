'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const SessonsDetails = dynamic(() => import("../../../seasons/sessonsDetails"));
import Image from "next/image";
import { Suspense } from "react";
import Loading from "../../../loadingComponads";

export default function SeasonsDetails({item , type}){
    const [seasons , setSeasons] = useState([])
    const [openDetails, setOPenDetails] = useState(false)
    const [seasonDetails, setSeasonDetails] = useState([])
    const [data , setData] = useState([])
    const [screenWidth, setScreenWidth] = useState(0);
    
    useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

    const SeasonsOptions = {
        headers: {
        accept: "application/json",
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
        },
        next: { revalidate: 3600 },
    };

    useEffect(() => {
        if(type === 'tv'){
            fetch(`https://api.themoviedb.org/3/tv/${item.id}?language=en-US`, SeasonsOptions)
            .then(res => res.json())
            .then(res => {
                setSeasons(res.seasons)
                setData(res)
            })
            .catch(err => console.error(err));
        }
    },[item])

    function GetData(el) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
            }
            };
            fetch(`https://api.themoviedb.org/3/tv/${item.id}/season/${el.season_number}?language=en-US`, options)
            .then(res => res.json())
            .then(res => {
                setSeasonDetails(res)
            })
            .catch(err => console.error(err));
    }
        
    return(
        <>
            <div className='size-full overflow-auto relative bg-black/60 backdrop-blur-sm pt-20' style={{ zIndex: 3200 }}>
                <div className="container m-auto w-full">
                    {seasons ?
                    <div className="flex flex-wrap w-full justify-center">
                        {seasons.map((sea, idx) => (
                        <div key={`${sea.id}-${idx}`} className={` ${screenWidth > 885 ? 'w-[25%] h-[450px]' : screenWidth > 430 ? 'w-[33.33%] h-[450px]' : 'w-[70%] h-[350px]'} p-5`}>
                            <div onClick={() => { GetData(sea); setOPenDetails(true) }}
                            className="size-full relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all">
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${sea.poster_path || item.poster_path}`}
                                fill
                                sizes={screenWidth > 885 ? 'w-[25vw]' : 'w-[33.33vw]'}
                                alt=""
                            />
                            </div>
                        </div>
                        ))}
                    </div>
                    :
                    <h6>No Seasons Yat</h6>
                    }
                </div>
            </div>
            <Suspense fallback={<Loading />} >
                <SessonsDetails data={data} openDetails={openDetails} seasonDetails={seasonDetails} setOPenDetails={setOPenDetails} />
            </Suspense>
        </>
    )
}