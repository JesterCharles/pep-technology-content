/* lesson-editor shell, version 1. Language-neutral editor chrome and behaviour: gutter, Problems and Output
   panels, status bar, Run (button, Enter or Space on the button, Ctrl+Enter or Cmd+Enter in the code),
   Reset, keyboard model and live announcements. All language behaviour comes from an adapter object.
   No form submission, no storage, no network, no timers beyond a short input debounce. */
var LESSON_EDITOR=(function(){
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function plural(n,w){return n+' '+w+(n===1?'':'s');}
function mount(root,cfg){
  var A=cfg.adapter,q=function(s){return root.querySelector(s);};
  var ta=q('.le-code'),gut=q('.le-gutter'),probList=q('.le-problems ul'),outEl=q('.le-output pre'),stat=q('.le-status'),pos=q('.le-pos'),cnt=q('.le-count'),live=q('.le-live'),runBtn=q('.le-run'),resetBtn=q('.le-reset');
  var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
  var escArmed=false,last={problems:[]},timer=null,broken=false;
  root.setAttribute('data-le-state','ready');
  function fail(where,e){broken=true;root.setAttribute('data-le-state','error');
    outEl.textContent='The editor hit an internal error while '+where+', so nothing was run. The exercise still stands: '+(cfg.fallbackText||'')+(e&&e.message?'\n('+e.message+')':'');
    select(1);live.textContent='Editor error; see Output.';}
  function lines(){return ta.value.split('\n').length;}
  function paintGutter(){var n=lines(),bad={};last.problems.forEach(function(p){if(!bad[p.line]||p.kind==='error'){bad[p.line]=p.kind;}});var h='';for(var i=1;i<=n;i++){h+='<span'+(bad[i]?' class="g-'+bad[i]+'"':'')+'>'+i+'</span>\n';}gut.innerHTML=h;gut.scrollTop=ta.scrollTop;}
  function caret(){var v=ta.value.slice(0,ta.selectionStart).split('\n');pos.textContent='Ln '+v.length+', Col '+(v[v.length-1].length+1);}
  function paintProblems(){var ps=last.problems,L=A.kindLabels;
    probList.innerHTML=ps.length?ps.map(function(p){return '<li class="p-'+p.kind+'"><button type="button" class="le-jump" data-line="'+p.line+'" data-col="'+p.col+'"><span class="le-ln">Ln '+p.line+'</span> <span class="le-kind">'+esc(L[p.kind]||p.kind)+'</span> '+esc(p.msg)+'</button></li>';}).join(''):'<li class="p-none">No problems found by the lesson checker.</li>';
    var e=ps.filter(function(p){return p.kind==='error';}).length;
    cnt.textContent=plural(e,'error')+', '+plural(ps.length-e,'simulator note');
    tabs[0].textContent='Problems ('+ps.length+')';}
  function analyse(){if(broken){return last;}try{last=A.check(ta.value);}catch(e){fail('checking the code',e);return last;}paintProblems();paintGutter();return last;}
  function select(i,focus){tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;root.querySelector('#'+t.getAttribute('aria-controls')).hidden=!on;});if(focus){tabs[i].focus();}}
  function disarm(){escArmed=false;stat.removeAttribute('data-esc');}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(i);});
    t.addEventListener('keydown',function(e){var k=e.key,n=tabs.length;
      if(k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();select((i+(k==='ArrowRight'?1:n-1))%n,true);}
      else if(k==='Home'){e.preventDefault();select(0,true);}else if(k==='End'){e.preventDefault();select(n-1,true);}});});
  probList.addEventListener('click',function(e){var b=e.target.closest('.le-jump');if(!b){return;}
    var ln=+b.getAttribute('data-line'),col=+b.getAttribute('data-col'),ls=ta.value.split('\n'),off=0;
    for(var i=0;i<ln-1&&i<ls.length;i++){off+=ls[i].length+1;}off+=Math.max(0,Math.min(col-1,(ls[ln-1]||'').length));
    ta.focus();ta.setSelectionRange(off,off);caret();});
  ta.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();disarm();doRun();return;}
    if(e.key==='Escape'){escArmed=true;stat.setAttribute('data-esc','1');return;}
    if(e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){if(escArmed){disarm();return;}
      e.preventDefault();var s=ta.selectionStart,v=ta.value,ls=v.lastIndexOf('\n',s-1)+1;
      if(e.shiftKey){var lead=/^ {0,4}/.exec(v.slice(ls))[0].length;if(lead){ta.value=v.slice(0,ls)+v.slice(ls+lead);var c=Math.max(ls,s-lead);ta.setSelectionRange(c,c);}}
      else{ta.setRangeText('    ',s,ta.selectionEnd,'end');}
      changed();return;}
    if(escArmed){disarm();}});
  function changed(){caret();paintGutter();clearTimeout(timer);timer=setTimeout(analyse,250);if(cfg.onChange){cfg.onChange(ta.value);}}
  ta.addEventListener('input',changed);
  ta.addEventListener('blur',disarm);
  ta.addEventListener('scroll',function(){gut.scrollTop=ta.scrollTop;});
  ['keyup','click','focus'].forEach(function(ev){ta.addEventListener(ev,caret);});
  function doRun(){if(broken){return null;}clearTimeout(timer);var a=analyse();if(broken){return null;}
    var rep;try{var stop=a.problems.filter(function(p){return p.kind!=='hint';}).length;rep=stop?A.notRun(a.problems):A.run(a.program,cfg.calls);}catch(e){fail('running the code',e);return null;}
    rep.problems=a.problems;
    outEl.textContent=['$ lesson-run '+cfg.file+'   (lesson simulator, not real '+A.language+')'].concat(rep.lines).join('\n');
    select(rep.status==='syntax'||rep.status==='limit'?0:1);
    live.textContent='';var msg=rep.summary;setTimeout(function(){live.textContent=msg;},30);
    if(cfg.onRun){cfg.onRun(rep,ta.value);}return rep;}
  runBtn.addEventListener('click',function(){doRun();});
  resetBtn.addEventListener('click',function(){set(cfg.starter);if(cfg.onChange){cfg.onChange(ta.value);}live.textContent='Code reset to the starting version.';});
  function set(v){ta.value=v;outEl.textContent='Press Run (or Ctrl+Enter in the editor) to check this file with the lesson simulator.';analyse();caret();select(0);}
  try{set(cfg.initial==null?cfg.starter:cfg.initial);}catch(e){fail('starting',e);}
  return {set:set,run:doRun,value:function(){return ta.value;}};}
return {id:'lesson-editor',version:'1',mount:mount};
})();
