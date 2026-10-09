#!/usr/bin/env python3
"""Static time estimate for a PEP reading-artifact.html.
P50 = prose words / 200 wpm + code-block lines / 15 per min + sum(interaction costs); P90 = P50 * 1.45.
Pass: P50 <= budget and P90 <= 1.45 * budget, interaction share 40-75%."""
import sys, re, json
from html.parser import HTMLParser
WPM, LPM, SLOW = 200, 15, 1.45
COST_S = {"predict":30, "mcq":45, "explore":20, "terminal_step":35, "drag":60, "slider":30, "confidence":5}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.stack=[]; s.words=0; s.code=0; s.inter={}; s.main=False; s.skip=0; s.pre=0
    def handle_starttag(s, tag, a):
        if tag in ("br","input","meta","link","img"): return
        a=dict(a); cls=(a.get("class") or "").split()
        sk=("data-section-skip" in a) or "q" in cls or "mission" in cls or tag in ("script","style") or a.get("id")=="metrics" or "progress" in cls
        s.stack.append((tag,sk)); s.skip+=sk; s.pre+=(tag=="pre")
        if tag=="main": s.main=True
        it=a.get("data-interaction")
        if it:
            k="terminal_step" if it=="terminal" else it
            s.inter[k]=s.inter.get(k,0)+(int(a.get("data-steps","1")) if it=="terminal" else 1)
            if "data-confidence" in a: s.inter["confidence"]=s.inter.get("confidence",0)+1
    def handle_endtag(s, tag):
        while s.stack:
            t,sk=s.stack.pop(); s.skip-=sk; s.pre-=(t=="pre")
            if t=="main": s.main=False
            if t==tag: break
    def handle_data(s, d):
        if not s.main or s.skip: return
        if s.pre: s.code+=len([l for l in d.splitlines() if l.strip()]); return
        s.words+=len(re.findall(r"\S+", d))
path=sys.argv[1]; html=open(path,encoding="utf-8").read()
m=re.search(r'name="pep:budget-minutes" content="([\d.]+)"', html); budget=float(m.group(1)) if m else 7
p=P(); p.feed(html)
inter=sum(COST_S[k]*v for k,v in p.inter.items())/60; p50=p.words/WPM+p.code/LPM+inter; p90=p50*SLOW
share=inter/p50 if p50 else 0
print(json.dumps({"budget":budget,"words":p.words,"code_lines":p.code,"interactions":p.inter,
  "p50":round(p50,2),"p90":round(p90,2),"interaction_share":round(share,2),
  "pass":p50<=budget and p90<=budget*SLOW and 0.40<=share<=0.75},indent=2))
