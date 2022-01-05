import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { SearchResults } from "./CardComponent";
import { apiSearchResults } from "./HomePage";
import { loaderAnimation } from "./loaderAnimation";
import { Link } from "react-router-dom";
import { fetchFromCookies } from "../Utils/LoadMoviesFromCookies";

export default function MyWatchList() {
  const [loading, setloading] = useState<boolean>(true);
  const [result, setResult] = useState<Array<apiSearchResults>>([]);

  async function LoadFromCookies() {
    const Data = Cookies.get("my-watchlist");
    if (Data != undefined && JSON.parse(Data).length > 0) {
      setResult(await fetchFromCookies(Data));
      setloading(false);
    } else {
      setResult([{ error: "Empty Watchlist" }]);
      setloading(false);
    }
  }

  useEffect(() => {
    LoadFromCookies();
  }, []);

  return (
    <div className="main">
      <div className="main-container">
        <div className="homepage-icon">
          <Link to="/">
            <button>
              <i className="fas fa-chevron-left class1" />
              <i className="fas fa-chevron-left class2" />
              <i className="fas fa-chevron-left class3" />
              &nbsp;&nbsp;Go Back To HomePage
            </button>
          </Link>
        </div>
        <div className="search-result">
          {loading ? (
            loaderAnimation(loading)
          ) : (
            <SearchResults
              result={result}
              updateWatchList={LoadFromCookies}
              query="watchlist"
            />
          )}
        </div>
      </div>
    </div>
  );
}
