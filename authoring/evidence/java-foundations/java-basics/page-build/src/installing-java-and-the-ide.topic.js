var TOPIC={
steps:5,acts:['predict','tools','ide','apply'],
prompt:function(S){return 'ana@pep:~$';},
init:function(){return {path:['/usr/lib/jvm/java-17/bin','/opt/jdk-25/bin','/usr/bin','/bin'],jhome:null,g:{},look:null,ide:{}};},
predict:{correct:'a',why:{
 a:'the shell runs the first java it finds in PATH order, and it cannot find mvn until Maven\'s bin folder is on PATH.',
 b:'a runtime-only download would lack javac, but it could not explain mvn being missing or java reporting 17.',
 c:'Maven is a command-line tool; the shell must find mvn on PATH, the same as any other command.',
 d:'JAVA_HOME tells Maven which Java to use, but the shell still needs mvn on PATH to start it.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>The <code>java</code> Raj runs comes from a folder without <code>javac</code>. Install the full JDK 25 and put its <code>bin</code> folder first on <code>PATH</code>.</p>',
  why:{a:'a folder with java but no javac, for example a runtime-only package, cannot compile. Install the full JDK 25 and put its bin folder first.',b:'java runs programs; javac is still the separate compiler in the JDK.',c:'Maven is a different tool; it does not provide javac.',d:'javac is a command-line tool in the JDK; IDEs use the JDK too.'},
  miss:{b:'<code>java</code> runs programs. The compiler is still the separate <code>javac</code> command in the JDK.',c:'Maven is a separate tool. It uses the JDK; it does not contain <code>javac</code>.',d:'<code>javac</code> is a JDK command-line tool. An IDE uses the same JDK.'},
  hint:'Ask what is inside the folder the shell found java in.'},
 B:{fs:'apply-b',correct:'b',reveal:'The JDK\'s bin folder holds java, javac and jshell; put it on PATH to compile.',
  why:{a:'it can run programs but not compile them.',b:'a JDK bin folder: it has the compiler javac as well as java.',c:'Maven\'s bin folder starts Maven; it has no compiler.',d:'a project folder holds code, not tools.'}}},
LOC:{'/usr/lib/jvm/java-17/bin':['java','javac','jshell'],'/opt/jdk-25/bin':['java','javac','jshell'],'/usr/bin':['bash','ls','echo','which'],'/bin':['bash','ls'],'/home/ana/tools/apache-maven-3.10.0/bin':['mvn']},
VER:{'/usr/lib/jvm/java-17/bin':'17','/opt/jdk-25/bin':'25'},
find:function(t,cmd){for(var i=0;i<t.path.length;i++){var l=this.LOC[t.path[i]];if(l&&l.indexOf(cmd)>=0){return t.path[i];}}return null;},
run:function(line,term,S,api){
 var t=S.t,out=[],msg='',me=this,HOME='/home/ana';function o(c,s){out.push([c,s]);}
 function expand(v,where){var bad=null;var r=v.replace(/\$\{?([A-Za-z_]+)\}?/g,function(m,n){if(n==='PATH'){return t.path.join(':');}if(n==='HOME'){return HOME;}if(n==='JAVA_HOME'){return t.jhome||'';}bad=n;return '';});
  if(bad){return {err:'$'+bad+' is not available in this practice terminal (only $PATH, $HOME and $JAVA_HOME are).'};}return {v:r.replace(/^~(?=\/|$)/,HOME)};}
 o('c',line);var s=line.trim(),m;
 if(!s){o('h','(nothing to run)');}
 else if(/[;|&<>`]/.test(s)){o('e','Operators such as ; | & and redirection are not available in this practice terminal.');}
 else if((m=s.match(/^export\s+(PATH|JAVA_HOME)=(.*)$/))){var raw=m[2].trim();
  if(/^"[^"]*"$/.test(raw)||/^'[^']*'$/.test(raw)){raw=raw.charAt(0)==="'"?raw.slice(1,-1).replace(/\$/g,'\u0000'):raw.slice(1,-1);}
  else if(/\s/.test(raw)){o('e','Spaces split the value here; quote it, for example export PATH="/opt/jdk-25/bin:$PATH".');raw=null;}
  if(raw!==null){if(raw.indexOf('\u0000')>=0){o('e','Single quotes keep $PATH as literal text, so the old folders would be lost. Use double quotes so $PATH expands.');}
   else{var ex=expand(raw);if(ex.err){o('e',ex.err);}
    else if(m[1]==='PATH'){var parts=ex.v.split(':').filter(function(x){return x;}).map(function(x){return x.replace(/\/+$/,'');});
     if(parts.indexOf('/usr/bin')<0){o('e','That PATH would drop /usr/bin and /bin, the folders that hold ls and echo. Include $PATH to keep the old folders.');}
     else{t.path=parts;msg='PATH updated for this terminal session. The model shows the new order.';
      var unknown=parts.filter(function(x){return !me.LOC[x];});if(unknown.length){o('h','Note: '+unknown.join(', ')+' does not exist on this machine, so it adds nothing.');}}}
    else{t.jhome=ex.v.replace(/\/+$/,'');msg='JAVA_HOME set. Maven uses the Java in $JAVA_HOME/bin.';if(['/opt/jdk-25','/usr/lib/jvm/java-17'].indexOf(t.jhome)<0){o('h','Note: '+t.jhome+' is not a JDK folder on this machine.');}}}}}
 else if((m=s.match(/^export\s+(\S+)/))){o('e','Only PATH and JAVA_HOME can be set in this practice terminal.');}
 else if((m=s.match(/^echo\s+(.+)$/))){var e2=expand(m[1].replace(/^"|"$/g,''));if(e2.err){o('e',e2.err);}else{o('o',e2.v);}}
 else if((m=s.match(/^which\s+(\S+)$/))){var w=me.find(t,m[1]);t.look={cmd:m[1],dir:w};if(w){o('o',w+'/'+m[1]);}else{o('h','(which prints nothing: '+m[1]+' is not in any PATH folder)');}}
 else if(/^(java|javac|mvn|jshell)(\s|$)/.test(s)){var cmd=s.split(/\s+/)[0],arg=s.slice(cmd.length).trim(),dir=me.find(t,cmd);t.look={cmd:cmd,dir:dir};
  if(!dir){o('e','bash: '+cmd+': command not found');msg=cmd==='mvn'?'No PATH folder holds mvn. Add Maven\'s bin folder to PATH.':'No PATH folder holds '+cmd+'.';}
  else if(cmd==='java'&&arg==='-version'){var v=me.VER[dir];
   if(v==='25'){o('o','openjdk version "25.0.4.1" 2026-08-18 LTS\nOpenJDK Runtime Environment Temurin-25.0.4.1+1 (build 25.0.4.1+1-LTS)\nOpenJDK 64-Bit Server VM Temurin-25.0.4.1+1 (build 25.0.4.1+1-LTS, mixed mode, sharing)');t.g.java=1;msg='Java 25 runs: '+dir+' is the first PATH folder that holds java.';}
   else{o('o','openjdk version "17.0.12" 2024-07-16 LTS\nOpenJDK Runtime Environment Corretto-17.0.12.7.1 (build 17.0.12+7-LTS)\nOpenJDK 64-Bit Server VM Corretto-17.0.12.7.1 (build 17.0.12+7-LTS, mixed mode, sharing)');msg='That is Java 17: '+dir+' comes before /opt/jdk-25/bin in PATH.';}}
  else if(cmd==='javac'&&arg==='-version'){var v2=me.VER[dir];o('o','javac '+(v2==='25'?'25.0.4.1':'17.0.12'));if(v2==='25'){t.g.javac=1;msg='The JDK 25 compiler is found first.';}else{msg='That is the JDK 17 compiler. The JDK 25 bin folder must come first.';}}
  else if(cmd==='mvn'&&(arg==='-v'||arg==='--version'||arg==='-version')){var jdir=t.jhome?t.jhome+'/bin':me.find(t,'java'),jv=me.VER[jdir];
   if(!jv){o('e','The JAVA_HOME environment variable is not defined correctly,\nthis environment variable is needed to run this program.');msg='JAVA_HOME points to a folder without Java. Fix it or unset it.';}
   else{o('o','Apache Maven 3.10.0 (c43a36b8d67be7e0805a411bc0898af1a51f5472)\nMaven home: /home/ana/tools/apache-maven-3.10.0\nJava version: '+(jv==='25'?'25.0.4.1, vendor: Eclipse Adoptium, runtime: /opt/jdk-25':'17.0.12, vendor: Amazon.com Inc., runtime: /usr/lib/jvm/java-17')+'\nDefault locale: en_US, platform encoding: UTF-8, time zone: Etc/UTC\nOS name: "linux", version: "6.8.0", arch: "amd64", family: "unix"');
    if(jv==='25'){t.g.mvn=1;msg='Maven runs, using Java 25.';}else{msg='Maven runs, but with Java 17: it uses '+(t.jhome?'JAVA_HOME':'the first java on PATH')+'.';}}}
  else{o('e','Only java -version, javac -version and mvn -v are available for '+cmd+' in this practice terminal.');}}
 else if(/^ls(\s|$)/.test(s)){var d=s.slice(2).trim().replace(/^~(?=\/|$)/,HOME).replace(/\/+$/,'');
  if(!d){o('o','tools');}else if(me.LOC[d]){o('o',me.LOC[d].join('  '));}else if(d==='/home/ana/tools'){o('o','apache-maven-3.10.0');}else if(d==='/opt'){o('o','jdk-25');}else{o('e','ls: that folder is not available in this practice terminal.');}}
 else{o('e',s.split(/\s+/)[0]+': not available in this practice terminal');msg='Here you can use which, echo, export, ls, java, javac and mvn.';}
 var log=api.$('log-'+term);out.forEach(function(x){var dv=document.createElement('div');dv.className=x[0];dv.textContent=x[1];log.appendChild(dv);});log.scrollTop=log.scrollHeight;
 var need=['java','javac','mvn'],left=need.filter(function(k){return !t.g[k];}).length;
 api.say('<p>'+api.esc(msg||(out.length&&out[out.length-1][0]==='e'?'That did not run, so nothing changed.':'Command run.'))+'</p><p>'+(left?left+' of 3 checks still open.':'<strong>All checks pass.</strong> Continue when ready.')+'</p>');
 if(!left&&!S.done.tools){api.complete('tools');}
 this.render(S,api);},
act:function(a,b,S,api){if(a!=='ide-apply'||S.done.ide){return;}var ch=function(n){var r=api.qa('input[name="'+n+'"]:checked')[0];return r?r.value:'';},op=ch('ide-open'),sdk=ch('ide-sdk'),p=[];
 var om={'':'Choose how to open the project.',src:'Opening only src skips pom.xml, so the IDE does not import it as a Maven project.',file:'Opening one .java file does not import the Maven project or its settings.'};
 var sm={'':'Choose a project SDK.',none:'With no SDK, the IDE cannot compile or check the code.',j17:'JDK 17 is older than the Java 25 the project needs.'};
 if(op!=='pom'){p.push(om[op]);}if(sdk!=="j25"){p.push(sm[sdk]);}
 if(p.length){api.say('<p class="verdict no">Not yet.</p><ul>'+p.map(function(x){return '<li>'+api.esc(x)+'</li>';}).join('')+'</ul><p>Change the setting and press Apply again.</p>');return;}
 api.qa('#ide-fs input').forEach(function(i){i.disabled=true;});api.$('ide-apply').disabled=true;
 api.say('<p class="verdict ok">Project set up.</p><p>The IDE imports the project from <code>pom.xml</code> and compiles it with JDK 25 from <code>/opt/jdk-25</code>. Its JDK list is separate from your terminal\'s PATH.</p>');api.complete('ide');},
render:function(S,api){var t=S.t,l=api.$('pathlist');while(l.firstChild){l.removeChild(l.firstChild);}
 var me=this;t.path.forEach(function(p){var li=document.createElement('li');var a=document.createElement('span');a.textContent=p;var h=document.createElement('span');h.className='has';h.textContent=(me.LOC[p]||[]).filter(function(c){return /^(java|javac|jshell|mvn)$/.test(c);}).join(', ')||'other tools';
  li.appendChild(a);li.appendChild(h);if(t.look&&t.look.dir===p){li.className='hit';h.textContent+=' (used for '+t.look.cmd+')';}l.appendChild(li);});
 api.$('lookup').textContent=t.look?(t.look.dir?t.look.cmd+' found in '+t.look.dir:t.look.cmd+': not in any PATH folder'):'None yet.';
 api.$('jhome').textContent=t.jhome||'(not set)';
 var g=t.g;api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!g[k]);li.querySelector('.st').textContent=g[k]?'done':'open';});}
};
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"tools":["path","jhome","look"]};
