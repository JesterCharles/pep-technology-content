d.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b){return;}
  if(b.id==='reset'){restart();return;}
  if(b.id==='next'){show(S.step+1);return;}
  if(b.id==='predict-check'){checkPredict();return;}
  if(b.id==='apply-check'){checkApply('a');return;}
  if(b.id==='apply-check-b'){checkApply('b');return;}
  if(b.classList.contains('runbtn')){runTerminal(b.closest('.cmdline'));return;}
  var a=b.getAttribute('data-act');if(a&&TOPIC.act){TOPIC.act(a,b,S,api);}
});
d.addEventListener('change',function(e){syncApply();if(TOPIC.change){TOPIC.change(e.target,S,api);}});
var HIST={};
function prompt(){return TOPIC.prompt?TOPIC.prompt(S):'$';}
function syncPrompt(){qa('.cmdline .pr').forEach(function(n){n.textContent=prompt();});}
function runTerminal(box){
  if(!box){return;}var inp=box.querySelector('input[type="text"]');if(!inp||inp.disabled){return;}
  var line=inp.value,H=HIST[inp.id]||(HIST[inp.id]={l:[],i:0});if(line.trim()){H.l.push(line);}H.i=H.l.length;
  var p=prompt();inp.value='';TOPIC.run(line,box.getAttribute('data-term'),S,api);
  qa('.log .c:not([data-p])').forEach(function(n){n.setAttribute('data-p',p);});syncPrompt();inp.focus();}
d.addEventListener('keydown',function(e){var t=e.target;if(!t.closest||!t.closest('.cmdline')||t.tagName!=='INPUT'){return;}
  var H=HIST[t.id]||(HIST[t.id]={l:[],i:0});
  if(e.key==='Enter'&&!e.isComposing){e.preventDefault();runTerminal(t.closest('.cmdline'));}
  else if(e.key==='ArrowUp'){if(!H.l.length){return;}e.preventDefault();H.i=Math.max(0,H.i-1);t.value=H.l[H.i];}
  else if(e.key==='ArrowDown'){if(!H.l.length){return;}e.preventDefault();H.i=Math.min(H.l.length,H.i+1);t.value=H.l[H.i]||'';}
  else if(e.key==='Tab'&&!e.shiftKey&&!e.altKey&&!e.ctrlKey&&!e.metaKey){
    // capture Tab only when a completion actually changes the line, so Tab never traps focus
    var v=t.value.trim()&&TOPIC.complete?TOPIC.complete(t.value,S):null;if(v&&v!==t.value){e.preventDefault();t.value=v;}}
  else if(e.key==='Escape'){var tk=$('task-'+S.step);if(tk){e.preventDefault();tk.setAttribute('tabindex','-1');tk.focus();}}
});
