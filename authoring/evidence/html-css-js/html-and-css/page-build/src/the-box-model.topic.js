var TOPIC=(function(){
var RINGS=[{r:4,k:'content',n:'ring 4, the centre holding the text'},{r:1,k:'margin',n:'ring 1, the outermost transparent space'},{r:3,k:'padding',n:'ring 3, just inside the line, where the background shows'},{r:2,k:'border',n:'ring 2, the line'}];
var RW={content:'content is the centre that holds the text or image.',padding:'padding sits between the content and the border, and the background shows through it.',border:'border is the line drawn around the padding.',margin:'margin is the transparent space outside the border.'};
var SETUPS=[{a:30,b:20,flex:false,gap:30,why:'the two positive sibling margins adjoin in block layout, with no border, padding or new formatting context between them, so they collapse into the larger one: 30px.'},{a:30,b:20,flex:true,gap:50,why:'in a flex container the items keep both margins, so 30 + 20 = 50px.'},{a:16,b:16,flex:false,gap:16,why:'two equal margins collapse into one of the same size: 16px, not 32px.'}];
function measureBox(api,sizing,w){var b=api.$('mbox');b.style.boxSizing=sizing;b.style.width=w+'px';return Math.round(b.getBoundingClientRect().width*100)/100;}
function setupGap(api,s){var wr=api.$('mcwrap'),A=api.$('blk-a'),B=api.$('blk-b');wr.style.display=s.flex?'flex':'block';wr.style.flexDirection='column';A.style.margin='0 0 '+s.a+'px';B.style.margin=s.b+'px 0 0';
 return Math.round(B.getBoundingClientRect().top-A.getBoundingClientRect().bottom);}
return {
steps:6,acts:['predict','rings','width','collapse','apply'],
init:function(){return {ri:0,named:[],sizing:'content-box',gc:false,gb:false,si:0,tries:0};},
predict:{correct:'a',why:{
 a:'with the default content-box, width is only the content: 200 + 20 + 20 + 5 + 5 = 250px.',
 b:'200px would be true only with box-sizing: border-box, which this card does not set.',
 c:'padding and border apply on both sides, so each is counted twice.',
 d:'this adds the padding on both sides but forgets the two 5px borders.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>With <code>border-box</code>, the 320px already includes the 20px padding and 2px border on each side.</p>',
  why:{a:'border-box: the width is the whole box, 320px.',b:'content-box adds padding and border: 320 + 40 + 4 = 364px.',c:'276px is the content-box arithmetic; under border-box it renders 276px.',d:'negative margin moves the box or its neighbours; the rendered width is still 364px.'},
  miss:{b:'With the default content-box, padding and border are added on top: 320 + 40 + 4 = 364px.',c:'276 is the right content width for content-box. With border-box, width is the whole box, so this renders 276px.',d:'Margin is outside the box. Changing it never changes the rendered width.'},
  hint:'Decide which box-sizing you are using first, then check whether width includes padding and border.'},
 B:{fs:'apply-b',correct:'a',reveal:'Under content-box, set <code>width: 276px</code>, because 276 + 20 + 20 + 2 + 2 = 320; or use <code>box-sizing: border-box; width: 320px;</code>.',
  why:{a:'content width 276, plus both paddings and both borders: 320.',b:'that is width 320 under content-box: 364.',c:'forgets both borders.',d:'counts padding and border on one side only.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('bm-svg').style.display=(st===3||st===4)?'none':'';api.$('bm-legend').hidden=(st===3||st===4);
 api.qa('#bm-svg rect').forEach(function(r){r.classList.remove('hl');});
 if(st===2&&t.ri<RINGS.length){var rc=api.qa('#bm-svg .r'+RINGS[t.ri].r)[0];if(rc){rc.classList.add('hl');}}
 var rn=api.$('ring-name');if(rn){rn.textContent=t.ri<RINGS.length?RINGS[t.ri].n:'all four named';api.$('ring-count').textContent=t.named.length+' of 4 named';}
 api.$('meas').hidden=(st!==3);api.$('mc').hidden=(st!==4);
 if(st===3){var bc=api.$('bs-content'),bb=api.$('bs-border');if(bc){bc.setAttribute('aria-pressed',t.sizing==='content-box'?'true':'false');bb.setAttribute('aria-pressed',t.sizing==='border-box'?'true':'false');}
  var g1=api.$('g-content'),g2=api.$('g-border');if(g1){g1.querySelector('.st').textContent=t.gc?'done':'not yet';g1.classList.toggle('done',t.gc);g2.querySelector('.st').textContent=t.gb?'done':'not yet';g2.classList.toggle('done',t.gb);}
  var wi=api.$('w-in');var w=wi?+wi.value||0:200;var m=measureBox(api,t.sizing,w);api.$('mout').textContent='box-sizing: '+t.sizing+'; width: '+w+'px; padding 24px; border 6px. Measured rendered width: '+m+'px.';}
 if(st===4){var s=SETUPS[Math.min(t.si,2)];var g=setupGap(api,s);var lg=api.$('mc-setup');if(lg){lg.textContent='Setup '+(Math.min(t.si,2)+1)+': Block A margin-bottom '+s.a+'px, Block B margin-top '+s.b+'px, container display: '+(s.flex?'flex, column':'block');api.$('mc-count').textContent=t.si>=3?'All three setups done':'Setup '+(t.si+1)+' of 3';}
  api.$('mcwrap').style.visibility=t.reveal?'visible':'hidden';api.$('mcout').textContent=t.reveal?'Measured gap: '+g+'px.':'Blocks hidden until you measure, so the layout does not give the answer away.';}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='ring'){if(t.ri>=RINGS.length){return;}var R=RINGS[t.ri];
  if(p[1]===R.k){t.named.push(R.k);t.ri++;var msg='<p class="verdict ok">'+R.k.charAt(0).toUpperCase()+R.k.slice(1)+'.</p><p>Yes: '+RW[R.k]+'</p>';
   if(t.ri>=RINGS.length){msg+='<p>All four named: content, padding, border, margin, from the inside out.</p>';api.qa('#ring-btns button').forEach(function(x){x.disabled=true;});if(!S.done.rings){api.complete('rings');}}
   api.say(msg);}
  else{api.say('<p class="verdict no">Not '+p[1]+'.</p><p>'+RW[p[1]]+' This is '+R.n+'. Choose another.</p>');}
  this.render(S,api);}
 if(p[0]==='bs'){t.sizing=p[1];this.render(S,api);}
 if(p[0]==='measure'){var w=+api.$('w-in').value;if(!(w>=0)){api.say('<p class="verdict no">Type a width in pixels first.</p>');return;}
  var m=measureBox(api,t.sizing,w);this.render(S,api);var ok=Math.abs(m-300)<0.5;var msg2;
  if(ok&&t.sizing==='content-box'){t.gc=true;msg2='<p class="verdict ok">300px under content-box.</p><p>'+w+' + 24 + 24 + 6 + 6 = 300. Now switch to border-box and do it again.</p>';}
  else if(ok){t.gb=true;msg2='<p class="verdict ok">300px under border-box.</p><p>The width is the whole box, so padding and border fit inside: the content shrinks to '+(300-60)+'px.</p>';}
  else{msg2='<p class="verdict no">Measured '+m+'px, not 300px.</p><p>'+(t.sizing==='content-box'?'Under content-box, the browser adds 24 + 24 padding and 6 + 6 border to your width.':'Under border-box, the width is already the whole box.')+'</p>';}
  if(t.gc&&t.gb&&!S.done.width){api.complete('width');msg2+='<p>Both done: the same 300px box needs width 240px under content-box and 300px under border-box.</p>';}
  api.say(msg2);this.render(S,api);}
 if(p[0]==='gap'){if(t.si>=3){return;}var v=api.$('gap-in').value;if(v===''){api.say('<p class="verdict no">Type your predicted gap first.</p>');return;}
  var s=SETUPS[t.si];var g=setupGap(api,s);t.reveal=true;var msg3;
  if(+v===g){msg3='<p class="verdict ok">Measured '+g+'px: your prediction matches.</p><p>'+s.why+'</p>';t.si++;t.reveal=false;api.$('gap-in').value='';
   if(t.si>=3){msg3+='<p>All three setups done.</p>';api.$('gap-measure').disabled=true;api.$('gap-in').disabled=true;if(!S.done.collapse){api.complete('collapse');}}}
  else{msg3='<p class="verdict no">Measured '+g+'px, not '+api.esc(v)+'px.</p><p>'+s.why+' Type the measured gap to confirm it and move on.</p>';}
  api.say(msg3);this.render(S,api);if(t.si<3){api.$('gap-in').focus();}}
},
input:function(el,S,api){if(el.id==='w-in'){this.render(S,api);}}
};})();
