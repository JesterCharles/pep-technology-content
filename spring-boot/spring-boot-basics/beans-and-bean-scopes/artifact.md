# Beans and bean scopes

## Objectives

- Register a bean with a stereotype annotation found by component scanning and with a @Bean method in a @Configuration class, and choose between them
- Predict whether two injections receive the same instance for the singleton and prototype scopes
- Explain why a stateless singleton service must not keep per-request data in instance fields

## Teaching

`ClockService` is a Spring bean with no scope settings. Two different controllers each receive it in their constructors, and each logs `System.identityHashCode(clockService)`.

Stereotype plus scanning: add `@Component`, `@Service`, `@Repository` or `@RestController` to a class you own. Component scanning finds it.

`@Bean` method: inside a `@Configuration` class, a method returns the object. Use this for classes you do not own, or when construction needs logic.

```
@Configuration
class TokenConfig {
  @Bean
  SecureRandom secureRandom() { return new SecureRandom(); }
}
```

The method name becomes the default bean name, and the return type is what other beans can inject.

Singleton is the default: one instance per container, shared by every injection and every concurrent request. Prototype gives a new instance each time the bean is requested from the container.

A prototype injected into a singleton is created once, when the singleton is built. It does not renew per call.

Because singletons are shared, instance fields act as shared memory. Two requests running at once can overwrite each other, so keep per-request data in local variables or parameters.

A code review finds the `CartService` shown in the editor below. Two requests reach the one shared instance at once: A starts with alice, B starts with bob, and A's greeting then says Hello bob.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Stereotypes register your classes; `@Bean` methods register objects you cannot annotate.
- Singleton is the default, with one shared instance per container.
- Keep shared singletons stateless: per-request data goes in locals and parameters.

## Cheat sheet

Where to act: Replace the placeholder comment inside the class.

Next step: You cannot put `@Service` on `Clock`, because you do not own that class. So which registration style is left?

Printed alternative: Register a `Clock` bean with a method in a configuration class, because `Clock` is a class you do not own. Register `PriceFormatter`, a class you own, with a stereotype annotation so component scanning finds it. Starter file: `TimeConfig.java`.

Where to act: Change one control at a time and read the output.

Next step: Look at what happens to the username when the data is held in an instance field.

Printed alternative: Singleton with a field: one instance, and both requests can see the last username written. Singleton with a local variable: one instance, each request keeps its own. Prototype: two instances from two injections.

- `@Scope("prototype")` asks for a new instance per container lookup.
- A prototype injected into a singleton is created only once.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html
- https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html
- https://docs.spring.io/spring-framework/reference/core/beans/java/bean-annotation.html
- https://docs.spring.io/spring-framework/reference/core/beans/basics.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Singleton is the default scope: one shared instance per container.
- **B. Not this one:** That describes prototype scope, which you must ask for.
- **C. Not this one:** That is closer to request scope, which you must also ask for.
- **D. Not this one:** A bean is an ordinary object with an identity.

### terminal

**Printed alternative:** Register a `Clock` bean with a method in a configuration class, because `Clock` is a class you do not own, and register `PriceFormatter`, a class you own, with a stereotype annotation so component scanning finds it. Starter file: `TimeConfig.java`.

### explore

**Printed alternative:** Singleton with a field: one instance, and both requests can see the last username written. Singleton with a local variable: one instance, each request keeps its own. Prototype: two instances from two injections.

### terminal

**Printed alternative:** Rewrite CartService so it stores no user between calls and greeting receives the user as a parameter, keeping it a @Service singleton. The starter is shown in the editor; this reading does not include a finished answer.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. A singleton field is shared memory across all concurrent requests.
- **B. Not this one:** They can. Parameters are the correct place for per-request data.
- **C. Not this one:** Static would make the sharing worse, not better.
- **D. Not this one:** That is not the default. Singleton is shared.
