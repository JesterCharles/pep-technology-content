import { Routes, Route } from "react-router";
import AppLayout from "./components/AppLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.jsx";
import LegendPage from "./pages/LegendPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/*
TASK 1. Beacon now has several pages, but only one route is wired up, and the
layout (masthead and nav) is not part of the route tree at all. Rebuild the
routes so that:
  - a layout route renders AppLayout, which shows the masthead and nav once
    and renders the matched child page through an Outlet;
  - the index route shows OverviewPage;
  - "services/:serviceId" shows ServiceDetailPage (the dynamic segment must
    be called serviceId, because the page reads it with useParams);
  - "legend" shows LegendPage;
  - every other path shows NotFoundPage through a catch-all route.
*/
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
    </Routes>
  );
}
