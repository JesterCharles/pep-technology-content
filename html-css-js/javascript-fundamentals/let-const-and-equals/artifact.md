# let, const and ===

## Objectives

- Choose const by default and let only when a variable is reassigned
- Predict that a const object's properties can still change while the binding cannot
- Predict the results of == and === comparisons across types, and use === by default

## Teaching

Before any explanation, decide what you think `const` protects.

```
const user = { name: "Ada" };
user.name = "Grace";
console.log(user.name);
```

`let` and `const` both declare block-scoped names. `const` must be initialized and can never be reassigned; assigning to it throws a `TypeError` at run time. `let` may be reassigned.

Use `const` by default, because a reader then knows the name always refers to one value. Reach for `let` only when you actually reassign. Older code uses `var`; avoid it in new code because it ignores block scope.

Changing a property is not reassignment, so a `const` object can still be mutated.

`===` is strict equality: different types are never equal, and same-type values compare directly. `==` is loose equality: when the types differ, it converts values first, using rules that surprise people. `"" == 0` is `true` because the string becomes a number.

`null == undefined` is true, but neither loosely equals anything else. `NaN` equals nothing, not even itself; test it with `Number.isNaN`.

Objects compare by identity under both operators. Use `===` by default.

A teammate reads a quantity from a text field, where an empty field gives the empty string.

```
const input = "";     // the user typed nothing
if (input == 0) {
  console.log("Out of stock");
}
```

## Recap

Use `const` by default and `let` only for names you reassign; `const` protects the binding, not the object. Use `===` by default, because `==` converts types first. `NaN` equals nothing, so test it with `Number.isNaN`.

## Cheat sheet

What does this program do?

- It prints `Grace`: correct. `const` stops the name `user` from being pointed at a different value. The object it points at can still change.
- It prints `Ada`: not correct. The assignment does take effect, because the object itself is not frozen.
- It throws a TypeError on line 2: not correct. That error comes from reassigning the name, as in `user = {}`, not from changing a property.
- It fails to parse: not correct. All three lines are valid syntax.

A permanent label glued to a storage box always names that same box, yet you can still swap what is inside. A chalk label can be wiped and moved to a different box whenever you like.

The glued label behaves like the stricter keyword; the chalk label behaves like the flexible one.

Where to act: Look below each declaration for a line that starts with the same name.

Next step: If you see the name followed directly by `=`, that is reassignment. If you see a dot first, that is only a property change.

___ taxRate = 0.2; ___ itemCount = 0; itemCount = itemCount + 3; ___ order = { id: 7, paid: false }; order.paid = true; console.log(itemCount, order.paid, taxRate);

Decide each keyword by looking for a later assignment to that name. A property change is not reassignment. The program prints 3 true 0.2.

Where to act: The Left value and Right value groups in the model.

Next step: Try a number on one side and a string that looks like that number on the other.

Examples: 0 == "0" and "" == 0 and false == 0 and null == undefined are all true under loose equality and false under strict equality. NaN === NaN and NaN == NaN are both false. Identical same-type values are true under both.

Which review comment is correct?

- It logs "Out of stock" for an empty field because `""` converts to `0`; convert the input deliberately and use `===`: correct. Loose equality converts the empty string to the number 0, so a blank field looks like a real zero. Converting first and comparing strictly makes the intent explicit.
- It never logs, because a string can never equal a number: not correct. That is true of `===`. `==` converts before comparing.
- It throws a TypeError because the types differ: not correct. Neither operator throws for differing types here.
- Change `const` to `let` so the comparison works: not correct. The declaration keyword has no effect on how `==` compares.

| Expression | `==` | `===` |
| --- | --- | --- |
| `0` and `"0"` | true | false |
| `""` and `0` | true | false |
| `null` and `undefined` | true | false |
| `null` and `0` | false | false |
| `NaN` and `NaN` | false | false |

## Sources

- MDN: Equality comparisons and sameness, retrieved 2026-11-04
- MDN: const, retrieved 2026-11-04
- MDN: let, retrieved 2026-11-04
- ECMAScript language specification, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does this program do?

- It prints `Grace`: correct. `const` stops the name `user` from being pointed at a different value. The object it points at can still change.
- It prints `Ada`: not correct. The assignment does take effect, because the object itself is not frozen.
- It throws a TypeError on line 2: not correct. That error comes from reassigning the name, as in `user = {}`, not from changing a property.
- It fails to parse: not correct. All three lines are valid syntax.

### terminal

### Static alternative

Decide each keyword by looking for a later assignment to that name. A property change is not reassignment. The program prints 3 true 0.2.

### explore

### Static alternative

Examples: 0 == "0" and "" == 0 and false == 0 and null == undefined are all true under loose equality and false under strict equality. NaN === NaN and NaN == NaN are both false. Identical same-type values are true under both.

### mcq

### Static alternative

Which review comment is correct?

- It logs "Out of stock" for an empty field because `""` converts to `0`; convert the input deliberately and use `===`: correct. Loose equality converts the empty string to the number 0, so a blank field looks like a real zero. Converting first and comparing strictly makes the intent explicit.
- It never logs, because a string can never equal a number: not correct. That is true of `===`. `==` converts before comparing.
- It throws a TypeError because the types differ: not correct. Neither operator throws for differing types here.
- Change `const` to `let` so the comparison works: not correct. The declaration keyword has no effect on how `==` compares.
