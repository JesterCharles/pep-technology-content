/*
TASK 1. The old static status page began with this HTML masthead:

  <header class="masthead">
    <img src="/beacon.svg" alt="Beacon logo">
    <h1 tabindex="-1">Beacon</h1>
    <p>SERVICE_COUNT services monitored<br>All times UTC</p>
  </header>

Rebuild it here as valid JSX, returned from this component. Replace the
SERVICE_COUNT placeholder with the serviceCount prop, computed inside curly
braces. Remember what JSX changes about attribute names and tag closing.
(tabindex="-1" lets a skip link move keyboard focus to the heading.)
*/
export default function DashboardHeader({ serviceCount }) {
  return <div>TODO: rebuild the masthead as JSX</div>;
}
