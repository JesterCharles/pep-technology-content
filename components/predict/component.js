/* predict */
var pf=$('#predict'),pc=$('#predict-check');
function pReady(){pc.disabled=!!S.done.predict||!($('input[name="predict"]:checked')&&$('input[name="conf0"]:checked'));}
pf.addEventListener('change',pReady);
function badges(l,arr){var b=l.querySelector('.badges');if(!b){b=el('span','badges');l.appendChild(b);}arr.forEach(function(x){b.appendChild(el('span','badge '+x[1],x[0]));});}
pc.addEventListener('click',function(){var c=$('input[name="predict"]:checked'),cv=$('input[name="conf0"]:checked');if(!c||!cv)return;var okv=P.predict.ok,match=c.value===okv;
  $$('input',pf).forEach(function(i){i.disabled=true;});pc.disabled=true;
  $$('input[name="predict"]',pf).forEach(function(i){var l=i.closest('label');if(i===c){l.classList.add('mine');badges(l,[['Your prediction','mine-b'],[match?'Correct':'Not correct',match?'ok-b':'no-b']]);}else if(i.value===okv){badges(l,[[P.predict.okLabel||'Correct answer','ok-b']]);}if(i.value===okv)l.classList.add('right');l.appendChild(el('span','oexp',P.predict.expl[i.value]));});
  pf.querySelector('.opts').classList.add('explained');pc.hidden=true;$('#conf0').closest('.row').hidden=true;
  if(P.onPredict)P.onPredict();
  say([{c:'verdict info',s:'Practice prediction, not scored. '+(match?'Your prediction matches the answer.':'Your prediction differs from the answer; nothing is lost.')},{c:'conf-report',s:'Your confidence: '+cv.value+'. Reported, never scored.',attr:'data-pep-confidence-report'},{s:P.predict.lead},{s:'Each option now shows its label and why, directly under it.'}],true);
  complete('predict');});
