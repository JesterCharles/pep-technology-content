/* Topic data and handlers for Declaring and looping over arrays. Every output shown matches a real JDK run. */
var TOPIC={
predict:{correct:'a',why:{
 a:'new int[3] gives every element the int default 0, and index 1 is the second element, which was set to 7.',
 b:'null is the default only for object elements such as String; int elements start at 0.',
 c:'index 1 is the second element, not the first, because indexes start at 0.',
 d:'every element gets a default value when the array is created, so reading scores[0] compiles and runs.'}},
explore:{
 START:[12,15,9,20,18],
 reset:function(api){api.s.x={arr:this.START.slice(),i:0};},
 render:function(api){var x=api.s.x,cells=api.$('temps-cells');if(!x||!x.arr){return;}
  var h=x.arr.map(function(v,k){return '<li'+(k===x.i?' class="is-on"':'')+'><span class="v">'+v+'</span><span class="i">['+k+']</span>'+(k===x.i?'<span class="tag">i</span>':'')+'</li>';}).join('');
  if(cells.innerHTML!==h){cells.innerHTML=h;}
  var o=api.$('ix-val');if(o){o.textContent='i = '+x.i;}},
 on:function(act,btn,api){var x=api.s.x,out=api.$('out-ix'),msg,len=x.arr.length;
  if(act==='dec'){x.i=Math.max(-1,x.i-1);api.render();return;}
  if(act==='inc'){x.i=Math.min(len+1,x.i+1);api.render();return;}
  api.s.attempts++;
  var ok=x.i>=0&&x.i<len,oob='Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index '+x.i+' out of bounds for length '+len;
  if(act==='read'){out.textContent='temps['+x.i+']\n'+(ok?String(x.arr[x.i]):oob);
    if(ok&&x.i===0){api.goal('first');}if(ok&&x.i===len-1){api.goal('last');}
    msg=ok?'temps['+x.i+'] is '+x.arr[x.i]+'.'+(x.i===len-1?' Index '+x.i+' is the last one: length minus one.':''):'Index '+x.i+' is outside 0 to '+(len-1)+', so the line compiles but throws when it runs.';}
  else{out.textContent='temps['+x.i+'] = 30;\n'+(ok?'temps is now '+'{'+(x.arr[x.i]=30,x.arr.join(', '))+'}':oob);
    if(ok){api.goal('write');}msg=ok?'Element '+x.i+' now holds 30; the length is still '+len+'.':'Writing to index '+x.i+' throws too: the array cannot grow.';}
  if(!ok){api.goal('oob');}
  var left=api.left();
  api.feedback('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 4 checks still open.':'<strong>All checks done.</strong>'+(api.s.completed?'':api.nextNote()))+'</p>');
  if(!left&&!api.s.completed){api.finish();}else{api.render();}}},
code:{file:'Reverse.java',mode:'methods',
 startNote:'replace the ___ placeholder and fill the loop body first.',
 starter:'static void reverse(int[] a) {\n    int left = 0;\n    int right = ___;\n    while (left < right) {\n        // swap a[left] and a[right], then move both indexes\n    }\n}\n',
 evaluate:function(prog,J){
  var cases=[{name:'odd',input:[1,2,3,4,5]},{name:'even',input:[7,8]},{name:'one',input:[9]},{name:'empty',input:[]}];
  var lines=[],goals={},status='pass',fb=[],edgeOk=0;
  function sig(m,ty){if(m.ret.base!=='void'||m.params.length!==1||ty(m.params[0].type)!=='int[]'){return 'Keep the first line from the starter: static void reverse(int[] a).';}return null;}
  for(var c=0;c<cases.length;c++){var k=cases[c],arr=J.newArray({base:'int'},0);arr.a=k.input.slice();
    var want=k.input.slice().reverse(),label='{'+k.input.join(', ')+'}';
    var r=J.run(prog,{name:'reverse',args:[arr],check:sig});
    if(r.status==='problem'){return {status:'limit',problems:r.problems,lines:['Not run: '+r.problems[0].msg],summary:'Not run. 1 problem still open.',goals:{},feedback:'Not run yet: '+api_esc(r.problems[0].msg)};}
    if(r.status==='exception'){status='exception';lines.push('reverse('+label+')\n    '+J.exceptionText(r.err,'Reverse.reverse'));fb.push(label+' threw '+r.err.type+' at line '+r.err.line+(r.err.type==='ArrayIndexOutOfBoundsException'?': an index reached past the last element. Check where right starts.':'.'));break;}
    if(r.status==='stopped'){status='stopped';lines.push('reverse('+label+')\n    Stopped: '+r.err.msg);fb.push('The run on '+label+' stopped: '+r.err.msg);break;}
    var got='{'+arr.a.join(', ')+'}',ok=got==='{'+want.join(', ')+'}';
    lines.push('reverse('+label+') -> '+got+(ok?'   matches':'   expected {'+want.join(', ')+'}'));
    if(ok){if(k.name==='odd'||k.name==='even'){goals[k.name]=1;}else{edgeOk++;}}else{status='mismatch';fb.push(label+' became '+got+', not {'+want.join(', ')+'}.');}}
  if(edgeOk===2){goals.edge=1;}
  var all=goals.odd&&goals.even&&goals.edge;
  return {status:all?'pass':status,lines:lines,goals:goals,summary:all?'All examples reversed in place.':'Some examples do not match yet.',
   feedback:all?'Every example is reversed in place, and the one-element and empty arrays pass without an exception.':api_esc(fb.join(' '))};}}
,
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>Writing through <code>scores[i]</code> for every index from 0 while <code>i &lt; scores.length</code> changes each element in the array.</p>',
  why:{a:'s is a copy of each value; adding to it leaves the array unchanged.',b:'it writes through every index from 0 to length - 1, so each element changes.',c:'the last pass uses index scores.length, which throws ArrayIndexOutOfBoundsException.',d:'it starts at index 1, so the first element never changes.'},
  miss:{a:'The enhanced for loop gives you a copy of each value, so the array never changes.',c:'With &lt;=, the last pass uses index scores.length, one past the end, and throws ArrayIndexOutOfBoundsException.',d:'Starting at 1 skips the first element, index 0.'},
  hint:'Look for the loop that writes through an index and visits exactly 0 to length - 1.'},
 B:{fs:'apply-b',correct:'b',reveal:'The enhanced for loop <code>for (String n : names)</code> fits: it reads each name once, in order, and needs no index.',
  why:{a:'it starts at index names.length, one past the end, so the first pass throws ArrayIndexOutOfBoundsException.',b:'it reads every name once, in order, with no index to get wrong.',c:'a step of 2 prints only every second name.',d:'i never changes, so the loop prints the first name forever.'}}}
};
function api_esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
