
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "../../../componads/loadingComponads";
const HeroDetails = dynamic(() => import("../../../componads/detailsCompnads/heroSection") , {Suspense : true}) 
const Cast = dynamic(() => import("../../../componads/detailsCompnads/cast") , {Suspense : true}) 
const Collection = dynamic(() => import("../../../componads/detailsCompnads/collection") , {Suspense : true}) 
const Images = dynamic(() => import("../../../componads/detailsCompnads/images") , {Suspense : true}) 
const CardData = dynamic(() => import("../../../componads/card/cardData") , {Suspense : true})
const VideoPlayer = dynamic(() => import("../../../componads/detailsCompnads/videos/video") , {Suspense : true}) 
const Reviews = dynamic(() => import("../../../componads/detailsCompnads/reviews") , {Suspense : true}) 
const Sessons = dynamic(() => import('./seasons'))

export default async function Details({ params }) {
  const { id, type } = await params;
  
  const options = {
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
    },
    next: { revalidate: 3600 },
  };

  const staticOptions = {
  headers: {
    accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
  },
  next: { revalidate: 3600 },
};

const dynamicOptions = {
  headers: {
    accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
  },
  cache: "no-store",
};


  const dataRes = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
    options
  );
  const data = await dataRes.json();
   const [ similarRes, imageRes, castRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?language=en-US`, staticOptions),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/images`, staticOptions),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?language=en-US`, staticOptions),
  ]);

  const [videosRes, reviewsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, dynamicOptions),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?language=en-US&page=1`, dynamicOptions),
  ]);

  const [ similar, images, cast, videos, reviews] = await Promise.all([
    similarRes.json(),
    imageRes.json(),
    castRes.json(),
    videosRes.json(),
    reviewsRes.json(),
  ]);

  let collection = null;
  if (data.belongs_to_collection) {
    const collectionRes = await fetch(
      `https://api.themoviedb.org/3/collection/${data.belongs_to_collection.id}?language=en-US`,
      staticOptions
    );
    collection = await collectionRes.json();
  }

  const trailer = videos.results.filter(
    (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.name === 'Official Trailer'
  );



  return (
    <>
      <HeroDetails data={data} type={type} />

      <Suspense fallback={<Loading />}>
        {trailer.length > 0 &&
        <section>
          <div className={`container flex items-center justify-center flex-col m-auto py-20`}>
            <div className="w-[100%]">
              <p className="text-3xl py-10 text-center Official-Trailer">Official Trailer</p>
            </div>
            <div className='w-[100%]'>
              {videos?.results && <VideoPlayer trailer={trailer} />}
            </div>
          </div>
        </section>
        }
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Cast cast={cast} />
      </Suspense>

      {type === 'tv' &&
        <Suspense fallback={<Loading />}>
          <Sessons seasonsData={data.seasons} data={data} id={data.id} />
        </Suspense>
      }

      <Suspense fallback={<Loading />}>
        <Images images={images.backdrops} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Collection collection={collection} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <CardData data={similar.results} type={type} title='Similar' />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Reviews reviews={reviews.results} />
      </Suspense>
    </>
  );
}

