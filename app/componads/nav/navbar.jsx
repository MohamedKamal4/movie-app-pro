'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FiSearch } from "react-icons/fi";
import './navbar.css'
import { usePathname , useRouter  } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import LogIn from '../../componads/login/login' 
import Image from "next/image";
import { IoMenuOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";

export default function Navbar({fontClass}) {
    const pathname = usePathname();
    const router = useRouter()
    const [active, setActive] = useState(false);
    const [title , setTitle] = useState('');
    const [openLOgForem , setOpenLogForm] = useState(false)
    const [logValid , setLogValid] = useState(false)
    const [userData , setUserData] = useState({})
    const [openList , setOpenList] = useState(false)
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sessionId = 
        typeof window !== "undefined" 
            ? localStorage.getItem('tmdb_session') || sessionStorage.getItem('tmdb_session') 
            : null;

    useEffect(() => {
        AOS.init();

        if (sessionId) {
            fetch(`https://api.themoviedb.org/3/account/${sessionId}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
                }
            })
            .then(res => res.json())
            .then(res => {
                setUserData(res)
                setLogValid(true) 
            })
            .catch(err => console.error(err));
        }
    }, [sessionId])

    const btnList = [
        { name: 'Favorite', content: 'favorite' },
        { name: 'Watch List', content: 'watchlist' },
    ]

    const handleLogout = () => {
        localStorage.removeItem("tmdb_session")
        sessionStorage.removeItem("tmdb_session")
        setLogValid(false)
        setUserData({})
        setOpenList(false)
        router.push("/")
    }

    return (
        <>
        <nav data-aos="fade-down" className={`w-screen ${fontClass}`} style={{backgroundColor: 'rgb(0 0 0 / 1%)' , backdropFilter: 'blur(5px)'}}>
            <div className={` ${screenWidth > 430 ? 'text-md' : 'text-xs'} container px-6 m-auto flex items-center justify-between`}>
                <Link href='/' className="flex items-center space-x-3 rtl:space-x-reverse text-black">
                    <span className="self-center font-semibold whitespace-nowrap bg-amber-300 relative z-20 py-1 px-4 rounded-sm tracking-widest">BOX</span>
                    <span className="self-center font-semibold whitespace-nowrap tracking-widest  text-amber-300  relative z-0" >MOVIES</span>
                </Link>
                {screenWidth > 885 &&
                    <div className="list w-full">
                        <ul className="links justify-end h-[80px] flex gap-5 items-center py-4 ">
                        
                            <li><Link href="/" className={`${pathname === '/' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Home</Link></li>
                            <li><Link href="/discover" className={`${pathname === '/discover' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Discover</Link></li>
                            <li><Link href="/collections" className={`${pathname === '/collections' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Collections</Link></li>

                            <li className="h-[15px] w-[1px] bg-white"></li>
                                
                            
                            
                            <li>
                                <button onClick={() => setActive(!active)} className="text-md cursor-pointer py-2 px-3 text-white">
                                    {active ? <IoCloseOutline/> : <FiSearch />}
                                </button>
                            </li>

                            {logValid ? (
                                <li className="relative">
                                    <div className="flex gap-5 items-center">
                                        <h1 className={`text-[10px] font-bold capitalize`}>{userData.name}</h1>
                                        <div onClick={() => setOpenList(!openList)} className="cursor-pointer overflow-hidden relative w-[30px] h-[30px] rounded-full">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w1280${userData.avatar?.tmdb.avatar_path}`}
                                                alt="avatar"
                                                fill
                                            />
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-[-180px] transition-all rounded-2xl ${openList ? 'right-[-30px] opacity-100' : 'right-[-500px] opacity-0'} w-[200px] bg-amber-300`}>
                                        <ul className="p-5 flex flex-col gap-2 text-xs">
                                        {btnList.map((btn) => (
                                            <li key={btn.name} className={`py-2 transition-all px-5 ${pathname.includes(btn.content) ? 'bg-black text-white' : ''} hover:bg-black hover:text-white cursor-pointer`}>
                                                <Link href={`/user/${btn.content}/${sessionId}`}>{btn.name}</Link>
                                            </li>
                                        ))}
                                        <li className="py-3 cursor-pointer transition-all px-5 hover:bg-black hover:text-white border-t-2 border-white">
                                            <button onClick={handleLogout}>Log Out</button>
                                        </li>
                                        </ul>
                                    </div>
                                </li>
                            ) : (
                                <li>
                                    <button onClick={() => setOpenLogForm(true)} className="cursor-pointer text-amber-300">Log in</button>
                                </li>
                            )}
                        </ul>
                    </div>
                }
                {screenWidth < 885 && screenWidth > 430 &&
                    <div className="list w-full">
                        <ul className="links justify-end h-[80px] flex gap-5 items-center py-4 ">
                        
                            <li><Link href="/" className={`${pathname === '/' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Home</Link></li>
                            <li><Link href="/discover" className={`${pathname === '/discover' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Discover</Link></li>
                            <li><Link href="/collections" className={`${pathname === '/collections' ? 'active' : ''} link text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-2`}>Collections</Link></li>

                            <li className="h-[15px] w-[1px] bg-white"></li>
                                
                            
                            
                            <li>
                                <button onClick={() => setActive(!active)} className="text-md cursor-pointer py-2 px-3 text-white">
                                    {active ? <IoCloseOutline/> : <FiSearch />}
                                </button>
                            </li>

                            {logValid ? (
                                <li className="relative">
                                    <div className="flex gap-5 items-center">
                                        <div onClick={() => setOpenList(!openList)} className="cursor-pointer overflow-hidden relative w-[30px] h-[30px] rounded-full">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w1280${userData.avatar?.tmdb.avatar_path}`}
                                                alt="avatar"
                                                fill
                                            />
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-[-250px] transition-all rounded-2xl ${openList ? 'right-[-30px] opacity-100' : 'right-[-500px] opacity-0'} w-[200px] bg-amber-300`}>
                                        <ul className="p-5 flex flex-col gap-2 text-xs">
                                            <li className="px-5 py-3 pb-6 border-b-2 border-white">
                                                <h1 className={`text-[10px] font-bold capitalize`}>{userData.name}</h1>
                                            </li>
                                        {btnList.map((btn) => (
                                            <li key={btn.name} className={`py-2 transition-all px-5 ${pathname.includes(btn.content) ? 'bg-black text-white' : ''} hover:bg-black hover:text-white cursor-pointer`}>
                                                <Link href={`/user/${btn.content}/${sessionId}`}>{btn.name}</Link>
                                            </li>
                                        ))}
                                        <li className="py-3 cursor-pointer transition-all px-5 hover:bg-black hover:text-white border-t-2 border-white">
                                            <button onClick={handleLogout}>Log Out</button>
                                        </li>
                                        </ul>
                                    </div>
                                </li>
                            ) : (
                                <li>
                                    <button onClick={() => setOpenLogForm(true)} className="cursor-pointer text-amber-300">Log in</button>
                                </li>
                            )}
                        </ul>
                    </div>
                }

                {screenWidth < 430 &&
                    <div className="list w-full">
                        <ul className="links justify-end h-[80px] flex gap-5 items-center py-4 ">
                            <li>
                                <button onClick={() => setActive(!active)} className="text-md cursor-pointer py-2 px-3 text-white">
                                    {active ? <IoCloseOutline/> : <FiSearch />}
                                </button>
                            </li>
                            {!logValid && 
                                <li>
                                    <button onClick={() => setOpenLogForm(true)} className="cursor-pointer text-amber-300">Log in</button>
                                </li>
                            }           

                                <li className="relative">
                                    <div className="flex gap-5 items-center">
                                        <div onClick={() => setOpenList(!openList)} className="cursor-pointer">
                                            {openList ?
                                                <MdOutlineClose size={20} />
                                                :
                                                <IoMenuOutline size={20} />
                                            }
                                        </div>
                                    </div>
                                    <div className={`absolute ${logValid ? 'bottom-[-340px] ' : 'bottom-[-190px] '} transition-all rounded-2xl ${openList ? 'right-[-25px] opacity-100' : 'right-[-500px] opacity-0'} w-screen bg-amber-300`}>
                                        <ul className="p-5 flex flex-col gap-2 text-xs">
                                    {logValid ? (
                                            <div className="flex py-3 items-center gap-5  pb-6 border-b-2 border-white">
                                                <div className="w-[30px] h-[30px] rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w1280${userData.avatar?.tmdb.avatar_path}`}
                                                        alt="avatar"
                                                        fill
                                                    />
                                                </div>
                                                <h1 className={`text-[10px] font-bold capitalize`}>{userData.name}</h1>
                                                <li className="w-[50%] cursor-pointer transition-all px-5 hover:text-black flex justify-end items-center">
                                                    <button onClick={handleLogout}>Log Out</button>
                                                </li>
                                            </div>)
                                        :
                                        null
                                    }
                                            <li><Link href="/" className={`${pathname === '/' ? 'bg-black' : ''} text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-5 hover:bg-black hover:text-white`}>Home</Link></li>
                                            <li><Link href="/discover" className={`${pathname === '/discover' ? 'bg-black' : ''} text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-5 hover:bg-black hover:text-white`}>Discover</Link></li>
                                            <li><Link href="/collections" className={`${pathname === '/collections' ? 'bg-black' : ''} text-white block ${screenWidth > 885 ? 'text-md' : 'text-xs'} py-2 px-5 hover:bg-black hover:text-white`}>Collections</Link></li>
                                        {logValid &&
                                            <>
                                                {btnList.map((btn) => (
                                                    <li key={btn.name} className={`py-2 transition-all px-5 ${pathname.includes(btn.content) ? 'bg-black text-white' : ''} hover:bg-black hover:text-white cursor-pointer`}>
                                                        <Link href={`/user/${btn.content}/${sessionId}`}>{btn.name}</Link>
                                                    </li>
                                                ))}
                                                
                                            </>
                                        }
                                        </ul>
                                    </div>
                                </li>
                        </ul>
                    </div>
                }
            </div>
        </nav>

        <section className={` bg-amber-300 flex justify-end items-start fixed search top-0 right-0 z-[1000] ${active ? 'active-search' : ''}`}>
            <section className={` bg-black search flex justify-end relative search z-50 ${active ? 'active-search-two' : ''}`}>
                {active && (
                    <form className="w-[70%] mt-52" onSubmit={(e) => {
                        e.preventDefault();
                        setActive(false)
                        if (title.trim()) router.push(`/search/${title}`);
                        setTitle('')
                    }}>
                        <input
                            key={active}
                            data-aos='zoom-in'
                            data-aos-delay='1000'
                            type="text"
                            className="border-0 w-full bg-transparent text-white input"
                            placeholder="Search..." 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                    </form>
                )}
            </section>
        </section>

        <LogIn openLOgForem={openLOgForem} setOpenLogForm={setOpenLogForm} logValid={logValid} setLogValid={setLogValid} />
        </>
    )
}
