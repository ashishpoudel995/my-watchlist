import Cookies from "js-cookie";
import { apiSearchResults } from "../Components/HomePage";
export async function AddToWatchList(res: apiSearchResults) {
  if (res.imdbID) {
    const Data=await Cookies.get("my-watchlist");
    if(Data==undefined){
      Cookies.set("my-watchlist",res.imdbID,{expires:365});
    }else{
      Cookies.set("my-watchlist",(Data+","+res.imdbID),{expires:365});
    }
  }
}
