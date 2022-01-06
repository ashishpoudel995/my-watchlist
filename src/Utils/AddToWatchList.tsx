import Cookies from "js-cookie";
import { apiSearchResults } from "../Components/HomePage";

export async function AddToWatchList(res: apiSearchResults) {
  if (res.imdbID) {
    const Data = Cookies.get("my-watchlist");
    if (Data == undefined) {
      const arr = [res];
      Cookies.set("my-watchlist", [JSON.stringify(arr)], { expires: 365 });
    } else {
      const arr = JSON.parse(Data);
      arr.push(res);
      Cookies.set("my-watchlist", JSON.stringify(arr), { expires: 365 });
    }
  }
}
