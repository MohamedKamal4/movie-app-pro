'use client';
import { useEffect, useState, useMemo } from "react";
import CardData from "../../../componads/card/cardData";
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FaArrowRightLong } from "react-icons/fa6";
import Loading from "../../../componads/loadingComponads";

export default function MoviesList({ genre, dataOne, dataTwo, dataThree, dataFour, btns, title, type }) {
    const [clicked, setClicked] = useState('dataOne');
    const [mounted, setMounted] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize()
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setMounted(true);
        AOS.init({ duration: 1000, once: true });
    }, []);

    const datasets = useMemo(() => ({ dataOne, dataTwo, dataThree, dataFour }), [dataOne, dataTwo, dataThree, dataFour]);

    const currentData = useMemo(() => datasets[clicked] || dataOne, [datasets, clicked, dataOne]);

    if (!mounted) return <Loading /> ;
    

    const mapIndexToZIndex = (index) => {
        switch(index) {
            case 0: return 'z-50';
            case 1: return 'z-40';
            case 2: return 'z-30';
            default: return 'z-20';
        }
    };

    return (
        <section>
            <div className="container m-auto py-30">
                <div className="w-full flex gap-5 justify-between items-center mb-6">
                    <div className="flex justify-start items-center">
                        <div data-aos='fade-right' className="border-e-2 flex items-center pe-2 me-2 border-white">
                            <h2 className={`font-semibold ${screenWidth > 430 ? 'text-xl' : 'text-[10px]'}`}>{title}</h2>
                        </div>
                        <ul className="list-none flex gap-2">
                            {btns.map((btn, index) => (
                                <li key={btn.value} data-aos='fade-right' data-aos-delay={index * 500}>
                                    <button
                                        onClick={() => setClicked(btn.value)}
                                        className={`${screenWidth > 430 ? 'px-5' : 'px-1 text-[10px]'} ${mapIndexToZIndex(index)} relative cursor-pointer py-2 rounded-md transition-all duration-200 ${clicked === btn.value ? "bg-amber-300 text-black" : "bg-transparent"}`}
                                    >
                                        {btn.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className={`flex gap-3 items-center ${screenWidth > 430 ? 'text-xs' : 'text-[10px]'}`}>SCROLL <FaArrowRightLong /></p>
                </div>
                <CardData genre={genre} data={currentData.results} type={type} />
            </div>
        </section>
    );
}
