// Finished in part 1 of this scenario; treat as given.
export const STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
  );
}
