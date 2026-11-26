/* lesson-editor@3 shell.js head */
/* lesson-editor shell, version 1. Language-neutral editor chrome and behaviour: gutter, Problems and Output
   panels, status bar, Run (button, Enter or Space on the button, Ctrl+Enter or Cmd+Enter in the code),
   Reset, keyboard model and live announcements. All language behaviour comes from an adapter object.
   No form submission, no storage, no network, no timers beyond a short input debounce. */
var LESSON_EDITOR=(function(){
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function plural(n,w){return n+' '+w+(n===1?'':'s');}
function mount(root,cfg){
  var A=cfg.adapter,q=function(s){return root.querySelector(s);};
  var ta=q('.le-code'),gut=q('.le-gutter'),probList=q('.le-problems ul'),outEl=q('.le-output pre'),stat=q('.le-status'),pos=q('.le-pos'),cnt=q('.le-count'),live=q('.le-live'),runBtn=q('.le-run'),resetBtn=q('.le-reset');
  var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
  var escArmed=false,last={problems:[]},timer=null,broken=false;
  root.setAttribute('data-le-state','ready');
  function fail(where,e){broken=true;root.setAttribute('data-le-state','error');
    outEl.textContent='The editor hit an internal error while '+where+', so nothing was run. The exercise still stands: '+(cfg.fallbackText||'')+(e&&e.message?'\n('+e.message+')':'');
    select(1);live.textContent='Editor error; see Output.';}
  function lines(){return ta.value.split('\n').length;}
  function paintGutter(){var n=lines(),bad={};last.problems.forEach(function(p){if(!bad[p.line]||p.kind==='error'){bad[p.line]=p.kind;}});var h='';for(var i=1;i<=n;i++){h+='<span'+(bad[i]?' class="g-'+bad[i]+'"':'')+'>'+i+'</span>\n';}gut.innerHTML=h;gut.scrollTop=ta.scrollTop;}
  function caret(){var v=ta.value.slice(0,ta.selectionStart).split('\n');pos.textContent='Ln '+v.length+', Col '+(v[v.length-1].length+1);}
  function paintProblems(){var ps=last.problems,L=A.kindLabels;
    probList.innerHTML=ps.length?ps.map(function(p){return '<li class="p-'+p.kind+'"><button type="button" class="le-jump" data-line="'+p.line+'" data-col="'+p.col+'"><span class="le-ln">Ln '+p.line+'</span> <span class="le-kind">'+esc(L[p.kind]||p.kind)+'</span> '+esc(p.msg)+'</button></li>';}).join(''):'<li class="p-none">No problems found by the lesson checker.</li>';
    var e=ps.filter(function(p){return p.kind==='error';}).length;
    cnt.textContent=plural(e,'error')+', '+plural(ps.length-e,'simulator note');
    tabs[0].textContent='Problems ('+ps.length+')';}
  function analyse(){if(broken){return last;}try{last=A.check(ta.value);}catch(e){fail('checking the code',e);return last;}paintProblems();paintGutter();return last;}
  function select(i,focus){tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;root.querySelector('#'+t.getAttribute('aria-controls')).hidden=!on;});if(focus){tabs[i].focus();}}
  function disarm(){escArmed=false;stat.removeAttribute('data-esc');}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(i);});
    t.addEventListener('keydown',function(e){var k=e.key,n=tabs.length;
      if(k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();select((i+(k==='ArrowRight'?1:n-1))%n,true);}
      else if(k==='Home'){e.preventDefault();select(0,true);}else if(k==='End'){e.preventDefault();select(n-1,true);}});});
  probList.addEventListener('click',function(e){var b=e.target.closest('.le-jump');if(!b){return;}
    var ln=+b.getAttribute('data-line'),col=+b.getAttribute('data-col'),ls=ta.value.split('\n'),off=0;
    for(var i=0;i<ln-1&&i<ls.length;i++){off+=ls[i].length+1;}off+=Math.max(0,Math.min(col-1,(ls[ln-1]||'').length));
    ta.focus();ta.setSelectionRange(off,off);caret();});
  ta.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();disarm();doRun();return;}
    if(e.key==='Escape'){escArmed=true;stat.setAttribute('data-esc','1');return;}
    if(e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){if(escArmed){disarm();return;}
      e.preventDefault();var s=ta.selectionStart,v=ta.value,ls=v.lastIndexOf('\n',s-1)+1;
      if(e.shiftKey){var lead=/^ {0,4}/.exec(v.slice(ls))[0].length;if(lead){ta.value=v.slice(0,ls)+v.slice(ls+lead);var c=Math.max(ls,s-lead);ta.setSelectionRange(c,c);}}
      else{ta.setRangeText('    ',s,ta.selectionEnd,'end');}
      changed();return;}
    if(escArmed){disarm();}});
  function changed(){caret();paintGutter();clearTimeout(timer);timer=setTimeout(analyse,250);if(cfg.onChange){cfg.onChange(ta.value);}}
  ta.addEventListener('input',changed);
  ta.addEventListener('blur',disarm);
  ta.addEventListener('scroll',function(){gut.scrollTop=ta.scrollTop;});
  ['keyup','click','focus'].forEach(function(ev){ta.addEventListener(ev,caret);});
  function doRun(){if(broken){return null;}clearTimeout(timer);var a=analyse();if(broken){return null;}
    var rep;try{var stop=a.problems.filter(function(p){return p.kind!=='hint';}).length;rep=stop?A.notRun(a.problems):A.run(a.program,cfg.calls);}catch(e){fail('running the code',e);return null;}
    rep.problems=a.problems;
    outEl.textContent=['$ lesson-run '+cfg.file+'   (lesson simulator, not real '+A.language+')'].concat(rep.lines).join('\n');
    select(rep.status==='syntax'||rep.status==='limit'?0:1);
    live.textContent='';var msg=rep.summary;setTimeout(function(){live.textContent=msg;},30);
    if(cfg.onRun){cfg.onRun(rep,ta.value);}return rep;}
  runBtn.addEventListener('click',function(){doRun();});
  resetBtn.addEventListener('click',function(){set(cfg.starter);if(cfg.onChange){cfg.onChange(ta.value);}live.textContent='Code reset to the starting version.';});
  function set(v){ta.value=v;outEl.textContent='Press Run (or Ctrl+Enter in the editor) to check this file with the lesson simulator.';analyse();caret();select(0);}
  try{set(cfg.initial==null?cfg.starter:cfg.initial);}catch(e){fail('starting',e);}
  return {set:set,run:doRun,value:function(){return ta.value;}};}
return {id:'lesson-editor',version:'1',mount:mount};
})();
/* /lesson-editor shell.js */
/* lesson-editor SQL practice adapter, version 1. A bounded, deterministic evaluator for small PostgreSQL practice files
   over the lesson's own in-memory tables. It reads SELECT (joins, WHERE, GROUP BY, HAVING, ORDER BY, DISTINCT,
   aggregates, CASE, COALESCE, IN, EXISTS, BETWEEN, LIKE), INSERT ... VALUES or SELECT, UPDATE and DELETE with
   RETURNING, and enforces the tables' NOT NULL, primary key, unique and foreign key constraints with PostgreSQL's own
   messages. Output imitates psql's aligned format. Anything outside this subset is reported as a lesson limit,
   never as invalid SQL. Every Run starts again from the lesson's starting rows. No network, no storage. */
var LESSON_EDITOR_SQL=(function(){
var MAX_ROWS=5000;
function problem(line,col,kind,msg){return {line:line,col:col||1,kind:kind,msg:msg};}
function Limit(msg,line){this.msg=msg;this.line=line;}
function PgError(msg,detail){this.msg=msg;this.detail=detail||null;}
function lim(msg,t){throw new Limit(msg,t&&t.line);}
function pgerr(msg,detail){throw new PgError(msg,detail);}
/* Exact decimals for numeric columns: value = u / 10^s, with u a BigInt. */
function Num(u,s){this.u=u;this.s=s;}
function p10(n){var r=1n;for(var i=0;i<n;i++){r*=10n;}return r;}
function toNum(v){return v instanceof Num?v:new Num(BigInt(v),0);}
function rescale(a,s){if(s>=a.s){return new Num(a.u*p10(s-a.s),s);}return new Num(divRound(a.u,p10(a.s-s)),s);}
function divRound(n,d){var neg=(n<0n)!==(d<0n),an=n<0n?-n:n,ad=d<0n?-d:d,q=an/ad,r=an%ad;if(r*2n>=ad){q+=1n;}return neg?-q:q;}
function numStr(a){var neg=a.u<0n,s=(neg?-a.u:a.u).toString();if(a.s>0){while(s.length<=a.s){s='0'+s;}s=s.slice(0,s.length-a.s)+'.'+s.slice(s.length-a.s);}return (neg?'-':'')+s;}
function numCmp(a,b){var s=Math.max(a.s,b.s),x=rescale(a,s).u,y=rescale(b,s).u;return x<y?-1:(x>y?1:0);}
function weightFirst(a){/* PostgreSQL base-10000 weight and leading digit of |a| */
  var u=a.u<0n?-a.u:a.u;if(u===0n){return {w:0,f:0};}
  var s=u.toString(),ip=s.length>a.s?s.slice(0,s.length-a.s):'',fp=s.length>a.s?s.slice(s.length-a.s):s;
  while(fp.length<a.s){fp='0'+fp;}
  ip=ip.replace(/^0+/,'');
  if(ip.length){var g=Math.ceil(ip.length/4),lead=ip.length-4*(g-1);return {w:g-1,f:+ip.slice(0,lead)};}
  while(fp.length%4){fp+='0';}
  for(var k=0;k*4<fp.length;k++){var grp=+fp.slice(k*4,k*4+4);if(grp){return {w:-(k+1),f:grp};}}
  return {w:0,f:0};}
function numDiv(a,b){a=toNum(a);b=toNum(b);if(b.u===0n){pgerr('division by zero');}
  var x=weightFirst(a),y=weightFirst(b),qw=x.w-y.w;if(x.f<=y.f){qw--;}
  var rs=Math.min(Math.max(16-qw*4,a.s,b.s,0),1000);
  return new Num(divRound(a.u*p10(b.s+rs),b.u*p10(a.s)),rs);}
function numAdd(a,b,sign){a=toNum(a);b=toNum(b);var s=Math.max(a.s,b.s);return new Num(rescale(a,s).u+(sign<0?-1n:1n)*rescale(b,s).u,s);}
function numMul(a,b){a=toNum(a);b=toNum(b);return new Num(a.u*b.u,a.s+b.s);}
function parseNumLit(t){var m=/^(\d*)\.?(\d*)$/.exec(t);var ip=m[1]||'0',fp=m[2]||'';return new Num(BigInt(ip+fp),fp.length);}
/* Display text of one value, as psql prints it. */
function sig(x){return JSON.stringify(x,function(k,v){return typeof v==='bigint'?'b'+v.toString():v;});}
function show(v){if(v===null){return '';}if(v instanceof Num){return numStr(v);}if(v===true){return 't';}if(v===false){return 'f';}return String(v);}
function isNumType(t){return t==='int'||t==='num';}

/* ---------- Lexer ---------- */
var KW=('select distinct from where group by having order asc desc nulls first last join inner left outer on as and or not is null true false in exists between like case when then else end insert into values update set delete returning limit offset union intersect except with cross right full natural using all any some window over filter lateral fetch for create drop alter table truncate begin commit rollback grant revoke copy ilike similar').split(' ');
var KWS={};KW.forEach(function(k){KWS[k]=1;});
function lex(src){
  var out=[],i=0,line=1,col=1,n=src.length;
  function adv(k){for(var j=0;j<k;j++){if(src[i]==='\n'){line++;col=1;}else{col++;}i++;}}
  while(i<n){var c=src[i],rest;
    if(/\s/.test(c)){adv(1);continue;}
    if(c==='-'&&src[i+1]==='-'){while(i<n&&src[i]!=='\n'){adv(1);}continue;}
    if(c==='/'&&src[i+1]==='*'){var sl=line;adv(2);while(i<n&&!(src[i]==='*'&&src[i+1]==='/')){adv(1);}if(i>=n){out.push({t:'bad',v:'/*',line:sl,col:1,why:'Close the /* comment with */.'});break;}adv(2);continue;}
    var tl=line,tc=col;
    if(c==='\\'&&(col===1||/^\s*$/.test(src.slice(src.lastIndexOf('\n',i-1)+1,i)))){var e=src.indexOf('\n',i);e=e<0?n:e;out.push({t:'meta',v:src.slice(i,e).trim(),line:tl,col:tc});adv(e-i);continue;}
    if(c==="'"){var j=i+1,s='';while(j<n){if(src[j]==="'"){if(src[j+1]==="'"){s+="'";j+=2;continue;}break;}s+=src[j];j++;}
      if(j>=n){out.push({t:'bad',v:"'",line:tl,col:tc,why:'Close the text value with a matching single quote.'});break;}
      out.push({t:'str',v:s,line:tl,col:tc});adv(j+1-i);continue;}
    if(c==='"'){var k=src.indexOf('"',i+1);if(k<0){out.push({t:'bad',v:'"',line:tl,col:tc,why:'Close the quoted name with a matching double quote.'});break;}
      out.push({t:'id',v:src.slice(i+1,k),q:true,line:tl,col:tc});adv(k+1-i);continue;}
    rest=src.slice(i);var m;
    if((m=/^(\d+\.\d*|\.\d+|\d+)/.exec(rest))){out.push({t:m[1].indexOf('.')>=0?'dec':'int',v:m[1],line:tl,col:tc});adv(m[1].length);continue;}
    if((m=/^[A-Za-z_][A-Za-z_0-9$]*/.exec(rest))){var w=m[0].toLowerCase();out.push({t:KWS[w]?'kw':'id',v:w,line:tl,col:tc});adv(m[0].length);continue;}
    if((m=/^(<>|!=|<=|>=|\|\||::|[-+*\/%=<>(),.;\[\]])/.exec(rest))){out.push({t:'op',v:m[1],line:tl,col:tc});adv(m[1].length);continue;}
    out.push({t:'bad',v:c,line:tl,col:tc,why:'The character '+c+' is outside this practice editor.'});adv(1);}
  return out;}

/* ---------- Parser ---------- */
function Parser(ts){this.ts=ts;this.i=0;}
Parser.prototype={
  peek:function(k){return this.ts[this.i+(k||0)]||{t:'end',v:'',line:(this.ts.length?this.ts[this.ts.length-1].line:1)};},
  next:function(){return this.ts[this.i++]||this.peek();},
  is:function(v,k){var p=this.peek(k);return (p.t==='kw'||p.t==='op')&&p.v===v;},
  eat:function(v){if(this.is(v)){this.i++;return true;}return false;},
  want:function(v,msg){if(!this.eat(v)){var p=this.peek();lim(msg||('Expected '+v.toUpperCase()+(p.t==='end'?' before the end of the statement.':' near "'+p.v+'".')),p);}},
  ident:function(what){var p=this.peek();if(p.t==='id'){this.i++;return p.v;}lim('Expected '+what+(p.t==='end'?' before the end of the statement.':' near "'+p.v+'".'),p);},
  statement:function(){var p=this.peek(),st;
    if(this.is('select')){st=this.select();}
    else if(this.is('insert')){st=this.insert();}
    else if(this.is('update')){st=this.update();}
    else if(this.is('delete')){st=this.del();}
    else if(this.is('with')){lim('WITH queries are outside this practice editor.',p);}
    else if(p.t==='kw'&&/^(create|drop|alter|truncate)$/.test(p.v)){lim(p.v.toUpperCase()+' is not available here: this practice editor works only on the tables shown.',p);}
    else if(p.t==='kw'&&/^(begin|commit|rollback)$/.test(p.v)){lim('Transactions are outside this practice editor; each statement here runs on its own.',p);}
    else if(p.t==='kw'&&p.v==='copy'){lim('COPY runs on the database server and reads server files, so it is not available in this practice editor.',p);}
    else{lim('This practice editor runs SELECT, INSERT, UPDATE and DELETE statements; it could not read one starting "'+p.v+'".',p);}
    if(this.peek().t!=='end'){var q=this.peek();lim('This practice editor could not read the statement near "'+q.v+'". Check the commas, keywords and brackets.',q);}
    return st;},
  select:function(){var tok=this.peek();this.want('select');var q={type:'select',line:tok.line,distinct:false,items:[],from:[],where:null,group:[],having:null,order:[]};
    if(this.eat('distinct')){if(this.is('on')){lim('DISTINCT ON is outside this practice editor.',this.peek());}q.distinct=true;}else{this.eat('all');}
    q.items=this.items();
    if(this.eat('from')){q.from=this.fromList();}
    if(this.eat('where')){q.where=this.expr();}
    if(this.is('group')){this.next();this.want('by');do{q.group.push(this.expr());}while(this.eat(','));}
    if(this.eat('having')){q.having=this.expr();}
    if(this.is('order')){this.next();this.want('by');do{var e=this.expr(),o={e:e,desc:false,nulls:null};if(this.eat('desc')){o.desc=true;}else{this.eat('asc');}
      if(this.eat('nulls')){if(this.eat('first')){o.nulls='first';}else{this.want('last','Write NULLS FIRST or NULLS LAST.');o.nulls='last';}}q.order.push(o);}while(this.eat(','));}
    var p=this.peek();
    if(p.t==='kw'&&/^(limit|offset|fetch|union|intersect|except|window|for)$/.test(p.v)){lim(p.v.toUpperCase()+' is outside this practice editor.',p);}
    return q;},
  items:function(){var out=[];do{var p=this.peek();
      if(this.is('*')){this.next();out.push({star:true});continue;}
      if(p.t==='id'&&this.is('.',1)&&this.peek(2).t==='op'&&this.peek(2).v==='*'){this.i+=3;out.push({star:true,qual:p.v});continue;}
      var e=this.expr(),alias=null;
      if(this.eat('as')){var a=this.peek();if(a.t==='id'||a.t==='kw'){this.next();alias=a.v;}else{lim('Name the column after AS.',a);}}
      else if(this.peek().t==='id'){alias=this.next().v;}
      out.push({e:e,alias:alias});}while(this.eat(','));
    return out;},
  fromList:function(){var items=[this.fromItem(null)];
    for(;;){var p=this.peek();
      if(this.is(',')){lim('Join tables with JOIN ... ON in this practice editor, not with a comma.',p);}
      if(p.t==='kw'&&/^(cross|right|full|natural)$/.test(p.v)){lim(p.v.toUpperCase()+' JOIN is outside this practice editor; use JOIN or LEFT JOIN with ON.',p);}
      var kind=null;
      if(this.is('join')){this.next();kind='inner';}
      else if(this.is('inner')){this.next();this.want('join');kind='inner';}
      else if(this.is('left')){this.next();this.eat('outer');this.want('join');kind='left';}
      if(!kind){break;}
      var it=this.fromItem(kind);
      if(this.is('using')){lim('USING is outside this practice editor; write ON with the matching columns.',this.peek());}
      this.want('on','A JOIN needs ON and a condition in this practice editor.');it.on=this.expr();items.push(it);}
    return items;},
  fromItem:function(kind){var p=this.peek(),it={kind:kind,line:p.line};
    if(this.is('(')){lim('A subquery in FROM is outside this practice editor.',p);}
    if(this.is('lateral')){lim('LATERAL is outside this practice editor.',p);}
    var name=this.ident('a table name');
    if(this.is('(')){if(name!=='generate_series'){lim('The function '+name+' in FROM is outside this practice editor; only generate_series is available.',p);}
      this.next();var args=[this.expr()];while(this.eat(',')){args.push(this.expr());}this.want(')');it.fn=name;it.args=args;}
    it.name=name;it.alias=null;it.colAlias=null;
    if(this.eat('as')){it.alias=this.ident('a name after AS');}else if(this.peek().t==='id'){it.alias=this.next().v;}
    if(it.alias&&this.is('(')){if(!it.fn){lim('Column aliases on a table are outside this practice editor.',this.peek());}this.next();it.colAlias=this.ident('a column name');this.want(')');}
    return it;},
  insert:function(){var tok=this.peek();this.want('insert');this.want('into');var st={type:'insert',line:tok.line,table:this.ident('a table name'),cols:null,rows:null,query:null,returning:null};
    if(this.is('as')||this.peek().t==='id'){lim('A table alias in INSERT is outside this practice editor.',this.peek());}
    if(this.eat('(')){st.cols=[];do{st.cols.push(this.ident('a column name'));}while(this.eat(','));this.want(')');}
    if(this.eat('values')){st.rows=[];do{this.want('(','Put each row of VALUES in parentheses.');var r=[];do{r.push(this.is('default')?lim('DEFAULT is outside this practice editor.',this.peek()):this.expr());}while(this.eat(','));this.want(')');st.rows.push(r);}while(this.eat(','));}
    else if(this.is('select')){st.query=this.select();}
    else if(this.is('default')){lim('DEFAULT VALUES is outside this practice editor.',this.peek());}
    else{lim('After the table and columns, write VALUES or a SELECT.',this.peek());}
    if(this.is('on')){lim('ON CONFLICT is outside this practice editor.',this.peek());}
    if(this.eat('returning')){st.returning=this.items();}
    return st;},
  update:function(){var tok=this.peek();this.want('update');var st={type:'update',line:tok.line,table:this.ident('a table name'),alias:null,sets:[],where:null,returning:null};
    if(this.eat('as')){st.alias=this.ident('a name');}else if(this.peek().t==='id'){st.alias=this.next().v;}
    this.want('set','UPDATE needs SET, then column = value.');
    do{var c=this.ident('a column name');if(this.is('.')){lim('In SET, name the column alone, without a table prefix.',this.peek());}this.want('=','In SET, write column = value.');st.sets.push({col:c,e:this.expr()});}while(this.eat(','));
    if(this.is('from')){lim('UPDATE ... FROM is outside this practice editor.',this.peek());}
    if(this.eat('where')){st.where=this.expr();}
    if(this.eat('returning')){st.returning=this.items();}
    return st;},
  del:function(){var tok=this.peek();this.want('delete');this.want('from','Write DELETE FROM and the table name.');var st={type:'delete',line:tok.line,table:this.ident('a table name'),alias:null,where:null,returning:null};
    if(this.eat('as')){st.alias=this.ident('a name');}else if(this.peek().t==='id'){st.alias=this.next().v;}
    if(this.is('using')){lim('DELETE ... USING is outside this practice editor.',this.peek());}
    if(this.eat('where')){st.where=this.expr();}
    if(this.eat('returning')){st.returning=this.items();}
    return st;},
  /* Expressions, with PostgreSQL operator precedence. */
  expr:function(){return this.or();},
  or:function(){var a=this.and();while(this.eat('or')){a={op:'or',a:a,b:this.and()};}return a;},
  and:function(){var a=this.not();while(this.eat('and')){a={op:'and',a:a,b:this.not()};}return a;},
  not:function(){if(this.eat('not')){return {op:'not',a:this.not()};}return this.isx();},
  isx:function(){var a=this.cmp();
    while(this.is('is')){this.next();var neg=this.eat('not');
      if(this.eat('null')){a={op:neg?'isnotnull':'isnull',a:a};}
      else if(this.is('true')||this.is('false')){lim('IS TRUE and IS FALSE are outside this practice editor.',this.peek());}
      else if(this.is('distinct')){lim('IS DISTINCT FROM is outside this practice editor.',this.peek());}
      else{lim('After IS, write NULL or NOT NULL.',this.peek());}}
    return a;},
  cmp:function(){var a=this.pred();var p=this.peek();
    if(p.t==='op'&&/^(=|<>|!=|<|<=|>|>=)$/.test(p.v)){this.next();
      if(this.is('any')||this.is('all')||this.is('some')){lim('ANY, ALL and SOME are outside this practice editor.',this.peek());}
      a={op:p.v==='!='?'<>':p.v,a:a,b:this.pred()};
      var q=this.peek();if(q.t==='op'&&/^(=|<>|!=|<|<=|>|>=)$/.test(q.v)){lim('Join two comparisons with AND or OR.',q);}}
    return a;},
  pred:function(){var a=this.other();
    for(;;){var neg=false,save=this.i;
      if(this.is('not')&&(this.is('in',1)||this.is('between',1)||this.is('like',1)||this.is('ilike',1))){this.next();neg=true;}
      if(this.eat('in')){this.want('(','Put the IN values in parentheses.');
        if(this.is('select')){var sq=this.select();this.want(')');a={op:'insub',a:a,q:sq,neg:neg};}
        else{var list=[this.expr()];while(this.eat(',')){list.push(this.expr());}this.want(')');a={op:'inlist',a:a,list:list,neg:neg};}}
      else if(this.eat('between')){if(this.is('symmetric')){lim('BETWEEN SYMMETRIC is outside this practice editor.',this.peek());}var lo=this.other();this.want('and','BETWEEN needs AND between its two limits.');a={op:'between',a:a,lo:lo,hi:this.other(),neg:neg};}
      else if(this.eat('like')){var pat=this.other();if(this.is('escape')){lim('LIKE ... ESCAPE is outside this practice editor.',this.peek());}a={op:'like',a:a,b:pat,neg:neg};}
      else if(this.is('ilike')||this.is('similar')){lim(this.peek().v.toUpperCase()+' is outside this practice editor; use LIKE.',this.peek());}
      else{this.i=save;break;}}
    return a;},
  other:function(){var a=this.add();while(this.eat('||')){a={op:'||',a:a,b:this.add()};}return a;},
  add:function(){var a=this.mul();for(;;){if(this.eat('+')){a={op:'+',a:a,b:this.mul()};}else if(this.eat('-')){a={op:'-',a:a,b:this.mul()};}else{return a;}}},
  mul:function(){var a=this.unary();for(;;){if(this.eat('*')){a={op:'*',a:a,b:this.unary()};}else if(this.eat('/')){a={op:'/',a:a,b:this.unary()};}else if(this.eat('%')){a={op:'%',a:a,b:this.unary()};}else{return a;}}},
  unary:function(){if(this.eat('-')){return {op:'neg',a:this.unary()};}if(this.eat('+')){return this.unary();}var a=this.primary();if(this.is('::')){lim(':: casts are outside this practice editor.',this.peek());}if(this.is('[')){lim('Array subscripts are outside this practice editor.',this.peek());}return a;},
  primary:function(){var p=this.next();
    if(p.t==='int'){return {lit:+p.v,type:'int',raw:p.v};}
    if(p.t==='dec'){return {lit:parseNumLit(p.v),type:'num',raw:p.v};}
    if(p.t==='str'){return {lit:p.v,type:'unknown'};}
    if(p.t==='kw'&&p.v==='null'){return {lit:null,type:'unknown'};}
    if(p.t==='kw'&&(p.v==='true'||p.v==='false')){return {lit:p.v==='true',type:'bool'};}
    if(p.t==='op'&&p.v==='('){if(this.is('select')){var sq=this.select();this.want(')');return {op:'scalar',q:sq};}var e=this.expr();if(this.is(',')){lim('Row values are outside this practice editor.',this.peek());}this.want(')','Close the parenthesis.');return e;}
    if(p.t==='kw'&&p.v==='exists'){this.want('(','Write EXISTS (SELECT ...).');if(!this.is('select')){lim('EXISTS needs a SELECT inside its parentheses.',this.peek());}var q=this.select();this.want(')');return {op:'exists',q:q};}
    if(p.t==='kw'&&p.v==='case'){return this.caseExpr();}
    if(p.t==='id'){
      if(this.is('(')){return this.call(p);}
      if(this.is('.')){this.next();var c=this.peek();if(c.t==='op'&&c.v==='*'){lim('Use table.* only directly in the select list.',c);}var cn=this.ident('a column name after the dot');return {col:cn,qual:p.v,line:p.line};}
      return {col:p.v,line:p.line};}
    if(p.t==='end'){lim('The statement ends too early; something is missing after the last word.',p);}
    if(p.t==='kw'){lim('This practice editor could not read the statement near "'+p.v+'". Check the keyword order, commas and brackets.',p);}
    lim('This practice editor could not read the statement near "'+p.v+'".',p);},
  caseExpr:function(){var c={op:'case',subject:null,whens:[],els:null};
    if(!this.is('when')){c.subject=this.expr();}
    if(!this.is('when')){lim('CASE needs at least one WHEN ... THEN.',this.peek());}
    while(this.eat('when')){var w=this.expr();this.want('then','Each WHEN needs THEN and a result.');c.whens.push({w:w,t:this.expr()});}
    if(this.eat('else')){c.els=this.expr();}
    this.want('end','Close the CASE expression with END.');return c;},
  call:function(p){var name=p.v;this.next();var f={op:'call',name:name,args:[],star:false,line:p.line};
    var AGG={count:1,sum:1,avg:1,min:1,max:1},FN={coalesce:1,round:1,lower:1,upper:1,length:1};
    if(name==='generate_series'){lim('generate_series belongs in FROM in this practice editor: FROM generate_series(1, 5) AS n.',p);}
    if(!AGG[name]&&!FN[name]){lim('The function '+name+'() is outside this practice editor. Available: count, sum, avg, min, max, coalesce, round, lower, upper and length.',p);}
    f.agg=!!AGG[name];
    if(this.is('distinct')){lim('DISTINCT inside an aggregate is outside this practice editor.',this.peek());}
    if(this.eat('*')){if(name!=='count'){lim('Only count(*) takes a star.',p);}f.star=true;}
    else if(!this.is(')')){do{f.args.push(this.expr());}while(this.eat(','));}
    this.want(')','Close the function call with a parenthesis.');
    if(this.is('over')||this.is('filter')){lim('Window functions and FILTER are outside this practice editor.',this.peek());}
    var n=f.args.length;
    if(f.agg&&!f.star&&n!==1){lim(name+'() takes one argument here.',p);}
    if(name==='coalesce'&&n<1){lim('coalesce() needs at least one argument.',p);}
    if((name==='lower'||name==='upper'||name==='length')&&n!==1){lim(name+'() takes one argument.',p);}
    if(name==='round'&&(n<1||n>2)){lim('round() takes a value and an optional number of decimal places.',p);}
    return f;}
};
function split(ts){var out=[],cur=[];ts.forEach(function(t){if(t.t==='op'&&t.v===';'){if(cur.length){out.push(cur);}cur=[];}else if(t.t==='meta'){if(cur.length){out.push(cur);cur=[];}out.push([t]);}else{cur.push(t);}});if(cur.length){out.push(cur);}return out;}

/* ---------- Tables ---------- */
function cloneDb(schema){var db={};schema.tables.forEach(function(t){db[t.name]={def:t,rows:t.rows.map(function(r){return r.map(cv);}),seq:0};});return db;}
function cv(v){return (v!==null&&typeof v==='object'&&'dec' in v)?parseNumLit(v.dec):v;}
function colIndex(def,name){for(var i=0;i<def.cols.length;i++){if(def.cols[i].name===name){return i;}}return -1;}

/* ---------- Evaluation ---------- */
function Ctx(db,outer){this.db=db;this.items=[];this.outer=outer||null;}
function resolve(ctx,e){/* -> {depth, item index, column index, type, label} */
  for(var c=ctx,depth=0;c;c=c.outer,depth++){var hits=[],qualSeen=false;
    for(var k=0;k<c.items.length;k++){var it=c.items[k],ref=it.alias||it.name;
      if(e.qual){if(ref!==e.qual){if(it.alias&&it.name===e.qual&&!it.fn){pgerr('invalid reference to FROM-clause entry for table "'+e.qual+'"','HINT:  Perhaps you meant to reference the table alias "'+it.alias+'".');}continue;}qualSeen=true;}
      var ci=it.cols.indexOf(e.col);if(ci>=0){hits.push({depth:depth,k:k,ci:ci,type:it.types[ci],ref:ref});}}
    if(hits.length>1){pgerr('column reference "'+e.col+'" is ambiguous');}
    if(hits.length){return hits[0];}
    if(e.qual&&qualSeen){pgerr('column '+e.qual+'.'+e.col+' does not exist');}}
  if(e.qual){pgerr('missing FROM-clause entry for table "'+e.qual+'"');}
  pgerr('column "'+e.col+'" does not exist');}
function typeName(t){return {int:'integer',num:'numeric',text:'text',bool:'boolean',unknown:'unknown'}[t]||t;}
function coerceLit(v,t){/* an untyped quoted literal meets a typed operand */
  if(v===null){return null;}
  if(t==='int'){if(!/^\s*[-+]?\d+\s*$/.test(v)){pgerr('invalid input syntax for type integer: "'+v+'"');}return parseInt(v,10);}
  if(t==='num'){var m=/^\s*([-+]?)(\d*\.?\d*)\s*$/.exec(v);if(!m||!/\d/.test(m[2])){pgerr('invalid input syntax for type numeric: "'+v+'"');}var n=parseNumLit(m[2]);if(m[1]==='-'){n.u=-n.u;}return n;}
  if(t==='bool'){var b=String(v).trim().toLowerCase();if(/^(t|true|yes|on|1)$/.test(b)){return true;}if(/^(f|false|no|off|0)$/.test(b)){return false;}pgerr('invalid input syntax for type boolean: "'+v+'"');}
  return v;}
function cmpVals(a,b){if(typeof a==='string'){return a<b?-1:(a>b?1:0);}if(typeof a==='boolean'){return a===b?0:(a?1:-1);}if(a instanceof Num||b instanceof Num){return numCmp(toNum(a),toNum(b));}return a<b?-1:(a>b?1:0);}
function opType(op,ta,tb){
  if(op==='||'){if(ta!=='text'&&ta!=='unknown'&&tb!=='text'&&tb!=='unknown'){pgerr('operator does not exist: '+typeName(ta)+' || '+typeName(tb));}return 'text';}
  if(ta==='unknown'&&tb==='unknown'){return op==='cmp'?'text':'text';}
  var x=ta==='unknown'?tb:ta,y=tb==='unknown'?ta:tb;
  if(isNumType(x)&&isNumType(y)){return x==='num'||y==='num'?'num':'int';}
  if(x===y){return x;}
  pgerr('operator does not exist: '+typeName(ta)+' '+(op==='cmp'?'=':op)+' '+typeName(tb));}
function Evaluator(db){this.db=db;}
Evaluator.prototype={
  /* Static type of an expression in a context (needed for literal coercion and alignment). */
  type:function(e,ctx){var self=this;
    if('lit' in e){return e.type;}
    if(e.col){return resolve(ctx,e).type;}
    switch(e.op){
      case 'or':case 'and':case 'not':case 'isnull':case 'isnotnull':case 'inlist':case 'insub':case 'between':case 'like':case 'exists':case '=':case '<>':case '<':case '<=':case '>':case '>=':return 'bool';
      case 'neg':return this.type(e.a,ctx);
      case '||':return 'text';
      case '+':case '-':case '*':case '/':case '%':{var t=opType(e.op,this.type(e.a,ctx),this.type(e.b,ctx));if(t!=='int'&&t!=='num'){pgerr('operator does not exist: '+typeName(this.type(e.a,ctx))+' '+e.op+' '+typeName(this.type(e.b,ctx)));}return t;}
      case 'case':{var ts=e.whens.map(function(w){return self.type(w.t,ctx);});if(e.els){ts.push(this.type(e.els,ctx));}return unify(ts,'CASE');}
      case 'scalar':return this.subquery(e.q,ctx,[]).types[0]||'text';
      case 'call':{var n=e.name;if(n==='count'){return 'int';}if(n==='avg'){var at=this.type(e.args[0],ctx);if(!isNumType(at)){pgerr('function avg('+typeName(at)+') does not exist');}return 'num';}
        if(n==='sum'){var st=this.type(e.args[0],ctx);if(!isNumType(st)){pgerr('function sum('+typeName(st)+') does not exist');}return st;}
        if(n==='min'||n==='max'){var mt=this.type(e.args[0],ctx);return mt==='unknown'?'text':mt;}
        if(n==='coalesce'){return unify(e.args.map(function(a){return self.type(a,ctx);}),'COALESCE');}
        if(n==='round'){return 'num';}if(n==='length'){return 'int';}return 'text';}}
    return 'unknown';},
  ev:function(e,ctx,row,grp){var self=this;
    if('lit' in e){return e.lit;}
    if(e.col){var r=resolve(ctx,e);if(grp&&r.depth===0){return grp.first?grp.first[r.k][r.ci]:null;}var rr=row;for(var d=0,c=ctx;d<r.depth;d++){rr=c.outerRow;c=c.outer;}return rr[r.k]?rr[r.k][r.ci]:null;}
    switch(e.op){
      case 'and':{var a=this.ev(e.a,ctx,row,grp),b=this.ev(e.b,ctx,row,grp);if(a===false||b===false){return false;}if(a===null||b===null){return null;}return true;}
      case 'or':{var a2=this.ev(e.a,ctx,row,grp),b2=this.ev(e.b,ctx,row,grp);if(a2===true||b2===true){return true;}if(a2===null||b2===null){return null;}return false;}
      case 'not':{var n=this.ev(e.a,ctx,row,grp);return n===null?null:!n;}
      case 'isnull':return this.ev(e.a,ctx,row,grp)===null;
      case 'isnotnull':return this.ev(e.a,ctx,row,grp)!==null;
      case '=':case '<>':case '<':case '<=':case '>':case '>=':return this.compare(e.op,e.a,e.b,ctx,row,grp);
      case 'between':{var lo=this.compare('>=',e.a,e.lo,ctx,row,grp),hi=this.compare('<=',e.a,e.hi,ctx,row,grp),r1=(lo===false||hi===false)?false:((lo===null||hi===null)?null:true);return e.neg?(r1===null?null:!r1):r1;}
      case 'like':{var s=this.ev(e.a,ctx,row,grp),pt=this.ev(e.b,ctx,row,grp);var ta=this.type(e.a,ctx),tb=this.type(e.b,ctx);if((ta!=='text'&&ta!=='unknown')||(tb!=='text'&&tb!=='unknown')){pgerr('operator does not exist: '+typeName(ta==='unknown'?'text':ta)+' ~~ '+typeName(tb==='unknown'?'text':tb));}
        if(s===null||pt===null){return null;}var re='^';for(var i=0;i<pt.length;i++){var ch=pt[i];if(ch==='\\'&&i+1<pt.length){i++;re+=pt[i].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}else if(ch==='%'){re+='[\\s\\S]*';}else if(ch==='_'){re+='[\\s\\S]';}else{re+=ch.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}}
        var m=new RegExp(re+'$').test(s);return e.neg?!m:m;}
      case 'inlist':{var any=false,nul=false;for(var j=0;j<e.list.length;j++){var c1=this.compare('=',e.a,e.list[j],ctx,row,grp);if(c1===true){any=true;break;}if(c1===null){nul=true;}}
        var r2=any?true:(nul?null:false);return e.neg?(r2===null?null:!r2):r2;}
      case 'insub':{var lv=this.ev(e.a,ctx,row,grp),res=this.subquery(e.q,ctx,row),any2=false,nul2=false;if(res.cols.length!==1){pgerr('subquery has too many columns');}
        var lt=this.type(e.a,ctx),rt=res.types[0];var ct=opType('cmp',lt,rt==='unknown'?'unknown':rt);
        if(lv!==null&&lt==='unknown'){lv=coerceLit(lv,ct);}
        if(res.rows.length===0){return e.neg;}
        if(lv===null){return null;}
        for(var k=0;k<res.rows.length;k++){var v=res.rows[k][0];if(v===null){nul2=true;continue;}if(cmpVals(lv,v)===0){any2=true;break;}}
        var r3=any2?true:(nul2?null:false);return e.neg?(r3===null?null:!r3):r3;}
      case 'exists':return this.subquery(e.q,ctx,row).rows.length>0;
      case 'scalar':{var sr=this.subquery(e.q,ctx,row);if(sr.cols.length!==1){pgerr('subquery must return only one column');}if(sr.rows.length>1){pgerr('more than one row returned by a subquery used as an expression');}return sr.rows.length?sr.rows[0][0]:null;}
      case 'neg':{var nv=this.ev(e.a,ctx,row,grp);if(nv===null){return null;}if(nv instanceof Num){return new Num(-nv.u,nv.s);}if(typeof nv!=='number'){pgerr('operator does not exist: - '+typeName(this.type(e.a,ctx)));}return -nv;}
      case '||':{opType('||',this.type(e.a,ctx),this.type(e.b,ctx));var x=this.ev(e.a,ctx,row,grp),y=this.ev(e.b,ctx,row,grp);if(x===null||y===null){return null;}return show(x)+show(y);}
      case '+':case '-':case '*':case '/':case '%':return this.arith(e,ctx,row,grp);
      case 'case':{var subj=e.subject?this.ev(e.subject,ctx,row,grp):undefined;
        for(var w=0;w<e.whens.length;w++){var hit;if(e.subject){hit=this.compare('=',e.subject,e.whens[w].w,ctx,row,grp);}else{hit=this.ev(e.whens[w].w,ctx,row,grp);}
          if(hit===true){return this.cast(this.ev(e.whens[w].t,ctx,row,grp),this.type(e.whens[w].t,ctx),this.type(e,ctx));}}
        return e.els?this.cast(this.ev(e.els,ctx,row,grp),this.type(e.els,ctx),this.type(e,ctx)):null;}
      case 'call':return this.call(e,ctx,row,grp);}
    lim('This expression is outside this practice editor.');},
  cast:function(v,from,to){if(v===null){return null;}if(from==='unknown'){return coerceLit(v,to);}if(to==='num'&&typeof v==='number'){return new Num(BigInt(v),0);}return v;},
  compare:function(op,ea,eb,ctx,row,grp){var ta=this.type(ea,ctx),tb=this.type(eb,ctx),t=opType('cmp',ta,tb);
    var a=this.ev(ea,ctx,row,grp),b=this.ev(eb,ctx,row,grp);if(a===null||b===null){return null;}
    if(ta==='unknown'){a=coerceLit(a,t);}if(tb==='unknown'){b=coerceLit(b,t);}
    var c=cmpVals(a,b);return op==='='?c===0:op==='<>'?c!==0:op==='<'?c<0:op==='<='?c<=0:op==='>'?c>0:c>=0;},
  arith:function(e,ctx,row,grp){var ta=this.type(e.a,ctx),tb=this.type(e.b,ctx),t=this.type(e,ctx),a=this.ev(e.a,ctx,row,grp),b=this.ev(e.b,ctx,row,grp);
    if(a===null||b===null){return null;}if(ta==='unknown'){a=coerceLit(a,t);}if(tb==='unknown'){b=coerceLit(b,t);}
    if(t==='int'){var r;switch(e.op){case '+':r=a+b;break;case '-':r=a-b;break;case '*':r=a*b;break;case '/':if(b===0){pgerr('division by zero');}r=Math.trunc(a/b);break;case '%':if(b===0){pgerr('division by zero');}r=a%b;break;}
      if(!Number.isSafeInteger(r)||Math.abs(r)>2147483647){pgerr('integer out of range');}return r;}
    switch(e.op){case '+':return numAdd(a,b,1);case '-':return numAdd(a,b,-1);case '*':return numMul(a,b);case '/':return numDiv(a,b);}
    lim('% on decimals is outside this practice editor.');},
  call:function(e,ctx,row,grp){var self=this,n=e.name;
    if(e.agg){if(!grp){pgerr('aggregate functions are not allowed here');}
      if(e.star){return grp.rows.length;}
      var vals=[];grp.rows.forEach(function(r){var v=self.ev(e.args[0],grp.ctx,r,null);if(v!==null){vals.push(v);}});
      var at=this.type(e.args[0],grp.ctx);if(at==='unknown'){vals=vals.map(function(v){return coerceLit(v,n==='count'?'text':'text');});}
      if(n==='count'){return vals.length;}
      if(!vals.length){return null;}
      if(n==='min'||n==='max'){return vals.reduce(function(a,b){var c=cmpVals(a,b);return (n==='min'?c<=0:c>=0)?a:b;});}
      var sum=vals.reduce(function(a,b){return at==='int'?a+b:numAdd(a,b,1);},at==='int'?0:new Num(0n,0));
      if(at==='num'){var sc=Math.max.apply(null,vals.map(function(v){return v.s;}));sum=rescale(sum,sc);}
      if(n==='sum'){return sum;}
      return numDiv(toNum(sum),new Num(BigInt(vals.length),0));}
    var args=e.args.map(function(a){return self.ev(a,ctx,row,grp);});
    if(n==='coalesce'){var t=this.type(e,ctx);for(var i=0;i<args.length;i++){if(args[i]!==null){return this.cast(args[i],this.type(e.args[i],ctx),t);}}return null;}
    if(args[0]===null){return null;}
    var t0=this.type(e.args[0],ctx);
    if(n==='lower'||n==='upper'){if(t0!=='text'&&t0!=='unknown'){pgerr('function '+n+'('+typeName(t0)+') does not exist');}return n==='lower'?String(args[0]).toLowerCase():String(args[0]).toUpperCase();}
    if(n==='length'){if(t0!=='text'&&t0!=='unknown'){pgerr('function length('+typeName(t0)+') does not exist');}return Array.from(String(args[0])).length;}
    if(n==='round'){if(!isNumType(t0)&&t0!=='unknown'){pgerr('function round('+typeName(t0)+') does not exist');}var v0=t0==='unknown'?coerceLit(args[0],'num'):args[0];var places=args.length>1?args[1]:0;if(places===null){return null;}if(typeof places!=='number'){pgerr('function round(numeric, '+typeName(this.type(e.args[1],ctx))+') does not exist');}
      if(places<0||places>20){lim('round() places from 0 to 20 only in this practice editor.');}return rescale(toNum(v0),places);}
    lim('This function is outside this practice editor.');},
  subquery:function(q,ctx,row){var c2=new Ctx(this.db,ctx);c2.outerRow=row;return this.select(q,c2);},
  fromItems:function(q,ctx){var self=this,envs=[[]];
    q.from.forEach(function(f){var it={name:f.name,alias:f.alias,fn:f.fn},rows;
      if(f.fn){var a=f.args.map(function(x){return self.ev(x,ctx,[],null);});if(a.length<2||a.length>3){lim('generate_series takes a start, a stop and an optional step here.');}
        if(a.some(function(v){return typeof v!=='number';})){lim('generate_series takes whole numbers in this practice editor.');}
        var st=a.length>2?a[2]:1;if(st===0){pgerr('step size cannot equal zero');}rows=[];for(var v=a[0];st>0?v<=a[1]:v>=a[1];v+=st){rows.push([v]);if(rows.length>MAX_ROWS){lim('That series is too long for this practice editor.');}}
        it.cols=[f.colAlias||f.alias||'generate_series'];it.types=['int'];}
      else{var tb=self.db[f.name];if(!tb){pgerr('relation "'+f.name+'" does not exist');}it.cols=tb.def.cols.map(function(c){return c.name;});it.types=tb.def.cols.map(function(c){return c.type;});it.def=tb.def;rows=tb.rows;}
      var ref=it.alias||it.name;ctx.items.forEach(function(o){if((o.alias||o.name)===ref){pgerr('table name "'+ref+'" specified more than once');}});
      ctx.items.push(it);
      if(f.on&&hasAgg(f.on)){pgerr('aggregate functions are not allowed in JOIN conditions');}
      var next=[];envs.forEach(function(env){var matched=false;
        rows.forEach(function(r){var e2=env.concat([r]);if(!f.on||self.ev(f.on,ctx,e2,null)===true){next.push(e2);matched=true;}if(next.length>MAX_ROWS){lim('That join produces too many rows for this practice editor.');}});
        if(f.kind==='left'&&!matched){next.push(env.concat([it.cols.map(function(){return null;})]));}});
      envs=next;});
    return envs;},
  select:function(q,ctx){var self=this;
    var envs=q.from.length?this.fromItems(q,ctx):[[]];
    if(q.where){if(hasAgg(q.where)){pgerr('aggregate functions are not allowed in WHERE');}self.type(q.where,ctx);envs=envs.filter(function(r){return self.ev(q.where,ctx,r,null)===true;});}
    /* output columns */
    var outs=[];q.items.forEach(function(it){
      if(it.star){var any=false;ctx.items.forEach(function(fi,k){if(it.qual&&(fi.alias||fi.name)!==it.qual){return;}any=true;fi.cols.forEach(function(c,ci){outs.push({e:{col:c,qual:fi.alias||fi.name},name:c,type:fi.types[ci]});});});
        if(!any){if(it.qual){pgerr('missing FROM-clause entry for table "'+it.qual+'"');}pgerr('SELECT * with no tables specified is not valid');}return;}
      outs.push({e:it.e,name:it.alias||label(it.e),type:self.type(it.e,ctx)});});
    q.group.forEach(function(g){if(hasAgg(g)){pgerr('aggregate functions are not allowed in GROUP BY');}});
    var grouping=q.group.length>0||outs.some(function(o){return hasAgg(o.e);})||(q.having!==null)||q.order.some(function(o){return hasAgg(o.e);});
    var groupExprs=q.group.map(function(g){return self.outRef(g,outs,ctx,'GROUP BY');});
    var rows;
    if(grouping){
      outs.forEach(function(o){self.checkGrouped(o.e,groupExprs,ctx);});
      if(q.having){self.checkGrouped(q.having,groupExprs,ctx);}
      var groups=[],idx={};
      envs.forEach(function(r){var key=sig(groupExprs.map(function(g){var v=self.ev(g,ctx,r,null);return v instanceof Num?'n'+numStr(v):v;}));
        if(!(key in idx)){idx[key]=groups.length;groups.push({ctx:ctx,rows:[],first:r});}groups[idx[key]].rows.push(r);});
      if(!q.group.length&&!groups.length){groups.push({ctx:ctx,rows:[],first:null});}
      if(q.having){self.type(q.having,ctx);groups=groups.filter(function(g){return self.ev(q.having,ctx,g.first||[],g)===true;});}
      rows=groups.map(function(g){return {vals:outs.map(function(o){return self.ev(o.e,ctx,g.first||[],g);}),g:g,env:g.first||[]};});}
    else{rows=envs.map(function(r){return {vals:outs.map(function(o){return self.ev(o.e,ctx,r,null);}),env:r};});}
    if(q.distinct){var seen={};rows=rows.filter(function(r){var k=sig(r.vals.map(function(v){return v instanceof Num?'n'+numStr(v):v;}));if(seen[k]){return false;}seen[k]=1;return true;});}
    if(q.order.length){var keys=q.order.map(function(o){var pos=self.orderPos(o.e,outs);
        if(pos<0){if(q.distinct){pgerr('for SELECT DISTINCT, ORDER BY expressions must appear in select list');}if(grouping){self.checkGrouped(o.e,groupExprs,ctx);}self.type(o.e,ctx);}
        return {pos:pos,o:o};});
      rows.forEach(function(r){r.k=keys.map(function(k){return k.pos>=0?r.vals[k.pos]:self.ev(k.o.e,ctx,r.env,r.g||null);});});
      rows.sort(function(x,y){for(var i=0;i<keys.length;i++){var o=keys[i].o,a=x.k[i],b=y.k[i],nf=o.nulls?o.nulls==='first':o.desc,c;
          if(a===null&&b===null){c=0;}else if(a===null){c=nf?-1:1;}else if(b===null){c=nf?1:-1;}else{c=cmpVals(a,b);if(o.desc){c=-c;}}
          if(c){return c;}}return 0;});}
    return {cols:outs.map(function(o){return o.name;}),types:outs.map(function(o){return o.type==='unknown'?'text':o.type;}),rows:rows.map(function(r){return r.vals;}),ordered:q.order.length>0};},
  orderPos:function(e,outs){if('lit' in e&&e.type==='int'){if(e.lit<1||e.lit>outs.length){pgerr('ORDER BY position '+e.lit+' is not in select list');}return e.lit-1;}
    if(e.col&&!e.qual){var hit=-1;outs.forEach(function(o,i){if(o.name===e.col){if(hit>=0&&sig(outs[hit].e)!==sig(o.e)){pgerr('ORDER BY "'+e.col+'" is ambiguous');}if(hit<0){hit=i;}}});if(hit>=0){return hit;}}
    var js=sig(e);for(var i=0;i<outs.length;i++){if(sig(outs[i].e)===js){return i;}}return -1;},
  outRef:function(g,outs,ctx,where){if('lit' in g&&g.type==='int'){if(g.lit<1||g.lit>outs.length){pgerr(where+' position '+g.lit+' is not in select list');}return outs[g.lit-1].e;}
    if(g.col&&!g.qual){try{resolve(ctx,g);return g;}catch(err){for(var i=0;i<outs.length;i++){if(outs[i].name===g.col){return outs[i].e;}}throw err;}}
    this.type(g,ctx);return g;},
  checkGrouped:function(e,groupExprs,ctx){var self=this,gk=groupExprs.map(function(g){return g.col?'c'+sig(refOf(ctx,g)):sig(g);});
    (function walk(x){if(!x||typeof x!=='object'){return;}
      if(x.op==='call'&&x.agg){x.args.forEach(function(a){if(hasAgg(a)){pgerr('aggregate function calls cannot be nested');}});return;}
      if(x.op==='exists'||x.op==='insub'||x.op==='scalar'){if(x.a){walk(x.a);}return;}
      if(gk.indexOf(sig(x))>=0){return;}
      if(x.col){var r=resolve(ctx,x);if(r.depth>0){return;}var key='c'+sig(refOf(ctx,x));if(gk.indexOf(key)>=0){return;}
        var it=ctx.items[r.k];if(it.def){var pk=it.def.cols.filter(function(c){return c.pk;}).map(function(c){return 'c'+sig([r.k,colIndex(it.def,c.name)]);});if(pk.length===1&&gk.indexOf(pk[0])>=0){return;}}
        pgerr('column "'+r.ref+'.'+x.col+'" must appear in the GROUP BY clause or be used in an aggregate function');}
      Object.keys(x).forEach(function(k){var v=x[k];if(Array.isArray(v)){v.forEach(function(y){walk(y&&y.w?y.w:y);if(y&&y.t){walk(y.t);}if(y&&y.e){walk(y.e);}});}else if(v&&typeof v==='object'&&k!=='lit'){walk(v);}});})(e);
    void self;}
};
function refOf(ctx,e){var r=resolve(ctx,e);return [r.k,r.ci];}
function unify(ts,what){var t='unknown';ts.forEach(function(x){if(x==='unknown'){return;}if(t==='unknown'){t=x;return;}if(isNumType(t)&&isNumType(x)){if(x==='num'){t='num';}return;}if(t!==x){pgerr(what+' types '+typeName(t)+' and '+typeName(x)+' cannot be matched');}});return t==='unknown'?'text':t;}
function hasAgg(e){var f=false;(function walk(x){if(f||!x||typeof x!=='object'){return;}if(x.op==='exists'||x.op==='insub'||x.op==='scalar'){if(x.a){walk(x.a);}return;}if(x.op==='call'&&x.agg){f=true;return;}Object.keys(x).forEach(function(k){if(k!=='lit'){var v=x[k];if(Array.isArray(v)){v.forEach(function(y){walk(y);if(y&&y.w){walk(y.w);walk(y.t);}});}else if(v&&typeof v==='object'){walk(v);}}});})(e);return f;}
function label(e){if(e.col){return e.col;}if(e.op==='call'){return e.name;}if(e.op==='case'){return 'case';}if(e.op==='exists'){return 'exists';}return '?column?';}

/* ---------- Data changes ---------- */
function rowText(def,r){return '('+r.map(function(v){return v===null?'null':show(v);}).join(', ')+')';}
function storeVal(v,from,col){if(v===null){return null;}
  if(from==='unknown'){v=coerceLit(v,col.type);}
  if(col.type==='int'){if(v instanceof Num){var x=Number(divRound(v.u,p10(v.s)));v=x;}if(typeof v!=='number'){pgerr('column "'+col.name+'" is of type integer but expression is of type '+typeName(from));}if(Math.abs(v)>2147483647){pgerr('integer out of range');}return v;}
  if(col.type==='num'){if(typeof v!=='number'&&!(v instanceof Num)){pgerr('column "'+col.name+'" is of type numeric but expression is of type '+typeName(from));}var n=toNum(v);if(col.scale!=null){n=rescale(n,col.scale);var lim10=p10(col.precision);if((n.u<0n?-n.u:n.u)>=lim10){pgerr('numeric field overflow','DETAIL:  A field with precision '+col.precision+', scale '+col.scale+' must round to an absolute value less than 10^'+(col.precision-col.scale)+'.');}}return n;}
  if(col.type==='text'){return show(v);}
  if(col.type==='bool'){if(typeof v!=='boolean'){pgerr('column "'+col.name+'" is of type boolean but expression is of type '+typeName(from));}return v;}
  return v;}
function keyText(def,cols,r){return 'Key ('+cols.join(', ')+')=('+cols.map(function(c){return show(r[colIndex(def,c)]);}).join(', ')+')';}
function checkTable(db,name,changed,deletedOld){/* NOT NULL and unique per changed row, then foreign keys */
  var t=db[name],def=t.def;
  changed.forEach(function(r){def.cols.forEach(function(c,i){if(c.notnull&&r[i]===null){pgerr('null value in column "'+c.name+'" of relation "'+name+'" violates not-null constraint','DETAIL:  Failing row contains '+rowText(def,r)+'.');}});
    (def.keys||[]).forEach(function(k){var idx=k.cols.map(function(c){return colIndex(def,c);});if(idx.some(function(i){return r[i]===null;})){return;}
      var dup=t.rows.filter(function(o){return idx.every(function(i){return o[i]!==null&&cmpVals(o[i],r[i])===0;});}).length;
      if(dup>1){pgerr('duplicate key value violates unique constraint "'+k.name+'"','DETAIL:  '+keyText(def,k.cols,r)+' already exists.');}});});
  changed.forEach(function(r){(def.fks||[]).forEach(function(fk){var i=colIndex(def,fk.col);if(r[i]===null){return;}var p=db[fk.table];var j=colIndex(p.def,fk.ref);
      if(!p.rows.some(function(o){return o[j]!==null&&cmpVals(o[j],r[i])===0;})){pgerr('insert or update on table "'+name+'" violates foreign key constraint "'+fk.name+'"','DETAIL:  Key ('+fk.col+')=('+show(r[i])+') is not present in table "'+fk.table+'".');}});});
  (deletedOld||[]).forEach(function(old){Object.keys(db).forEach(function(cn){(db[cn].def.fks||[]).forEach(function(fk){if(fk.table!==name){return;}var j=colIndex(def,fk.ref),i=colIndex(db[cn].def,fk.col);if(old[j]===null){return;}
      if(t.rows.some(function(o){return o[j]!==null&&cmpVals(o[j],old[j])===0;})){return;}
      if(db[cn].rows.some(function(o){return o[i]!==null&&cmpVals(o[i],old[j])===0;})){pgerr('update or delete on table "'+name+'" violates foreign key constraint "'+fk.name+'" on table "'+cn+'"','DETAIL:  Key ('+fk.ref+')=('+show(old[j])+') is still referenced from table "'+cn+'".');}});});});}
function snapshot(db){var s={};Object.keys(db).forEach(function(k){s[k]=db[k].rows.slice();});return s;}
function restore(db,s){Object.keys(s).forEach(function(k){db[k].rows=s[k];});}
function returning(ev,items,t,rows,alias){if(!items){return null;}var ctx=new Ctx(ev.db,null);ctx.items=[{name:t.def.name,alias:alias,cols:t.def.cols.map(function(c){return c.name;}),types:t.def.cols.map(function(c){return c.type;}),def:t.def}];
  var q={type:'select',items:items,from:[],where:null,group:[],having:null,order:[],distinct:false},outs=[];
  items.forEach(function(it){if(it.star){t.def.cols.forEach(function(c){outs.push({e:{col:c.name},name:c.name,type:c.type});});return;}if(hasAgg(it.e)){pgerr('aggregate functions are not allowed in RETURNING');}outs.push({e:it.e,name:it.alias||label(it.e),type:ev.type(it.e,ctx)});});
  void q;return {cols:outs.map(function(o){return o.name;}),types:outs.map(function(o){return o.type==='unknown'?'text':o.type;}),rows:rows.map(function(r){return outs.map(function(o){return ev.ev(o.e,ctx,[r],null);});})};}
function execInsert(ev,st){var db=ev.db,t=db[st.table];if(!t){pgerr('relation "'+st.table+'" does not exist');}var def=t.def;
  var cols=st.cols||def.cols.map(function(c){return c.name;});
  cols.forEach(function(c,i){if(colIndex(def,c)<0){pgerr('column "'+c+'" of relation "'+st.table+'" does not exist');}if(cols.indexOf(c)!==i){pgerr('column "'+c+'" specified more than once');}});
  var src;var ctx0=new Ctx(db,null);
  if(st.rows){src=st.rows.map(function(r){if(r.length>cols.length){pgerr('INSERT has more expressions than target columns');}if(st.cols&&r.length<cols.length){pgerr('INSERT has more target columns than expressions');}
      return r.map(function(e){if(hasAgg(e)){pgerr('aggregate functions are not allowed in VALUES');}return {v:ev.ev(e,ctx0,[],null),t:ev.type(e,ctx0)};});});}
  else{var res=ev.select(st.query,new Ctx(db,null));if(res.cols.length>cols.length){pgerr('INSERT has more expressions than target columns');}if(st.cols&&res.cols.length<cols.length){pgerr('INSERT has more target columns than expressions');}
    src=res.rows.map(function(r){return r.map(function(v,i){return {v:v,t:res.types[i]};});});}
  var before=snapshot(db),added=[];
  try{src.forEach(function(r){var row=def.cols.map(function(){return null;});r.forEach(function(x,i){var ci=colIndex(def,cols[i]);row[ci]=storeVal(x.v,x.t,def.cols[ci]);});t.rows=t.rows.concat([row]);added.push(row);});
    checkTable(db,st.table,added,null);}
  catch(e){restore(db,before);throw e;}
  return {tag:'INSERT 0 '+added.length,count:added.length,ret:returning(ev,st.returning,t,added,null),changed:added};}
function targetRows(ev,st,t){var ctx=new Ctx(ev.db,null);ctx.items=[{name:st.table,alias:st.alias,cols:t.def.cols.map(function(c){return c.name;}),types:t.def.cols.map(function(c){return c.type;}),def:t.def}];
  if(st.where){if(hasAgg(st.where)){pgerr('aggregate functions are not allowed in WHERE');}ev.type(st.where,ctx);}
  return {ctx:ctx,rows:t.rows.filter(function(r){return !st.where||ev.ev(st.where,ctx,[r],null)===true;})};}
function execUpdate(ev,st){var db=ev.db,t=db[st.table];if(!t){pgerr('relation "'+st.table+'" does not exist');}var def=t.def;
  st.sets.forEach(function(s){if(colIndex(def,s.col)<0){pgerr('column "'+s.col+'" of relation "'+st.table+'" does not exist');}});
  var tr=targetRows(ev,st,t),before=snapshot(db),news=[];
  try{var nr=tr.rows.map(function(r){var n=r.slice();st.sets.forEach(function(s){var ci=colIndex(def,s.col);n[ci]=storeVal(ev.ev(s.e,tr.ctx,[r],null),ev.type(s.e,tr.ctx),def.cols[ci]);});return n;});
    /* PostgreSQL writes a new row version; a plain table scan then meets it after the untouched rows. */
    t.rows=t.rows.filter(function(r){return tr.rows.indexOf(r)<0;}).concat(nr);news=nr;
    checkTable(db,st.table,nr,tr.rows);}
  catch(e){restore(db,before);throw e;}
  return {tag:'UPDATE '+news.length,count:news.length,ret:returning(ev,st.returning,t,news,st.alias),changed:news,old:tr.rows};}
function execDelete(ev,st){var db=ev.db,t=db[st.table];if(!t){pgerr('relation "'+st.table+'" does not exist');}
  var tr=targetRows(ev,st,t),before=snapshot(db);
  try{t.rows=t.rows.filter(function(r){return tr.rows.indexOf(r)<0;});checkTable(db,st.table,[],tr.rows);}
  catch(e){restore(db,before);throw e;}
  return {tag:'DELETE '+tr.rows.length,count:tr.rows.length,ret:returning(ev,st.returning,t,tr.rows,st.alias),old:tr.rows};}

/* ---------- psql aligned output ---------- */
function table(res){var w=res.cols.map(function(c,i){return Math.max(Array.from(c).length,res.rows.reduce(function(m,r){return Math.max(m,Array.from(show(r[i])).length);},0));});
  function pad(s,n,right){var l=Array.from(s).length,sp=new Array(Math.max(0,n-l)+1).join(' ');return right?sp+s:s+sp;}
  var last=res.cols.length-1,out=[];
  out.push(res.cols.map(function(c,i){var l=Array.from(c).length,left=Math.floor((w[i]-l)/2);return ' '+new Array(left+1).join(' ')+c+new Array(w[i]-l-left+1).join(' ')+' ';}).join('|'));
  out.push(w.map(function(n){return new Array(n+3).join('-');}).join('+'));
  res.rows.forEach(function(r){out.push(r.map(function(v,i){var right=isNumType(res.types[i]),s=show(v);return ' '+(i===last&&!right?s:pad(s,w[i],right))+(i===last?'':' ');}).join('|'));});
  out.push('('+res.rows.length+' row'+(res.rows.length===1?'':'s')+')');out.push('');return out;}

/* ---------- Adapter interface for the lesson-editor shell ---------- */
function check(src){var ts=lex(String(src).replace(/\r\n?/g,'\n')),problems=[],program=[];
  ts.forEach(function(t){if(t.t==='bad'){problems.push(problem(t.line,t.col,'limit',t.why));}});
  if(problems.length){return {problems:problems,program:[]};}
  split(ts).forEach(function(stmt){var first=stmt[0];
    if(first.t==='meta'){var cmd=first.v.split(/\s+/)[0];problems.push(problem(first.line,1,'limit',cmd==='\\copy'?'\\copy is a psql command that reads a file on your computer; this practice editor has no files or psql, so run it in psql itself.':cmd+' is a psql command, not SQL; it is not available in this practice editor.'));return;}
    try{var st=new Parser(stmt).statement();st.text=null;st.line=first.line;program.push(st);}
    catch(e){if(e instanceof Limit){problems.push(problem(e.line||first.line,1,'limit',e.msg));}else{throw e;}}});
  if(!program.length&&!problems.length){problems.push(problem(1,1,'limit','Write at least one SQL statement, ending with a semicolon.'));}
  return {problems:problems,program:program};}
function notRun(problems){return {status:'limit',lines:['Not run: '+problems.length+' item'+(problems.length===1?'':'s')+' under Problems to fix first.'],summary:'Not run. '+problems.length+' problem'+(problems.length===1?'':'s')+' still open.',outcomes:[]};}
function run(program,schema){var db=cloneDb(schema),ev=new Evaluator(db),lines=[],outcomes=[],errors=0;
  program.forEach(function(st){var o={type:st.type,line:st.line,st:st};
    try{if(st.type==='select'){var r=ev.select(st,new Ctx(db,null));o.res=r;lines=lines.concat(table(r));if(!r.ordered&&r.rows.length>1){lines.splice(lines.length-1,0,'(no ORDER BY: PostgreSQL does not promise this row order)');}}
      else{var x=st.type==='insert'?execInsert(ev,st):st.type==='update'?execUpdate(ev,st):execDelete(ev,st);o.tag=x.tag;o.count=x.count;o.ret=x.ret;o.changed=x.changed||[];o.old=x.old||[];
        if(x.ret){lines=lines.concat(table(x.ret));}lines.push(x.tag);}}
    catch(e){if(e instanceof PgError){errors++;o.error=e.msg;lines.push('ERROR:  '+e.msg);if(e.detail){lines.push(e.detail);}}
      else if(e instanceof Limit){o.limit=e.msg;lines.push('Stopped (line '+st.line+'): '+e.msg);}
      else{o.limit='internal';lines.push('Stopped (line '+st.line+'): this practice editor could not evaluate this statement.');}}
    outcomes.push(o);});
  var stopped=outcomes.some(function(o){return o.limit;});
  return {status:stopped?'stopped':(errors?'error':'ran'),lines:lines,outcomes:outcomes,db:db,
    summary:outcomes.length+' statement'+(outcomes.length===1?'':'s')+' run'+(errors?', '+errors+' with an ERROR':'')+(stopped?', one stopped at a lesson limit':'')+'. See Output.'};}
return {id:'sql-practice',version:'1',language:'SQL',kindLabels:{error:'Error',limit:'Lesson check',hint:'Hint'},
  check:check,notRun:notRun,run:function(program,schema){return run(program,schema);},show:show,table:table,numStr:numStr};
})();
