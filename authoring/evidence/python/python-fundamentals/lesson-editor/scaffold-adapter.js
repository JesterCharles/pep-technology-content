/* lesson-editor scaffold adapter, version 3. This is a deterministic, bounded structural validator for four
   supplied Python lesson scaffolds. It never executes learner code and is not a general Python parser. It strips
   comments and string bodies before matching a fixed, line-by-line shape, then checks placeholders, delimiters,
   indentation, order and nesting so required words in inert text or the wrong context cannot earn completion. */
var LESSON_EDITOR_SCAFFOLD=(function(){
function problem(line,kind,msg){return {line:line||1,col:1,kind:kind,msg:msg};}
function scan(src){
  var raw=String(src).replace(/\r\n?/g,'\n').split('\n'),lines=[],errors=[],stack=[],triple=null,triplePrefix='';
  for(var n=0;n<raw.length;n++){
    var text=raw[n],i=0,out='',strings=[];strings.prefixes=[];
    if (/\t/.test(text)){errors.push(problem(n+1,'error','Use four spaces for indentation; tabs are not accepted in this scaffold.'));continue;}
    var indent=(/^ */.exec(text)||[''])[0].length;
    if(indent%4){errors.push(problem(n+1,'error','Indent this scaffold in multiples of four spaces.'));}
    while(i<text.length){
      if(triple){
        var end=text.indexOf(triple,i);
        if(end<0){i=text.length;continue;}
        strings.push('');strings.prefixes.push(triplePrefix);out+='S';i=end+3;triple=null;continue;
      }
      var ch=text[i];
      if(ch==='#')break;
      var q=null,prefix=0;
      if((ch==='"'||ch==="'")){q=ch;}
      else if(/[rRuUbBfF]/.test(ch)){
        var j=i;while(j<text.length&&/[rRuUbBfF]/.test(text[j])&&j-i<2)j++;
        if(text[j]==='"'||text[j]==="'"){q=text[j];prefix=j-i;}
      }
      if(q){
        var lit=text.slice(i,i+prefix).toLowerCase();i+=prefix;
        if(text.slice(i,i+3)===q+q+q){triple=q+q+q;triplePrefix=lit;i+=3;continue;}
        i++;var value='',closed=false;
        while(i<text.length){
          if(text[i]==='\\'&&i+1<text.length){value+=text.slice(i,i+2);i+=2;continue;}
          if(text[i]===q){i++;closed=true;break;}
          value+=text[i++];
        }
        if(!closed){errors.push(problem(n+1,'error','Close the string literal before the end of the line.'));break;}
        strings.push(value);strings.prefixes.push(lit);out+='S';continue;
      }
      if('([{'.indexOf(ch)>=0)stack.push({ch:ch,line:n+1});
      else if(')]}'.indexOf(ch)>=0){
        var want={')':'(',']':'[','}':'{'}[ch],open=stack.pop();
        if(!open||open.ch!==want)errors.push(problem(n+1,'error','Balance the brackets and parentheses in this scaffold.'));
      }
      out+=ch;i++;
    }
    var code=out.trim();
    if(code)lines.push({line:n+1,indent:indent,code:code,strings:strings});
  }
  if(triple)errors.push(problem(raw.length,'error','Close the triple-quoted string.'));
  if(stack.length)errors.push(problem(stack[stack.length-1].line,'error','Balance the brackets and parentheses in this scaffold.'));
  return {lines:lines,errors:errors};
}
function rule(indent,re,label,strings){return {indent:indent,re:re,label:label,strings:strings};}
var SHAPES={
  functions:[
    rule(0,/^def\s+describe\s*\(\s*room\s*:\s*str\s*,\s*nights\s*:\s*int\s*=\s*1\s*,\s*\*parts\s*,\s*\*\*fields\s*\)\s*->\s*tuple\s*:$/,'the annotated describe signature at top level'),
    rule(4,/^return\s+room\s*,\s*nights\s*,\s*parts\s*,\s*fields$/,'the supplied return inside describe'),
    rule(0,/^values\s*=\s*\[[^\]]+\]$/,'the supplied values list at top level'),
    rule(0,/^options\s*=\s*\{[^}]+\}$/,'the supplied options dict at top level'),
    rule(0,/^result\s*=\s*describe\s*\(\s*\*values\s*,\s*\*\*options\s*\)$/,'the unpacked describe call at top level')
  ],
  exceptions:[
    rule(0,/^import\s+logging$/,'the logging import'),
    rule(0,/^logger\s*=\s*logging\.getLogger\s*\(\s*__name__\s*\)$/,'the module logger at top level'),
    rule(0,/^class\s+OutOfStock\s*\(\s*Exception\s*\)\s*:$/,'the supplied OutOfStock class'),
    rule(4,/^pass$/,'the OutOfStock class body'),
    rule(0,/^def\s+reserve\s*\(\s*requested\s*,\s*left\s*\)\s*:$/,'the supplied reserve function'),
    rule(4,/^try\s*:$/,'try inside reserve'),
    rule(8,/^if\s+requested\s*>\s*left\s*:$/,'the stock check inside try'),
    rule(12,/^raise\s+OutOfStock\s*\(\s*S\s*\)$/,'raise OutOfStock with a message',function(s){return s.length===1&&s[0].length>0;}),
    rule(4,/^except\s+OutOfStock\s*:$/,'except OutOfStock aligned with try'),
    rule(8,/^logger\.exception\s*\(\s*S\s*\)$/,'logger.exception inside the handler',function(s){return s.length===1&&s[0].length>0;}),
    rule(4,/^else\s*:$/,'else aligned with try'),
    rule(8,/^logger\.info\s*\(\s*S\s*\)$/,'the supplied success action inside else'),
    rule(4,/^finally\s*:$/,'finally aligned with try'),
    rule(8,/^logger\.debug\s*\(\s*S\s*\)$/,'the supplied cleanup action inside finally')
  ],
  scripts:[
    rule(0,/^import\s+sys$/,'the sys import'),
    rule(0,/^def\s+main\s*\(\s*argv\s*\)\s*:$/,'main at top level'),
    rule(4,/^if\s+len\s*\(\s*argv\s*\)\s*<\s*2\s*:$/,'the missing-argument guard inside main'),
    rule(8,/^print\s*\(\s*S\s*,\s*file\s*=\s*sys\.stderr\s*\)$/,'the usage line Usage: python summary.py SESSION on sys.stderr inside the guard (python, python3 or py; SESSION may be written <SESSION>)',function(s){return s.length===1&&/^(?:|r|u|f|rf|fr)$/.test(s.prefixes[0])&&/^ *[Uu][Ss][Aa][Gg][Ee] *: *(?:python3?|py) +summary\.py +(?:SESSION|<SESSION>) *$/.test(s[0]);}),
    rule(8,/^return\s+[1-9][0-9]*$/,'a non-zero result inside the missing-argument guard'),
    rule(4,/^print\s*\(\s*S\s*,\s*argv\s*\[\s*1\s*\]\s*\)$/,'the supplied success output inside main'),
    rule(4,/^return\s+0$/,'the supplied success result inside main'),
    rule(0,/^if\s+__name__\s*==\s*S\s*:$/,'the __name__ guard at top level',function(s){return s.length===1&&s[0]==='__main__';}),
    rule(4,/^sys\.exit\s*\(\s*main\s*\(\s*sys\.argv\s*\)\s*\)$/,'sys.exit(main(sys.argv)) inside the __name__ guard')
  ],
  pytest:[
    rule(0,/^import\s+pytest$/,'the pytest import'),
    rule(0,/^from\s+seats\s+import\s+seats_left$/,'the supplied seats_left import'),
    rule(0,/^def\s+test_some_taken\s*\(\s*\)\s*:$/,'test_some_taken at top level'),
    rule(4,/^assert\s+seats_left\s*\([^)]*\)\s*==\s*[^=]+$/,'a plain assert inside test_some_taken'),
    rule(0,/^def\s+test_bad_input\s*\(\s*\)\s*:$/,'test_bad_input at top level'),
    rule(4,/^with\s+pytest\.raises\s*\(\s*ValueError\s*\)\s*:$/,'pytest.raises(ValueError) inside test_bad_input'),
    rule(8,/^seats_left\s*\([^)]*\)$/,'the supplied bad-input call inside pytest.raises'),
    rule(0,/^@pytest\.fixture(?:\s*\(\s*\))?$/,'@pytest.fixture directly above capacity'),
    rule(0,/^def\s+capacity\s*\(\s*\)\s*:$/,'the capacity fixture function at top level'),
    rule(4,/^return\s+10$/,'the supplied fixture value'),
    rule(0,/^@pytest\.mark\.parametrize\s*\(\s*S\s*,\s*\[[\s\S]+\]\s*\)$/,'@pytest.mark.parametrize directly above test_left',function(s){return s.length===1&&s[0].replace(/\s/g,'')==='taken,left';}),
    rule(0,/^def\s+test_left\s*\(\s*capacity\s*,\s*taken\s*,\s*left\s*\)\s*:$/,'the parametrized test signature'),
    rule(4,/^assert\s+seats_left\s*\(\s*capacity\s*,\s*taken\s*\)\s*==\s*left$/,'the supplied assertion inside test_left')
  ]
};
function validate(src,lesson){
  var result=scan(src),problems=result.errors.slice(),lines=result.lines,shape=SHAPES[lesson];
  if(!shape)return [problem(1,'limit','This page does not name one of the four supported lesson scaffolds.')];
  for(var p=0;p<lines.length;p++)if(/\b___\b/.test(lines[p].code))problems.push(problem(lines[p].line,'limit','Replace every ___ placeholder in the supplied scaffold.'));
  if(problems.length)return problems;
  if(lines.length!==shape.length){
    return [problem(lines.length?lines[Math.min(lines.length,shape.length)-1].line:1,'limit','Keep the supplied '+lesson+' scaffold and complete only its named structures.')];
  }
  for(var i=0;i<shape.length;i++){
    var got=lines[i],want=shape[i];
    if(got.indent!==want.indent||!want.re.test(got.code)||(want.strings&&!want.strings(got.strings))){
      return [problem(got.line,'limit','Complete '+want.label+' in its supplied position and indentation.')];
    }
  }
  return [];
}
function make(spec){
  var lesson=spec.lesson;
  return {
    id:'python-scaffold',version:'3',language:'Python',
    kindLabels:{error:'Error',limit:'Lesson check',hint:'Hint'},
    check:function(src){var problems=validate(src,lesson);return {problems:problems,program:String(src)};},
    notRun:function(problems){return {status:problems.some(function(p){return p.kind==='error';})?'syntax':'limit',lines:['Not run: '+problems.length+' scaffold problem'+(problems.length===1?'':'s')+' still open.','This bounded structural validator checks only the supplied '+lesson+' scaffold and does not run arbitrary Python.'],summary:'Not run. '+problems.length+' scaffold problems still open.'};},
    run:function(program,calls){var lines=['The completed code matches the supplied scaffold structure and indentation.','Comments and string bodies did not count as code; no arbitrary Python was run.'].concat((calls&&calls.successLines)||[]);return {status:'pass',lines:lines,results:[],summary:'Scaffold complete. '+((calls&&calls.summary)||'Required Python structures found.')};}
  };
}
return {id:'python-scaffold',version:'3',make:make,validate:validate};
})();
