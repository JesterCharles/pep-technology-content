// Tiny render diagnostic from the "what makes a component re-render" topic.
// A component calls recordRender(name) in its body; the counts show how often
// React called the component function. The tests read these counts, and you
// can log them yourself while diagnosing re-renders. Treat this file as given.
export const renderCounts = {};

export function recordRender(name) {
  renderCounts[name] = (renderCounts[name] ?? 0) + 1;
}
