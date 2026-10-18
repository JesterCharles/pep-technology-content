# Stack vs heap and object references

## Objectives

- Draw where local variables, objects and references live for a short program
- Predict the effect of two references pointing to the same object
- Explain when an object becomes unreachable and eligible for garbage collection

## Teaching

Before any explanation, predict what this program prints.

```
class Box {
    int size;
}

// inside main:
Box a = new Box();
a.size = 1;
Box b = a;
b.size = 5;
System.out.println(a.size);
```

Stack frame and heap after Box b = aThe main method's frame on the stack holds count = 3 and two reference variables, a and b. Both arrows point to one Box object on the heap whose size field is 5. Stack: frame of main count = 3 a b Heap Box size = 5

Two references on the stack, one object on the heap.

This is the model the Java Virtual Machine Specification describes. A running JVM may optimize where data really sits, but it never changes what your program can observe.

An object is reachable while a chain of references leads to it from a variable that running code can still use, such as a local variable of a method that has not returned. When no such chain is left, the object is unreachable: no code can ever use it again, so it is eligible for garbage collection. The JVM reclaims its memory when it chooses, possibly never; you cannot force it.

Reassigning a variable or setting it to `null` removes one reference. An object created by `new` but never stored has no reference at all.

Java passes every argument by value. For an object, the value copied into the parameter is the reference, so the method's parameter and the caller's variable point at the same object, but reassigning the parameter moves only the method's own copy.

## Model

The model: each method call gets a frame on its thread's stack. The frame holds that call's parameters and local variables, and it disappears when the call returns. Every object made by `new` lives on the heap, together with its fields. A local variable of a class type holds only a reference: an arrow to an object on the heap.

## Recap

- Each method call has a frame on the stack holding its parameters and local variables.
- Objects made by `new`, with their fields, live on the heap; reference variables hold arrows to them.
- Copying a reference makes two arrows to one object, so a change through either is seen through both.
- An object with no remaining chain of references is unreachable and eligible for garbage collection; the JVM decides when, if ever, to reclaim it.

## Cheat sheet

Where to act: The item shown after Item:, above the two buttons.

Next step: Ask whether the item is a variable declared inside the method, which lives in the call's frame, or something made by `new` or belonging to such an object.

Balloons at a fair are tied to strings that children hold. A child may let go of one string, but the balloon stays as long as anyone still holds a string tied to it. A balloon with no string held by anyone drifts off and is gone for good, whenever the wind happens to take it.

Strings are references; a balloon nobody holds is unreachable, and when it leaves is not up to you.

Where to act: The four boxes listed in the comments, against the last three lines of code.

Next step: Trace which variable refers to which box after every line: `d = b` adds a reference, while `a = c` and `b = null` each move or remove one.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Each box in turn, at the marked line.

Next step: A box is eligible only if no variable at all refers to it at that point. Count the variables still pointing at each box; a count of zero means eligible.

|  |  |
| --- | --- |
| Stack frame | Parameters and local variables of one call |
| Heap | Every object and array, with its fields |
| Alias | `Box b = a;` gives two references to one object |
| Drop a reference | `b = null;` or reassign the variable |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Virtual Machine Specification SE 25, chapter 2: run-time data areas: Java Virtual Machine stacks and frames (2.5.2, 2.6) and the heap where all class instances and arrays are allocated (2.5.3).
- Java Language Specification SE 25, chapter 12: Execution: reachable and unreachable objects and finalization (12.6, 12.6.1).
- Java Language Specification SE 25, chapter 4: Types, Values, and Variables: reference values point to objects, and several references may refer to the same object (4.3.1).
- Java Language Specification SE 25, chapter 15: Expressions: method invocation evaluates argument values and assigns them to new parameter variables (15.12.4).

## Static interaction alternatives

### predict

Expected results and why. It prints 5 : b = a copies the reference, so both variables refer to the same object, and setting size through b changes that one object. It is not 1 (no copy of the object exists), not 6 (the assignment replaces) and not a compile error.

### drag

Expected results and why. count : stack; a local variable. The object made by new Box() : heap. The variable a : stack; it holds a reference. The size field: heap; it belongs to the object. The parameter args : stack; parameters are in the frame. The array args refers to: heap; arrays are objects.

### mcq

Expected results and why. Box 1 and Box 4 are eligible. Box 1's only reference moved away with a = c ; Box 4 was never stored. Box 2 is still referenced by d , and Box 3 by a and c .

### mcq

Expected results and why. It prints 2 : the parameter x holds a copy of the reference, so x.size + 1 changes the caller's box; then x = new Box() points only the parameter at a new box, which receives 100. Retry: it prints 1 2 , because swap exchanges its own parameter copies, not a and b .
