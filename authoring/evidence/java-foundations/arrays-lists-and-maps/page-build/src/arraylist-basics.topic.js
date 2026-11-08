/* Topic data and handlers for ArrayList basics. Every output and message matches a real JDK run. */
var TOPIC={
predict:{correct:'a',why:{
 a:'with an int argument, remove(1) removes the element at index 1, which is 20; 30 shifts left into its place.',
 b:'remove(1) does not look for the value 1; with an int argument it removes by index.',
 c:'index 1 is the second element; removing index 0 would have taken out 10.',
 d:'it compiles: List has both remove(int index) and remove(Object o), and an int argument picks remove by index.'}},
explore:{
 reset:function(api){api.s.x={a:['Ada','Ben','Cy'],i:0};},
 render:function(api){var x=api.s.x;if(!x||!x.a){return;}
  var h=x.a.map(function(v,k){return '<li'+(k===x.i?' class="is-on"':'')+'><span class="v">'+api.esc(v)+'</span><span class="i">['+k+']</span>'+(k===x.i?'<span class="tag">i</span>':'')+'</li>';}).join('');
  var cells=api.$('list-cells');if(cells.innerHTML!==h){cells.innerHTML=h;}
  api.$('list-size').textContent='size() is '+x.a.length+(x.a.length?', so valid indexes are 0 to '+(x.a.length-1)+'.':', so there is no valid index.');
  var o=api.$('ls-i');if(o){o.textContent='i = '+x.i;}},
 on:function(act,btn,api){var x=api.s.x,a=x.a,out=api.$('out-ls'),call,res,msg,n=a.length;
  if(act==='dec'){x.i=Math.max(-1,x.i-1);api.render();return;}
  if(act==='inc'){x.i=Math.min(9,x.i+1);api.render();return;}
  api.s.attempts++;
  function oob(i){return 'Exception in thread "main" java.lang.IndexOutOfBoundsException: Index '+i+' out of bounds for length '+n;}
  if(act==='add'){if(n>=8){msg='This explorer keeps the list to 8 names; remove one first.';call='names.add("Dee")';res='(not run)';}
    else{a.push('Dee');call='names.add("Dee")';res='true';msg='Appended at index '+n+'; size() is now '+a.length+'.';api.goal('grow');}}
  else if(act==='insert'){if(n>=8){msg='This explorer keeps the list to 8 names; remove one first.';call='names.add(0, "Zed")';res='(not run)';}
    else{a.unshift('Zed');call='names.add(0, "Zed")';res='(no return value)';msg='Inserted at index 0: every other element moved up one index.';api.goal('grow');api.goal('shift');}}
  else if(act==='remove'){call='names.remove(0)';if(!n){res=oob(0);msg='The list is empty, so index 0 does not exist.';}
    else{res='"'+a.shift()+'"';msg='Removed index 0: every other element moved down one index.';api.goal('shift');}}
  else if(act==='set'){call='names.set(1, "Bo")';if(n<2){res=oob(1);msg='Index 1 does not exist in a list of size '+n+'.';}
    else{res='"'+a[1]+'"';a[1]='Bo';msg='set replaced index 1 and returned the old element; the size did not change.';api.goal('set');}}
  else if(act==='size'){call='names.size()';res=String(n);msg='The list holds '+n+' element'+(n===1?'':'s')+'.';}
  else if(act==='get'){call='names.get('+x.i+')';if(x.i>=0&&x.i<n){res='"'+a[x.i]+'"';msg='Index '+x.i+' holds '+a[x.i]+'.';}
    else{res=oob(x.i);msg='Index '+x.i+' is outside 0 to '+(n-1)+', so get throws.';api.goal('oob');}}
  out.textContent=call+'\n'+res+(/^(add|insert|remove|set)$/.test(act)?'\nnames is now ['+a.join(', ')+']':'');
  if(x.i>=a.length+2){x.i=a.length;}
  var left=api.left();
  api.feedback('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 4 checks still open.':'<strong>All checks done.</strong>'+(api.s.completed?'':api.nextNote()))+'</p>');
  if(!left&&!api.s.completed){api.finish();}else{api.render();}}},
code:{file:'Scores.java',mode:'statements',
 startNote:'fix the first line and write the numbered steps first.',
 starter:'List<int> scores = new ArrayList<>();\n// 1. Fix the line above so it compiles.\n// 2. Add the scores 70, 85 and 90, in that order.\n\n// 3. Change 85 to 88 with set.\n\n// 4. Remove the first score.\n\n// 5. Print the size, then the score now at index 0.\n',
 evaluate:function(prog,J){
  var r=J.run(prog,null),lines=[],goals={type:1},fb=[];
  var printed=J.printed(r.out||[]);
  lines.push('Printed:');lines.push(printed?printed.replace(/\n$/,'').split('\n').map(function(l){return '    '+l;}).join('\n'):'    (nothing)');
  if(r.status==='problem'){return {status:'limit',problems:r.problems,lines:['Not run: '+r.problems[0].msg],summary:'Not run. 1 problem still open.',goals:{},feedback:'Not run yet: '+api_esc(r.problems[0].msg)};}
  if(r.status==='exception'){lines.push(J.exceptionText(r.err,'Scores.main'));
    return {status:'exception',lines:lines,goals:goals,summary:'Run stopped with '+r.err.type+'.',feedback:api_esc('The run threw '+r.err.type+' at line '+r.err.line+': '+r.err.msg+(r.err.type==='IndexOutOfBoundsException'?' Check which indexes exist at that moment: removing or inserting shifts them.':''))};}
  if(r.status==='stopped'){lines.push('Stopped: '+r.err.msg);return {status:'stopped',lines:lines,goals:goals,summary:'Run stopped.',feedback:api_esc(r.err.msg)};}
  var slot=r.result.find('scores'),list=slot&&slot.val;
  if(!list||list.k!=='list'){return {status:'mismatch',lines:lines,goals:goals,summary:'scores is missing.',feedback:'Keep the variable named scores from the starter.'};}
  var ops=r.trace||[],usedSet=ops.some(function(x){return x.kind==='list'&&x.method==='set'&&x.receiver===list;}),usedRemove=ops.some(function(x){return x.kind==='list'&&x.method==='remove'&&x.receiver===list;});
  if(usedSet&&usedRemove){goals.operations=1;}else{fb.push('Use the requested set and remove operations on scores; matching only the final values and output does not complete those steps.');}
  var shown=J.show(list);lines.push('scores at the end: '+shown+(shown==='[88, 90]'?'   matches':'   expected [88, 90]'));
  if(shown==='[88, 90]'){goals.state=1;}else{fb.push('scores ends as '+shown+', not [88, 90].'+(shown==='[85, 90]'?' Was 85 replaced with set before the first score was removed?':'')+(shown==='[70, 88]'||shown==='[70, 90]'?' Which element does remove(0) take out?':''));}
  if(printed==='2\n88\n'){goals.output=1;}else{fb.push('The code printed '+(printed?JSON.stringify(printed.replace(/\n$/,'').split('\n').join(' then ')):'nothing')+'; the task asks for 2, then 88, each with println.');}
  var all=goals.operations&&goals.state&&goals.output;
  return {status:all?'pass':'mismatch',lines:lines,goals:goals,summary:all?'All checks pass.':'Some checks do not match yet.',feedback:all?'The declaration compiles, the requested set and remove operations run, scores ends as [88, 90], and the code prints 2 and then 88.':'The declaration now compiles. '+api_esc(fb.join(' '))};}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>Replies arrive over the month, so the count changes: an <code>ArrayList</code> grows with <code>add</code> as each guest replies.</p>',
  why:{a:'there are always exactly 7 day names, so a fixed-size array fits.',b:'the number of guests changes as replies arrive, which is what an ArrayList is for.',c:'a year always has 12 monthly totals, so a fixed-size array of int fits.',d:'a tic-tac-toe board always has 9 squares, so a fixed-size array fits.'},
  miss:{a:'A week always has 7 days, so the count never changes; an array fits.',c:'There are always 12 months, so an array of 12 totals fits.',d:'The board always has 9 squares, so an array fits.'},
  hint:'Look for the collection whose number of items you cannot know when the program starts.'},
 B:{fs:'apply-b',correct:'c',reveal:'The 4 seasons never change in number, so a fixed-size array fits them best.',
  why:{a:'a playlist grows and shrinks as songs are added and removed: an ArrayList.',b:'results that grow as pages load change size: an ArrayList.',c:'there are always exactly 4 seasons, so a fixed-size array fits.',d:'a cart gains and loses items: an ArrayList.'}}}
};
function api_esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
