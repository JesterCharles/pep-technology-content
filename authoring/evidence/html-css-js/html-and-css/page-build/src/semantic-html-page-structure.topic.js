var TOPIC=(function(){
var RK=['a','b','c','d','e','f'];
var REG={a:'header',b:'nav',c:'main',d:'article',e:'aside',f:'footer'};
var REGN={a:'A, site banner: logo and site name',b:'B, links to Home, World, Sport',c:'C, everything unique to this page',d:'D, the news story',e:'E, related stories sidebar',f:'F, copyright and contact'};
var REGOK={a:'introductory content such as the logo and site name belongs in header.',b:'a major block of links to other pages belongs in nav.',c:'the dominant content of the page belongs in main.',d:'the story makes sense on its own, so it is an article.',e:'related stories are tangential to this story, so they belong in aside.',f:'copyright and contact details close the page, so they belong in footer.'};
var ELWHY={header:'header is for introductory content such as a logo or site name.',nav:'nav is for a major block of navigation links.',main:'main is for the one block of content unique to the page.',article:'article is for a self-contained item that makes sense on its own.',section:'section is for a themed group with its own heading; a more specific element fits here.',aside:'aside is for content tangential to what is around it.',footer:'footer is for closing information such as copyright and contact.',div:'div means nothing; a more meaningful element fits here.'};
var HT=['City council approves new bike lanes','What changes','Which streets come first','When work starts','Reactions','From cyclists'];
var HSTART=[1,2,4,4,2,4],HGOAL=[1,2,3,3,2,3];
var CK=['masthead','page','recipe','cols','tips','legal'];
var CODE={masthead:'header',page:'main',recipe:'article',cols:'div',tips:'section',legal:'footer'};
var CODEWHY={masthead:'the site name is introductory content: header.',page:'everything unique to this page is the dominant content: main.',recipe:'the recipe makes sense on its own: article.',cols:'this wrapper only places two lists side by side, so it stays div.',tips:'a themed group with its own heading: section.',legal:'the copyright line closes the page: footer.'};
var LINES=[['masthead',0,'Soup Site'],['page',0,null],['recipe',1,null],['h1',2,'Lentil soup'],['cols',2,'ingredients list, method list'],['tips',2,'<h2>Chef\'s tips</h2> …'],['/recipe',1],['/page',0],['legal',0,'© 2026 Soup Site']];
function el(tag,cls,txt){var e=document.createElement(tag);if(cls){e.className=cls;}if(txt!=null){e.textContent=txt;}return e;}
function probe(tags){var host=el('div');host.hidden=true;document.body.appendChild(host);var out=[];
  tags.forEach(function(t){var e=document.createElement(t);host.appendChild(e);out.push([t,getComputedStyle(e).display]);host.removeChild(e);});
  document.body.removeChild(host);return out;}
return {
steps:6,acts:['predict','regions','outline','swap','apply'],
init:function(){return {ri:0,placed:{},lv:HSTART.slice(),code:{masthead:'div',page:'div',recipe:'div',cols:'div',tips:'div',legal:'div'},cur:null};},
predict:{correct:'a',why:{
 a:'header, nav, main and footer expose landmark roles (banner, navigation, main, contentinfo) that assistive technology lists, so a user can jump straight to one.',
 b:'layout is only what sighted users see. Meaning comes from the element, and a div carries none.',
 c:'class names are for your CSS and scripts; assistive technology does not read them as landmarks.',
 d:'these elements look like div by default. Any visual difference comes from CSS, not from the element.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>Billing is a themed group of main content, so <code>section</code>; its heading sits one level below the <code>h1</code>, and the questions one level below that.</p>',
  why:{a:'a themed group of main content with h2, and its questions one level down at h3.',b:'Billing is part of the help content itself, not tangential to it, so aside is wrong.',c:'going from h2 straight to h4 skips level 3.',d:'nav is for major blocks of navigation links, not for help content.'},
  miss:{b:'Billing is the content the page exists for, so it is not tangential; <code>aside</code> is for sidebars and related links.',c:'The heading levels skip: <code>h2</code> to <code>h4</code> leaves out level 3. Size is a CSS job.',d:'<code>nav</code> marks major navigation links. A group of help questions is content.'},
  hint:'Ask two questions: is Billing main content or a side topic, and does each heading go down by exactly one level?'},
 B:{fs:'apply-b',correct:'a',reveal:'Use <code>&lt;section&gt;</code> with <code>&lt;h2&gt;Billing</code>, and <code>&lt;h3&gt;</code> for each question.',
  why:{a:'main content grouped by theme, then levels 2 and 3.',b:'no level is skipped, but the questions now look like Billing\'s siblings instead of parts of it.',c:'Billing is main content, so not an aside.',d:'h3 to h5 skips level 4, and the page loses its level 2; use CSS for smaller text.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.$('wire').hidden=(st===3||st===4);
 RK.forEach(function(k){var g=api.$('tag-'+k);g.textContent='<'+(t.placed[k]||'div')+'>';g.parentNode.classList.toggle('cur',st===2&&RK[t.ri]===k);});
 var cn=api.$('cur-name');if(cn){cn.textContent=t.ri<RK.length?REGN[RK[t.ri]]:'all six done';}
 var sc=api.$('sorted-count');if(sc){sc.textContent=Object.keys(t.placed).length+' of 6 regions done';}
 var ol=api.$('outline');ol.hidden=(st!==3);ol.innerHTML='';
 if(st===3){var prev=0;HT.forEach(function(txt,i){var lv=t.lv[i];var li=el('li');li.style.marginLeft=((lv-1)*14)+'px';
   li.appendChild(el('span','tag','h'+lv+' '));li.appendChild(document.createTextNode(txt));
   if(i>0&&lv>prev+1){li.className='skip';li.appendChild(el('span','warn',' skips h'+(prev+1)));}
   ol.appendChild(li);prev=lv;});
  var hr=api.$('hrows');if(hr){hr.innerHTML='';HT.forEach(function(txt,i){var r=el('div','hrow');r.appendChild(el('span','hn',txt));
    var dn=el('button','ghost sm','−1');dn.type='button';dn.id='hd-'+i;dn.setAttribute('data-act','hdown:'+i);dn.setAttribute('aria-label','Decrease heading level of '+txt);dn.disabled=t.lv[i]<=1;
    var lvv=el('span','tag lv','h'+t.lv[i]);
    var up=el('button','ghost sm','+1');up.type='button';up.id='hu-'+i;up.setAttribute('data-act','hup:'+i);up.setAttribute('aria-label','Increase heading level of '+txt);up.disabled=t.lv[i]>=6;
    r.appendChild(dn);r.appendChild(lvv);r.appendChild(up);hr.appendChild(r);});}}
 var pb=api.$('probe');pb.hidden=(st!==4);pb.innerHTML='';
 var ce=api.$('codeedit');
 if(st===4&&ce){ce.innerHTML='';LINES.forEach(function(L){var line=el('div','cl i'+L[1]);var k=L[0];
   if(k==='h1'){line.appendChild(el('span',null,'<h1>'+L[2]+'</h1>'));}
   else if(k.charAt(0)==='/'){line.appendChild(el('span',null,'</'+t.code[k.slice(1)]+'>'));}
   else{line.appendChild(el('span',null,'<'));var b=el('button','tagbtn',t.code[k]);b.type='button';b.id='tag-'+k;b.setAttribute('data-act','line:'+k);b.setAttribute('aria-pressed',t.cur===k?'true':'false');b.setAttribute('aria-label','Tag for class '+k+', now '+t.code[k]);line.appendChild(b);
    line.appendChild(el('span',null,' class="'+k+'">'+(L[2]?L[2]+'</'+t.code[k]+'>':'')));}
   ce.appendChild(line);});
  api.$('pal-note').textContent=t.cur?'Choosing the element for class '+t.cur+'.':'Choose a tag in the code first.';
  api.qa('#pal button').forEach(function(b){b.disabled=!t.cur;});
  var tags=[];CK.forEach(function(k){if(tags.indexOf(t.code[k])<0){tags.push(t.code[k]);}});
  pb.appendChild(el('p','ph','Live layout check: this browser\'s default display for each element in the markup'));
  var ul=el('ul');probe(tags).forEach(function(r){var li=el('li');li.appendChild(el('code',null,r[0]));li.appendChild(document.createTextNode(': display: '+r[1]));ul.appendChild(li);});pb.appendChild(ul);}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='el'){if(t.ri>=RK.length){return;}var k=RK[t.ri],v=p[1];
  if(v===REG[k]){t.placed[k]=v;t.ri++;var msg='<p class="verdict ok">'+api.esc(REGN[k])+': '+v+'.</p><p>Yes: '+REGOK[k]+'</p>';
   if(t.ri>=RK.length){msg+='<p>All six regions fit. Each element names the job of its content, which is what lets assistive technology list the landmarks.</p>';api.qa('#el-btns button').forEach(function(x){x.disabled=true;});if(!S.done.regions){api.complete('regions');}}
   api.say(msg);}
  else{api.say('<p class="verdict no">Not '+api.esc(v)+' for '+api.esc(REGN[k])+'.</p><p>'+ELWHY[v]+' Choose another element.</p>');}
  this.render(S,api);var nb=api.$('el-btns').querySelector('button:not(:disabled)');if(nb&&t.ri<RK.length){b.focus();}}
 if(p[0]==='hup'||p[0]==='hdown'){var i=+p[1];t.lv[i]=Math.max(1,Math.min(6,t.lv[i]+(p[0]==='hup'?1:-1)));this.render(S,api);var f=api.$((p[0]==='hup'?'hu-':'hd-')+i);if(f&&!f.disabled){f.focus();}else{var o=api.$((p[0]==='hup'?'hd-':'hu-')+i);if(o){o.focus();}}}
 if(p[0]==='outline'){var lv=t.lv,issues=[];
  if(lv[0]!==1){issues.push('The story title is the page\'s main heading, so it should be level 1.');}
  for(var i2=1;i2<lv.length;i2++){if(lv[i2]>lv[i2-1]+1){issues.push('<span class="on">'+HT[i2]+'</span> jumps from h'+lv[i2-1]+' to h'+lv[i2]+', skipping h'+(lv[i2-1]+1)+'.');}}
  if(!issues.length&&lv.join()!==HGOAL.join()){
   if(lv.filter(function(x){return x===1;}).length>1){issues.push('No level is skipped, but there is more than one level-1 heading; every heading here belongs to the one story, so only its title is level 1.');}
   else{issues.push('No level is skipped, but the outline does not match the story: Which streets come first and When work starts belong under What changes, and From cyclists belongs under Reactions.');}}
  if(!issues.length){if(!S.done.outline){api.complete('outline');}api.say('<p class="verdict ok">Outline is right: h1, h2, h3, h3, h2, h3.</p><p>Going down never skips a level, and going back up from h3 to h2 is fine.</p>');}
  else{api.say('<p class="verdict no">Not yet.</p><ul>'+issues.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>');}}
 if(p[0]==='line'){t.cur=p[1];this.render(S,api);var pf=api.$('pal').querySelector('button');if(pf){pf.focus();}}
 if(p[0]==='pal'&&t.cur){var ck=t.cur;t.code[ck]=p[1];t.cur=null;this.render(S,api);var tb=api.$('tag-'+ck);if(tb){tb.focus();}}
 if(p[0]==='swap'){var wrong=[];CK.forEach(function(k){var v=t.code[k];if(v!==CODE[k]){wrong.push('<li><code>class="'+k+'"</code> is not <code>'+api.esc(v)+'</code>: '+CODEWHY[k]+'</li>');}});
  if(!wrong.length){if(!S.done.swap){api.complete('swap');}api.say('<p class="verdict ok">Markup fits, and the layout is unchanged.</p><p>Every element in the markup displays as a block by default, the same as <code>div</code>, and each kept its class for the CSS. The <code>cols</code> wrapper stays a <code>div</code> because it only does layout.</p>');}
  else{api.say('<p class="verdict no">Not yet: '+wrong.length+' of 6 need another look.</p><ul>'+wrong.join('')+'</ul>');}}
}
};})();
