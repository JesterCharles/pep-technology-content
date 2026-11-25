"""Behaviour checks for the reviews service (README phase 4).

Usage: python service_behavior.py <path to reviews/app/main.py>

Loads the service and sends it requests with FastAPI's TestClient. Every request the
service makes with HTTPX is answered inside this process by a stand-in for the shop
api, so nothing leaves the machine and no port is opened. The stand-in records each
outgoing request (its URL, Authorization header and timeout limits) and can answer
normally or fail the way a real api can: a read timeout, a connect timeout or a
refused connection. Prints one JSON object.
"""
import importlib.util
import json
import os
import secrets
import sys

API_BASE_URL = "http://shop-api.lab.invalid:8080"
os.environ["API_BASE_URL"] = API_BASE_URL

import httpx  # noqa: E402

MODE = {"value": "ok"}
OUTGOING = []


def stand_in(request):
    OUTGOING.append({
        "url": str(request.url),
        "authorization": request.headers.get("authorization"),
        "headers": dict(request.headers),
        "timeout": request.extensions.get("timeout"),
    })
    mode = MODE["value"]
    if mode == "read-timeout":
        raise httpx.ReadTimeout("the stand-in api accepted the connection and sent nothing", request=request)
    if mode == "connect-timeout":
        raise httpx.ConnectTimeout("the stand-in api did not accept the connection in time", request=request)
    if mode == "refused":
        raise httpx.ConnectError("the stand-in api refused the connection", request=request)
    return httpx.Response(200, json={"id": 1, "name": "kettle"}, request=request)


def handle(self, request):
    return stand_in(request)


async def handle_async(self, request):
    return stand_in(request)


httpx.HTTPTransport.handle_request = handle
httpx.AsyncHTTPTransport.handle_async_request = handle_async


def load(path):
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(path))))
    spec = importlib.util.spec_from_file_location("reviews_main_under_test", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    out = {"loaded": False}
    try:
        module = load(sys.argv[1])
        app = module.app
        from fastapi.testclient import TestClient

        # An exception the service does not handle is raised here instead of becoming a
        # bare 500, so the test can name it (a real server answers 500 in that case).
        client = TestClient(app, raise_server_exceptions=True)
    except Exception as e:  # report, do not crash: the learner's file may not load
        out["error"] = f"{type(e).__name__}: {e}"[:300]
        print(json.dumps(out))
        return
    out["loaded"] = True
    token = "Bearer lab-" + secrets.token_hex(8)

    def scenario(mode, headers):
        MODE["value"] = mode
        OUTGOING.clear()
        result = {"status": None, "unhandled": False}
        try:
            r = client.get("/reviews/1", headers=headers)
            result["status"] = r.status_code
        except Exception as e:  # escaped every route-level handler
            if Exception in app.exception_handlers or 500 in app.exception_handlers:
                # The service has its own catch-all handler: answer with what it sends.
                OUTGOING.clear()
                r = TestClient(app, raise_server_exceptions=False).get("/reviews/1", headers=headers)
                result["status"] = r.status_code
            else:  # a real server would answer 500
                result.update(status=500, unhandled=True, error=f"{type(e).__name__}: {e}"[:300])
        result["outgoing"] = list(OUTGOING)
        return result

    out["token"] = token
    out["with_token"] = scenario("ok", {"Authorization": token})
    out["without_token"] = scenario("ok", {})
    out["read_timeout"] = scenario("read-timeout", {"Authorization": token})
    out["connect_timeout"] = scenario("connect-timeout", {"Authorization": token})
    out["refused"] = scenario("refused", {"Authorization": token})
    out["api_base_url"] = API_BASE_URL
    print(json.dumps(out))


if __name__ == "__main__":
    main()
