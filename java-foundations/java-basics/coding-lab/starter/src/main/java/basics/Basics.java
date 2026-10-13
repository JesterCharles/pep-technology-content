package basics;

/**
 * Java Basics lab. Complete each TODO inside main.
 * Work each answer out from the given variables with Java code. The public
 * tests run this program and read its output, and they also check that each
 * task uses the operator, switch or loop it asks for. The README lists every task.
 */
public class Basics {
    public static void main(String[] args) {
        // Task 1 (primitive types): the average of two scores, keeping the fraction.
        int scoreA = 90;
        int scoreB = 85;
        double average = 0; // TODO: compute the average of scoreA and scoreB
        System.out.println("Average: " + average);

        // Task 2 (strings): initials in upper case, such as "AL" for ada lovelace.
        String first = "ada";
        String last = "lovelace";
        String initials = ""; // TODO: build the initials from first and last
        System.out.println("Initials: " + initials);

        // Task 3 (operators): is n even? Use the remainder operator.
        int n = 42;
        boolean even = false; // TODO: set even with %
        System.out.println("Even: " + even);

        // Task 4 (if/else): grade A for 90 or more, B for 80 or more, C for 70 or more, otherwise F.
        int score = 85;
        String grade = "?"; // TODO: choose the grade with if / else if / else
        System.out.println("Grade: " + grade);

        // Task 5 (switch): day 1 to 5 is "weekday", 6 or 7 is "weekend", anything else is "unknown".
        int day = 6;
        String dayType = "?"; // TODO: use a switch expression with arrow labels
        System.out.println("Day: " + dayType);

        // Task 6 (loops): print "Countdown:" followed by 5 4 3 2 1, each after one space.
        System.out.print("Countdown:");
        // TODO: use a for loop that prints " " + i for i from 5 down to 1
        System.out.println();
    }
}
