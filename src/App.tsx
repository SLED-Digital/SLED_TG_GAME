import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './Home';
import FrensPage from './FrensPage';
import EarnPage from './EarnPage';
import BoostsPage from './BoostsPage';
import React from 'react';
import Start from "./Start.tsx";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/*<Route path="/" element={<Home />} />*/}
      <Route path="/" element={<Start />} />
      <Route path="/frens" element={<FrensPage />} />
      <Route path="/earn" element={<EarnPage />} />
      <Route path="/boosts" element={<BoostsPage />} />
    </Routes>
  </Router>
);

export default App;