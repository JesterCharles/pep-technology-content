# Reading: how auto-configuration works

## Objectives

- Explain how @SpringBootApplication combines configuration, component scanning and auto-configuration
- Predict whether an auto-configured bean is created from its conditions, such as a class on the classpath, a property value or a missing user-defined bean
- Use the --debug condition evaluation report to find why an auto-configuration did or did not apply

## Teaching

Your project has `spring-boot-starter-webmvc` and H2 on the classpath, and no bean of type `DataSource`. You add nothing else and start the app with `spring-boot-starter-data-jpa` present.

`@SpringBootApplication` combines three annotations. `@SpringBootConfiguration` makes the class a source of bean definitions, `@ComponentScan` finds your components in and below its package, and `@EnableAutoConfiguration` applies auto-configuration classes. Given explicit base packages, `@ComponentScan` scans only those.

Auto-configuration classes are normal configuration classes guarded by conditions. The common ones are:

- `@ConditionalOnClass`: a class is on the classpath.
- `@ConditionalOnMissingBean`: you have not defined your own.
- `@ConditionalOnProperty`: a property has a given value.

Your own bean usually wins, because the auto-configured one backs off when it finds yours.

To see why something did or did not apply, start the app with `--debug`, or set `debug=true`. Boot prints a conditions evaluation report.

```
Positive matches:
  ...  matched
Negative matches:
  ...  Did not match: @ConditionalOnClass did not find class
```

Positive matches applied. Negative matches were skipped, with the reason. Exclusions were switched off deliberately.

You define your own `ObjectMapper` bean. A teammate worries that Boot will now also create one and that the two will conflict.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@SpringBootApplication` turns on auto-configuration and scanning.
- Conditions on the classpath, missing beans and properties decide what is created.
- Run with `--debug` to read positive and negative matches.

## Cheat sheet

A hotel room arrives with a kettle unless you say you brought your own. The rule depends on what the room can support and what you already have. Nobody asks you to fit a kettle yourself.

Conditions check what is available and what you already provided, then fill the gap.

Where to act: Read the report below the controls.

Next step: A did-not-match line tells you exactly which condition to change.

Printed alternative: H2 on the classpath, no user DataSource and the feature not disabled creates the bean. Any other combination reports the condition that did not match.

Where to act: Look for the words Negative or did not match.

Next step: A line under Positive matches means the feature applied.

- Report: start with `--debug` or set `debug=true`.
- Skip a specific one: the `exclude` attribute of `@SpringBootApplication`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/using/auto-configuration.html
- https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html
- https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html
- https://docs.spring.io/spring-boot/reference/features/spring-application.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** Boot exists to avoid this for common cases.
- **B. Correct answer:** Right. The class is on the classpath and you defined no bean of your own, so the conditions match.
- **C. Not this one:** Boot does not download or install anything at startup.
- **D. Not this one:** Auto-configuration runs while the application context starts.

### explore

**Printed alternative:** H2 on the classpath, no user DataSource and the feature not disabled creates the bean. Any other combination reports the condition that did not match.

### terminal

**Printed alternative:** Replace @SpringBootApplication on ShopApplication with the three annotations it combines, and give the scanning annotation both com.acme.shop and com.acme.web. The starter is shown in the editor; this reading does not include a finished answer.

### mcq

**What each line shows**

- **Line 1 (leave):** A positive match applied, so it was not skipped.
- **Line 2 (mark):** Flyway is not on the classpath, so it was skipped.
- **Line 3 (leave):** This one applied.
- **Line 4 (mark):** A missing property made this condition fail.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Auto-configurations commonly guard beans with a missing-bean condition, so yours wins.
- **B. Not this one:** A missing-bean condition is there to prevent exactly this.
- **C. Not this one:** Running later is what lets it see that your bean already exists.
- **D. Not this one:** Boot never removes a bean you defined in order to add its own.
