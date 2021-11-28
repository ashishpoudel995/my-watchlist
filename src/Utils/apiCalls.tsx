import axios from "axios";
import { apiSearchResults } from "../Components/HomePage";

export async function apiCall(input_string: string) {
  if (!input_string) return [];
  let imdb_ids: Array<string> = [];

  await axios
    .get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${input_string}`)
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
  return await searchById(imdb_ids);
}

export async function searchById(imdb_ids: Array<string>) {
  let search_results_detail: Array<apiSearchResults> = [];
  await Promise.all(
    imdb_ids.map(async (imdbID) => {
      await axios
        .get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${imdbID}`)
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
