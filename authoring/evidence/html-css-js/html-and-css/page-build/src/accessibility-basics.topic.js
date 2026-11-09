var TOPIC=(function(){
function el(tag,cls,txt){var e=document.createElement(tag);if(cls){e.className=cls;}if(txt!=null){e.textContent=txt;}return e;}
var AUD=[{c:'<img src="sales-chart.png">',d:'A bar chart of monthly sales, the only place the figures appear.',k:'alt',ok:'the chart carries information, so it needs alt text that conveys what the chart tells the reader here, such as the sales trend.',w:{label:'an image is not a form control; what it lacks is alternative text.',trap:'an image takes no keyboard focus, so it cannot trap it.',ok:'with no alt, a screen reader announces only "image" or the file name, and the figures are lost.'}},
 {c:'<img src="divider.png" alt="">',d:'A decorative wavy line between two sections.',k:'ok',ok:'alt="" marks a decorative image, so screen readers skip it; that is correct.',w:{alt:'alt="" is not missing: it deliberately marks the image as decorative.',label:'an image is not a form control.',trap:'an image takes no keyboard focus.'}},
 {c:'<input id="q" placeholder="Search">',d:'A search field with no label element.',k:'label',ok:'a placeholder is not a label, so the field is announced with no purpose.',w:{alt:'alt is for images; a field needs a label.',trap:'Tab moves in and out of a text field normally.',ok:'the placeholder vanishes when typing and is not a name.'}},
 {c:'<button>Subscribe</button>',d:'A native button with visible text.',k:'ok',ok:'its text is its name, and a native button works from the keyboard.',w:{alt:'there is no image here.',label:'a button\'s own text is its name; it needs no label element.',trap:'a native button never traps focus.'}},
 {c:'Date picker widget',d:'When focus enters the calendar, Tab, Shift+Tab and Escape all keep focus inside it.',k:'trap',ok:'focus cannot leave, so a keyboard user is stuck: a keyboard trap.',w:{alt:'nothing here is about images.',label:'naming is not the problem; focus cannot get out.',ok:'a keyboard user can never reach the rest of the page.'}},
 {c:'<a href="/"><img src="logo.png" alt="Acme Books home"></a>',d:'The site logo, used as a link to the home page.',k:'ok',ok:'the alt text gives the link its name, Acme Books home.',w:{alt:'the image has alt text, and it names the link\'s destination.',label:'a link is named by its content, here the image\'s alt text.',trap:'a link never traps focus.'}}];
var LANEN={alt:'Missing alt text',label:'Missing label',trap:'Keyboard trap',ok:'No problem'};
var WALK=[{id:'home',n:'Home link',f:true},{id:'menu',n:'Menu (div with a click handler only)',f:false},{id:'search',n:'Search field, labelled',f:true},{id:'volume',n:'Volume slider widget',f:true,trap:true},{id:'send',n:'Send button',f:true}];
var FAILS=['menu','volume'];
function dlog(api,msg){var l=api.$('dlog');var li=el('li',null,msg);l.appendChild(li);while(l.children.length>4){l.removeChild(l.firstChild);}}
return {
steps:6,acts:['predict','audit','native','walk','apply'],
init:function(){return {ai:0,sorted:[],aKey:false,bKey:false,pos:-1,trapped:false,seen:{},stuckTries:0};},
predict:{correct:'a',why:{
 a:'a div is not focusable, so Tab skips it; role="button" only tells assistive technology what it is and adds no keyboard behavior.',
 b:'ARIA roles change what assistive technology is told, not how the browser behaves; nothing makes the div focusable or respond to keys.',
 c:'that is what happens if you also add tabindex="0": then Tab reaches it, but Enter still fires nothing. Without tabindex, Tab never reaches it.',
 d:'nothing is wired to keys at all, so Enter cannot save even once.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>A native link is focusable, opens with Enter and is announced as a link, with no extra script.</p>',
  why:{a:'native link: focus, Enter and the link role for free.',b:'announced as a link, but a span is still not focusable, so Tab skips it.',c:'Tab reaches it, but Enter does nothing until you write a key handler, and you rebuild a link by hand.',d:'gives a name, which the text already gave, and no behavior.'},
  miss:{b:'<code>role="link"</code> changes the announcement only. The span is still skipped by Tab.',c:'Now Tab reaches it, but Enter does nothing until you write a key handler yourself: that is rebuilding a link by hand.',d:'<code>aria-label</code> only names; the text Pricing already did that. Focus and keys are still missing.'},
  hint:'Ask what each change adds: a name, a role, focus, or key behavior. Which one adds all of them?'},
 B:{fs:'apply-b',correct:'a',reveal:'Use <code>&lt;a href="/pricing"&gt;Pricing&lt;/a&gt;</code>: it is reached by Tab, opened by Enter and announced as a link.',
  why:{a:'that is the native link.',b:'that is role="link" alone.',c:'that is tabindex plus role, still without key behavior.',d:'that is aria-label alone.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('who').hidden=(st===3||st===4);
 api.$('demo').hidden=(st!==3);
 var w=api.$('walk');w.hidden=(st!==4);
 if(st===4){w.innerHTML='';WALK.forEach(function(c,i){var li=el('li','wk'+(t.pos===i?' at':'')+(t.seen[c.id]?' seen':''));li.appendChild(el('span',null,c.n));li.appendChild(el('span','wst',t.pos===i?' ← focus is here':(t.seen[c.id]?' reached':'')));w.appendChild(li);});}
 var an=api.$('aud-name');if(an){var it=AUD[t.ai];an.textContent=it?it.c:'all six sorted';api.$('aud-desc').textContent=it?it.d:'';api.$('aud-count').textContent=t.sorted.length+' of 6 sorted';}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='aud'){if(t.ai>=AUD.length){return;}var it=AUD[t.ai];
  if(p[1]===it.k){t.sorted.push(t.ai);t.ai++;var msg='<p class="verdict ok">'+LANEN[it.k]+'.</p><p>Yes: '+it.ok+'</p>';
   if(t.ai>=AUD.length){msg+='<p>Audit done: one missing alt, one missing label, one keyboard trap, three fine.</p>';api.qa('#aud-btns button').forEach(function(x){x.disabled=true;});if(!S.done.audit){api.complete('audit');}}
   api.say(msg);}
  else{api.say('<p class="verdict no">Not '+LANEN[p[1]]+'.</p><p>'+it.w[p[1]]+' Choose another.</p>');}
  this.render(S,api);}
 if(p[0]==='fixb'){var c=api.qa('input[name="fixb"]:checked')[0];
  if(!t.aKey||!t.bKey){api.say('<p class="verdict no">Try both controls with the keyboard first.</p><p>Tab to control A and press Enter, then Tab to control B and press Enter. '+(t.aKey?'A is done.':'A is still to try.')+' '+(t.bKey?'B is done.':'B is still to try.')+'</p>');return;}
  if(!c){api.say('<p class="verdict no">Choose a fix for control B first.</p>');return;}
  var W={native:'',aria:'aria-pressed makes it a toggle in the announcement, and still adds no key behavior.',tab:'it is already reachable; what it lacks is a response to Enter and Space.',none:'the role told assistive technology it is a button, but you just saw Enter do nothing.'};
  if(c.value==='native'){if(!S.done.native){api.complete('native');}api.say('<p class="verdict ok">Right: replace it with a native button.</p><p>You saw the difference yourself: A answered Enter, B ignored it. A native <code>&lt;button&gt;</code> brings focus, Enter and Space, and the button role, so there is nothing to rebuild.</p>');}
  else{api.say('<p class="verdict no">Not that fix.</p><p>'+W[c.value]+' Choose again.</p>');}}
 if(p[0]==='key'){
  if(p[1]==='tab'){if(t.trapped){t.stuckTries++;}else{var n=t.pos+1;while(n<WALK.length&&!WALK[n].f){n++;}if(n>=WALK.length){n=0;}t.pos=n;t.seen[WALK[n].id]=true;if(WALK[n].trap){t.trapped=true;}}}
  else if(p[1]==='stab'){if(t.trapped){t.stuckTries++;}else{var m=t.pos-1;while(m>=0&&!WALK[m].f){m--;}if(m<0){m=t.pos;}t.pos=m;}}
  else{if(t.trapped){t.stuckTries++;}}
  var at=t.pos>=0?WALK[t.pos]:null;var msg2='<p>'+(at?'Focus: '+api.esc(at.n)+'.':'Focus is at the top of the page.')+'</p>';
  if(p[1]==='tab'&&t.pos===2&&!t.noted){t.noted=true;msg2+='<p>Tab went from Home straight to Search. Something in between was skipped.</p>';}
  if(t.trapped&&t.stuckTries>0){msg2+='<p>Focus did not move: Tab, Shift+Tab and Escape all keep it inside the Volume slider. Send is never reached.</p>';}
  api.say(msg2);this.render(S,api);var kb=api.$(b.id);if(kb){kb.focus();}}
 if(p[0]==='walkcheck'){var ch=api.qa('input[name="fail"]:checked').map(function(i){return i.value;});
  if(!t.trapped){api.say('<p class="verdict no">Walk the page first.</p><p>Press Tab until you have reached as far as focus will go.</p>');return;}
  var miss=FAILS.filter(function(f){return ch.indexOf(f)<0;}),extra=ch.filter(function(f){return FAILS.indexOf(f)<0;});
  if(!miss.length&&!extra.length){if(!S.done.walk){api.complete('walk');}api.say('<p class="verdict ok">Both failures found.</p><p>Menu is unreachable: Tab skipped it, because a div with only a click handler is not focusable. Volume is a keyboard trap: focus went in and never came out, so Send failed only because of the trap; once the trap is fixed, Send works.</p>');}
  else{var L=[];if(miss.indexOf('menu')>=0){L.push('Look again at the step where Tab went from Home straight to Search.');}if(miss.indexOf('volume')>=0){L.push('Where did focus get stuck?');}
   if(extra.indexOf('send')>=0){L.push('Send is a native button; it was never reached only because of the trap before it, so the trap is the failure to fix.');}
   extra.filter(function(x){return x!=='send';}).forEach(function(x){L.push(WALK.filter(function(w){return w.id===x;})[0].n+' was reached and works.');});
   api.say('<p class="verdict no">Not yet.</p><ul>'+L.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>');}}
},
prep:function(api){var A=api.$('demo-a'),B=api.$('demo-b');if(A.getAttribute('data-wired')){return;}A.setAttribute('data-wired','1');
 A.addEventListener('click',function(e){var S=api.S;var kb=e.detail===0;if(kb){S.t.aKey=true;}dlog(api,'A: click fired'+(kb?' from the keyboard':'')+'. Saved.');});
 B.addEventListener('click',function(){dlog(api,'B: click fired from the mouse. Saved.');});
 B.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var S=api.S;S.t.bKey=true;if(e.key===' '){e.preventDefault();}dlog(api,'B: '+(e.key===' '?'Space':'Enter')+' pressed, no click fired. Not saved.');}});}
};})();
