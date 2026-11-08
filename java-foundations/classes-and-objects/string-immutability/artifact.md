# String immutability

## Objectives

- Predict that String methods return new strings and leave the original unchanged
- Use StringBuilder to build a string inside a loop
- Explain why immutability makes strings safe to share between references

## Teaching

Before any explanation, predict what this program prints.

```
// inside main:
String s = "java";
s.toUpperCase();
System.out.println(s);
```

A `StringBuilder` is the mutable partner. Its `append`, `insert` and `reverse` methods change the builder object itself.

Because a `String` cannot change, `line = line + i + ","` inside a loop builds a whole new string on every pass and drops the old one. A `StringBuilder` keeps one growing buffer instead:

```
StringBuilder sb = new StringBuilder();
for (String w : words) {
    sb.append(w).append(' ');
}
String sentence = sb.toString();
```

`toString()` copies the finished contents into an ordinary `String`.

Because no code can change a `String` object, any number of variables can safely share one: a change always means a new string, and the other variables keep the old one. A shared mutable object, such as a `StringBuilder`, behaves differently.

## Model

The model: a `String` object is immutable: once created, its characters never change. Methods such as `toUpperCase`, `replace`, `concat` and `trim` return the result as a string and leave the original untouched; when there is nothing to change, some may simply return the same string. To keep a result, assign it: `s = s.trim();`. That moves the variable to the result; the old string is not altered.

## Recap

- A `String` never changes; its methods return results, so keep one with an assignment such as `s = s.trim();`.
- Reassigning a `String` variable moves that variable to a new string; other variables keep the old one.
- Because strings cannot change, sharing one among many references is always safe.
- Use one `StringBuilder` to build text in a loop, then call `toString()` once.

## Cheat sheet

Where to act: The call shown after Item:, above the two buttons.

Next step: First look at the variable's type: is the call made on `s` or on `sb`? The type decides the answer before the method name does.

Where to act: The line `String line = "";` and the loop body under it.

Next step: Replace the empty string with a new builder, and turn the reassignment inside the loop into calls on that builder, one for each piece the old line added.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `return` line.

Next step: The method promises a `String`, but your builder is a `StringBuilder`; use the method from the teaching that turns the finished contents into a `String`.

|  |  |
| --- | --- |
| Keep a result | `s = s.toUpperCase();` |
| Builder | `StringBuilder sb = new StringBuilder();` |
| Add | `sb.append(x);` |
| Finish | `String text = sb.toString();` |
| Few pieces | `"Hi " + name` is fine |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- String (Java SE 25 API): strings are constant and cannot be changed after creation; toUpperCase, replace, concat and trim return their result, and trim returns this string when there is nothing to remove.
- StringBuilder (Java SE 25 API): a mutable sequence of characters; append, insert and reverse modify the builder and return it; toString.
- Dev.java: Strings: String objects are immutable.
- Dev.java: String Builders: using StringBuilder to build strings efficiently.

## Static interaction alternatives

### predict

Expected results and why. It prints java . toUpperCase() returns its result instead of changing the string, and the result is ignored. Keeping the result needs s = s.toUpperCase(); .

### drag

Expected results and why. Original unchanged, result returned: s.toUpperCase() , s.replace('a', 'o') , s.concat("!") , s.trim() . Changes the object itself: sb.append("!") , sb.reverse() , sb.insert(0, "x") .

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: rewrite the body of numbers so it creates one StringBuilder before the loop, appends inside the loop, and returns the builder's contents as a String after the loop. Keep the loop and the signature. Starter, Report.java: class Report { // Rewrite this body to use a StringBuilder. // numbers(3) must still return "1,2,3,". static String numbers(int n) { String line = ""; for (int i = 1; i <= n; i++) { line = line + i + ","; } return line; } } What the practice editor reads: top-level classes with fields, constructors and methods; it checks declarations and statement shapes, and reports anything else as not supported. How to compare: numbers(3) must still return 1,2,3, . The five checks are the unchanged signature, a builder created before the loop, append inside the loop, no + or += reassignment inside the loop, and a return of the builder's toString() .

### mcq

Expected results and why. The String version prints hi : a + "!" makes a new string and moves only a , so the shared string is untouched. The StringBuilder version prints hi! : both variables refer to one builder, and append changed it. Immutability is what makes sharing a String safe.
