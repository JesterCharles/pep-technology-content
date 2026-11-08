import json, sys, io, contextlib
class Budget(Exception): pass
def guard():
    n=[0]
    def tr(f,e,a):
        n[0]+=1
        if n[0]>300000: raise Budget()
        return tr
    sys.settrace(tr)

cases = json.load(open(sys.argv[1]))
out = []
for c in cases:
    src = c["src"]
    try:
        code = compile(src, "describe.py", "exec")
    except SyntaxError as e:
        out.append({"compiled": False, "err": type(e).__name__ + ": " + str(e)}); continue
    if "run" not in c or (c["run"]["error"] and c["run"]["error"]["kind"] == "limit"):
        out.append({"compiled": True}); continue
    g = {}; buf = io.StringIO(); err = None
    with contextlib.redirect_stdout(buf):
        guard()
        try: exec(code, g)
        except Budget: err='BUDGET'
        except Exception as e: err = type(e).__name__ + ": " + str(e)
    lines = buf.getvalue().split("\n")[:-1]
    res = None
    if not err:
        res = []
        for a in (1, 10, 100):
            f = g.get("describe")
            if not callable(f): res.append("missing"); continue
            guard()
            try:
                with contextlib.redirect_stdout(buf): res.append(repr(f(a)))
            except Budget: res.append('limit')
            except Exception as e: res.append(type(e).__name__ + ": " + str(e))
    sys.settrace(None)
    lines = buf.getvalue().split("\n")[:-1]
    out.append({"compiled": True, "run": {"out": lines, "err": err, "res": res}})
print(json.dumps(out))
