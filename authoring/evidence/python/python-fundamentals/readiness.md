# Python Fundamentals readiness (minimum release, owner evidence)

Recorded 2026-11-08 by the original implementation owner of this module (authoring agent). This is owner evidence, not an independent review.

## Scope of this record

- Release path: the 2026-11-08 PEP minimum release, direct update of PR 57. No further specialist round was run for this update.
- Current main is merged in with a normal merge commit (`72265e74`, parents `31dc6051` and main `e9a8aa28`). No commit was rebased, squashed, amended or dropped.
- Learner bytes are unchanged. Every learner file matches the bytes the module's independent education and Python-SME critics approved, so their existing current-hash coverage still applies (T25 passes on the full critic profile). No minimum acceptance profile is claimed for these pages.
- Practice honesty: no learner byte needed simplifying. Each practice editor already states that it is a bounded checker for the taught forms, that it does not run Python, and that real Python belongs in a local interpreter.

## Current learner hashes (sha256)

| Topic | `artifact.html` | `artifact.gift` | `artifact.md` | `video-artifact.md` |
|---|---|---|---|---|
| exceptions-and-logging | `3303cc0b00c77063a1964d419897356a540ec9e8fcf9f46e2f0a919a651e7d35` | `08808251345bab7e45a6259e94796c0791fa289ebb0248417925b6c44d9159f5` | `df1aa65e06fd5c187807c2a4898529e06dd22a3cbaacbecde8d1eab014618aac` | `2ee65420bf806ce776e8789a4f5a6435e7f2c022649dcc0e490b9a8eda4f01de` |
| functions-and-arguments | `3933e48ce5b294dc4ad3348041944d6e87fe6d99be3e087f5f1826792ab109c4` | `79366f771765e2f7d85acaf9da8cd32559f69ff3c5a042695cbc0a698646b8b2` | `dec55d2053c6afc4f8ae0c8c595acf0a5297083e2c157b4ef069a3bcff3f867f` | `09ac638a8452f95e07fe3baab3b18c47998262161b6545e96c820a3695ae4514` |
| lists-dicts-sets-and-tuples | `d6036a71696e191d1a8ccfa7e3bf375c06141003c4d34e2c92b5a4eacbc44035` | `182f018e94751c9fdc73eef5626b0331ff15fac531257707fe9187055476b661` | `c821efc1760139e733e073e4b7f9d5642046bbe05137e9daa7a318f84830d748` | `a22fcafe2c414b0edc49c801dd09cdebd0331b8facdfbbc67bcf25c315cd3027` |
| modules-imports-and-virtual-environments | `1e94092ad03f792ce6d7c2b0de3a9dc2193cb8322b671b2bdf99e95f11e6036e` | `f5b2bbd7b3ed35175209d13979ffdb2b561b8582c01be63a49c199bb0ab70c40` | `1bc0735c230a4dc71dd9c9163cd7c206e23309c470195d2eddfb1ca170376cfb` | `114ef462dd4a0fd651842d75dad86a7edde2f69921bed9040a148cb656cc3da5` |
| mutability-and-aliasing | `7bc3b57b3916132be4b9a5a3e80d3b2c2c0eac9a466fbc9ca6d4f325832e360a` | `257ad222d8ef460d050a3c5be5abb512bdd5fdc254a0eab1e988b48c95c26174` | `36c577a293a98aa3ac073d66e4e95424b0c3f1401d5b2cc2f52a140d0515cf57` | `4f22afe2acb74c38425f9fbd9528609340f5f5912a942665af65fd7b53c2d388` |
| python-syntax-for-java-developers | `b6fb8107839ff6e65c7fedbb2eed19032eb35773ca0fcdc10646bfcb5f56f4a4` | `22e9a17f65a8dcc7ead764fe7a67dda8e9a653ea65abdb0c2c8f1391a4c95220` | `e21b4b3093e41e20c22940c75ac8767211b6c97a8c45909c8da3b2e9abde6eb5` | `be04ad857afe52c9b3e79ae66b98d556c39aaac31d378bc5d5410928175350a9` |
| slicing-and-comprehensions | `9c86419861293a9a73c2036d07bd7a15f8b95de868592ef843acb12fdc93e3cb` | `a7679445bd787fe1c9dae8651d715132bbf133c3efa2becb6ee56de904da7091` | `3546290be4d45e5f1bc30af053a34090f6f9b8771b08f51252ba2b18328deafd` | `e1daffea77a6036325872ae3f9dc8883d4583ebdfb0a8374884c211536165ba7` |
| testing-with-pytest | `8816bc7d77c2854c9f43b5ae538c6a1a51a39d1df1b9fca8fa2fff789e9fbadf` | `be413144bbefa467ba54580a3845db3303b91f247d36f9f58c6495430a2d6cc5` | `9ddb5edc9ee81dfd5adb4cd0f3962f24675b6f7a0087dfdf22f1660084456b36` | `c278e2615cdb0932e784c1880f511cfb501abc93234935f03ce6bf8549d76019` |
| writing-and-running-script-files | `05342f225cf423b06edb1f5f526cee48d07894c47342c230f7f9cfbfbc711d7c` | `082a0bd1382e10247e4c5f99db0dbbddd362dc0e25eed8d2d64f76ce09798586` | `17358551b65c666c15691f68a0436d21bcf79dc16c2de2207edfc946e02e920b` | `37de45bb0159c93cb37601e29574293662447810cd42334122c5473ad2e0a17e` |

`authoring/catalog/python/python-fundamentals/module.lock.json` is the authoritative full-hash binding for every learner, catalog and evidence file in this module.

## Private-success proofs

- The original receipts (proof commit `d9019be2`, evidence commits `ade9149f`, `575587e6`, `7bf9b89f`, `02eff499`, `645f3b18`) went stale when main changed the bound checker files `authoring/tools/checks/T08-html-static.mjs` (#59) and `authoring/tools/qa/harness.mjs` (#63).
- Commits `f08309c6`, `1f59bf11`, `c8ddc8bf`, `aaec23a2` and `31dc6051` were written by a pipeline fix agent from private inputs it created itself. They were not authorized and are not source-owned. They stay in history only as an audit record and are not counted as proof.
- Replacement: the owner re-runs the five private-success proofs (functions-and-arguments, exceptions-and-logging, writing-and-running-script-files, testing-with-pytest, slicing-and-comprehensions) once, on the final bound bytes, from the original source-owned private inputs. These inputs are staged outside the repository, never printed and retired after use. Each success run is recorded as an evidence-only child commit that changes only its `qa-receipt.json` and the generated module lock. The mixed and all-fail routes must be refused. The receipts themselves hold the run ids and commit bindings.
