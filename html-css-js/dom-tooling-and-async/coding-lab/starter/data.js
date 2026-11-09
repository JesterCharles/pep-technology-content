// Trail Guides data, including the latest visitor note per trail. Do not edit:
// the tests load this file as-is.
//
// Visitor notes are untrusted text typed by site visitors. One note below
// carries a script-running payload, exactly like a real attack: if the page
// ever puts it into the document as HTML, it sets window.__xss. Task 4 is done
// when that text appears on the page as plain text and the flag stays unset.
"use strict";

window.trailData = [
  { id: 1, name: "Lake Loop", distanceKm: 5, difficulty: "easy", note: "Dry and sunny all the way round." },
  { id: 2, name: "Ridge Walk", distanceKm: 9, difficulty: "moderate", note: "Windy on the top section." },
  { id: 3, name: "Forest Path", distanceKm: 4, difficulty: "easy", note: "Great views! <img src=x onerror=\"window.__xss=true\"> 5/5 would hike again" },
  { id: 4, name: "Summit Climb", distanceKm: 14, difficulty: "hard", note: "Take poles for the last kilometre." },
  { id: 5, name: "River Trail", distanceKm: 7, difficulty: "easy", note: "Two muddy stretches after rain." },
  { id: 6, name: "Canyon Route", distanceKm: 11, difficulty: "hard", note: "Check the weather before you go." },
];
