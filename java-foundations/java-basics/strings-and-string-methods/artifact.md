# Strings and string methods

## Objectives

- Build strings with literals, concatenation and text blocks
- Use length, charAt, substring, indexOf, toUpperCase and strip, predicting zero-based indexes
- Explain that String objects are immutable: length, charAt and indexOf return a number or a character, and toUpperCase or strip return a String value without changing the original

## Teaching

### Start with a guess

Practice prediction, not scored.

### Build strings, count from zero

A `String` literal goes in double quotes. `+` joins strings, left to right; once one side is a `String`, numbers join as text, so `"Total: " + 1 + 2` is `"Total: 12"`. A text block, opened and closed with `"""`, holds several lines.

Characters are numbered from 0, so the last index is `length() - 1`. `charAt(i)` returns one `char`. `substring(b, e)` starts at index `b` and stops before `e`. `indexOf("Java")` returns where the text first starts, or `-1`.

### Strings never change

A `String` object is immutable. `length()`, `charAt` and `indexOf` return a number or a character. `toUpperCase()` and `strip()`, which removes spaces at both ends, return a `String` value and leave the original as it was.

To keep the result, store it: `s = s.toUpperCase();`. Calling `s.toUpperCase();` on its own changes nothing.

### Apply it to new code

Track which lines store a result and which throw it away.

## Model

String s = "Hello, Java": one immutable value, indexed from 0. The shell is a simulation of jshell.

1. H 0
2. e 1
3. l 2
4. l 3
5. o 4
6. , 5
7. ␣ 6
8. J 7
9. a 8
10. v 9
11. a 10

Variables

| Name | Type | Value |
| --- | --- | --- |
| Variables appear here while you use the practice jshell. |  |  |

Last result: none yet.

## Recap

- Build strings with literals, `+` (left to right) and `"""` text blocks.
- Indexes start at 0; `substring(b, e)` stops before `e`; `indexOf` gives `-1` when the text is missing.
- Strings are immutable: methods return values; assign the result to keep it.

Next topic: Arithmetic, comparison and logical operators

## Cheat sheet

|  |  |
| --- | --- |
| `s.length()` | number of characters |
| `s.charAt(0)` | first character, a char |
| `s.substring(7)` | from index 7 to the end |
| `s.substring(0, 5)` | indexes 0 to 4 |
| `s.indexOf("Java")` | first index, or -1 |
| `s.toUpperCase()` | an upper-case String value |
| `s.strip()` | a String without spaces at both ends |

```
String note = """
    Line one
    Line two
    """;
```

The text block above holds two lines, each ending in a line break. The practice jshell does not take text blocks; try them in a source file or the real jshell.

## Sources

Checked against these live official sources on 2026-10-13. The practice jshell was checked against a real JDK 25.0.4.1 jshell for every example on this page.

- Java SE 25 API: String
- Dev.java: Strings
- JEP 378: Text Blocks

## Static interaction alternatives

### predict

Prediction (practice, not scored): String s = "Java"; s.toUpperCase(); System.out.println(s); Options: Java; JAVA; a compile error; null. Answer: Java. toUpperCase returns a new upper-case value, but the line does not store it, and the String s refers to never changes. It compiles, and s is not null.

### explore

Index activity, worked example. In "Hello, Java", H is index 0 and the last a is index 10; length() is 11. s.substring(7, 11) is "Java": it starts at index 7 and stops before 11. s.substring(0, 5) is "Hello": indexes 0 to 4. s.substring(7, 10) would give "Jav", because the end index is not included.

### terminal

jshell activity, worked example. String s = "Hello, Java"; then s.length() prints 11 and s.charAt(0) prints 'H' (a number and a char). s.toUpperCase() prints "HELLO, JAVA", yet s on its own still prints "Hello, Java": the original is unchanged. "Length: " + s.length() prints "Length: 11". s.charAt(11) throws StringIndexOutOfBoundsException, because the last index is 10.

### mcq

Apply question: String name = "  ana  "; name.strip(); int n = name.length(); Options: 7 (correct: strip returns a new value that is thrown away, so name still has its 7 characters); 3; 5; a compile error. Retry: adding name = name.strip(); before the length line makes n equal 3; calling name.strip() twice, name.toUpperCase() or printing name changes nothing.
