/* sql-practice@1 page controller. Shared by every page of the module; page content comes from TOPIC and SQL_TABLES.
   Activity 1 is a practice prediction, the middle activities are SQL editor tasks, and the last is an apply check
   with confidence, one retry and the answer. Navigation never changes activity state; Restart resets only the
   current activity. No storage, no network. */
var SQLCHK={
  show:function(v){return v===null?null:LESSON_EDITOR_SQL.show(v);},
  rows:function(res){return res.rows.map(function(r){return r.map(SQLCHK.show);});},
  selects:function(rep){return (rep.outcomes||[]).filter(function(o){return o.res;});},
  errors:function(rep){return (rep.outcomes||[]).filter(function(o){return o.error;});},
  of:function(rep,type,table){return (rep.outcomes||[]).filter(function(o){return o.type===type&&!o.error&&!o.limit&&(!table||o.st.table===table);});},
  col:function(res,name){return res.cols.indexOf(name);},
  key:function(r){return JSON.stringify(r);},
  sameList:function(a,b){return SQLCHK.key(a)===SQLCHK.key(b);},
  sameSet:function(a,b){return a.length===b.length&&SQLCHK.key(a.map(SQLCHK.key).sort())===SQLCHK.key(b.map(SQLCHK.key).sort());},
  pick:function(res,names){var idx=names.map(function(n){return res.cols.indexOf(n);});if(idx.some(function(i){return i<0;})){return null;}return SQLCHK.rows(res).map(function(r){return idx.map(function(i){return r[i];});});},
  table:function(rep,name){var t=rep.db&&rep.db[name];return t?t.rows.map(function(r){return r.map(SQLCHK.show);}):[];},
  orderCols:function(o){return (o.st.order||[]).map(function(k){return k.e&&k.e.col?k.e.col:null;});},
  nodes:function(n,pred,acc){acc=acc||[];if(n&&typeof n==='object'){if(!Array.isArray(n)&&pred(n)){acc.push(n);}Object.keys(n).forEach(function(k){SQLCHK.nodes(n[k],pred,acc);});}return acc;},
  calls:function(n,name){return SQLCHK.nodes(n,function(x){return x.op==='call'&&x.name===name;});}
};
(function(){
'use strict';
var d=document,main=d.getElementById('lesson');
function $(id){return d.getElementById(id);}
function qa(sel,root){return Array.prototype.slice.call((root||d).querySelectorAll(sel));}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var acts=qa('[data-pep-activity]'),links=qa('[data-pep-activity-link]'),N=acts.length;
var prevBtn=$('previous-activity'),nextBtn=$('next-activity'),resetBtn=$('reset');
var MIN=main.getAttribute('data-pep-required-minutes');
function kind(n){return section(n).getAttribute('data-kind');}
function blank(){return {attempts:0,settled:false,completed:false,credit:0,grade:0,canContinue:false,missed:false,g:{},tries:0,conf:null,firstPick:null};}
var S={current:1,unlocked:1,complete:false,routeSettled:false,a:acts.map(blank)};
var SNAP={};
qa('[data-restore]').forEach(function(n){SNAP[n.getAttribute('data-restore')]=n.innerHTML;});
function act(n){return S.a[n-1];}
function section(n){return acts[n-1];}
function feedback(n,html){var f=section(n).querySelector('[data-pep-feedback]');f.innerHTML=html||'';}
function checked(name){var r=qa('input[name="'+name+'"]:checked')[0];return r?r.value:null;}
function optLabel(inp){return inp.closest('label');}

function reflect(){
  main.setAttribute('data-pep-current-activity',String(S.current));
  main.setAttribute('data-pep-unlocked-through',String(S.unlocked));
  main.setAttribute('data-pep-complete',S.complete?'true':'false');
  main.setAttribute('data-pep-route-settled',S.routeSettled?'true':'false');
  acts.forEach(function(sec,i){var s=S.a[i];
    sec.setAttribute('data-pep-attempts',String(s.attempts));sec.setAttribute('data-pep-settled',String(s.settled));
    sec.setAttribute('data-pep-completed',String(s.completed));sec.setAttribute('data-pep-credit',String(s.credit));
    sec.setAttribute('data-pep-grade',String(s.grade));sec.setAttribute('data-pep-continue',String(s.canContinue));});
}
function progress(){
  var done=0,missed=0;
  S.a.forEach(function(s,i){if(s.completed){done++;}else if(s.settled){missed++;}
    var seg=qa('#progress .seg')[i];seg.className='seg'+(s.completed?' is-done':(s.settled?' is-settled':(i+1===S.current?' is-current':'')));});
  $('prog-text').textContent='Activity '+S.current+' of '+N+' · '+done+' of '+N+' done'+(missed?' ('+missed+' settled, not passed)':'')+' · about '+MIN+' min';
}
function checks(n){var s=act(n);qa('[data-goal]',section(n)).forEach(function(li){li.classList.toggle('done',!!s.g[li.getAttribute('data-goal')]);});}
function render(){
  acts.forEach(function(sec,i){sec.hidden=(i+1!==S.current);});
  links.forEach(function(a,i){var n=i+1,s=S.a[i],state=a.querySelector('.pep-step__state');
    if(n===S.current){a.setAttribute('aria-current','step');}else{a.removeAttribute('aria-current');}
    if(n>S.unlocked){a.setAttribute('aria-disabled','true');}else{a.removeAttribute('aria-disabled');}
    a.classList.toggle('is-done',s.completed);
    state.textContent=n>S.unlocked?', locked':(s.completed?', done':(s.settled?', settled, not passed':(n===S.current?', current':'')));});
  prevBtn.disabled=S.current===1;
  nextBtn.disabled=S.current>=N||S.current>=S.unlocked||!act(S.current).canContinue;
  $('recap').classList.toggle('is-pending',!S.routeSettled);
  for(var n=1;n<=N;n++){checks(n);}
  progress();reflect();
}
function go(n,mode,focus){
  if(!(n>=1&&n<=N&&n<=S.unlocked)){return false;}
  S.current=n;
  try{if(mode==='push'){history.pushState({activity:n},'','#activity-'+n);}else if(mode==='replace'){history.replaceState({activity:n},'','#activity-'+n);}}
  catch(e){if(mode&&location.hash!=='#activity-'+n){location.hash='activity-'+n;}}
  render();
  if(focus){var h=section(n).querySelector('h2[tabindex]');if(h){h.focus();}}
  return true;
}
function fromHash(){var m=/^#activity-(\d+)$/.exec(location.hash);return m?+m[1]:0;}
function historyChanged(){var n=fromHash();if(n===S.current){return;}if(!go(n,null,false)){go(S.current,'replace',false);}}
addEventListener('popstate',historyChanged);
addEventListener('hashchange',historyChanged);

/* Completion and credit need passing evidence (a prediction is unscored practice, so making one is its evidence).
   A failed required activity only settles: Continue opens, but completion, credit and grade stay 0. */
function complete(n,grade){var s=act(n);
  if(!s.completed){s.completed=true;s.settled=true;s.canContinue=true;s.credit=1;s.grade=grade;s.missed=false;}
  finish(n);
}
function settle(n){var s=act(n);
  if(!s.completed){s.settled=true;s.canContinue=true;s.missed=true;s.credit=0;s.grade=0;}
  finish(n);
}
function summarize(){
  S.complete=S.a.every(function(x){return x.completed;});
  S.routeSettled=S.a.every(function(x){return x.completed||x.settled;});
  var m=S.a.filter(function(x){return x.settled&&!x.completed;}).length;
  $('complete-msg').textContent=S.complete?'All '+N+' activities finished.':(S.routeSettled?'All '+N+' activities reached; '+m+' settled without passing, so the page is not complete yet. Review the explanation, then use Restart activity on it to try again.':'');
}
function finish(n){S.unlocked=Math.max(S.unlocked,Math.min(n+1,N));summarize();render();}
function nextNote(n){return n<N?' Choose <em>Next activity</em> when ready.':' The recap now follows the activities.';}

/* Prediction before teaching: practice, not scored. */
function checkPredict(){
  var P=TOPIC.predict,ch=checked('predict'),pc=checked('pconf'),n=+$('predict-fs').closest('[data-pep-activity]').id.split('-')[1],s=act(n);
  if(!ch||!pc||s.completed){return;}
  s.attempts=1;
  qa('input[name="predict"],input[name="pconf"]').forEach(function(i){i.disabled=true;});$('predict-check').disabled=true;
  qa('input[name="predict"]').forEach(function(i){var l=optLabel(i);if(i.value===P.correct){l.classList.add('right');}else if(i.value===ch){l.classList.add('wrong');}
    if(i.value===P.correct||i.value===ch){var w=d.createElement('span');w.className='badges';w.innerHTML=(i.value===ch?'<span class="badge me">Your prediction</span>':'')+(i.value===P.correct?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>');l.querySelector('span').appendChild(w);}});
  var html='<p class="verdict">Practice prediction, not scored. '+(ch===P.correct?'Your prediction was correct.':'Your prediction was not correct; the correct answer is marked.')+' Each option, explained:</p><ul class="explain">';
  Object.keys(P.why).forEach(function(k){var i=qa('input[name="predict"][value="'+k+'"]')[0];
    html+='<li'+(k===ch?' class="mine"':'')+'><span class="on">'+(k===P.correct?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+esc(optLabel(i).querySelector('span').firstChild.textContent.trim())+(k===ch?' <em>(your prediction)</em>':'')+'</span><span class="ex">'+P.why[k]+'</span></li>';});
  feedback(n,html+'</ul><p class="conf-report">Your confidence: '+esc(pc)+' (not graded).</p><p>'+nextNote(n)+'</p>');
  complete(n,0);
}

/* SQL editor tasks: every Run starts from the lesson's starting rows. Two runs that still miss a check settle the
   activity without revealing a finished statement; the editor stays open for practice. */
var editors={};
function normal(code){return String(code).replace(/\r\n?/g,'\n').replace(/[ \t]+$/gm,'').trim();}
function onSqlRun(n,report,code){var cfg=TOPIC.sql[n],s=act(n),m=[];
  if(normal(code)===normal(cfg.starter)){feedback(n,'<p>That is the starting file, so nothing was counted. Add your statement where the comment says, then press <em>Run</em>.</p>');return;}
  if(report.status==='limit'){feedback(n,'<p>Not run yet: fix the items under <em>Problems</em> first. Nothing was counted.</p>');return;}
  var r=cfg.check(report,SQLCHK)||{},done=r.done||{},all=true;
  if(!s.completed){s.g={};} /* ticks show the current run until the activity is completed */
  cfg.goals.forEach(function(g){if(done[g]){s.g[g]=1;}if(!done[g]){all=false;}});
  (r.notes||[]).forEach(function(t){m.push(t);});
  if(!s.completed){s.attempts++;
    if(all){m.push('<strong>All checks done.</strong>'+nextNote(n));complete(n,1);}
    else if(s.attempts>=2){m.push('<strong>Settled after two tries: not passed, so no credit yet.</strong> Compare Output with the checks, open the hints for the next reasoning step, and keep practising here; a later run that passes every check still completes it.'+nextNote(n));settle(n);}
    else{m.push('One more try before this activity settles; the hints give the next reasoning step.');render();}}
  else{if(all){m.push('<strong>All checks now pass.</strong> Your earlier result for this activity stands.');}render();}
  feedback(n,'<p>'+m.join(' ')+'</p>');
}

/* Apply check with confidence, one retry, then the answer. */
function markOpts(set,chosen){qa('input',$(set.fs)).forEach(function(i){var l=optLabel(i);i.disabled=true;
  if(i.value===set.correct&&chosen===set.correct){l.classList.add('right');}
  if(i.value===chosen&&chosen!==set.correct){l.classList.add('wrong');}});}
function badges(ok,mine){return '<span class="badges">'+(mine?'<span class="badge me">Your answer</span>':'')+(ok?'<span class="badge ok">Correct</span>':'<span class="badge no">Not correct</span>')+'</span>';}
function annotate(set,chosen){qa('input',$(set.fs)).forEach(function(i){var sp=optLabel(i).querySelector('span');var w=d.createElement('span');w.className='why';
  w.innerHTML=badges(i.value===set.correct,i.value===chosen)+set.why[i.value];sp.appendChild(w);});}
function explainList(set){var html='<ul>';Object.keys(set.why).forEach(function(k){var i=qa('input[value="'+k+'"]',$(set.fs))[0];
  html+='<li><strong>'+(k===set.correct?'Correct: ':'Not this: ')+'</strong><span class="on">'+esc(optLabel(i).textContent.trim())+'</span>: '+set.why[k]+'</li>';});return html+'</ul>';}
function confText(s){return '<p class="conf-report" data-pep-confidence-report>Your confidence: '+esc(s.conf)+' (reported to you, never graded).</p>';}
function applyN(){return +$('apply-a').closest('[data-pep-activity]').id.split('-')[1];}
function focusVerdict(n){var v=section(n).querySelector('[data-pep-feedback] .verdict');if(v){v.setAttribute('tabindex','-1');v.focus();}}
function checkApply(which){var A=TOPIC.apply.A,B=TOPIC.apply.B,n=applyN(),s=act(n);
  if(s.completed||s.settled){return;}
  if(which==='a'){var ch=checked('apply-a');s.conf=checked('conf');if(!ch||!s.conf){return;}
    s.attempts=1;s.tries=1;qa('input[name="conf"]').forEach(function(i){i.disabled=true;});$('apply-check').disabled=true;markOpts(A,ch);
    if(ch===A.correct){annotate(A,ch);$('apply-check').hidden=true;feedback(n,'<p class="verdict ok">Correct.</p>'+A.okNote+'<p>Each option is explained in the list.</p>'+confText(s)+'<p>'+nextNote(n)+'</p>');complete(n,1);focusVerdict(n);return;}
    s.firstPick=optLabel(qa('input[name="apply-a"][value="'+ch+'"]')[0]).textContent.trim();
    feedback(n,'<p class="verdict no">Not yet. Try once more with the same idea shown a different way.</p><p>Your first answer, <span class="on">'+esc(s.firstPick)+'</span>: '+A.miss[ch]+'</p><p>'+A.hint+'</p>'+confText(s));
    qa('[data-retry]',section(n)).forEach(function(x){x.hidden=false;});qa('[data-first]',section(n)).forEach(function(x){x.hidden=true;});
    render();$('task-apply-b').focus();
  }else{var c2=checked('apply-b');if(!c2||s.tries!==1){return;}
    s.attempts=2;s.tries=2;$('apply-check-b').hidden=true;markOpts(B,c2);annotate(B,c2);
    var details='<details><summary>First question: every option explained</summary>'+explainList(A)+'</details>';
    if(c2===B.correct){feedback(n,'<p class="verdict ok">Correct on the second try.</p><p>Each option is explained in the list.</p>'+details+confText(s)+'<p>'+nextNote(n)+'</p>');complete(n,1);}
    else{qa('input',$(B.fs)).forEach(function(i){if(i.value===B.correct){optLabel(i).classList.add('right');}});
      feedback(n,'<p class="verdict set">Answered, not marked correct: settled, no penalty.</p><p>'+B.reveal+' Each option is explained in the list.</p>'+details+confText(s)+'<p>'+nextNote(n)+'</p>');settle(n);}
    focusVerdict(n);}
}
function syncButtons(){var pf=$('predict-fs'),af=$('apply-a');
  if(pf){var p=act(+pf.closest('[data-pep-activity]').id.split('-')[1]);if(!p.completed){$('predict-check').disabled=!(checked('predict')&&checked('pconf'));}}
  if(af){var a=act(applyN());if(!a.completed&&a.tries===0){$('apply-check').disabled=!(checked('apply-a')&&checked('conf'));}
    if(!a.completed&&a.tries===1){$('apply-check-b').disabled=!checked('apply-b');}}}

/* Restart: only the current activity returns to its authored start; the frontier, required time and every other
   activity stay exactly as they are. Page completion and the recap follow current activity state, so a restarted
   activity reads incomplete until it is finished again. Re-completion earns one credit again, never a second. */
function restart(){var n=S.current;
  S.a[n-1]=blank();
  summarize();
  var box=section(n).querySelector('[data-restore]');if(box){box.innerHTML=SNAP[box.getAttribute('data-restore')];}
  if(editors[n]){editors[n].set(TOPIC.sql[n].starter);}
  if(kind(n)==='apply'){$('task-apply-b').hidden=true;}
  qa('details.pep-optional',section(n)).forEach(function(x){x.open=false;});
  feedback(n,'');render();
  var h=section(n).querySelector('h2[tabindex]');if(h){h.focus();}
}

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
});
d.addEventListener('change',syncButtons);

/* Objectives: a native disclosure; Escape or a click outside closes it. */
var obj=d.querySelector('[data-pep-objectives]'),objSum=obj.querySelector('summary');
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&obj.open){obj.open=false;objSum.focus();}});
d.addEventListener('click',function(e){if(obj.open&&!obj.contains(e.target)){obj.open=false;}});

var printOpened=[];
addEventListener('beforeprint',function(){printOpened=qa('details:not([open])',main);printOpened.forEach(function(x){x.open=true;});});
addEventListener('afterprint',function(){printOpened.forEach(function(x){x.open=false;});printOpened=[];});

Object.keys(TOPIC.sql).forEach(function(k){var n=+k,cfg=TOPIC.sql[k],root=$('ed'+n);
  try{editors[n]=LESSON_EDITOR.mount(root,{adapter:LESSON_EDITOR_SQL,file:cfg.file,starter:cfg.starter,calls:cfg.tables||SQL_TABLES,fallbackText:cfg.fallback,onRun:function(rep,code){onSqlRun(n,rep,code);}});}
  catch(e){feedback(n,'<p>The editor could not start; the static exercise text still describes the task.</p>');}});
var start=fromHash();
go(start>=1&&start<=S.unlocked?start:1,'replace',false);
})();
