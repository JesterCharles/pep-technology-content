# Foundation 106 first-build snapshot receipt

> Snapshot only: every listed learner HTML page is copied byte-for-byte from its source checkpoint. A first build is not by itself independently reviewed, upload-safe, or approved for learner use.

## Identity proof

- Authoritative denominator: **106** unique Foundation topic ids from the four current catalog course/module/topic orders, excluding three `kind: "lab-brief"` entries.
- Canonical learner files: **106** `artifact.html` files.
- Duplicate topic ids: **0**.
- Canonical source-byte mismatches: **0**.
- Aggregate input: UTF-8 lines in sorted topic-id order, each `topic_id\tcanonical_source_path\tartifact_sha256\n`.
- Aggregate SHA-256: `3dd64aa84292d0d434239e1056755a9488c51dd635a8143231a609729495563f`.

## Truth labels

- Independently reviewed at these exact HTML bytes: **40 / 106** (the 31 already approved on `main`, plus the nine Methods and Recursion pages with completed exact-byte education and Java-SME review records).
- Upload-safe and approved for learner use: **31 / 106** (only the already-approved subset on `main`).
- First-build-only and not approved for learner use: **66 / 106**.
- The nine reviewed Methods and Recursion pages are not labeled upload-safe here because the preserved record does not complete their post-integration delivery validation.

| Course | Topics |
|---|---:|
| `git-linux-ai-foundations` | 19 |
| `java-foundations` | 53 |
| `sql-jdbc-foundations` | 19 |
| `collections-streams` | 15 |

## Module sources and status

| Module | Topics | Source checkpoint | Exact-byte reviewed | Upload-safe |
|---|---:|---|---|---|
| `git-linux-ai-foundations/linux-foundations` | 5 | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | yes | yes |
| `git-linux-ai-foundations/git-foundations` | 9 | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | yes | yes |
| `git-linux-ai-foundations/ai-foundations` | 5 | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | yes | yes |
| `java-foundations/java-basics` | 7 | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | yes | yes |
| `java-foundations/methods-and-recursion` | 9 | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | yes | no |
| `java-foundations/arrays-lists-and-maps` | 4 | `903df62a08e84e4857c04b69728b6a1003b7066a` | no | no |
| `java-foundations/classes-and-objects` | 9 | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | no | no |
| `java-foundations/inheritance-and-design` | 9 | `188484b0c6896e627bef43e5931369250a93ebe1` | no | no |
| `java-foundations/exceptions-and-logging` | 5 | `7080288d01bcd979245094fa2c363728e52fd69e` | no | no |
| `java-foundations/http-and-javalin` | 4 | `9b58cf9896afd75ab86871f69f1d4d3304f0d1c5` | no | no |
| `java-foundations/testing-and-java-review` | 6 | `c30ca6dcd36204a19516d12d049ee656e6262d63` | no | no |
| `sql-jdbc-foundations/relational-design` | 5 | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | yes | yes |
| `sql-jdbc-foundations/crud-aggregates-and-joins` | 8 | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | no | no |
| `sql-jdbc-foundations/reporting-indexes-and-review` | 6 | `1273722d56d078a7075bd4a6dd8415c5088f3733` | no | no |
| `collections-streams/collections-in-depth` | 9 | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | no | no |
| `collections-streams/lambdas-and-streams` | 6 | `efc5108fa6988622798ab2ae51a88e087c39081c` | no | no |

## Required-check compatibility

The owning checkpoint for each of the following pages has no `artifact.md`, and its topic manifest truthfully records Markdown as absent:

- `sql-jdbc-foundations/crud-aggregates-and-joins/aggregate-functions/artifact.html`
- `sql-jdbc-foundations/crud-aggregates-and-joins/anti-joins-and-self-joins/artifact.html`
- `sql-jdbc-foundations/crud-aggregates-and-joins/filtering-and-sorting/artifact.html`
- `sql-jdbc-foundations/crud-aggregates-and-joins/group-by-and-having/artifact.html`
- `sql-jdbc-foundations/crud-aggregates-and-joins/handling-nulls-coalesce-and-case/artifact.html`
- `sql-jdbc-foundations/crud-aggregates-and-joins/inner-and-left-joins/artifact.html`

Running `node authoring/tools/qa/md-from-html.mjs <path> /tmp/artifact.md` against each exact page fails with `Error: interactions missing author-written data-static-alt: mcq`. T18 requires every HTML topic to declare and include its exact deterministic Markdown derivation. No checkpoint-owned companion exists, and authoring the missing static alternative would change `artifact.html`; therefore no integration-only T18 remedy exists under this snapshot's byte-preservation rule.

T25 is also expected to report missing current independent critic coverage for first-build-only pages. This is a truthful readiness result, not approval evidence.

## Per-topic byte receipt

| Authoritative topic id | Source checkpoint | Canonical source path | SHA-256 |
|---|---|---|---|
| `git-linux-ai-foundations/linux-foundations/navigating-the-shell` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/linux-foundations/navigating-the-shell/artifact.html` | `03a7dac0487ebd4957cab93e40252b3c8cd6394a0f8eb7de5bd02db4818ac38b` |
| `git-linux-ai-foundations/linux-foundations/pipes-and-grep` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/linux-foundations/pipes-and-grep/artifact.html` | `bd76b2698547bef30d9df0151b2a783be0694e909f24b99e56350de7a85c684d` |
| `git-linux-ai-foundations/linux-foundations/file-permissions` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/linux-foundations/file-permissions/artifact.html` | `d5be78f53cc75c60e6006ef169c84bf07ad96a87566326e87e4488437102c30f` |
| `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets/artifact.html` | `4f2584bf4912a2464b9f7c236f3ec0586031c097f88a60016aa9edf0f54a7534` |
| `git-linux-ai-foundations/linux-foundations/localhost-and-ports` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/linux-foundations/localhost-and-ports/artifact.html` | `bceb97d8984cba21334c1b1333ca6717fc19fe91b3758de626e9c7a98b4d8e13` |
| `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore/artifact.html` | `700b0ce64411a5b85890e2c463462c871c43b4597b55647ce1385514aa5adeeb` |
| `git-linux-ai-foundations/git-foundations/branches-and-switching` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/branches-and-switching/artifact.html` | `d3ae5a9feb1a92cd7f7841f9b744371796ab12fa04bd411c166b15d44bc24408` |
| `git-linux-ai-foundations/git-foundations/undoing-revert-and-reset` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/undoing-revert-and-reset/artifact.html` | `edf53065a03ab80ff2b6cc835949e328dc06d2aa2b7d776b7ba0bb6560f9f922` |
| `git-linux-ai-foundations/git-foundations/stash` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/stash/artifact.html` | `6a0684d0fc8ae100f3a58f7ba5add5f94ca18f63031fc68433a5105cbc220d1c` |
| `git-linux-ai-foundations/git-foundations/remotes-clone-push-fetch-pull` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/remotes-clone-push-fetch-pull/artifact.html` | `3aedf30890acb518b87180e5d44b1373fcf5b311832b2c7ad4073700674abdb4` |
| `git-linux-ai-foundations/git-foundations/merge-conflicts` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/merge-conflicts/artifact.html` | `af9d97a5c380095da16e64d8b0431d2175144d1a3ba8fec532a812c499127219` |
| `git-linux-ai-foundations/git-foundations/merge-vs-rebase` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/merge-vs-rebase/artifact.html` | `9e69a85880f2ab1e6ec834c7c13fdb76616741dad1dbd4079d557ad8a938b1c7` |
| `git-linux-ai-foundations/git-foundations/pull-requests-and-review` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/pull-requests-and-review/artifact.html` | `91e783c28484ea87bc941c7302e3f39b3abed043118689404603b078fbd48816` |
| `git-linux-ai-foundations/git-foundations/git-and-shell-review` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/git-foundations/git-and-shell-review/artifact.html` | `ca06aebba10d41479a65edf86b56796768ba71c6fdeff737aa2ab4e2494ab9c9` |
| `git-linux-ai-foundations/ai-foundations/ai-assistant-setup` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/ai-foundations/ai-assistant-setup/artifact.html` | `0bd3b721a45e86f4e7e53dca4197e77cffba798a23163048f4903271ac546f5c` |
| `git-linux-ai-foundations/ai-foundations/ai-rules-of-use` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/ai-foundations/ai-rules-of-use/artifact.html` | `8d8b035458165ece232a6962ca51f24ced6710af6a958d1ea58948ec2c7f323b` |
| `git-linux-ai-foundations/ai-foundations/agile-scrum-user-stories` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/ai-foundations/agile-scrum-user-stories/artifact.html` | `6726ddfcb2eb3c8282507d86dec5daf2e5cca485c2589fdaffecda9317f07195` |
| `git-linux-ai-foundations/ai-foundations/checking-ai-changes` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/ai-foundations/checking-ai-changes/artifact.html` | `d8cfd72692c96c8d464b8a4544dc90581a4afa567e99db47c51f846b9198327a` |
| `git-linux-ai-foundations/ai-foundations/foundations-course-check` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `git-linux-ai-foundations/ai-foundations/foundations-course-check/artifact.html` | `5d90ca9bfff84f77c15120f867b7a1b0d3b6e218c73f1de4f83409f7806f5cee` |
| `java-foundations/java-basics/installing-java-and-the-ide` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/installing-java-and-the-ide/artifact.html` | `d421969cdcd69287931b89cb3978533aaf0fb319b8bf4ee53b088d1c98ffb346` |
| `java-foundations/java-basics/running-a-first-program` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/running-a-first-program/artifact.html` | `0c78268e0e50313cd370ac6dad733158e590bfc943577e0381de0ff904e54e01` |
| `java-foundations/java-basics/primitive-types-and-variables` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/primitive-types-and-variables/artifact.html` | `0c7cf1f0d33e9d1be033568c48a9081f0cd7a1a17af10d609e4e8512607e2ece` |
| `java-foundations/java-basics/strings-and-string-methods` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/strings-and-string-methods/artifact.html` | `db565c5fffb8efa52a669d69c87ff2712b1d59df380c92b81c3df86089ca2083` |
| `java-foundations/java-basics/arithmetic-comparison-and-logical-operators` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/arithmetic-comparison-and-logical-operators/artifact.html` | `035c786a429df33df62f13e3962d0c86e87ab596db58af4a0dc3d0e631609c34` |
| `java-foundations/java-basics/if-else-and-switch` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/if-else-and-switch/artifact.html` | `8afccdd923b586e16d2fb25e096c9409b7a263a1e41ea83049dcafa3c53cdb2b` |
| `java-foundations/java-basics/for-while-and-do-while-loops` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `java-foundations/java-basics/for-while-and-do-while-loops/artifact.html` | `c5a3141bfe5df38afebca06c4adaeff5f9092d5fec38c404b75d643caf834ff7` |
| `java-foundations/methods-and-recursion/writing-methods` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/writing-methods/artifact.html` | `85950d0f8dd34c39ce1008bc933d6d5381222b863f1ecc79dcf39b8444ae2565` |
| `java-foundations/methods-and-recursion/method-overloading` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/method-overloading/artifact.html` | `38f9de81f3d613efa3d5bf8a42ab4471dd3510b4a5d9637fa583e86bdcf59c29` |
| `java-foundations/methods-and-recursion/static-members-and-methods` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/static-members-and-methods/artifact.html` | `01f537f275cf0526d462a10c15b88d65e8f1132dd475997aad35a2fc1dfa920e` |
| `java-foundations/methods-and-recursion/pass-by-value` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/pass-by-value/artifact.html` | `46f1227a9b885bbdd3960f33a81de6f611c60be657fda4b8a4cb6958bd30721f` |
| `java-foundations/methods-and-recursion/method-practice` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/method-practice/artifact.html` | `e1fcd8d76c7d80e600cff1b1fe6335dfd53c14c3a038a87cfa209eb9f8ae60e6` |
| `java-foundations/methods-and-recursion/recursion-and-the-call-stack` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/recursion-and-the-call-stack/artifact.html` | `000a391ed8f54bf3e546926c03b7de5433ec9df9d16753dbfe0a486436f69ce5` |
| `java-foundations/methods-and-recursion/two-pointers-reversing-and-counting` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/two-pointers-reversing-and-counting/artifact.html` | `de928ce7396b8f19e8150bab0e26ac6e9ef4701f7d6d49a3990488bdb6c65bc8` |
| `java-foundations/methods-and-recursion/debugging-with-breakpoints` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/debugging-with-breakpoints/artifact.html` | `4f3da9a9e89266e9c47354314389fb41bf6acc8313c9c638fd4fe4bfe8c67313` |
| `java-foundations/methods-and-recursion/ai-assistants-explain-not-answer` | `2ecddbdd49afd42fbd9f10546d7ef22b159a1c55` | `java-foundations/methods-and-recursion/ai-assistants-explain-not-answer/artifact.html` | `1e76d7b22d7d56905e7f15c8f34c69c27dec93c6937bfab50e9abcc299675329` |
| `java-foundations/arrays-lists-and-maps/declaring-and-looping-over-arrays` | `903df62a08e84e4857c04b69728b6a1003b7066a` | `java-foundations/arrays-lists-and-maps/declaring-and-looping-over-arrays/artifact.html` | `8fa3facd3ec482af7251970288ec928b8757a47e4b611ef54321739c6ef514af` |
| `java-foundations/arrays-lists-and-maps/linear-and-binary-search` | `903df62a08e84e4857c04b69728b6a1003b7066a` | `java-foundations/arrays-lists-and-maps/linear-and-binary-search/artifact.html` | `c7643ae0a8f241d990880257c360a2a9cc42bf892647fa4efc796f2f208e0d57` |
| `java-foundations/arrays-lists-and-maps/arraylist-basics` | `903df62a08e84e4857c04b69728b6a1003b7066a` | `java-foundations/arrays-lists-and-maps/arraylist-basics/artifact.html` | `f8154c6311a959916e9a9091d7f2fc5dec9acc413305b715b6410e3aad4e39c4` |
| `java-foundations/arrays-lists-and-maps/hashmap-basics` | `903df62a08e84e4857c04b69728b6a1003b7066a` | `java-foundations/arrays-lists-and-maps/hashmap-basics/artifact.html` | `a3ed63d5ef83c052d8e4c64b55ca9dd4d1a08b6bddf7efbf829623f89361abf4` |
| `java-foundations/classes-and-objects/classes-and-objects` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/classes-and-objects/artifact.html` | `bd43efa5f6b02bf3b82026fae973922708d3d0a2199e8dd35f9567d902c21f90` |
| `java-foundations/classes-and-objects/constructors` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/constructors/artifact.html` | `f2c637b37b65f39117335c5c4dbe752b9cb689a59049854dc7e815f8425f4c5b` |
| `java-foundations/classes-and-objects/access-modifiers` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/access-modifiers/artifact.html` | `7acfc37840c4bf86ef929aadab181ed6d954ae7cf3a03e6ec918caac0164104b` |
| `java-foundations/classes-and-objects/encapsulation-with-getters-and-setters` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/encapsulation-with-getters-and-setters/artifact.html` | `2e24812095df1a3e8899dc286b7e3615da578a80ff2b4d55afef4f4c22797725` |
| `java-foundations/classes-and-objects/stack-vs-heap-and-object-references` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/stack-vs-heap-and-object-references/artifact.html` | `71354d66e5677c0b6cf8e7118943cd7de18e760ab61908f3f269dcac71d12b2c` |
| `java-foundations/classes-and-objects/string-immutability` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/string-immutability/artifact.html` | `14e9b2418f7e1efab475395b184e4a432a3b81dbe5f0998e12e924200dd6d1a7` |
| `java-foundations/classes-and-objects/double-equals-vs-equals` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/double-equals-vs-equals/artifact.html` | `ed33f92a8a8bd2b25ec68cff83ee2a18d463387331c587c9dd5ae4d7a1135295` |
| `java-foundations/classes-and-objects/final-and-tostring` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/final-and-tostring/artifact.html` | `0f8eca3608ea9048015fa2e6234a663f8798f3db7ed695c62a843d748dd202a5` |
| `java-foundations/classes-and-objects/enums` | `e0dbbc3df7cf2c44b63e3bc156b2d9bdcc050886` | `java-foundations/classes-and-objects/enums/artifact.html` | `23f2bcde3df45e8c3a274aaaf15f7fdc2049702dd0d805efac38bf667766d09e` |
| `java-foundations/inheritance-and-design/inheritance` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/inheritance/artifact.html` | `4574f5e3b2357a17d40e246f313a367d29ce96134e913ef070fb2264f16a80db` |
| `java-foundations/inheritance-and-design/polymorphism-overriding-vs-overloading` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/polymorphism-overriding-vs-overloading/artifact.html` | `645384fbe23effa4ba739aa65e2cf57038776d6e9ff300a646f93aaddc01ef5f` |
| `java-foundations/inheritance-and-design/abstract-classes` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/abstract-classes/artifact.html` | `281b199c4dcefb67ac08b1fbd25e247946595db8944d057e7fecbb09bf8db135` |
| `java-foundations/inheritance-and-design/interfaces-and-default-methods` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/interfaces-and-default-methods/artifact.html` | `05ca75a6ebde65e82af4a48516bd4caaebfeb91b4b75358bcaf9fbe5cae0412a` |
| `java-foundations/inheritance-and-design/composition-over-inheritance` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/composition-over-inheritance/artifact.html` | `c5fb90c5bcb2734a9c4369cc4f4fd91710c8dc4720911fff01f4026d640e4e4c` |
| `java-foundations/inheritance-and-design/solid-basics` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/solid-basics/artifact.html` | `419c4d94295049719066a7d14a0ce6b48c1dbcbd37385ded895877ad7b8dc412` |
| `java-foundations/inheritance-and-design/functional-interfaces-and-anonymous-classes` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/functional-interfaces-and-anonymous-classes/artifact.html` | `ff56f5db1111e415c20899112f0a0db69ee192b32ae4bb8248f2f41b54f68bee` |
| `java-foundations/inheritance-and-design/records` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/records/artifact.html` | `31980a169adc36b09815cb2af9c33ba9bd9da8c1ae7ff7762fe73952d1fa7c10` |
| `java-foundations/inheritance-and-design/singleton-and-factory-patterns` | `188484b0c6896e627bef43e5931369250a93ebe1` | `java-foundations/inheritance-and-design/singleton-and-factory-patterns/artifact.html` | `0687512278d95b787bed8849329a8515fdf241dd6732ac0065d907d4dcd86630` |
| `java-foundations/exceptions-and-logging/checked-vs-unchecked-exceptions` | `7080288d01bcd979245094fa2c363728e52fd69e` | `java-foundations/exceptions-and-logging/checked-vs-unchecked-exceptions/artifact.html` | `c102fd057698095be327b6cb87f6778d3a9aec54ac162e7a65932b68f71140d2` |
| `java-foundations/exceptions-and-logging/try-catch-finally-and-try-with-resources` | `7080288d01bcd979245094fa2c363728e52fd69e` | `java-foundations/exceptions-and-logging/try-catch-finally-and-try-with-resources/artifact.html` | `ecea13d53f19a73222bd211abfbc535a1454915ada334bc05b0476bb78e2dab3` |
| `java-foundations/exceptions-and-logging/custom-exceptions` | `7080288d01bcd979245094fa2c363728e52fd69e` | `java-foundations/exceptions-and-logging/custom-exceptions/artifact.html` | `b6245a88094aa91725c3ffa7ca0bd28e44295931d2b04feb0122a9a5b4bb9408` |
| `java-foundations/exceptions-and-logging/reading-stack-traces` | `7080288d01bcd979245094fa2c363728e52fd69e` | `java-foundations/exceptions-and-logging/reading-stack-traces/artifact.html` | `a568a9b63542c67b215d75b660ece1ec9fec7d4150b3ce5e3696f6c5c6c5912e` |
| `java-foundations/exceptions-and-logging/logging` | `7080288d01bcd979245094fa2c363728e52fd69e` | `java-foundations/exceptions-and-logging/logging/artifact.html` | `f8c005260756452c6ad76d9dbd8897e0034de14b01b8f3d1289825383adcf50f` |
| `java-foundations/http-and-javalin/how-a-request-travels` | `9b58cf9896afd75ab86871f69f1d4d3304f0d1c5` | `java-foundations/http-and-javalin/how-a-request-travels/artifact.html` | `57457ad5fde091d14b4934e68cf945e1b3b455badfa17614ecdf4831437a2bf3` |
| `java-foundations/http-and-javalin/http-methods-status-codes-and-json` | `9b58cf9896afd75ab86871f69f1d4d3304f0d1c5` | `java-foundations/http-and-javalin/http-methods-status-codes-and-json/artifact.html` | `471fd517f7f9c7ef2a346bb70f4026cd3e3d63d96449ad47c3a39634f220778c` |
| `java-foundations/http-and-javalin/routes-and-handlers-in-javalin` | `9b58cf9896afd75ab86871f69f1d4d3304f0d1c5` | `java-foundations/http-and-javalin/routes-and-handlers-in-javalin/artifact.html` | `68e7acf9e068d626ff3e4dd1f080cede2aef4b89cc403415c8033dbf02313f04` |
| `java-foundations/http-and-javalin/lambdas-as-handlers` | `9b58cf9896afd75ab86871f69f1d4d3304f0d1c5` | `java-foundations/http-and-javalin/lambdas-as-handlers/artifact.html` | `41b8d686617a8ed61f9d613bf87b1ba2d8b5c1b2eddaec997815a563b7db1fb6` |
| `java-foundations/testing-and-java-review/junit-test-first` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/junit-test-first/artifact.html` | `2cc5e8ff113c569d481fc610d599c70968b9cf450e0a31104ba679e09644c9fa` |
| `java-foundations/testing-and-java-review/test-doubles-fakes-and-stubs` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/test-doubles-fakes-and-stubs/artifact.html` | `212b62b0b63a538904f84c516216461529932d928e99849d7a4839097d9b8b60` |
| `java-foundations/testing-and-java-review/mocking-with-mockito` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/mocking-with-mockito/artifact.html` | `738becd0e7199a2750267b254b45ab0d4bd193f069acdc0f0d743aa2ca2b1096` |
| `java-foundations/testing-and-java-review/code-coverage` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/code-coverage/artifact.html` | `42177cff145c2fb5fcff2868175fa3a7fd649e7af0dda49f14b9ad421cd7093a` |
| `java-foundations/testing-and-java-review/java-review` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/java-review/artifact.html` | `579ee9e8018094fe6457fd4c70a1b7754250e5f9f5c2964cdbbaa1f25f7b3c07` |
| `java-foundations/testing-and-java-review/reading-older-java-code` | `c30ca6dcd36204a19516d12d049ee656e6262d63` | `java-foundations/testing-and-java-review/reading-older-java-code/artifact.html` | `2045ad2e81e666e974518796908ef76b6c1049710363ab0139130ce89a9a2d6f` |
| `sql-jdbc-foundations/relational-design/installing-postgres-and-a-sql-client` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `sql-jdbc-foundations/relational-design/installing-postgres-and-a-sql-client/artifact.html` | `bc46dd732fa959f4c42d36df7c705d5b495f0118f13270714817b08f835407d1` |
| `sql-jdbc-foundations/relational-design/tables-keys-and-relationships` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `sql-jdbc-foundations/relational-design/tables-keys-and-relationships/artifact.html` | `b6f9ba9795fad7771d779d4788a31c26f3d14b12b733972ee6b07862c2243833` |
| `sql-jdbc-foundations/relational-design/designing-tables-from-a-user-story` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `sql-jdbc-foundations/relational-design/designing-tables-from-a-user-story/artifact.html` | `a09bd52f34de1dfc215134227255fd045aa780562b6bfa3990b60330b05da5c1` |
| `sql-jdbc-foundations/relational-design/normalization-basics` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `sql-jdbc-foundations/relational-design/normalization-basics/artifact.html` | `24e88a528c8baa1840ee06203882f011ffd18d5a13951d71ab9f76b4e842727a` |
| `sql-jdbc-foundations/relational-design/create-table-data-types-and-constraints` | `b80bbc4e4c49d3c35f7f56ab0728dcc0dc3b1c50` | `sql-jdbc-foundations/relational-design/create-table-data-types-and-constraints/artifact.html` | `a3d6af48c455ca1f7644e9c1682ea0c8416651dd8576545ae2e4c44b1c7681af` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/insert-update-and-delete` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/insert-update-and-delete/artifact.html` | `42d701202d388f731f70b21572ece6c0330efcd289c6e543d5da6485ed6fc413` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/seeding-sample-data` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/seeding-sample-data/artifact.html` | `4b7b6dc9d9992e307ca77b464042be29e6ea3a4a3c924ee44833e90994bcfeff` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/filtering-and-sorting` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/filtering-and-sorting/artifact.html` | `a515725a3c5fa719b9bcde3e044268d02f8125b2aceca70bed7a586b21a8d1ad` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/handling-nulls-coalesce-and-case` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/handling-nulls-coalesce-and-case/artifact.html` | `92fb317a8e2b7dbede1b22945dab2358e4002646b0a319cdb6542d9b51665e34` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/aggregate-functions` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/aggregate-functions/artifact.html` | `fbd69cb3ab20db4ceeea457b1d02d5c6b6eda6cf103eb43018d40d18e6272f41` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/group-by-and-having` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/group-by-and-having/artifact.html` | `60330a4d7f92267f2426be3d0cd396048cdd799d769a8f7851ed7fe098d9c164` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/inner-and-left-joins` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/inner-and-left-joins/artifact.html` | `743797822ef1e055a2044dba4f00bca4babdc47e416f45ede8115dbed6f0a5e8` |
| `sql-jdbc-foundations/crud-aggregates-and-joins/anti-joins-and-self-joins` | `97ad33ecf1c072636cfbcdc35100e21cc731c94a` | `sql-jdbc-foundations/crud-aggregates-and-joins/anti-joins-and-self-joins/artifact.html` | `d41de3b5154f790f7b96dd831163688b36185ca5b1a6fde906607de7cc51fbae` |
| `sql-jdbc-foundations/reporting-indexes-and-review/subqueries-and-ctes` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/subqueries-and-ctes/artifact.html` | `1a6d48c1cf6e764d576dbb4b4b5fafd1d46c93b7936cb577af13393099691e91` |
| `sql-jdbc-foundations/reporting-indexes-and-review/window-functions-top-n-per-group` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/window-functions-top-n-per-group/artifact.html` | `0210b4faa879defb041c0f52c4bed9a1e68d3a5c9433f14840988b8c421d0e51` |
| `sql-jdbc-foundations/reporting-indexes-and-review/indexes` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/indexes/artifact.html` | `5d4d6de4698027149b015f3e455addab78efeb770463ff2bfe0a74a81e3de20a` |
| `sql-jdbc-foundations/reporting-indexes-and-review/query-plans-with-explain` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/query-plans-with-explain/artifact.html` | `467f6aa42846ffad4cb19a7cb8a26f44ba8285df748dbdecd78910b5a407b950` |
| `sql-jdbc-foundations/reporting-indexes-and-review/sql-review-joins-grouping-window-functions` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/sql-review-joins-grouping-window-functions/artifact.html` | `617bae2a04cc0e038ffe7308dfb8be3a2cf1e6f60d9342e31f2cc2d0f21a5d0e` |
| `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-review` | `1273722d56d078a7075bd4a6dd8415c5088f3733` | `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-review/artifact.html` | `441a6315d679e192a9d0ff66b8aca45b2edf8be4f5dcb4efd102b4ae7cf7692b` |
| `collections-streams/collections-in-depth/lists-sets-and-maps-in-depth` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/lists-sets-and-maps-in-depth/artifact.html` | `013ff1a15ee15f22124fd02898c19bf06bae4b6420b1526f55f47171add8ca85` |
| `collections-streams/collections-in-depth/stacks-and-queues` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/stacks-and-queues/artifact.html` | `0995bee54d97c3fa3d5bd5c5c8c06f21708a984807a1cfea0da7159ce115bacb` |
| `collections-streams/collections-in-depth/generics` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/generics/artifact.html` | `981a65a9bc7b6fd2cfaaf43364c7b70c4ebeed922d9f4428b9676899e6a820e1` |
| `collections-streams/collections-in-depth/wrapper-types-and-autoboxing` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/wrapper-types-and-autoboxing/artifact.html` | `48ef020f80ecb13f677d0850ffe1fba6f4552b0b83dc0e6ffbb32b08ad87f9a5` |
| `collections-streams/collections-in-depth/big-o-basics` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/big-o-basics/artifact.html` | `6e4f75a3b9c2ec39c1a39ea08c878383fc5c586518fd71a3263d0d26476995fd` |
| `collections-streams/collections-in-depth/the-equals-and-hashcode-contract` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/the-equals-and-hashcode-contract/artifact.html` | `7c93b161061305f9ad28451a9ead1585a1364ce5e7f8f10f5f10882d4ad85a95` |
| `collections-streams/collections-in-depth/how-hashmap-works` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/how-hashmap-works/artifact.html` | `eda6600431b2e3a02363e134b17e4084a7d69702b52398ddfdccdbcbf29a942c` |
| `collections-streams/collections-in-depth/choosing-the-right-collection` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/choosing-the-right-collection/artifact.html` | `a7b4d17908ddfe0cd7cdd1ce0d8070a4b1d4f1a549027177db8e6da8c33c018c` |
| `collections-streams/collections-in-depth/sorting-with-comparator` | `95fc71d3b17a26014252f4a7a11b6d4e441db548` | `collections-streams/collections-in-depth/sorting-with-comparator/artifact.html` | `feb3fdda012976e687effeba46918c0b412d2e01812fa110ab1301a881142530` |
| `collections-streams/lambdas-and-streams/lambdas-and-functional-interfaces-in-depth` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/lambdas-and-functional-interfaces-in-depth/artifact.html` | `fbd28e5d7f9a3bee450419c9decc91b05c204969b117b2bf7f86109f59d62cad` |
| `collections-streams/lambdas-and-streams/method-references` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/method-references/artifact.html` | `595788b1cb50dac2c15072178e50a2c82613a90612831d482a335ab91854a0dc` |
| `collections-streams/lambdas-and-streams/streams-over-data-loaded-from-the-database` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/streams-over-data-loaded-from-the-database/artifact.html` | `ea846f59dfe7fa9d5a50919a77c392a494a470f00ec7e2168d2c8cf53a55442f` |
| `collections-streams/lambdas-and-streams/grouping-with-streams-and-optional` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/grouping-with-streams-and-optional/artifact.html` | `dd9dd921c912c132407b2fa3ab67ea4cab482cf38ec9acda577af39df6ba5496` |
| `collections-streams/lambdas-and-streams/collections-and-streams-review` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/collections-and-streams-review/artifact.html` | `2135ae43913c1ed221ca1df4aba891f9b79d91567990bba8026a5a4a7e5cd632` |
| `collections-streams/lambdas-and-streams/timed-coding-screen-patterns` | `efc5108fa6988622798ab2ae51a88e087c39081c` | `collections-streams/lambdas-and-streams/timed-coding-screen-patterns/artifact.html` | `1923a389b9007c4d94ee82591b00b2e0f9071a855fddb14196cd42795435e944` |

## Reproduction

For each row, compare the working-tree file with `git show <source-checkpoint>:<canonical-source-path>` and hash both with SHA-256. Recompute the aggregate from the sorted tab-separated topic-id/path/hash tuples described above.
