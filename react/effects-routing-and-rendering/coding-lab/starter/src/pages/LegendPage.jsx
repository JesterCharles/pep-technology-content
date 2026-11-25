import StatusLegend from "../components/StatusLegend.jsx";

// Given: a standalone page for the status legend, linked from the nav.
export default function LegendPage() {
  return (
    <>
      <h2>What the statuses mean</h2>
      <StatusLegend />
    </>
  );
}
