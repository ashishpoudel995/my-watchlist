import React, { useEffect, useState } from "react";
import { apiSearchResults } from "./HomePage";
import PosterNotFound from "../images/poster-not-found.png";
import { AddToWatchList } from "../Utils/AddToWatchList";
import {RemoveFromWatchList} from "../Utils/RemoveFromWatchList";
import Cookies from "js-cookie";

async function AddToWatchListFunction(
  res: apiSearchResults,
  updateWatchList: () => void,
  fetchingIDs:()=>void
) {
  await AddToWatchList(res);
  updateWatchList();
  fetchingIDs();
}
async function RemoveFromWatchListFunction(res:apiSearchResults,updateWatchList:()=>void,fetchingIDs:()=>void){
  await RemoveFromWatchList(res);
  updateWatchList();
  fetchingIDs();
}
function SearchDetails(
  result: Array<apiSearchResults>,
  updateWatchList: () => void,
  query: string,
) {
  const [watchlist_ids,fetchIds]=useState<Array<string>>([]);
  function fetchingIDs(){
    const Data = Cookies.get("my-watchlist");
    if(Data!=undefined && Data.length>0){
      fetchIds(Data.split(","))
    }else fetchIds([])
  }
  useEffect(() => {
    fetchingIDs();
  }, [])
  function redirectToIMDB(imdbID?: string) {
    window.open("https://www.imdb.com/title/" + imdbID, "_blank");
  }
  function imdbRatingComponent(imdbRating?: string, imdbID?: string) {
    if (imdbRating === "N/A") {
      return (
        <p className="imdb-rating">
          <i className="fas fa-star" />
          <a title="Open IMDb" onClick={(e) => redirectToIMDB(imdbID)}>
            {imdbRating}
          </a>
        </p>
      );
    } else {
      return (
        <p className="imdb-rating">
          <i className="fas fa-star" />
          <a title="Open IMDb" onClick={(e) => redirectToIMDB(imdbID)}>
            {imdbRating}
            <span>/10</span>
          </a>
        </p>
      );
    }
  }
  function posterComponent(poster?: string) {
    if (poster === "N/A") {
      return <img src={PosterNotFound} />;
    } else return <img src={poster} />;
  }
  return result.map((res) => {
    if (res.error) {
      return (
        <div className="err">
          {query == "search" ? (
            <div>
              Sorry, We <span>couldn't find</span> what you're{" "}
              <span>looking for...</span>
            </div>
          ) : (
            <div>
              Opps! <span>Your Watchlist</span> is Empty
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="card">
        <div className="card-child">
          <div className="container">
            {posterComponent(res.Poster)}
            <div className="plot">
              <p>{res.Plot}</p>
            </div>
          </div>
        </div>
        <div className="card-child">
          <div className="card-contents">
            <p className="title">{res.Title}</p>
            <div className="release-year-and-runtime">
              <p className="release-year">{res.Year}</p>
              <p>
                <i className="fas fa-circle" />
              </p>
              <p className="run-time">{res.Runtime}</p>
            </div>
            <div className="language">{res.Language}</div>
            <div className="genre">{res.Genre}</div>
            <div className="actors">
              <span>Cast:</span>
              <br />
              {res.Actors}
            </div>
          </div>
          {imdbRatingComponent(res.imdbRating, res.imdbID)}
          {query == "search" && res.imdbID && !watchlist_ids.includes(res.imdbID)? (
            <button
              className="add-to-watchlist"
              onClick={(e) => AddToWatchListFunction(res, updateWatchList,fetchingIDs)}
            >
              Add to WatchList&emsp;
              <i className="fas fa-bookmark" />
            </button>
          ) : (
            <button
              className="add-to-watchlist"
              onClick={(e) => RemoveFromWatchListFunction(res, updateWatchList,fetchingIDs)}
            >
              Delete&emsp;
              <i className="fas fa-trash" />
            </button>
          )}
        </div>
      </div>
    );
  });
}

type Props = {
  result: Array<apiSearchResults>;
  updateWatchList: () => void;
  query: string;
};

export const SearchResults: React.FC<Props> = ({
  result,
  updateWatchList,
  query,
}) => {
  if (result.length != 0) {
    return (
      <div>
        <div className="search-results-heading">
          {query == "search" ? (
            <div>
              Search <span>Results:</span>
            </div>
          ) : (
            <div>
              Your <span>WatchList:</span>
            </div>
          )}
        </div>
        <div className="search-results-disp">
          {SearchDetails(result, updateWatchList, query)}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

