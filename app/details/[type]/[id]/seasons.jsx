'use client'

import { useEffect, useState } from 'react';
import SessonsDetails from '../../../componads/seasons/sessonsDetails'
import Image from 'next/image';

export default function Seasons({ seasonsData ,data , id}){
    const [openDetails, setOPenDetails] = useState(false)
    const [seasonDetails, setSeasonDetails] = useState([])
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

    function GetData(item) {
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
        }
        };
        fetch(`https://api.themoviedb.org/3/tv/${id}/season/${item.season_number}?language=en-US`, options)
        .then(res => res.json())
        .then(res => {
            setSeasonDetails(res)
        })
        .catch(err => console.error(err));
    }

    return(
        <>
             <section className="w-screen mb-20">
                <div className="container m-auto">
                    <div><h1 className="py-20 w-full text-3xl text-center">Seasons</h1></div>
                    <div className={`${screenWidth > 430 ? '' : 'flex-col items-center'} flex flex-wrap justify-center`}>
                        {seasonsData.map((sea, idx) => (
                            <div key={`${sea.id}-${idx}`} className={` ${screenWidth > 885 ? 'w-[25%]  h-[400px]' : screenWidth > 430 ? 'w-[33.33%] h-[350px]' : 'w-[60%] h-[320px]'} p-5`}>
                                <div onClick={() => { GetData(sea); setOPenDetails(true) }}
                                    className="size-full relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all">
                                    <Image
                                    src={`https://image.tmdb.org/t/p/w500${sea.poster_path}`}
                                    fill
                                    sizes={screenWidth > 885 ? 'w-[25vw]' : 'w-[33.33vw]'}
                                    alt=""
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <SessonsDetails data={data} openDetails={openDetails} seasonDetails={seasonDetails} setOPenDetails={setOPenDetails} />
        </>
    )
}