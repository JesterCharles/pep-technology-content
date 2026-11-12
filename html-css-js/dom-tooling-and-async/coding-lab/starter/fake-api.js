// A fake trail-conditions API for this lab. Do not edit: the tests rely on
// its exact behavior.
//
// window.trailApi.fetchConditions(name) behaves like a network call: it
// returns a Promise that settles a moment later. It resolves with a short
// conditions report for every trail except "Canyon Route", whose report is
// always unavailable, so your code has a guaranteed rejection to handle.
"use strict";

window.trailApi = (function () {
  const reports = {
    "Lake Loop": "clear and dry",
    "Ridge Walk": "strong wind above the treeline",
    "Forest Path": "clear and shaded",
    "Summit Climb": "snow on the final ascent",
    "River Trail": "muddy in places",
  };

  function fetchConditions(name) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (Object.prototype.hasOwnProperty.call(reports, name)) {
          resolve(reports[name]);
        } else {
          reject(new Error("conditions report unavailable for " + name));
        }
      }, 5);
    });
  }

  return { fetchConditions: fetchConditions };
})();
