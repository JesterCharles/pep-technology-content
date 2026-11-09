var TOPIC=(function(){
function el(tag,cls,txt){var e=document.createElement(tag);if(cls){e.className=cls;}if(txt!=null){e.textContent=txt;}return e;}
var FIX={name:'label',email:'for',sub:'ok',search:'aria'};
var FIXWHY={
 name:{label:'a visible label stays on screen and names the field.',aria:'aria-label gives a name, but the field is visible, so it should have a visible label that everyone can read.',ok:'a placeholder disappears when someone types, and it is not a label.'},
 email:{for:'for must equal the field\'s id; with for="email" the label links.',aria:'that names the field, but the visible label would still be linked to nothing; fix the for value instead.',ok:'sitting next to the field links nothing; the for value must equal the id.'},
 sub:{ok:'wrapping the checkbox inside its label already links them.',aria:'not needed: the wrapping label already names it, and a second name could disagree with the visible text.',for:'not needed: a label that wraps its control is linked without for.'},
 search:{aria:'an icon-only button has no text, so aria-label gives it the name Search.',ok:'the icon has no text a screen reader can read, so the button has no name.',title:'placeholder does not apply to a button and names nothing.'}};
function names(fx){var host=el('div');host.hidden=true;document.body.appendChild(host);var out=[];
 var n=el('input');n.id='pv-name';n.placeholder='Full name';if(fx.name==='aria'){n.setAttribute('aria-label','Full name');}if(fx.name==='label'){var l=el('label',null,'Full name');l.htmlFor='pv-name';host.appendChild(l);}host.appendChild(n);
 var le=el('label',null,'Email');le.htmlFor=fx.email==='for'?'pv-email':'pv-mail';host.appendChild(le);var em=el('input');em.type='email';em.id='pv-email';if(fx.email==='aria'){em.setAttribute('aria-label','Email');}host.appendChild(em);
 var ls=el('label');var cb=el('input');cb.type='checkbox';cb.id='pv-sub';ls.appendChild(cb);ls.appendChild(document.createTextNode(' Subscribe'));if(fx.sub==='aria'){cb.setAttribute('aria-label','Subscribe');}if(fx.sub==='for'){ls.htmlFor='pv-sub';}host.appendChild(ls);
 var sb=el('button');sb.type='button';if(fx.search==='aria'){sb.setAttribute('aria-label','Search');}host.appendChild(sb);
 function row(label,e,vis){var labs=e.labels?Array.prototype.map.call(e.labels,function(x){return x.textContent.trim();}):[];var aria=e.getAttribute('aria-label');
  out.push({c:label,labels:labs.length,name:aria||labs.join(' ')||(e.tagName==='BUTTON'?e.textContent.trim():''),visible:labs.length>0});}
 row('Full name field',n);row('Email field',em);row('Subscribe checkbox',cb);row('Search button',sb);
 document.body.removeChild(host);return out;}
var QV=['','0','3','6','7'],QE=[0,0,1,1,0],PV=['','1234','12345','12a45','123456'],PE=[0,0,1,0,0];
function why(v){if(v.valid){return 'accepted';}if(v.valueMissing){return 'blocked: empty but required';}if(v.typeMismatch){return 'blocked: not an email address';}if(v.patternMismatch){return 'blocked: does not match the pattern';}if(v.rangeUnderflow){return 'blocked: below min';}if(v.rangeOverflow){return 'blocked: above max';}if(v.badInput){return 'blocked: not a number';}return 'blocked';}
function runField(attrs,values){var host=el('div');host.hidden=true;document.body.appendChild(host);var res=values.map(function(v){var i=el('input');
  Object.keys(attrs).forEach(function(k){if(attrs[k]!==false){i.setAttribute(k,attrs[k]===true?'':attrs[k]);}});host.appendChild(i);i.value=v;var ok=i.checkValidity();var r={v:v,ok:ok,why:why(i.validity)};host.removeChild(i);return r;});
 document.body.removeChild(host);return res;}
function qAttrs(t){return {type:t.q.type?'number':'text',required:!!t.q.required,min:t.q.min?'1':false,max:t.q.max?'6':false};}
function pAttrs(t){return {type:t.p.type?'email':'text',required:!!t.p.required,pattern:t.p.pattern?'[0-9]{5}':false};}
var CH=[{n:'The email field is filled in',k:'both',ok:'the browser stops honest users early, and the server checks again because the browser check can be skipped.',w:{browser:'the browser check can be removed in developer tools, so an empty email could still arrive; the server must check too.',server:'the server must check, but required in the browser also saves honest users a round trip, so both.'}},
 {n:'The email is not already registered',k:'server',ok:'only the server knows which emails exist, so this rule lives on the server alone.',w:{browser:'the browser cannot see the list of registered users.',both:'the browser has no way to know who is registered; only the server can check this.'}},
 {n:'A field turns red while the user types',k:'browser',ok:'this is display help for the person typing; it protects nothing, so the server has no part in it.',w:{server:'the server never sees typing; this is only display help in the page.',both:'the server never sees typing, so it has nothing to do here.'}},
 {n:'The ticket quantity is from 1 to 6',k:'both',ok:'min and max give fast feedback, and the server repeats the rule because a request can skip the page.',w:{browser:'a hand-made request can send 99 without touching the page, so the server must check too.',server:'the server must check, and min and max in the browser give honest users quick feedback, so both.'}},
 {n:'The price comes from the shop\'s product list, not from the request',k:'server',ok:'a request can carry any price, so only the server can enforce the real one.',w:{browser:'anything the browser sends can be changed, so the browser cannot enforce the real price.',both:'a price check in the browser protects nothing, because the request can carry any price; this is the server\'s job.'}}];
var LANEN={browser:'Browser only',server:'Server only',both:'Both'};
return {
steps:6,acts:['predict','labels','rules','where','apply'],
init:function(){return {applied:null,q:{},p:{},ci:0,sorted:[]};},
predict:{correct:'a',why:{
 a:'the browser check runs on the user\'s own computer. With required removed, the browser sends the empty value, and only the server can stop it.',
 b:'the server receives only the submitted values, never the page\'s attributes, so it cannot read required.',
 c:'the browser checks the page as it is now; there is no hidden copy of the original rules.',
 d:'HTTP carries whatever values are sent, including empty ones.'},
 after:'<p>That is why this topic ends with the server: browser checks help honest users, and the server protects the data.</p>'},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>The number type makes <code>min</code> and <code>max</code> apply, and <code>required</code> blocks the empty value.</p>',
  why:{a:'number type, required, min 1 and max 8: every part of the rule is enforced.',b:'min and max do nothing on a text field, so 0 or 99 would pass.',c:'without required, an empty value passes.',d:'pattern does not apply to a number field, so 9 would pass, and nothing sets a maximum.'},
  miss:{b:'On a text field, <code>min</code> and <code>max</code> are ignored, so the browser would accept 0 or 99.',c:'Nothing blocks the empty value: add <code>required</code>.',d:'<code>pattern</code> applies only to text-like fields such as text, email and tel, not to number.'},
  hint:'Check each part of the rule: must be filled in, must be a number, at least 1, at most 8.'},
 B:{fs:'apply-b',correct:'a',reveal:'Use <code>&lt;input type="number" required min="1" max="8"&gt;</code>.',
  why:{a:'every part of the rule.',b:'an empty value passes without required.',c:'min and max are ignored on a text field.',d:'a placeholder is a hint, not a rule; nothing is checked.'}}},
render:function(S,api){var t=S.t,st=S.step;
 api.qa('.ly').forEach(function(n){n.classList.toggle('hl',st===4||st===1);});
 var pv=api.$('lab-preview');pv.hidden=(st!==2);pv.innerHTML='';
 if(st===2){var fx=t.applied||{name:'ok',email:'ok',sub:'ok',search:'ok'};var rs=names(fx);pv.appendChild(el('p','ph',t.applied?'Preview after your fixes, read from this browser':'Preview before fixes, read from this browser'));
  var ul=el('ul');rs.forEach(function(r){var li=el('li');li.appendChild(el('strong',null,r.c+': '));li.appendChild(document.createTextNode('linked labels '+r.labels+'; name '+(r.name?'"'+r.name+'"':'none')));ul.appendChild(li);});pv.appendChild(ul);}
 var vt=api.$('val-table');vt.hidden=(st!==3);vt.innerHTML='';
 if(st===3){api.qa('.tg').forEach(function(b){var p=b.getAttribute('data-act').split(':');b.setAttribute('aria-pressed',t[p[1]][p[2]]?'true':'false');});
  [['Tickets',qAttrs(t),QV,QE],['Postcode',pAttrs(t),PV,PE]].forEach(function(F){var res=runField(F[1],F[2]);var tb=el('table');var cap=el('caption',null,F[0]+': '+Object.keys(F[1]).filter(function(k){return F[1][k]!==false;}).map(function(k){return F[1][k]===true?k:k+'="'+F[1][k]+'"';}).join(' '));tb.appendChild(cap);
   var hr=el('tr');['Value','Browser result','Rule needs'].forEach(function(h){hr.appendChild(el('th',null,h));});tb.appendChild(hr);
   res.forEach(function(r,i){var tr=el('tr');var match=(r.ok?1:0)===F[3][i];tr.className=match?'m':'x';tr.appendChild(el('td',null,r.v===''?'(empty)':r.v));tr.appendChild(el('td',null,r.why));tr.appendChild(el('td',null,(F[3][i]?'accept':'block')+(match?' ✓ matches':' ✗ differs')));tb.appendChild(tr);});vt.appendChild(tb);});}
 var cn=api.$('chk-name');if(cn){cn.textContent=t.ci<CH.length?CH[t.ci].n:'all five sorted';}
 var cc=api.$('chk-count');if(cc){cc.textContent=t.sorted.length+' of 5 sorted';}
 var so=api.$('sorted');if(so){so.innerHTML='';t.sorted.forEach(function(i){so.appendChild(el('li',null,CH[i].n+' → '+LANEN[CH[i].k]));});}
},
act:function(a,b,S,api){var t=S.t,p=a.split(':');
 if(p[0]==='fix'){var fx={},miss=[];['name','email','sub','search'].forEach(function(k){var c=api.qa('input[name="fx-'+k+'"]:checked')[0];fx[k]=c?c.value:null;if(!c){miss.push(k);}});
  if(miss.length){api.say('<p class="verdict no">Choose a fix for every control first ('+miss.length+' still open).</p>');return;}
  t.applied=fx;this.render(S,api);var wrong=[];var LBL={name:'Full name field',email:'Email field',sub:'Subscribe checkbox',search:'Search button'};
  Object.keys(FIX).forEach(function(k){if(fx[k]!==FIX[k]){wrong.push('<li><span class="on">'+LBL[k]+'</span>: '+FIXWHY[k][fx[k]]+'</li>');}});
  if(!wrong.length){if(!S.done.labels){api.complete('labels');}api.say('<p class="verdict ok">Every control now has a name.</p><p>The three visible fields have linked labels (the preview shows 1 linked label each), and the icon-only button is named Search by <code>aria-label</code>.</p>');}
  else{api.say('<p class="verdict no">Not yet: '+wrong.length+' of 4 need another look. Change your choice and apply again.</p><ul>'+wrong.join('')+'</ul>');}}
 if(p[0]==='tg'){t[p[1]][p[2]]=!t[p[1]][p[2]];this.render(S,api);b=api.$(b.id);if(b){b.focus();}}
 if(p[0]==='rules'){var q=runField(qAttrs(t),QV),pp=runField(pAttrs(t),PV),bad=[];
  q.forEach(function(r,i){if((r.ok?1:0)!==QE[i]){bad.push('Tickets '+(r.v===''?'(empty)':r.v)+' is '+(r.ok?'accepted':'blocked')+' but should be '+(QE[i]?'accepted':'blocked')+'.');}});
  pp.forEach(function(r,i){if((r.ok?1:0)!==PE[i]){bad.push('Postcode '+(r.v===''?'(empty)':r.v)+' is '+(r.ok?'accepted':'blocked')+' but should be '+(PE[i]?'accepted':'blocked')+'.');}});
  var hints=[];if(t.q.min&&!t.q.type){hints.push('min and max do nothing on a text field: switch on type="number".');}if(t.p.pattern&&!t.p.required){hints.push('pattern skips an empty value: switch on required too.');}if(t.p.type){hints.push('type="email" rejects 12345, because a postcode is not an email address.');}
  if(!bad.length){if(!S.done.rules){api.complete('rules');}api.say('<p class="verdict ok">Every test value gets the result the rule needs.</p><p>The browser itself produced each result with <code>checkValidity()</code>. In a real form, these same checks block the submission.</p>');}
  else{api.say('<p class="verdict no">Not yet: '+bad.length+' test value'+(bad.length>1?'s differ':' differs')+'.</p><ul>'+bad.slice(0,4).map(function(x){return '<li>'+x+'</li>';}).join('')+(bad.length>4?'<li>and '+(bad.length-4)+' more in the table</li>':'')+'</ul>'+(hints.length?'<p>'+hints.join(' ')+'</p>':''));}}
 if(p[0]==='lane'){if(t.ci>=CH.length){return;}var c=CH[t.ci];
  if(p[1]===c.k){t.sorted.push(t.ci);t.ci++;var msg='<p class="verdict ok">'+api.esc(c.n)+': '+LANEN[c.k]+'.</p><p>Yes: '+c.ok+'</p>';
   if(t.ci>=CH.length){msg+='<p>All five sorted. Anything that protects your data runs on the server, whatever the browser does.</p>';api.qa('#lane-btns button').forEach(function(x){x.disabled=true;});if(!S.done.where){api.complete('where');}}
   api.say(msg);}
  else{api.say('<p class="verdict no">Not '+LANEN[p[1]]+' for: '+api.esc(c.n)+'.</p><p>'+c.w[p[1]]+' Choose another lane.</p>');}
  this.render(S,api);}
}
};})();
