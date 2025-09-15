'use client';
import React from 'react';

export default function VideoPlayer({ trailer }) {
  if (!trailer || trailer.length === 0) {
    return null;
  }


  return (
      <>
         {trailer.slice(0,1).map((el) =>{
          return(
              <div key={el.id} className="w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${el.key}?rel=0&modestbranding=1&showinfo=0&controls=1&autohide=1`}
                  title={el.name || 'Trailer'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                ></iframe>
              </div>
          )
         })}
     </>
  );
}
