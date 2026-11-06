/* lesson-editor comprehension adapter, version 1. A bounded evaluator for one supplied exercise: rewrite a loop as a
   list comprehension and build a set or dict comprehension over prices = [4, 12, 12, 30]. It reads only a list
   comprehension in square brackets, or a set or dict (key: value) comprehension in curly braces, each with one for
   part over prices and at most one if comparison, where value, key and condition use the loop name, whole numbers,
   + - * // %, parentheses and one comparison. Anything else is reported
   as a lesson limit, never as invalid Python. Errors are reserved for patterns CPython certainly rejects. */
var LESSON_EDITOR_COMPREHENSION=(function(){
var PRICES=[4,12,12,30];
function problem(line,col,kind,msg){return {line:line,col:col||1,kind:kind,msg:msg};}
function LimitErr(msg){this.msg=msg;}
function SynErr(msg){this.msg=msg;}
function tokens(text){
  var out=[],i=0,re=/\s*(?:(\d+)|([A-Za-z_][A-Za-z_0-9]*)|(\/\/|\*\*|==|!=|<=|>=|[-+*\/%<>=:()\[\]{},.])|(\S))/y,m;
  while(i<text.length){re.lastIndex=i;m=re.exec(text);if(!m){break;}
    if(m[0].trim()===''){break;}
    if(m[1]!==undefined){out.push({t:'num',v:m[1]});}
    else if(m[2]!==undefined){out.push({t:/^(for|in|if|else|and|or|not|lambda|True|False|None)$/.test(m[2])?'kw':'name',v:m[2]});}
    else if(m[3]!==undefined){out.push({t:'op',v:m[3]});}
    else{out.push({t:'bad',v:m[4]});}
    i=re.lastIndex;}
  return out;}
function balance(ts){var st=[],pair={')':'(',']':'[','}':'{'};
  for(var i=0;i<ts.length;i++){var v=ts[i].v;if(ts[i].t!=='op'){continue;}
    if(v==='('||v==='['||v==='{'){st.push(v);}
    else if(pair[v]){if(st.pop()!==pair[v]){throw new SynErr('Close every bracket with its matching partner.');}}}
  if(st.length){throw new SynErr('Close the '+st[st.length-1]+' bracket.');}}
function parseComp(ts){
  var i=0;function peek(){return ts[i]||{t:'end',v:''};}function next(){return ts[i++]||{t:'end',v:''};}
  function is(v){var p=peek();return (p.t==='op'||p.t==='kw')&&p.v===v;}
  function want(v,msg){if(!is(v)){throw new LimitErr(msg);}next();}
  function expr(){var n=term();while(is('+')||is('-')){var o=next().v;n={op:o,a:n,b:term()};}return n;}
  function term(){var n=factor();while(is('*')||is('//')||is('%')){var o=next().v;n={op:o,a:n,b:factor()};}
    if(is('/')||is('**')){throw new LimitErr('This practice editor works with whole numbers: use * // or %, not / or **.');}return n;}
  function factor(){var p=peek();
    if(is('-')||is('+')){next();return {op:'u'+p.v,a:factor()};}
    if(is('(')){next();var e=expr();want(')','Close the parenthesis.');return e;}
    if(p.t==='num'){next();if(p.v.length>1&&p.v[0]==='0'&&/[1-9]/.test(p.v)){throw new SynErr('Python does not allow leading zeros in a whole number such as '+p.v+'.');}return {num:+p.v};}
    if(p.t==='name'){next();return {name:p.v};}
    throw new LimitErr('This practice editor reads only the loop name, whole numbers, + - * // % and parentheses in a value or condition.');}
  var open=next();
  if(open.t!=='op'||(open.v!=='['&&open.v!=='{')){throw new LimitErr('Write a comprehension that starts with [ or {.');}
  if((open.v==='['&&is(']'))||(open.v==='{'&&is('}'))){throw new LimitErr('Write a comprehension, not an empty display.');}
  var key=null,val=expr();
  if(is(':')){if(open.v==='['){throw new SynErr('key: value builds a dict, so it needs curly braces { }, not [ ].');}next();key=val;val=expr();}
  if(is(',')){throw new LimitErr('Write a comprehension with for, not a list of finished values.');}
  if(is('if')){throw new LimitErr('Put the if filter after the for part, just before the closing bracket.');}
  want('for','A comprehension needs a for part after its value: for, then the loop name, then in prices.');
  var v=next();if(v.t!=='name'){throw new LimitErr('After for, name the loop variable, such as p.');}
  want('in','After for '+v.v+', write in prices.');
  var src=next();if(src.t!=='name'||src.v!=='prices'){throw new LimitErr('Loop over prices in this exercise.');}
  var cond=null;
  if(is('if')){next();var a=expr(),p=peek();
    if(p.t==='op'&&p.v==='='){throw new SynErr('Use == to compare; a single = assigns and is not allowed here.');}
    if(p.t==='op'&&/^(==|!=|<|<=|>|>=)$/.test(p.v)){next();cond={op:p.v,a:a,b:expr()};
      var q=peek();if(q.t==='op'&&/^(==|!=|<|<=|>|>=)$/.test(q.v)){throw new LimitErr('Use one comparison in the filter in this practice editor.');}}
    else{throw new LimitErr('Write the filter as one comparison, such as if p > 10.');}}
  if(is('for')||is('if')||is('and')||is('or')){throw new LimitErr('Use one for part and at most one comparison in this practice editor.');}
  var close=next();
  if(close.t!=='op'||close.v!==(open.v==='['?']':'}')){throw new LimitErr('End the comprehension right after its for part and optional filter.');}
  if(i<ts.length){throw new LimitErr('Write only the comprehension after the = sign.');}
  var kind=open.v==='['?'list':(key?'dict':'set');
  function names(n,acc){if(!n){return acc;}if(n.name){acc.push(n.name);}names(n.a,acc);names(n.b,acc);return acc;}
  var used=names(val,names(key,names(cond,[])));
  for(var k=0;k<used.length;k++){if(used[k]!==v.v){throw new LimitErr('Use only the loop name '+v.v+' inside this comprehension; '+used[k]+' is outside this practice editor.');}}
  return {kind:kind,key:key,val:val,cond:cond,name:v.v};}
function floordiv(a,b){if(b===0){throw {py:'ZeroDivisionError: division by zero'};}return Math.floor(a/b);}
function mod(a,b){if(b===0){throw {py:'ZeroDivisionError: division by zero'};}var r=a%b;return (r!==0&&(r<0)!==(b<0))?r+b:r;}
function ev(n,x){if(n.num!==undefined){return n.num;}if(n.name){return x;}
  var a=ev(n.a,x);if(n.op==='u-'){return -a;}if(n.op==='u+'){return a;}var b=ev(n.b,x),r;
  switch(n.op){case '+':r=a+b;break;case '-':r=a-b;break;case '*':r=a*b;break;case '//':r=floordiv(a,b);break;case '%':r=mod(a,b);break;
    case '==':return a===b;case '!=':return a!==b;case '<':return a<b;case '<=':return a<=b;case '>':return a>b;case '>=':return a>=b;}
  if(!Number.isSafeInteger(r)){throw {limit:'That number is too large for this practice editor.'};}return r;}
function evalComp(c){var items=[],keys=[],vals={};
  for(var i=0;i<PRICES.length;i++){var x=PRICES[i];if(c.cond&&!ev(c.cond,x)){continue;}
    if(c.kind==='dict'){var k=ev(c.key,x),v=ev(c.val,x);if(!(String(k) in vals)){keys.push(k);}vals[String(k)]=v;}
    else{var w=ev(c.val,x);if(c.kind==='list'||items.indexOf(w)<0){items.push(w);}}}
  if(c.kind==='dict'){return {kind:'dict',keys:keys,vals:keys.map(function(k){return vals[String(k)];})};}
  return {kind:c.kind,items:items};}
function show(r){
  if(r.kind==='list'){return '['+r.items.join(', ')+']';}
  if(r.kind==='dict'){return '{'+r.keys.map(function(k,i){return k+': '+r.vals[i];}).join(', ')+'}';}
  if(!r.items.length){return 'set()';}
  return 'a set of '+r.items.length+' item'+(r.items.length===1?'':'s')+': '+r.items.slice().sort(function(a,b){return a-b;}).join(', ')+' (sorted here; a set has no display order to rely on)';}
function same(r,want){return JSON.stringify(r)===JSON.stringify(want);}
var WANT_LIST={kind:'list',items:[24,24,60]},WANT_SET={kind:'set',items:[24,60]},WANT_DICT={kind:'dict',keys:[12,30],vals:[24,60]};
function check(src){
  var raw=String(src).replace(/\r\n?/g,'\n').split('\n'),problems=[],stmts={},order=[];
  for(var n=0;n<raw.length;n++){
    var text=raw[n],hash=text.indexOf('#');
    if(/["']/.test(hash<0?text:text.slice(0,hash))){problems.push(problem(n+1,1,'limit','Strings are outside this practice editor; this exercise uses only numbers.'));continue;}
    if(hash>=0){text=text.slice(0,hash);}
    if(!text.trim()){continue;}
    if(/^\s/.test(text)){problems.push(problem(n+1,1,'error','Unexpected indent: top-level statements start at the first column.'));continue;}
    var m=/^([A-Za-z_][A-Za-z_0-9]*)\s*=(?!=)\s*(.*)$/.exec(text);
    if(!m){problems.push(problem(n+1,1,'limit','This file holds three assignments: prices, result and doubled.'));continue;}
    var name=m[1],rhs=m[2].trim();
    if(name!=='prices'&&name!=='result'&&name!=='doubled'){problems.push(problem(n+1,1,'limit','Assign only prices, result and doubled in this exercise.'));continue;}
    if(stmts[name]){problems.push(problem(n+1,1,'limit','Assign '+name+' only once.'));continue;}
    order.push(name);stmts[name]={line:n+1,rhs:rhs,col:text.indexOf(rhs)+1};
    if(/\b___\b/.test(rhs)){problems.push(problem(n+1,stmts[name].col,'limit','Replace the ___ placeholder with your comprehension.'));continue;}
    if(name==='prices'){if(rhs.replace(/\s+/g,'')!=='[4,12,12,30]'){problems.push(problem(n+1,stmts[name].col,'limit','Keep the supplied prices line: prices = [4, 12, 12, 30].'));}continue;}
    try{var ts=tokens(rhs);for(var b=0;b<ts.length;b++){if(ts[b].t==='bad'){throw new LimitErr('The character '+ts[b].v+' is outside this practice editor.');}}
      balance(ts);stmts[name].comp=parseComp(ts);}
    catch(e){if(e instanceof SynErr){problems.push(problem(n+1,stmts[name].col,'error',e.msg));}else if(e instanceof LimitErr){problems.push(problem(n+1,stmts[name].col,'limit',e.msg));}else{throw e;}}}
  ['prices','result','doubled'].forEach(function(k){if(!stmts[k]){problems.push(problem(raw.length,1,'limit','Keep the '+k+' line from the starter.'));}});
  if(order.length===3&&order[0]!=='prices'){problems.push(problem(stmts[order[0]].line,1,'limit','Keep prices as the first line, so the comprehensions can use it.'));}
  if(stmts.result&&stmts.result.comp&&stmts.result.comp.kind!=='list'){problems.push(problem(stmts.result.line,stmts.result.col,'limit','result must be a list comprehension: use square brackets [ ].'));}
  if(stmts.doubled&&stmts.doubled.comp&&stmts.doubled.comp.kind==='list'){problems.push(problem(stmts.doubled.line,stmts.doubled.col,'limit','doubled must be a set or dict comprehension: use curly braces { }.'));}
  return {problems:problems,program:stmts};}
function notRun(problems){var err=problems.filter(function(p){return p.kind==='error';}).length;
  return {status:err?'syntax':'limit',lines:['Not run: '+problems.length+' problem'+(problems.length===1?'':'s')+' to fix first.'+(err?' Python would reject this file before running any of it.':'')],summary:'Not run. '+problems.length+' problem'+(problems.length===1?'':'s')+' still open.'};}
function run(stmts){var lines=['prices = [4, 12, 12, 30]'],results=[],bad=null;
  ['result','doubled'].forEach(function(name){if(bad){return;}var c=stmts[name].comp,r;
    try{r=evalComp(c);}catch(e){bad=e.py?{name:name,msg:e.py,kind:'runtime'}:{name:name,msg:e.limit,kind:'limit'};return;}
    var ok=name==='result'?same(r,WANT_LIST):(same(r,WANT_SET)||same(r,WANT_DICT));
    lines.push(name+' = '+stmts[name].rhs);lines.push('    '+show(r)+(ok?'   matches':'   expected '+(name==='result'?'[24, 24, 60], the loop\'s result':'{24, 60} as a set, or {12: 24, 30: 60} as a dict')));
    results.push({name:name,kind:r.kind,ok:ok,shown:show(r)});});
  if(bad){lines.push((bad.kind==='runtime'?'Traceback: ':'Stopped: ')+bad.msg+' (while building '+bad.name+')');
    return {status:bad.kind==='runtime'?'runtime':'stopped',lines:lines,results:results,summary:bad.kind==='runtime'?'Run stopped with '+bad.msg+'.':'Run stopped at a lesson limit.'};}
  var all=results.every(function(r){return r.ok;});
  return {status:all?'pass':'mismatch',lines:lines,results:results,summary:all?'Both comprehensions match.':(results.filter(function(r){return !r.ok;}).length)+' of 2 comprehensions do not match yet.'};}
return {id:'python-comprehension',version:'1',language:'Python',kindLabels:{error:'Error',limit:'Lesson check',hint:'Hint'},
  check:check,notRun:notRun,run:function(program){return run(program);},evalComp:evalComp,parseComp:parseComp,tokens:tokens,show:show};
})();
