# How transactions work in Spring

## Objectives

- Mark a service method @Transactional so that several repository writes commit or roll back together
- Predict whether a transaction rolls back for an unchecked exception, a checked exception and a self-invocation through this
- Use @Transactional(readOnly = true) for read paths and explain the proxy that applies transactional behavior

## Teaching

A service method moves a seat between two workshops:

```
@Transactional
public void move(long from, long to) {
  repository.decrease(from);
  repository.increase(to);
}
```

The `increase` call throws an unchecked exception.

Put `@Transactional` on the service method that represents one business operation, so that its repository calls commit or roll back together.

Use `@Transactional(readOnly = true)` on read paths. It states intent and lets Hibernate skip work such as dirty checking, and some databases can optimize for it.

```
@Transactional(readOnly = true)
public List<Workshop> open() { return repo.findByOpenTrue(); }
```

Spring applies `@Transactional` through a proxy around your bean: the call goes through the proxy, which begins a transaction, calls your method, and then commits or rolls back.

A call enters through the transactional proxyA caller invokes the proxy, which starts the transaction and calls the real bean. A this-call inside the bean does not pass through the proxy. Caller Proxy starts transaction Your service method Proxy commits or rolls back

A this-call inside the bean skips the proxy.

Two surprises follow. By default, rollback happens for unchecked exceptions and errors, not for checked exceptions. And a self-invocation through `this` skips the proxy, so its annotation has no effect.

A class has `public void a() { this.b(); }` and `@Transactional public void b() { ... }`. A controller calls `a()`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@Transactional` on a service method groups writes into one commit or rollback.
- A proxy applies it, so a self-invocation through `this` skips it.
- By default, unchecked exceptions roll back and checked exceptions commit.

## Cheat sheet

Where to act: Add one annotation above each method.

Next step: One method writes twice; the other only reads. Which attribute expresses the second case?

Printed alternative: Add @Transactional to move, and @Transactional(readOnly = true) to countOpen. Starter file: `SeatService.java`.

Where to act: Start with the exception control set to checked.

Next step: What extra attribute tells Spring that a checked exception should roll back too? Also look at how the method is called.

Printed alternative: Through the proxy, unchecked: rollback. Through the proxy, checked: commit, unless rollbackFor is set. Self-invocation: no transaction.

- `@Transactional(rollbackFor = Exception.class)` includes checked exceptions.
- Use `readOnly = true` on read paths.

## Sources

Status: unreviewed first draft, 2026-11-04. Sources were fetched live on 2026-11-04; no independent education or technology review has happened yet, so every claim here remains unverified by a reviewer.

- https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
- https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
- https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html
- https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. All writes in the transaction commit or roll back together.
- **B. Not this one:** It ran inside a transaction that has not committed yet.
- **C. Not this one:** Inside the service method transaction, they share one transaction.
- **D. Not this one:** An unchecked exception triggers a rollback by default.

### terminal

**Printed alternative:** Add @Transactional to move, and @Transactional(readOnly = true) to countOpen. Starter file: `SeatService.java`.

### explore

**Printed alternative:** Through the proxy, unchecked: rollback. Through the proxy, checked: commit, unless rollbackFor is set. Self-invocation: no transaction.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Move `b` to another bean, or annotate the method the proxy actually receives.
- **B. Not this one:** The annotation only works through the proxy.
- **C. Not this one:** Attributes do not change whether the proxy is involved.
- **D. Not this one:** It compiles normally, which is why this is easy to miss.
