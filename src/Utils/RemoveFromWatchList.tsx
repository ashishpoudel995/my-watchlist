import Cookies from "js-cookie";
import { apiSearchResults } from "../Components/HomePage";

export async function RemoveFromWatchList(res: apiSearchResults) {
  if (res.imdbID) {
    const Data = await Cookies.get("my-watchlist");
    if (Data != undefined) {
      const json_data = JSON.parse(Data);
      const Updated = json_data.filter(function (dat: {
        imdbID: string;
        lang: string;
        id: string;
      }) {
        return res.imdbID != dat.imdbID;
      });
      if (Updated.length > 0)
        Cookies.set("my-watchlist", JSON.stringify(Updated));
      else Cookies.remove("my-watchlist");
    }
  }
}
