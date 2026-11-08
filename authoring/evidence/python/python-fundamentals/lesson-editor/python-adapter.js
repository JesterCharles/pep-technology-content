/* lesson-editor Python adapter, version 1. A lesson-scoped checker and simulator, not a Python interpreter.
   Adapter contract (see README): id, version, language, kindLabels, check(src) -> {problems, program},
   notRun(problems) -> {status, lines, summary}, run(program, calls) -> {status, lines, results, summary}.
   It reads only the small Python subset its exercise needs (def, =, augmented =, while, if/elif/else,
   return, pass, break, continue, calls, arithmetic, comparisons, and/or/not, numbers, strings, True/False/None).
   Problems have three kinds: "error" is reported only for patterns that are certainly invalid Python;
   "limit" marks code this simulator cannot read or run, which may still be valid Python;
   "hint" is advice about valid code. Runs are deterministic and bounded by step, call-depth and output limits. */
var LESSON_EDITOR_PYTHON=(function(){
var KW={'def':1,'if':1,'elif':1,'else':1,'while':1,'for':1,'return':1,'pass':1,'break':1,'continue':1,'and':1,'or':1,'not':1,'in':1,'is':1,'True':1,'False':1,'None':1,'class':1,'import':1,'from':1,'try':1,'except':1,'finally':1,'with':1,'as':1,'lambda':1,'global':1,'nonlocal':1,'del':1,'yield':1,'raise':1,'assert':1,'async':1,'await':1};
var HEAD={'def':1,'if':1,'elif':1,'else':1,'while':1,'for':1,'class':1,'try':1,'except':1,'finally':1,'with':1};
var SUPPORTED_HEAD={'def':1,'if':1,'elif':1,'else':1,'while':1};
var PYBUILTINS=['abs','all','any','bin','bool','chr','dict','divmod','enumerate','filter','float','format','hex','input','int','isinstance','iter','len','list','map','max','min','next','oct','open','ord','pow','print','range','repr','reversed','round','set','sorted','str','sum','tuple','type','zip'];
var LIMIT_TEXT='This lesson simulator reads only the Python this exercise needs: def, =, +=, while, if/elif/else, return, calls, arithmetic and comparisons.';
var OPS=['//=','**=','==','!=','<=','>=','//','**','+=','-=','*=','/=','%=','->','&&','||','+','-','*','/','%','<','>','=','(',')','[',']','{','}',',',':',';','.','!','&','|','@','~','^'];
function P(line,col,kind,msg){return {line:line,col:col,kind:kind,msg:msg};}

/* ---------- lexing ---------- */
function lex(text,ln){var t=[],i=0,n=text.length;
  while(i<n){var c=text[i];
    if(c===' '){i++;continue;}
    if(c==='\t'){throw P(ln,i+1,'limit','Use spaces, not tab characters, in this editor. The Tab key inserts four spaces.');}
    if(c==='#'){break;}
    if(c==='"'||c==="'"){var q=c,j=i+1,s='';
      if(text.substr(i,3)===q+q+q){throw P(ln,i+1,'limit','Triple-quoted strings are outside this lesson simulator. '+LIMIT_TEXT);}
      while(j<n&&text[j]!==q){if(text[j]==='\\'&&j+1<n){var e=text[j+1];s+=e==='n'?'\n':e==='t'?'\t':e;j+=2;continue;}s+=text[j];j++;}
      if(j>=n){throw P(ln,i+1,'error','SyntaxError: unterminated string literal. Close the string with '+q+' on the same line.');}
      t.push({t:'str',v:s,col:i+1});i=j+1;continue;}
    if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(text[i+1]||''))){var m=/^(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/.exec(text.slice(i))[0];var after=text[i+m.length]||'';
      if(/[A-Za-z_0-9]/.test(after)){throw P(ln,i+1,'limit','This number form is outside this lesson simulator. '+LIMIT_TEXT);}
      var isF=/[.eE]/.test(m);if(!isF&&m.length>1&&m[0]==='0'&&/[1-9]/.test(m)){throw P(ln,i+1,'error','SyntaxError: Python does not allow leading zeros in a whole number such as '+m+'.');}
      t.push({t:'num',v:isF?{k:'float',v:parseFloat(m)}:{k:'int',v:parseInt(m,10)},col:i+1});i+=m.length;continue;}
    if(/[A-Za-z_]/.test(c)){var w=/^[A-Za-z_][A-Za-z_0-9]*/.exec(text.slice(i))[0];
      if((w==='f'||w==='r'||w==='b'||w==='rb'||w==='br'||w==='u')&&(text[i+w.length]==='"'||text[i+w.length]==="'")){throw P(ln,i+1,'limit','Prefixed strings such as f-strings are outside this lesson simulator. '+LIMIT_TEXT);}
      t.push({t:'name',v:w,col:i+1});i+=w.length;continue;}
    var op=null;for(var k=0;k<OPS.length;k++){if(text.substr(i,OPS[k].length)===OPS[k]){op=OPS[k];break;}}
    if(!op){if(c.charCodeAt(0)>127){throw P(ln,i+1,'limit','Character '+c+' is outside this lesson simulator. Use plain ASCII code.');}throw P(ln,i+1,'error','SyntaxError: invalid character '+c+'.');}
    t.push({t:'op',v:op,col:i+1});i+=op.length;}
  return t;}

/* ---------- certain-invalid patterns, checked per logical line ---------- */
function isOp(tk,v){return tk&&tk.t==='op'&&tk.v===v;}
function isName(tk,v){return tk&&tk.t==='name'&&(v===undefined||tk.v===v);}
function certain(tks,ln){
  var first=tks[0],last=tks[tks.length-1];
  for(var i=0;i<tks.length;i++){var tk=tks[i];
    if(isOp(tk,'&&')){return P(ln,tk.col,'error','SyntaxError: && is not Python. Write and.');}
    if(isOp(tk,'||')){return P(ln,tk.col,'error','SyntaxError: || is not Python. Write or.');}
    if(isOp(tk,'!')){return P(ln,tk.col,'error','SyntaxError: ! on its own is not Python. Write not, or != for "not equal".');}}
  if(isOp(first,'}')){return P(ln,first.col,'error','SyntaxError: Python blocks have no closing brace. Delete the } and let indentation end the block.');}
  if(isOp(last,'{')&&tks.length>1){return P(ln,last.col,'error','SyntaxError: Python blocks start with a colon, not {. End the line with : and indent the block.');}
  if(isName(first,'else')&&isName(tks[1],'if')){return P(ln,first.col,'error','SyntaxError: Python spells else if as elif.');}
  if(tks.length>=3&&isName(tks[0])&&!KW[tks[0].v]&&isOp(tks[1],'+')&&isOp(tks[2],'+')&&(tks.length===3||isOp(tks[3],';'))){return P(ln,tks[1].col,'error','SyntaxError: Python has no ++ operator. Write '+tks[0].v+' += 1.');}
  if(tks.length>=3&&isName(tks[0])&&!KW[tks[0].v]&&isOp(tks[1],'-')&&isOp(tks[2],'-')&&(tks.length===3||isOp(tks[3],';'))){return P(ln,tks[1].col,'error','SyntaxError: Python has no -- operator. Write '+tks[0].v+' -= 1.');}
  if(isName(tks[0])&&isName(tks[1])&&!KW[tks[0].v]&&!KW[tks[1].v]&&!{match:1,'case':1,type:1}[tks[0].v]){return P(ln,tks[0].col,'error','SyntaxError: Python has no type declarations. Delete '+tks[0].v+' so the line starts with '+tks[1].v+'.');}
  if(isName(first)&&HEAD[first.v]){var d=0,colon=-1;for(var j=0;j<tks.length;j++){var o=tks[j];if(o.t==='op'){if(o.v==='('||o.v==='['||o.v==='{'){d++;}else if(o.v===')'||o.v===']'||o.v==='}'){d--;}else if(o.v===':'&&d===0&&colon<0){colon=j;}}}
    if(colon<0&&first.v!=='def'){return P(ln,last.col,'error','SyntaxError: expected \':\'. A'+(first.v==='if'||first.v==='else'||first.v==='elif'?'n ':' ')+first.v+' line ends with a colon.');}
    if(first.v==='def'){if(colon<0&&isOp(last,')')){return P(ln,last.col,'error','SyntaxError: expected \':\'. A def line ends with a colon.');}
      var pi=2;if(isName(tks[1])&&isOp(tks[2],'(')){for(pi=3;pi<tks.length&&!isOp(tks[pi],')');pi++){if(isName(tks[pi])&&isName(tks[pi+1])){return P(ln,tks[pi].col,'error','SyntaxError: parameters have no declared type. Write just '+tks[pi+1].v+'.');}}}
      if(colon<0){return P(ln,last.col,'error','SyntaxError: expected \':\'. A def line ends with a colon.');}}}
  return null;}

/* ---------- parsing ---------- */
function Parser(tks,ln){this.t=tks;this.i=0;this.ln=ln;}
Parser.prototype={
  peek:function(o){return this.t[this.i+(o||0)];},
  next:function(){return this.t[this.i++];},
  at:function(v){var k=this.peek();return k&&(k.t==='op'||k.t==='name')&&k.v===v;},
  eat:function(v){if(this.at(v)){return this.next();}return null;},
  lim:function(msg){var k=this.peek()||this.t[this.t.length-1]||{col:1};throw P(this.ln,k.col,'limit',msg||LIMIT_TEXT);},
  need:function(v){if(!this.eat(v)){this.lim();}},
  expr:function(){return this.or_();},
  or_:function(){var l=this.and_();while(this.eat('or')){l={k:'or',l:l,r:this.and_()};}return l;},
  and_:function(){var l=this.not_();while(this.eat('and')){l={k:'and',l:l,r:this.not_()};}return l;},
  not_:function(){if(this.eat('not')){return {k:'not',e:this.not_()};}return this.cmp();},
  cmp:function(){var l=this.sum(),ops=[],rs=[];for(;;){var k=this.peek();if(!k){break;}var op=null;
      if(k.t==='op'&&{'==':1,'!=':1,'<':1,'>':1,'<=':1,'>=':1}[k.v]){op=k.v;this.next();}
      else if(isName(k,'is')){this.next();op=this.eat('not')?'is not':'is';}
      else if(isName(k,'not')&&isName(this.peek(1),'in')){this.lim();}
      else if(isName(k,'in')){this.lim();}
      if(!op){break;}ops.push(op);rs.push(this.sum());}
    return ops.length?{k:'cmp',l:l,ops:ops,rs:rs}:l;},
  sum:function(){var l=this.term();for(;;){var k=this.peek();if(k&&k.t==='op'&&(k.v==='+'||k.v==='-')){this.next();l={k:'bin',op:k.v,l:l,r:this.term()};}else{return l;}}},
  term:function(){var l=this.unary();for(;;){var k=this.peek();if(k&&k.t==='op'&&{'*':1,'/':1,'//':1,'%':1}[k.v]){this.next();l={k:'bin',op:k.v,l:l,r:this.unary()};}else{return l;}}},
  unary:function(){var k=this.peek();if(k&&k.t==='op'&&(k.v==='-'||k.v==='+')){this.next();return {k:'neg',op:k.v,e:this.unary()};}return this.power();},
  power:function(){var b=this.primary();if(this.eat('**')){return {k:'bin',op:'**',l:b,r:this.unary()};}return b;},
  primary:function(){var k=this.next();if(!k){this.i--;this.lim('This line ends before the expression is complete. '+LIMIT_TEXT);}
    var e;
    if(k.t==='num'){e={k:'lit',v:k.v};}
    else if(k.t==='str'){var s=k.v;while(this.peek()&&this.peek().t==='str'){s+=this.next().v;}e={k:'lit',v:{k:'str',v:s}};}
    else if(k.t==='name'){if(k.v==='True'||k.v==='False'){e={k:'lit',v:{k:'bool',v:k.v==='True'}};}else if(k.v==='None'){e={k:'lit',v:{k:'none'}};}else if(KW[k.v]){this.i--;this.lim();}else{e={k:'name',n:k.v,col:k.col};}}
    else if(k.t==='op'&&k.v==='('){if(this.at(')')){this.lim('Tuples are outside this lesson simulator. '+LIMIT_TEXT);}e=this.expr();if(this.at(',')){this.lim('Tuples are outside this lesson simulator. '+LIMIT_TEXT);}this.need(')');e={k:'paren',e:e};}
    else{this.i--;this.lim();}
    for(;;){if(this.at('(')){if(e.k!=='name'){this.lim();}this.next();var args=[];
        if(!this.eat(')')){for(;;){if(isName(this.peek())&&isOp(this.peek(1),'=')){this.lim('Keyword arguments are outside this lesson simulator. '+LIMIT_TEXT);}args.push(this.expr());if(this.eat(')')){break;}this.need(',');if(this.eat(')')){break;}}}
        e={k:'call',f:e.n,args:args,col:e.col};}
      else if(this.at('.')){this.lim('Attributes and methods, such as x.y, are outside this lesson simulator. '+LIMIT_TEXT);}
      else if(this.at('[')){this.lim('Lists and indexing are outside this lesson simulator. '+LIMIT_TEXT);}
      else{return e;}}},
  end:function(){if(this.i<this.t.length){this.lim();}}
};
function simple(tks,ln,ctx){var p=new Parser(tks,ln),k=tks[0];
  if(isName(k,'return')){if(!ctx.inDef){throw P(ln,k.col,'error','SyntaxError: \'return\' outside function.');}p.next();if(!p.peek()){return {k:'return',e:null,ln:ln};}var e=p.expr();p.end();return {k:'return',e:e,ln:ln};}
  if(isName(k,'pass')){p.next();p.end();return {k:'pass',ln:ln};}
  if(isName(k,'break')||isName(k,'continue')){if(!ctx.inLoop){throw P(ln,k.col,'error','SyntaxError: \''+k.v+'\' outside loop.');}p.next();p.end();return {k:k.v,ln:ln};}
  if(isName(k)&&KW[k.v]&&!{'not':1,'True':1,'False':1,'None':1}[k.v]){p.lim('The '+k.v+' statement is outside this lesson simulator. '+LIMIT_TEXT);}
  if(isName(k)&&tks[1]&&tks[1].t==='op'&&{'=':1,'+=':1,'-=':1,'*=':1,'/=':1,'//=':1,'%=':1}[tks[1].v]){p.i=2;if(!p.peek()){throw P(ln,tks[1].col,'error','SyntaxError: invalid syntax. Put a value after '+tks[1].v+'.');}
    if(tks[1].v==='='&&isName(p.peek())&&isOp(p.peek(1),'=')){p.lim('Chained assignment is outside this lesson simulator. '+LIMIT_TEXT);}
    var v=p.expr();p.end();var st={k:'assign',n:k.v,op:tks[1].v,e:v,ln:ln};if(ctx.locals){ctx.locals[k.v]=1;}return st;}
  var ex=p.expr();if(isOp(p.peek(),'=')){p.lim('Only a plain name can go left of = in this lesson simulator. '+LIMIT_TEXT);}p.end();return {k:'expr',e:ex,ln:ln};}

function splitSemis(tks){var out=[],cur=[];for(var i=0;i<tks.length;i++){if(isOp(tks[i],';')){out.push(cur);cur=[];}else{cur.push(tks[i]);}}out.push(cur);return out;}

/* Parse the whole file. Returns {problems, body}. */
function check(src){
  var lines=String(src).replace(/\r\n?/g,'\n').split('\n'),probs=[],items=[];
  for(var i=0;i<lines.length;i++){var raw=lines[i],ln=i+1;var stripped=raw.replace(/^ +/,'');
    if(/^\t/.test(stripped)||/^ *\t/.test(raw)){probs.push(P(ln,1,'limit','Use spaces, not tab characters, in this editor. The Tab key inserts four spaces.'));continue;}
    var tks;try{tks=lex(raw,ln);}catch(e){probs.push(e);items.push({ln:ln,ind:raw.length-stripped.length,bad:true,opens:false});continue;}
    if(!tks.length){continue;}
    var ind=raw.length-stripped.length,c=certain(tks,ln);
    var opens=(isName(tks[0])&&HEAD[tks[0].v])||isOp(tks[tks.length-1],'{');
    if(isOp(tks[0],'}')&&tks.length===1){probs.push(c);continue;}
    items.push({ln:ln,ind:ind,tks:tks,bad:!!c,opens:opens,head:isName(tks[0])&&HEAD[tks[0].v]?tks[0].v:null});if(c){probs.push(c);}}
  /* indentation */
  var stack=[0],expectIndent=null;
  for(var j=0;j<items.length;j++){var it=items[j];
    if(expectIndent){if(it.ind<=stack[stack.length-1]){probs.push(P(it.ln,1,'error','IndentationError: expected an indented block after the '+expectIndent.what+' on line '+expectIndent.ln+'.'));}else{stack.push(it.ind);}expectIndent=null;}
    else if(it.ind>stack[stack.length-1]){probs.push(P(it.ln,1,'error','IndentationError: unexpected indent.'));it.skipIndent=true;}
    else{while(it.ind<stack[stack.length-1]){stack.pop();}if(it.ind!==stack[stack.length-1]){probs.push(P(it.ln,1,'error','IndentationError: unindent does not match any outer indentation level.'));}}
    if(it.opens){expectIndent={ln:it.ln,what:(it.head?"'"+it.head+"' statement":'line')};}}
  if(expectIndent){probs.push(P(expectIndent.ln,1,'error','IndentationError: expected an indented block after the '+expectIndent.what+' on line '+expectIndent.ln+'.'));}
  if(probs.some(function(p){return p.kind==='error';})){return {problems:sortP(probs),body:null};}
  /* structure into blocks */
  var pos=0,ctxStack=[{inDef:false,inLoop:false}];
  function block(ind,ctx){var out=[];
    while(pos<items.length&&items[pos].ind===ind){var it=items[pos];
      if(it.bad){pos++;continue;}
      var tks=it.tks,k=tks[0];
      if(isName(k)&&HEAD[k.v]){
        if(!SUPPORTED_HEAD[k.v]){probs.push(P(it.ln,k.col,'limit','The '+k.v+' statement is outside this lesson simulator. '+LIMIT_TEXT));pos++;skipBlock(ind);continue;}
        var colonAt=-1;for(var q=0,d=0;q<tks.length;q++){var o=tks[q];if(o.t==='op'){if(o.v==='('){d++;}else if(o.v===')'){d--;}else if(o.v===':'&&d===0){colonAt=q;break;}}}
        if(colonAt!==tks.length-1){probs.push(P(it.ln,tks[colonAt].col,'limit','Put the block on the next lines, indented. One-line blocks are outside this lesson simulator.'));pos++;skipBlock(ind);continue;}
        var hd=tks.slice(0,colonAt);pos++;var inner=pos<items.length&&items[pos].ind>ind?items[pos].ind:null;
        try{
          if(k.v==='def'){var f=parseDef(hd,it.ln);var lc={};var b=inner===null?[]:block(inner,{inDef:true,inLoop:false,locals:lc});f.body=b;f.locals=lc;for(var pn=0;pn<f.params.length;pn++){lc[f.params[pn].n]=1;}if(ctx.locals){ctx.locals[f.name]=1;}out.push(f);continue;}
          if(k.v==='while'){var wp=new Parser(hd,it.ln);wp.next();var we=wp.expr();wp.end();var wb=inner===null?[]:block(inner,{inDef:ctx.inDef,inLoop:true,locals:ctx.locals});
            if(pos<items.length&&items[pos].ind===ind&&isName(items[pos].tks&&items[pos].tks[0],'else')){probs.push(P(items[pos].ln,1,'limit','while ... else is outside this lesson simulator. '+LIMIT_TEXT));pos++;skipBlock(ind);}
            out.push({k:'while',c:we,b:wb,ln:it.ln});continue;}
          if(k.v==='if'){var arms=[],ip=new Parser(hd,it.ln);ip.next();var ie=ip.expr();ip.end();arms.push({c:ie,b:inner===null?[]:block(inner,ctx)});var els=null;
            while(pos<items.length&&items[pos].ind===ind&&!items[pos].bad&&isName(items[pos].tks[0],'elif')){var et=items[pos].tks,eln=items[pos].ln;pos++;var ep=new Parser(et.slice(0,et.length-1),eln);ep.next();var ee=ep.expr();ep.end();var ei=pos<items.length&&items[pos].ind>ind?items[pos].ind:null;arms.push({c:ee,b:ei===null?[]:block(ei,ctx)});}
            if(pos<items.length&&items[pos].ind===ind&&!items[pos].bad&&isName(items[pos].tks[0],'else')){var xt=items[pos].tks;if(xt.length!==2){probs.push(P(items[pos].ln,1,'error','SyntaxError: expected \':\' right after else.'));}pos++;var xi=pos<items.length&&items[pos].ind>ind?items[pos].ind:null;els=xi===null?[]:block(xi,ctx);}
            out.push({k:'if',arms:arms,els:els,ln:it.ln});continue;}
          if(k.v==='elif'||k.v==='else'){probs.push(P(it.ln,k.col,'error','SyntaxError: invalid syntax. This '+k.v+' has no matching if above it at the same indentation.'));pos++;skipBlock(ind);continue;}
        }catch(e){if(e&&e.kind){probs.push(e);skipBlock(ind);continue;}throw e;}}
      pos++;
      var parts=splitSemis(tks);
      for(var s=0;s<parts.length;s++){if(!parts[s].length){if(s===parts.length-1&&s>0){continue;}probs.push(P(it.ln,1,'error','SyntaxError: invalid syntax. Remove the extra ;.'));continue;}
        try{out.push(simple(parts[s],it.ln,ctx));}catch(e){if(e&&e.kind){probs.push(e);}else{throw e;}}}}
    return out;}
  function skipBlock(ind){while(pos<items.length&&items[pos].ind>ind){pos++;}}
  var body=block(0,{inDef:false,inLoop:false,locals:null});
  return {problems:sortP(probs),body:probs.some(function(p){return p.kind!=='hint';})?null:body};}
function parseDef(hd,ln){var p=new Parser(hd,ln);p.next();var nm=p.next();if(!nm||nm.t!=='name'||KW[nm.v]){throw P(ln,1,'error','SyntaxError: invalid syntax. A def needs a function name.');}
  p.need('(');var params=[],seenDefault=false;
  if(!p.eat(')')){for(;;){var a=p.next();if(!a||a.t!=='name'||KW[a.v]){p.i--;p.lim('This parameter form is outside this lesson simulator. '+LIMIT_TEXT);}
      if(p.eat(':')){p.expr();}var d=null;if(p.eat('=')){d=p.expr();seenDefault=true;}else if(seenDefault){throw P(ln,a.col,'error','SyntaxError: parameter without a default follows parameter with a default.');}
      params.push({n:a.v,d:d});if(p.eat(')')){break;}p.need(',');if(p.eat(')')){break;}}}
  if(p.eat('->')){p.expr();}p.end();
  return {k:'def',name:nm.v,params:params,ln:ln};}
function sortP(a){return a.sort(function(x,y){return x.line-y.line||x.col-y.col;});}

/* ---------- values ---------- */
function I(v){return {k:'int',v:v};}function F(v){return {k:'float',v:v};}function S(v){return {k:'str',v:v};}function B(v){return {k:'bool',v:v};}var NONE={k:'none'};
function Err(type,msg){this.type=type;this.msg=msg;}
function Limit(msg){this.limit=msg;}
function tname(v){return v.k==='none'?'NoneType':v.k==='func'?'function':v.k;}
function num(v){return v.k==='int'||v.k==='float'||v.k==='bool';}
function nv(v){return v.k==='bool'?(v.v?1:0):v.v;}
function truthy(v){if(v.k==='none'){return false;}if(v.k==='str'){return v.v.length>0;}if(v.k==='func'){return true;}return nv(v)!==0;}
function fstr(x){if(x!==x){return 'nan';}if(x===Infinity){return 'inf';}if(x===-Infinity){return '-inf';}var a=Math.abs(x);
  if(x===0){return (1/x<0)?'-0.0':'0.0';}
  if(a>=1e16||a<1e-4){var s=x.toExponential().replace(/e([+-])(\d)$/,'e$10$2');return s.replace('e+','e+');}
  var r=String(x);if(r.indexOf('.')<0&&r.indexOf('e')<0){r+='.0';}return r;}
function str(v){if(v.k==='str'){return v.v;}if(v.k==='int'){return String(v.v);}if(v.k==='float'){return fstr(v.v);}if(v.k==='bool'){return v.v?'True':'False';}if(v.k==='none'){return 'None';}return '<function '+v.name+'>';}
function repr(v){if(v.k==='str'){var q=v.v.indexOf("'")>=0&&v.v.indexOf('"')<0?'"':"'";return q+v.v.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/\t/g,'\\t').replace(new RegExp(q,'g'),'\\'+q)+q;}return str(v);}
function safeInt(x){if(!isFinite(x)||Math.abs(x)>9007199254740991){throw new Limit('This whole number is too large for this lesson simulator.');}return I(x);}
function arith(op,a,b){
  if(op==='+'&&a.k==='str'&&b.k==='str'){return S(a.v+b.v);}
  if(op==='*'&&((a.k==='str'&&(b.k==='int'||b.k==='bool'))||(b.k==='str'&&(a.k==='int'||a.k==='bool')))){var s=a.k==='str'?a:b,n=nv(a.k==='str'?b:a);if(s.v.length*Math.max(n,0)>10000){throw new Limit('This string is too long for this lesson simulator.');}return S(n>0?new Array(n+1).join(s.v):'');}
  if(op==='+'&&a.k==='str'){throw new Err('TypeError','can only concatenate str (not "'+tname(b)+'") to str');}
  if(!num(a)||!num(b)){throw new Err('TypeError','unsupported operand type(s) for '+op+": '"+tname(a)+"' and '"+tname(b)+"'");}
  var x=nv(a),y=nv(b),fl=a.k==='float'||b.k==='float';
  if(op==='+'){return fl?F(x+y):safeInt(x+y);}
  if(op==='-'){return fl?F(x-y):safeInt(x-y);}
  if(op==='*'){return fl?F(x*y):safeInt(x*y);}
  if(op==='/'){if(y===0){throw new Err('ZeroDivisionError','division by zero');}return F(x/y);}
  if(op==='//'){if(y===0){throw new Err('ZeroDivisionError','division by zero');}var q=Math.floor(x/y);return fl?F(q):safeInt(q);}
  if(op==='%'){if(y===0){throw new Err('ZeroDivisionError','division by zero');}var r=x%y;if(r!==0&&((r<0)!==(y<0))){r+=y;}return fl?F(r):safeInt(r);}
  if(op==='**'){if(!fl&&y<0){return F(Math.pow(x,y));}if(fl&&x<0&&y!==Math.floor(y)){throw new Limit('Complex-number results are outside this lesson simulator.');}if(x===0&&y<0){throw new Err('ZeroDivisionError','zero to a negative power');}var pw=Math.pow(x,y);return fl?F(pw):safeInt(pw);}
  throw new Limit(LIMIT_TEXT);}
function eq(a,b){if(num(a)&&num(b)){return nv(a)===nv(b);}if(a.k!==b.k){return false;}if(a.k==='none'){return true;}return a.v===b.v;}
function compare(op,a,b){
  if(op==='=='){return eq(a,b);}if(op==='!='){return !eq(a,b);}
  if(op==='is'||op==='is not'){var same=(a.k==='none'&&b.k==='none')||(a.k==='bool'&&b.k==='bool'&&a.v===b.v);
    if(!same&&!(a.k==='none'||b.k==='none'||(a.k==='bool'&&b.k==='bool'))){throw new Limit('is between numbers or strings depends on how Python stores objects, so this lesson simulator does not run it. Use == to compare values.');}
    return op==='is'?same:!same;}
  var ok=(num(a)&&num(b))||(a.k==='str'&&b.k==='str');if(!ok){throw new Err('TypeError',"'"+op+"' not supported between instances of '"+tname(a)+"' and '"+tname(b)+"'");}
  var x=a.k==='str'?a.v:nv(a),y=b.k==='str'?b.v:nv(b);
  return op==='<'?x<y:op==='>'?x>y:op==='<='?x<=y:x>=y;}

/* ---------- running ---------- */
var LIMITS={steps:20000,depth:60,lines:200};
function Ret(v){this.v=v;}var BRK={},CNT={};
function run(body,lessonCalls){
  var out=[],steps=0,depth=0,G={},err=null,results=[];
  function tick(){if(++steps>LIMITS.steps){throw new Limit('Stopped after '+LIMITS.steps.toLocaleString('en-US')+' steps, the lesson simulator\'s limit. A loop whose condition never becomes false would run forever in real Python.');}}
  function emit(s){if(out.length>=LIMITS.lines){throw new Limit('Stopped after '+LIMITS.lines+' lines of output, the lesson simulator\'s limit.');}out.push(s);}
  function look(n,env){if(env&&env.locals[n]){if(Object.prototype.hasOwnProperty.call(env.vars,n)){return env.vars[n];}throw new Err('UnboundLocalError',"cannot access local variable '"+n+"' where it is not associated with a value");}
    if(Object.prototype.hasOwnProperty.call(G,n)){return G[n];}
    if(BUILT[n]){return {k:'builtin',name:n};}
    if(PYBUILTINS.indexOf(n)>=0){throw new Limit('The built-in '+n+'() is outside this lesson simulator. '+LIMIT_TEXT);}
    throw new Err('NameError',"name '"+n+"' is not defined");}
  function ev(e,env){tick();
    switch(e.k){
      case 'lit':return e.v;
      case 'paren':return ev(e.e,env);
      case 'name':return look(e.n,env);
      case 'neg':var v=ev(e.e,env);if(!num(v)){throw new Err('TypeError',"bad operand type for unary "+e.op+": '"+tname(v)+"'");}return e.op==='+'?(v.k==='float'?v:I(nv(v))):(v.k==='float'?F(-v.v):I(-nv(v)));
      case 'not':return B(!truthy(ev(e.e,env)));
      case 'and':var l=ev(e.l,env);return truthy(l)?ev(e.r,env):l;
      case 'or':var o=ev(e.l,env);return truthy(o)?o:ev(e.r,env);
      case 'bin':return arith(e.op,ev(e.l,env),ev(e.r,env));
      case 'cmp':var a=ev(e.l,env);for(var i=0;i<e.ops.length;i++){var b=ev(e.rs[i],env);if(!compare(e.ops[i],a,b)){return B(false);}a=b;}return B(true);
      case 'call':var f=look(e.f,env),args=e.args.map(function(x){return ev(x,env);});return call(f,args);
    }throw new Limit(LIMIT_TEXT);}
  function call(f,args){
    if(f.k==='builtin'){return BUILT[f.name](args);}
    if(f.k!=='func'){throw new Err('TypeError',"'"+tname(f)+"' object is not callable");}
    var ps=f.def.params,need=ps.filter(function(p){return !p.d;}).length;
    if(args.length>ps.length){throw new Err('TypeError',f.name+'() takes '+ps.length+' positional argument'+(ps.length===1?'':'s')+' but '+args.length+(args.length===1?' was':' were')+' given');}
    if(args.length<need){var miss=ps.slice(args.length).filter(function(p){return !p.d;}).map(function(p){return "'"+p.n+"'";});
      throw new Err('TypeError',f.name+'() missing '+miss.length+' required positional argument'+(miss.length===1?'':'s')+': '+(miss.length===1?miss[0]:miss.slice(0,-1).join(', ')+' and '+miss[miss.length-1]));}
    if(++depth>LIMITS.depth){throw new Limit('Stopped at '+LIMITS.depth+' nested calls, the lesson simulator\'s limit. Real Python allows about 1000 before a RecursionError.');}
    var env={vars:{},locals:f.def.locals};for(var i=0;i<ps.length;i++){env.vars[ps[i].n]=i<args.length?args[i]:f.defaults[i];}
    try{exec(f.def.body,env);}catch(x){depth--;if(x instanceof Ret){return x.v;}throw x;}depth--;return NONE;}
  var BUILT={
    print:function(a){emit(a.map(str).join(' '));return NONE;},
    str:function(a){if(a.length!==1){throw new Limit('str() with '+a.length+' arguments is outside this lesson simulator.');}return S(str(a[0]));},
    abs:function(a){if(a.length!==1||!num(a[0])){throw new Limit('abs() here takes one number.');}return a[0].k==='float'?F(Math.abs(a[0].v)):I(Math.abs(nv(a[0])));},
    int:function(a){if(a.length!==1){throw new Limit('int() here takes one argument.');}var v=a[0];if(v.k==='str'){if(!/^\s*[+-]?\d+\s*$/.test(v.v)){throw new Err('ValueError',"invalid literal for int() with base 10: "+repr(v));}return safeInt(parseInt(v.v,10));}if(num(v)){return safeInt(Math.trunc(nv(v)));}throw new Err('TypeError',"int() argument must be a string, a bytes-like object or a real number, not '"+tname(v)+"'");},
    float:function(a){if(a.length!==1){throw new Limit('float() here takes one argument.');}var v=a[0];if(v.k==='str'){var t=v.v.trim();if(!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)){throw new Err('ValueError',"could not convert string to float: "+repr(v));}return F(parseFloat(t));}if(num(v)){return F(nv(v));}throw new Err('TypeError',"float() argument must be a string or a real number, not '"+tname(v)+"'");}
  };
  function exec(b,env){for(var i=0;i<b.length;i++){var s=b[i];tick();cur=s.ln;
      switch(s.k){
        case 'def':var defs=s.params.map(function(p){return p.d?ev(p.d,env):null;});var fn={k:'func',name:s.name,def:s,defaults:defs};if(env){env.vars[s.name]=fn;}else{G[s.name]=fn;}break;
        case 'assign':var v=ev(s.e,env);if(s.op!=='='){v=arith(s.op.slice(0,-1),look(s.n,env),v);}if(env){env.vars[s.n]=v;}else{G[s.n]=v;}break;
        case 'expr':ev(s.e,env);break;
        case 'pass':break;
        case 'return':throw new Ret(s.e?ev(s.e,env):NONE);
        case 'break':throw BRK;
        case 'continue':throw CNT;
        case 'while':for(;;){cur=s.ln;if(!truthy(ev(s.c,env))){break;}try{exec(s.b,env);}catch(x){if(x===BRK){break;}if(x===CNT){continue;}throw x;}}break;
        case 'if':var done=false;for(var a=0;a<s.arms.length;a++){cur=s.ln;if(truthy(ev(s.arms[a].c,env))){exec(s.arms[a].b,env);done=true;break;}}if(!done&&s.els){exec(s.els,env);}break;
      }}}
  var cur=0;
  function guard(fn){try{fn();return null;}catch(x){if(x instanceof Err){return {kind:'error',type:x.type,msg:x.msg,line:cur};}if(x instanceof Limit){return {kind:'limit',msg:x.limit,line:cur};}if(x instanceof Ret){return {kind:'limit',msg:LIMIT_TEXT,line:cur};}throw x;}}
  err=guard(function(){exec(body,null);});
  if(!err&&lessonCalls){for(var c=0;c<lessonCalls.length;c++){var lc=lessonCalls[c],r={call:lc.call,expect:lc.expect};
      if(!Object.prototype.hasOwnProperty.call(G,lc.fn)||G[lc.fn].k!=='func'){r.missing=true;results.push(r);continue;}
      steps=0;depth=0;var got=null;var e2=guard(function(){got=call(G[lc.fn],lc.args.map(function(x){return typeof x==='number'?(Number.isInteger(x)?I(x):F(x)):S(x);}));});
      if(e2){r.error=e2;}else{r.got=repr(got);r.ok=r.got===lc.expect;}results.push(r);}}
  return {out:out,error:err,results:results};}

/* ---------- adapter surface ---------- */
function notRun(ps){var errs=ps.filter(function(p){return p.kind==='error';});
  if(errs.length){return {status:'syntax',lines:['Not run. Python reports a syntax error on line '+errs[0].line+' and runs nothing until it is fixed.',errs[0].msg],summary:'Not run. '+ps.length+' problem'+(ps.length===1?'':'s')+'; see Problems.'};}
  var l=ps.filter(function(p){return p.kind==='limit';})[0];
  return {status:'limit',lines:['Not run. Line '+l.line+' uses Python this lesson simulator cannot run.','Check that line in the Problems panel, or try the code in the coding lab with real Python.'],summary:'Not run. '+ps.length+' problem'+(ps.length===1?'':'s')+'; see Problems.'};}
function runReport(program,calls){var r=run(program,calls),o=r.out.slice(),status;
  if(r.error){o.push(r.error.kind==='error'?'Traceback: line '+r.error.line+'\n'+r.error.type+': '+r.error.msg:'Stopped near line '+r.error.line+': '+r.error.msg);status=r.error.kind==='error'?'runtime':'stopped';}
  else{o.push('Lesson checks:');var allOk=true;r.results.forEach(function(x){var line;if(x.missing){line='  '+x.call+'  not run: there is no '+x.call.split('(')[0]+' function';allOk=false;}else if(x.error){line='  '+x.call+(x.error.type?'  raised '+x.error.type+': '+x.error.msg:'  stopped: '+x.error.msg);allOk=false;}else{line='  '+x.call+' returned '+x.got+'  '+(x.ok?'matches':'expected '+x.expect);if(!x.ok){allOk=false;}}o.push(line);});status=allOk?'pass':'mismatch';}
  var summary=status==='pass'?'Run finished. All lesson checks match.':status==='mismatch'?'Run finished. Some lesson checks do not match; see Output.':status==='runtime'?'Run stopped with an error; see Output.':'Run stopped at a lesson simulator limit; see Output.';
  return {status:status,lines:o,results:r.results,error:r.error,out:r.out,summary:summary};}
function checkSrc(src){var c=check(src);return {problems:c.problems,program:c.body};}
return {id:'python',version:'1',language:'Python',kindLabels:{error:'Error',limit:'Lesson simulator',hint:'Hint'},
  check:checkSrc,notRun:notRun,run:runReport,
  /* lower-level hooks used by the differential test */
  parse:check,exec:run,repr:repr,str:str,LIMITS:LIMITS};
})();
