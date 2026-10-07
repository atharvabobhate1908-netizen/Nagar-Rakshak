import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import LandingPage from "./pages/LandingPage";
import ReportPage from "./pages/ReportPage";
import MapPage from "./pages/MapPage";
import ModeratorPage from "./ModeratorPage";
import NGOPortal from "./NGOPortal";
import CitizenTrack from "./CitizenTrack";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<ModeratorPage />} />
          <Route path="/ngo" element={<NGOPortal />} />
          <Route path="/track" element={<CitizenTrack />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
