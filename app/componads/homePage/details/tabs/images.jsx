'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImagesDetails({images}){
    const [screenWidth, setScreenWidth] = useState(0);
    
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize()
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return(
        <div className="size-full flex flex-wrap gap-[2%] overflow-auto p-2 bg-black/60 backdrop-blur-sm" style={{ zIndex: 3200 }}>
            {images.map((img, idx) => (
              <div key={idx} className={`relative mb-10 ${screenWidth > 430 ? 'h-screen w-[49%]' : 'w-[100%] h-[49%]'}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${img.file_path}`}
                  alt=""
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
        </div>
    )
}