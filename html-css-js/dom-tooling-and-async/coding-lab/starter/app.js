// Trail Guides dashboard. Work through the tasks in README.md, in order.
// The tests drive this page in a real headless browser and call the functions
// you expose on window.app at the bottom: keep those names unchanged.
"use strict";

(function () {
  const trailList = document.querySelector("#trail-list");
  const searchBox = document.querySelector("#search");
  const statusBox = document.querySelector("#status");
  const refreshButton = document.querySelector("#refresh");

  // Task 1 and Task 4: render one list item per trail into #trail-list.
  // Calling renderTrails again replaces the whole list: never append to what
  // is already there. Build each item with document.createElement and
  // textContent, in this shape (dataset.name carries the trail name):
  //   <li data-name="Lake Loop">
  //     <span class="trail-name">Lake Loop</span>
  //     5 km
  //     <a class="mark-hiked" href="#hiked">Mark hiked</a>
  //     <span class="trail-note">...the trail's note as plain text...</span>
  //   </li>
  // The notes are untrusted visitor text (see data.js). They must land in the
  // page as text, never as HTML.
  function renderTrails(trails) {
    for (const trail of trails) {
      trailList.innerHTML +=
        '<li data-name="' + trail.name + '">' +
        '<span class="trail-name">' + trail.name + "</span> " +
        trail.distanceKm + " km " +
        '<a class="mark-hiked" href="#hiked">Mark hiked</a> ' +
        '<span class="trail-note">' + trail.note + "</span>" +
        "</li>";
    }
  }

  // Task 2: filter as the visitor types. Listen for "input" events on the
  // search box and re-render the trails whose name contains the typed text,
  // ignoring upper and lower case. An empty box shows every trail.
  // TODO Task 2: attach the listener here.

  // Task 3: one delegated click listener on the LIST handles every
  // "Mark hiked" link, including links rendered after the listener was added.
  // Use the event's target to find the clicked link, toggle the "hiked" class
  // on its list item, and call preventDefault() so the link does not navigate.
  // TODO Task 3: attach the one listener here.

  // Task 5: show one trail's conditions with a promise chain. Call
  // window.trailApi.fetchConditions(name) and chain .then and .catch:
  //   success: status shows "NAME: REPORT"       (for example "Lake Loop: clear and dry")
  //   failure: status shows "Conditions unavailable for NAME."
  function showConditions(name) {
    statusBox.textContent = "TODO: conditions for " + name;
  }

  // Task 5: load several trails' conditions together with Promise.all:
  //   all succeed: status shows "N condition reports loaded." (N = names.length)
  //   any failure: status shows "Some condition reports are unavailable."
  function showAllConditions(names) {
    statusBox.textContent = "TODO: " + names.length + " reports";
  }

  // Task 6: rewrite the refresh flow with async and await. refreshDashboard
  // must be an async function that awaits fetchConditions("Summit Climb")
  // inside try/catch:
  //   success: status shows "Featured today: Summit Climb (REPORT)."
  //   failure: status shows "Featured conditions are unavailable right now."
  function refreshDashboard() {
    statusBox.textContent = "TODO: refresh the featured conditions";
  }

  refreshButton.addEventListener("click", function () {
    refreshDashboard();
  });

  renderTrails(window.trailData);

  window.app = {
    renderTrails: renderTrails,
    showConditions: showConditions,
    showAllConditions: showAllConditions,
    refreshDashboard: refreshDashboard,
  };
})();
