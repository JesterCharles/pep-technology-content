/* graded checks: confidence first, retry in a second representation, settle after two misses */
var checks={};
function check(o){var st={att:0,conf:[],result:null,step:{x1:2,x2:3,apply:4}[o.key]},btn=$(o.btn),cf=$(o.conf),fs=$(o.fs),cn=o.confName||'conf';checks[o.key]=st;
  function grp(){return st.att===0?o.g1:o.g2;}
  function ready(){btn.disabled=!!st.result||!($('input[name="'+grp()+'"]:checked')&&$('input[name="'+cn+'"]:checked'));}
  function lockConf(){$$('input[name="'+cn+'"]').forEach(function(i){i.disabled=true;});btn.disabled=true;}
  function done(){S.results[o.key]=st.result;if(P.onCheck)P.onCheck(o.key,st.result);complete(o.key,o.label);}
  fs.addEventListener('change',ready);cf.addEventListener('change',ready);
  btn.addEventListener('click',function(){var g=grp(),r=st.att===0?o.data.r1:o.data.r2,c=$('input[name="'+g+'"]:checked'),cv=$('input[name="'+cn+'"]:checked');
    if(!c||!cv||st.result)return;var ok=c.value===r.ok;st.conf.push(cv.value);
    var confLine='Your confidence: '+cv.value+'. Confidence is your own read on how sure you were; it is reported, never scored.';
    var expl=$$('input[name="'+g+'"]').map(function(i){return [optText(i)+(i===c?' (your answer):':':'),r.expl[i.value]];});
    $$('input[name="'+g+'"]').forEach(function(i){i.disabled=true;});c.closest('label').classList.add(ok?'right':'wrong');badges(c.closest('label'),[['Your answer','mine-b'],[ok?'Correct':'Not correct',ok?'ok-b':'no-b']]);
    if(ok){st.result=st.att===0?'correct':'correct-retry';lockConf();
      say([{c:'verdict ok',s:st.att===0?'Correct.':'Correct on your second try.'},{c:'conf-report',s:confLine,attr:'data-pep-confidence-report'},{list:expl}],true);done();}
    else if(st.att===0){st.att=1;$('#'+o.g1).hidden=true;$('#'+o.g2).hidden=false;$(o.t1).hidden=true;$(o.t2).hidden=false;$$('input[name="'+cn+'"]').forEach(function(i){i.checked=false;});
      say([{c:'verdict no',s:'Not yet. '+r.mis[c.value]+' Try again below: same idea, different form, with your confidence again.'},{c:'conf-report',s:confLine,attr:'data-pep-confidence-report'},{list:expl}]);
      ready();$(o.t2).focus();}
    else{st.result='settled';lockConf();$$('input[name="'+o.g2+'"]').forEach(function(i){if(i.value===r.ok){i.closest('label').classList.add('right');badges(i.closest('label'),[['Correct answer','ok-b']]);}});
      say([{c:'verdict set',s:'Answered and settled: this check is not marked correct. '+r.mis[c.value]},{c:'conf-report',s:'Confidence on each try: '+st.conf.join(', then ')+'. Reported, never scored.',attr:'data-pep-confidence-report'},{s:'The answer: '+r.answer},{list:expl}],true);done();}});
  st.reset=function(){st.att=0;st.conf=[];st.result=null;$('#'+o.g1).hidden=false;$('#'+o.g2).hidden=true;$(o.t1).hidden=false;$(o.t2).hidden=true;btn.disabled=true;};
  return st;}
