/* practice jshell: a small, honest subset of Java expressions (types, strings, operators) */
var JSH=(function(){
var TYPES={'int':1,'long':1,'double':1,'boolean':1,'char':1,'String':1};
var NUM={'int':1,'long':1,'double':1,'char':1};
function E(msg,pos,len,extra){var e=new Error(msg);e.jsh={msg:msg,pos:pos,len:len||1,extra:extra||[]};return e;}
function U(msg){var e=new Error(msg);e.unsup=msg;return e;}
function X(name,msg){var e=new Error(msg);e.exc=name+(msg?': '+msg:'');return e;}
function lex(s){var t=[],i=0,m;
  while(i<s.length){var c=s.charAt(i);
    if(c===' '||c==='\t'){i++;continue;}
    var rest=s.slice(i);
    if((m=rest.match(/^\d+(\.\d+)?([LldD])?/))){var raw=m[0],k;
      if(m[2]==='L'||m[2]==='l'){k='long';}else if(m[1]||m[2]==='d'||m[2]==='D'){k='double';}else{k='int';}
      t.push({k:'num',v:raw,nt:k,p:i});i+=raw.length;continue;}
    if(rest.indexOf('"""')===0){throw U('text blocks are not available in this practice jshell');}
    if(c==='"'){var j=i+1,v='';while(j<s.length&&s.charAt(j)!=='"'){if(s.charAt(j)==='\\'){var n=s.charAt(j+1);if(n==='n'){v+='\n';}else if(n==='t'){v+='\t';}else if(n==='"'||n==='\\'||n==="'"){v+=n;}else{throw U('that escape sequence is not available here');}j+=2;continue;}v+=s.charAt(j);j++;}
      if(j>=s.length){throw E('unclosed string literal',i,1);}t.push({k:'str',v:v,p:i,e:j+1});i=j+1;continue;}
    if(c==="'"){if((m=rest.match(/^'([^'\\])'/))){t.push({k:'chr',v:m[1],p:i,e:i+3});i+=3;continue;}
      if((m=rest.match(/^'\\([nt'\\])'/))){t.push({k:'chr',v:{n:'\n',t:'\t',"'":"'",'\\':'\\'}[m[1]],p:i,e:i+4});i+=4;continue;}
      throw E('unclosed character literal',i,1);}
    if((m=rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/))){t.push({k:'id',v:m[0],p:i});i+=m[0].length;continue;}
    if((m=rest.match(/^(\+\+|--|\+=|-=|\*=|\/=|%=|==|!=|<=|>=|&&|\|\||[-+*\/%<>=!().,;])/))){t.push({k:'op',v:m[0],p:i});i+=m[0].length;continue;}
    throw U('the character '+c+' is not available in this practice jshell');}
  t.push({k:'end',v:'',p:s.length});return t;}
function parse(src){var T=lex(src),i=0;
  function pk(o){return T[i].k==='op'&&T[i].v===o;}
  function eat(o){if(!pk(o)){throw T[i].k==='end'?E("'"+o+"' expected",T[i].p,1):U('that expression form is not available in this practice jshell');}return T[i++];}
  function end(n){return n.e!==undefined?n.e:n.p+1;}
  function bin(next,ops){return function(){var l=next();while(T[i].k==='op'&&ops.indexOf(T[i].v)>=0){var o=T[i++].v,r=next();l={k:'bin',o:o,l:l,r:r,p:l.p,e:r.e};}return l;};}
  function primary(){var t=T[i];
    if(t.k==='num'){i++;return {k:'lit',nt:t.nt,raw:t.v,p:t.p,e:t.p+t.v.length};}
    if(t.k==='str'){i++;return {k:'lit',nt:'String',v:t.v,p:t.p,e:t.e};}
    if(t.k==='chr'){i++;return {k:'lit',nt:'char',v:t.v.charCodeAt(0),p:t.p,e:t.e};}
    if(t.k==='id'&&(t.v==='true'||t.v==='false')){i++;return {k:'lit',nt:'boolean',v:t.v==='true',p:t.p,e:t.p+t.v.length};}
    if(t.k==='id'&&(t.v==='Integer'||t.v==='Long')&&T[i+1].v==='.'&&T[i+2].k==='id'&&/^(MAX|MIN)_VALUE$/.test(T[i+2].v)){i+=3;return {k:'const',c:t.v+'.'+T[i-1].v,p:t.p,e:T[i-1].p+T[i-1].v.length};}
    if(t.k==='id'&&/^[A-Z]/.test(t.v)&&!TYPES[t.v]){throw U('the class '+t.v+' is not available in this practice jshell');}
    if(t.k==='id'){if(TYPES[t.v]||t.v==='var'){throw U('declare a variable at the start of a line, like int x = 5');}i++;if(pk('(')){throw U('calling '+t.v+'(...) is not available in this practice jshell');}return {k:'var',n:t.v,p:t.p,e:t.p+t.v.length};}
    if(pk('(')){var p0=T[i].p;i++;var x=expr(),c=eat(')');x.paren=true;x.p=p0;x.e=c.p+1;return x;}
    if(t.k==='end'){throw E('illegal start of expression',t.p,1);}
    throw U('that expression form is not available in this practice jshell');}
  function postfix(){var x=primary();
    for(;;){if(pk('.')){i++;var m=T[i];if(m.k!=='id'){throw U('that expression form is not available in this practice jshell');}i++;
        if(!pk('(')){throw U('field access .'+m.v+' is not available in this practice jshell');}i++;var args=[];
        if(!pk(')')){args.push(expr());while(pk(',')){i++;args.push(expr());}}var c=eat(')');x={k:'call',o:x,m:m.v,a:args,p:x.p,mp:m.p,e:c.p+1};continue;}
      if(pk('++')||pk('--')){var o=T[i++];if(x.k!=='var'){throw U('++ and -- work on a variable here');}x={k:'post',o:o.v,x:x,p:x.p,e:o.p+2};continue;}
      return x;}}
  function unary(){var t=T[i];
    if(pk('-')||pk('+')||pk('!')){i++;var x=unary();return {k:'un',o:t.v,x:x,p:t.p,e:x.e};}
    if(pk('++')||pk('--')){i++;var y=unary();if(y.k!=='var'){throw U('++ and -- work on a variable here');}return {k:'pre',o:t.v,x:y,p:t.p,e:y.e};}
    if(pk('(')&&T[i+1].k==='id'&&TYPES[T[i+1].v]&&T[i+1].v!=='String'&&T[i+2].v===')'){var ty=T[i+1].v;i+=3;var z=unary();return {k:'cast',t:ty,x:z,p:t.p,e:z.e};}
    return postfix();}
  var mul=bin(unary,['*','/','%']),add=bin(mul,['+','-']),rel=bin(add,['<','>','<=','>=']),eq=bin(rel,['==','!=']),and=bin(eq,['&&']),or=bin(and,['||']);
  function expr(){return or();}
  var st;
  if(T[0].k==='id'&&(TYPES[T[0].v]||T[0].v==='var')&&T[1].k==='id'){var ty=T[0].v,nm=T[1];i=2;
    if(pk(';')||T[i].k==='end'){throw U('declare with a starting value here, like int x = 5');}
    eat('=');var ini=expr();st={k:'decl',t:ty,n:nm.v,np:nm.p,x:ini};}
  else if(T[0].k==='id'&&T[1].k==='op'&&/^(=|\+=|-=|\*=|\/=|%=)$/.test(T[1].v)){i=2;var rhs=expr();st={k:'asg',n:T[0].v,np:T[0].p,o:T[1].v,x:rhs};}
  else if(T[0].k==='id'&&T[0].v==='System'){if(T[1].v==='.'&&T[2].v==='out'&&T[3].v==='.'&&T[4].k==='id'&&(T[4].v==='println'||T[4].v==='print')&&T[5].v==='('){i=6;var a=pk(')')?null:expr();eat(')');st={k:'print',ln:T[4].v==='println',x:a};}
    else{throw U('only System.out.println(...) is available here');}}
  else{st={k:'expr',x:expr()};}
  if(pk(';')){i++;}
  if(T[i].k!=='end'){throw T[i].k==='op'&&T[i].v===';'?U('one statement per line here'):U('that statement is not available in this practice jshell');}
  return st;}
function rank(t){return {'char':1,'int':2,'long':3,'double':4}[t]||0;}
function promote(a,b){var r=Math.max(rank(a),rank(b),2);return ['','','int','long','double'][r];}
function fits(from,to,x){if(from===to){return true;}if(to==='String'||from==='String'||to==='boolean'||from==='boolean'){return false;}
  if(to==='char'){return from==='int'&&x&&x.k==='lit'&&+x.raw>=0&&+x.raw<=65535;}
  return rank(from)<=rank(to)&&!(from==='char'&&false);}
function convErr(from,to,x){if(NUM[from]&&NUM[to]){return E('incompatible types: possible lossy conversion from '+from+' to '+to,x.p,x.e-x.p);}
  return E('incompatible types: '+from+' cannot be converted to '+to,x.p,x.e-x.p);}
function jt(t){return t==='String'?'java.lang.String':t;}
function binErr(o,a,b,x){return E("bad operand types for binary operator '"+o+"'",x.p,x.e-x.p,['  first type:  '+jt(a),'  second type: '+jt(b)]);}
function type(x,V){switch(x.k){
  case 'lit':if(x.nt==='int'&&+x.raw>2147483647){throw E('integer number too large',x.p,1);}if(x.nt==='long'&&BigInt(x.raw.slice(0,-1))>9223372036854775807n){throw E('integer number too large',x.p,1);}return x.t=x.nt;
  case 'const':return x.t=x.c.indexOf('Integer')===0?'int':'long';
  case 'var':if(!V[x.n]){throw E('cannot find symbol',x.p,1,['  symbol:   variable '+x.n]);}return x.t=V[x.n].t;
  case 'un':var u=type(x.x,V);if(x.o==='!'){if(u!=='boolean'){throw E("bad operand type "+u+" for unary operator '!'",x.p,1);}return x.t='boolean';}
    if(!NUM[u]){throw E("bad operand type "+u+" for unary operator '"+x.o+"'",x.p,1);}return x.t=promote(u,'int');
  case 'pre':case 'post':var pv=type(x.x,V);if(!NUM[pv]){throw E("bad operand type "+pv+" for unary operator '"+x.o+"'",x.p,1);}return x.t=pv;
  case 'cast':var ct=type(x.x,V);if((ct==='boolean')!==(x.t==='boolean')||ct==='String'){throw E('incompatible types: '+ct+' cannot be converted to '+x.t,x.p,x.e-x.p);}return x.t;
  case 'bin':var a=type(x.l,V),b=type(x.r,V),o=x.o;
    if(o==='+'&&(a==='String'||b==='String')){return x.t='String';}
    if('+-*/%'.indexOf(o)>=0){if(!NUM[a]||!NUM[b]){throw binErr(o,a,b,x);}return x.t=promote(a,b);}
    if(o==='<'||o==='>'||o==='<='||o==='>='){if(!NUM[a]||!NUM[b]){throw binErr(o,a,b,x);}return x.t='boolean';}
    if(o==='=='||o==='!='){if((NUM[a]&&NUM[b])||(a===b)){return x.t='boolean';}throw E('incomparable types: '+a+' and '+b,x.p,x.e-x.p);}
    if(a!=='boolean'||b!=='boolean'){throw binErr(o,a,b,x);}return x.t='boolean';
  case 'call':var ot=type(x.o,V);if(ot!=='String'){throw U('methods on '+ot+' values are not available in this practice jshell');}
    var at=x.a.map(function(y){return type(y,V);}),sig=x.m+'('+at.join(',')+')';
    var R={'length()':'int','charAt(int)':'char','substring(int)':'String','substring(int,int)':'String','indexOf(String)':'int','indexOf(char)':'int','toUpperCase()':'String','toLowerCase()':'String','strip()':'String','trim()':'String','isEmpty()':'boolean','equals(String)':'boolean','contains(String)':'boolean'}[sig];
    if(!R){if({length:1,charAt:1,substring:1,indexOf:1,toUpperCase:1,toLowerCase:1,strip:1,trim:1,isEmpty:1,equals:1,contains:1}[x.m]){throw E('method '+x.m+' in class String cannot be applied to given types;',x.mp,1,['  required: see the String API','  found:    '+(at.join(',')||'no arguments')]);}
      throw U('the String method '+x.m+'(...) is not available in this practice jshell');}
    return x.t=R;}}
function toLong(v){return typeof v==='bigint'?v:BigInt(Math.trunc(v));}
function num(t,v){if(t==='double'){return typeof v==='bigint'?Number(v):v;}if(t==='long'){return BigInt.asIntN(64,toLong(v));}
  if(t==='int'){return typeof v==='bigint'?Number(BigInt.asIntN(32,v)):(v|0);}return v;}
function castTo(t,v,from){if(t==='boolean'){return v;}
  if(from==='double'&&(t==='int'||t==='long'||t==='char')){if(isNaN(v)){v=0;}var lim=t==='int'?[-2147483648,2147483647]:t==='char'?[0,65535]:null;
    if(lim){return t==='char'?((Math.trunc(Math.max(-2147483648,Math.min(2147483647,v))))&0xFFFF):Math.max(lim[0],Math.min(lim[1],Math.trunc(v)));}
    if(v>=9223372036854775807){return 9223372036854775807n;}if(v<=-9223372036854775808){return -9223372036854775808n;}return BigInt(Math.trunc(v));}
  if(t==='char'){return Number(BigInt.asUintN(16,toLong(v)));}
  return num(t,v);}
function ev(x,V){switch(x.k){
  case 'lit':return x.nt==='int'?+x.raw:x.nt==='long'?BigInt(x.raw.slice(0,-1)):x.nt==='double'?parseFloat(x.raw):x.v;
  case 'const':return {'Integer.MAX_VALUE':2147483647,'Integer.MIN_VALUE':-2147483648,'Long.MAX_VALUE':9223372036854775807n,'Long.MIN_VALUE':-9223372036854775808n}[x.c];
  case 'var':return V[x.n].v;
  case 'un':var u=ev(x.x,V);if(x.o==='!'){return !u;}if(x.o==='+'){return num(x.t,u);}return x.t==='long'?BigInt.asIntN(64,-toLong(u)):x.t==='double'?-u:num('int',-u);
  case 'pre':case 'post':var o=V[x.x.n],old=o.v,one=o.t==='long'?1n:1,nv=x.o==='++'?old+one:old-one;o.v=o.t==='char'?nv&0xFFFF:num(o.t,nv);return x.k==='pre'?o.v:old;
  case 'cast':return castTo(x.t,ev(x.x,V),x.x.t);
  case 'bin':var op=x.o;
    if(op==='&&'){return ev(x.l,V)?ev(x.r,V):false;}
    if(op==='||'){return ev(x.l,V)?true:ev(x.r,V);}
    var a=ev(x.l,V),b=ev(x.r,V);
    if(x.t==='String'){return show(x.l.t,a,true)+show(x.r.t,b,true);}
    if(op==='=='||op==='!='||op==='<'||op==='>'||op==='<='||op==='>='){var p=(x.l.t==='boolean'||x.l.t==='String')?null:promote(x.l.t,x.r.t);
      if(p){a=num(p,a);b=num(p,b);}var r=op==='=='?a===b:op==='!='?a!==b:op==='<'?a<b:op==='>'?a>b:op==='<='?a<=b:a>=b;return r;}
    var t=x.t;a=num(t,a);b=num(t,b);
    if(t==='double'){return op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:op==='/'?a/b:a%b;}
    if((op==='/'||op==='%')&&(t==='long'?b===0n:b===0)){throw X('java.lang.ArithmeticException','/ by zero');}
    if(t==='long'){return BigInt.asIntN(64,op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:op==='/'?a/b:a%b);}
    return op==='+'?(a+b)|0:op==='-'?(a-b)|0:op==='*'?Math.imul(a,b):op==='/'?(a/b)|0:(a%b)|0;
  case 'call':var s=ev(x.o,V),g=x.a.map(function(y){return ev(y,V);});
    if(x.m==='length'){return s.length;}
    if(x.m==='charAt'){if(g[0]<0||g[0]>=s.length){throw X('java.lang.StringIndexOutOfBoundsException','Index '+g[0]+' out of bounds for length '+s.length);}return s.charCodeAt(g[0]);}
    if(x.m==='substring'){var b0=g[0],e0=g.length>1?g[1]:s.length;if(b0<0||e0>s.length||b0>e0){throw X('java.lang.StringIndexOutOfBoundsException','Range ['+b0+', '+e0+') out of bounds for length '+s.length);}return s.slice(b0,e0);}
    if(x.m==='indexOf'){return s.indexOf(typeof g[0]==='number'?String.fromCharCode(g[0]):g[0]);}
    if(x.m==='toUpperCase'){return s.toUpperCase();}if(x.m==='toLowerCase'){return s.toLowerCase();}
    if(x.m==='strip'){return s.replace(/^\s+|\s+$/g,'');}if(x.m==='trim'){return s.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g,'');}
    if(x.m==='isEmpty'){return s.length===0;}if(x.m==='equals'){return s===g[0];}if(x.m==='contains'){return s.indexOf(g[0])>=0;}}}
function dbl(v){if(isNaN(v)){return 'NaN';}if(!isFinite(v)){return v>0?'Infinity':'-Infinity';}var a=Math.abs(v);
  if(a===0){return (1/v<0?'-':'')+'0.0';}
  if(a>=1e-3&&a<1e7){var s=String(v);return s.indexOf('.')<0?s+'.0':s;}
  var m=v.toExponential().split('e'),mm=m[0].indexOf('.')<0?m[0]+'.0':m[0];return mm+'E'+(+m[1]);}
function show(t,v,raw){if(t==='double'){return dbl(v);}if(t==='char'){var ch=String.fromCharCode(v);return raw?ch:"'"+ch+"'";}
  if(t==='String'){return raw?v:'"'+v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\t/g,'\\t')+'"';}return String(v);}
function caret(pos,len){var s='';for(var i=0;i<pos;i++){s+=' ';}if(len<=1){return s+'^';}var m='';for(var j=0;j<len-2;j++){m+='-';}return s+'^'+m+'^';}
function create(){return {V:{},n:0};}
function run(line,J){var out=[],src=line.replace(/\s+$/,'');function o(c,s){out.push([c,s]);}
  if(!src.trim()){return {out:out};}
  var st;
  try{st=parse(src);
    var V=J.V;if(st.k==='decl'){if(V[st.n]&&false){}var it=type(st.x,V),dt=st.t==='var'?it:st.t;
      if(st.t==='var'&&it==='char'&&false){}if(!fits(it,dt,st.x)){throw convErr(it,dt,st.x);}}
    else if(st.k==='asg'){if(!V[st.n]){throw E('cannot find symbol',st.np,1,['  symbol:   variable '+st.n]);}var at=type(st.x,V),vt=V[st.n].t;
      if(st.o==='='){if(!fits(at,vt,st.x)){throw convErr(at,vt,st.x);}}
      else if(st.o==='+='&&vt==='String'){}
      else if(!NUM[vt]||!NUM[at]){throw binErr(st.o.charAt(0),vt,at,{p:st.np,e:src.length});}}
    else if(st.k==='print'){if(st.x){type(st.x,V);}}
    else{type(st.x,V);}
  }catch(e){if(e.unsup){o('e','|  Not available in this practice jshell: '+e.unsup+'.');return {out:out,unsupported:true};}
    if(e.jsh){var lines=['|  Error:','|  '+e.jsh.msg].concat(e.jsh.extra.map(function(x){return '|  '+x;}));lines.push('|  '+src);lines.push('|  '+caret(e.jsh.pos,e.jsh.len));
      o('e',lines.join('\n'));return {out:out,error:e.jsh.msg};}throw e;}
  J.n++;var id=J.n;
  try{var V2=J.V,res;
    if(st.k==='decl'){var dt2=st.t==='var'?st.x.t:st.t,val=ev(st.x,V2);val=castTo(dt2,val,st.x.t);V2[st.n]={t:dt2,v:val};o('o',st.n+' ==> '+show(dt2,val));res={kind:'decl',name:st.n,t:dt2,v:val};}
    else if(st.k==='asg'){var cur=V2[st.n],rv=ev(st.x,V2),nv;
      if(st.o==='='){nv=castTo(cur.t,rv,st.x.t);cur.v=nv;o('o',st.n+' ==> '+show(cur.t,nv));}
      else{var op=st.o.charAt(0);if(cur.t==='String'){nv=cur.v+show(st.x.t,rv,true);}else{var pt=promote(cur.t,st.x.t),a=num(pt,cur.v),b=num(pt,rv);
          if((op==='/'||op==='%')&&pt!=='double'&&(pt==='long'?b===0n:b===0)){throw X('java.lang.ArithmeticException','/ by zero');}
          var r=pt==='double'?(op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:op==='/'?a/b:a%b):pt==='long'?(op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:op==='/'?a/b:a%b):(op==='+'?a+b:op==='-'?a-b:op==='*'?Math.imul(a,b):op==='/'?a/b:a%b);
          nv=castTo(cur.t,r,pt);}
        cur.v=nv;o('o','$'+id+' ==> '+show(cur.t,nv));}
      res={kind:'asg',name:st.n,t:cur.t,v:cur.v,op:st.o};}
    else if(st.k==='print'){var pv=st.x?show(st.x.t,ev(st.x,V2),true):'';o('o',pv);res={kind:'print',text:pv};}
    else{var x=st.x,v=ev(x,V2);var label=(x.k==='var'&&!x.paren)?x.n:'$'+id;o('o',label+' ==> '+show(x.t,v));res={kind:'expr',t:x.t,v:v,node:x};}
    return {out:out,res:res,st:st};
  }catch(e){if(e.exc){o('e','|  Exception '+e.exc+'\n|        at (#'+id+':1)');if(/StringIndex/.test(e.exc)){o('h','Real jshell also lists the String library methods above the last line.');}return {out:out,exception:e.exc,st:st};}throw e;}}
return {create:create,run:run,show:show};
})();
var TOPIC=(function(){var J=JSH.create();return {
steps:5,acts:['predict','types','shell','apply'],
prompt:function(){return 'jshell>';},
init:function(){return {g:{},vars:[],last:null,ti:0,typed:[]};},
reset:function(step){if(step===3){J=JSH.create();}},
predict:{correct:'b',why:{
 a:'3.5 needs a double operand, such as 7 / 2.0, and a double variable.',
 b:'both operands are int, so Java does integer division and drops the fraction.',
 c:'integer division does not round; it drops the fraction, giving 3.',
 d:'7 / 2 is an int, so it fits an int variable with no error.'}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p><code>(90 + 85) / 2</code> is <code>175 / 2</code>, integer division, so <code>87</code>; storing it in a <code>double</code> widens it to <code>87.0</code>.</p>',
  why:{a:'the division happens first, in int, before anything becomes a double.',b:'175 / 2 is int division, giving 87; the double variable then stores 87.0.',c:'a double variable always shows a fractional part: 87.0.',d:'an int value widens to double automatically, so it compiles.'},
  miss:{a:'The right side is worked out first, all in <code>int</code>: <code>175 / 2</code> is <code>87</code>.',c:'The variable is a <code>double</code>, so the stored value is <code>87.0</code>, not <code>87</code>.',d:'An <code>int</code> widens to <code>double</code> without a cast, so this compiles.'},
  hint:'Find the type of (90 + 85) and of 2 first; the variable type is used only afterwards.'},
 B:{fs:'apply-b',correct:'b',reveal:'Dividing by 2.0 makes the division double arithmetic, so avg is 87.5.',
  why:{a:'var would infer int from the int right side, giving 87.',b:'one double operand makes the division keep its fraction: 87.5.',c:'a cast to int cuts off any fraction.',d:'long is still a whole-number type.'}}},
ITEMS:[{n:'Seats in a classroom: 28',k:'int',ok:'a small whole number: int.'},{n:'Milliseconds since 1970: 1760000000000',k:'long',ok:'a whole number far beyond int\'s limit of about 2.1 billion: long.'},{n:'Average score: 87.5',k:'double',ok:'it has a fractional part: double.'},{n:'Has paid: yes or no',k:'boolean',ok:'only two possible values: boolean.'},{n:'Grade letter: B',k:'char',ok:'exactly one character: char, written \'B\'.'}],
WHY:{int:'int holds whole numbers only, up to about 2.1 billion.',long:'long holds whole numbers only; it is for values too big for int.',double:'double is for numbers with a fractional part.',boolean:'boolean holds only true or false.',char:'char holds exactly one character.'},
act:function(a,b,S,api){var t=S.t,it=this.ITEMS[t.ti];if(!/^t-/.test(a)||!it||S.done.types){return;}var k=a.slice(2);
 if(k===it.k){t.typed.push(t.ti);t.ti++;var msg='<p class="verdict ok">'+api.esc(it.n)+' → '+k+'.</p><p>'+api.esc(it.ok.charAt(0).toUpperCase()+it.ok.slice(1))+'</p>';
  if(t.ti>=this.ITEMS.length){msg+='<p><strong>All five typed.</strong> Continue when ready.</p>';api.qa('.lanebtns button').forEach(function(x){x.disabled=true;});api.say(msg);api.complete('types');}else{api.say(msg);}}
 else{api.say('<p class="verdict no">Not '+k+'.</p><p>'+api.esc(this.WHY[k])+' Choose another type for '+api.esc(it.n)+'.</p>');}
 this.render(S,api);},
run:function(line,term,S,api){var t=S.t,r=JSH.run(line,J),log=api.$('log-'+term);
 var c=document.createElement('div');c.className='c';c.textContent=line;log.appendChild(c);
 r.out.forEach(function(x){var dv=document.createElement('div');dv.className=x[0];dv.textContent=x[1];log.appendChild(dv);});log.scrollTop=log.scrollHeight;
 var msg='';
 if(r.res){var res=r.res,st=r.st;
  if(res.kind==='decl'){t.declared=t.declared||{};t.declared[res.name]=res.t;msg='Declared '+res.name+' as '+res.t+'.';}
  if(res.kind==='asg'&&res.op==='='){if(t.declared&&t.declared[res.name]==='int'){t.g.asg=1;msg='Assigned a new value to '+res.name+': no type this time, because it already exists.';}else{msg='Assigned '+res.name+'.';}}
  var x=st.x;function walk(n,f){if(!n||typeof n!=='object'){return;}f(n);['l','r','x','o'].forEach(function(k){walk(n[k],f);});(n.a||[]).forEach(function(y){walk(y,f);});}
  walk(x,function(n){
   if(n.k==='bin'&&n.o==='/'&&n.t==='int'){t.g.div=1;msg='int / int: the fraction is dropped.';}
   if(n.k==='bin'&&(n.o==='+'||n.o==='*'||n.o==='-')&&n.t==='int'){var a=Number(evalExact(n.l)),b=Number(evalExact(n.r));if(isFinite(a)&&isFinite(b)){var ex=n.o==='+'?a+b:n.o==='-'?a-b:a*b;if(ex>2147483647||ex<-2147483648){t.g.ovf=1;msg='The true result does not fit an int, so it wrapped around: overflow, with no error.';}}}
   if(n.k==='cast'&&n.t==='int'&&n.x.t==='double'){t.g.cast=1;msg='The cast to int cut off the fraction.';}});
  t.vars=Object.keys(J.V).map(function(k){return [k,J.V[k].t,JSH.show(J.V[k].t,J.V[k].v)];});
  t.last=r.out.length?r.out[r.out.length-1][1]:null;}
 else if(r.error){msg='A compile error: nothing ran and nothing changed. Read the message, then try again.';}
 else if(r.exception){msg='An exception: the snippet ran and failed.';}
 else if(r.unsupported){msg='That form is not available in this practice jshell, so it earns no credit.';}
 function evalExact(n){if(n.k==='lit'&&n.nt==='int'){return +n.raw;}if(n.k==='const'){return n.c==='Integer.MAX_VALUE'?2147483647:n.c==='Integer.MIN_VALUE'?-2147483648:NaN;}if(n.k==='var'&&J.V[n.n]&&J.V[n.n].t==='int'){return J.V[n.n].v;}if(n.k==='bin'&&n.t==='int'&&'+-*'.indexOf(n.o)>=0){var a=evalExact(n.l),b=evalExact(n.r);return n.o==='+'?a+b:n.o==='-'?a-b:a*b;}return NaN;}
 var need=['asg','div','ovf','cast'],left=need.filter(function(k){return !t.g[k];}).length;
 api.say('<p>'+api.esc(msg||'Snippet run.')+'</p><p>'+(left?left+' of 4 goals still open.':'<strong>All goals met.</strong> Continue when ready.')+'</p>');
 if(!left&&!S.done.shell){api.complete('shell');}
 this.render(S,api);},
render:function(S,api){var t=S.t,tb=api.$('vars-body');while(tb.firstChild){tb.removeChild(tb.firstChild);}
 if(S.step===3&&t.vars.length){t.vars.forEach(function(v){var tr=document.createElement('tr');v.forEach(function(c,i){var td=document.createElement('td');td.textContent=c;if(i===2){td.className='v';}tr.appendChild(td);});tb.appendChild(tr);});}
 else{var tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=3;td.textContent=S.step===3?'No variables yet. Declare one, such as int n = 5;':'Variables appear here while you use the practice jshell.';tr.appendChild(td);tb.appendChild(tr);}
 api.$('last-result').textContent='Last result: '+(S.step===3&&t.last?t.last:'none yet.');
 var cards=api.$('cards');if(cards){var me=this;while(cards.firstChild){cards.removeChild(cards.firstChild);}
  this.ITEMS.forEach(function(it,i){var li=document.createElement('li');var done=t.typed.indexOf(i)>=0;li.textContent=it.n+(done?' → '+it.k:'');if(done){li.className='ok';}else if(i===t.ti){li.className='cur';}cards.appendChild(li);});
  api.$('cur-name').textContent=t.ti<me.ITEMS.length?me.ITEMS[t.ti].n:'all typed';api.$('sorted-count').textContent=t.typed.length+' of 5 typed';}
 api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!t.g[k]);li.querySelector('.st').textContent=t.g[k]?'done':'open';});}
};})();
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"types":["ti","typed"],"shell":["vars","last","declared"]};
