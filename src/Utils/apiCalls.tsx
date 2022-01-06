import axios from "axios";
import { apiSearchResults, torrent } from "../Components/HomePage";

export async function apiCall(input_string: string) {
  if (!input_string) return [];
  let search_results_detail: Array<apiSearchResults> = [];
  search_results_detail = await searchWithTorrent(input_string);
  let fetched_imdb_ids: Array<string> = [];
  search_results_detail.forEach(function (movie: apiSearchResults) {
    if (movie.imdbID != undefined) {
      fetched_imdb_ids.push(movie.imdbID);
    }
  });
  let imdb_ids: Array<string> = [];
  await axios
    .get(
      `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${input_string}`
    )
    .then((res) => {
      if (res.data.Error) {
        return [{ error: res.data.Error }];
      }
      imdb_ids = res.data.Search.map((id: { imdbID: string }) => {
        return id.imdbID;
      });
    })
    .catch((err) => {
      return [{ error: "Connection Failed" }];
    });
  imdb_ids.filter((id: string) => {
    return !fetched_imdb_ids.includes(id);
  });
  const fetched_from_omdb = await searchById(imdb_ids);
  const result = search_results_detail.concat(fetched_from_omdb);
  result.sort(function (movie_a: apiSearchResults, movie_b: apiSearchResults) {
    if (movie_a.Title != undefined && movie_b.Title != undefined) {
      if (movie_a.Title < movie_b.Title) {
        return -1;
      }
      if (movie_a.Title > movie_b.Title) {
        return 1;
      }
    }
    return 0;
  });
  return result;
}

export async function searchWithTorrent(input_string: string) {
  let search_results_detail: Array<apiSearchResults> = [];
  try {
    const res = await axios.get(
      `https://yts.mx/api/v2/list_movies.json?query_term=${input_string}`
    );
    res.data.data.movies.forEach(function (movie: {
      imdb_code: string;
      large_cover_image: string;
      title: string;
      year: string;
      language: string;
      runtime: string;
      rating: string;
      genres: Array<string>;
      summary: string;
      torrents: [torrent];
      id: number;
    }) {
      const torrents: Array<torrent> = [];
      movie.torrents.forEach(function (tor: {
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
        imdbID: movie.imdb_code,
        Poster: movie.large_cover_image,
        Title: movie.title,
        Year: movie.year,
        Language: movie.language,
        Runtime: movie.runtime + "min",
        imdbRating: movie.rating,
        Genre: movie.genres.slice(0, 3).join(","),
        Plot: movie.summary,
        language: "english",
        movie_id: movie.id,
        torrents: torrents,
      });
    });
    return search_results_detail;
  } catch (err) {
    return [{ error: "Error 404" }];
  }
}

export async function searchById(imdb_ids: Array<string>) {
  let search_results_detail: Array<apiSearchResults> = [];
  await Promise.all(
    imdb_ids.map(async (imdbID) => {
      await axios
        .get(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${imdbID}`
        )
        .then((res2) => {
          search_results_detail.push({
            imdbID,
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
        })
        .catch((err) => {
          return [{ error: "Connected Failed" }];
        });
    })
  );
  if (search_results_detail.length == 0) return [{ error: "Movie Not Found" }];
  return search_results_detail;
}
