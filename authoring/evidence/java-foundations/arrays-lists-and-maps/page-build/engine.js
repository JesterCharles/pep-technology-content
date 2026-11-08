/* alm-engine@1: shared page behaviour for the arrays-lists-and-maps pages. It reads the page's TOPIC object and
   the activity sections' data-kind (predict, explore, code, apply). State lives only in this page: no storage,
   network, telemetry, form submission or dialogs. Navigation changes only the current activity; completion
   advances a monotonic unlocked frontier; Restart resets only the current activity. */
(function(){
'use strict';
var d=document,main=d.getElementById('lesson'),J=window.JMINI,T=window.TOPIC;
function $(id){return d.getElementById(id);}
function qa(sel,root){return Array.prototype.slice.call((root||d).querySelectorAll(sel));}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var acts=qa('[data-pep-activity]'),links=qa('[data-pep-activity-link]'),N=acts.length;
var prevBtn=$('previous-activity'),nextBtn=$('next-activity'),resetBtn=$('reset');
var MIN=main.getAttribute('data-pep-required-minutes');
var KIND={};acts.forEach(function(s,i){KIND[s.getAttribute('data-kind')]=i+1;});
function blank(){return {attempts:0,settled:false,completed:false,credit:0,grade:0,canContinue:false,missed:false,g:{},tries:0,conf:null,x:{}};}
var S={current:1,unlocked:1,complete:false,a:acts.map(blank)};
var SNAP={};qa('[data-restore]').forEach(function(n){SNAP[n.getAttribute('data-restore')]=n.innerHTML;});
function act(n){return S.a[n-1];}
function section(n){return acts[n-1];}
function feedback(n,html){section(n).querySelector('[data-pep-feedback]').innerHTML=html||'';}
function checked(name){var r=qa('input[name="'+name+'"]:checked')[0];return r?r.value:null;}
function optLabel(inp){return inp.closest('label');}
function need(n){return qa('[data-goal]',section(n)).map(function(li){return li.getAttribute('data-goal');});}

function reflect(){
  main.setAttribute('data-pep-current-activity',String(S.current));
  main.setAttribute('data-pep-unlocked-through',String(S.unlocked));
  main.setAttribute('data-pep-complete',S.complete?'true':'false');
  acts.forEach(function(sec,i){var s=S.a[i];
    sec.setAttribute('data-pep-attempts',String(s.attempts));sec.setAttribute('data-pep-settled',String(s.settled));
    sec.setAttribute('data-pep-completed',String(s.completed));sec.setAttribute('data-pep-credit',String(s.credit));
    sec.setAttribute('data-pep-grade',String(s.grade));sec.setAttribute('data-pep-continue',String(s.canContinue));});}
function progress(){var done=0,missed=0,open=0,segs=qa('#progress .seg');
  S.a.forEach(function(s,i){if(s.completed){done++;if(s.missed){missed++;}}else if(s.canContinue){open++;}
    segs[i].className='seg'+(s.completed?(s.missed?' is-settled':' is-done'):(i+1===S.current?' is-current':''));});
  $('prog-text').textContent='Activity '+S.current+' of '+N+' · '+done+' of '+N+' done'+(missed?' ('+missed+' answered, not marked correct)':'')+(open?' · '+open+' still open':'')+' · about '+MIN+' min';}
function render(){
  acts.forEach(function(sec,i){sec.hidden=(i+1!==S.current);});
  links.forEach(function(a,i){var n=i+1,s=S.a[i],st=a.querySelector('.pep-step__state');
    if(n===S.current){a.setAttribute('aria-current','step');}else{a.removeAttribute('aria-current');}
    if(n>S.unlocked){a.setAttribute('aria-disabled','true');}else{a.removeAttribute('aria-disabled');}
    a.classList.toggle('is-done',s.completed);
    st.textContent=n>S.unlocked?', locked':(s.completed?', done':(n===S.current?', current':''));});
  prevBtn.disabled=S.current===1;
  nextBtn.disabled=S.current>=N||S.current>=S.unlocked||!act(S.current).canContinue;
  $('recap').classList.toggle('is-pending',!S.complete);
  acts.forEach(function(sec,i){var s=S.a[i];qa('[data-goal]',sec).forEach(function(li){li.classList.toggle('done',!!s.g[li.getAttribute('data-goal')]);});});
  if(T.explore&&T.explore.render){T.explore.render(api(KIND.explore));}
  progress();reflect();}
function go(n,mode,focus){
  if(!(n>=1&&n<=N&&n<=S.unlocked)){return false;}
  S.current=n;
  try{if(mode==='push'){history.pushState({activity:n},'','#activity-'+n);}else if(mode==='replace'){history.replaceState({activity:n},'','#activity-'+n);}}
  catch(e){if(mode&&location.hash!=='#activity-'+n){location.hash='activity-'+n;}}
  render();
  if(focus){var h=section(n).querySelector('h2[tabindex]');if(h){h.focus();}}
  return true;}
function fromHash(){var m=/^#activity-(\d+)$/.exec(location.hash);return m?+m[1]:0;}
function historyChanged(){var n=fromHash();if(n===S.current){return;}if(!go(n,null,false)){go(S.current,'replace',false);}}
addEventListener('popstate',historyChanged);
addEventListener('hashchange',historyChanged);
function complete(n,grade,missed){var s=act(n);
  qa('[data-pep-open-note]').forEach(function(x){x.parentNode.removeChild(x);});
  if(!s.completed){s.completed=true;s.settled=true;s.canContinue=true;s.credit=1;s.grade=grade;s.missed=!!missed;}
  S.unlocked=Math.max(S.unlocked,Math.min(n+1,N));
  if(S.a.every(function(x){return x.completed;})&&!S.complete){S.complete=true;
    var m=S.a.filter(function(x){return x.missed;}).length;
    $('complete-msg').textContent='All '+N+' activities finished'+(m?'; '+m+' answered without being marked correct. That is fine: review its explanation before moving on.':'.');}
  else if(n===N&&!S.complete){var open=S.a.findIndex(function(x){return !x.completed;})+1;
    if(open){var title=section(open).querySelector('h2').textContent.replace(/^Activity\s+\d+(?:\s+of\s+\d+)?\s*[·:]\s*/,'').trim();
      var box=section(n).querySelector('[data-pep-feedback]');box.innerHTML+='<p class="verdict set" data-pep-open-note>Activity '+open+', '+esc(title)+', is still open, so the recap remains hidden. <a href="#activity-'+open+'" data-pep-back-link>Return to Activity '+open+'</a> and pass every check in one run.</p>';}}
  render();}
function allowContinue(n){var s=act(n);s.canContinue=true;S.unlocked=Math.max(S.unlocked,Math.min(n+1,N));render();}
function nextNote(n){return n<N?' Choose <em>Next activity</em> when ready.':' Your progress is updated above.';}
function invalidateCode(){var n=KIND.code;if(!n){return;}var s=act(n);if(!s.completed){return;}
  s.completed=false;s.settled=false;s.credit=0;s.grade=0;s.missed=false;s.g={};S.complete=false;
  qa('[data-pep-open-note]').forEach(function(x){x.parentNode.removeChild(x);});
  feedback(n,'<p>Code changed. The earlier run is now stale; run the current code and pass every check to restore completion.</p>');render();}
function api(n){return {n:n,s:act(n),sec:section(n),$:$,qa:qa,esc:esc,checked:checked,feedback:function(h){feedback(n,h);},
  goal:function(k){act(n).g[k]=1;},left:function(){var s=act(n);return need(n).filter(function(k){return !s.g[k];}).length;},
  finish:function(){complete(n,1,false);},render:render,nextNote:function(){return nextNote(n);},J:J};}

/* Predict: practice prediction before teaching, not scored. */
function checkPredict(){var n=KIND.predict,P=T.predict,ch=checked('predict'),pc=checked('pconf'),s=act(n);
  if(!ch||!pc||s.completed){return;}
  s.attempts=1;
  qa('input[name="predict"],input[name="pconf"]').forEach(function(i){i.disabled=true;});$('predict-check').disabled=true;
  qa('input[name="predict"]').forEach(function(i){var l=optLabel(i);if(i.value===P.correct){l.classList.add('right');}else if(i.value===ch){l.classList.add('wrong');}});
  var html='<p class="verdict">Practice prediction, not scored. '+(ch===P.correct?'Your prediction was correct.':'Your prediction was not correct; the correct answer is marked.')+' Each option, explained:</p><ul class="explain">';
  Object.keys(P.why).forEach(function(k){var i=qa('input[name="predict"][value="'+k+'"]')[0];
    html+='<li'+(k===ch?' class="mine"':'')+'><span class="on">'+(k===P.correct?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+esc(optLabel(i).textContent.trim())+(k===ch?' <em>(your prediction)</em>':'')+'</span><span class="ex">'+P.why[k]+'</span></li>';});
  feedback(n,html+'</ul><p class="conf-report">Your confidence: '+esc(pc)+' (not graded).</p><p>'+nextNote(n)+'</p>');
  complete(n,0,false);}

/* Apply: a confidence rating first, one retry in a new form, then the answer is revealed and locked. */
function markOpts(set,chosen){qa('input',$(set.fs)).forEach(function(i){var l=optLabel(i);i.disabled=true;
  if(i.value===set.correct&&chosen===set.correct){l.classList.add('right');}
  if(i.value===chosen&&chosen!==set.correct){l.classList.add('wrong');}});}
function badges(ok,mine){return '<span class="badges">'+(mine?'<span class="badge me">Your answer</span>':'')+(ok?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+'</span>';}
function annotate(set,chosen){qa('input',$(set.fs)).forEach(function(i){var sp=optLabel(i).querySelector('span');var w=d.createElement('span');w.className='why';
  w.innerHTML=badges(i.value===set.correct,i.value===chosen)+set.why[i.value];sp.appendChild(w);});}
function explainList(set){var html='<ul>';Object.keys(set.why).forEach(function(k){var i=qa('input[value="'+k+'"]',$(set.fs))[0];
  html+='<li><strong>'+(k===set.correct?'Correct: ':'Not this: ')+'</strong><span class="on">'+esc(optLabel(i).textContent.trim())+'</span>: '+set.why[k]+'</li>';});return html+'</ul>';}
function confText(s){return '<p class="conf-report" data-pep-confidence-report>Your confidence: '+esc(s.conf)+' (reported to you, never graded).</p>';}
function focusVerdict(n){var v=section(n).querySelector('[data-pep-feedback] .verdict');if(v){v.setAttribute('tabindex','-1');v.focus();}}
function checkApply(which){var n=KIND.apply,A=T.apply.A,B=T.apply.B,s=act(n);
  if(s.completed){return;}
  if(which==='a'){var ch=checked('apply-a');s.conf=checked('conf');if(!ch||!s.conf){return;}
    s.attempts=1;s.tries=1;qa('input[name="conf"]').forEach(function(i){i.disabled=true;});$('apply-check').disabled=true;markOpts(A,ch);
    if(ch===A.correct){annotate(A,ch);$('apply-check').hidden=true;feedback(n,'<p class="verdict ok">Correct.</p>'+A.okNote+'<p>Each option is explained in the list.</p>'+confText(s)+'<p>'+nextNote(n)+'</p>');complete(n,1,false);focusVerdict(n);return;}
    var pick=optLabel(qa('input[name="apply-a"][value="'+ch+'"]')[0]).textContent.trim();
    feedback(n,'<p class="verdict no">Not yet. Try once more with the same idea shown a different way.</p><p>Your first answer, <span class="on">'+esc(pick)+'</span>: '+A.miss[ch]+'</p><p>'+A.hint+'</p>'+confText(s));
    qa('[data-retry]',section(n)).forEach(function(x){x.hidden=false;});qa('[data-first]',section(n)).forEach(function(x){x.hidden=true;});
    render();$('task-apply-b').focus();}
  else{var c2=checked('apply-b');if(!c2||s.tries!==1){return;}
    s.attempts=2;s.tries=2;$('apply-check-b').hidden=true;markOpts(B,c2);annotate(B,c2);
    var details='<details><summary>First question: every option explained</summary>'+explainList(A)+'</details>';
    if(c2===B.correct){feedback(n,'<p class="verdict ok">Correct on the second try.</p><p>Each option is explained in the list.</p>'+details+confText(s)+'<p>'+nextNote(n)+'</p>');complete(n,1,false);}
    else{qa('input',$(B.fs)).forEach(function(i){if(i.value===B.correct){optLabel(i).classList.add('right');}});
      feedback(n,'<p class="verdict set">Answered, not marked correct: settled, no penalty.</p><p>'+B.reveal+' Each option is explained in the list.</p>'+details+confText(s)+'<p>'+nextNote(n)+'</p>');complete(n,0,true);}
    focusVerdict(n);}}
function syncButtons(){var p=KIND.predict,a=KIND.apply;
  if(p&&!act(p).completed){$('predict-check').disabled=!(checked('predict')&&checked('pconf'));}
  if(a&&!act(a).completed&&act(a).tries===0){$('apply-check').disabled=!(checked('apply-a')&&checked('conf'));}
  if(a&&!act(a).completed&&act(a).tries===1){$('apply-check-b').disabled=!checked('apply-b');}}

/* Practice editor: gutter, Problems | Output, status, Run, Reset code. Language behaviour comes from JMINI and
   the topic's evaluate function, which checks resulting values on the visible examples only. */
var ED=null;
function mountEditor(root,cfg){
  var q=function(s){return root.querySelector(s);},ta=q('.pep-editor__input'),gut=q('.pep-editor__gutter'),probs=q('.pep-editor__probs'),outEl=q('.pep-editor__out'),
    stat=q('.pep-editor__status'),pos=q('.pep-editor__pos'),cnt=q('.pep-editor__count'),live=q('.pep-editor__live'),tabs=qa('[role=tab]',root),escArmed=false,last=[],timer=null,lastValue=null;
  function paintGutter(){var n=ta.value.split('\n').length,bad={},h='';last.forEach(function(p){if(!bad[p.line]||p.kind==='error'){bad[p.line]=p.kind;}});
    for(var i=1;i<=n;i++){h+='<span'+(bad[i]?' class="g-'+bad[i]+'"':'')+'>'+i+'</span>\n';}gut.innerHTML=h;}
  function caret(){var v=ta.value.slice(0,ta.selectionStart).split('\n');pos.textContent='Ln '+v.length+', Col '+(v[v.length-1].length+1);}
  function paintProblems(){probs.innerHTML=last.length?last.map(function(p){return '<li><button type="button" class="pep-editor__problem" data-line="'+p.line+'" data-col="'+p.col+'"><span class="ln">Ln '+p.line+'</span> <span class="kind-'+p.kind+'">'+(p.kind==='error'?'Error':'Lesson check')+'</span> '+esc(p.msg)+'</button></li>';}).join(''):'<li class="pep-editor__none">No problems found by the lesson checker.</li>';
    var e=last.filter(function(p){return p.kind==='error';}).length;cnt.textContent=e+' error'+(e===1?'':'s')+', '+(last.length-e)+' lesson check'+(last.length-e===1?'':'s');tabs[0].textContent='Problems ('+last.length+')';}
  function analyse(){var p=J.parse(ta.value,cfg.mode);last=p.problems;paintProblems();paintGutter();return p;}
  function select(i,focus){tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;$(t.getAttribute('aria-controls')).hidden=!on;});if(focus){tabs[i].focus();}}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){select(i);});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(1-i,true);}});});
  probs.addEventListener('click',function(e){var b=e.target.closest('.pep-editor__problem');if(!b){return;}
    var ln=+b.getAttribute('data-line'),col=+b.getAttribute('data-col'),ls=ta.value.split('\n'),off=0;
    for(var i=0;i<ln-1&&i<ls.length;i++){off+=ls[i].length+1;}off+=Math.max(0,Math.min(col-1,(ls[ln-1]||'').length));ta.focus();ta.setSelectionRange(off,off);caret();});
  function disarm(){escArmed=false;stat.removeAttribute('data-esc');}
  ta.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();disarm();doRun();return;}
    if(e.key==='Escape'){escArmed=true;stat.setAttribute('data-esc','1');return;}
    if(e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){if(escArmed){disarm();return;}e.preventDefault();var s=ta.selectionStart,v=ta.value,ls=v.lastIndexOf('\n',s-1)+1;
      if(e.shiftKey){var lead=/^ {0,4}/.exec(v.slice(ls))[0].length;if(lead){ta.value=v.slice(0,ls)+v.slice(ls+lead);var c=Math.max(ls,s-lead);ta.setSelectionRange(c,c);}}
      else{ta.setRangeText('    ',s,ta.selectionEnd,'end');}changed();return;}
    if(escArmed){disarm();}});
  function changed(){if(ta.value===lastValue){caret();paintGutter();return;}lastValue=ta.value;invalidateCode();caret();paintGutter();clearTimeout(timer);timer=setTimeout(analyse,250);}
  ta.addEventListener('input',changed);ta.addEventListener('blur',disarm);
  ['keyup','click','focus'].forEach(function(ev){ta.addEventListener(ev,caret);});
  function doRun(){clearTimeout(timer);var p=analyse(),rep;
    if(p.problems.length){var err=p.problems.filter(function(x){return x.kind==='error';}).length;
      rep={status:err?'syntax':'limit',lines:['Not run: '+p.problems.length+' problem'+(p.problems.length===1?'':'s')+' to fix first.'+(err?' javac would reject this code before running any of it.':'')],summary:'Not run. '+p.problems.length+' problem'+(p.problems.length===1?'':'s')+' still open.',goals:{}};}
    else{rep=(T.code&&T.code.evaluate?T.code.evaluate:cfg.evaluate)(p.prog,J);if(rep.problems){last=rep.problems;paintProblems();paintGutter();}}
    outEl.textContent=['$ practice-run '+cfg.file+'   (lesson simulator, not a real JVM)'].concat(rep.lines).join('\n');
    select(rep.status==='syntax'||rep.status==='limit'?0:1);
    live.textContent='';var msg=rep.summary;setTimeout(function(){live.textContent=msg;},30);
    onCodeRun(rep,ta.value);return rep;}
  q('.pep-editor__run').addEventListener('click',doRun);
  q('.pep-editor__reset').addEventListener('click',function(){if(ta.value!==cfg.starter){invalidateCode();}set(cfg.starter);live.textContent='Code reset to the starting version.';});
  function set(v){ta.value=v;lastValue=v;last=[];outEl.textContent='Press Run (or Ctrl+Enter in the editor) to check this code with the lesson simulator.';analyse();caret();select(0);}
  set(cfg.starter);root.setAttribute('data-state','ready');
  return {set:set,run:doRun};}
function normal(code){return String(code).replace(/\r\n?/g,'\n').replace(/[ \t]+$/gm,'').trim();}
function onCodeRun(rep,code){var n=KIND.code,s=act(n),C=T.code,m=[];
  if(normal(code)===normal(C.starter)){feedback(n,'<p>Not run yet: '+C.startNote+' Nothing was counted.</p>');return;}
  /* Checks reflect the latest run as a whole, so passing them in separate runs with different code cannot add up. */
  var latest={};Object.keys(rep.goals||{}).forEach(function(k){if(rep.goals[k]){latest[k]=1;}});s.g=latest;
  m.push(rep.feedback||esc(rep.summary));
  var all=need(n).every(function(k){return s.g[k];});
  if(s.completed&&!all){invalidateCode();s=act(n);s.g=latest;}
  /* Two runs of edited code may unlock unlimited ungraded navigation, even when the edits are identical. Only a
     run that passes every check completes the activity or earns credit; until then it stays open. */
  if(!s.completed){s.attempts++;
    if(all){m.push('<strong>All checks done.</strong>'+nextNote(n));complete(n,1,false);}
    else if(s.attempts>=2){m.push((s.canContinue?'Some checks are still open.':'<strong>You may move on now.</strong>')+' This activity stays open, and is not marked done, until one run passes every check. Compare Output with the examples and open the hints for the next reasoning step.'+(n<N?' <em>Next activity</em> is available whenever you choose.':''));allowContinue(n);}
    else{m.push('Some checks are still open; the hints beside the task give the next reasoning step.');render();}}
  else{if(all){m.push('<strong>All checks now pass.</strong> Your earlier result for this activity stands.');}render();}
  feedback(n,'<p>'+m.join(' ')+'</p>');}

/* Restart: only the current activity returns to its authored start. Navigation access, required time and every
   other activity stay as they are; completion becomes stale until every required activity is complete again. */
function restart(){var n=S.current;
  S.a[n-1]=blank();S.complete=false;
  qa('[data-restore]',section(n)).forEach(function(box){box.innerHTML=SNAP[box.getAttribute('data-restore')];});
  if(n===KIND.code&&ED){ED.set(T.code.starter);}
  if(n===KIND.explore&&T.explore.reset){T.explore.reset(api(n));}
  if(n===KIND.apply){$('task-apply-b').hidden=true;}
  qa('details.pep-optional',section(n)).forEach(function(x){x.open=false;});
  feedback(n,'');render();
  var h=section(n).querySelector('h2[tabindex]');if(h){h.focus();}}

d.addEventListener('click',function(e){
  var link=e.target.closest('[data-pep-activity-link],[data-pep-back-link]');
  if(link){e.preventDefault();var n=+(/activity-(\d+)$/.exec(link.getAttribute('href'))||[])[1];
    if(link.getAttribute('aria-disabled')!=='true'){go(n,'push',true);}return;}
  var b=e.target.closest('button');if(!b||b.disabled){return;}
  if(b===resetBtn){restart();}
  else if(b===prevBtn){go(S.current-1,'push',true);}
  else if(b===nextBtn){go(S.current+1,'push',true);}
  else if(b.id==='predict-check'){checkPredict();}
  else if(b.id==='apply-check'){checkApply('a');}
  else if(b.id==='apply-check-b'){checkApply('b');}
  else if(b.hasAttribute('data-act')&&T.explore){T.explore.on(b.getAttribute("data-act"),b,api(KIND.explore));}});
d.addEventListener('change',function(e){syncButtons();if(e.target.hasAttribute('data-act-input')&&T.explore&&T.explore.onInput){T.explore.onInput(e.target,api(KIND.explore));}});
d.addEventListener('input',function(e){if(e.target.hasAttribute('data-act-input')&&T.explore&&T.explore.onInput){T.explore.onInput(e.target,api(KIND.explore));}});

/* Objectives: a native disclosure; a fine pointer may also open it on hover. Escape and an outside click close it. */
var obj=d.querySelector('[data-pep-objectives]'),objSum=obj.querySelector('summary'),hoverOpened=false;
function fine(){return !!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches);}
obj.addEventListener('mouseenter',function(){if(fine()&&!obj.open){obj.open=true;hoverOpened=true;}});
obj.addEventListener('mouseleave',function(){if(hoverOpened){obj.open=false;hoverOpened=false;}});
objSum.addEventListener('click',function(e){if(hoverOpened){e.preventDefault();hoverOpened=false;}});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&obj.open){obj.open=false;hoverOpened=false;objSum.focus();}});
d.addEventListener('click',function(e){if(obj.open&&!obj.contains(e.target)){obj.open=false;hoverOpened=false;}});

/* Print shows every activity and opens closed disclosures, then restores their exact prior state. */
var printOpened=[];
addEventListener('beforeprint',function(){printOpened=qa('details:not([open])',main);printOpened.forEach(function(x){x.open=true;});});
addEventListener('afterprint',function(){printOpened.forEach(function(x){x.open=false;});printOpened=[];});

if(T.code){try{ED=mountEditor($('ed'),{file:T.code.file,mode:T.code.mode,starter:T.code.starter,evaluate:T.code.evaluate});}
  catch(e){feedback(KIND.code,'<p>The editor could not start; the static exercise text still describes the task.</p>');}}
if(T.explore&&T.explore.reset){T.explore.reset(api(KIND.explore));}
var start=fromHash();
go(start>=1&&start<=S.unlocked?start:1,'replace',false);
})();
