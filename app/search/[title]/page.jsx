'use client'
import { useEffect, useState } from 'react'
import { useParams } from "next/navigation"
import Link from 'next/link'
import Image from 'next/image'
import Footer from '../../componads/footer/footer'
export default function SearchDetails(){
    const { title } = useParams()
    const [key , setKey] = useState('multi')
    const [data , setData] = useState([])
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw'
    }
    };

    useEffect(() => {
    
        fetch(`https://api.themoviedb.org/3/search/${key}?query=${title}&include_adult=false&language=en-US`, options)
        .then(res => res.json())
        .then(allRes => {
            setData(allRes.results)
        })
        .catch((err => console.error(err)));

    },[title , key])

    console.log(key , data)

    return (
        <>
            <section className="pt-30">
                <div className="container m-auto">
                    <div className='w-full py-10 flex flex-wrap justify-start items-start'> 
                        {data.length !== 0 ? 
                            data.map((el) => {
                            if(!el.poster_path){
                                return null
                            }else{
                                return(
                                <div key={el.id} className={`${screenWidth > 885 ? 'w-[20%]' : screenWidth > 430 ? 'w-[33.33%]' : 'w-[50%]'} p-5`}>
                                    <div className='w-full relative h-[300px] rounded-2xl overflow-hidden hover:scale-105 transition-all'>
                                        <Link href={`/details/${el.media_type}/${el.id}`}>
                                            <Image 
                                                src={`https://image.tmdb.org/t/p/original/${el.poster_path}`}
                                                fill
                                                alt=''
                                            />
                                        </Link>
                                    </div>
                                </div>
                            )
                            }
                        } )
                        :
                        <div className='flex justify-center items-center w-full h-[300px] text-2xl py-10'>No results found</div>
                        }
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}