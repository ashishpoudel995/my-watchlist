import Cookies from "js-cookie";
import { apiSearchResults } from "../Components/HomePage";
export async function RemoveFromWatchList(res: apiSearchResults) {
  if (res.imdbID) {
    const Data = await Cookies.get("my-watchlist");
    if (Data != undefined) {
      const Updated = Data.split(",").filter((value: string) => {
        return res.imdbID != value;
      });
      if(Updated.length>0)
        Cookies.set("my-watchlist", Updated.join(","));
      else
        Cookies.remove("my-watchlist");
    }
  }
}
