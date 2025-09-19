'use client'

import { usePathname } from "next/navigation";
import { IoLogoFacebook } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import { FaTwitterSquare } from "react-icons/fa";
import { AiFillGoogleSquare } from "react-icons/ai";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer(){
    const pathname = usePathname()
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize(); 
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    console.log(pathname)
    return(
        <>
            {!(pathname === '/' || pathname === 'https://movie-app-pro-wine.vercel.app/') && (
                <footer>
                    <div className="container flex flex-col m-auto">
                            <div className="flex w-full">
                                <div 
                                className="w-[50%]">
                                    <h1 className={`${screenWidth > 885 ? 'text-6xl' : screenWidth > 430 ? 'text-3xl' : 'text-xl'}`}>
                                        Our platform is trusted by millions & features best updated movies all around the world.
                                    </h1>
                                </div>
                                <div 
                                className='w-[50%] gap-20 flex flex-col justify-start items-end '>
                                    <ul className={`flex ${screenWidth > 885 ? 'text-2xl gap-5' : screenWidth > 430 ? 'text-xl gap-5' : 'text-[10px] gap-2'} list-none`}>
                                        <li className="hover:scale-105 transition-all"><Link href={'/'}>Home</Link></li>
                                        <span>/</span>
                                        <li className="hover:scale-105 transition-all"><Link href={'/discover'}>Discover</Link></li>
                                        <span>/</span>
                                        <li className="hover:scale-105 transition-all"><Link href={'/collections'}>Collections</Link></li>
                                    </ul>

                                    <ul className={`flex ${screenWidth > 430 ? 'gap-10' : 'gap-5'} list-none`}>
                                        <li><IoLogoFacebook className="cursor-pointer hover:scale-125 transition-all" color="white" size={screenWidth > 430 ? 35 : 20}/></li>
                                        <li><RiInstagramFill className="cursor-pointer hover:scale-125 transition-all" color="white" size={screenWidth > 430 ? 35 : 20}/></li>
                                        <li><FaTwitterSquare className="cursor-pointer hover:scale-125 transition-all" color="white" size={screenWidth > 430 ? 35 : 20}/></li>
                                        <li><AiFillGoogleSquare className="cursor-pointer hover:scale-125 transition-all" color="white" size={screenWidth > 430 ? 35 : 20}/></li>
                                    </ul>
                                </div>
                            </div>
                            <div
                            className="w-full flex justify-between text-gray-400 text-xs items-center py-15">
                                <div>
                                    <ul className="flex gap-10 list-none">
                                        <li>Privacy Policy</li>
                                        <li>Team Of Services</li>
                                        <li>Language</li>
                                    </ul>
                                </div>
                                <div>
                                    <span>© 2023</span>
                                </div>
                            </div>
                    </div>
                </footer>
            )}
        </>
    )

}