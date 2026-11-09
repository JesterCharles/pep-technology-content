var TOPIC={
steps:5,acts:['predict','run','fix','apply'],
prompt:function(S){return 'ana@pep:~/first$';},
init:function(){return {files:['Greet.java','Hello.java'],g:{},used:{}};},
predict:{correct:'a',why:{
 a:'javac writes the bytecode file Hello.class next to the source and prints nothing when it succeeds.',
 b:'javac only compiles; it never runs the program. Running is a separate java step.',
 c:'javac writes portable bytecode (.class) for the Java virtual machine, not a native .exe.',
 d:'javac writes .class files; packaging classes into a .jar is a separate step.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>File Score.java, line 4: <code>cannot find symbol</code> names the variable <code>scor</code>, which was never declared.</p>',
  why:{a:'the location is Score.java line 4, and the symbol line names variable scor, which was never declared.',b:'the message names line 4, and it reports a missing symbol, not a missing ;.',c:'the message is about the variable scor, not the class name.',d:'this is a compiler error: no .class file is produced, so nothing ran.'},
  miss:{b:'The message names line 4 and says <code>cannot find symbol</code>, not a missing <code>;</code>.',c:'The symbol line names <code>variable scor</code>; the class name is fine.',d:'This comes from <code>javac</code>, before anything runs.'},
  hint:'Read the first line in order: file, then line, then message.'},
 B:{fs:'apply-b',correct:'a',reveal:'In Score.java:4, Score.java is the file and 4 is the line.',
  why:{a:'file:line is the format the compiler uses for every error.',b:'the error count is printed at the end, as 1 error.',c:'the caret shows the position; the number after the colon is the line.',d:'compiler errors come before running; nothing crashed.'}}},
SRC:{'Hello.java':'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}','Greet.java':'public class Greet {\n    public static void main(String[] args) {\n        System.out.println("Hi, Ana")\n    }\n}'},
GREETERR:'Greet.java:3: error: \';\' expected\n        System.out.println("Hi, Ana")\n                                     ^\n1 error',
run:function(line,term,S,api){
 var t=S.t,out=[],msg='',me=this;function o(c,s){out.push([c,s]);}
 function has(f){return t.files.indexOf(f)>=0;}
 o('c',line);var w=line.trim().split(/\s+/),cmd=w[0],a=w.slice(1);
 if(!line.trim()){o('h','(nothing to run)');}
 else if(/[;|&<>`$]/.test(line)){o('e','Operators and variables are not available in this practice terminal.');}
 else if(cmd==='ls'){if(a.length){o('e','ls: options and paths are not available in this practice terminal.');}else{o('o',t.files.slice().sort().join('  '));}}
 else if(cmd==='cat'){if(a.length!==1){o('e','cat: give one file name.');}else if(me.SRC[a[0]]){o('o',me.SRC[a[0]]);}else if(has(a[0])){o('h','Hello.class is bytecode for the JVM, not text; cat would print unreadable bytes.');}else{o('e','cat: '+a[0]+': No such file or directory');}}
 else if(cmd==='javac'){
  if(a.length!==1){o('e','javac: give exactly one source file in this practice terminal.');}
  else if(!/\.java$/.test(a[0])){o('e','error: Class names, \''+a[0]+'\', are only accepted if annotation processing is explicitly requested\n1 error');msg='javac needs the file name, with .java.';}
  else if(!me.SRC[a[0]]){o('e','error: file not found: '+a[0]+'\nUsage: javac <options> <source files>\nuse --help for a list of possible options');}
  else if(a[0]==='Greet.java'){o('e',me.GREETERR);msg='Greet.java has a compile error; you will fix it in the next step.';}
  else{if(!has('Hello.class')){t.files.push('Hello.class');}t.g.javac=1;t.used.cls=1;msg='No output means success. ls now shows Hello.class.';}}
 else if(cmd==='java'){
  if(a.length!==1){o('e','java: give one class or source file in this practice terminal.');}
  else if(a[0]==='Hello'){if(has('Hello.class')){o('o','Hello, Java!');t.g.java=1;t.used.outA=1;msg='java Hello ran the compiled class.';}else{o('e','Error: Could not find or load main class Hello\nCaused by: java.lang.ClassNotFoundException: Hello');msg='There is no Hello.class yet. Compile first.';}}
  else if(a[0]==='Hello.java'){o('o','Hello, Java!');t.g.src=1;t.used.outB=1;msg='Source-file mode: compiled in memory and ran. No new file appears.';}
  else if(a[0]==='Greet.java'){o('e',me.GREETERR+'\nerror: compilation failed');msg='Source-file mode still compiles first, so the same error stops it.';}
  else{o('e','Error: Could not find or load main class '+a[0]+'\nCaused by: java.lang.ClassNotFoundException: '+a[0]);msg=/\.class$/.test(a[0])?'java takes the class name, without .class.':(/^[a-z]/.test(a[0])?'Class names are case-sensitive: Hello, not hello.':'No class by that name here.');}}
 else{o('e',cmd+': not available in this practice terminal');msg='Here you can use ls, cat, javac and java.';}
 var log=api.$('log-'+term);out.forEach(function(x){var dv=document.createElement('div');dv.className=x[0];dv.textContent=x[1];log.appendChild(dv);});log.scrollTop=log.scrollHeight;
 var need=['javac','java','src'],left=need.filter(function(k){return !t.g[k];}).length;
 api.say('<p>'+api.esc(msg||(out[out.length-1][0]==='e'?'That did not work, so nothing changed.':'Command run.'))+'</p><p>'+(left?left+' of 3 goals still open.':'<strong>All goals met.</strong> Continue when ready.')+'</p>');
 if(!left&&!S.done.run){api.complete('run');}
 this.render(S,api);},
act:function(a,b,S,api){if(a!=='fix-apply'||S.done.fix){return;}
 var ch=function(n){var r=api.qa('input[name="'+n+'"]:checked')[0];return r?r.value:'';},ln=ch('fix-line'),ca=ch('fix-cause'),p=[];
 var lm={'':'Choose a line.',l2:'Line 2 opens main and is complete. The error names line 3.',l4:'Line 4 only closes main. The error names line 3.'};
 var cm={'':'Choose a fix.',quote:'Single quotes are for one char; "Hi, Ana" is a String, and the message says \';\' expected.',lower:'The class name matches the file Greet.java; the message is about a missing ;.'};
 if(ln!=='l3'){p.push(lm[ln]);}if(ca!=='semi'){p.push(cm[ca]);}
 if(p.length){api.say('<p class="verdict no">Not yet: the code still does not compile.</p><ul>'+p.map(function(x){return '<li>'+api.esc(x)+'</li>';}).join('')+'</ul><p>Read the first line of the error again, then change your choice.</p>');return;}
 api.$('semi').textContent=';';api.$('semi').className='fixed';api.$('greet-out').textContent='$ javac Greet.java\n$ java Greet\nHi, Ana';
 api.qa('#fix-fs input').forEach(function(i){i.disabled=true;});api.$('fix-apply').disabled=true;
 api.say('<p class="verdict ok">Fixed: it compiles and runs.</p><p>Greet.java, line 3, <code>\';\' expected</code>: the statement needed a semicolon at its end, where the caret pointed.</p>');api.complete('fix');},
render:function(S,api){var t=S.t,u=t.used,st=S.step;
 api.qa('.flow li[data-k]').forEach(function(li){var k=li.getAttribute('data-k'),on=false;
  if(st===2){on=(k==='src'&&u.cls)||(k==='cls'&&u.cls)||(k==='out-a'&&u.outA)||(k==='src2'&&u.outB)||(k==='out-b'&&u.outB);}li.classList.toggle('on',on);});
 api.$('files').textContent=t.files.slice().sort().join('  ');
 api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!t.g[k]);li.querySelector('.st').textContent=t.g[k]?'done':'open';});}
};
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"run":["files","used"]};
