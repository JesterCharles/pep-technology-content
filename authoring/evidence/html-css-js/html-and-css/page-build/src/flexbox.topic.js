var TOPIC=(function(){
var SETUPS=[{g:[1,2,0],s:[1,1,1],b:[50,50,50],ask:1,want:150,why:'leftover 300 - 150 = 150px; grow 1, 2 and 0 split it 50px and 100px, so B is 50 + 100 = 150px.'},
 {g:[1,1,1],s:[1,1,1],b:[100,100,100],ask:0,want:100,why:'the bases already fill 300px, so there is no leftover to grow into: A stays at 100px.'},
 {g:[0,0,0],s:[1,1,0],b:[150,150,150],ask:0,want:75,why:'the bases need 450px, 150px too many. C has flex-shrink 0, so A and B give up 75px each: A is 75px.'}];
var NM=['A','B','C'];
function kebab(k){return k.replace(/[A-Z]/g,function(c){return '-'+c.toLowerCase();});}
function cssText(sel,o){return sel+' {\n'+Object.keys(o).map(function(k){return '  '+kebab(k)+': '+o[k]+';';}).join('\n')+'\n}';}
function R(e){return e.getBoundingClientRect();}
function inner(c){var r=R(c);return {l:r.left+c.clientLeft,t:r.top+c.clientTop,w:c.clientWidth,h:c.clientHeight};}
function near(a,b){return Math.abs(a-b)<1.5;}
function apply1(api,t){var c=api.$('fx1');c.style.display=t.s1.display;c.style.flexDirection=t.s1.flexDirection;}
function apply2(api,t){var c=api.$('fx2');c.style.display='flex';c.style.justifyContent=t.s2.justifyContent;c.style.alignItems=t.s2.alignItems;c.style.gap=t.s2.gap;}
function apply3(api,i){var s=SETUPS[i],c=api.$('fx3');c.style.display='flex';NM.forEach(function(n,k){var e=api.$('fi-'+n.toLowerCase());e.style.flex=s.g[k]+' '+s.s[k]+' '+s.b[k]+'px';});}
function goals1(api,t){var cs=api.qa('#fx1 .card').map(R);var flex=getComputedStyle(api.$('fx1')).display==='flex';
 var row=near(cs[0].top,cs[1].top)&&near(cs[1].top,cs[2].top)&&cs[0].right<=cs[1].left+1&&cs[1].right<=cs[2].left+1;
 var col=flex&&cs[0].bottom<=cs[1].top+1&&cs[1].bottom<=cs[2].top+1;return {row:row,col:col,flex:flex};}
function goals2(api){var c=api.$('fx2'),I=inner(c),bs=api.qa('#fx2 .badge2').map(R);var natural=bs.every(function(b){return b.height<I.h-4;});
 var gl=bs[0].left,gr=bs[2].right,cx=I.l+I.w/2,cy=I.t+I.h/2;
 var center=natural&&near((gl+gr)/2,cx)&&bs.every(function(b){return near((b.top+b.bottom)/2,cy);});
 var pack=natural&&near(bs[0].left,I.l)&&bs.every(function(b){return near(b.top,I.t);})&&near(bs[1].left-bs[0].right,16)&&near(bs[2].left-bs[1].right,16);
 return {center:center,pack:pack,natural:natural};}
return {
steps:6,acts:['predict','direction','align','space','apply'],
init:function(){return {s1:{display:'block',flexDirection:'row'},s2:{justifyContent:'flex-start',alignItems:'stretch',gap:'0px'},g1:{},g2:{},si:0};},
predict:{correct:'a',why:{
 a:'leftover is 600 - 300 = 300px, and B is the only item that grows, so B is 100 + 300 = 400px.',
 b:'that splits the leftover over all three items, but A and C have flex-grow 0 and keep their 100px.',
 c:'300px is the leftover alone; B also keeps its own 100px basis.',
 d:'B would stay at its basis only if its flex-grow were 0.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>Only the field has a grow factor, so it receives all the leftover width; the button keeps its basis.</p>',
  why:{a:'only the field grows, so it takes all the spare width.',b:'space-between moves the button to the far edge, leaving a gap; the field itself does not grow.',c:'align-items works on the cross axis, the height of a row, not the width.',d:'both grow, so they share the spare width and the button gets bigger too.'},
  miss:{b:'<code>space-between</code> distributes the spare space as a gap between items. Nothing grows, so the field stays narrow.',c:'<code>align-items</code> works across the row, on height. Width is the main axis.',d:'With <code>flex-grow: 1</code> on both, the spare width is shared between them, so the button grows too.'},
  hint:'Leftover width goes to items in proportion to flex-grow. Which items should get any?'},
 B:{fs:'apply-b',correct:'a',reveal:'Give the field <code>flex-grow: 1</code> and leave the button at <code>flex-grow: 0</code>: the field takes all the leftover width.',
  why:{a:'that is flex-grow 1 on the field only.',b:'that is flex-grow 1 on both.',c:'that is justify-content: space-between.',d:'that is align-items: stretch, which is about height.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('axes').style.display=(st===1||st>=5)?'':'none';
 ['fx1','fx2','fx3'].forEach(function(id,i){api.$(id).hidden=(st!==i+2);});
 var out=api.$('css-out');out.hidden=!(st>=2&&st<=4);var fo=api.$('fx-out');fo.textContent='';
 if(st===2){apply1(api,t);out.textContent=cssText('.cards',t.s1);var g=goals1(api,t);
  api.qa('[data-act^="set:1:"]').forEach(function(b){var p=b.getAttribute('data-act').split(':');b.setAttribute('aria-pressed',t.s1[p[2]]===p[3]?'true':'false');});
  fo.textContent='Measured: '+(g.row?'cards side by side, in source order':(g.col?'cards stacked, flex on':'cards '+(R(api.qa('#fx1 .card')[0]).top<R(api.qa('#fx1 .card')[1]).top-1?'stacked':'side by side, reversed'))+(g.flex?'':', flex off'))+'.';}
 if(st===3){apply2(api,t);out.textContent=cssText('.badges',{display:'flex',justifyContent:t.s2.justifyContent,alignItems:t.s2.alignItems,gap:t.s2.gap});
  api.qa('[data-act^="set:2:"]').forEach(function(b){var p=b.getAttribute('data-act').split(':');b.setAttribute('aria-pressed',t.s2[p[2]]===p[3]?'true':'false');});
  var g2=goals2(api);fo.textContent='Measured: '+(g2.natural?'badges keep their own height':'badges stretched to the full 120px height')+(g2.center?', centred both ways':'')+(g2.pack?', packed top left with 16px gaps':'')+'.';}
 if(st===4){var i=Math.min(t.si,2),s=SETUPS[i];apply3(api,i);out.textContent='.box { display: flex; width: 300px; }\n'+NM.map(function(n,k){return '.'+n.toLowerCase()+' { flex: '+s.g[k]+' '+s.s[k]+' '+s.b[k]+'px; }';}).join('\n');
  var lg=api.$('fs-setup');if(lg){lg.textContent='Setup '+(i+1)+': predict the width of item '+NM[s.ask];api.$('fw-label').textContent='Predicted width of '+NM[s.ask]+' (px)';api.$('fs-count').textContent=t.si>=3?'All three setups done':'Setup '+(t.si+1)+' of 3';}
  api.qa('#fx3 .fi').forEach(function(e){e.style.visibility=t.reveal?'visible':'hidden';});fo.textContent=t.reveal?'Measured widths: '+NM.map(function(n){return n+' '+Math.round(R(api.$('fi-'+n.toLowerCase())).width)+'px';}).join(', ')+'.':'Items hidden until you measure, so the layout does not give the answer away.';}
 ['row','col'].forEach(function(k){var li=api.$('g1-'+k);if(li){li.classList.toggle('done',!!t.g1[k]);li.querySelector('.st').textContent=t.g1[k]?'done':'not yet';}});
 ['center','pack'].forEach(function(k){var li=api.$('g2-'+k);if(li){li.classList.toggle('done',!!t.g2[k]);li.querySelector('.st').textContent=t.g2[k]?'done':'not yet';}});
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='set'&&p[1]==='1'){t.s1[p[2]]=p[3];this.render(S,api);var g=goals1(api,t);var msg;
  if(g.row&&!t.g1.row){t.g1.row=true;msg='<p class="verdict ok">Goal 1 done: side by side, in source order.</p><p><code>display: flex</code> with the default <code>flex-direction: row</code> puts the items on one horizontal main axis.</p>';}
  else if(g.col&&!t.g1.col){t.g1.col=true;msg='<p class="verdict ok">Goal 2 done: stacked with flex.</p><p><code>flex-direction: column</code> turns the main axis vertical.</p>';}
  else if(!g.flex&&t.s1.flexDirection!=='row'){msg='<p class="verdict no">flex-direction is set, but nothing changed.</p><p>Without <code>display: flex</code>, <code>flex-direction</code> does nothing; these cards are plain blocks.</p>';}
  else if(g.flex&&t.s1.flexDirection==='row-reverse'){msg='<p class="verdict no">Side by side, but in reverse order.</p><p><code>row-reverse</code> runs the main axis right to left. Goal 1 asks for source order.</p>';}
  else if(!g.flex){msg='<p>Plain blocks stack because each takes the full width. Goal 2 asks for stacking with flex on.</p>';}
  else{msg='<p>Layout updated.</p>';}
  this.render(S,api);if(t.g1.row&&t.g1.col&&!S.done.direction){api.complete('direction');msg+='<p>Both goals met.</p>';}api.say(msg);}
 if(p[0]==='set'&&p[1]==='2'){t.s2[p[2]]=p[3];this.render(S,api);var h=goals2(api),m;
  if(h.center&&!t.g2.center){t.g2.center=true;m='<p class="verdict ok">Goal 1 done: centred both ways.</p><p><code>justify-content: center</code> centres along the row; <code>align-items: center</code> centres across it.</p>';}
  else if(h.pack&&!t.g2.pack){t.g2.pack=true;m='<p class="verdict ok">Goal 2 done: packed top left, 16px apart.</p><p><code>gap</code> adds space only between neighbours, never at the edges.</p>';}
  else if(!h.natural){m='<p>The badges fill the full height: that is <code>align-items: stretch</code>, the default.</p>';}
  else if(t.s2.justifyContent==='space-between'){m='<p><code>space-between</code> pushes the first and last badges to the edges, so the space between them is no longer 16px.</p>';}
  else{m='<p>Layout updated.</p>';}
  this.render(S,api);if(t.g2.center&&t.g2.pack&&!S.done.align){api.complete('align');m+='<p>Both goals met.</p>';}api.say(m);}
 if(p[0]==='fw'){if(t.si>=3){return;}var v=api.$('fw-in').value;if(v===''){api.say('<p class="verdict no">Type your predicted width first.</p>');return;}
  var s=SETUPS[t.si];apply3(api,t.si);var w=Math.round(R(api.$('fi-'+NM[s.ask].toLowerCase())).width);t.reveal=true;var msg3;
  if(+v===w){msg3='<p class="verdict ok">Measured '+w+'px: your prediction matches.</p><p>'+s.why+'</p>';t.si++;t.reveal=false;api.$('fw-in').value='';
   if(t.si>=3){msg3+='<p>All three setups done.</p>';api.$('fw-measure').disabled=true;api.$('fw-in').disabled=true;if(!S.done.space){api.complete('space');}}}
  else{msg3='<p class="verdict no">Measured '+w+'px, not '+api.esc(v)+'px.</p><p>'+s.why+' Type the measured width to confirm it and move on.</p>';}
  api.say(msg3);this.render(S,api);if(t.si<3){api.$('fw-in').focus();}}
}
};})();
