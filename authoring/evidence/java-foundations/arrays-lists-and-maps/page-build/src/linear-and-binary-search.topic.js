/* Topic data and handlers for Linear and binary search. Every trace and result matches a real JDK run. */
var TOPIC={
predict:{correct:'a',why:{
 a:'each look halves what is left (1,000, 500, 250, 125, 63, 32, 16, 8, 4, 2, 1), so about ten looks find the name or rule it out.',
 b:'halving shrinks the range far faster than that: after 10 looks fewer than one name is left.',
 c:'about 500 is the typical cost of checking names one by one from the start, not of halving.',
 d:'1,000 is the worst case of checking every name one by one; halving never needs that many.'}},
code:{file:'Search.java',mode:'methods',
 startNote:'add a loop above return -1; first.',
 starter:'static int indexOf(int[] a, int target) {\n    // return the first index where a holds target, or -1\n\n    return -1;\n}\n',
 evaluate:function(prog,J){
  var A=[4,8,15,16,23,42],cases=[{a:A,t:15,w:2,g:'found'},{a:A,t:4,w:0,g:'found'},{a:A,t:42,w:5,g:'found'},{a:A,t:7,w:-1,g:'missing'},{a:[],t:1,w:-1,g:'missing'},{a:[5,3,5],t:5,w:0,g:'first'}];
  var lines=[],ok={found:0,missing:0,first:0},need={found:3,missing:2,first:1},status='pass',fb=[];
  function sig(m,ty){if(ty(m.ret)!=='int'||m.params.length!==2||ty(m.params[0].type)!=='int[]'||ty(m.params[1].type)!=='int'){return 'Keep the first line from the starter: static int indexOf(int[] a, int target).';}return null;}
  for(var c=0;c<cases.length;c++){var k=cases[c],arr=J.newArray({base:'int'},0);arr.a=k.a.slice();
    var label='indexOf({'+k.a.join(', ')+'}, '+k.t+')',r=J.run(prog,{name:'indexOf',args:[arr,k.t],check:sig});
    if(r.status==='problem'){return {status:'limit',problems:r.problems,lines:['Not run: '+r.problems[0].msg],summary:'Not run. 1 problem still open.',goals:{},feedback:'Not run yet: '+api_esc(r.problems[0].msg)};}
    if(r.status==='exception'){status='exception';lines.push(label+'\n    '+J.exceptionText(r.err,'Search.indexOf'));fb.push(label+' threw '+r.err.type+' at line '+r.err.line+'.');break;}
    if(r.status==='stopped'){status='stopped';lines.push(label+'\n    Stopped: '+r.err.msg);fb.push('The run stopped: '+r.err.msg);break;}
    var good=r.result===k.w;lines.push(label+' -> '+r.result+(good?'   matches':'   expected '+k.w));
    if(good){ok[k.g]++;}else{status='mismatch';fb.push(label+' gave '+r.result+', not '+k.w+'.'+(k.w===-1?' -1 should come only after every index has been checked.':(r.result===-1?' Is -1 returned before the loop reaches index '+k.w+'?':'')));}}
  var goals={};Object.keys(need).forEach(function(g){if(ok[g]===need[g]){goals[g]=1;}});
  var all=goals.found&&goals.missing&&goals.first;
  return {status:all?'pass':status,lines:lines,goals:goals,summary:all?'Every call matches.':'Some calls do not match yet.',
   feedback:all?'Every call returns the first matching index, or -1 after checking every element.':api_esc(fb.join(' '))};}},
explore:{
 A:[3,7,11,15,19,23,27,31,36,41,45,52,58,63,70,77],
 reset:function(api){api.s.x={t:null,low:0,high:15,checks:0,done:false,log:[]};},
 mid:function(x){return Math.floor((x.low+x.high)/2);},
 render:function(api){var x=api.s.x,A=this.A,self=this;if(!x){return;}var m=x.low<=x.high?self.mid(x):-1;
  var h=A.map(function(v,k){var cls=[],tags=[];if(x.t!==null&&(k<x.low||k>x.high)){cls.push('is-out');}
    if(x.t!==null&&k===m&&!x.done){cls.push('is-mid');}if(x.t!==null&&x.done==='found'&&k===m){cls.push('is-on');}
    if(x.t!==null){if(k===x.low){tags.push('low');}if(k===m&&x.low<=x.high){tags.push('mid');}if(k===x.high){tags.push('high');}}
    return '<li'+(cls.length?' class="'+cls.join(' ')+'"':'')+'><span class="v">'+v+'</span><span class="i">['+k+']</span>'+(tags.length?'<span class="tag">'+tags.join(' ')+'</span>':'')+'</li>';}).join('');
  var cells=api.$('bs-cells');if(cells.innerHTML!==h){cells.innerHTML=h;}
  api.$('bs-bounds').textContent=x.t===null?'Choose a target to start.':(x.done?('Target '+x.t+(x.done==='found'?' found at index '+m:' is missing')+' after '+x.checks+' check'+(x.checks===1?'':'s')+'.'):(x.low<=x.high?'Target '+x.t+': low = '+x.low+', high = '+x.high+', mid = '+m+', and a[mid] is '+A[m]+'.':'Target '+x.t+': low = '+x.low+' is now greater than high = '+x.high+'.'));},
 onInput:function(el,api){if(el.name!=='bs-target'){return;}var x=api.s.x;x.t=+el.value;x.low=0;x.high=15;x.checks=0;x.done=false;x.log=[];
  var out=api.$('out-bs');if(out){out.textContent='target = '+x.t+'\nlow = 0, high = 15';}api.render();},
 on:function(act,btn,api){var x=api.s.x,A=this.A;
  if(x.t===null){api.feedback('<p>Choose a target first.</p>');return;}
  if(x.done){api.feedback('<p>This trace is finished. Choose another target to trace again.</p>');return;}
  api.s.attempts++;
  var live=x.low<=x.high,m=live?this.mid(x):-1,v=live?A[m]:null,right=!live?'missing':(v===x.t?'found':(x.t>v?'higher':'lower')),msg;
  if(act!==right){var why={higher:'the target '+x.t+' is larger than a[mid] = '+v+', so everything up to mid is too small.',lower:'the target '+x.t+' is smaller than a[mid] = '+v+', so everything from mid on is too big.',found:'a[mid] = '+v+' is the target.',missing:'low = '+x.low+' has passed high = '+x.high+', so nothing is left to check.'};
    api.feedback('<p>Not that step: '+api.esc(why[right])+' Nothing changed; try the step that matches.</p>');return;}
  if(live){x.checks++;}
  if(act==='higher'){x.low=m+1;x.log.push('mid '+m+' holds '+v+': '+x.t+' is larger, low = '+x.low);}
  else if(act==='lower'){x.high=m-1;x.log.push('mid '+m+' holds '+v+': '+x.t+' is smaller, high = '+x.high);}
  else if(act==='found'){x.done='found';x.log.push('mid '+m+' holds '+v+': found at index '+m);api.goal('present');}
  else{x.done='missing';x.log.push('low '+x.low+' > high '+x.high+': '+x.t+' is missing, return -1');api.goal('missing');}
  api.$('out-bs').textContent='target = '+x.t+'\n'+x.log.join('\n');
  msg=x.done?('Done in '+x.checks+' check'+(x.checks===1?'':'s')+'. Linear search would need '+(x.done==='found'?(A.indexOf(x.t)+1):16)+'.'):'Correct step. '+(x.low<=x.high?'Read the new a[mid].':'Now low is greater than high.');
  var left=api.left();
  api.feedback('<p>'+api.esc(msg)+'</p><p>'+(left?left+' of 2 checks still open.'+(api.s.g.present&&!api.s.g.missing?' Trace target 40 next.':''):'<strong>All checks done.</strong>'+(api.s.completed?'':api.nextNote()))+'</p>');
  if(!left&&!api.s.completed){api.finish();}else{api.render();}}},
apply:{A:{fs:'apply-a',correct:'c',okNote:'<p>Comparing the target with the middle value tells you which half to discard only when the array is sorted.</p>',
  why:{a:'on unsorted input it can discard the half that holds the target and report a present value as missing.',b:'each check halves the range, so doubling the length adds about one check.',c:'the comparison with a[mid] decides which half to throw away, which is safe only for sorted input.',d:'a target at index 0 takes linear search one check, while binary search starts in the middle.'},
  miss:{a:'On unsorted input, binary search can throw away the half that holds the target and wrongly report it missing.',b:'Halving means doubling the array adds only about one extra check.',d:'Not always: if the target is the first element, linear search finds it with a single check.'},
  hint:'Ask what the comparison with the middle value relies on.'},
 B:{fs:'apply-b',correct:'b',reveal:'About 20 checks: 2 to the power 20 is about 1,000,000, so a thousand times more elements adds only about ten halvings.',
  why:{a:'11 would fit only one doubling; a thousand times more data is about ten doublings.',b:'2 to the power 20 is about a million, so about 20 halvings reach one element.',c:'10,000 would mean the checks grew a thousand times, like linear search; halving grows far slower.',d:'1,000,000 is linear search checking every element.'}}}
};
function api_esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
