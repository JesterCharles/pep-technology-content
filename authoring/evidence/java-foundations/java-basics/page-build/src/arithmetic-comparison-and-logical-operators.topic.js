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
var TOPIC=(function(){var J=JSH.create();
var EX0=[2,'+',3,'*',4,'-',10,'%',4];
function prec(o){return '*/%'.indexOf(o)>=0?2:1;}
function nextOp(ex){var best=-1;for(var i=1;i<ex.length;i+=2){if(best<0||prec(ex[i])>prec(ex[best])){best=i;}}return best;}
function calc(a,o,b){return o==='+'?a+b:o==='-'?a-b:o==='*'?a*b:o==='/'?(a/b)|0:a%b;}
return {
steps:5,acts:['predict','order','shell','apply'],
prompt:function(){return 'jshell>';},
init:function(){return {g:{},vars:[],ex:EX0.slice(),trace:[]};},
reset:function(step){if(step===3){J=JSH.create();}},
predict:{correct:'a',why:{
 a:'5 * 2 is worked out first, giving 10, and x += 10 makes x 20.',
 b:'30 would be (10 + 5) * 2; a compound assignment works out its whole right side first.',
 c:'25 would add 5 and then double only part of it; the right side 5 * 2 is one value, 10.',
 d:'15 ignores the * 2; the whole right side, 10, is added.'}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p><code>count &gt; 0</code> is <code>false</code>, so <code>&amp;&amp;</code> already knows the answer and never runs <code>10 / count</code>.</p>',
  why:{a:'the left side is false, so && skips the division and ok is false.',b:'the division never runs: && stopped after the false left side.',c:'false && anything is false.',d:'both sides are boolean expressions, so it compiles.'},
  miss:{b:'<code>&amp;&amp;</code> stops after a <code>false</code> left side, so <code>10 / count</code> never runs.',c:'<code>false &amp;&amp;</code> anything is <code>false</code>.',d:'Both sides are boolean, so <code>&amp;&amp;</code> accepts them.'},
  hint:'Evaluate the left side first. Does && still need the right side?'},
 B:{fs:'apply-b',correct:'b',reveal:'With the division on the left, it runs first and throws ArithmeticException: / by zero.',
  why:{a:'the left side now divides by zero before any guard runs.',b:'Java evaluates the left side first, and 10 / 0 throws.',c:'nothing produces true; the division throws first.',d:'it compiles; the problem only appears when it runs.'}}},
act:function(a,b,S,api){var t=S.t;if(!/^op-/.test(a)||S.done.order){return;}var i=+a.slice(3),want=nextOp(t.ex),ex=t.ex;
 if(i!==want){var why=prec(ex[i])<prec(ex[want])?'"'+ex[want]+'" binds tighter than "'+ex[i]+'", so it goes first.':'Same level: Java goes left to right, so the "'+ex[want]+'" further left goes first.';
  api.say('<p class="verdict no">Not that one yet.</p><p>'+api.esc(why)+'</p>');return;}
 var v=calc(ex[i-1],ex[i],ex[i+1]);t.trace.push(ex[i-1]+' '+ex[i]+' '+ex[i+1]+' = '+v);ex.splice(i-1,3,v);
 if(ex.length===1){api.say('<p class="verdict ok">Done: the value is '+v+'.</p><p>* and % first, left to right, then + and -, left to right.</p>');api.complete('order');}
 else{api.say('<p class="verdict ok">Yes: '+api.esc(t.trace[t.trace.length-1])+'.</p><p>Now: '+api.esc(ex.join(' '))+'</p>');}
 this.render(S,api);var f=api.qa('#expr .op')[0];if(f){f.focus();}},
run:function(line,term,S,api){var t=S.t,r=JSH.run(line,J),log=api.$('log-'+term);
 var c=document.createElement('div');c.className='c';c.textContent=line;log.appendChild(c);
 r.out.forEach(function(x){var dv=document.createElement('div');dv.className=x[0];dv.textContent=x[1];log.appendChild(dv);});log.scrollTop=log.scrollHeight;
 var msg='',src=line.replace(/\s+$/,'');
 function probe(n){var copy={V:{},n:0};Object.keys(J.V).forEach(function(k){copy.V[k]={t:J.V[k].t,v:J.V[k].v};});var off=r.st.k==='expr'||r.st.k==='print'?0:null;return JSH.run(src.slice(n.p,n.e),copy);}
 if(r.res){var res=r.res,x=r.st.x;
  function walk(n,f){if(!n||typeof n!=='object'){return;}f(n);['l','r','x','o'].forEach(function(k){walk(n[k],f);});(n.a||[]).forEach(function(y){walk(y,f);});}
  if(res.kind==='asg'&&res.op!=='='){t.g.cmp=1;msg=res.name+' '+res.op+' worked out the right side, then combined it with '+res.name+'.';}
  walk(x,function(n){
   if(n.k==='bin'&&n.o==='%'){t.g.rem=1;msg='% gave the remainder.';}
   if(n.k==='bin'&&(n.o==='&&'||n.o==='||')){var rel=function(m){return m.k==='bin'&&/^(==|!=|<|>|<=|>=)$/.test(m.o);};
    if(rel(n.l)&&rel(n.r)){t.g.cond=1;msg='Two comparisons combined with '+n.o+'.';}
    var lv=probe(n.l),rv=probe(n.r),left=lv.res&&lv.res.v;
    if(((n.o==='&&'&&left===false)||(n.o==='||'&&left===true))&&rv.exception){t.g.sc=1;msg='Short-circuit: the left side settled the answer, so '+n.o+' never ran the right side, which would throw '+rv.exception+'.';}}});
  t.vars=Object.keys(J.V).map(function(k){return [k,J.V[k].t,JSH.show(J.V[k].t,J.V[k].v)];});t.trace=[r.out[r.out.length-1][1]];}
 else if(r.error){msg='A compile error: nothing ran. Read the message, then try again.';}
 else if(r.exception){msg='An exception: this ran the division. Put a guard on the left of && to skip it.';}
 else if(r.unsupported){msg='That form is not available in this practice jshell, so it earns no credit.';}
 var need=['rem','cmp','cond','sc'],left2=need.filter(function(k){return !t.g[k];}).length;
 api.say('<p>'+api.esc(msg||'Snippet run.')+'</p><p>'+(left2?left2+' of 4 goals still open.':'<strong>All goals met.</strong> Continue when ready.')+'</p>');
 if(!left2&&!S.done.shell){api.complete('shell');}
 this.render(S,api);},
render:function(S,api){var t=S.t,box=api.$('expr');
 if(box){while(box.firstChild){box.removeChild(box.firstChild);}t.ex.forEach(function(tok,i){var el;if(i%2===1&&!S.done.order){el=document.createElement('button');el.type='button';el.className='ghost op';el.setAttribute('data-act','op-'+i);el.setAttribute('aria-label','Evaluate '+t.ex[i-1]+' '+tok+' '+t.ex[i+1]);el.textContent=tok;}else{el=document.createElement('span');el.className='tok';el.textContent=String(tok);}box.appendChild(el);});}
 var tr=api.$('trace');while(tr.firstChild){tr.removeChild(tr.firstChild);}var items=S.step===2||S.step===3?t.trace:[];if(!items.length){items=['Nothing evaluated yet.'];}
 items.forEach(function(s){var li=document.createElement('li');li.textContent=s;tr.appendChild(li);});
 var tb=api.$('vars-body');while(tb.firstChild){tb.removeChild(tb.firstChild);}
 if(S.step===3&&t.vars.length){t.vars.forEach(function(v){var r=document.createElement('tr');v.forEach(function(c,i){var td=document.createElement('td');td.textContent=c;if(i===2){td.className='v';}r.appendChild(td);});tb.appendChild(r);});}
 else{var r=document.createElement('tr'),td=document.createElement('td');td.colSpan=3;td.textContent='Variables appear here while you use the practice jshell.';r.appendChild(td);tb.appendChild(r);}
 api.qa('.goals li').forEach(function(li){var k=li.getAttribute('data-goal');li.classList.toggle('done',!!t.g[k]);li.querySelector('.st').textContent=t.g[k]?'done':'open';});}
};})();
/* Restart ownership: the TOPIC state keys each activity owns. */
TOPIC.own={"order":["ex","trace"],"shell":["vars","trace"]};
