import Cookies from "js-cookie";
import { apiSearchResults } from "../Components/HomePage";
export async function AddToWatchList(res: apiSearchResults) {
  if (res.imdbID) {
    let currData;
    if (res.movie_id) {
      currData = { imdbID: res.imdbID, lang: res.language, id: res.movie_id };
    } else {
      currData = { imdbID: res.imdbID, lang: res.language };
    }
    const Data = await Cookies.get("my-watchlist");
    if (Data == undefined) {
      const arr = [currData];
      Cookies.set("my-watchlist", [JSON.stringify(arr)], { expires: 365 });
    } else {
      const arr = JSON.parse(Data);
      arr.push(currData);
      Cookies.set("my-watchlist", JSON.stringify(arr), { expires: 365 });
    }
  }
}
