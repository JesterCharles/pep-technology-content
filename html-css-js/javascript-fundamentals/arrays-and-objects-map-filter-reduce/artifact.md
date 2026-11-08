# Arrays and objects: map, filter, reduce

## Objectives

- Create and read object literals and arrays of objects
- Transform an array of objects with map and filter without mutating the original array
- Compute a total with reduce and an explicit initial value

## Teaching

Think about Java streams, then predict what this prints.

```
const prices = [1, 2];
const doubled = prices.map((p) => p * 2);
console.log(prices, doubled);
```

An object literal groups named values, with no class needed: `{ name: "Mug", price: 8 }`. Read a property with a dot, `item.price`, or with brackets when the key is in a variable, `item[key]`. A missing property gives `undefined` rather than an error.

Arrays hold any values and are zero-indexed, and `length` gives the count. API data usually arrives as an array of objects, so combine both: `cart[0].price`.

```
const last = cart[cart.length - 1];
```

`filter` keeps the items for which your callback returns a truthy value. `map` returns one new value per item. Both return a new array and leave the original alone, as long as your callback does not mutate the items.

```
const big = nums.filter((n) => n > 10);
const text = nums.map((n) => "n=" + n);
```

They chain, because each returns an array: `list.filter(...).map(...)`.

`reduce` folds an array into one value. Your callback receives the running value and the current item, and returns the next running value. The second argument is the starting value.

```
const sum = nums.reduce((acc, n) => acc + n, 0);
```

Always pass that initial value. Without it, the first item becomes the start, so an array of objects breaks the arithmetic, and an empty array throws a `TypeError`.

A teammate adds a discount. The output looks right, but a later page shows the wrong full price.

```
const sale = products.map((p) => {
  p.price = p.price * 0.5;
  return p;
});
```

## Recap

Objects group named values and arrays hold ordered ones; API data is usually both. `filter` selects, `map` transforms and `reduce` folds into one value with an explicit initial value. All three return results without changing the array, as long as your callback does not mutate the items.

## Cheat sheet

What does line 3 print?

- `[ 1, 2 ] [ 2, 4 ]`: correct. `map` builds and returns a new array. The original stays as it was.
- `[ 2, 4 ] [ 2, 4 ]`: not correct. That would mean `map` changes the array in place. It does not.
- `[ 1, 2 ] undefined`: not correct. That is what `forEach` returns. `map` returns a new array.
- A TypeError, because `prices` is const: not correct. `const` stops reassignment, and `map` neither reassigns nor mutates here.

Where to act: The first `console.log`.

Next step: Indexes start at zero, so count the second item from there, then add the property with a dot.

const cart = [ { name: "Mug", price: 8, qty: 2 }, { name: "Cap", price: 15, qty: 1 }, ]; console.log(___); console.log(___);

Add a third object, then read a property through an index. The last item is at index length minus one. The output is Cap then 2.

Where to act: The callback you pass to `filter`.

Next step: It receives one product and should return a true or false value. Look at which property answers that question.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The callback you pass to `map`.

Next step: It receives one product and returns one string. Join the name, a colon and a space, then the price.

const products = [ { name: "Mug", price: 8, inStock: true }, { name: "Cap", price: 15, inStock: false }, { name: "Bag", price: 40, inStock: true }, ]; const available = ___; const labels = ___; console.log(labels);

Filter by the inStock property, then map each remaining product to a string of its name, a colon and its price. There are two labels, and the original array keeps three unchanged objects.

Where to act: The `reduce` callback.

Next step: Name its two parameters for what they hold: the total so far and one cart item. Return the new total.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: After the callback, inside the `reduce` parentheses.

Next step: Ask what the total should be before any item has been counted, then supply that as the second argument.

function cartTotal(items) { return ___; } const cart = [ { price: 8, qty: 2 }, { price: 15, qty: 1 }, ]; console.log(cartTotal(cart)); console.log(cartTotal([]));

Use reduce with a callback adding price times qty to the running total, and pass an explicit initial value of zero. The cart totals 31, and the empty array gives 0.

What is wrong with this code?

- The callback mutates each original object, so `products` now holds halved prices too: correct. `map` returns a new array, but these are the same objects. Return a new object from the callback instead of changing `p`.
- `map` always copies objects, so nothing is wrong and the bug is elsewhere: not correct. `map` copies nothing. It collects whatever your callback returns, and here that is the same object.
- A `map` callback cannot use braces: not correct. Block bodies are fine as long as they `return`, and this one does.
- It should use `reduce` with an initial value: not correct. `map` fits a one-to-one transform. The problem is the mutation, not the method.

```
const active = users.filter((u) => u.active);
const emails = users.map((u) => u.email);
const sum = nums.reduce((acc, n) => acc + n, 0);
```

## Sources

- MDN: Working with objects, retrieved 2026-11-04
- MDN: Array.prototype.filter, retrieved 2026-11-04
- MDN: Array.prototype.map, retrieved 2026-11-04
- MDN: Array.prototype.reduce, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does line 3 print?

- `[ 1, 2 ] [ 2, 4 ]`: correct. `map` builds and returns a new array. The original stays as it was.
- `[ 2, 4 ] [ 2, 4 ]`: not correct. That would mean `map` changes the array in place. It does not.
- `[ 1, 2 ] undefined`: not correct. That is what `forEach` returns. `map` returns a new array.
- A TypeError, because `prices` is const: not correct. `const` stops reassignment, and `map` neither reassigns nor mutates here.

### terminal

### Static alternative

Add a third object, then read a property through an index. The last item is at index length minus one. The output is Cap then 2.

### terminal

### Static alternative

Filter by the inStock property, then map each remaining product to a string of its name, a colon and its price. There are two labels, and the original array keeps three unchanged objects.

### terminal

### Static alternative

Use reduce with a callback adding price times qty to the running total, and pass an explicit initial value of zero. The cart totals 31, and the empty array gives 0.

### mcq

### Static alternative

What is wrong with this code?

- The callback mutates each original object, so `products` now holds halved prices too: correct. `map` returns a new array, but these are the same objects. Return a new object from the callback instead of changing `p`.
- `map` always copies objects, so nothing is wrong and the bug is elsewhere: not correct. `map` copies nothing. It collects whatever your callback returns, and here that is the same object.
- A `map` callback cannot use braces: not correct. Block bodies are fine as long as they `return`, and this one does.
- It should use `reduce` with an initial value: not correct. `map` fits a one-to-one transform. The problem is the mutation, not the method.
