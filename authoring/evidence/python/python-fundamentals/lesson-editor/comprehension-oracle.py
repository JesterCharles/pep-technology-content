import json, sys
cases = json.load(open(sys.argv[1]))
out = []
for src in cases:
    try:
        code = compile(src, "comprehensions.py", "exec")
    except SyntaxError as e:
        out.append({"compiled": False, "err": type(e).__name__ + ": " + str(e)}); continue
    g = {}
    try:
        exec(code, g)
        err = None
    except Exception as e:
        err = type(e).__name__ + ": " + str(e)
    res = {}
    for name in ("result", "doubled"):
        if name in g:
            v = g[name]
            res[name] = {"kind": type(v).__name__, "items": sorted(v) if isinstance(v, set) else None, "repr": None if isinstance(v, set) else repr(v)}
    out.append({"compiled": True, "err": err, "res": res})
print(json.dumps(out))
