var TOPIC=(function(){
var Q600='@media (min-width: 600px) {\n  .cards { grid-template-columns: 1fr 1fr; }\n}',Q1000='@media (min-width: 1000px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}',QMAX='@media (max-width: 1000px) {\n  .cards { grid-template-columns: 1fr 1fr; }\n}';
var WIDTHS=[360,600,1000],WANT=[1,2,3];
var FIX={img:'.hero svg { max-width: 100%; height: auto; }',side:'.sidebar { width: auto; }',url:'.url { overflow-wrap: anywhere; }',hide:'body { overflow-x: hidden; }'};
var OBODY='<div class="hero"><svg viewBox="0 0 600 120" role="img" aria-label="Hero picture placeholder"><rect width="600" height="120"/><text x="20" y="66" font-size="28">Hero picture, 600 by 120</text></svg></div><div class="sidebar">Sidebar: related links</div><p class="url">https://example.com/a/very/long/address/without/any/spaces/that/never/wraps/on/its/own</p>';
var CARDS='<div class="cards"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>';
function frame(host,id,w,h,title,scaleTo){var f=document.getElementById(id);var sc=Math.min(1,scaleTo/w);
 if(!f){var box=document.createElement('div');box.className='fbox';var cap=document.createElement('p');cap.className='fcap';cap.id=id+'-cap';box.appendChild(cap);var wr=document.createElement('div');wr.className='fwrap';f=document.createElement('div');f.className='sframe';f.id=id;f.setAttribute('aria-label',title);f.setAttribute('role','img');wr.appendChild(f);box.appendChild(wr);host.appendChild(box);}
 f.style.width=w+'px';f.style.minHeight=h+'px';f.style.transform='scale('+sc+')';f.parentNode.style.width=Math.ceil(w*sc)+'px';f.parentNode.style.height=Math.ceil(h*sc)+'px';return f;}
function matches(q,w){var m=q.match(/\((min|max)-width: (\d+)px\)/);return m[1]==='min'?w>=+m[2]:w<=+m[2];}
function colsFor(blocks,w){var v='1fr';blocks.forEach(function(b){if(matches(b,w)){v=b.indexOf('repeat(3, 1fr)')>=0?'repeat(3, 1fr)':'1fr 1fr';}});return v;}
function draw(f,blocks,w,head){f.innerHTML=(head||'')+CARDS;var c=f.querySelector('.cards');c.style.gridTemplateColumns=colsFor(blocks,w);return f;}
function cols(d){var cs=Array.prototype.slice.call(d.querySelectorAll('.cards div'));var top=cs[0].getBoundingClientRect().top;return cs.filter(function(c){return Math.abs(c.getBoundingClientRect().top-top)<1;}).length;}
function css1(t){var parts=[];var a=t.q600?Q600:null,b=t.q1000?Q1000:null;if(t.rev){if(b){parts.push(b);}if(a){parts.push(a);}}else{if(a){parts.push(a);}if(b){parts.push(b);}}if(t.qmax){parts.push(QMAX);}return parts;}
return {
steps:6,acts:['predict','breakpoints','viewport','overflow','apply'],
init:function(){return {q600:false,q1000:false,qmax:false,rev:false,g:{},vp:true,seenOff:false,seenOn:false,fx:{}};},
predict:{correct:'a',why:{
 a:'400px is below 700px, so the query does not match and only the base styles apply: one column.',
 b:'min-width: 700px matches at 700px and wider, not at 400px.',
 c:'nothing in this CSS ever gives two columns.',
 d:'with the viewport meta element, layout uses the device width in CSS pixels, not physical pixels.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>Base for phones, then <code>min-width</code> queries from small to large; at 1000px both queries match and the later, three-column rule wins.</p>',
  why:{a:'mobile-first: base, then 600px, then 1000px.',b:'this gives the right columns, but it is desktop-first: the base is the wide layout and max-width queries take it back.',c:'at 1000px both queries match, and the later 600px rule wins, so the wide screen shows two columns.',d:'never reaches three columns at 1000px.'},
  miss:{b:'It gives the right columns, but it starts from the wide layout and uses <code>max-width</code> queries to undo it: desktop-first, not mobile-first.',c:'Order matters: at 1000px both <code>min-width</code> queries match, and the later one, two columns, wins.',d:'Nothing gives three columns from 1000px.'},
  hint:'Mobile-first means the narrow layout is the base. Then ask: at 1000px, which matching rule comes last?'},
 B:{fs:'apply-b',correct:'a',reveal:'Base styles first, then <code>@media (min-width: 600px)</code>, then <code>@media (min-width: 1000px)</code>.',
  why:{a:'small to large, so the widest matching rule comes last and wins.',b:'the 600px rule would come last and win at 1000px.',c:'that is desktop-first.',d:'base styles after the queries would override them at every width.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('bp-svg').style.display=(st===1||st>=5)?'':'none';
 var out=api.$('css-out');out.hidden=!(st===2||st===4);var ro=api.$('r-out');ro.textContent='';
 api.$('frames').hidden=(st!==2);api.$('phone').hidden=(st!==3);api.$('oframe').hidden=(st!==4);
 if(st===2){var parts=css1(t);out.textContent='.cards { display: grid; grid-template-columns: 1fr; }'+(parts.length?'\n'+parts.join('\n'):'');
  var res=WIDTHS.map(function(w,i){var f=frame(api.$('frames'),'fr-'+w,w,{360:340,600:190,1000:140}[w],'Simulated frame '+w+'px wide',280);draw(f,parts,w);var n=cols(f);api.$('fr-'+w+'-cap').textContent=w+'px wide: '+n+' column'+(n>1?'s':'');return n;});
  t.cols=res;[['q600','q-600'],['q1000','q-1000'],['qmax','q-max'],['rev','q-order']].forEach(function(p){api.$(p[1]).setAttribute('aria-pressed',t[p[0]]?'true':'false');});
  WIDTHS.forEach(function(w,i){var li=api.$('gr-'+w);var ok=res[i]===WANT[i];li.classList.toggle('done',ok);li.querySelector('.st').textContent=ok?'done':res[i]+' now';});}
 if(st===3){var ph=api.$('phone');var lw=t.vp?360:980;var f2=frame(ph,'ph-frame',lw,t.vp?560:1524,'Drawn phone, 360px screen',200);var d2=draw(f2,[Q600,Q1000],lw,'<p class="ph1">Daily news</p>');
  api.$('ph-frame-cap').textContent=t.vp?'With the viewport meta element: laid out at 360px, '+cols(d2)+' column, normal size':'Without it: laid out at 980px, '+cols(d2)+' columns, shrunk to fit the 360px screen';
  var vb=api.$('vp-toggle');if(vb){vb.setAttribute('aria-pressed',t.vp?'true':'false');vb.textContent='Viewport meta element: '+(t.vp?'present':'removed');}}
 if(st===4){var on=Object.keys(FIX).filter(function(k){return t.fx[k];});out.textContent=on.length?on.map(function(k){return FIX[k];}).join('\n'):'(no fixes yet)';
  var f3=frame(api.$('oframe'),'ov-frame',400,320,'Real 400px wide container',300);f3.className='sframe ov'+on.map(function(k){return ' fx-'+k;}).join('');f3.innerHTML=OBODY;f3.style.overflowX='visible';var cw=f3.scrollWidth;t.cw=cw;if(t.fx.hide){f3.style.overflowX='hidden';}
  api.$('ov-frame-cap').textContent='Real 400px container';ro.textContent='Measured content width: '+cw+'px'+(cw>400?' (wider than 400px)':' (fits in 400px)')+(t.fx.hide?'; overflow-x: hidden is on, so anything wider is cut off':'')+'.';
  Object.keys(FIX).forEach(function(k){api.$('fx-'+k).setAttribute('aria-pressed',t.fx[k]?'true':'false');});}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='q'){t[p[1]]=!t[p[1]];this.render(S,api);var c=t.cols,ok=c[0]===1&&c[1]===2&&c[2]===3&&!t.qmax,msg;
  if(ok){if(!S.done.breakpoints){api.complete('breakpoints');}msg='<p class="verdict ok">1, 2 and 3 columns, mobile-first.</p><p>The base styles serve 360px; the 600px query adds a column at 600px and up; the 1000px query, written last, wins at 1000px.</p>';}
  else if(t.q600&&t.q1000&&t.rev&&c[2]===2){msg='<p class="verdict no">The 1000px frame shows 2 columns.</p><p>Both queries match at 1000px, and the 600px block now comes later, so it wins. Write the queries from small to large.</p>';}
  else if(t.qmax){msg='<p class="verdict no">The 360px frame shows '+c[0]+' columns.</p><p><code>max-width: 1000px</code> matches every narrower screen, including the phone, so it overrides the one-column base.</p>';}
  else{msg='<p>Frames now show '+c[0]+', '+c[1]+' and '+c[2]+' column'+(c[2]>1?'s':'')+'.</p>';}
  api.say(msg);this.render(S,api);var bb=api.$(b.id);if(bb){bb.focus();}}
 if(p[0]==='vp'){t.vp=!t.vp;if(t.vp){t.seenOn=true;}else{t.seenOff=true;}this.render(S,api);api.say('<p>'+(t.vp?'With the element, the page is laid out at the phone\'s own 360px width.':'Without the element, the phone lays the page out at 980px, so the 600px query matches and gives two columns, then shrinks it all to fit 360px.')+'</p>');api.$('vp-toggle').focus();}
 if(p[0]==='vpcheck'){var c2=api.qa('input[name="vpwhy"]:checked')[0];
  if(!t.seenOff||!t.seenOn){api.say('<p class="verdict no">Compare both states first.</p><p>Remove the element, look at the phone, then put it back.</p>');return;}
  if(!c2){api.say('<p class="verdict no">Choose a statement first.</p>');return;}
  var W={b:'the CSS still applies without the element; you saw the two-column rule take effect at 980px.',c:'media queries work either way; without the element they test the 980px layout width instead of the phone\'s width.',d:'desktop browsers ignore the viewport meta element; to see a phone layout on a desktop, use DevTools device mode.'};
  if(c2.value==='a'){if(!S.done.viewport){api.complete('viewport');}api.say('<p class="verdict ok">Right.</p><p>Without the element, the phone uses a layout width of about 980px and scales it down; <code>width=device-width, initial-scale=1</code> makes it use its own width at normal zoom.</p>');}
  else{api.say('<p class="verdict no">Not that one.</p><p>'+W[c2.value]+' Choose again.</p>');}}
 if(p[0]==='fix'){t.fx[p[1]]=!t.fx[p[1]];this.render(S,api);var msg2;
  if(t.cw<=400&&!t.fx.hide){if(!S.done.overflow){api.complete('overflow');}msg2='<p class="verdict ok">Content fits in 400px with nothing hidden.</p><p>The picture shrinks with <code>max-width: 100%</code>, the sidebar takes the available width, and the URL breaks where it must.</p>';}
  else if(t.fx.hide){msg2='<p class="verdict no">The scrollbar is gone, but so is part of the content.</p><p><code>overflow-x: hidden</code> cuts off whatever is wider than the screen. Fix the cause instead, and switch this off.</p>';}
  else{var left=[];if(!t.fx.img){left.push('the 600px picture');}if(!t.fx.side){left.push('the 450px sidebar');}if(!t.fx.url){left.push('the long URL');}msg2='<p>Measured '+t.cw+'px. Still wider than 400px: '+left.join(', ')+'.</p>';}
  api.say(msg2);var bb2=api.$(b.id);if(bb2){bb2.focus();}}
}
};})();
