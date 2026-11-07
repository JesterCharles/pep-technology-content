#!/usr/bin/env node
// Differential check of jmini.js against a real JDK (javac and java on PATH). Run from the repository root:
//   node authoring/evidence/java-foundations/arrays-lists-and-maps/page-build/jmini-differential.mjs
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import {execFileSync} from 'node:child_process';
const here=path.dirname(new URL(import.meta.url).pathname); const dir=fs.mkdtempSync(path.join(os.tmpdir(),'jmini-'));
const javacVersion=execFileSync('javac',['-version'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
if(!/^javac 25(?:\.|$)/.test(javacVersion)) throw new Error(`JDK 25 is required for this differential; found ${javacVersion}`);
console.log(`differential ${javacVersion}`);
const src=fs.readFileSync(path.join(here,'jmini.js'),'utf8'); const J=new Function(src+';return JMINI;')();
const cases=[
{name:'hashmap-order-non-target',code:`Map<String, Integer> m = new HashMap<>();
m.put("red", 7); m.put("blue", 4); m.put("green", 9); m.put("apple", 2); m.put("kiwi", 6); m.put("pear", 3); m.put("fig", 8); m.put("banana", 1); m.put("cherry", 5); m.put("date", 0); m.put("lime", 11); m.put("plum", 10); m.put("grape", 12);
System.out.println(m);
for (String k : m.keySet()) { System.out.print(k + ";"); }
System.out.println();`},
{name:'list-remove-overloads',code:`List<Integer> nums = new ArrayList<>();
nums.add(10); nums.add(20); nums.add(30);
nums.remove(1);
System.out.println(nums);
Integer x = 30; nums.remove(x); System.out.println(nums + " " + nums.size());`},
{name:'array-reversal-and-defaults',code:`int[] a = {1, 2, 3, 4, 5};
int left = 0; int right = a.length - 1;
while (left < right) { int t = a[left]; a[left] = a[right]; a[right] = t; left++; right--; }
System.out.println(Arrays.toString(a));
int[] s = new int[3]; s[1] = 7; System.out.println(s[0] + " " + s[1]);`},
{name:'map-replacement-and-missing',code:`Map<String, Integer> stock = new HashMap<>();
stock.put("apple", 3); stock.put("apple", 5);
System.out.println(stock.get("apple") + " " + stock.get("pear"));
System.out.println(stock.containsKey("pear") + " " + stock.getOrDefault("pear", 0));`},
{name:'map-get-value-static-type',code:`Map<Integer, Integer> stock = new HashMap<>(); stock.put(1, 200);
System.out.println(stock.get(1).equals(200) + " " + (stock.get(1) == 200));
List<Integer> values = new ArrayList<>(); values.add(100); values.add(200);
boolean removed = values.remove(stock.get(1)); System.out.println(removed + " " + values);`},
{name:'array-bounds',code:`int[] t = {12, 15, 9};
System.out.println(t[3]);`},
{name:'null-unboxing',code:`Map<String, Integer> c = new HashMap<>();
int n = c.get("zebra");`},
{name:'list-bounds',code:`List<String> q = new ArrayList<>();
q.add("Ada"); q.add("Ben");
System.out.println(q.get(2));`},
{name:'foreach-remove-first',code:`List<Integer> l = new ArrayList<>(); l.add(1); l.add(2); l.add(3);
for (Integer v : l) { if (v == 1) { l.remove(v); } }`},
{name:'foreach-remove-middle',code:`List<Integer> l = new ArrayList<>(); l.add(1); l.add(2); l.add(3);
for (Integer v : l) { if (v == 2) { l.remove(v); } }
System.out.println(l);`},
{name:'integer-arithmetic',code:`int total = 0; int[] v = {3, -4, 7};
for (int i = 0; i < v.length; i++) total += v[i] * 2;
System.out.println(total / 4 + " " + total % 4 + " " + (-7 / 2) + " " + (-7 % 2) + " " + (2147483647 + 1));`},
{name:'simple-assignment-index-order',code:`int[] a = {10, 20}; int i = 0; a[i++] = i;
System.out.println(Arrays.toString(a) + " " + i);`},
{name:'compound-assignment-index-order',code:`int[] a = {10, 20}; int i = 0; a[i++] += i;
System.out.println(Arrays.toString(a) + " " + i);`},
{name:'simple-assignment-both-index-orders',code:`int[] a = {10, 20}; int i = 0; a[i++] = i++;
System.out.println(Arrays.toString(a) + " " + i);`},
{name:'compound-assignment-both-index-orders',code:`int[] a = {10, 20}; int i = 0; a[i++] += i++;
System.out.println(Arrays.toString(a) + " " + i);`},
{name:'simple-assignment-null-precedence',code:`int[] a = null; a[0] = 1 / 0;`},
{name:'simple-assignment-bounds-precedence',code:`int[] a = {1}; a[4] = 1 / 0;`},
{name:'compound-assignment-null-precedence',code:`int[] a = null; a[0] += 1 / 0;`},
{name:'compound-assignment-bounds-precedence',code:`int[] a = {1}; a[4] += 1 / 0;`},
{name:'wrapper-methods',code:`Integer x = 7; Boolean yes = true;
System.out.println(x.intValue() + " " + x.equals(7) + " " + x.compareTo(9) + " " + x.toString());
System.out.println(yes.booleanValue() + " " + yes.equals(true) + " " + yes.compareTo(false) + " " + yes.toString());`},
{name:'explicit-generic-and-min-int',code:`List<Integer> values = new ArrayList<Integer>(); values.add(-2147483648);
System.out.println(values);`},
// Named non-goal controls for bounded interpreter fidelity; none is a learner-task completion.
{name:'non-goal-bare-newcoll-statement',code:`new ArrayList<Integer>();
System.out.println("ok");`},
{name:'non-goal-bare-newarr-statement-rejected',expect:'compile-error',code:`new int[2];`},
{name:'non-goal-boolean-compareto-null',code:`Boolean yes = true; Boolean missing = null;
System.out.println(yes.compareTo(missing));`},
{name:'non-goal-list-remove-boxed-object-boolean',code:`List<Integer> values = new ArrayList<>(); values.add(4); Integer item = 4;
boolean removed = values.remove(item); System.out.println(removed + " " + values);`},
{name:'non-goal-list-remove-literal-index-element',code:`List<Integer> values = new ArrayList<>(); values.add(4);
Integer removed = values.remove(0); System.out.println(removed + " " + values);`},
{name:'non-goal-list-remove-computed-size-index-element',code:`List<Integer> values = new ArrayList<>(); values.add(4); values.add(7);
Integer removed = values.remove(values.size() - 1); System.out.println(removed + " " + values);`},
{name:'non-goal-list-remove-computed-variable-index-element',code:`List<Integer> values = new ArrayList<>(); values.add(4); values.add(7); int i = 0;
Integer removed = values.remove(i + 1); System.out.println(removed + " " + values);`},
{name:'non-goal-list-remove-computed-indexof-element',code:`List<Integer> values = new ArrayList<>(); values.add(4); values.add(7);
Integer removed = values.remove(values.indexOf(7)); System.out.println(removed + " " + values);`},
{name:'non-goal-int-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<int[]> values = new ArrayList<>();`},
{name:'non-goal-boolean-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<boolean[]> values = new ArrayList<>();`},
{name:'non-goal-double-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<double[]> values = new ArrayList<>();`},
{name:'non-goal-long-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<long[]> values = new ArrayList<>();`},
{name:'non-goal-char-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<char[]> values = new ArrayList<>();`},
{name:'non-goal-float-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<float[]> values = new ArrayList<>();`},
{name:'non-goal-short-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<short[]> values = new ArrayList<>();`},
{name:'non-goal-byte-array-reference-type-argument-unsupported',expect:'unsupported',code:`List<byte[]> values = new ArrayList<>();`},
{name:'non-goal-explicit-primitive-array-constructor-unsupported',expect:'unsupported',code:`List<double[]> values = new ArrayList<double[]>();`},
{name:'non-goal-primitive-null-equality',expect:'model-limit',code:`int value = 1;
System.out.println(value == null);`},
{name:'non-goal-computed-int-null-equality',expect:'model-limit',code:`List<Integer> values = new ArrayList<>();
System.out.println(values.size() != null);`},
{name:'non-goal-boxed-null-equality-control',code:`Integer value = 1;
System.out.println(value == null);`},
];
const pre='import java.util.*;\npublic class T { public static void main(String[] args) {\n';
let fails=0;
cases.forEach((entry,i)=>{
  fs.writeFileSync(path.join(dir,'T.java'),pre+entry.code+'\n}}\n');
  let real,realCompileError=false;
  try{execFileSync('javac',[path.join(dir,'T.java')],{stdio:'pipe'});
    try{real=execFileSync('java',['-cp',dir,'T'],{stdio:'pipe'}).toString();}catch(e){real=e.stdout.toString()+'EXC '+(/Exception in thread "main" ([\w.]+)/.exec(e.stderr.toString())||[])[1];}
  }catch(e){realCompileError=true;real='COMPILE';}
  const p=J.parse(entry.code,'statements'); let mine,mineCompileError=false;
  if(p.problems.length){mineCompileError=p.problems.some((problem)=>problem.kind==='error');mine='PROBLEM';}
  else { const r=J.run(p.prog,null); mine=J.printed(r.out)+(r.status==='exception'?'EXC java.'+(/Concurrent/.test(r.err.type)?'util.':'lang.')+r.err.type:r.status==='stopped'?'STOP '+r.err.msg:''); }
  const ok=entry.expect==='compile-error' ? realCompileError&&mineCompileError
    : entry.expect==='unsupported' ? !realCompileError&&p.problems.length===1&&p.problems[0].kind!=='error'&&/Not supported in this practice editor/.test(p.problems[0].msg)
    : entry.expect==='model-limit' ? realCompileError&&!p.problems.length&&/^STOP Java would reject this at compile time:/.test(mine)
    : !realCompileError&&!p.problems.length&&real.trim()===mine.trim();
  if(!ok)fails++;
  console.log(`#${i} ${entry.name} ${ok?'OK':'DIFF'}\n real: ${JSON.stringify(real)}\n mine: ${JSON.stringify(mine)}`);
});
console.log('fails',fails); fs.rmSync(dir,{recursive:true,force:true}); if(fails) process.exitCode=1;
