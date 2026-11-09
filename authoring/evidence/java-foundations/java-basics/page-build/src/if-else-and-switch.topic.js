var TOPIC=(function(){
var RUNGS={a:{min:90,g:'A'},b:{min:80,g:'B'},d:{min:60,g:'D'}};
var TESTS=[[95,'A'],[85,'B'],[65,'D'],[40,'F']];
var MEDALS=['Bronze','Silver','Gold'];
function grade(order,s){for(var i=0;i<order.length;i++){var r=RUNGS[order[i]];if(s>=r.min){return {g:r.g,at:i};}}return {g:'F',at:order.length};}
function swRun(brk,lv){var out=[],lines=[],start=lv-1;if(start<0||start>2){return {out:out,lines:lines};}for(var i=start;i<3;i++){out.push(MEDALS[i]);lines.push(i);if(brk[i]){break;}}return {out:out,lines:lines};}
return {
steps:5,acts:['predict','ladder','switch','apply'],
init:function(){return {order:['d','a','b'],lv:1,brk:[false,false,false],g:{}};},
predict:{correct:'b',why:{
 a:'there is no break after Silver, so execution falls through into case 3.',
 b:'Java jumps to case 2, prints Silver, then falls through and prints Gold.',
 c:'case 1 comes before the matching label, so it never runs.',
 d:'case 2 matches level 2, so its line runs.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>Arrow labels, a semicolon after each value, and <code>default</code> so every input gives a value.</p>',
  why:{a:'arrows, semicolons and a default: every input yields a String.',b:'without default it does not compile: the switch expression does not cover all possible input values.',c:'a colon label cannot just name a value; a switch expression with colons needs yield.',d:'each arrow branch value needs a semicolon after it.'},
  miss:{b:'Without <code>default</code>, sizes other than 1 and 2 have no value, so the compiler rejects it.',c:'With colon labels, a bare value such as <code>"S";</code> is not a statement; this does not compile.',d:'Each <code>case ... -&gt; value</code> needs a semicolon after its value.'},
  hint:'A switch expression must give a value for every possible input.'},
 B:{fs:'apply-b',correct:'b',reveal:'size 3 matches case 2, 3, so the switch yields "M".',
  why:{a:'3 does not match case 1.',b:'case 2, 3 lists both values, so 3 matches it.',c:'default is only used when no case matches.',d:'arrow labels never fall through, so only one value is yielded.'}}},
act:function(a,b,S,api){var t=S.t,msg;
 if(/^mv-/.test(a)&&!S.done.ladder){var p=a.split('-'),i=+p[2],j=p[1]==='up'?i-1:i+1;if(j<0||j>2){return;}var o=t.order,x=o[i];o[i]=o[j];o[j]=x;
  var res=TESTS.map(function(tc){return grade(o,tc[0]).g===tc[1];}),bad=TESTS.filter(function(tc,k){return !res[k];});
  if(!bad.length){api.say('<p class="verdict ok">Every score gets its expected grade.</p><p>The highest threshold comes first, so each score stops at the narrowest branch that fits.</p>');api.qa('#ladder button').forEach(function(x){x.disabled=true;});api.complete('ladder');}
  else{var tc=bad[0],gg=grade(o,tc[0]);api.say('<p>'+bad.length+' of 4 tests still wrong.</p><p>'+api.esc('Score '+tc[0]+' stops at the first true branch and gets '+gg.g+', not '+tc[1]+'.')+'</p>');}
  this.render(S,api);var f=api.qa('#ladder button[data-act="'+a.replace(/-\d$/,'-'+j)+'"]')[0]||api.qa('#ladder button:not([disabled])')[0];if(f){f.focus();}return;}
 if(/^brk-/.test(a)&&!S.done['switch']){var k=+a.slice(4);t.brk[k]=!t.brk[k];}
 if(a==='lv-up'){t.lv=Math.min(4,t.lv+1);}if(a==='lv-dn'){t.lv=Math.max(1,t.lv-1);}
 if(/^(brk-|lv-)/.test(a)){var r=swRun(t.brk,t.lv),only=r.out.length===1;
  t.g={};if(swRun(t.brk,1).out.length===1){t.g.l1=1;}if(swRun(t.brk,2).out.length===1){t.g.l2=1;}
  if(t.lv===4){msg='level 4 matches no case, so nothing prints: this switch has no default.';}
  else if(only){msg='level '+t.lv+' prints only '+r.out[0]+(t.lv===3?': it is the last case, so there is nothing to fall into.':': the break stops it.');}
  else{msg='level '+t.lv+' falls through: '+r.out.join(', ')+'. A break after its println would stop it.';}
  var left=['l1','l2'].filter(function(k){return !t.g[k];}).length;
  api.say('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 2 goals open. Change the level to see each output.':'<strong>Both goals met.</strong> In arrow form, case 1 -&gt; ... needs no break: arrow labels never fall through.')+'</p>');
  if(!left&&!S.done['switch']){api.complete('switch');}
  this.render(S,api);if(b&&b.isConnected){b.focus();}else{var f2=api.qa('#swcode [data-act="'+a+'"]')[0];if(f2){f2.focus();}}}},
render:function(S,api){var t=S.t,me=this;
 function codeLine(list,txt,ran,extra){var li=document.createElement('li');var sp=document.createElement('span');sp.textContent=txt;li.appendChild(sp);if(ran){li.className='ran';var v=document.createElement('span');v.className='vh';v.textContent=' (runs)';li.appendChild(v);}if(extra){li.appendChild(extra);}list.appendChild(li);return li;}
 var ld=api.$('ladder');if(ld){while(ld.firstChild){ld.removeChild(ld.firstChild);}
  t.order.forEach(function(k,i){var r=RUNGS[k],mv=document.createElement('span');mv.className='mv';
   [['up','↑','Move up'],['dn','↓','Move down']].forEach(function(d){var bt=document.createElement('button');bt.type='button';bt.className='ghost';bt.setAttribute('data-act','mv-'+d[0]+'-'+i);bt.setAttribute('aria-label',d[2]+': score >= '+r.min);bt.textContent=d[1];if(S.done.ladder||(d[0]==='up'&&i===0)||(d[0]==='dn'&&i===2)){bt.disabled=true;}mv.appendChild(bt);});
   codeLine(ld,(i?'else if':'if')+' (score >= '+r.min+') grade = "'+r.g+'";',false,mv);});
  codeLine(ld,'else grade = "F";',false);
  var tb=api.$('tests');while(tb.firstChild){tb.removeChild(tb.firstChild);}
  TESTS.forEach(function(tc){var tr=document.createElement('tr'),gg=grade(t.order,tc[0]).g,ok=gg===tc[1];[String(tc[0]),tc[1],gg+(ok?' ✓ matches':' ✗ wrong')].forEach(function(c,i){var td=document.createElement('td');td.textContent=c;if(i===2){td.className=ok?'ok':'no';}tr.appendChild(td);});tb.appendChild(tr);});}
 var sc=api.$('swcode');if(sc){while(sc.firstChild){sc.removeChild(sc.firstChild);}var r=swRun(t.brk,t.lv);
  codeLine(sc,'switch (level) {',false);
  MEDALS.forEach(function(m,i){codeLine(sc,'    case '+(i+1)+':',false);var bt=document.createElement('button');bt.type='button';bt.className='ghost brk';bt.setAttribute('data-act','brk-'+i);bt.setAttribute('aria-pressed',t.brk[i]?'true':'false');bt.textContent=t.brk[i]?'break; added':'add break;';if(S.done['switch']){bt.disabled=true;}
   codeLine(sc,'        System.out.println("'+m+'");'+(t.brk[i]?'\n        break;':''),r.lines.indexOf(i)>=0,bt);});
  codeLine(sc,'}',false);api.$('lv').textContent=t.lv;var o=api.$('swout');o.textContent=r.out.length?r.out.join('\n'):'(nothing printed)';}
 var mc=api.$('model-code');while(mc.firstChild){mc.removeChild(mc.firstChild);}
 if(S.step===2){api.$('model-title').textContent='Score 95 with the current order';var g95=grade(t.order,95);t.order.forEach(function(k,i){codeLine(mc,(i?'else if':'if')+' (score >= '+RUNGS[k].min+')',i===g95.at);});codeLine(mc,'else',g95.at===3);api.$('model-note').textContent='Java tests from the top and stops at the first true condition: 95 gets '+g95.g+'.';}
 else if(S.step===3){api.$('model-title').textContent='Arrow form of the same switch';MEDALS.forEach(function(m,i){codeLine(mc,'case '+(i+1)+' -> System.out.println("'+m+'");',t.lv===i+1);});api.$('model-note').textContent='Arrow labels run one branch only, so level '+t.lv+' prints '+(t.lv<=3?MEDALS[t.lv-1]:'nothing')+' with no break needed.';}
 else{api.$('model-title').textContent='The code';api.$('model-note').textContent='The ordering and switch activities highlight the lines that run.';}
 api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!t.g[k]);li.querySelector('.st').textContent=t.g[k]?'done':'open';});}
};})();
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"ladder":["order"],"switch":["lv","brk"]};
