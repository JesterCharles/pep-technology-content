# Video search record: collections-in-depth

Course `collections-streams`, module `collections-in-depth`, 9 topics, each with a conditional video companion.
Searched and checked on 2026-10-14 between 21:09Z and 21:12Z (UTC).

## Method

- First-party channel searched with YouTube's live in-channel search (`https://www.youtube.com/@java/search?query=...`), the official Java channel run by Oracle's Java developer relations team.
- Queries: collections, hashmap, generics, comparator, equals hashcode, stack queue deque, autoboxing, arraylist linkedlist, big o.
- Each candidate's public watch page was read for `lengthSeconds`, publish date, `playableInEmbed` and its description.
- Accuracy against the frozen sources (`authoring/evidence/collections-streams/source-snapshot.json`) must be judged from what the video says. The only text track for every candidate is YouTube's auto-generated English caption track, and every caption request returned HTTP 429 (Too Many Requests) at 21:10Z and again at 21:11Z. Frames were not inspected and no video was downloaded.
- Rule applied (`authoring/docs/html-artifact-contract.md`, `video-artifact.md`): a video is linked only when it is verified accurate. No candidate could be verified, so every topic records the video companion as absent with this search as its reason. Nothing here claims a candidate is wrong.

## Candidates found (official Java channel)

| Topic | Video | Runtime (s) | Embeddable | Published | Decision |
|---|---|---|---|---|---|
| lists-sets-and-maps-in-depth | [How is List.of() working? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=uOKgixLEgcs) | 60 | yes | 2023-07-13 | Not linked: content unverified (captions HTTP 429) |
| stacks-and-queues | [What are the main operations of a stack or a queue? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=Nt2-PlW1iiQ) | 60 | yes | 2024-02-23 | Not linked: content unverified |
| generics | [What is a generic type? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=8hrwY3gflSw) | 60 | yes | 2023-08-02 | Not linked: content unverified |
| generics | [When should you use ? extends T? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=d650vebo2JY) | 59 | yes | 2023-09-29 | Not linked: content unverified |
| wrapper-types-and-autoboxing | none found in the channel search | - | - | - | Absent |
| big-o-basics | [Choosing between ArrayList and LinkedList - JEP Cafe #20](https://www.youtube.com/watch?v=ul4wHrbJ8Fk) | 1850 | not checked | - | Rejected: 30:50, over the 12-minute budget |
| the-equals-and-hashcode-contract | [What about equals() and hashCode()? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=RIynixWWkXk) | 54 | yes | 2022-12-13 | Not linked: content unverified |
| how-hashmap-works | [What is a bucket in a Map? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=1LzriAPWvXY) | 60 | yes | 2023-04-26 | Not linked: content unverified |
| how-hashmap-works | [How is a HashSet working? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=fpq4SQKLPDs) | 51 | yes | 2024-07-31 | Not linked: content unverified |
| choosing-the-right-collection | [What is the difference between a sorted and an ordered collection? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=Xjm1ESl_Sm0) | 56 | yes | 2023-03-31 | Not linked: content unverified |
| choosing-the-right-collection | [Choosing between ArrayList and LinkedList - JEP Cafe #20](https://www.youtube.com/watch?v=ul4wHrbJ8Fk) | 1850 | not checked | - | Rejected: over the 12-minute budget |
| sorting-with-comparator | [How can you create a Comparator? - Cracking the Java Coding Interview](https://www.youtube.com/watch?v=CvsMHdYLg5c) | 59 | yes | 2023-03-22 | Not linked: content unverified |
| sorting-with-comparator | [Write Efficient Bug-free and Simple Comparators in Java - JEP Café #17](https://www.youtube.com/watch?v=lFbBI85oTnY) | 1178 | not checked | - | Rejected: 19:38, over the 12-minute budget |

## Follow-up

The one-minute "Cracking the Java Coding Interview" candidates are first-party, short and embeddable. A later pass that can read their captions or watch them can verify each against the frozen sources and add a `video-artifact.md` with a `check-video.mjs` receipt.
