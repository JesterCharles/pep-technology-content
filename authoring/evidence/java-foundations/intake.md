# Course intake: Java Foundations

Course intake for `java-foundations` (calendar technology `java`, Foundation days F4-F18).
This intake ships manifests, the F18 assessment blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Frozen coverage matrix v3 (read-only, outside the repository): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`), rows for course `java-foundations`: the authoritative topic-string inventory and expected-artifact scope.
- Design authority: `AGENTS.md`, `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule, merged as the B8 budget-formula tooling change), `docs/tools/evidence.md` and `schemas/`; then the approved PEP technology-content plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Reference pattern: the course-1 intake (`evidence/git-linux-ai-foundations/intake.md`), without its legacy-label timing basis.

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| F4 | First Java program | Concept | `/tracks/0/weeks/0/days/3` | 0. Installing Java and the IDE; 1. Running a first program; 2. Primitive types and variables; 3. Strings and string methods |
| F5 | Operators and control flow | Concept | `/tracks/0/weeks/0/days/4` | 0. Arithmetic, comparison and logical operators; 1. if/else and switch; 2. for, while and do-while loops |
| F6 | Methods, static and memory | Concept | `/tracks/0/weeks/1/days/0` | 0. Writing methods: parameters and return values; 1. Method overloading; 2. static members and methods; 3. Pass-by-value |
| F7 | Recursion and AI helpers | Practice | `/tracks/0/weeks/1/days/1` | 0. Method practice; 1. Recursion: base case and the call stack; 2. Two pointers: reversing and counting; 3. Debugging with breakpoints; 4. Using Copilot and chat assistants to explain, not answer |
| F8 | Arrays, ArrayList and HashMap basics | Concept | `/tracks/0/weeks/1/days/2` | 0. Declaring and looping over arrays; 1. Linear and binary search; 2. ArrayList basics; 3. HashMap basics: put, get, containsKey |
| F9 | Classes and encapsulation | Concept | `/tracks/0/weeks/1/days/3` | 0. Classes and objects; 1. Constructors; 2. Access modifiers; 3. Encapsulation with getters and setters |
| F10 | Classes in practice and Maven | Project | `/tracks/0/weeks/1/days/4` | 0. Modeling real-world objects as classes; 1. null and NullPointerException; 2. Maven builds and dependencies |
| F11 | Memory, strings, equality, enums | Concept | `/tracks/0/weeks/2/days/0` | 0. Stack vs heap and object references; 1. String immutability; 2. == vs equals; 3. Reading: final and toString; 4. Enums |
| F12 | Inheritance and interfaces | Concept | `/tracks/0/weeks/2/days/1` | 0. Inheritance; 1. Polymorphism: overriding vs overloading; 2. Abstract classes; 3. Interfaces and default methods |
| F13 | Composition, SOLID, patterns | Concept | `/tracks/0/weeks/2/days/2` | 0. Composition over inheritance; 1. SOLID basics: single responsibility, dependency inversion; 2. Functional interfaces and anonymous classes; 3. Reading: records; 4. Reading: singleton and factory patterns |
| F14 | Exceptions and stack traces | Concept | `/tracks/0/weeks/2/days/3` | 0. Checked vs unchecked exceptions; 1. try/catch/finally and try-with-resources; 2. Custom exceptions; 3. Reading stack traces; 4. Reading: logging |
| F15 | HTTP and Javalin | Concept | `/tracks/0/weeks/2/days/4` | 0. Reading: how a request travels from browser to server; 1. HTTP methods, status codes and JSON; 2. Routes and handlers in Javalin; 3. Lambdas as handlers: shorthand for functional interfaces |
| F16 | Repository, wiring and errors | Project | `/tracks/0/weeks/3/days/0` | 0. An in-memory repository behind an interface; 1. Wiring routes, service and repository end to end; 2. Error responses and status codes |
| F17 | JUnit and Mockito | Concept | `/tracks/0/weeks/3/days/1` | 0. Unit tests with JUnit, written test-first: arrange, act, assert, assertThrows; 1. Test doubles: fakes and stubs; 2. Mocking with Mockito; 3. Reading: code coverage |
| F18 | Java review and check | Review | `/tracks/0/weeks/3/days/2` | 0. Java review: core language, HTTP with Javalin, testing; 1. Reading older Java code (8, 11, 17); 2. Java module check |

F18 carries the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70), which becomes this course's one course-level assessment blueprint. No Standard or Fast Track day belongs to `java-foundations` in the frozen matrix (all 75 rows are Foundation rows), so the blueprint has one calendar day.

Calendar rows: 60. They become the frozen topic set of 53 topics (45 core, 6 Reading, 2 review), 2 day-level project briefs (F10 and F16, three rows each) and 1 assessment blueprint, matching plan section 2.3 (Core 45, Reading 6, review/other 9: 2 review rows, 6 project rows and the module check). The manifests hold 55 `topic.json` files: the 53 topics plus the 2 project briefs, which are not syllabus topics.

## Module map

Grouping decision (closes matrix record `source-gap-java-foundations-modules`): this is a second-mate grouping decision, not syllabus.
The calendar gives no module structure for Java, so modules follow calendar day order, keep each day whole, and hold 4-9 topics as the batch unit for later authoring.
Day pairs are joined only where the content continues (F4-F5 basics, F6-F7 methods, F9-F11 classes with the F10 Project 1 brief between the F9 and F11 topics, F12-F13 object-oriented design, F15-F16 HTTP with the F16 Project 1 brief, F17-F18 testing and review); F8 and F14 stand alone because their content does not continue into the next day. `course.json` `moduleOrder` and each `module.json` `topicOrder` follow calendar order F4 to F18, including the two project briefs.
Module counts were not inferred from weeks or day types.

| # | Module | Title | Days | Topics | Planned minutes |
|---|---|---|---|---|---|
| 1 | `java-basics` | Java Basics | F4, F5 | 7 | 70 |
| 2 | `methods-and-recursion` | Methods and Recursion | F6, F7 | 9 | 90 |
| 3 | `arrays-lists-and-maps` | Arrays, Lists and Maps | F8 | 4 | 40 |
| 4 | `classes-and-objects` | Classes and Objects | F9, F10, F11 | 10 | 93 |
| 5 | `inheritance-and-design` | Inheritance, Interfaces and Design | F12, F13 | 9 | 86 |
| 6 | `exceptions-and-logging` | Exceptions and Logging | F14 | 5 | 48 |
| 7 | `http-and-javalin` | HTTP and Javalin | F15, F16 | 5 | 43 |
| 8 | `testing-and-java-review` | Testing and Java Review | F17, F18 | 6 | 58 |

Total: 55 manifests (53 topics and 2 project briefs), 528 planned minutes. `java-basics` (F4-F5) is the lab-contract pilot (plan section 11).

## Topic list with relations

Every one of the 59 instructional, review and project rows maps with relation `exact` to exactly one topic or, for the six F10 and F16 rows, to their day's project brief. No row is split and no row is shared: each calendar string names one focused idea that fits one page within the 15-minute ceiling, and the overlapping ideas below stay separate rows because the calendar teaches them on different days for different purposes.

- `methods-and-recursion/method-overloading` (F6, overloading as a method-design tool) and `inheritance-and-design/polymorphism-overriding-vs-overloading` (F12, contrasting it with overriding): the F12 page lists the F6 page as a prerequisite and builds on it rather than re-teaching it.
- `inheritance-and-design/functional-interfaces-and-anonymous-classes` (F13) and `http-and-javalin/lambdas-as-handlers` (F15): F15 depends on F13 and introduces lambda syntax.
- `java-basics/strings-and-string-methods` (F4, using String methods) and `classes-and-objects/string-immutability` (F11, the reference model behind it).

Topic ids follow the matrix's proposed slugs, shortened where the proposal was a full sentence, and clarified where slugging lost meaning (`equals-vs-equals` dropped the `==`). Changed ids:

| Matrix proposed slug | Topic id |
|---|---|
| `writing-methods-parameters-and-return-values` | `writing-methods` |
| `recursion-base-case-and-the-call-stack` | `recursion-and-the-call-stack` |
| `using-copilot-and-chat-assistants-to-explain-not-answer` | `ai-assistants-explain-not-answer` |
| `hashmap-basics-put-get-containskey` | `hashmap-basics` |
| `equals-vs-equals` | `double-equals-vs-equals` |
| `solid-basics-single-responsibility-dependency-inversion` | `solid-basics` |
| `how-a-request-travels-from-browser-to-server` | `how-a-request-travels` |
| `lambdas-as-handlers-shorthand-for-functional-interfaces` | `lambdas-as-handlers` |
| `unit-tests-with-junit-written-test-first-arrange-act-assert-assertthrows` | `junit-test-first` |
| `java-review-core-language-http-with-javalin-testing` | `java-review` |
| `reading-older-java-code-8-11-17` | `reading-older-java-code` |

| # | Topic | Module | Kind | Pointer | Day | Relation | Calendar row |
|---|---|---|---|---|---|---|---|
| 1 | `installing-java-and-the-ide` | `java-basics` | core | `/tracks/0/weeks/0/days/3/topics/0` | F4 | exact | Installing Java and the IDE |
| 2 | `running-a-first-program` | `java-basics` | core | `/tracks/0/weeks/0/days/3/topics/1` | F4 | exact | Running a first program |
| 3 | `primitive-types-and-variables` | `java-basics` | core | `/tracks/0/weeks/0/days/3/topics/2` | F4 | exact | Primitive types and variables |
| 4 | `strings-and-string-methods` | `java-basics` | core | `/tracks/0/weeks/0/days/3/topics/3` | F4 | exact | Strings and string methods |
| 5 | `arithmetic-comparison-and-logical-operators` | `java-basics` | core | `/tracks/0/weeks/0/days/4/topics/0` | F5 | exact | Arithmetic, comparison and logical operators |
| 6 | `if-else-and-switch` | `java-basics` | core | `/tracks/0/weeks/0/days/4/topics/1` | F5 | exact | if/else and switch |
| 7 | `for-while-and-do-while-loops` | `java-basics` | core | `/tracks/0/weeks/0/days/4/topics/2` | F5 | exact | for, while and do-while loops |
| 8 | `writing-methods` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/0/topics/0` | F6 | exact | Writing methods: parameters and return values |
| 9 | `method-overloading` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/0/topics/1` | F6 | exact | Method overloading |
| 10 | `static-members-and-methods` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/0/topics/2` | F6 | exact | static members and methods |
| 11 | `pass-by-value` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/0/topics/3` | F6 | exact | Pass-by-value |
| 12 | `method-practice` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/1/topics/0` | F7 | exact | Method practice |
| 13 | `recursion-and-the-call-stack` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/1/topics/1` | F7 | exact | Recursion: base case and the call stack |
| 14 | `two-pointers-reversing-and-counting` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/1/topics/2` | F7 | exact | Two pointers: reversing and counting |
| 15 | `debugging-with-breakpoints` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/1/topics/3` | F7 | exact | Debugging with breakpoints |
| 16 | `ai-assistants-explain-not-answer` | `methods-and-recursion` | core | `/tracks/0/weeks/1/days/1/topics/4` | F7 | exact | Using Copilot and chat assistants to explain, not answer |
| 17 | `declaring-and-looping-over-arrays` | `arrays-lists-and-maps` | core | `/tracks/0/weeks/1/days/2/topics/0` | F8 | exact | Declaring and looping over arrays |
| 18 | `linear-and-binary-search` | `arrays-lists-and-maps` | core | `/tracks/0/weeks/1/days/2/topics/1` | F8 | exact | Linear and binary search |
| 19 | `arraylist-basics` | `arrays-lists-and-maps` | core | `/tracks/0/weeks/1/days/2/topics/2` | F8 | exact | ArrayList basics |
| 20 | `hashmap-basics` | `arrays-lists-and-maps` | core | `/tracks/0/weeks/1/days/2/topics/3` | F8 | exact | HashMap basics: put, get, containsKey |
| 21 | `classes-and-objects` | `classes-and-objects` | core | `/tracks/0/weeks/1/days/3/topics/0` | F9 | exact | Classes and objects |
| 22 | `constructors` | `classes-and-objects` | core | `/tracks/0/weeks/1/days/3/topics/1` | F9 | exact | Constructors |
| 23 | `access-modifiers` | `classes-and-objects` | core | `/tracks/0/weeks/1/days/3/topics/2` | F9 | exact | Access modifiers |
| 24 | `encapsulation-with-getters-and-setters` | `classes-and-objects` | core | `/tracks/0/weeks/1/days/3/topics/3` | F9 | exact | Encapsulation with getters and setters |
| 25 | `classes-in-practice-project` | `classes-and-objects` | lab-brief | `/tracks/0/weeks/1/days/4/topics/0`<br>`/tracks/0/weeks/1/days/4/topics/1`<br>`/tracks/0/weeks/1/days/4/topics/2` | F10 | exact | Modeling real-world objects as classes; null and NullPointerException; Maven builds and dependencies |
| 26 | `stack-vs-heap-and-object-references` | `classes-and-objects` | core | `/tracks/0/weeks/2/days/0/topics/0` | F11 | exact | Stack vs heap and object references |
| 27 | `string-immutability` | `classes-and-objects` | core | `/tracks/0/weeks/2/days/0/topics/1` | F11 | exact | String immutability |
| 28 | `double-equals-vs-equals` | `classes-and-objects` | core | `/tracks/0/weeks/2/days/0/topics/2` | F11 | exact | == vs equals |
| 29 | `final-and-tostring` | `classes-and-objects` | reading | `/tracks/0/weeks/2/days/0/topics/3` | F11 | exact | Reading: final and toString |
| 30 | `enums` | `classes-and-objects` | core | `/tracks/0/weeks/2/days/0/topics/4` | F11 | exact | Enums |
| 31 | `inheritance` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/1/topics/0` | F12 | exact | Inheritance |
| 32 | `polymorphism-overriding-vs-overloading` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/1/topics/1` | F12 | exact | Polymorphism: overriding vs overloading |
| 33 | `abstract-classes` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/1/topics/2` | F12 | exact | Abstract classes |
| 34 | `interfaces-and-default-methods` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/1/topics/3` | F12 | exact | Interfaces and default methods |
| 35 | `composition-over-inheritance` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/2/topics/0` | F13 | exact | Composition over inheritance |
| 36 | `solid-basics` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/2/topics/1` | F13 | exact | SOLID basics: single responsibility, dependency inversion |
| 37 | `functional-interfaces-and-anonymous-classes` | `inheritance-and-design` | core | `/tracks/0/weeks/2/days/2/topics/2` | F13 | exact | Functional interfaces and anonymous classes |
| 38 | `records` | `inheritance-and-design` | reading | `/tracks/0/weeks/2/days/2/topics/3` | F13 | exact | Reading: records |
| 39 | `singleton-and-factory-patterns` | `inheritance-and-design` | reading | `/tracks/0/weeks/2/days/2/topics/4` | F13 | exact | Reading: singleton and factory patterns |
| 40 | `checked-vs-unchecked-exceptions` | `exceptions-and-logging` | core | `/tracks/0/weeks/2/days/3/topics/0` | F14 | exact | Checked vs unchecked exceptions |
| 41 | `try-catch-finally-and-try-with-resources` | `exceptions-and-logging` | core | `/tracks/0/weeks/2/days/3/topics/1` | F14 | exact | try/catch/finally and try-with-resources |
| 42 | `custom-exceptions` | `exceptions-and-logging` | core | `/tracks/0/weeks/2/days/3/topics/2` | F14 | exact | Custom exceptions |
| 43 | `reading-stack-traces` | `exceptions-and-logging` | core | `/tracks/0/weeks/2/days/3/topics/3` | F14 | exact | Reading stack traces |
| 44 | `logging` | `exceptions-and-logging` | reading | `/tracks/0/weeks/2/days/3/topics/4` | F14 | exact | Reading: logging |
| 45 | `how-a-request-travels` | `http-and-javalin` | reading | `/tracks/0/weeks/2/days/4/topics/0` | F15 | exact | Reading: how a request travels from browser to server |
| 46 | `http-methods-status-codes-and-json` | `http-and-javalin` | core | `/tracks/0/weeks/2/days/4/topics/1` | F15 | exact | HTTP methods, status codes and JSON |
| 47 | `routes-and-handlers-in-javalin` | `http-and-javalin` | core | `/tracks/0/weeks/2/days/4/topics/2` | F15 | exact | Routes and handlers in Javalin |
| 48 | `lambdas-as-handlers` | `http-and-javalin` | core | `/tracks/0/weeks/2/days/4/topics/3` | F15 | exact | Lambdas as handlers: shorthand for functional interfaces |
| 49 | `repository-wiring-and-errors-project` | `http-and-javalin` | lab-brief | `/tracks/0/weeks/3/days/0/topics/0`<br>`/tracks/0/weeks/3/days/0/topics/1`<br>`/tracks/0/weeks/3/days/0/topics/2` | F16 | exact | An in-memory repository behind an interface; Wiring routes, service and repository end to end; Error responses and status codes |
| 50 | `junit-test-first` | `testing-and-java-review` | core | `/tracks/0/weeks/3/days/1/topics/0` | F17 | exact | Unit tests with JUnit, written test-first: arrange, act, assert, assertThrows |
| 51 | `test-doubles-fakes-and-stubs` | `testing-and-java-review` | core | `/tracks/0/weeks/3/days/1/topics/1` | F17 | exact | Test doubles: fakes and stubs |
| 52 | `mocking-with-mockito` | `testing-and-java-review` | core | `/tracks/0/weeks/3/days/1/topics/2` | F17 | exact | Mocking with Mockito |
| 53 | `code-coverage` | `testing-and-java-review` | reading | `/tracks/0/weeks/3/days/1/topics/3` | F17 | exact | Reading: code coverage |
| 54 | `java-review` | `testing-and-java-review` | review | `/tracks/0/weeks/3/days/2/topics/0` | F18 | exact | Java review: core language, HTTP with Javalin, testing |
| 55 | `reading-older-java-code` | `testing-and-java-review` | review | `/tracks/0/weeks/3/days/2/topics/1` | F18 | exact | Reading older Java code (8, 11, 17) |

Kinds: `reading` for the five `Reading:` rows; `review` for the two F18 review-day rows (the matrix expects a page, text alternative and in-page practice for each, with no quiz); `lab-brief` for the two day-level project briefs, F10 and F16 (the topic schema has no project kind); `core` for every other row, including F14 "Reading stack traces", which is a core skill row, not a `Reading:` row.

### Objectives

Each topic has 3 observable objectives with exact ids `o1`-`o3`; `topic.json` is authoritative.

- `java-basics/installing-java-and-the-ide`: o1 Install a JDK 25 LTS build and Apache Maven, then confirm both with java -version and mvn -v; o2 Tell the JDK from a JRE and explain why javac, java and Maven must each be found on the PATH; o3 Open a Maven project in the IDE and select JDK 25 as its project SDK.
- `java-basics/running-a-first-program`: o1 Compile a source file with javac and run the resulting class with java; o2 Run a single source file directly with java Hello.java and say when that shortcut is enough; o3 Fix a program from a compiler error message by locating its file, line and cause.
- `java-basics/primitive-types-and-variables`: o1 Choose among int, long, double, boolean and char for a value and declare a variable of that type; o2 Predict the result of integer division, overflow and a narrowing cast; o3 Tell a declaration from an assignment and use var only where the type is obvious.
- `java-basics/strings-and-string-methods`: o1 Build strings with literals, concatenation and text blocks; o2 Use length, charAt, substring, indexOf, toUpperCase and strip, predicting zero-based indexes; o3 Explain that String objects are immutable: length, charAt and indexOf return a number or a character, and toUpperCase or strip return a String value without changing the original.
- `java-basics/arithmetic-comparison-and-logical-operators`: o1 Evaluate expressions using arithmetic, remainder and compound assignment operators with correct precedence; o2 Write boolean conditions with comparison operators and &&, || and !; o3 Predict when && and || short-circuit and skip evaluating their right side.
- `java-basics/if-else-and-switch`: o1 Choose between branches with if, else if and else, ordering the conditions correctly; o2 Write a switch with arrow labels, including a switch expression that yields a value; o3 Predict fall-through in an old-style colon switch that has no break.
- `java-basics/for-while-and-do-while-loops`: o1 Write a for loop with the correct start, condition and update for a counted task; o2 Choose while or do-while for a loop whose repeat count is not known in advance; o3 Trace a loop to find an off-by-one error and use break and continue on purpose.
- `methods-and-recursion/writing-methods`: o1 Declare a method with typed parameters and a return type, and call it with matching arguments; o2 Return a value from every path of a method, and use void when nothing is returned; o3 Extract a repeated block of code into a well-named method.
- `methods-and-recursion/method-overloading`: o1 Overload a method by changing its parameter list; o2 Predict which overload the compiler picks for a given call, including a widening conversion; o3 Explain why a different return type alone cannot overload a method.
- `methods-and-recursion/static-members-and-methods`: o1 Call a static method through its class name and explain why main is static; o2 Use a static field shared by all calls and tell it from a local variable; o3 Explain why a static method cannot use an instance field without an object.
- `methods-and-recursion/pass-by-value`: o1 Predict that reassigning a primitive parameter leaves the caller's variable unchanged; o2 Predict that reassigning a String parameter inside a method leaves the caller's variable referring to its original String; o3 Explain that Java passes every argument by value, and that for an object the value copied is the reference.
- `methods-and-recursion/method-practice`: o1 Decompose a small problem into methods with clear inputs and outputs; o2 Test a method by calling it with ordinary, boundary and invalid inputs and checking the results; o3 Refactor duplicated code into one reusable method without changing behavior.
- `methods-and-recursion/recursion-and-the-call-stack`: o1 Write a recursive method with a base case and a recursive step that moves toward it; o2 Trace the call stack of a recursive method, frame by frame, including the returns; o3 Explain why a missing or unreachable base case ends in StackOverflowError.
- `methods-and-recursion/two-pointers-reversing-and-counting`: o1 Build and return a reversed String by reading characters with two indexes that move toward each other; o2 Count matching characters or pairs in a String with two indexes instead of nested loops; o3 Choose the loop condition that stops two indexes exactly when they meet or cross.
- `methods-and-recursion/debugging-with-breakpoints`: o1 Set a breakpoint and run a program in the IDE debugger; o2 Step over, step into and step out while watching variable values change; o3 Locate the line where a variable first takes a wrong value.
- `methods-and-recursion/ai-assistants-explain-not-answer`: o1 Ask an AI assistant to explain an error or a piece of code without asking for the finished solution; o2 Check an assistant's explanation against the official documentation or by running the code; o3 Record what the assistant produced and what you verified yourself.
- `arrays-lists-and-maps/declaring-and-looping-over-arrays`: o1 Declare, create and initialize an array, and read and write elements by index; o2 Loop over an array with an index-based for loop and an enhanced for loop, choosing between them; o3 Reverse an array in place with two indexes and predict when an index throws ArrayIndexOutOfBoundsException.
- `arrays-lists-and-maps/linear-and-binary-search`: o1 Write a linear search that returns the index of a target or -1; o2 Trace binary search on a sorted array, narrowing the low and high bounds each step; o3 Explain why binary search requires sorted input and how its step count grows with input size.
- `arrays-lists-and-maps/arraylist-basics`: o1 Create an ArrayList and use add, get, set, remove and size; o2 Choose an ArrayList over an array when the number of elements changes; o3 Explain why a list of numbers is declared List<Integer> rather than List<int>.
- `arrays-lists-and-maps/hashmap-basics`: o1 Store and look up values by key with put and get; o2 Use containsKey or getOrDefault to handle a missing key instead of an unexpected null; o3 Count occurrences of words or characters with a HashMap.
- `classes-and-objects/classes-and-objects`: o1 Define a class with fields and instance methods; o2 Create several objects with new and explain that each object has its own field values; o3 Tell a class, an object and a reference variable apart in code.
- `classes-and-objects/constructors`: o1 Write a constructor that initializes every field from its parameters; o2 Use this to tell a field from a parameter with the same name, and chain constructors with this(...); o3 Explain when the compiler supplies a default constructor and when it does not.
- `classes-and-objects/access-modifiers`: o1 Apply private, package-private, protected and public to fields and methods; o2 Predict whether code in another class or package compiles against a given modifier; o3 Choose the most restrictive access that still lets the code work.
- `classes-and-objects/encapsulation-with-getters-and-setters`: o1 Hide fields behind private access and expose them through getters; o2 Write a setter or method that validates input and rejects an invalid state; o3 Decide when a field should have no setter at all.
- `classes-and-objects/classes-in-practice-project`: o1 Model a described real-world entity as a class whose constructor and methods keep every object valid; o2 Guard and handle null where it is permitted, with a null check or getOrDefault, and reject a forbidden null argument at once with Objects.requireNonNull, which throws NullPointerException with a clear message; o3 Declare a test-scope dependency in the project's POM, then run the public tests with mvn -q -o test and tell a compile failure from a failing test.
- `classes-and-objects/stack-vs-heap-and-object-references`: o1 Draw where local variables, objects and references live for a short program; o2 Predict the effect of two references pointing to the same object; o3 Explain when an object becomes unreachable and eligible for garbage collection.
- `classes-and-objects/string-immutability`: o1 Predict that String methods return new strings and leave the original unchanged; o2 Use StringBuilder to build a string inside a loop; o3 Explain why immutability makes strings safe to share between references.
- `classes-and-objects/double-equals-vs-equals`: o1 Predict the result of == and equals on primitives, strings and other objects; o2 Compare strings for content with equals instead of ==; o3 Explain why a class must override equals to compare its objects by content.
- `classes-and-objects/final-and-tostring`: o1 Tell what final means on a variable, a method and a class; o2 Explain that final stops reassignment of a reference but not changes to the object it points to; o3 Override toString to give an object a readable text form.
- `classes-and-objects/enums`: o1 Declare an enum for a fixed set of constants and use it in a switch; o2 Add a field, constructor and method to an enum; o3 Choose an enum over int or String constants and explain the type safety it adds.
- `inheritance-and-design/inheritance`: o1 Extend a class and reuse its fields and methods in the subclass; o2 Call a superclass constructor with super(...) and predict the order of constructor calls; o3 Recognize an is-a relationship that justifies inheritance.
- `inheritance-and-design/polymorphism-overriding-vs-overloading`: o1 Override a method with @Override and predict which version runs from the object's runtime type; o2 Tell overriding (same signature in a subclass) from overloading (different parameters); o3 Call methods through a superclass reference that holds subclass objects.
- `inheritance-and-design/abstract-classes`: o1 Declare an abstract class with abstract and concrete methods; o2 Explain why an abstract class cannot be instantiated and what a subclass must implement; o3 Choose an abstract class when subclasses share state and code.
- `inheritance-and-design/interfaces-and-default-methods`: o1 Declare an interface and implement it in more than one class; o2 Add a default method and predict when an implementing class's own method replaces it; o3 Choose between an interface and an abstract class for a design.
- `inheritance-and-design/composition-over-inheritance`: o1 Refactor a design to hold another object as a field and delegate to it instead of extending it; o2 Tell a has-a relationship from an is-a relationship in a design; o3 Explain how a deep inheritance chain makes change harder.
- `inheritance-and-design/solid-basics`: o1 Identify a class with more than one reason to change and split it; o2 Make a class depend on an interface passed in through its constructor rather than on a concrete class; o3 Explain how dependency inversion lets a test supply a different implementation.
- `inheritance-and-design/functional-interfaces-and-anonymous-classes`: o1 Recognize a functional interface as an interface with exactly one abstract method; o2 Implement an interface inline with an anonymous class; o3 Use a standard functional interface such as Predicate, Function or Supplier.
- `inheritance-and-design/records`: o1 Declare a record and list the constructor, accessors, equals, hashCode and toString it provides; o2 Explain why a record's fields are final and when a record fits better than a class; o3 Add validation in a compact canonical constructor.
- `inheritance-and-design/singleton-and-factory-patterns`: o1 Recognize a singleton and explain the risk of hidden global state; o2 Recognize a static factory method and explain what it hides from the caller; o3 Decide when passing a dependency in is simpler than using a singleton.
- `exceptions-and-logging/checked-vs-unchecked-exceptions`: o1 Tell checked exceptions from unchecked exceptions in the Throwable hierarchy; o2 Declare a checked exception with throws or handle it, as the compiler requires; o3 Decide whether a failure should be signalled with a checked or an unchecked exception.
- `exceptions-and-logging/try-catch-finally-and-try-with-resources`: o1 Catch a specific exception and order catch blocks from most to least specific; o2 Predict when a finally block runs; o3 Close a resource automatically with try-with-resources.
- `exceptions-and-logging/custom-exceptions`: o1 Define a custom exception class with a constructor that takes a message and a cause; o2 Throw a custom exception for a broken business rule; o3 Wrap a low-level exception in a custom one without losing its cause.
- `exceptions-and-logging/reading-stack-traces`: o1 Find the exception type, message and first line of your own code in a stack trace; o2 Follow a Caused by: chain to the root cause; o3 Explain what a helpful NullPointerException message says about which value was null.
- `exceptions-and-logging/logging`: o1 Explain why a program logs instead of printing with System.out; o2 Choose a log level for an event, from debug to error; o3 Log an exception with its stack trace and without sensitive data.
- `http-and-javalin/how-a-request-travels`: o1 Trace a request from URL through name lookup and connection to a server response; o2 Name the parts of a URL: scheme, host, port, path and query; o3 Explain what localhost and a port mean for a server running on your machine.
- `http-and-javalin/http-methods-status-codes-and-json`: o1 Choose GET, POST, PUT or DELETE for an operation and say which methods are safe or idempotent; o2 Pick a status code class (2xx, 4xx, 5xx) and a specific code for a response; o3 Read and write a JSON object with nested values and arrays.
- `http-and-javalin/routes-and-handlers-in-javalin`: o1 Trace which registered route and handler a request reaches, and select the Context call that reads a path parameter, a query parameter or a JSON body; o2 Write and register a GET or POST handler that sets the status and returns JSON, and pass its public check in the required guided local run; o3 Map an exception to a status code and JSON body with an exception handler, and pass its public check in the required guided local run.
- `http-and-javalin/lambdas-as-handlers`: o1 Rewrite an anonymous class handler as a lambda; o2 Explain that a lambda implements the single abstract method of a functional interface; o3 Replace a simple lambda with a method reference.
- `http-and-javalin/repository-wiring-and-errors-project`: o1 Implement a given repository interface with an in-memory HashMap store that calling code uses only through the interface; o2 Wire Javalin routes to a service and the repository through constructors so that a request flows end to end and returns JSON; o3 Return 400 for invalid input and 404 for a missing resource with JSON error bodies, mapping a custom exception with a Javalin exception handler.
- `testing-and-java-review/junit-test-first`: o1 Write a failing JUnit test before the code, then make it pass; o2 Structure a test as arrange, act and assert with assertEquals and assertTrue; o3 Test that code throws the expected exception with assertThrows.
- `testing-and-java-review/test-doubles-fakes-and-stubs`: o1 Replace a dependency with a hand-written fake that works in memory; o2 Write a stub that returns canned answers for a test; o3 Explain why depending on an interface makes a class testable.
- `testing-and-java-review/mocking-with-mockito`: o1 Create a mock and stub a method with when(...).thenReturn(...); o2 Verify that a method was called with expected arguments; o3 Decide when a hand-written fake is clearer than a mock.
- `testing-and-java-review/code-coverage`: o1 Read a JaCoCo report for line and branch coverage; o2 Explain why high coverage does not prove code is correct; o3 Find an untested branch and add a test for it.
- `testing-and-java-review/java-review`: o1 Retrieve core language rules for types, control flow, methods and classes to predict a program's output; o2 Trace a Javalin request through route, handler and status code; o3 Choose the right assertion or test double for a unit test.
- `testing-and-java-review/reading-older-java-code`: o1 Recognize which Java release a feature needs, such as lambdas (8), var (10), switch expressions (14) and records (16); o2 Rewrite an older idiom, such as an anonymous class or a colon switch, in its modern form; o3 Inspect a short Java 8, 11 or 17 example, predict whether it compiles on JDK 25, and name the feature or migration issue behind the prediction.

### Prerequisites

Prerequisites name in-course topics by full key. Cross-course prerequisites name course-1 topic keys, because those ids exist: `navigating-the-shell` and `environment-variables-and-secrets` (installing the JDK and Maven, setting `JAVA_HOME` and `PATH`; logging without secrets), `localhost-and-ports` (how a request travels), and `ai-rules-of-use` and `checking-ai-changes` (AI assistants that explain). `course.json` names the course-1 course id `git-linux-ai-foundations`.

## Project briefs

Captain decision pep-project-rows, option A, as consolidated by the intake-2 reconciliation (education-recheck-01, -02, java-sme-recheck-006 to -008): Java has exactly two canonical project artifacts, one per calendar Project day. These are already-authorized matrix project artifacts, not new syllabus.

- Location: `java-foundations/classes-and-objects/classes-in-practice-project/` (F10) and `java-foundations/http-and-javalin/repository-wiring-and-errors-project/` (F16), each a `topic.json` of kind `lab-brief` that maps its day's three frozen curriculum pointers. `topicOrder` places the F10 brief between the F9 and F11 topics and the F16 brief after the F15 topics, so manifest traversal follows the calendar.
- Artifact: `artifact.html` (with `artifact.md`) is the brief: goal, the three integrated outcomes, the ordered steps, the teach-then-check steps listed below, and how to test. Its `coding-lab/` topic lab under `docs/lab-contract.md` holds one starter scaffold (`starter/`), one public test suite (`tests/`) and `expected/` output.
- Outcomes: the brief's three objectives in `topic.json`, one per calendar row; the public tests check each one.
- Test command: `mvn -q -o test` after one-time `mvn -q dependency:go-offline`, on macOS, Linux and Windows. The F16 tests run the Javalin app in-process on localhost (Javalin testing tutorial), with no container engine.
- Never in the repository: reference solutions and hidden tests, which stay in uncommitted private staging.
- Tracks: Standard and Fast overlays reference these same two artifacts, never a copy.
- The module PR authors each brief and its lab; this intake records only the plan.

| Day | Brief | Pointer | Calendar row | Outcome |
|---|---|---|---|---|
| F10 | `classes-and-objects/classes-in-practice-project` | `/tracks/0/weeks/1/days/4/topics/0` | Modeling real-world objects as classes | o1 Model a described real-world entity as a class whose constructor and methods keep every object valid |
| F10 | `classes-and-objects/classes-in-practice-project` | `/tracks/0/weeks/1/days/4/topics/1` | null and NullPointerException | o2 Guard and handle null where it is permitted, with a null check or getOrDefault, and reject a forbidden null argument at once with Objects.requireNonNull, which throws NullPointerException with a clear message |
| F10 | `classes-and-objects/classes-in-practice-project` | `/tracks/0/weeks/1/days/4/topics/2` | Maven builds and dependencies | o3 Declare a test-scope dependency in the project's POM, then run the public tests with mvn -q -o test and tell a compile failure from a failing test |
| F16 | `http-and-javalin/repository-wiring-and-errors-project` | `/tracks/0/weeks/3/days/0/topics/0` | An in-memory repository behind an interface | o1 Implement a given repository interface with an in-memory HashMap store that calling code uses only through the interface |
| F16 | `http-and-javalin/repository-wiring-and-errors-project` | `/tracks/0/weeks/3/days/0/topics/1` | Wiring routes, service and repository end to end | o2 Wire Javalin routes to a service and the repository through constructors so that a request flows end to end and returns JSON |
| F16 | `http-and-javalin/repository-wiring-and-errors-project` | `/tracks/0/weeks/3/days/0/topics/2` | Error responses and status codes | o3 Return 400 for invalid input and 404 for a missing resource with JSON error bodies, mapping a custom exception with a Javalin exception handler |

### Teach-before-apply map

Teach-before-apply means instruction plus checked practice comes before each application step (java-sme-recheck-007). Two cases:

- (a) A concept that is a syllabus row of an earlier day is taught on that day, so the brief only applies it. For F16 this includes writing and registering Javalin handlers and exception mapping: `http-and-javalin/routes-and-handlers-in-javalin` (F15) regains implementation objectives o2 and o3, evidenced by a required guided local-run step with public checks (its topic coding lab).
- (b) A concept that is itself one of the project day's own frozen rows can only be taught on that day. The F10 brief therefore teaches null/NullPointerException and Maven POM dependency declaration with a short teach-then-check step placed before the first brief step that applies each one, consistent with the html-css-js FT15 reconciliation.

| Brief | Applied concept | Case | Taught and checked by |
|---|---|---|---|
| `classes-in-practice-project` | fields, methods and objects | a | `classes-and-objects/classes-and-objects` o1-o3 (F9) |
| `classes-in-practice-project` | constructors | a | `classes-and-objects/constructors` o1-o2 (F9) |
| `classes-in-practice-project` | private fields and validating setters | a | `classes-and-objects/access-modifiers` o3, `encapsulation-with-getters-and-setters` o1-o2 (F9) |
| `classes-in-practice-project` | missing HashMap key handled with getOrDefault or a null check | a | `arrays-lists-and-maps/hashmap-basics` o2 (F8) |
| `classes-in-practice-project` | running mvn and reading compiler errors | a | `java-basics` pilot lab (`mvn -q -o test`, F4-F5); `java-basics/running-a-first-program` o3 (F4) |
| `classes-in-practice-project` | what null is and which operations throw NullPointerException | b | F10 brief teach-then-check step 1, before the first step that handles null: a short explanation, then a predict-the-exception check |
| `classes-in-practice-project` | guarding permitted null versus rejecting forbidden null with Objects.requireNonNull (which throws NullPointerException with a clear message) | b | F10 brief teach-then-check step 2, before the step that adds argument checks; public tests pass null where it is permitted and where it is forbidden |
| `classes-in-practice-project` | POM coordinates and the dependencies section; declaring a test-scope dependency; compile failure versus failing test | b | F10 brief teach-then-check step 3, before the step that edits the POM; the public tests compile only once the learner declares the dependency |
| `repository-wiring-and-errors-project` | implementing an interface | a | `inheritance-and-design/interfaces-and-default-methods` o1 (F12) |
| `repository-wiring-and-errors-project` | depending on an interface; constructor injection | a | `inheritance-and-design/solid-basics` o2-o3 (F13) |
| `repository-wiring-and-errors-project` | HashMap store and missing keys | a | `arrays-lists-and-maps/hashmap-basics` o1-o2 (F8); F10 brief outcome o2 |
| `repository-wiring-and-errors-project` | POM and test command | a | F10 brief outcome o3 |
| `repository-wiring-and-errors-project` | writing and registering GET and POST handlers that return JSON | a | `http-and-javalin/routes-and-handlers-in-javalin` o2 (F15, required guided local run with public check) |
| `repository-wiring-and-errors-project` | lambda handlers | a | `http-and-javalin/lambdas-as-handlers` o1-o2 (F15) |
| `repository-wiring-and-errors-project` | 400 and 404 status codes; JSON bodies | a | `http-and-javalin/http-methods-status-codes-and-json` o2-o3 (F15) |
| `repository-wiring-and-errors-project` | custom exceptions | a | `exceptions-and-logging/custom-exceptions` o1-o2 (F14) |
| `repository-wiring-and-errors-project` | mapping an exception to a status and JSON body | a | `http-and-javalin/routes-and-handlers-in-javalin` o3 (F15, required guided local run with public check) |

## Artifact applicability

Rules (plan section 5, matrix expected-artifact scope): core topics require HTML, derived Markdown and a practice GIFT quiz, with a curated video when a suitable verified one exists; Reading topics also carry a printable PDF; review topics carry HTML and Markdown only; project briefs carry HTML, Markdown and a topic coding lab; the module check carries no learner file. Each page's in-page simulator or practice is part of its HTML. Absent companions record a reason.

Legend: **R** required, authored in the module PR; **V** required when a suitable verified video exists, otherwise absent with the search record; **L** practised in the planned module lab; **T** topic coding lab (scaffold and public tests), authored in the module PR; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `java-basics/installing-java-and-the-ide` | core | R | R | - | R | V | L |
| `java-basics/running-a-first-program` | core | R | R | - | R | V | L |
| `java-basics/primitive-types-and-variables` | core | R | R | - | R | V | L |
| `java-basics/strings-and-string-methods` | core | R | R | - | R | V | L |
| `java-basics/arithmetic-comparison-and-logical-operators` | core | R | R | - | R | V | L |
| `java-basics/if-else-and-switch` | core | R | R | - | R | V | L |
| `java-basics/for-while-and-do-while-loops` | core | R | R | - | R | V | L |
| `methods-and-recursion/writing-methods` | core | R | R | - | R | V | - |
| `methods-and-recursion/method-overloading` | core | R | R | - | R | V | - |
| `methods-and-recursion/static-members-and-methods` | core | R | R | - | R | V | - |
| `methods-and-recursion/pass-by-value` | core | R | R | - | R | V | - |
| `methods-and-recursion/method-practice` | core | R | R | - | R | V | - |
| `methods-and-recursion/recursion-and-the-call-stack` | core | R | R | - | R | V | - |
| `methods-and-recursion/two-pointers-reversing-and-counting` | core | R | R | - | R | V | - |
| `methods-and-recursion/debugging-with-breakpoints` | core | R | R | - | R | V | - |
| `methods-and-recursion/ai-assistants-explain-not-answer` | core | R | R | - | R | V | - |
| `arrays-lists-and-maps/declaring-and-looping-over-arrays` | core | R | R | - | R | V | - |
| `arrays-lists-and-maps/linear-and-binary-search` | core | R | R | - | R | V | - |
| `arrays-lists-and-maps/arraylist-basics` | core | R | R | - | R | V | - |
| `arrays-lists-and-maps/hashmap-basics` | core | R | R | - | R | V | - |
| `classes-and-objects/classes-and-objects` | core | R | R | - | R | V | - |
| `classes-and-objects/constructors` | core | R | R | - | R | V | - |
| `classes-and-objects/access-modifiers` | core | R | R | - | R | V | - |
| `classes-and-objects/encapsulation-with-getters-and-setters` | core | R | R | - | R | V | - |
| `classes-and-objects/classes-in-practice-project` | lab-brief | R | R | - | - | - | T |
| `classes-and-objects/stack-vs-heap-and-object-references` | core | R | R | - | R | V | - |
| `classes-and-objects/string-immutability` | core | R | R | - | R | V | - |
| `classes-and-objects/double-equals-vs-equals` | core | R | R | - | R | V | - |
| `classes-and-objects/final-and-tostring` | reading | R | R | R | R | V | - |
| `classes-and-objects/enums` | core | R | R | - | R | V | - |
| `inheritance-and-design/inheritance` | core | R | R | - | R | V | - |
| `inheritance-and-design/polymorphism-overriding-vs-overloading` | core | R | R | - | R | V | - |
| `inheritance-and-design/abstract-classes` | core | R | R | - | R | V | - |
| `inheritance-and-design/interfaces-and-default-methods` | core | R | R | - | R | V | - |
| `inheritance-and-design/composition-over-inheritance` | core | R | R | - | R | V | - |
| `inheritance-and-design/solid-basics` | core | R | R | - | R | V | - |
| `inheritance-and-design/functional-interfaces-and-anonymous-classes` | core | R | R | - | R | V | - |
| `inheritance-and-design/records` | reading | R | R | R | R | V | - |
| `inheritance-and-design/singleton-and-factory-patterns` | reading | R | R | R | R | V | - |
| `exceptions-and-logging/checked-vs-unchecked-exceptions` | core | R | R | - | R | V | - |
| `exceptions-and-logging/try-catch-finally-and-try-with-resources` | core | R | R | - | R | V | - |
| `exceptions-and-logging/custom-exceptions` | core | R | R | - | R | V | - |
| `exceptions-and-logging/reading-stack-traces` | core | R | R | - | R | V | - |
| `exceptions-and-logging/logging` | reading | R | R | R | R | V | - |
| `http-and-javalin/how-a-request-travels` | reading | R | R | R | R | V | - |
| `http-and-javalin/http-methods-status-codes-and-json` | core | R | R | - | R | V | - |
| `http-and-javalin/routes-and-handlers-in-javalin` | core | R | R | - | R | V | - |
| `http-and-javalin/lambdas-as-handlers` | core | R | R | - | R | V | - |
| `http-and-javalin/repository-wiring-and-errors-project` | lab-brief | R | R | - | - | - | T |
| `testing-and-java-review/junit-test-first` | core | R | R | - | R | V | - |
| `testing-and-java-review/test-doubles-fakes-and-stubs` | core | R | R | - | R | V | - |
| `testing-and-java-review/mocking-with-mockito` | core | R | R | - | R | V | - |
| `testing-and-java-review/code-coverage` | reading | R | R | R | R | V | - |
| `testing-and-java-review/java-review` | review | R | R | - | - | - | - |
| `testing-and-java-review/reading-older-java-code` | review | R | R | - | - | - | - |

## Lab plan

All labs follow `docs/lab-contract.md`: no Docker, Podman, Compose, Testcontainers or other learner-side container engine for setup or tests; one language-native test command per lab; public tests only; no committed solutions or hidden tests.

### Pilot: `java-foundations/java-basics/coding-lab` (module lab)

- Purpose: the lab-contract pilot (plan section 11). It proves the no-Docker Java/Maven contract on macOS, Linux and Windows before later modules plan labs.
- Scope: module lab covering all 7 `java-basics` topics; each topic records `lab: module:java-basics`. `module.json` `moduleLabs` stays empty until the lab exists.
- Toolchain: JDK 25 (the current LTS: Oracle Java SE support roadmap and the JDK 25 project page) and Apache Maven 3.9 or later (the Maven download page lists 3.9.16 and 3.10.0 on 2026-10-12), with JUnit Jupiter as a `test`-scope dependency and pinned plugin versions.
- Learner task: complete the body of a provided `main`-based program (types, strings, operators, if/else, switch, loops). Public tests run the program and check its printed output and returned values, so the lab uses only what F4-F5 teach; methods and classes are not required of the learner.
- One-time setup (network): `mvn -q dependency:go-offline`, with `java -version` and `mvn -v` as the version checks.
- Test command (offline, the one language-native command): `mvn -q -o test`.
- Expected output: the shipped starter fails named public tests with stable messages; on completion the summary matches `expected/`.
- Cleanup: `starter/target`.
- Operating systems: macOS, Linux and Windows. CI runs Ubuntu; macOS and Windows runs are recorded locally until CI covers them (`docs/lab-contract.md` section 10).
- Known risk for the module PR: `dependency:go-offline` may not pre-fetch every Surefire JUnit Platform provider artifact, which would break the first offline run; the module PR proves the offline run on all three systems and pins what it needs.
- Terminal: the lab runs in the learner's own terminal. Any in-page terminal practice reuses the canonical terminal foundation, the repaired course-1 Evolv package (`git-linux-ai-foundations-20261007-evolv-terminal-repair`) with its non-form direct Run/Enter dispatch, which the captain confirmed working in Evolv (platform success, not a captured DOM or console trace). This intake does not re-derive or redesign it.

### Other modules

Besides the pilot, the two project-brief topic labs (see Project briefs) and the F15 routes topic lab below, no other lab is planned at intake. Those topics record `lab: none` with a reason. The Foundation calendar sets `requiredLab: false` for every F4-F18 day, the frozen matrix gives Java no lab overlay, and each day's coding-lab blocks run on the platform. A module PR may propose a module lab; it then uses the same test command, `mvn -q -o test`, and needs educational-critic confirmation. Candidates: `methods-and-recursion` (F7 Practice day exercise ladder) and `testing-and-java-review` (learners write JUnit tests and Mockito mocks).

`http-and-javalin/routes-and-handlers-in-javalin` has a topic coding lab (intake-2 reconciliation java-sme-recheck-007, superseding the first reconciliation's no-lab scope for education-03). The page teaches tracing routes and selecting Context calls (o1), then requires a guided local-run step in which the learner writes and registers a handler (o2) and maps an exception to a status and JSON body (o3); the lab's public checks, run with `mvn -q -o test` in-process on localhost, confirm both. This teaches what the F16 brief later applies.

## Minute budgets

Rule: the new-course rule in `docs/tools/validators.md` (merged B8 budget-formula change). Each integer topic budget must be at least `ceil(max(estimator P50, modeledWorstPath))`, at most 15. Day totals are compared with the day type's full block total and are never compressed.

Basis at intake: no `artifact.html` exists, so nothing can be measured. Each topic records `modeledP50` 0 and `modeledWorstPath` 0, meaning not measured, and a planning budget equal to its `aboutLabel`:

- core and review: 10 minutes, the largest `ceil(max(P50, worst path))` measured on any course-1 page (`agile-scrum-user-stories`: P50 6.7, worst path 9.35);
- Reading: 8 minutes, a shorter read;
- project brief: 5 minutes, the 3-5 minute brief of plan section 5 plus its short teach-then-check steps; build time is lab time in each `lab.json`, not topic budget.

The module PR replaces each planning value with the measured estimator P50 and the modeled worst required path (two wrong graded attempts and wrong-first explores per interactive unit), then raises `budget` and `aboutLabel` to the rule's minimum. A planning budget is never used to cut an authored page. Gate T14 enforces the rule once `artifact.html` is present.

| Day | Day type | Topics | Planned budget total | Day block total |
|---|---|---|---|---|
| F4 | Concept | 4 | 40 | 120 |
| F5 | Concept | 3 | 30 | 120 |
| F6 | Concept | 4 | 40 | 120 |
| F7 | Practice | 5 | 50 | 120 |
| F8 | Concept | 4 | 40 | 120 |
| F9 | Concept | 4 | 40 | 120 |
| F10 | Project | 1 | 5 | 120 |
| F11 | Concept | 5 | 48 | 120 |
| F12 | Concept | 4 | 40 | 120 |
| F13 | Concept | 5 | 46 | 120 |
| F14 | Concept | 5 | 48 | 120 |
| F15 | Concept | 4 | 38 | 120 |
| F16 | Project | 1 | 5 | 120 |
| F17 | Concept | 4 | 38 | 120 |
| F18 | Review | 2 | 20 | 120 |

Every day fits its 120-minute total. Pacing observation (not a gate): on Concept days the pages' planned total (30-48 minutes) exceeds the Reading plus Worked-example blocks (15 + 12 = 27 minutes). Under B8 the topic minimums are not compressed to fit those blocks; fitting pages against the warm-up, video and coding-lab blocks is a platform pacing matter, recorded here for the track overlay.

## F18 assessment blueprint

`java-foundations/assessments/java-module-check/blueprint.json`:

- Calendar identity copied verbatim from the snapshot F18 `assessment`: `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores, so `weights` is empty.
- Duration: the F18 Review day's "Module check" block (MCQ + coding assessment, 45 minutes), so `durationMinutes` is 45.
- Proposed item counts within that block: MCQ 15 items, about 1 minute each (15 minutes); coding 2 short tasks, about 15 minutes each (30 minutes). The calendar gives the block total only; this split is an intake proposal for criticism.
- Objectives covered: a representative set across the 8 instructional modules that the 17 items can elicit. `objectiveFormats` maps each objective to the format that checks it. The review pages add no new objectives and are not listed. The project-brief objectives are checked by their own public tests and are not sampled.
- Reconciliation education-06: one MCQ objective (`java-basics/arithmetic-comparison-and-logical-operators#o3`) was replaced by the Javalin route and handler trace objective `http-and-javalin/routes-and-handlers-in-javalin#o1`, so the F18 review scope "HTTP with Javalin" is sampled. The coding part keeps only the objectives its two tasks directly elicit within 30 minutes: task 1 completes a small class whose setter or method rejects invalid input by throwing a custom exception; task 2 writes a JUnit test that checks that rejection with `assertThrows`. Item authors validate this cluster against the 30-minute budget.

  - `java-foundations/java-basics/primitive-types-and-variables#o2` (MCQ)
  - `java-foundations/java-basics/if-else-and-switch#o3` (MCQ)
  - `java-foundations/methods-and-recursion/method-overloading#o2` (MCQ)
  - `java-foundations/methods-and-recursion/pass-by-value#o3` (MCQ)
  - `java-foundations/methods-and-recursion/recursion-and-the-call-stack#o3` (MCQ)
  - `java-foundations/arrays-lists-and-maps/linear-and-binary-search#o3` (MCQ)
  - `java-foundations/arrays-lists-and-maps/hashmap-basics#o2` (MCQ)
  - `java-foundations/classes-and-objects/access-modifiers#o2` (MCQ)
  - `java-foundations/classes-and-objects/double-equals-vs-equals#o1` (MCQ)
  - `java-foundations/inheritance-and-design/polymorphism-overriding-vs-overloading#o1` (MCQ)
  - `java-foundations/inheritance-and-design/interfaces-and-default-methods#o2` (MCQ)
  - `java-foundations/exceptions-and-logging/try-catch-finally-and-try-with-resources#o2` (MCQ)
  - `java-foundations/http-and-javalin/http-methods-status-codes-and-json#o2` (MCQ)
  - `java-foundations/http-and-javalin/routes-and-handlers-in-javalin#o1` (MCQ)
  - `java-foundations/testing-and-java-review/mocking-with-mockito#o3` (MCQ)
  - `java-foundations/classes-and-objects/encapsulation-with-getters-and-setters#o2` (coding)
  - `java-foundations/exceptions-and-logging/custom-exceptions#o2` (coding)
  - `java-foundations/testing-and-java-review/junit-test-first#o3` (coding)

- Allowed resources: the calendar states no AI or resource restriction for the F18 Module check block; the separate "Practice without AI" block is practice, not the check. Any rule on AI assistants, notes, course pages or web documentation is set and shown by the platform assessment owner; the repository invents no assessment policy. The coding part uses the Java 25 and JUnit environment the platform provides.
- Standard and Fast Track: no Standard or Fast day maps to `java-foundations`, so no track day shares this blueprint; any later track reference points to this one blueprint rather than a copy.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its key names.

## Official sources per topic

Closes matrix record `source-gap-java-foundations-official-evidence`. Every source below was fetched live on 2026-10-12. `evidence/java-foundations/source-snapshot.json` records each URL with its retrieval time, the sha256 of the fetched bytes and the sections each topic uses. Raw fetched pages are not committed.

- Version baseline: Java SE 25 (LTS; JDK 27 is the newest feature release but is not LTS), Java Language Specification SE 25, Java SE 25 API documentation, Maven 3.9 or later, JUnit 6 (the user guide resolved to 6.1.3), Javalin 7 (the documentation shows 7.2.3), and Mockito, JaCoCo and SLF4J current documentation.
- 125 URLs, all HTTP 200.
- Redirects: `docs.junit.org/current/user-guide/` resolves to the versioned 6.1.3 guide; `maven.apache.org/ref/current/maven-embedder/cli.html` resolves to the 3.10.0 reference; the two GitHub Copilot pages resolve to their current paths. The snapshot keeps the stable entry URL and hashes the resolved bytes.
- Dev.java restructuring: the first fetch showed that dev.java moved its tutorials under `/learn/language/`, `/learn/first-steps/` and `/learn/api/`. The old leaf URLs return HTTP 404 or a script redirect stub, so the snapshot records only the current URLs.
- Gaps, listed unverified in each topic's `freshness.unverifiedItems`: no first-party source defines the two-pointer technique, composition over inheritance, the SOLID principles, the singleton and factory patterns, or the terms fake and stub. Those pages teach them as design guidance or course vocabulary and never badge them as verified language rules. DNS detail for `how-a-request-travels` is outside the frozen sources.

| Topic | Official sources |
|---|---|
| `installing-java-and-the-ide` | https://www.oracle.com/java/technologies/java-se-support-roadmap.html<br>https://openjdk.org/projects/jdk/25/<br>https://docs.oracle.com/en/java/javase/25/install/overview-jdk-installation.html<br>https://adoptium.net/temurin/releases/<br>https://maven.apache.org/install.html<br>https://maven.apache.org/download.cgi<br>https://www.jetbrains.com/help/idea/installation-guide.html<br>https://dev.java/learn/first-steps/using-ides/intellij-idea/<br>https://dev.java/learn/first-steps/using-ides/vscode-java/ |
| `running-a-first-program` | https://dev.java/learn/first-steps/first-java-code/getting-started/<br>https://dev.java/learn/first-steps/first-java-code/launch-simple-source-code-programs/<br>https://openjdk.org/jeps/330<br>https://openjdk.org/jeps/512<br>https://docs.oracle.com/en/java/javase/25/docs/specs/man/java.html<br>https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html<br>https://www.jetbrains.com/help/idea/creating-and-running-your-first-java-application.html |
| `primitive-types-and-variables` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html<br>https://dev.java/learn/language/constructs/basics/primitive-types/<br>https://dev.java/learn/language/constructs/basics/variables/<br>https://dev.java/learn/language/constructs/basics/using-var/ |
| `strings-and-string-methods` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html<br>https://dev.java/learn/language/constructs/numbers-strings/strings/<br>https://openjdk.org/jeps/378 |
| `arithmetic-comparison-and-logical-operators` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://dev.java/learn/language/constructs/basics/using-operators/<br>https://dev.java/learn/language/constructs/basics/all-operators/ |
| `if-else-and-switch` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://dev.java/learn/language/constructs/basics/controlling-flow/<br>https://dev.java/learn/language/constructs/basics/switch-statement/<br>https://dev.java/learn/language/constructs/basics/switch-expression/<br>https://openjdk.org/jeps/361 |
| `for-while-and-do-while-loops` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html<br>https://dev.java/learn/language/constructs/basics/controlling-flow/ |
| `writing-methods` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://dev.java/learn/language/oop/classes-objects/defining-methods/ |
| `method-overloading` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://dev.java/learn/language/oop/classes-objects/defining-methods/ |
| `static-members-and-methods` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://dev.java/learn/language/oop/classes-objects/more-on-classes/<br>https://dev.java/learn/first-steps/first-java-code/getting-started/ |
| `pass-by-value` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html<br>https://dev.java/learn/language/oop/classes-objects/calling-methods-constructors/ |
| `method-practice` | https://dev.java/learn/language/oop/classes-objects/defining-methods/<br>https://dev.java/learn/language/oop/classes-objects/calling-methods-constructors/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html |
| `recursion-and-the-call-stack` | https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StackOverflowError.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html |
| `two-pointers-reversing-and-counting` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html<br>https://dev.java/learn/language/constructs/numbers-strings/strings/<br>https://dev.java/learn/language/constructs/numbers-strings/string-builders/ |
| `debugging-with-breakpoints` | https://www.jetbrains.com/help/idea/debugging-code.html<br>https://www.jetbrains.com/help/idea/using-breakpoints.html<br>https://code.visualstudio.com/docs/java/java-debugging |
| `ai-assistants-explain-not-answer` | https://docs.github.com/en/copilot/get-started/best-practices<br>https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide<br>https://docs.github.com/en/copilot/responsible-use/chat-in-your-ide |
| `declaring-and-looping-over-arrays` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-10.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html<br>https://dev.java/learn/language/constructs/basics/arrays/ |
| `linear-and-binary-search` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html<br>https://dev.java/learn/language/constructs/basics/arrays/ |
| `arraylist-basics` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayList.html<br>https://dev.java/learn/api/collections-and-streams/collections-framework/<br>https://dev.java/learn/language/constructs/numbers-strings/autoboxing/ |
| `hashmap-basics` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html<br>https://dev.java/learn/api/collections-and-streams/collections-framework/ |
| `classes-and-objects` | https://dev.java/learn/language/oop/classes-objects/creating-classes/<br>https://dev.java/learn/language/oop/classes-objects/creating-objects/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html |
| `constructors` | https://dev.java/learn/language/oop/classes-objects/defining-constructors/<br>https://dev.java/learn/language/oop/classes-objects/more-on-classes/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html |
| `access-modifiers` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html<br>https://dev.java/learn/language/oop/classes-objects/more-on-classes/ |
| `encapsulation-with-getters-and-setters` | https://dev.java/learn/language/oop/classes-objects/more-on-classes/<br>https://dev.java/learn/language/oop/classes-objects/design-best-practices/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html |
| `classes-in-practice-project` | https://dev.java/learn/language/oop/classes-objects/creating-classes/<br>https://dev.java/learn/language/oop/classes-objects/design-best-practices/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html<br>https://maven.apache.org/guides/introduction/introduction-to-the-pom.html<br>https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html<br>https://maven.apache.org/plugins/maven-dependency-plugin/go-offline-mojo.html<br>https://maven.apache.org/ref/current/maven-embedder/cli.html<br>https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html<br>https://maven.apache.org/surefire/maven-surefire-plugin/ |
| `stack-vs-heap-and-object-references` | https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html |
| `string-immutability` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html<br>https://dev.java/learn/language/constructs/numbers-strings/string-builders/ |
| `double-equals-vs-equals` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html |
| `final-and-tostring` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html |
| `enums` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Enum.html<br>https://dev.java/learn/language/oop/classes-objects/enums/ |
| `inheritance` | https://dev.java/learn/language/oop/inheritance/what-is-inheritance/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html |
| `polymorphism-overriding-vs-overloading` | https://dev.java/learn/language/oop/inheritance/overriding/<br>https://dev.java/learn/language/oop/inheritance/polymorphism/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html |
| `abstract-classes` | https://dev.java/learn/language/oop/inheritance/abstract-classes/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html |
| `interfaces-and-default-methods` | https://dev.java/learn/language/oop/interfaces/defining-interfaces/<br>https://dev.java/learn/language/oop/interfaces/examples/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html |
| `composition-over-inheritance` | https://dev.java/learn/language/oop/inheritance/what-is-inheritance/<br>https://dev.java/learn/language/oop/classes-objects/design-best-practices/ |
| `solid-basics` | https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/<br>https://dev.java/learn/language/oop/classes-objects/design-best-practices/ |
| `functional-interfaces-and-anonymous-classes` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/FunctionalInterface.html<br>https://dev.java/learn/language/oop/classes-objects/nested-classes/<br>https://dev.java/learn/language/fp/lambdas/functional-interfaces/ |
| `records` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html<br>https://dev.java/learn/language/oop/records/<br>https://openjdk.org/jeps/395 |
| `singleton-and-factory-patterns` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html<br>https://dev.java/learn/language/oop/classes-objects/design-best-practices/ |
| `checked-vs-unchecked-exceptions` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-11.html<br>https://dev.java/learn/language/annotations-exceptions/exceptions/what-is-an-exception/<br>https://dev.java/learn/language/annotations-exceptions/exceptions/unchecked-exception-controversy/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/RuntimeException.html |
| `try-catch-finally-and-try-with-resources` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html<br>https://dev.java/learn/language/annotations-exceptions/exceptions/catching-handling/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/AutoCloseable.html |
| `custom-exceptions` | https://dev.java/learn/language/annotations-exceptions/exceptions/throwing/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Exception.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Throwable.html |
| `reading-stack-traces` | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Throwable.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StackTraceElement.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html<br>https://openjdk.org/jeps/358 |
| `logging` | https://docs.oracle.com/en/java/javase/25/docs/api/java.logging/java/util/logging/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.Logger.html<br>https://www.slf4j.org/manual.html |
| `how-a-request-travels` | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview<br>https://www.rfc-editor.org/rfc/rfc3986.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `http-methods-status-codes-and-json` | https://www.rfc-editor.org/rfc/rfc9110.html<br>https://www.rfc-editor.org/rfc/rfc8259.html |
| `routes-and-handlers-in-javalin` | https://javalin.io/documentation<br>https://javalin.io/tutorials/testing |
| `lambdas-as-handlers` | https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html<br>https://dev.java/learn/language/fp/lambdas/first-lambdas/<br>https://dev.java/learn/language/fp/lambdas/method-references/<br>https://javalin.io/documentation |
| `repository-wiring-and-errors-project` | https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html<br>https://dev.java/learn/language/oop/classes-objects/defining-constructors/<br>https://javalin.io/documentation<br>https://javalin.io/tutorials/testing<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://dev.java/learn/language/annotations-exceptions/exceptions/throwing/ |
| `junit-test-first` | https://docs.junit.org/current/user-guide/<br>https://junit.org/<br>https://maven.apache.org/surefire/maven-surefire-plugin/examples/junit-platform.html |
| `test-doubles-fakes-and-stubs` | https://docs.junit.org/current/user-guide/<br>https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/ |
| `mocking-with-mockito` | https://site.mockito.org/<br>https://site.mockito.org/javadoc/current/org/mockito/Mockito.html |
| `code-coverage` | https://www.jacoco.org/jacoco/trunk/doc/<br>https://www.jacoco.org/jacoco/trunk/doc/counters.html<br>https://www.jacoco.org/jacoco/trunk/doc/maven.html |
| `java-review` | https://docs.oracle.com/javase/specs/jls/se25/html/index.html<br>https://javalin.io/documentation<br>https://docs.junit.org/current/user-guide/<br>https://site.mockito.org/javadoc/current/org/mockito/Mockito.html |
| `reading-older-java-code` | https://dev.java/learn/first-steps/evolution/<br>https://openjdk.org/jeps/126<br>https://openjdk.org/jeps/286<br>https://openjdk.org/jeps/361<br>https://openjdk.org/jeps/378<br>https://openjdk.org/jeps/394<br>https://openjdk.org/jeps/395<br>https://openjdk.org/jeps/441<br>https://openjdk.org/jeps/512<br>https://docs.oracle.com/en/java/javase/25/migrate/preparing-migration.html<br>https://docs.oracle.com/en/java/javase/25/migrate/removed-tools-and-components.html |

Lab plan sources: https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html, https://maven.apache.org/guides/introduction/introduction-to-the-pom.html, https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html, https://maven.apache.org/ref/current/maven-embedder/cli.html, https://maven.apache.org/plugins/maven-dependency-plugin/go-offline-mojo.html, https://maven.apache.org/surefire/maven-surefire-plugin/, https://maven.apache.org/surefire/maven-surefire-plugin/examples/junit-platform.html, https://docs.junit.org/current/user-guide/.

Calendar references for the `java` technology: [Dev.java: Learn Java](https://dev.java/learn/), [Maven in 5 minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html), [Javalin documentation](https://javalin.io/documentation), [JUnit](https://junit.org/), [Mockito](https://site.mockito.org/). All five are in the snapshot.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet. The module PR SME critic verifies the authored bytes.

## Intake criticism

Fresh independent educational and technology-SME critics reviewed the first intake commit (manifests, objectives, blueprint, this intake and the source snapshot); the author did not approve its own first output. Their reports and the non-author reconciliation are committed unchanged as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json` next to this file.

Outcome: all 11 findings accepted and applied in one correction loop. education-01 and java-sme-001 (one item) were first escalated, then accepted on captain decision pep-project-rows, option A; the reconciliation file records the final decisions.

- education-01 and java-sme-001: first planned as six per-row briefs, then consolidated by the intake-2 reconciliation (below).
- education-02 and java-sme-004: `two-pointers-reversing-and-counting` (F7) now uses only Strings and indexes (build a reversed String, count matching characters or pairs, choose the stopping condition) and never calls String reversal in place; in-place array reversal moved to `declaring-and-looping-over-arrays` o3 (F8).
- education-03: `routes-and-handlers-in-javalin` objectives were first narrowed to trace, select and predict with no lab; the intake-2 reconciliation then restored implementation objectives with a required guided local run (below).
- education-04: `pass-by-value` (F6) stays on primitive copying and reassigning a String parameter; shared mutable-object transfer with arrays is left to F8 authoring.
- education-05 and java-sme-002: `reading-older-java-code` o3 asks learners to predict whether an older example compiles on JDK 25 and name the feature or migration issue; older source often, not always, stays compatible. Two JDK 25 migration-guide sources were added.
- java-sme-003: `strings-and-string-methods` o3 states String immutability without promising a newly allocated object.
- education-06: blueprint objectives updated (see F18 assessment blueprint).
- java-sme-005: the third-party javadoc.io Mockito record was replaced by the first-party `site.mockito.org` API documentation with a fresh receipt.

Rechecks of that correction are committed as `intake-critic-education-recheck.json` and `intake-critic-sme-recheck.json`, with the second non-author reconciliation `intake-2-reconciliation.json`, all unchanged. Every intake-2 decision is accepted and applied in this second correction loop:

- education-recheck-01 and java-sme-recheck-006: exactly two canonical project artifacts, one F10 and one F16 brief, each with one starter scaffold and one public test suite and mapping its day's three pointers as integrated outcomes. The six per-row briefs and the `classes-in-practice` module are removed, restoring the frozen 53-topic set.
- education-recheck-02: manifest order follows F9, F10, F11: the F10 brief sits in `classes-and-objects` `topicOrder` between the F9 and F11 topics, which also keeps every topic path the critics reviewed.
- java-sme-recheck-007: per-concept teach-before-apply map (see Project briefs); the F15 routes topic regains implementation objectives with a required guided local run.
- java-sme-recheck-008: the F10 brief distinguishes guarding permitted null from rejecting forbidden null with `Objects.requireNonNull`, which throws NullPointerException; it never says requireNonNull prevents the exception.
- education-01 and java-sme-001: closed by the consolidated F10 brief and the teach-before-apply map.
