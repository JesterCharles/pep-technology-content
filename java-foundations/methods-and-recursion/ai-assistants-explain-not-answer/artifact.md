# Using Copilot and chat assistants to explain, not answer

## Objectives

- Ask an AI assistant to explain an error or a piece of code without asking for the finished solution Open
- Check an assistant's explanation against the official documentation or by running the code Open
- Record what the assistant produced and what you verified yourself Open

## Teaching

### Activity 1 of 3: Predict which request keeps the learning with you

Before any explanation, imagine this. Your method will not compile and javac reports `missing return statement`. You decide to ask an AI assistant, such as GitHub Copilot Chat in your IDE, for help. Predict which request helps you learn to fix it yourself.

### Activity 2 of 3: Check an explanation by running code

AI assistants can produce explanations that sound confident and are still wrong. GitHub’s own guidance is to review and test what Copilot suggests before relying on it. Treat an explanation as a claim to check, in one of two ways:

- Run a small experiment: write the smallest code that shows the claimed behavior and look at the output.
- Read the official documentation: the Java Language Specification or the API documentation for the class involved.

### Activity 3 of 3: Record what the assistant produced and what you verified

Keep a short record whenever an assistant helps you. It shows your instructor, and later you, which ideas came from the tool and which you confirmed yourself. A useful record has three parts:

1. What you asked, in your own explain-not-answer words.
2. What the assistant produced, summarized, without pasting a finished solution.
3. What you verified and how: the experiment you ran or the documentation you read, and the result.

## Recap

- Ask assistants to explain an error or a piece of code, naming the exact problem, and say you will write the fix yourself.
- Treat every explanation as a claim: check it with the smallest experiment, or in the official documentation.
- Keep a short record of what you asked, what the assistant produced and what you verified, and how.

## Cheat sheet

Where to act: Look for the verb at the start of each request.

Next step: Sort the requests into those that ask the assistant to produce code and those that ask it to explain something.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Among the explaining requests, look at what they ask about.

Next step: Prefer the one that names the exact error and asks where the problem is, while saying not to write the fix.

A friend who knows the city well tells you the museum closes at eight. They are usually right, so you note it down, but before you set off you glance at the museum’s own opening-hours sign on its website, because a wasted trip would cost you an evening.

An assistant is the helpful friend; the official documentation or a quick experiment is the sign.

Where to act: In the editor, on the blank line under the comment inside `main`.

Next step: Write one `System.out.println(…)` line for each expression and press Run.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Compare the two lines in Output with each other and with the claim.

Next step: Ask what differs between the two expressions, and whether the claim says `/` behaves the same in both.

Where to act: Start with the first field, What I asked for.

Next step: Choose the option that requests an explanation while explicitly leaving the finished code to you.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Then complete the verification method, two observed-output fields and comparison field.

Next step: Copy the two outputs you observed in Activity 2, then compare them with the sample assistant’s exact-division claim.

Explain-not-answer request template: “Explain what [exact error or line] means in this code and where the problem is. Don’t write the fixed code.”

Check it: run the smallest example, or read the Java Language Specification or the API documentation.

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- GitHub Docs: Best practices for using GitHub Copilot — check Copilot’s work: review and test suggestions
- GitHub Docs: Asking GitHub Copilot questions in your IDE — Copilot Chat in the IDE
- GitHub Docs: Responsible use of GitHub Copilot Chat in your IDE — limitations: responses can be inaccurate
- Java Language Specification SE 25, Chapter 15 (15.17.2 Division Operator /) — integer division rounds toward zero

## Static interaction alternatives

### predict

Question: Which request keeps the learning with you? Option A: “Fix my method.” — Not quite. This asks for the finished answer; you may get working code without learning what was wrong. Option B: “Write a method that returns the sign of a number.” — Not quite. This hands the whole task to the assistant, which is exactly what graded practice is meant to check you can do. Option C: “Explain what missing return statement means for this method and which path has no return. Don’t write the fixed code.” — Correct. It names the exact error, asks for an explanation and a location, and leaves the fix to you. Option D: “Is my code right? Answer yes or no.” — Not quite. A yes or no gives you nothing to learn from, and you cannot check how the assistant decided. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: A sample assistant reply claims that 7 / 2 evaluates to 3.5 in Java. Test it: print 7 / 2 and 7 / 2.0, run the program in your IDE, and compare the two outputs with the claim. Starter code: public class Main { public static void main(String[] args) { // Test the claim: print 7 / 2, then try 7 / 2.0. } }

### mcq

Question: What does your run show about the claim? Option A: The claim is right: both lines print 3.5 — Not quite. Run the experiment again and read Output: the first line is 3, not 3.5. Option B: The claim is wrong for two int values: 7 / 2 prints 3, while 7 / 2.0 prints 3.5 — Correct. When both operands are int, / is integer division and discards the remainder; the Java Language Specification says integer division rounds toward zero. With a double operand the result is 3.5. Option C: The claim is wrong because 7 / 2 rounds up to 4 — Not quite. Integer division in Java rounds toward zero, so 3.5 becomes 3, never 4. Option D: The run cannot settle it; only another assistant can — Not quite. Running the smallest example is exactly how to check a claim about behavior, and the official specification confirms the result. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Structured record form: select an explain-not-answer request, the sample assistant claim that Java division is always exact, a run or official source as the verification method, the observed results for 7 / 2 and 7 / 2.0, and whether those observations supported or contradicted the claim. The page validates only these objective fields and relationships, not free-form prose meaning.
