import { HashRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import MyWatchList from "./Components/MyWatchList";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/watchlist" element={<MyWatchList />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
