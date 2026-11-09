/* hc-engine@1: shared page behaviour for the html-and-css pages, adapted from jb-engine@1. It runs the page's TOPIC
   object unchanged from the pre-DESIGN pages (activities, live layouts, checks, feedback text) inside the DESIGN.md
   activity anatomy. State lives only in this page: no storage, network, telemetry, form submission or dialogs.
   Navigation changes only the current activity; completion advances a monotonic unlocked frontier; Restart resets
   only the current activity. */
(function(){
'use strict';
var d=document,main=d.getElementById('lesson');
function $(id){return d.getElementById(id);}
function qa(sel,root){return Array.prototype.slice.call((root||d).querySelectorAll(sel));}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function clone(o){return o===undefined?undefined:JSON.parse(JSON.stringify(o));}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
var acts=qa('[data-pep-activity]'),links=qa('[data-pep-activity-link]'),N=acts.length,NAMES=TOPIC.acts;
var prevBtn=$('previous-activity'),nextBtn=$('next-activity'),resetBtn=$('reset'),model=$('live-model');
var MIN=main.getAttribute('data-pep-required-minutes');
function blank(){return {attempts:0,settled:false,completed:false,credit:0,grade:0,canContinue:false,missed:false};}
var A=acts.map(blank),unlocked=1,pageDone=false;
/* S keeps the shape the TOPIC code reads: step is the current activity, done and settled are keyed by activity name. */
var S={step:1,done:{},settled:{},conf:null,tries:0,firstPick:null,t:TOPIC.init()};
/* Restart ownership: the TOPIC state each activity changed, restored to its value when that activity was first shown. */
var ENTRY={},OWN={};
var SNAP={};qa('[data-restore]').forEach(function(n){SNAP[n.getAttribute('data-restore')]=n.innerHTML;});
function section(n){return acts[n-1];}
function nameOf(n){return NAMES[n-1];}
function numOf(name){return NAMES.indexOf(name)+1;}
function fbFor(n){return section(n).querySelector('[data-pep-feedback]');}
function say(html,step){var f=fbFor(step||S.step);if(f){f.innerHTML=html;}}
var api={$:$,qa:qa,esc:esc,say:say,complete:function(name){complete(numOf(name),1,false);},get S(){return S;}};
function tracked(fn){var n=S.step,before={};Object.keys(S.t).forEach(function(k){before[k]=clone(S.t[k]);});
  fn();var o=OWN[n]||(OWN[n]={});
  Object.keys(S.t).concat(Object.keys(before)).forEach(function(k){if(!same(before[k],S.t[k])){o[k]=true;}});}

function reflect(){
  main.setAttribute('data-pep-current-activity',String(S.step));
  main.setAttribute('data-pep-unlocked-through',String(unlocked));
  main.setAttribute('data-pep-complete',pageDone?'true':'false');
  acts.forEach(function(sec,i){var s=A[i];
    sec.setAttribute('data-pep-attempts',String(s.attempts));sec.setAttribute('data-pep-settled',String(s.settled));
    sec.setAttribute('data-pep-completed',String(s.completed));sec.setAttribute('data-pep-credit',String(s.credit));
    sec.setAttribute('data-pep-grade',String(s.grade));sec.setAttribute('data-pep-continue',String(s.canContinue));});}
function progress(){var done=0,missed=0,segs=qa('#progress .seg');
  A.forEach(function(s,i){if(s.completed){done++;if(s.missed){missed++;}}
    segs[i].className='seg'+(s.completed?(s.missed?' is-settled':' is-done'):(i+1===S.step?' is-current':''));});
  $('prog-text').textContent='Activity '+S.step+' of '+N+' · '+done+' of '+N+' done'+(missed?' ('+missed+' answered, not marked correct)':'')+' · about '+MIN+' min';}
function render(){
  acts.forEach(function(sec,i){sec.hidden=(i+1!==S.step);});
  links.forEach(function(a,i){var n=i+1,s=A[i],st=a.querySelector('.pep-step__state');
    if(n===S.step){a.setAttribute('aria-current','step');}else{a.removeAttribute('aria-current');}
    if(n>unlocked){a.setAttribute('aria-disabled','true');}else{a.removeAttribute('aria-disabled');}
    a.classList.toggle('is-done',s.completed);
    st.textContent=n>unlocked?', locked':(s.completed?', done':(n===S.step?', current':''));});
  prevBtn.disabled=S.step===1;
  nextBtn.disabled=S.step>=N||S.step>=unlocked||!A[S.step-1].canContinue;
  var slot=section(S.step).querySelector('[data-model-slot]');if(model&&slot&&model.parentNode!==slot){slot.appendChild(model);}
  $('recap').classList.toggle('is-pending',!pageDone);
  if(!ENTRY[S.step]){ENTRY[S.step]=clone(S.t);}
  if(TOPIC.prep){TOPIC.prep(api);}
  tracked(function(){TOPIC.render(S,api);});
  progress();reflect();}
function go(n,mode,focus){
  if(!(n>=1&&n<=N&&n<=unlocked)){return false;}
  S.step=n;
  try{if(mode==='push'){history.pushState({activity:n},'','#activity-'+n);}else if(mode==='replace'){history.replaceState({activity:n},'','#activity-'+n);}}
  catch(e){if(mode&&location.hash!=='#activity-'+n){location.hash='activity-'+n;}}
  render();
  if(focus){var h=section(n).querySelector('h2[tabindex]');if(h){h.focus();}}
  return true;}
function fromHash(){var m=/^#activity-(\d+)$/.exec(location.hash);return m?+m[1]:0;}
function historyChanged(){var n=fromHash();if(n===S.step){return;}if(!go(n,null,false)){go(S.step,'replace',false);}}
addEventListener('popstate',historyChanged);
addEventListener('hashchange',historyChanged);
function complete(n,grade,missed){var s=A[n-1];
  if(!s.completed){s.completed=true;s.settled=true;s.canContinue=true;s.credit=1;s.grade=grade;s.missed=!!missed;}
  S.done[nameOf(n)]=true;
  unlocked=Math.max(unlocked,Math.min(n+1,N));
  if(A.every(function(x){return x.completed;})&&!pageDone){pageDone=true;
    var m=A.filter(function(x){return x.missed;}).length;
    $('complete-msg').textContent='All '+N+' activities finished'+(m?'; '+m+' was answered without being marked correct. That is fine: review its explanation above before moving on.':'.');}
  render();}
/* Every practice action on a still-open activity counts as one attempt. */
function attempt(){var s=A[S.step-1];if(!s.completed){s.attempts++;}}

/* Predict: practice prediction before teaching, not scored. */
function optLabel(inp){return inp.closest('label');}
function checked(name){var r=qa('input[name="'+name+'"]:checked')[0];return r?r.value:null;}
function checkPredict(){
  var n=numOf('predict'),P=TOPIC.predict,ch=checked('predict'),pc=checked('pconf');
  if(!ch||!pc||A[n-1].completed){return;}
  A[n-1].attempts=1;
  qa('input[name="predict"],input[name="pconf"]').forEach(function(i){i.disabled=true;});$('predict-check').disabled=true;
  qa('input[name="predict"]').forEach(function(i){var l=optLabel(i);if(i.value===P.correct){l.classList.add('right');}else if(i.value===ch){l.classList.add('wrong');}
    if(i.value===P.correct||i.value===ch){var w=d.createElement('span');w.className='badges';w.innerHTML=(i.value===ch?'<span class="badge me">Your prediction</span>':'')+(i.value===P.correct?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>');l.querySelector('span').appendChild(w);}});
  var html='<p class="verdict">Practice prediction, not scored. '+(ch===P.correct?'Your prediction was correct.':'Your prediction was not correct; the correct answer is marked.')+' Each option, explained:</p><ul class="explain">';
  Object.keys(P.why).forEach(function(k){var i=qa('input[name="predict"][value="'+k+'"]')[0];
    html+='<li'+(k===ch?' class="mine"':'')+'><span class="on">'+(k===P.correct?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+esc(optLabel(i).querySelector('span').firstChild.textContent.trim())+(k===ch?' <em>(your prediction)</em>':'')+'</span><span class="ex">'+P.why[k]+'</span></li>';});
  say(html+'</ul><p class="conf-report">Your confidence: '+esc(pc)+' (not graded).</p>'+(P.after||''),n);complete(n,0,false);}

/* Apply: a confidence rating first, one retry in a new form, then the answer is revealed and locked. */
function explainList(set,chosen,mark){
  var html='<ul>';
  Object.keys(set.why).forEach(function(k){
    var txt=qa('input[value="'+k+'"]',$(set.fs))[0];var lab=txt?optLabel(txt).textContent.trim():k;
    var tag=(k===set.correct)?'<strong>Correct: </strong>':'<strong>Not this: </strong>';
    html+='<li>'+(mark?tag:'')+'<span class="on">'+esc(lab)+'</span>: '+set.why[k]+(k===chosen?' <em>(your choice)</em>':'')+'</li>';});
  return html+'</ul>';}
function markOpts(set,chosen){qa('input',$(set.fs)).forEach(function(i){var l=optLabel(i);i.disabled=true;
  if(i.value===set.correct&&(chosen===set.correct)){l.classList.add('right');}
  if(i.value===chosen&&chosen!==set.correct){l.classList.add('wrong');}});}
function firstDetails(){return '<details><summary>First question: every option explained</summary>'+explainList(TOPIC.apply.A,null,true)+'</details>';}
function badges(ok,mine,who){return '<span class="badges">'+(mine?'<span class="badge me">'+who+'</span>':'')+(ok?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+'</span>';}
function annotate(set,chosen){qa('input',$(set.fs)).forEach(function(i){var sp=optLabel(i).querySelector('span');var w=d.createElement('span');w.className='why';
  w.innerHTML=badges(i.value===set.correct,i.value===chosen,'Your answer')+set.why[i.value];sp.appendChild(w);});}
function focusVerdict(n){var v=fbFor(n).querySelector('.verdict');if(v){v.setAttribute('tabindex','-1');v.focus();}}
function confText(){return '<p class="conf-report" data-pep-confidence-report>Your confidence: '+esc(S.conf)+' (reported to you, never graded).</p>';}
function syncApply(){var p=numOf('predict'),a=numOf('apply');
  var pb=$('predict-check');if(pb&&!A[p-1].completed){pb.disabled=!(checked('predict')&&checked('pconf'));}
  var b=$('apply-check');if(b&&!A[a-1].completed&&S.tries===0){b.disabled=!(checked('apply-a')&&checked('conf'));}
  var bb=$('apply-check-b');if(bb&&!A[a-1].completed&&S.tries===1){bb.disabled=!checked('apply-b');}}
function checkApply(which){
  var n=numOf('apply'),s=A[n-1],AA=TOPIC.apply.A,B=TOPIC.apply.B;if(s.completed){return;}
  if(which==='a'){
    var ch=checked('apply-a');S.conf=checked('conf');if(!ch||!S.conf||S.tries!==0){return;}
    S.tries=1;s.attempts=1;qa('input[name="conf"]').forEach(function(i){i.disabled=true;});$('apply-check').disabled=true;markOpts(AA,ch);
    if(ch===AA.correct){S.tries=2;annotate(AA,ch);$('apply-check').hidden=true;say('<p class="verdict ok">Correct.</p>'+AA.okNote+'<p>Each option is explained in the list.</p>'+confText(),n);complete(n,1,false);focusVerdict(n);return;}
    S.firstPick=optLabel(qa('input[name="apply-a"][value="'+ch+'"]')[0]).textContent.trim();
    say('<p class="verdict no">Not yet. Try once more with the same goal shown a different way.</p><p>Your first answer, <span class="on">'+esc(S.firstPick)+'</span>: '+AA.miss[ch]+'</p><p>'+AA.hint+'</p>'+confText(),n);
    qa('[data-retry]',section(n)).forEach(function(x){x.hidden=false;});qa('[data-first]',section(n)).forEach(function(x){x.hidden=true;});render();
    var t=$('task-apply-b');if(t){t.focus();}
  } else {
    var c2=checked('apply-b');if(!c2||S.tries!==1){return;}
    S.tries=2;s.attempts=2;$('apply-check-b').hidden=true;markOpts(B,c2);annotate(B,c2);
    if(c2===B.correct){say('<p class="verdict ok">Correct on the second try.</p><p>Each option is explained in the list.</p>'+firstDetails()+confText(),n);complete(n,1,false);}
    else{S.settled.apply=true;qa('input',$(B.fs)).forEach(function(i){if(i.value===B.correct){optLabel(i).classList.add('right');}});
      say('<p class="verdict set">Answered, not marked correct: settled, no penalty.</p><p>'+B.reveal+' Each option is explained in the list.</p>'+firstDetails()+confText(),n);complete(n,0,true);}
    focusVerdict(n);}}

/* Restart: only the current activity returns to its authored start. Navigation access, required time and every
   other activity stay as they are; completion becomes stale until every required activity is complete again. */
function restart(){var n=S.step,name=nameOf(n),sec=section(n);
  A[n-1]=blank();delete S.done[name];delete S.settled[name];pageDone=false;$('complete-msg').textContent='';
  qa('[data-restore]',sec).forEach(function(box){box.innerHTML=SNAP[box.getAttribute('data-restore')];});
  var e=ENTRY[n]||{};Object.keys(OWN[n]||{}).forEach(function(k){if(e[k]===undefined){delete S.t[k];}else{S.t[k]=clone(e[k]);}});
  if(name==='apply'){S.conf=null;S.tries=0;S.firstPick=null;var b=$('task-apply-b');if(b){b.hidden=true;}}
  say('',n);render();
  var h=sec.querySelector('h2[tabindex]');if(h){h.focus();}}

d.addEventListener('click',function(e){
  var link=e.target.closest('[data-pep-activity-link],[data-pep-back-link]');
  if(link){e.preventDefault();var n=+(/activity-(\d+)$/.exec(link.getAttribute('href'))||[])[1];
    if(link.getAttribute('aria-disabled')!=='true'){go(n,'push',true);}return;}
  var b=e.target.closest('button');if(!b||b.disabled){return;}
  if(b===resetBtn){restart();return;}
  if(b===prevBtn){go(S.step-1,'push',true);return;}
  if(b===nextBtn){go(S.step+1,'push',true);return;}
  if(b.id==='predict-check'){checkPredict();return;}
  if(b.id==='apply-check'){checkApply('a');return;}
  if(b.id==='apply-check-b'){checkApply('b');return;}
  var a=b.getAttribute('data-act');if(a&&TOPIC.act){attempt();tracked(function(){TOPIC.act(a,b,S,api);});reflect();}});
d.addEventListener('change',function(e){syncApply();if(TOPIC.change){tracked(function(){TOPIC.change(e.target,S,api);});reflect();}});
d.addEventListener('input',function(e){if(TOPIC.input){tracked(function(){TOPIC.input(e.target,S,api);});}});
d.addEventListener('keydown',function(e){var t=e.target;if(e.key==='Enter'&&!e.isComposing&&t.tagName==='INPUT'&&t.type!=='radio'&&t.type!=='checkbox'&&t.hasAttribute('data-enter')){e.preventDefault();var b=$(t.getAttribute('data-enter'));if(b&&!b.disabled){b.click();}}});

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

var start=fromHash();
go(start>=1&&start<=unlocked?start:1,'replace',false);
})();
