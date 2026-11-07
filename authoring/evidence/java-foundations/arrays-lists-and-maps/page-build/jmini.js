/* jmini@1: a bounded, deterministic interpreter for a small Java subset, used only by the practice editors on
   these pages. It reads int, boolean and String values, int[] and String[] arrays, List and ArrayList, Map and
   HashMap, Integer, if/else, while, for, enhanced for, break, continue, return, static methods,
   System.out.print/println, Arrays.toString and the listed collection methods. Anything else is reported as a
   lesson check (not supported here), never as invalid Java. "Error" is used only where javac certainly rejects
   the code. Runs have a step limit, so a loop that never ends stops honestly instead of freezing the page.
   No network, storage, eval or timers. */
var JMINI=(function(){
'use strict';
var MAX_STEPS=20000,MAX_DEPTH=64,MAX_SIZE=64;
function own(o,k){return Object.prototype.hasOwnProperty.call(o,k);}
function Problem(kind,line,col,msg){this.kind=kind;this.line=line||1;this.col=col||1;this.msg=msg;}
function limit(t,msg){return new Problem('limit',t?t.line:1,t?t.col:1,msg);}
function cerr(t,msg){return new Problem('error',t?t.line:1,t?t.col:1,msg);}
function JavaThrow(type,msg,line){this.jt=type;this.msg=msg;this.line=line;}
function Stop(msg,line){this.stop=msg;this.line=line;}
function Flow(kind,value){this.flow=kind;this.value=value;}

/* ---------- tokens ---------- */
var KW={'int':1,'boolean':1,'if':1,'else':1,'while':1,'for':1,'return':1,'break':1,'continue':1,'new':1,'true':1,'false':1,'null':1,'static':1,'void':1,'public':1,'private':1,'final':1};
var UNSUPPORTED_KW={'double':'double values','float':'float values','long':'long values','char':'char values','byte':'byte values','short':'short values','do':'do-while loops','switch':'switch','try':'try/catch','catch':'try/catch','throw':'throw','class':'class declarations','var':'var declarations','this':'this','import':'import lines','package':'package lines','instanceof':'instanceof','yield':'yield','record':'records','enum':'enums','interface':'interfaces','super':'super','synchronized':'synchronized','assert':'assert','case':'switch','default':'switch'};
var OPS=['>>>=','<<=','>>=','>>>','...','::','->','==','!=','<=','>=','&&','||','++','--','+=','-=','*=','/=','%=','&=','|=','^=','<<','>>','(',')','{','}','[',']',';',',','.','=','<','>','!','~','?',':','+','-','*','/','%','&','|','^','@'];
function tokenize(src){
  var out=[],i=0,line=1,col=1,n=src.length;
  function adv(k){for(var j=0;j<k;j++){if(src[i]==='\n'){line++;col=1;}else{col++;}i++;}}
  while(i<n){
    var c=src[i];
    if(c===' '||c==='\t'||c==='\r'||c==='\n'){adv(1);continue;}
    if(c==='/'&&src[i+1]==='/'){while(i<n&&src[i]!=='\n'){adv(1);}continue;}
    if(c==='/'&&src[i+1]==='*'){var sl=line,sc=col;adv(2);while(i<n&&!(src[i]==='*'&&src[i+1]==='/')){adv(1);}
      if(i>=n){throw cerr({line:sl,col:sc},'This /* comment is never closed with */.');}adv(2);continue;}
    var t={line:line,col:col};
    if(/[0-9]/.test(c)){var m=/^[0-9][0-9_a-zA-Z.]*/.exec(src.slice(i))[0];
      if(!/^(0|[1-9][0-9]*)$/.test(m)){throw limit(t,'This practice editor reads only plain whole numbers such as 0, 7 or 42, not '+m+'.');}
      var v=Number(m);if(v>2147483648){throw cerr(t,'integer number too large: '+m+' (an int holds at most 2147483647).');}
      t.type='num';t.value=v;t.text=m;adv(m.length);out.push(t);continue;}
    if(/[A-Za-z_$]/.test(c)){var w=/^[A-Za-z_$][A-Za-z0-9_$]*/.exec(src.slice(i))[0];t.type=own(KW,w)?'kw':'id';t.value=w;t.text=w;adv(w.length);out.push(t);continue;}
    if(c==='"'){var s='',j=i+1;
      if(src.slice(i,i+3)==='"""'){throw limit(t,'Text blocks (""") are outside this practice editor.');}
      while(j<n&&src[j]!=='"'){if(src[j]==='\n'){throw cerr(t,'This string is not closed with " before the end of the line.');}
        if(src[j]==='\\'){var e=src[j+1],map={n:'\n',t:'\t','"':'"','\\':'\\',"'":"'"};if(!(e in map)){throw limit(t,'Only the escapes \\n, \\t, \\" and \\\\ are read here.');}s+=map[e];j+=2;}
        else{s+=src[j];j++;}}
      if(j>=n){throw cerr(t,'This string is not closed with ".');}
      t.type='str';t.value=s;t.text=src.slice(i,j+1);adv(j+1-i);out.push(t);continue;}
    if(c==="'"){throw limit(t,'char values (single quotes) are outside this practice editor; use a String in double quotes.');}
    var op=null;for(var k=0;k<OPS.length;k++){if(src.substr(i,OPS[k].length)===OPS[k]){op=OPS[k];break;}}
    if(!op){throw limit(t,'The character '+c+' is outside this practice editor.');}
    t.type='op';t.value=op;t.text=op;adv(op.length);out.push(t);}
  out.push({type:'eof',value:'',text:'end of code',line:line,col:col});
  return out;}

/* ---------- parser ---------- */
function Parser(toks){this.t=toks;this.i=0;}
var P=Parser.prototype;
P.peek=function(o){return this.t[this.i+(o||0)];};
P.next=function(){return this.t[this.i++];};
P.is=function(v,o){var t=this.peek(o);return (t.type==='op'||t.type==='kw')&&t.value===v;};
P.eat=function(v){if(this.is(v)){return this.next();}return null;};
P.want=function(v,what){if(this.is(v)){return this.next();}var t=this.peek();
  throw limit(t,'The practice editor expected '+v+(what?' '+what:'')+' here, but found '+(t.type==='eof'?'the end of the code':t.text)+'.');};
P.ident=function(what){var t=this.peek();if(t.type==='id'){if(own(UNSUPPORTED_KW,t.value)){throw limit(t,UNSUPPORTED_KW[t.value]+' are outside this practice editor.');}return this.next();}
  throw limit(t,'The practice editor expected '+(what||'a name')+' here, but found '+(t.type==='eof'?'the end of the code':t.text)+'.');};
P.checkUnsupported=function(){var t=this.peek();if(t.type==='id'&&own(UNSUPPORTED_KW,t.value)){throw limit(t,UNSUPPORTED_KW[t.value]+' are outside this practice editor.');}};
/* Types: int, boolean, String, Integer, Boolean, List<T>, ArrayList<T>, Map<K,V>, HashMap<K,V>, each optionally []. */
P.typeStart=function(o){var t=this.peek(o||0);if(t.type==='kw'&&(t.value==='int'||t.value==='boolean')){return true;}
  return t.type==='id'&&/^(String|Integer|Boolean|List|ArrayList|Map|HashMap)$/.test(t.value);};
P.looksLikeDecl=function(){if(this.is('final')){return true;}if(!this.typeStart()){return false;}
  var j=this.i,depth=0,t=this.t;j++;
  if(t[j].value==='<'){depth=1;j++;while(depth>0&&t[j].type!=='eof'){if(t[j].value==='<'){depth++;}else if(t[j].value==='>'){depth--;}else if(t[j].value==='>>'){depth-=2;}j++;}}
  while(t[j].value==='['&&t[j+1].value===']'){j+=2;}
  return t[j].type==='id';};
P.type=function(){var t=this.peek(),ty;
  if(t.type==='kw'&&(t.value==='int'||t.value==='boolean')){this.next();ty={base:t.value};}
  else if(t.type==='id'){this.checkUnsupported();
    if(!/^(String|Integer|Boolean|List|ArrayList|Map|HashMap)$/.test(t.value)){throw limit(t,'The type '+t.value+' is outside this practice editor; it reads int, boolean, String, Integer, arrays, List/ArrayList and Map/HashMap.');}
    this.next();ty={base:t.value};
    if(/^(List|ArrayList|Map|HashMap)$/.test(t.value)){
      if(this.is('<')){this.next();var args=[];
        if(this.is('>')){throw limit(t,'The diamond <> belongs after new, as in new '+(/Map/.test(t.value)?'HashMap':'ArrayList')+'<>(); the declared type names its element type.');}
        do{var at=this.peek();
          if(at.type==='kw'&&(at.value==='int'||at.value==='boolean')&&!(this.peek(1).value==='['&&this.peek(2).value===']')){throw cerr(at,'unexpected type: required reference, found '+at.value+'. Type arguments may be reference types or wildcards; here use '+(at.value==='int'?'Integer':'Boolean')+', a reference type, instead of primitive '+at.value+'.');}
          if(at.type==='id'&&/^(double|long|char|float|short|byte)$/.test(at.value)){if(this.peek(1).value==='['&&this.peek(2).value===']'){throw limit(at,'Not supported in this practice editor: array reference types as generic type arguments. This is legal Java.');}throw cerr(at,'unexpected type: required reference, found '+at.value+'. Type arguments may be reference types or wildcards, not primitives.');}
          var a=this.type();if(a.arr){throw limit(at,'Not supported in this practice editor: array reference types as generic type arguments. This is legal Java.');}args.push(a);}while(this.eat(','));
        if(this.is('>>')){this.t[this.i]={type:'op',value:'>',text:'>',line:this.peek().line,col:this.peek().col+1};}else{this.want('>','to close the type arguments');}
        var need=/Map/.test(t.value)?2:1;if(args.length!==need){throw cerr(t,t.value+' takes '+need+' type argument'+(need>1?'s':'')+'.');}
        ty.args=args;}
      else{throw limit(t,'Give '+t.value+' its element type, such as '+(/Map/.test(t.value)?t.value+'<String, Integer>':t.value+'<Integer>')+'; raw types are outside this practice editor.');}}}
  else{throw limit(t,'The practice editor expected a type here.');}
  while(this.is('[')&&this.peek(1).value===']'){this.next();this.next();ty={base:'array',el:ty,arr:true};
    if(ty.el.arr){throw limit(t,'Arrays of arrays are outside this practice editor.');}
    if(ty.el.args){throw limit(t,'Arrays of lists or maps are outside this practice editor.');}}
  return ty;};
P.program=function(mode){var methods=[],stmts=[];
  if(mode==='methods'){while(this.peek().type!=='eof'){methods.push(this.method());}return {methods:methods};}
  while(this.peek().type!=='eof'){stmts.push(this.statement());}return {stmts:stmts};};
P.method=function(){var start=this.peek();
  while(this.is('public')||this.is('private')||this.is('final')){this.next();}
  if(this.peek().type==='id'&&this.peek().value==='class'){throw limit(this.peek(),'Write only the method here; the page supplies the class around it.');}
  if(!this.eat('static')){throw limit(this.peek(),'Each method here starts with static, as in the starter.');}
  var rt;if(this.eat('void')){rt={base:'void'};}else{rt=this.type();}
  var name=this.ident('the method name');this.want('(','after the method name');var params=[];
  if(!this.is(')')){do{if(this.eat('final')){}var pt=this.type(),pn=this.ident('a parameter name');params.push({type:pt,name:pn.value,tok:pn});}while(this.eat(','));}
  this.want(')','to close the parameter list');
  if(!this.is('{')){throw limit(this.peek(),'The practice editor expected { to start the method body.');}
  var body=this.block();return {name:name.value,tok:name,ret:rt,params:params,body:body,line:start.line};};
P.block=function(){var open=this.want('{'),stmts=[];
  while(!this.is('}')){if(this.peek().type==='eof'){throw cerr(open,'This { is never closed with }. Java reports: reached end of file while parsing.');}stmts.push(this.statement());}
  this.next();return {k:'block',stmts:stmts,line:open.line};};
P.statement=function(){var t=this.peek();this.checkUnsupported();
  if(t.type==='op'&&t.value==='{'){return this.block();}
  if(t.type==='op'&&t.value===';'){this.next();return {k:'empty',line:t.line};}
  if(t.type==='kw'){
    if(t.value==='if'){this.next();this.want('(','after if');var c=this.expr();this.want(')','to close the if condition');var th=this.statement(),el=null;if(this.eat('else')){el=this.statement();}return {k:'if',c:c,th:th,el:el,line:t.line};}
    if(t.value==='while'){this.next();this.want('(','after while');var wc=this.expr();this.want(')','to close the while condition');return {k:'while',c:wc,body:this.statement(),line:t.line};}
    if(t.value==='for'){return this.forStmt();}
    if(t.value==='return'){this.next();var rv=null;if(!this.is(';')){rv=this.expr();}this.want(';','after return');return {k:'return',e:rv,line:t.line,tok:t};}
    if(t.value==='break'||t.value==='continue'){this.next();if(this.peek().type==='id'){throw limit(this.peek(),'Labelled break and continue are outside this practice editor.');}this.want(';');return {k:t.value,line:t.line,tok:t};}
    if(t.value==='else'){throw cerr(t,"'else' without 'if': check the braces before this else.");}
    if(t.value==='static'||t.value==='public'||t.value==='private'){throw limit(t,'Write statements here; a method declaration does not belong inside this code.');}}
  if(this.looksLikeDecl()){var d=this.decl();this.want(';','to end the declaration');return d;}
  var e=this.expr();
  if(!/^(assign|pre|post|call|newcoll)$/.test(e.k)){throw cerr(t,'not a statement: Java allows only an assignment, ++, --, a method call or class instance creation as a statement on its own.');}
  this.want(';','to end the statement');return {k:'expr',e:e,line:t.line};};
P.decl=function(){var fin=!!this.eat('final'),start=this.peek(),ty=this.type(),list=[];
  do{var nm=this.ident('a variable name'),init=null;
    if(this.is('[')){throw limit(this.peek(),'Put [] after the type, as in int[] '+nm.value+', in this practice editor.');}
    if(this.eat('=')){if(this.is('{')){if(!ty.arr){throw cerr(this.peek(),'illegal initializer for '+tyName(ty)+': braces { } initialize only arrays.');}init=this.arrayInit(ty.el);}else{init=this.expr();}}
    list.push({name:nm.value,tok:nm,init:init});}while(this.eat(','));
  return {k:'decl',type:ty,vars:list,fin:fin,line:start.line};};
P.arrayInit=function(el){var open=this.want('{'),items=[];
  if(!this.is('}')){do{if(this.is('}')){break;}if(this.is('{')){throw limit(this.peek(),'Nested array braces are outside this practice editor.');}items.push(this.expr());}while(this.eat(','));}
  this.want('}','to close the array values');return {k:'arrlit',el:el,items:items,line:open.line,tok:open};};
P.forStmt=function(){var t=this.next();this.want('(','after for');
  if(this.looksLikeDecl()){var save=this.i,fin=!!this.eat('final'),ty=this.type(),nm=this.ident('a loop variable');
    if(this.eat(':')){var src=this.expr();this.want(')','to close the for header');return {k:'foreach',type:ty,name:nm.value,tok:nm,src:src,body:this.statement(),line:t.line};}
    this.i=save;}
  var init=null;if(!this.is(';')){if(this.looksLikeDecl()){init=this.decl();}else{init={k:'expr',e:this.expr(),line:t.line};}}
  this.want(';','after the for loop start');var cond=null;if(!this.is(';')){cond=this.expr();}
  this.want(';','after the for loop condition');var upd=[];
  if(!this.is(')')){do{var u=this.expr();if(!/^(assign|pre|post|call)$/.test(u.k)){throw cerr(this.peek(),'not a statement: the for update must be an assignment, ++, -- or a method call.');}upd.push(u);}while(this.eat(','));}
  this.want(')','to close the for header');return {k:'for',init:init,cond:cond,upd:upd,body:this.statement(),line:t.line};};
P.expr=function(){return this.assign();};
P.assign=function(){var lhs=this.ternary(),t=this.peek();
  if(t.type==='op'&&/^(=|\+=|-=|\*=|\/=|%=)$/.test(t.value)){this.next();
    if(!(lhs.k==='name'||lhs.k==='index')){throw cerr(t,'unexpected type: the left side of '+t.value+' must be a variable or an array element.');}
    var rhs=this.is('{')?null:this.assign();if(rhs===null){throw cerr(t,'array initializer braces { } are allowed only in a declaration; use new int[]{...} here.');}
    return {k:'assign',op:t.value,l:lhs,r:rhs,tok:t,line:t.line};}
  if(t.type==='op'&&/^(&=|\|=|\^=|<<=|>>=|>>>=)$/.test(t.value)){throw limit(t,'The operator '+t.value+' is outside this practice editor.');}
  return lhs;};
P.ternary=function(){var c=this.or();if(this.is('?')){var q=this.next(),a=this.assign();this.want(':','in the ? : expression');var b=this.ternary();return {k:'cond',c:c,a:a,b:b,tok:q,line:q.line};}return c;};
function bin(name,ops,nextName){return function(){var l=this[nextName]();while(true){var t=this.peek();if(t.type==='op'&&ops.indexOf(t.value)>=0){this.next();l={k:'bin',op:t.value,l:l,r:this[nextName](),tok:t,line:t.line};}else{return l;}}};}
P.or=bin('or',['||'],'and');P.and=bin('and',['&&'],'bitor');
P.bitor=function(){var l=this.eq(),t=this.peek();if(t.type==='op'&&/^(\||&|\^)$/.test(t.value)){throw limit(t,'The operator '+t.value+' is outside this practice editor; use && or || for conditions.');}return l;};
P.eq=bin('eq',['==','!='],'rel');P.rel=bin('rel',['<','>','<=','>='],'shift');
P.shift=function(){var l=this.add(),t=this.peek();if(t.type==='op'&&/^(<<|>>|>>>)$/.test(t.value)){throw limit(t,'Shift operators are outside this practice editor.');}return l;};
P.add=bin('add',['+','-'],'mul');P.mul=bin('mul',['*','/','%'],'unary');
P.unary=function(){var t=this.peek();
  if(t.type==='op'&&t.value==='-'&&this.peek(1).type==='num'&&this.peek(1).value===2147483648){this.next();var min=this.next();return {k:'lit',v:-2147483648,ty:'int',line:t.line,tok:min};}
  if(t.type==='op'&&(t.value==='!'||t.value==='-'||t.value==='+')){this.next();return {k:'un',op:t.value,e:this.unary(),tok:t,line:t.line};}
  if(t.type==='op'&&(t.value==='++'||t.value==='--')){this.next();var e=this.unary();if(!(e.k==='name'||e.k==='index')){throw cerr(t,'unexpected type: '+t.value+' needs a variable.');}return {k:'pre',op:t.value,e:e,tok:t,line:t.line};}
  if(t.type==='op'&&t.value==='~'){throw limit(t,'The operator ~ is outside this practice editor.');}
  if(t.type==='op'&&t.value==='('&&this.peek(1).type==='kw'&&/^(int|boolean)$/.test(this.peek(1).value)&&this.peek(2).value===')'){throw limit(t,'Casts are outside this practice editor.');}
  if(t.type==='op'&&t.value==='('&&this.peek(1).type==='id'&&/^(Integer|String)$/.test(this.peek(1).value)&&this.peek(2).value===')'){throw limit(t,'Casts are outside this practice editor.');}
  return this.postfix();};
P.postfix=function(){var e=this.primary();
  while(true){var t=this.peek();
    if(t.type==='op'&&t.value==='.'){this.next();var nm=this.ident('a method or field name');
      if(this.is('(')){e={k:'call',obj:e,name:nm.value,args:this.args(),tok:nm,line:nm.line};}
      else{e={k:'field',obj:e,name:nm.value,tok:nm,line:nm.line};}}
    else if(t.type==='op'&&t.value==='['){this.next();var ix=this.expr();this.want(']','to close the index');e={k:'index',a:e,i:ix,tok:t,line:t.line};}
    else if(t.type==='op'&&(t.value==='++'||t.value==='--')){if(!(e.k==='name'||e.k==='index')){throw cerr(t,'unexpected type: '+t.value+' needs a variable.');}this.next();e={k:'post',op:t.value,e:e,tok:t,line:t.line};}
    else if(t.type==='op'&&t.value==='::'){throw limit(t,'Method references (::) are outside this practice editor.');}
    else if(t.type==='op'&&t.value==='->'){throw limit(t,'Lambdas (->) are outside this practice editor.');}
    else{return e;}}};
P.args=function(){this.want('(');var a=[];if(!this.is(')')){do{a.push(this.expr());}while(this.eat(','));}this.want(')','to close the argument list');return a;};
P.primary=function(){var t=this.peek();this.checkUnsupported();
  if(t.type==='num'){this.next();if(t.value===2147483648){throw cerr(t,'integer number too large: '+t.text+' (an int holds at most 2147483647).');}return {k:'lit',v:t.value,ty:'int',line:t.line,tok:t};}
  if(t.type==='str'){this.next();return {k:'lit',v:t.value,ty:'String',line:t.line,tok:t};}
  if(t.type==='kw'&&(t.value==='true'||t.value==='false')){this.next();return {k:'lit',v:t.value==='true',ty:'boolean',line:t.line,tok:t};}
  if(t.type==='kw'&&t.value==='null'){this.next();return {k:'lit',v:null,ty:'null',line:t.line,tok:t};}
  if(t.type==='op'&&t.value==='('){this.next();var e=this.expr();this.want(')','to close the parenthesis');return e;}
  if(t.type==='kw'&&t.value==='new'){return this.newExpr();}
  if(t.type==='id'){this.next();
    if(this.is('(')){return {k:'call',obj:null,name:t.value,args:this.args(),tok:t,line:t.line};}
    return {k:'name',name:t.value,tok:t,line:t.line};}
  throw limit(t,t.type==='eof'?'The code ends where the practice editor expected a value.':'The practice editor expected a value here, but found '+t.text+'.');};
P.newExpr=function(){var t=this.next(),ty=this.peek();
  if(ty.type==='kw'&&(ty.value==='int'||ty.value==='boolean')||(ty.type==='id'&&/^(String|Integer)$/.test(ty.value))){this.next();var el={base:ty.value};
    if(!this.is('[')){throw limit(ty,'Only new arrays, new ArrayList<>() and new HashMap<>() are read here.');}
    this.next();
    if(this.is(']')){this.next();if(this.is('[')){throw limit(ty,'Arrays of arrays are outside this practice editor.');}if(!this.is('{')){throw cerr(this.peek(),'array dimension missing: write new '+el.base+'[size] or new '+el.base+'[]{values}.');}return this.arrayInit(el);}
    var sz=this.expr();this.want(']','to close the array size');if(this.is('[')){throw limit(ty,'Arrays of arrays are outside this practice editor.');}
    if(this.is('{')){throw cerr(this.peek(),'array creation with both a size and values is not allowed; use one or the other.');}
    return {k:'newarr',el:el,size:sz,tok:t,line:t.line};}
  if(ty.type==='id'&&/^(ArrayList|HashMap)$/.test(ty.value)){this.next();
    if(this.is('<')){this.next();if(!this.is('>')){var a=this.peek();
        if(a.type==='kw'&&/^(int|boolean)$/.test(a.value)){if(this.peek(1).value==='['&&this.peek(2).value===']'){throw limit(a,'Not supported in this practice editor: array reference types as generic type arguments. This is legal Java.');}throw cerr(a,'unexpected type: required reference, found '+a.value+'. Type arguments may be reference types or wildcards; here use '+(a.value==='int'?'Integer':'Boolean')+', a reference type, instead of primitive '+a.value+'.');}
        if(a.type==='id'&&/^(double|long|char|float|short|byte)$/.test(a.value)&&this.peek(1).value==='['&&this.peek(2).value===']'){throw limit(a,'Not supported in this practice editor: array reference types as generic type arguments. This is legal Java.');}
        var depth=1;while(depth>0&&this.peek().type!=='eof'){var x=this.next();if(x.value==='<'){depth++;}else if(x.value==='>'){depth--;}else if(x.value==='>>'){depth-=2;}}}
      else{this.next();}}
    else{throw limit(ty,'Write new '+ty.value+'<>() with the diamond <> in this practice editor.');}
    var args=this.args();if(args.length){throw limit(ty,'Write new '+ty.value+'<>() with empty parentheses in this practice editor.');}
    return {k:'newcoll',kind:ty.value==='ArrayList'?'list':'map',tok:t,line:t.line};}
  if(ty.type==='id'&&/^(List|Map)$/.test(ty.value)){throw cerr(ty,ty.value+' is abstract; cannot be instantiated. Create an '+(ty.value==='List'?'ArrayList':'HashMap')+' instead.');}
  throw limit(ty,'Only new arrays, new ArrayList<>() and new HashMap<>() are read here.');};

/* ---------- values ---------- */
function tyName(t){if(!t){return '?';}if(t.arr){return tyName(t.el)+'[]';}if(t.args){return t.base+'<'+t.args.map(tyName).join(', ')+'>';}return t.base;}
function isRefType(t){return t&&(t.arr||t.args||t.base==='String'||t.base==='Integer'||t.base==='Boolean');}
function defaultFor(t){if(t.base==='int'){return 0;}if(t.base==='boolean'){return false;}return null;}
function newArray(el,n){var a=[];for(var i=0;i<n;i++){a.push(defaultFor(el));}return {k:'arr',el:el,a:a,id:++ARR_ID};}
var ARR_ID=0;
function javaHash(v){if(typeof v==='number'){return v|0;}if(typeof v==='boolean'){return v?1231:1237;}var h=0;for(var i=0;i<v.length;i++){h=(Math.imul(31,h)+v.charCodeAt(i))|0;}return h;}
function spread(h){return (h^(h>>>16))|0;}
/* Iteration order of a java.util.HashMap built only by put (no removals) with default capacity 16 and load factor
   0.75: buckets in index order, entries within a bucket in insertion order. Exact for this editor's sizes. */
function hashOrder(m){var cap=16;while(m.e.length>cap*0.75){cap*=2;}
  return m.e.map(function(e,i){return {e:e,b:spread(javaHash(e.k))&(cap-1),i:i};}).sort(function(x,y){return x.b-y.b||x.i-y.i;}).map(function(x){return x.e;});}
function show(v,ctx){
  if(v===null||v===undefined){return 'null';}
  if(typeof v==='number'||typeof v==='boolean'){return String(v);}
  if(typeof v==='string'){return v;}
  if(v.k==='list'){return '['+v.a.map(function(x){return show(x,ctx);}).join(', ')+']';}
  if(v.k==='map'){return '{'+hashOrder(v).map(function(e){return show(e.k,ctx)+'='+show(e.v,ctx);}).join(', ')+'}';}
  if(v.k==='keys'){return '['+hashOrder(v.m).map(function(e){return show(e.k,ctx);}).join(', ')+']';}
  if(v.k==='arr'){throw new Stop('Printing an array object directly shows a type code and hash such as [I@1b6d3586 in real Java, which this practice editor cannot reproduce. Print Arrays.toString('+(ctx||'the array')+') instead.');}
  return String(v);}
function jeq(a,b){return a===b;}

/* ---------- interpreter ---------- */
function Interp(prog,out){this.prog=prog;this.out=out;this.steps=0;this.depth=0;this.trace=[];this.methods={};
  var self=this;(prog.methods||[]).forEach(function(m){if(self.methods[m.name]){throw cerr(m.tok,'method '+m.name+' is already defined.');}self.methods[m.name]=m;});}
var I=Interp.prototype;
I.tick=function(line){if(++this.steps>MAX_STEPS){throw new Stop('This lesson simulator stopped after '+MAX_STEPS+' steps. A real JDK may continue, terminate later or fail for another reason; check that each loop moves toward its end condition.',line);}};
function Scope(parent){this.v={};this.p=parent;}
Scope.prototype.find=function(n){var s=this;while(s){if(Object.prototype.hasOwnProperty.call(s.v,n)){return s.v[n];}s=s.p;}return null;};
Scope.prototype.declare=function(n,slot,tok){var s=this;while(s){if(Object.prototype.hasOwnProperty.call(s.v,n)){throw cerr(tok,'variable '+n+' is already defined in this method.');}s=s.p;}this.v[n]=slot;};
I.lookup=function(sc,tok){var s=sc.find(tok.value||tok.name);if(!s){throw cerr(tok,'cannot find symbol: variable '+(tok.value||tok.name)+'. Declare it before you use it.');}return s;};
I.toInt=function(v,line,what){if(v===null){throw new JavaThrow('NullPointerException',(what||'A null Integer')+' cannot be unboxed to an int: the value is null.',line);}
  if(typeof v!=='number'){throw new Stop('Java would reject this at compile time: '+(what||'this value')+' is not an int here.',line);}return v;};
I.toBool=function(v,line){if(v===null){throw new JavaThrow('NullPointerException','A null Boolean cannot be unboxed to a boolean.',line);}
  if(typeof v!=='boolean'){throw new Stop('Java would reject this at compile time: a condition must be a boolean (true or false).',line);}return v;};
I.coerce=function(v,ty,line,name){
  if(ty.base==='int'){if(v===null){throw new JavaThrow('NullPointerException','Assigning null to the int '+name+' fails: a null Integer cannot be unboxed to an int.',line);}if(typeof v!=='number'){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is an int.',line);}return v;}
  if(ty.base==='boolean'){if(typeof v!=='boolean'){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is a boolean.',line);}return v;}
  if(v===null){return null;}
  if(ty.base==='Integer'&&typeof v!=='number'){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is an Integer.',line);}
  if(ty.base==='String'&&typeof v!=='string'){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is a String.',line);}
  if(ty.arr&&!(v.k==='arr'&&v.el.base===ty.el.base)){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is '+tyName(ty)+'.',line);}
  if(ty.args){var want=/List/.test(ty.base)?'list':'map';if(!v.k||v.k!==want){throw new Stop('Java would reject this at compile time: incompatible types, '+name+' is '+tyName(ty)+'.',line);}
    if(!v.ty){v.ty=ty;}else if(tyName(v.ty).replace(/^Array|^Hash/,'').replace(/<.*/,'')!==tyName(ty).replace(/^Array|^Hash/,'').replace(/<.*/,'')||JSON.stringify(v.ty.args)!==JSON.stringify(ty.args)){throw new Stop('Java would reject this at compile time: incompatible types, '+tyName(v.ty)+' cannot be assigned to '+tyName(ty)+'.',line);}}
  if(ty.base==='List'||ty.base==='ArrayList'){if(v.k!=='list'){throw new Stop('Java would reject this at compile time: '+name+' is a list.',line);}}
  return v;};
I.elemCheck=function(coll,v,line,role){var t=coll.ty&&coll.ty.args?coll.ty.args[role||0]:null;if(!t||v===null){return v;}
  if(t.base==='Integer'&&typeof v!=='number'||t.base==='String'&&typeof v!=='string'||t.base==='Boolean'&&typeof v!=='boolean'){throw new Stop('Java would reject this at compile time: incompatible types, this '+(coll.k==='map'?(role?'map value':'map key'):'list element')+' must be '+t.base+'.',line);}
  return v;};
I.callMethod=function(name,args,tok){var m=this.methods[name];
  if(!m){throw cerr(tok,'cannot find symbol: method '+name+'. Only the methods written in this file can be called here.');}
  if(m.params.length!==args.length){throw cerr(tok,'method '+name+' needs '+m.params.length+' argument'+(m.params.length===1?'':'s')+', but '+args.length+' '+(args.length===1?'was':'were')+' given.');}
  if(++this.depth>MAX_DEPTH){throw new Stop('Stopped after '+MAX_DEPTH+' nested calls. Real Java would eventually throw StackOverflowError: check the base case.',tok.line);}
  var sc=new Scope(null),self=this;
  m.params.forEach(function(p,i){sc.v[p.name]={ty:p.type,val:self.coerce(args[i],p.type,tok.line,p.name)};});
  try{this.execBlock(m.body.stmts,sc);}
  catch(f){if(f instanceof Flow&&f.flow==='return'){this.depth--;return f.value;}throw f;}
  this.depth--;
  if(m.ret.base!=='void'){throw new Stop('The end of '+name+' was reached without a return. Java\'s compiler requires every path of a non-void method to return a value ("missing return statement").',m.body.line);}
  return undefined;};
I.execBlock=function(stmts,sc){for(var i=0;i<stmts.length;i++){this.exec(stmts[i],sc);}};
I.exec=function(s,sc){this.tick(s.line);var self=this;
  switch(s.k){
  case 'empty':return;
  case 'block':this.execBlock(s.stmts,new Scope(sc));return;
  case 'decl':s.vars.forEach(function(d){var v=defaultFor(s.type),init=false;
      if(d.init){v=d.init.k==='arrlit'?self.arrlit(d.init,sc,s.type):self.ev(d.init,sc);v=self.coerce(v,s.type,s.line,d.name);init=true;}
      sc.declare(d.name,{ty:s.type,val:v,init:init,fin:s.fin},d.tok);});return;
  case 'expr':this.ev(s.e,sc);return;
  case 'if':if(this.toBool(this.ev(s.c,sc),s.line)){this.exec(s.th,new Scope(sc));}else if(s.el){this.exec(s.el,new Scope(sc));}return;
  case 'while':while(this.toBool(this.ev(s.c,sc),s.line)){this.tick(s.line);try{this.exec(s.body,new Scope(sc));}catch(f){if(f instanceof Flow){if(f.flow==='break'){break;}if(f.flow==='continue'){continue;}}throw f;}}return;
  case 'for':var fs=new Scope(sc);if(s.init){this.exec(s.init,fs);}
    while(s.cond?this.toBool(this.ev(s.cond,fs),s.line):true){this.tick(s.line);
      try{this.exec(s.body,new Scope(fs));}catch(f){if(f instanceof Flow){if(f.flow==='break'){break;}if(f.flow!=='continue'){throw f;}}else{throw f;}}
      s.upd.forEach(function(u){self.ev(u,fs);});}return;
  case 'foreach':var src=this.ev(s.src,sc);
    if(src===null){throw new JavaThrow('NullPointerException','The enhanced for loop cannot iterate over null.',s.line);}
    var items,iter=null;
    if(src.k==='arr'){items=src.a.slice();}
    else if(src.k==='list'){iter={list:src,cursor:0,expected:src.mod||0};}
    else if(src.k==='keys'){items=hashOrder(src.m).map(function(e){return e.k;});}
    else{throw new Stop('Java would reject this at compile time: an enhanced for loop needs an array or a collection.',s.line);}
    var idx=0;
    while(true){var val;
      if(iter){if(iter.cursor===iter.list.a.length){break;}if((iter.list.mod||0)!==iter.expected){throw new JavaThrow('ConcurrentModificationException','The list was changed by add or remove inside the enhanced for loop that is reading it.',s.line);}val=iter.list.a[iter.cursor++];}
      else{if(idx>=items.length){break;}val=items[idx++];}
      this.tick(s.line);var ls=new Scope(sc);ls.declare(s.name,{ty:s.type,val:this.coerce(val,s.type,s.line,s.name),init:true},s.tok);
      try{this.exec(s.body,ls);}catch(f){if(f instanceof Flow){if(f.flow==='break'){break;}if(f.flow!=='continue'){throw f;}}else{throw f;}}}
    return;
  case 'return':throw new Flow('return',s.e?this.ev(s.e,sc):undefined);
  case 'break':throw new Flow('break');
  case 'continue':throw new Flow('continue');}
  throw limit({line:s.line},'This statement is outside this practice editor.');};
I.arrlit=function(e,sc,ty){var el=ty&&ty.arr?ty.el:e.el,self=this,arr=newArray(el,0);
  arr.a=e.items.map(function(x){return self.coerce(self.ev(x,sc),el,e.line,'each array value');});
  if(arr.a.length>MAX_SIZE){throw new Stop('Arrays here hold at most '+MAX_SIZE+' values.',e.line);}return arr;};
I.slotOf=function(e,sc){if(e.k==='name'){return this.lookup(sc,e.tok);}return null;};
I.ev=function(e,sc){this.tick(e.line);var self=this,v,a,b;
  switch(e.k){
  case 'lit':return e.v;
  case 'name':var slot=this.lookup(sc,e.tok);if(!slot.init&&!slot.param&&slot.init!==undefined){throw cerr(e.tok,'variable '+e.name+' might not have been initialized.');}return slot.val;
  case 'arrlit':return this.arrlit(e,sc,null);
  case 'newarr':var n=this.toInt(this.ev(e.size,sc),e.line,'The array size');if(n<0){throw new JavaThrow('NegativeArraySizeException',String(n),e.line);}if(n>MAX_SIZE){throw new Stop('Arrays here hold at most '+MAX_SIZE+' values.',e.line);}return newArray(e.el,n);
  case 'newcoll':return e.kind==='list'?{k:'list',a:[],mod:0}:{k:'map',e:[]};
  case 'cond':return this.toBool(this.ev(e.c,sc),e.line)?this.ev(e.a,sc):this.ev(e.b,sc);
  case 'index':var arr=this.ev(e.a,sc);if(arr===null){throw new JavaThrow('NullPointerException','Cannot read an element of a null array.',e.line);}
    if(!arr||arr.k!=='arr'){throw new Stop('Java would reject this at compile time: [ ] indexing works only on arrays. For a list, use get(index).',e.line);}
    var i=this.toInt(this.ev(e.i,sc),e.line,'The index');if(i<0||i>=arr.a.length){throw new JavaThrow('ArrayIndexOutOfBoundsException','Index '+i+' out of bounds for length '+arr.a.length,e.line);}return arr.a[i];
  case 'field':var o=this.ev(e.obj,sc);if(e.name==='length'){if(o===null){throw new JavaThrow('NullPointerException','Cannot read the length of a null array.',e.line);}if(o&&o.k==='arr'){return o.a.length;}
      if(typeof o==='string'){throw cerr(e.tok,'cannot find symbol: length. A String uses length() with parentheses; .length without them is for arrays.');}
      if(o&&o.k==='list'){throw cerr(e.tok,'cannot find symbol: length. A list uses size().');}}
    throw limit(e.tok,'The field '+e.name+' is outside this practice editor.');
  case 'un':v=this.ev(e.e,sc);if(e.op==='!'){return !this.toBool(v,e.line);}v=this.toInt(v,e.line);return e.op==='-'?(-v|0):v;
  case 'pre':case 'post':var pre=this.resolveTarget(e.e,sc,e.tok),old=this.toInt(this.readTarget(pre,e.line),e.line,'The value'),nv=(e.op==='++'?old+1:old-1)|0;this.storeResolved(pre,nv,e.tok);return e.k==='pre'?nv:old;
  case 'assign':var target=this.resolveTarget(e.l,sc,e.tok),rv;if(e.op==='='){rv=this.ev(e.r,sc);}else{var cur=this.readTarget(target,e.line),rr=this.ev(e.r,sc);rv=this.arith(e.op.charAt(0),cur,rr,e);}
    this.storeResolved(target,rv,e.tok);return rv;
  case 'bin':if(e.op==='&&'){return this.toBool(this.ev(e.l,sc),e.line)&&this.toBool(this.ev(e.r,sc),e.line);}
    if(e.op==='||'){return this.toBool(this.ev(e.l,sc),e.line)||this.toBool(this.ev(e.r,sc),e.line);}
    a=this.ev(e.l,sc);b=this.ev(e.r,sc);
    if(e.op==='=='||e.op==='!='){var eq=this.equality(e,a,b,sc);return e.op==='=='?eq:!eq;}
    if(/^(<|>|<=|>=)$/.test(e.op)){a=this.toInt(a,e.line);b=this.toInt(b,e.line);return e.op==='<'?a<b:e.op==='>'?a>b:e.op==='<='?a<=b:a>=b;}
    return this.arith(e.op,a,b,e);
  case 'call':return this.call(e,sc);
  case 'new':return null;}
  throw limit({line:e.line},'This expression is outside this practice editor.');};
I.staticType=function(e,sc){
  if(e.k==='lit'){return e.ty;}
  if(e.k==='name'){var s=sc.find(e.name);return s?tyName(s.ty):null;}
  if(e.k==='un'){return e.op==='!'?'boolean':this.staticType(e.e,sc)==='int'?'int':null;}
  if(e.k==='bin'){
    if(/^(==|!=|<|>|<=|>=|&&|\|\|)$/.test(e.op)){return 'boolean';}
    return this.staticType(e.l,sc)==='int'&&this.staticType(e.r,sc)==='int'?'int':null;}
  if(e.k==='pre'||e.k==='post'){return this.staticType(e.e,sc)==='int'?'int':null;}
  if(e.k==='call'&&e.obj){var o=e.obj.k==='name'?sc.find(e.obj.name):null;
    if(o&&o.ty.args){
      if(e.name==='remove'&&/List/.test(o.ty.base)){return e.args.length&&this.staticType(e.args[0],sc)==='int'?tyName(o.ty.args[0]):'boolean';}
      if(/^(size|indexOf)$/.test(e.name)&&/List/.test(o.ty.base)){return 'int';}
      if(/^(get|set)$/.test(e.name)&&/List/.test(o.ty.base)){return tyName(o.ty.args[0]);}
      if(/^(get|getOrDefault)$/.test(e.name)&&/Map/.test(o.ty.base)){return tyName(o.ty.args[1]);}}}
  if(e.k==='index'){var arr=e.a.k==='name'?sc.find(e.a.name):null;if(arr&&arr.ty.arr){return tyName(arr.ty.el);}}
  return null;};
I.equality=function(e,a,b,sc){var ta=this.staticType(e.l,sc),tb=this.staticType(e.r,sc);
  if(typeof a==='string'&&typeof b==='string'||ta==='String'&&tb==='String'){throw new Stop('Comparing two Strings with '+e.op+' compares object references, not text. Use equals, as in a.equals(b); this practice editor does not model references.',e.line);}
  if(ta==='Integer'&&tb==='Integer'){throw new Stop('Comparing two Integer objects with '+e.op+' compares references, which can be false for equal values above 127. Use equals, or compare int values; this practice editor does not model references.',e.line);}
  if(a===null||b===null){if((ta==='int'&&b===null)||(tb==='int'&&a===null)){throw new Stop('Java would reject this at compile time: operator '+e.op+' cannot compare an int with null.',e.line);}return a===b;}
  if(typeof a==='number'&&typeof b==='number'||typeof a==='boolean'&&typeof b==='boolean'){return a===b;}
  if(typeof a==='object'&&typeof b==='object'){return a===b;}
  throw new Stop('Java would reject this at compile time: these two values cannot be compared with '+e.op+'.',e.line);};
I.arith=function(op,a,b,e){
  if(op==='+'&&(typeof a==='string'||typeof b==='string')){
    if(a&&typeof a==='object'||b&&typeof b==='object'){var tgt=typeof a==='object'?a:b;if(tgt.k==='arr'){throw new Stop('Joining an array object to a String shows a type code and hash such as [I@1b6d3586 in real Java. Use Arrays.toString(...) instead.',e.line);}}
    return show(a)+show(b);}
  if(typeof a==='string'||typeof b==='string'){throw new Stop('Java would reject this at compile time: the operator '+op+' does not apply to a String.',e.line);}
  a=this.toInt(a,e.line);b=this.toInt(b,e.line);
  switch(op){case '+':return (a+b)|0;case '-':return (a-b)|0;case '*':return Math.imul(a,b);
    case '/':if(b===0){throw new JavaThrow('ArithmeticException','/ by zero',e.line);}return (a/b)|0;
    case '%':if(b===0){throw new JavaThrow('ArithmeticException','/ by zero',e.line);}return (a%b)|0;}
  throw limit(e.tok,'The operator '+op+' is outside this practice editor.');};
I.resolveTarget=function(target,sc,tok){
  if(target.k==='name'){return {k:'slot',slot:this.lookup(sc,target.tok),target:target};}
  var arr=this.ev(target.a,sc),i=this.toInt(this.ev(target.i,sc),tok.line,'The index');
  return {k:'array',arr:arr,index:i,target:target};};
I.readTarget=function(ref,line){
  if(ref.k==='slot'){var s=ref.slot;if(!s.init&&!s.param&&s.init!==undefined){throw cerr(ref.target.tok,'variable '+ref.target.name+' might not have been initialized.');}return s.val;}
  if(ref.arr===null){throw new JavaThrow('NullPointerException','Cannot read an element of a null array.',line);}
  if(!ref.arr||ref.arr.k!=='arr'){throw new Stop('Java would reject this at compile time: [ ] indexing works only on arrays. For a list, use get(index).',line);}
  if(ref.index<0||ref.index>=ref.arr.a.length){throw new JavaThrow('ArrayIndexOutOfBoundsException','Index '+ref.index+' out of bounds for length '+ref.arr.a.length,line);}return ref.arr.a[ref.index];};
I.storeResolved=function(ref,v,tok){
  if(ref.k==='slot'){var s=ref.slot;if(s.fin&&s.init){throw cerr(ref.target.tok,'cannot assign a value to final variable '+ref.target.name+'.');}s.val=this.coerce(v,s.ty,tok.line,ref.target.name);s.init=true;return;}
  if(ref.arr===null){throw new JavaThrow('NullPointerException','Cannot store into a null array.',tok.line);}
  if(!ref.arr||ref.arr.k!=='arr'){throw new Stop('Java would reject this at compile time: [ ] indexing works only on arrays. For a list, use set(index, value).',tok.line);}
  if(ref.index<0||ref.index>=ref.arr.a.length){throw new JavaThrow('ArrayIndexOutOfBoundsException','Index '+ref.index+' out of bounds for length '+ref.arr.a.length,tok.line);}
  ref.arr.a[ref.index]=this.coerce(v,ref.arr.el,tok.line,'each element');};
I.store=function(target,v,sc,tok){this.storeResolved(this.resolveTarget(target,sc,tok),v,tok);};
function argc(e,n,sig){if(e.args.length!==n){throw cerr(e.tok,'no suitable method found for '+e.name+' with '+e.args.length+' argument'+(e.args.length===1?'':'s')+'; it takes '+sig+'.');}}
I.call=function(e,sc){var self=this,line=e.line;
  if(!e.obj){return this.callMethod(e.name,e.args.map(function(x){return self.ev(x,sc);}),e.tok);}
  if(e.obj.k==='field'&&e.obj.obj.k==='name'&&e.obj.obj.name==='System'&&e.obj.name==='out'){
    if(e.name!=='println'&&e.name!=='print'){throw limit(e.tok,'Only System.out.print and System.out.println are read here.');}
    if(e.args.length>1){throw cerr(e.tok,'no suitable method found for '+e.name+' with '+e.args.length+' arguments.');}
    var txt=e.args.length?show(this.ev(e.args[0],sc),e.args[0].k==='name'?e.args[0].name:null):'';
    this.out.push({t:txt,nl:e.name==='println'});if(this.out.length>200){throw new Stop('Stopped after 200 printed lines.',line);}return undefined;}
  if(e.obj.k==='name'&&e.obj.name==='Arrays'&&!sc.find('Arrays')){
    if(e.name!=='toString'){throw limit(e.tok,'Only Arrays.toString is read in this practice editor.');}argc(e,1,'one array');
    var ar=this.ev(e.args[0],sc);if(ar===null){return 'null';}if(!ar||ar.k!=='arr'){throw new Stop('Java would reject this at compile time: Arrays.toString needs an array.',line);}
    return '['+ar.a.map(function(x){return show(x);}).join(', ')+']';}
  if(e.obj.k==='name'&&/^(Math|Integer|String|List|Map|Collections|Objects)$/.test(e.obj.name)&&!sc.find(e.obj.name)){throw limit(e.tok,e.obj.name+'.'+e.name+' is outside this practice editor.');}
  var receiverType=this.staticType(e.obj,sc),o=this.ev(e.obj,sc);
  if(o===null){throw new JavaThrow('NullPointerException','Cannot call '+e.name+'() on null.',line);}
  var A=function(i){return self.ev(e.args[i],sc);};
  if(typeof o==='string'){
    if(e.name==='length'){argc(e,0,'no arguments');return o.length;}
    if(e.name==='equals'){argc(e,1,'one argument');var x=A(0);return typeof x==='string'&&x===o;}
    if(e.name==='isEmpty'){argc(e,0,'no arguments');return o.length===0;}
    throw limit(e.tok,'String.'+e.name+' is outside this practice editor; it reads length, equals and isEmpty.');}
  if(o.k==='arr'){if(e.name==='length'){throw cerr(e.tok,'cannot find symbol: length(). An array uses .length without parentheses.');}throw limit(e.tok,'Arrays have no '+e.name+' method in this practice editor.');}
  if(o.k==='list'){var L=o.a,n=L.length;
    function idx(i,max){if(i<0||i>=max){throw new JavaThrow('IndexOutOfBoundsException','Index '+i+' out of bounds for length '+n,line);}return i;}
    switch(e.name){
    case 'add':if(e.args.length===1){if(n>=MAX_SIZE){throw new Stop('Lists here hold at most '+MAX_SIZE+' values.',line);}L.push(this.elemCheck(o,A(0),line));o.mod=(o.mod||0)+1;return true;}
      argc(e,2,'one value, or an index and a value');var ai=this.toInt(A(0),line,'The index');if(ai<0||ai>n){throw new JavaThrow('IndexOutOfBoundsException','Index: '+ai+', Size: '+n,line);}L.splice(ai,0,this.elemCheck(o,A(1),line));o.mod=(o.mod||0)+1;return undefined;
    case 'get':argc(e,1,'one index');return L[idx(this.toInt(A(0),line,'The index'),n)];
    case 'set':argc(e,2,'an index and a value');var si=idx(this.toInt(A(0),line,'The index'),n),prev=L[si];L[si]=this.elemCheck(o,A(1),line);this.trace.push({kind:'list',method:'set',receiver:o});return prev;
    case 'size':argc(e,0,'no arguments');return n;
    case 'isEmpty':argc(e,0,'no arguments');return n===0;
    case 'contains':argc(e,1,'one value');var cv=A(0);return L.some(function(x){return jeq(x,cv);});
    case 'indexOf':argc(e,1,'one value');var iv=A(0);for(var k=0;k<n;k++){if(jeq(L[k],iv)){return k;}}return -1;
    case 'clear':argc(e,0,'no arguments');L.length=0;o.mod=(o.mod||0)+1;return undefined;
    case 'remove':argc(e,1,'one index or one value');
      /* Java picks remove(int index) for an int argument and remove(Object o) for an object such as a String or Integer. */
      var st=this.staticType(e.args[0],sc),rv=A(0);
      if(typeof rv==='number'&&st==='int'){var ri=idx(rv,n),gone=L[ri];L.splice(ri,1);o.mod=(o.mod||0)+1;this.trace.push({kind:'list',method:'remove',receiver:o});return gone;}
      if(typeof rv==='number'&&st===null){throw limit(e.tok,'This practice editor cannot tell whether this remove is by index or by value.');}
      for(var r=0;r<n;r++){if(jeq(L[r],rv)){L.splice(r,1);o.mod=(o.mod||0)+1;this.trace.push({kind:'list',method:'remove',receiver:o});return true;}}this.trace.push({kind:'list',method:'remove',receiver:o});return false;}
    throw limit(e.tok,'List.'+e.name+' is outside this practice editor; it reads add, get, set, remove, size, isEmpty, contains, indexOf and clear.');}
  if(o.k==='map'){var E=o.e;function find(k){for(var q=0;q<E.length;q++){if(jeq(E[q].k,k)){return E[q];}}return null;}
    switch(e.name){
    case 'put':argc(e,2,'a key and a value');var pk=this.elemCheck(o,A(0),line,0),pv=this.elemCheck(o,A(1),line,1),hit=find(pk);if(hit){var was=hit.v;hit.v=pv;return was;}
      if(E.length>=MAX_SIZE){throw new Stop('Maps here hold at most '+MAX_SIZE+' entries.',line);}E.push({k:pk,v:pv});return null;
    case 'get':argc(e,1,'one key');var g=find(A(0));return g?g.v:null;
    case 'getOrDefault':argc(e,2,'a key and a default value');var gd=find(A(0)),dv=A(1);return gd?gd.v:dv;
    case 'containsKey':argc(e,1,'one key');return !!find(A(0));
    case 'size':argc(e,0,'no arguments');return E.length;
    case 'isEmpty':argc(e,0,'no arguments');return E.length===0;
    case 'keySet':argc(e,0,'no arguments');return {k:'keys',m:o};
    case 'merge':case 'compute':case 'computeIfAbsent':case 'putIfAbsent':case 'remove':case 'entrySet':case 'values':
      throw limit(e.tok,'Map.'+e.name+' is outside this practice editor; use put, get, getOrDefault and containsKey here.');}
    throw limit(e.tok,'Map.'+e.name+' is outside this practice editor; it reads put, get, getOrDefault, containsKey, size, isEmpty and keySet.');}
  if(o.k==='keys'){throw limit(e.tok,'Use keySet() only in an enhanced for loop in this practice editor.');}
  if(receiverType==='Integer'){
    if(e.name==='intValue'){argc(e,0,'no arguments');return o;}
    if(e.name==='equals'){argc(e,1,'one argument');var ie=A(0);return typeof ie==='number'&&ie===o;}
    if(e.name==='compareTo'){argc(e,1,'one Integer');var ic=this.toInt(A(0),line,'The argument');return o<ic?-1:o>ic?1:0;}
    if(e.name==='toString'){argc(e,0,'no arguments');return String(o);}
    throw limit(e.tok,'Integer.'+e.name+' is valid Java but is outside this practice editor; it reads intValue, equals, compareTo and toString.');}
  if(receiverType==='Boolean'){
    if(e.name==='booleanValue'){argc(e,0,'no arguments');return o;}
    if(e.name==='equals'){argc(e,1,'one argument');var be=A(0);return typeof be==='boolean'&&be===o;}
    if(e.name==='compareTo'){argc(e,1,'one Boolean');var bc=A(0);if(bc===null){throw new JavaThrow('NullPointerException','Boolean.compareTo cannot compare with null.',line);}if(typeof bc!=='boolean'){throw new Stop('Java would reject this at compile time: compareTo needs a Boolean.',line);}return o===bc?0:o?1:-1;}
    if(e.name==='toString'){argc(e,0,'no arguments');return String(o);}
    throw limit(e.tok,'Boolean.'+e.name+' is valid Java but is outside this practice editor; it reads booleanValue, equals, compareTo and toString.');}
  if(typeof o==='number'||typeof o==='boolean'){
    if(receiverType==='int'||receiverType==='boolean'){throw cerr(e.tok,receiverType+' cannot be dereferenced: a primitive value has no methods.');}
    throw limit(e.tok,'This receiver method is valid only when the value has a wrapper reference type; that static type is outside this practice editor\'s current check.');}
  throw limit(e.tok,'This method call is outside this practice editor.');};

/* ---------- public API ---------- */
function parse(src,mode){var toks;try{toks=tokenize(String(src));}catch(p){if(p instanceof Problem){return {problems:[p]};}throw p;}
  var bad=null;toks.forEach(function(t){if(!bad&&t.type==='id'&&t.value==='___'){bad=t;}});
  if(bad){return {problems:[limit(bad,'Replace the ___ placeholder with your own code.')]};}
  try{var prog=new Parser(toks).program(mode);return {problems:[],prog:prog};}
  catch(p){if(p instanceof Problem){return {problems:[p]};}throw p;}}
/* run: executes a parsed program. For 'methods' mode, entry = {name, args}; for 'statements' mode, entry is null. */
function run(prog,entry){var out=[],it,result,status='ok',err=null;
  try{it=new Interp(prog,out);
    if(entry){if(!it.methods[entry.name]){return {status:'problem',problems:[cerr({line:1,col:1},'The method '+entry.name+' is missing; keep its first line from the starter.')]};}
      var m=it.methods[entry.name];
      if(entry.check){var msg=entry.check(m,tyName);if(msg){return {status:'problem',problems:[limit({line:m.line,col:1},msg)]};}}
      result=it.callMethod(entry.name,entry.args,m.tok);}
    else{var sc=new Scope(null);try{it.execBlock(prog.stmts,sc);}catch(f){if(f instanceof Flow){if(f.flow==='return'){throw new Stop('return is outside this practice snippet; the lines run as the body of main.',1);}throw new Stop(f.flow+' outside a loop: Java\'s compiler rejects it.',1);}throw f;}
      result=sc;}}
  catch(x){if(x instanceof JavaThrow){status='exception';err={type:x.jt,msg:x.msg,line:x.line};}
    else if(x instanceof Stop){status='stopped';err={msg:x.stop,line:x.line};}
    else if(x instanceof Problem){return {status:'problem',problems:[x],out:out};}
    else{throw x;}}
  return {status:status,result:result,out:out,err:err,steps:it?it.steps:0,trace:it?it.trace:[]};}
/* Exception text as the JVM prints its first line. Index exceptions carry the JDK's own message; for the others the
   JVM's detail message varies by version, so the explanation is shown as a separate simulator note instead. */
function exceptionText(err,where){var pkg=err.type==='ConcurrentModificationException'?'java.util.':'java.lang.',exact=/IndexOutOfBounds|ArithmeticException|NegativeArraySize/.test(err.type);
  return 'Exception in thread "main" '+pkg+err.type+(exact?': '+err.msg:'')+'\n        at '+where+' (line '+err.line+')'+(exact?'':'\n    Simulator note: '+err.msg);}
function printed(out){var s='';out.forEach(function(o){s+=o.t+(o.nl?'\n':'');});return s;}
return {version:'1',parse:parse,run:run,show:show,printed:printed,exceptionText:exceptionText,hashOrder:hashOrder,newArray:newArray,tyName:tyName,Problem:Problem};
})();
