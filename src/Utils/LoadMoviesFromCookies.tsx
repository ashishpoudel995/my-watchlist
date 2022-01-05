import axios from "axios";
import { apiSearchResults, torrent } from "../Components/HomePage";

export async function fetchFromCookies(Data: string) {
  let parsedData: { imdbID: string; lang: string; id?: number }[] = [];
  parsedData = JSON.parse(Data);
  let search_results_detail: Array<apiSearchResults> = [];

  await Promise.all(
    parsedData.map(async (dat) => {
      if (dat.lang === "not-english") {
        try {
          const res2 = await axios.get(
            `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${dat.imdbID}`
          );
          search_results_detail.push({
            imdbID: dat.imdbID,
            Poster: res2.data.Poster,
            Title: res2.data.Title,
            Year: res2.data.Year,
            Language: res2.data.Language,
            Runtime: res2.data.Runtime,
            imdbRating: res2.data.imdbRating,
            Genre: res2.data.Genre,
            Actors: res2.data.Actors,
            Plot: res2.data.Plot,
            language: "not-english",
          });
        } catch (err) {
          return [{ error: "Connected Failed" }];
        }
      } else {
        console.log(dat.imdbID + "-" + dat.id + "-" + dat.lang);
        try {
          const res = await axios.get(
            `https://yts.mx/api/v2/movie_details.json?movie_id=${dat.id}`
          );
          const torrents: Array<torrent> = [];
          res.data.data.movie.torrents.forEach(function (tor: {
            url: string;
            quality: string;
            size: string;
          }) {
            torrents.push({
              url: tor.url,
              quality: tor.quality,
              size: tor.size,
            });
          });
          search_results_detail.push({
            imdbID: res.data.data.movie.imdb_code,
            Poster: res.data.data.movie.large_cover_image,
            Title: res.data.data.movie.title,
            Year: res.data.data.movie.year,
            Language: res.data.data.movie.language,
            Runtime: res.data.data.movie.runtime + "min",
            imdbRating: res.data.data.movie.rating,
            Genre: res.data.data.movie.genres.join(","),
            Plot: res.data.data.movie.description_intro,
            language: "english",
            movie_id: res.data.data.movie.id,
            torrents: torrents,
          });
          console.log(search_results_detail);
        } catch (err) {
          return [{ error: "Error 404" }];
        }
      }
    })
  );
  console.log(search_results_detail);
  if (search_results_detail.length == 0) return [{ error: "Movie Not Found" }];
  return search_results_detail;
}
