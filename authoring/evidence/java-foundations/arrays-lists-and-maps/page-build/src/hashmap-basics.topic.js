/* Topic data and handlers for HashMap basics. Every output, map order and exception matches a real JDK run. */
var TOPIC={
predict:{correct:'a',why:{
 a:'the second put replaces the value for "apple", and get returns null for "pear", which was never stored.',
 b:'a map keeps one value per key, so the second put replaced 3 with 5.',
 c:'put does not add to the old value; it replaces it.',
 d:'get returns null, not 0, for a missing key; there is no default unless you ask for one with getOrDefault.'}},
explore:{
 reset:function(api){api.s.x={e:[{k:'apple',v:3}],v:5};},
 render:function(api){var x=api.s.x;if(!x||!x.e){return;}
  var m={k:'map',e:x.e},order=api.J.hashOrder(m);
  var h=order.map(function(p){return '<dt>"'+api.esc(p.k)+'"</dt><dd>'+p.v+'</dd>';}).join('');
  var dl=api.$('map-pairs');if(dl.innerHTML!==h){dl.innerHTML=h;}
  api.$('map-size').textContent='size() is '+x.e.length+'. Printed: '+api.J.show(m);
  var o=api.$('map-v');if(o){o.textContent=String(x.v);}},
 on:function(act,btn,api){var x=api.s.x,key=api.checked('map-key')||'apple',out=api.$('out-mp'),hit=null,call,res,msg;
  if(act==='dec'){x.v=Math.max(0,x.v-1);api.render();return;}
  if(act==='inc'){x.v=Math.min(9,x.v+1);api.render();return;}
  api.s.attempts++;
  x.e.forEach(function(p){if(p.k===key){hit=p;}});
  if(act==='put'){call='stock.put("'+key+'", '+x.v+')';
    if(hit){res=String(hit.v);msg='"'+key+'" was already a key, so put replaced '+hit.v+' with '+x.v+' and returned the old value.';hit.v=x.v;api.goal('replace');}
    else{x.e.push({k:key,v:x.v});res='null';msg='"'+key+'" is a new key, so put stored the pair and returned null.';api.goal('put');}}
  else if(act==='get'){call='stock.get("'+key+'")';res=hit?String(hit.v):'null';msg=hit?'"'+key+'" maps to '+hit.v+'.':'"'+key+'" is not a key, so get returns null. Storing that null in an int would throw NullPointerException.';if(!hit){api.goal('missing');}}
  else if(act==='contains'){call='stock.containsKey("'+key+'")';res=hit?'true':'false';msg=hit?'"'+key+'" is a key.':'"'+key+'" is not a key: a safe yes-or-no answer, with no null involved.';if(!hit){api.goal('safe');}}
  else{call='stock.getOrDefault("'+key+'", 0)';res=hit?String(hit.v):'0';msg=hit?'"'+key+'" is a key, so its value '+hit.v+' comes back.':'"'+key+'" is not a key, so the fallback 0 comes back instead of null.';if(!hit){api.goal('safe');}}
  out.textContent=call+'\n'+res;
  var left=api.left();
  api.feedback('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 4 checks still open.':'<strong>All checks done.</strong>'+(api.s.completed?'':api.nextNote()))+'</p>');
  if(!left&&!api.s.completed){api.finish();}else{api.render();}}},
code:{file:'WordCount.java',mode:'methods',
 startNote:'replace the comment inside the loop with your code first.',
 starter:'static Map<String, Integer> countWords(String[] words) {\n    Map<String, Integer> counts = new HashMap<>();\n    for (String w : words) {\n        // add one to the count stored for w\n    }\n    return counts;\n}\n',
 evaluate:function(prog,J){
  var cases=[{g:'repeat',w:['red','blue','red'],want:{red:2,blue:1}},{g:'many',w:['to','be','or','not','to','be'],want:{to:2,be:2,or:1,not:1}},{g:'empty',w:[],want:{}}];
  var lines=[],goals={},status='pass',fb=[];
  function sig(m,ty){if(ty(m.ret)!=='Map<String, Integer>'||m.params.length!==1||ty(m.params[0].type)!=='String[]'){return 'Keep the first line from the starter: static Map<String, Integer> countWords(String[] words).';}return null;}
  for(var c=0;c<cases.length;c++){var k=cases[c],arr=J.newArray({base:'String'},0);arr.a=k.w.slice();
    var label='countWords({'+k.w.map(function(s){return '"'+s+'"';}).join(', ')+'})',r=J.run(prog,{name:'countWords',args:[arr],check:sig});
    if(r.status==='problem'){return {status:'limit',problems:r.problems,lines:['Not run: '+r.problems[0].msg],summary:'Not run. 1 problem still open.',goals:{},feedback:'Not run yet: '+api_esc(r.problems[0].msg)};}
    if(r.status==='exception'){status='exception';lines.push(label+'\n    '+J.exceptionText(r.err,'WordCount.countWords'));
      fb.push(label+' threw '+r.err.type+' at line '+r.err.line+'.'+(r.err.type==='NullPointerException'?' The first time a word appears, get returns null, and adding 1 to it unboxes that null.':''));break;}
    if(r.status==='stopped'){status='stopped';lines.push(label+'\n    Stopped: '+r.err.msg);fb.push('The run stopped: '+r.err.msg);break;}
    var m=r.result,got=m&&m.k==='map'?J.show(m):String(m),ok=!!(m&&m.k==='map')&&m.e.length===Object.keys(k.want).length&&m.e.every(function(p){return k.want[p.k]===p.v;});
    var wantShown=J.show({k:'map',e:Object.keys(k.want).map(function(w){return {k:w,v:k.want[w]};})});
    lines.push(label+' -> '+got+(ok?'   matches':'   expected '+wantShown));
    if(ok){goals[k.g]=1;}else{status='mismatch';fb.push(label+' returned '+got+', not '+wantShown+'.');}}
  var all=goals.repeat&&goals.many&&goals.empty;
  return {status:all?'pass':status,lines:lines,goals:goals,summary:all?'Every map matches.':'Some maps do not match yet.',
   feedback:all?'Every word is counted, including the first time it appears, and the empty array gives an empty map.':api_esc(fb.join(' '))};}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p><code>getOrDefault</code> returns the fallback 0 for the missing key, so nothing is unboxed from <code>null</code>.</p>',
  why:{a:'get returns null, and assigning null to an int unboxes it: NullPointerException.',b:'the key is missing, so the fallback 0 is returned and stored in n.',c:'get returns null, and the addition unboxes it: NullPointerException.',d:'no exception, but n holds null, not 0, and the surprise moves to wherever n is used next.'},
  miss:{a:'Assigning the null from get to an int unboxes it and throws NullPointerException.',c:'The + 0 still unboxes the null from get first, so it throws NullPointerException.',d:'This avoids the exception, but n is null, not 0.'},
  hint:'Look for the lookup that lets you say what a missing key should mean.'},
 B:{fs:'apply-b',correct:'b',reveal:'Test <code>stock.containsKey("kiwi")</code> first, then print either the stored count or <code>no kiwi</code>.',
  why:{a:'it prints null when kiwi is missing, not the words no kiwi.',b:'containsKey picks the branch, so get runs only when the key is stored.',c:'comparing the null from get with 0 unboxes it and throws NullPointerException.',d:'it prints 0 for a missing kiwi, which is safe but not the words the task asks for.'}}}
};
function api_esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
