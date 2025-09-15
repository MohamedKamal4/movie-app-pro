'use client'
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Reviews({ reviews , state }) {
    const [screenWidth, setScreenWidth] = useState(0);
  
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize()
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const rating = [1,2,3,4,5,6,7,8,9,10]
  return (
    <>
        <section className="mt-20">
          <div className="container m-auto">
            {state === 'no title' ?
              null
              :
              <h2 className="text-3xl text-center py-20">Reviews</h2>
            }
              {reviews.length > 0 ? 
                <>
                  {reviews.map((el) => {
                  let avatarUrl = '';
                  if (el.author_details.avatar_path) {
                    if (el.author_details.avatar_path.startsWith('/https')) {
                      avatarUrl = el.author_details.avatar_path.slice(1);
                    } else {
                      avatarUrl = `https://image.tmdb.org/t/p/w1280${el.author_details.avatar_path}`;
                    }
                  }

                  return (
                    <div key={el.id} className={`min-h-[250px] ${screenWidth > 430 ? 'px-30' : 'px-5'} py-20 mb-20 w-full`}>
                      <div className="py-5 flex gap-5 items-center">
                        <div
                          className="w-[40px] h-[40px] rounded-full bg-gray-200"
                          style={{
                            backgroundImage: `url(${avatarUrl})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <div className="flex justify-start items-center gap-2">
                                    {el.author_details.name && (
                                        <h3 className="text-sm">{el.author_details.name}</h3>
                                    )}
                                    <p className="text-xs">@{el.author_details.username}</p>
                                </div>
                                <p className="text-xs text-gray-500">{el.created_at.split("T")[0]}</p>
                            </div>
                            <div className="flex gap-1">
                                {rating.slice(0,el.author_details.rating).map((el , index) => {
                                    return(
                                        <span key={index} className="text-lg"><FaStar size={10} className=" text-yellow-500" /></span>
                                    )
                                })}
                            </div>
                        </div>
                      </div>
                      <p className="text-xs">{el.content}</p>
                    </div>
                  );
                })}
                </>
                : 
                <p className="text-lg h-screen flex justify-center items-center">No Reviews Yet</p>
              }
          </div>
        </section>
    </>
  );
}
