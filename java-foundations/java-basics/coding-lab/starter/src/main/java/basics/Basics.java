package basics;

/**
 * Java Basics lab. Complete the six methods marked TODO.
 * Each method receives its input as parameters and returns its result.
 * The public tests call every method with several inputs, including edge
 * cases, so work each result out from the parameters. The README lists the
 * steps for every task. main is complete: it prints one line per task.
 */
public class Basics {

    // Task 1 (primitive types): the average of a and b, keeping the fraction.
    static double average(int a, int b) {
        return 0; // TODO: return the average of a and b
    }

    // Task 2 (strings): the first letter of first and of last, in upper case.
    static String initials(String first, String last) {
        return ""; // TODO: return the initials
    }

    // Task 3 (operators): true when n is even. Use the remainder operator %.
    static boolean isEven(int n) {
        return false; // TODO: return whether n is even
    }

    // Task 4 (if/else): "A" for 90 or more, "B" for 80 or more, "C" for 70 or more, otherwise "F".
    static String grade(int score) {
        return "?"; // TODO: choose the grade with if / else if / else
    }

    // Task 5 (switch): 1 to 5 is "weekday", 6 or 7 is "weekend", anything else is "unknown".
    static String dayType(int day) {
        return "?"; // TODO: return the result of a switch expression with arrow labels
    }

    // Task 6 (loops): the numbers from n down to 1, separated by single spaces, such as "3 2 1".
    // For n of 0 or less, return "".
    static String countdown(int n) {
        return ""; // TODO: build the text with a for loop
    }

    public static void main(String[] args) {
        System.out.println("Average: " + average(90, 85));
        System.out.println("Initials: " + initials("ada", "lovelace"));
        System.out.println("Even: " + isEven(42));
        System.out.println("Grade: " + grade(85));
        System.out.println("Day: " + dayType(6));
        System.out.println("Countdown: " + countdown(5));
    }
}
