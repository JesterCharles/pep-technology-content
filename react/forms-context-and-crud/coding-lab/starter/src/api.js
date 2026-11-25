// fetchJson is finished part-2 work; treat it as given.
export async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

/*
TASK 4 (part 1). Write the helper every mutating request goes through.
sendJson(url, method, body) must:
  - call fetch with the given method, a Content-Type: application/json header
    and the body as a JSON string;
  - when the response is ok: return the parsed JSON body (and null for a
    204 No Content response);
  - when it is not ok: throw an Error whose message is `HTTP ${status}`, with
    two extra properties attached: status (the number) and details (the parsed
    response body, or null if it cannot be parsed). The form uses
    error.details.errors to show the server's field errors.
*/
export async function sendJson(url, method, body) {
  // TODO: implement as described above
  throw new Error("sendJson is not implemented yet");
}

/*
TASK 4 (part 2) / TASK 6. Implement the three calls the pages use, on top of
sendJson:
  - createService(values): POST   /api/services
  - updateService(id, values): PUT    /api/services/<id>
  - deleteService(id): DELETE /api/services/<id>
*/
export function createService(values) {
  // TODO
  throw new Error("createService is not implemented yet");
}

export function updateService(id, values) {
  // TODO
  throw new Error("updateService is not implemented yet");
}

export function deleteService(id) {
  // TODO
  throw new Error("deleteService is not implemented yet");
}
