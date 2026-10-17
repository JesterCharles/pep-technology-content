package pep.collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.io.IOException;
import java.io.InputStream;
import java.lang.classfile.ClassFile;
import java.lang.classfile.ClassModel;
import java.lang.classfile.CodeElement;
import java.lang.classfile.CodeModel;
import java.lang.classfile.Instruction;
import java.lang.classfile.Label;
import java.lang.classfile.MethodModel;
import java.lang.classfile.constantpool.ClassEntry;
import java.lang.classfile.constantpool.MemberRefEntry;
import java.lang.classfile.constantpool.PoolEntry;
import java.lang.classfile.instruction.BranchInstruction;
import java.lang.classfile.instruction.InvokeInstruction;
import java.lang.classfile.instruction.LabelTarget;
import java.lang.classfile.instruction.LoadInstruction;
import java.lang.classfile.instruction.StoreInstruction;
import java.lang.classfile.instruction.TypeCheckInstruction;
import java.lang.constant.ClassDesc;
import java.lang.constant.ConstantDescs;
import java.lang.reflect.AccessFlag;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeSet;
import org.junit.jupiter.api.Test;

class OverlapTest {

    /** A read-only list that counts how often it is scanned and refuses contains and get. */
    static final class OnePassList<E> extends AbstractList<E> {
        private final List<E> items;
        private final boolean strict;
        int scans;

        OnePassList(List<E> items) {
            this(items, false);
        }

        OnePassList(List<E> items, boolean strict) {
            this.items = items;
            this.strict = strict;
        }

        @Override
        public Iterator<E> iterator() {
            scans++;
            if (strict && scans > 1) {
                throw new AssertionError("a list was scanned more than once; read each list in one pass");
            }
            return items.iterator();
        }

        @Override
        public E get(int index) {
            throw new AssertionError("b was read by index; read it in one pass instead");
        }

        @Override
        public boolean contains(Object o) {
            throw new AssertionError("b.contains is a hidden loop over b; use a HashSet instead");
        }

        @Override
        public int size() {
            return items.size();
        }
    }

    @Test
    void findsNamesInBothListsInOrderOfA() {
        List<String> a = List.of("cy", "ana", "ben", "ana", "dee");
        List<String> b = List.of("dee", "ana", "eve");
        assertEquals(List.of("ana", "dee"), Overlap.inBoth(a, b));
    }

    @Test
    void readsListBInASinglePass() {
        OnePassList<String> b = new OnePassList<>(List.of("dee", "ana", "eve"));
        List<String> result = Overlap.inBoth(List.of("cy", "ana", "ben", "dee"), b);
        assertEquals(List.of("ana", "dee"), result);
        assertTrue(b.scans <= 1, "b was scanned " + b.scans + " times; build a HashSet from it once");
    }

    @Test
    void readsEachListOnceWhenEveryNameIsShared() {
        int n = 2_000;
        List<String> names = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            names.add("name" + i);
        }
        List<String> shuffled = new ArrayList<>(names);
        Collections.shuffle(shuffled, new Random(0));
        OnePassList<String> a = new OnePassList<>(names, true);
        OnePassList<String> b = new OnePassList<>(shuffled, true);
        List<String> result;
        try {
            result = Overlap.inBoth(a, b);
        } catch (AssertionError rescanned) {
            result = null;
        }
        assertTrue(a.scans <= 1 && b.scans <= 1,
                "a was scanned " + a.scans + " times and b " + b.scans + " times; read each list in one pass");
        assertEquals(names, result);
    }

    // The checks below read the compiled Overlap class with the JDK class-file API. They look at
    // which lookups the code uses, not at how long it runs, so the verdict never depends on the
    // speed of the machine.

    /** Lookups that scan a list or a whole collection from the start, element by element. */
    private static final Set<String> SCANNING_LOOKUPS = Set.of(
            "contains", "indexOf", "lastIndexOf", "containsAll", "frequency", "anyMatch", "noneMatch",
            "retainAll", "removeAll");

    /** Bulk calls that run contains on their argument once for every element they keep or drop. */
    private static final Set<String> BULK_FILTERS = Set.of("retainAll", "removeAll");

    /** Types whose lookups compare elements in a sorted structure: O(log n) per lookup. */
    private static final Set<String> ORDERED_TYPES = Set.of(
            "java/util/TreeSet", "java/util/TreeMap", "java/util/SortedSet", "java/util/SortedMap",
            "java/util/NavigableSet", "java/util/NavigableMap", "java/util/PriorityQueue",
            "java/util/concurrent/ConcurrentSkipListSet", "java/util/concurrent/ConcurrentSkipListMap");

    /** Sorting calls: O(k log k) on their own. */
    private static final Set<String> SORTING_CALLS = Set.of("sort", "sorted", "binarySearch");

    /** The hash-based types the task asks for: expected O(1) per add and contains. */
    private static final Set<String> HASH_TYPES = Set.of(
            "java/util/HashSet", "java/util/LinkedHashSet", "java/util/HashMap", "java/util/LinkedHashMap");

    private static ClassModel compiledOverlap() throws IOException {
        try (InputStream in = Overlap.class.getResourceAsStream("Overlap.class")) {
            if (in == null) {
                fail("Overlap.class was not found on the test class path");
            }
            return ClassFile.of().parse(in.readAllBytes());
        }
    }

    /** True for a lookup on a list or plain collection, which scans it; a Set or Map lookup hashes. */
    private static boolean scansAList(MemberRefEntry ref) {
        String owner = ref.owner().asInternalName();
        String name = ref.name().stringValue();
        if (!SCANNING_LOOKUPS.contains(name)) {
            return false;
        }
        return !(owner.endsWith("Set") || owner.endsWith("Map"));
    }

    /** Every [start, end] range of instructions that a backward jump repeats: one per loop. */
    private static List<int[]> loops(CodeModel code) {
        List<CodeElement> elements = code.elementList();
        Map<Label, Integer> where = new HashMap<>();
        for (int i = 0; i < elements.size(); i++) {
            if (elements.get(i) instanceof LabelTarget target) {
                where.put(target.label(), i);
            }
        }
        List<int[]> found = new ArrayList<>();
        for (int i = 0; i < elements.size(); i++) {
            if (elements.get(i) instanceof BranchInstruction branch) {
                Integer to = where.get(branch.target());
                if (to != null && to < i) {
                    found.add(new int[] {to, i});
                }
            }
        }
        return found;
    }

    /** Names of Overlap's own methods that contain a loop, so a loop hidden in a helper still counts. */
    private static Set<String> methodsWithLoops(ClassModel model) {
        Set<String> names = new TreeSet<>();
        for (MethodModel method : model.methods()) {
            method.code().ifPresent(code -> {
                if (!loops(code).isEmpty()) {
                    names.add(method.methodName().stringValue());
                }
            });
        }
        return names;
    }

    private static boolean nestsAScan(ClassModel model, MethodModel method, CodeModel code, Set<String> looping) {
        List<CodeElement> elements = code.elementList();
        List<int[]> ranges = loops(code);
        for (int[] outer : ranges) {
            for (int[] inner : ranges) {
                if (inner != outer && outer[0] <= inner[0] && inner[1] <= outer[1]) {
                    return true;
                }
            }
            for (int i = outer[0]; i <= outer[1]; i++) {
                if (elements.get(i) instanceof InvokeInstruction call
                        && call.owner().asInternalName().equals(model.thisClass().asInternalName())
                        && looping.contains(call.name().stringValue())
                        && !call.name().stringValue().equals(method.methodName().stringValue())) {
                    return true;
                }
            }
        }
        return false;
    }

    /** The instruction before index {@code at}, skipping labels and other non-instruction elements. */
    private static int previousInstruction(List<CodeElement> elements, int at) {
        for (int i = at - 1; i >= 0; i--) {
            if (elements.get(i) instanceof Instruction) {
                return i;
            }
        }
        return -1;
    }

    /**
     * The type of the value an instruction leaves on the stack, as far as this short scan can tell:
     * a constructor, a method's declared return type, a cast, or a local variable that was last
     * stored from one of those or holds a method parameter. Returns "unknown" otherwise.
     */
    private static String pushedType(MethodModel method, List<CodeElement> elements, int at) {
        if (at < 0) {
            return "unknown";
        }
        CodeElement element = elements.get(at);
        if (element instanceof InvokeInstruction call) {
            if (call.name().stringValue().equals("<init>")) {
                return call.owner().asInternalName();
            }
            return internalName(call.typeSymbol().returnType());
        }
        if (element instanceof TypeCheckInstruction cast) {
            return cast.type().asInternalName();
        }
        if (element instanceof LoadInstruction load) {
            for (int i = at - 1; i >= 0; i--) {
                if (elements.get(i) instanceof StoreInstruction store && store.slot() == load.slot()) {
                    return pushedType(method, elements, previousInstruction(elements, i));
                }
            }
            boolean isStatic = method.flags().has(AccessFlag.STATIC);
            int slot = isStatic ? 0 : 1;
            for (ClassDesc parameter : method.methodTypeSymbol().parameterList()) {
                if (slot == load.slot()) {
                    return internalName(parameter);
                }
                slot += parameter.equals(ConstantDescs.CD_long) || parameter.equals(ConstantDescs.CD_double) ? 2 : 1;
            }
        }
        return "unknown";
    }

    private static String internalName(ClassDesc type) {
        String descriptor = type.descriptorString();
        return descriptor.startsWith("L") ? descriptor.substring(1, descriptor.length() - 1) : descriptor;
    }

    /**
     * True when a set's retainAll or removeAll receives something other than a set or map. Those calls
     * run contains on their argument for every element, so a list argument hides an O(n * m) scan.
     */
    private static boolean filtersAgainstAList(MethodModel method, CodeModel code) {
        List<CodeElement> elements = code.elementList();
        for (int i = 0; i < elements.size(); i++) {
            if (elements.get(i) instanceof InvokeInstruction call
                    && BULK_FILTERS.contains(call.name().stringValue())) {
                String argument = pushedType(method, elements, previousInstruction(elements, i));
                if (!(argument.endsWith("Set") || argument.endsWith("Map"))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * The task promises an expected O(n + m) method: one pass over each list, with hash lookups.
     * This test rejects the three common ways to miss that promise, and names the one it found:
     * a lookup that scans a list (such as result.contains), a sorted set or map whose lookups cost
     * O(log n) (such as two TreeSets, which makes the method O((n + m) log(n + m))), and a loop
     * inside the loop over a.
     */
    @Test
    void usesHashLookupsWithNoScanInsideTheLoop() throws IOException {
        ClassModel model = compiledOverlap();
        Set<String> problems = new LinkedHashSet<>();
        boolean usesHash = false;
        for (PoolEntry entry : model.constantPool()) {
            if (entry instanceof ClassEntry type) {
                String name = type.asInternalName();
                if (HASH_TYPES.contains(name)) {
                    usesHash = true;
                }
                if (ORDERED_TYPES.contains(name)) {
                    problems.add("Overlap uses " + name.substring(name.lastIndexOf('/') + 1)
                            + ": each lookup costs O(log n), so the method is O((n + m) log(n + m)), not O(n + m);"
                            + " use a HashSet");
                }
            }
            if (entry instanceof MemberRefEntry ref) {
                String name = ref.name().stringValue();
                String owner = ref.owner().asInternalName();
                if (scansAList(ref)) {
                    problems.add("Overlap calls " + owner.substring(owner.lastIndexOf('/') + 1) + "." + name
                            + (BULK_FILTERS.contains(name)
                                    ? ", which calls contains for every element of the list: a hidden O(n * m) scan;"
                                            + " loop over a once and look names up in a HashSet built from b"
                                    : ", which scans a list element by element; check \"seen before?\" in a HashSet instead"));
                }
                if (SORTING_CALLS.contains(name)) {
                    problems.add("Overlap sorts (" + name + "), which costs O(k log k); use a HashSet instead");
                }
            }
        }
        Set<String> looping = methodsWithLoops(model);
        for (MethodModel method : model.methods()) {
            method.code().ifPresent(code -> {
                if (nestsAScan(model, method, code, looping)) {
                    problems.add("Overlap runs a loop inside another loop, which is O(n * m) or O(n^2);"
                            + " loop over each list once and use HashSet lookups inside the loop");
                }
                if (filtersAgainstAList(method, code)) {
                    problems.add("Overlap passes a list to retainAll or removeAll, which calls contains on that"
                            + " list for every element: a hidden O(n * m) scan; look names up in a HashSet built from b");
                }
            });
        }
        if (!usesHash) {
            problems.add("Overlap builds no HashSet (or LinkedHashSet); the task asks for one built from b"
                    + " and one for the names already added");
        }
        assertTrue(problems.isEmpty(), String.join(" | ", problems));
    }
}
