// Public tests for the Trail API client lab. Run from starter/ with: npm test
import { expect, test } from "vitest";
import {
  apiBaseUrl,
  applyResult,
  createTrailRequest,
  loadTrails,
  problemMessage,
  trailsUrl,
} from "../starter/api.mjs";

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status <= 299,
  status,
  json: async () => body,
});

test("task 1: apiBaseUrl reads VITE_API_URL and rejects a missing address", () => {
  expect(apiBaseUrl({ VITE_API_URL: "https://api.trailguides.test" })).toBe(
    "https://api.trailguides.test",
  );
  expect(
    apiBaseUrl({ VITE_API_URL: "http://localhost:8080/" }),
    "a trailing slash on the configured address must be removed",
  ).toBe("http://localhost:8080");
  expect(
    () => apiBaseUrl({}),
    "a missing VITE_API_URL must throw instead of guessing an address",
  ).toThrowError(/VITE_API_URL/);
  expect(() => apiBaseUrl({ VITE_API_URL: "" })).toThrowError(/VITE_API_URL/);
});

test("task 2: trailsUrl builds the trails endpoint with encoded query filters", () => {
  const base = "http://localhost:8080";
  expect(trailsUrl(base)).toBe("http://localhost:8080/api/trails");
  expect(trailsUrl(base, {})).toBe("http://localhost:8080/api/trails");
  expect(trailsUrl(base, { difficulty: "easy" })).toBe(
    "http://localhost:8080/api/trails?difficulty=easy",
  );
  expect(trailsUrl(base, { difficulty: "easy", maxKm: 10 })).toBe(
    "http://localhost:8080/api/trails?difficulty=easy&maxKm=10",
  );
  expect(
    trailsUrl(base, { difficulty: "short & easy" }),
    "filter values must be URL-encoded, not pasted into the string",
  ).toBe("http://localhost:8080/api/trails?difficulty=short+%26+easy");
  expect(trailsUrl(base, { maxKm: 10 })).toBe("http://localhost:8080/api/trails?maxKm=10");
});

test("task 3: createTrailRequest posts JSON with the right method, header and body", () => {
  const trail = { name: "Bog Walk", distanceKm: 3, difficulty: "easy" };
  const { url, init } = createTrailRequest("http://localhost:8080", trail);
  expect(url).toBe("http://localhost:8080/api/trails");
  expect(init.method).toBe("POST");
  expect(
    init.headers?.["Content-Type"],
    "the server only parses the body as JSON when the Content-Type header says so",
  ).toBe("application/json");
  expect(JSON.parse(init.body)).toEqual(trail);
});

test("task 4: problemMessage maps ProblemDetail responses to learner-facing text", () => {
  expect(
    problemMessage({
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "distanceKm must be greater than 0",
    }),
  ).toBe("Check and try again: distanceKm must be greater than 0");
  expect(
    problemMessage({ type: "about:blank", title: "Not Found", status: 404 }),
    "a 4xx problem without a detail falls back to its title",
  ).toBe("Check and try again: Not Found");
  expect(
    problemMessage({
      type: "about:blank",
      title: "Internal Server Error",
      status: 500,
      detail: "NullPointerException in TrailService.java line 42",
    }),
    "server internals must never reach the page",
  ).toBe("Something went wrong on the server. Try again later.");
  expect(
    problemMessage({ type: "about:blank", title: "Bad Gateway", status: 502 }),
  ).toBe("Something went wrong on the server. Try again later.");
});

test("task 5: loadTrails distinguishes network failure, HTTP error and success", async () => {
  const trails = [{ name: "Lake Loop", distanceKm: 5 }];
  const okFetch = async (url) => {
    expect(url, "loadTrails must request the URL built by trailsUrl").toBe(
      "http://localhost:8080/api/trails",
    );
    return jsonResponse(200, trails);
  };
  await expect(loadTrails(okFetch, "http://localhost:8080")).resolves.toEqual({
    state: "loaded",
    trails,
  });

  const failingFetch = async () => {
    throw new TypeError("fetch failed");
  };
  await expect(
    loadTrails(failingFetch, "http://localhost:8080"),
    "a rejected fetch means the request never got an HTTP answer: that is a network error, not an HTTP error",
  ).resolves.toEqual({
    state: "network-error",
    message: "Check your connection and try again.",
  });

  const notFoundFetch = async () =>
    jsonResponse(404, {
      type: "about:blank",
      title: "Not Found",
      status: 404,
      detail: "No trails are published yet",
    });
  await expect(
    loadTrails(notFoundFetch, "http://localhost:8080"),
    "fetch resolves on HTTP error statuses: response.ok tells them apart",
  ).resolves.toEqual({
    state: "http-error",
    status: 404,
    message: "Check and try again: No trails are published yet",
  });
});

test("task 6: applyResult updates the page model without mutating the old one", () => {
  const model = Object.freeze({
    trails: Object.freeze([{ name: "Lake Loop", distanceKm: 5 }]),
    status: "ready",
    message: "",
  });
  const loaded = applyResult(model, {
    state: "loaded",
    trails: [{ name: "Ridge Walk", distanceKm: 9 }],
  });
  expect(loaded).toEqual({
    trails: [{ name: "Ridge Walk", distanceKm: 9 }],
    status: "ready",
    message: "",
  });
  expect(loaded, "applyResult must return a new model object").not.toBe(model);

  const failed = applyResult(model, {
    state: "http-error",
    status: 500,
    message: "Something went wrong on the server. Try again later.",
  });
  expect(failed).toEqual({
    trails: [{ name: "Lake Loop", distanceKm: 5 }],
    status: "error",
    message: "Something went wrong on the server. Try again later.",
  });
  expect(model.status, "the old model must stay unchanged").toBe("ready");
});
