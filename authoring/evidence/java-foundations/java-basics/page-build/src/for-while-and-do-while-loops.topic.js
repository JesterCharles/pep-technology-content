var TOPIC=(function(){
function sim(p){var s={s0:0,s1:1,s2:2}[p.start],e={e5:5,e6:6,e10:10}[p.end],inc=p.up==='u2'?2:1,op=p.op==='le'?'<=':'<',tr=[],out=[],i=s,n=0;
 while(n<12){var ok=op==='<='?i<=e:i<e;if(!ok){tr.push({t:'i = '+i+': '+i+' '+op+' '+e+' is false, so the loop stops',stop:true});break;}tr.push({t:'i = '+i+': '+i+' '+op+' '+e+' is true, print '+i});out.push(i);i+=inc;n++;}
 return {tr:tr,out:out,line:'for (int i = '+s+'; i '+op+' '+e+'; i '+(inc===2?'+= 2':'++')+')'};}
function jump(a,b){var tr=[],out=[];for(var i=1;i<=5;i++){if(i===3&&a==='continue'){tr.push({t:'i = 3: continue, skip the print'});continue;}if(i===3&&a==='break'){tr.push({t:'i = 3: break, leave the loop',stop:true});break;}
 if(i===5&&b==='continue'){tr.push({t:'i = 5: continue, skip the print'});continue;}if(i===5&&b==='break'){tr.push({t:'i = 5: break, leave the loop',stop:true});break;}tr.push({t:'i = '+i+': print '+i});out.push(i);}
 if(i>5){tr.push({t:'i = 6: 6 <= 5 is false, so the loop stops',stop:true});}return {tr:tr,out:out};}
return {
steps:5,acts:['predict','build','jump','apply'],
init:function(){return {g:{},p:{},j:{}};},
predict:{correct:'a',why:{
 a:'i takes 0, 1 and 2; when i reaches 3, i < 3 is false and the loop stops.',
 b:'the loop starts at i = 0, not 1.',
 c:'the condition i < 3 is false for 3, so 3 is never printed.',
 d:'0 < 3 is true, so the body runs on the first check.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>do-while runs the body, the prompt, before it checks the condition, so the PIN is asked for at least once and again until it is right.</p>',
  why:{a:'it asks first and checks after, so the prompt appears at least once.',b:'while checks before the first prompt, before any PIN exists to test.',c:'the number of tries is not known in advance, and three may be too few or too many.',d:'a wrong PIN must be asked for again, so it needs a loop.'},
  miss:{b:'<code>while</code> checks its condition before the first pass, before any PIN has been entered.',c:'A counted <code>for</code> fixes the number of tries in advance; here it is unknown.',d:'A wrong PIN must be asked for again, so it needs a loop.'},
  hint:'Must the body run once before the condition can be tested?'},
 B:{fs:'apply-b',correct:'b',reveal:'while checks first, so it reads nothing from an empty file.',
  why:{a:'do-while would try to read a line even from an empty file.',b:'while checks before each pass and can run zero times.',c:'the number of lines is not known in advance.',d:'a file can have many lines, so it needs a loop.'}}},
change:function(el,S,api){var t=S.t,n=el.name;if(!n){return;}
 if(/^lp-/.test(n)&&!S.done.build){t.p[n.slice(3)]=el.value;var p=t.p;if(!(p.start&&p.op&&p.end&&p.up)){api.say('<p>Choose all four parts to run the loop.</p>');this.render(S,api);return;}
  var r=sim(p),o=r.out.join(' '),msg='It prints '+(o||'nothing')+'.';
  if(o==='1 2 3 4 5'){t.g.five=1;msg+=' That is the first target.';}else if(o==='2 4 6 8 10'){t.g.even=1;msg+=' That is the second target.';}
  else if(o==='1 2 3 4'||o==='2 4 6 8'){msg+=' Off by one at the end: the last value is excluded. Check the condition.';}
  else if(o==='0 1 2 3 4 5'||o==='0 2 4 6 8 10'){msg+=' Off by one at the start: it begins at 0.';}
  var left=['five','even'].filter(function(k){return !t.g[k];}).length;
  api.say('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 2 targets still open.':'<strong>Both targets met.</strong> Continue when ready.')+'</p>');
  if(!left){api.qa('#build-fs input').forEach(function(i){i.disabled=true;});api.complete('build');}this.render(S,api);}
 if(/^j[AB]$/.test(n)&&!S.done.jump){t.j[n]=el.value;if(!(t.j.jA&&t.j.jB)){api.say('<p>Fill both blanks.</p>');this.render(S,api);return;}
  var q=jump(t.j.jA,t.j.jB),o2=q.out.join(' ');
  if(o2==='1 2 4'){api.say('<p class="verdict ok">It prints 1 2 4.</p><p>'+(t.j.jB==='break'?'continue skipped printing 3; break left the loop at 5 before printing it.':'continue skipped printing 3, and continue also skipped 5, the last pass. break there would leave the loop instead; both give 1 2 4 here.')+'</p>');api.qa('#jump-fs input').forEach(function(i){i.disabled=true;});api.complete('jump');}
  else{var hint=t.j.jA==='break'?'break at 3 leaves the loop, so 4 never prints. Which keyword skips only one pass?':t.j.jA!=='continue'?'3 still prints. Which keyword skips one pass?':'5 still prints. Which keyword leaves the loop?';
   api.say('<p class="verdict no">It prints '+api.esc(o2||'nothing')+', not 1 2 4.</p><p>'+api.esc(hint)+'</p>');}
  this.render(S,api);}},
render:function(S,api){var t=S.t,trace=[],out='',line='for (…; …; …)';
 if(S.step===2&&t.p.start&&t.p.op&&t.p.end&&t.p.up){var r=sim(t.p);trace=r.tr;out=r.out.join(' ');line=r.line;}
 else if(S.step===3&&t.j.jA&&t.j.jB){var q=jump(t.j.jA,t.j.jB);trace=q.tr;out=q.out.join(' ');line='for (int i = 1; i <= 5; i++)';}
 api.$('loopline').textContent=line;var tl=api.$('trace');while(tl.firstChild){tl.removeChild(tl.firstChild);}
 if(!trace.length){var li=document.createElement('li');li.textContent=S.step===2||S.step===3?'Choose every part to see each pass.':'The loop activities trace each pass here.';tl.appendChild(li);}
 trace.forEach(function(x){var li=document.createElement('li');li.textContent=x.t;if(x.stop){li.className='stop';}tl.appendChild(li);});
 api.$('out').textContent=out||(trace.length?'(nothing printed)':'');
 api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!t.g[k]);li.querySelector('.st').textContent=t.g[k]?'done':'open';});}
};})();
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"build":["p"],"jump":["j"]};
