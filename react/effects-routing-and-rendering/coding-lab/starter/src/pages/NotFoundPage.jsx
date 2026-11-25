import { Link } from "react-router";

// Given: rendered by the catch-all route once TASK 1 adds it.
export default function NotFoundPage() {
  return (
    <>
      <h2>Page not found</h2>
      <p>No dashboard page exists at this address.</p>
      <Link to="/">Back to the overview</Link>
    </>
  );
}
