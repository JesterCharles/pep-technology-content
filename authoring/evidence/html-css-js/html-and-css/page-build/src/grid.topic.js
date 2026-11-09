var TOPIC=(function(){
var COLS=['1fr 1fr 1fr','repeat(3, 1fr)','100px 1fr','100px 100px','repeat(3, 90px)','repeat(auto-fill, minmax(90px, 1fr))'];
var NAMES=['header','side','main','footer'];
var LAYS=[{n:'A page shell: header on top, sidebar beside main, footer at the bottom',k:'grid',ok:'the regions line up in rows and columns, so this is two-dimensional.'},
 {n:'A row of tags of different widths that wraps onto new lines',k:'flex',ok:'content-sized items along one axis; when they wrap, each line is laid out on its own, and the tags need not line up in columns.'},
 {n:'A photo gallery whose photos line up in rows and columns',k:'grid',ok:'the photos must align both across and down: two dimensions.'},
 {n:'A nav bar with links on the left and a Sign in button on the right',k:'flex',ok:'items spaced along one axis, with nothing to line up in a second direction.'},
 {n:'A form whose labels line up in one column and fields in another',k:'grid',ok:'labels and fields must line up across every row and down both columns.'}];
var LW={grid:'Grid is for rows and columns that line up together; these items only need laying out along one axis, so Flexbox fits.',flex:'Flexbox works along one dimension at a time, and wrapped flex lines do not share columns; here things must line up in both directions, so Grid fits.'};
function R(e){return e.getBoundingClientRect();}
function near(a,b){return Math.abs(a-b)<1.5;}
function colWidths(api){var cs=api.qa('#g1 .gc').map(R);var top=cs[0].top;return cs.filter(function(r){return near(r.top,top);}).map(function(r){return Math.round(r.width);});}
function setCols(api,v,w){var g=api.$('g1');g.style.display='grid';g.style.gridTemplateColumns=v;g.style.width=w+'px';}
function areaStr(cells){return '"'+cells[0]+' '+cells[1]+'" "'+cells[2]+' '+cells[3]+'" "'+cells[4]+' '+cells[5]+'"';}
function shellOk(api){var g=api.$('g2'),I=R(g),h=R(api.$('ga-header')),s=R(api.$('ga-side')),m=R(api.$('ga-main')),f=R(api.$('ga-footer'));var w=g.clientWidth;
 return near(h.width,w)&&near(f.width,w)&&near(s.top,m.top)&&s.right<=m.left+1&&h.bottom<=s.top+1&&m.bottom<=f.top+1&&near(s.width,100);}
return {
steps:6,acts:['predict','tracks','areas','choose','apply'],
init:function(){return {col:null,g:{},cells:['.','.','.','.','.','.'],cur:null,applied:null,li:0,sorted:0};},
predict:{correct:'a',why:{
 a:'the leftover after the 200px track is 400px; 1fr 2fr splits it into thirds, so the 2fr column is two thirds: about 267px.',
 b:'400px is the whole leftover; 1fr and 2fr share it, so the third column gets two thirds of it.',
 c:'fr is not a pixel unit; 2fr is two shares of the leftover space.',
 d:'fr shares only what is left after the fixed 200px column, not the full 600px.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>The cards must line up in two dimensions, and <code>repeat(auto-fill, minmax(200px, 1fr))</code> fits as many 200px-plus columns as the width allows.</p>',
  why:{a:'two-dimensional alignment, with as many 200px-plus columns as fit.',b:'space-between spreads one row; cards in different rows will not line up in columns.',c:'200px is a single fixed column, so every card is on its own row.',d:'a single column, not as many per row as fit.'},
  miss:{b:'Flexbox lays out each wrapped line on its own, so cards in different lines will not line up as shared columns, and <code>space-between</code> spreads out a short last row.',c:'<code>grid-template-columns: 200px</code> is one column: every card would be on its own row.',d:'<code>flex-direction: column</code> stacks every card in one column.'},
  hint:'Must the cards line up down columns as well as across rows? And how do you ask for as many columns as fit?'},
 B:{fs:'apply-b',correct:'a',reveal:'Grid fits because the cards must line up in two dimensions: <code>grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))</code>.',
  why:{a:'two-dimensional alignment is the deciding reason.',b:'the number of items does not decide it; Flexbox can lay out many items along one axis.',c:'same content does not decide the layout model.',d:'age is not a reason; each model solves a different problem.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('dims').style.display=(st===1||st>=4)?'':'none';
 api.$('g1wrap').hidden=(st!==2);api.$('amap').hidden=(st!==3);api.$('g2wrap').hidden=(st!==3);
 var out=api.$('css-out');out.hidden=!(st===2||st===3);var go=api.$('g-out');go.textContent='';
 if(st===2){setCols(api,t.col===null?'none':COLS[t.col],300);out.textContent='.cells {\n  display: grid;\n  width: 300px;\n  grid-template-columns: '+(t.col===null?'none':COLS[t.col])+';\n}';
  api.qa('[data-act^="cols:"]').forEach(function(b){b.setAttribute('aria-pressed',String(t.col)===b.getAttribute('data-act').split(':')[1]?'true':'false');});
  go.textContent='Measured first-row columns: '+colWidths(api).map(function(w){return w+'px';}).join(', ')+'.';
  [['equal','gg-equal'],['side','gg-side'],['fit','gg-fit']].forEach(function(p){var li=api.$(p[1]);li.classList.toggle('done',!!t.g[p[0]]);li.querySelector('.st').textContent=t.g[p[0]]?'done':'not yet';});}
 if(st===3){var am=api.$('amap');am.innerHTML='';t.cells.forEach(function(v,i){var b=document.createElement('button');b.type='button';b.className='acell';b.id='cell-'+i;b.setAttribute('data-act','cell:'+i);b.setAttribute('aria-pressed',t.cur===i?'true':'false');b.setAttribute('aria-label','Row '+(Math.floor(i/2)+1)+', column '+(i%2+1)+': '+(v==='.'?'empty':v));b.textContent=v;am.appendChild(b);});
  api.$('apal-note').textContent=t.cur===null?'Press a cell in the area map first.':'Choosing the name for row '+(Math.floor(t.cur/2)+1)+', column '+(t.cur%2+1)+'.';
  api.qa('#apal button').forEach(function(b){b.disabled=t.cur===null;});
  var g=api.$('g2');g.style.display='grid';g.style.gridTemplateColumns='100px 1fr';g.style.width='300px';g.style.gridTemplateAreas=t.applied||'';NAMES.forEach(function(n){api.$('ga-'+n).style.gridArea=n;});
  out.textContent='.shell {\n  display: grid;\n  grid-template-columns: 100px 1fr;\n  grid-template-areas: '+(t.applied||'(not applied yet)')+';\n}\n.header { grid-area: header; } /* and side, main, footer */';
  go.textContent=t.applied?(g.style.gridTemplateAreas?'The browser accepted the areas.':'The browser rejected this grid-template-areas value, so the items fall back to automatic placement.'):'';}
 var ln=api.$('lay-name');if(ln){ln.textContent=t.li<LAYS.length?LAYS[t.li].n:'all five sorted';api.$('lay-count').textContent=t.sorted+' of 5 sorted';}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='cols'){t.col=+p[1];this.render(S,api);var w=colWidths(api),msg='';
  if(w.length===3&&near(w[0],100)&&near(w[1],100)&&near(w[2],100)&&t.col!==4&&!t.g.equal&&t.col!==5){t.g.equal=true;msg='<p class="verdict ok">Goal 1 done: three columns of 100px.</p><p>Three equal <code>fr</code> shares split the 300px evenly; <code>repeat(3, 1fr)</code> is the same list written shorter.</p>';}
  else if(t.col===2&&!t.g.side){t.g.side=true;msg='<p class="verdict ok">Goal 2 done: 100px and 200px.</p><p>The fixed track takes 100px first; <code>1fr</code> takes all of the leftover.</p>';}
  else if(t.col===5){setCols(api,COLS[5],200);var w2=colWidths(api);setCols(api,COLS[5],300);
   if(w2.length===2&&!t.g.fit){t.g.fit=true;msg='<p class="verdict ok">Goal 3 done.</p><p>At 300px the browser fits 3 columns; at 200px it fits '+w2.length+' columns of '+w2[0]+'px. <code>auto-fill</code> with <code>minmax(90px, 1fr)</code> adapts to the width.</p>';}
   else if(!t.g.equal){msg='<p>At 300px this also gives three equal columns, but Goal 1 asks for exactly three at any width; use a fixed list of three.</p>';}}
  else if(t.col===4){setCols(api,COLS[4],200);var w3=colWidths(api);setCols(api,COLS[4],300);msg='<p class="verdict no">Not a goal: fixed 90px columns.</p><p>They do not fill the 300px, and at 200px there are still '+w3.length+' columns, so the grid overflows. Fixed sizes do not adapt.</p>';}
  else if(t.col===3){msg='<p class="verdict no">Not a goal: two fixed 100px columns.</p><p>They leave 100px empty, because nothing is flexible. Use <code>fr</code> for the column that takes the rest.</p>';}
  else{msg='<p>Measured: '+w.map(function(x){return x+'px';}).join(', ')+'.</p>';}
  if(t.g.equal&&t.g.side&&t.g.fit&&!S.done.tracks){api.complete('tracks');msg+='<p>All three goals met.</p>';}
  api.say(msg||'<p>Goal already met.</p>');this.render(S,api);}
 if(p[0]==='cell'){t.cur=+p[1];this.render(S,api);var f=api.$('apal').querySelector('button');if(f){f.focus();}}
 if(p[0]==='an'&&t.cur!==null){var i=t.cur;t.cells[i]=p[1];t.cur=null;this.render(S,api);var c=api.$('cell-'+i);if(c){c.focus();}}
 if(p[0]==='areas'){var str=areaStr(t.cells);var g=api.$('g2');g.style.gridTemplateAreas='';g.style.gridTemplateAreas=str;var accepted=!!g.style.gridTemplateAreas;t.applied=str;this.render(S,api);
  if(!accepted){api.say('<p class="verdict no">The browser rejected these areas.</p><p>Every named area must be one filled rectangle; check for a name split across cells that do not touch, or an L-shape.</p>');return;}
  if(shellOk(api)){if(!S.done.areas){api.complete('areas');}api.say('<p class="verdict ok">Shell laid out by the browser.</p><p><code>"header header" "side main" "footer footer"</code>: header and footer span both columns, and side sits left of main.</p>');}
  else{var miss=NAMES.filter(function(n){return t.cells.indexOf(n)<0;});api.say('<p class="verdict no">Accepted, but not the shell yet.</p><p>'+(miss.length?'No cell is named '+miss.join(', ')+', so that item is placed automatically. ':'')+'The header must fill the whole top row, side and main share the middle row, and the footer fills the bottom row.</p>');}}
 if(p[0]==='lay'){if(t.li>=LAYS.length){return;}var L=LAYS[t.li];
  if(p[1]===L.k){t.li++;t.sorted++;var m='<p class="verdict ok">'+(L.k==='grid'?'Grid':'Flexbox')+'.</p><p>Yes: '+L.ok+'</p>';
   if(t.li>=LAYS.length){m+='<p>All five sorted. The deciding question each time: must things line up in two directions?</p>';api.qa('#lay-btns button').forEach(function(x){x.disabled=true;});if(!S.done.choose){api.complete('choose');}}
   api.say(m);}
  else{api.say('<p class="verdict no">Not '+(p[1]==='grid'?'Grid':'Flexbox')+' here.</p><p>'+LW[p[1]]+'</p>');}
  this.render(S,api);}
}
};})();
