# Two pointers: reversing and counting

## Objectives

- Build and return a reversed String by reading characters with two indexes that move toward each other
- Count matching characters or pairs in a String with two indexes instead of nested loops
- Choose the loop condition that stops two indexes exactly when they meet or cross

## Teaching

### Activity 1 of 3: Predict how often two indexes move

Before any explanation, read this program. One index starts at the front of the word, the other at the back. Predict what it prints.

```
public class Main {
    public static void main(String[] args) {
        String word = "level";
        int i = 0;
        int j = word.length() - 1;
        int steps = 0;
        while (i < j) {
            steps++;
            i++;
            j--;
        }
        System.out.println(steps);
    }
}
```

### Activity 2 of 3: Reverse a String with two indexes

A `String` cannot be changed, so a reversal builds a new one. `toCharArray()` copies the characters into a `char[]` array, which can be changed: `chars[i]` is the character at index `i`, counting from 0.

Put index `i` on the first character and `j` on the last. Swap the two characters, then move `i` right and `j` left. With `while (i < j)` the loop stops as soon as the indexes meet (odd length) or cross (even length), so every pair is swapped exactly once. `new String(chars)` builds the result.

### Activity 3 of 3: Count mirrored pairs without nested loops

The same two indexes can count instead of swap. Each pass compares the character at `i` with its mirror at `j`, adds 1 when they match your rule, then moves both indexes inward. One loop visits each mirrored pair once, so there is no need for a loop inside a loop that compares every character with every other one.

Keep the condition `i < j`: `i <= j` would pair the middle character of an odd-length word with itself.

## Recap

- Two indexes start at the two ends, do their work on each mirrored pair, and move toward each other.
- To reverse, copy the characters with `toCharArray()`, swap each pair, then build a new `String`; strings themselves cannot change.
- `while (i < j)` stops exactly when the indexes meet or cross, so each pair is handled once.

## Cheat sheet

Where to act: Write down the starting values: `i` is 0 and `j` is `word.length() - 1`.

Next step: "level" has 5 characters, so work out the starting value of `j`.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Follow the `while (i < j)` test after each pass.

Next step: List the pairs (i, j) after each pass and stop at the first pair where `i < j` is false.

Two friends tidy a bookshelf that was filled in the wrong order. One starts at the left end, the other at the right; they swap the two books in their hands and each takes one step toward the middle. When they bump into each other, or pass each other, the whole shelf is in reverse order.

The two friends are the two indexes, and bumping or passing is the stop condition.

Where to act: Step until the tracer reaches line 13, `return new String(chars);`.

Next step: Read `i` and `j` in the Variables pane at that step.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Compare that pair with the condition on line 6.

Next step: Check that `i < j` is false for it, and notice whether the indexes are equal or have crossed for this 6-letter word.

Where to act: Begin the method body with three `int` variables.

Next step: Declare a count at 0, `i` at 0 and `j` at `s.length() - 1`, then open a `while (i < j)` loop.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Inside the loop, compare `s.charAt(i)` with `s.charAt(j)`.

Next step: Wrap your rule in an `if` that adds 1 to the count, then end the loop body with `i++` and `j--`; return the count after the loop.

Optional time: about 5 minutes, in addition to the required activity.

Success criteria: Write `isPalindrome(String s)` with the same two indexes that returns `false` as soon as a mirrored pair differs, and test it on "level", "drawer" and "".

```
int i = 0;
int j = s.length() - 1;
while (i < j) {           // stop when they meet or cross
    // work with s.charAt(i) and s.charAt(j)
    i++;
    j--;
}
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Java SE 25 API: java.lang.String — length, charAt with zero-based indexes, toCharArray, and strings are constant
- Dev.java: Strings — characters and indexes in a String
- Dev.java: String Builders — StringBuilder and its reverse method, for comparison

## Static interaction alternatives

### predict

Question: What does the program print? Option A: 5 — Not quite. Each pass moves both indexes, so they cover the word from both ends at once and meet after far fewer passes. Option B: 3 — Not quite. That would count the middle pass (2, 2) too, which happens only with i . With i , the loop stops when both reach 2. Option C: 2 — Correct. The loop runs for (0, 4) and (1, 3). Then i and j are both 2, i is false, and the loop stops. Option D: 4 — Not quite. 4 is the starting value of j, not the number of passes. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Static trace of the program (the loop test on line 6 before each pass, and each return):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | line 6 | `s = "drawer", chars = char[6] {'d', 'r', 'a', 'w', 'e', 'r'} (ref #961), i = 0, j = 5` |
| 2 | line 6 | `s = "drawer", chars = char[6] {'r', 'r', 'a', 'w', 'e', 'd'} (ref #961), i = 1, j = 4` |
| 3 | line 6 | `s = "drawer", chars = char[6] {'r', 'e', 'a', 'w', 'r', 'd'} (ref #961), i = 2, j = 3` |
| 4 | line 6 | `s = "drawer", chars = char[6] {'r', 'e', 'w', 'a', 'r', 'd'} (ref #961), i = 3, j = 2` |
| 5 | reverse returns "reward" | `s = "drawer"` |
| 6 | main returns | `—` |

Printed output: `reward`

### mcq

Question: For "drawer", what are i and j when the loop stops? Option A: i = 3, j = 3 — Not quite. With an even length the indexes never sit on the same character: after (2, 3) they move to (3, 2). Option B: i = 3, j = 2 — Correct. The swaps use (0, 5), (1, 4) and (2, 3). Then i becomes 3 and j becomes 2; they have crossed, so i is false. Option C: i = 6, j = -1 — Not quite. That is where indexes would end if each walked the whole word; this loop stops in the middle. Option D: i = 2, j = 3 — Not quite. At (2, 3) the condition is still true, so that pair is swapped and both indexes move once more. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: Write a static int method with a String parameter that starts index i at 0 and index j at the last index, loops while i < j, adds to a count when the mirrored characters match a rule you choose, moves i up and j down, and returns the count. Call it from main and print the result. Compare the printed count with a count you make by hand. Starter code: public class Main { // Write a method that takes a String, walks index i from the // start and index j from the end toward each other, and // returns how many mirrored pairs match your rule. public static void main(String[] args) { // Call your method on a word and print the count. } }
