import { Outlet } from "react-router";

/*
TASK 2. The nav below uses plain anchors. A plain <a> makes the browser load
the whole document again, which throws away every piece of React state and
refetches everything. Replace them with the router's link components so the
page switches without a reload, and make the link for the page the user is on
announce itself as the current page (the stylesheet highlights
a[aria-current="page"], and NavLink sets that attribute for you).
*/
export default function AppLayout() {
  return (
    <>
      <header className="masthead">
        <h1>Beacon</h1>
        <nav aria-label="Main">
          <a href="/">Overview</a>
          <a href="/legend">Legend</a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
