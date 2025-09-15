
import { Suspense } from 'react';
import DiscovrSection from './discoverComponads/hero/heroSection'
const MoviesList = dynamic(() => import( './discoverComponads/moviesList/lists') , {Suspense : true})
const Trilars =dynamic(() => import('./discoverComponads/trilars/trilars') , {Suspense : true})
const Recommendations = dynamic(() => import('./discoverComponads/reco/recommendations') , {Suspense : true})
const Pop = dynamic(() => import('./discoverComponads/popularPeaple/pop') , {Suspense : true})
import dynamic from 'next/dynamic';
import Loading from '../componads/loadingComponads';


const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',
  },
  next: { revalidate: 3600 }
};

async function fetchData(url) {
  const res = await fetch(url, API_OPTIONS);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default async function Discover(){

    const [
    movies,
    series,
    genre,
    nowPlaying,
    popular,
    topRated,
    upcoming,
    onTheAir,
    airingToday,
    popularSeries,
    topRatedSeries
  ] = await Promise.all([
    fetchData('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'),
    fetchData('https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc'),
    fetchData('https://api.themoviedb.org/3/genre/movie/list?language=en'),
    fetchData(`https://api.themoviedb.org/3/movie/now_playing?language=en-US`),
    fetchData(`https://api.themoviedb.org/3/movie/popular?language=en-US`),
    fetchData(`https://api.themoviedb.org/3/movie/top_rated?language=en-US`),
    fetchData(`https://api.themoviedb.org/3/movie/upcoming?language=en-US`),
    fetchData('https://api.themoviedb.org/3/tv/on_the_air?language=en-US'),
    fetchData('https://api.themoviedb.org/3/tv/airing_today?language=en-US'),
    fetchData('https://api.themoviedb.org/3/tv/popular?language=en-US'),
    fetchData('https://api.themoviedb.org/3/tv/top_rated?language=en-US')
  ]);

    const MoviesBtns = [
        { name: "Now Playing", value: "dataOne" },
        { name: "Top Rated", value: "dataTwo" },
        { name: "Popular", value: "dataThree" },
        { name: "Upcoming", value: "dataFour" },
    ];

    const SeriesBtns = [
        { name: "On TheAir", value: "dataOne" },
        { name: "Airing Today", value: "dataTwo" },
        { name: "Popular", value: "dataThree" },
        { name: "TopRated", value: "dataFour" },
    ];

    console.log('nowPlaying' , nowPlaying)

    return(
        <>
            <DiscovrSection movies={movies.results} series={series.results} genre={genre.genres} />
            <Suspense fallback={<Loading />}>
                <MoviesList
                genre={genre.genres}
                dataOne={nowPlaying} 
                dataTwo={popular} 
                dataThree={topRated} 
                dataFour={upcoming} 
                btns={MoviesBtns}
                title={'Movies List'}
                type={'movie'}
                />
            </Suspense>

            <Suspense fallback={<Loading />}>
                <MoviesList
                genre={genre.genres}
                dataOne={onTheAir} 
                dataTwo={airingToday} 
                dataThree={popularSeries} 
                dataFour={topRatedSeries} 
                btns={SeriesBtns}
                title={'Series List'}
                type={'tv'}
                />
            </Suspense>

            <Suspense fallback={<Loading />}>
                <Trilars />
            </Suspense>

            <Suspense fallback={<Loading />}>
                <Recommendations genre={genre.genres} />
            </Suspense>

            <Suspense fallback={<Loading />}>
                <Pop />
            </Suspense>
        </>
    )
}