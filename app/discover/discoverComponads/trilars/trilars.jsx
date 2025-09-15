import BtnsLists from './listsBtns'

export default async function Trilars() {
  const staticOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw',

    },
    next: { revalidate: 3600 },
  };

  try {
    const [moviesRes, seriesRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US`,
        staticOptions
      ),
      fetch(
        `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc`,
        staticOptions
      ),
    ]);

    const [moviesData, seriesData] = await Promise.all([moviesRes.json(), seriesRes.json()]);

    const moviesResults = moviesData.results || [];
    const seriesResults = seriesData.results || [];

    const movieVideos = await Promise.all(
      moviesResults.map(async (movie) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
            staticOptions
          );
          const data = await res.json();
          return { id: movie.id, title: movie.title, videos: data.results || [] };
        } catch {
          return { id: movie.id, title: movie.title, videos: [] };
        }
      })
    );

    const seriesVideos = await Promise.all(
      seriesResults.map(async (series) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/tv/${series.id}/videos?language=en-US`,
            staticOptions
          );
          const data = await res.json();
          return { id: series.id, name: series.name, videos: data.results || [] };
        } catch {
          return { id: series.id, name: series.name, videos: [] };
        }
      })
    );

    return (
      <BtnsLists
        movieVideos={movieVideos}
        seriesVideos={seriesVideos}
        title={'Officials Trailers'}
      />
    );
  } catch (err) {
    console.error("Error fetching trailers:", err);
    return <p>Failed to load trailers</p>;
  }
}
