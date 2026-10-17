/* restart the current activity only: earlier activities keep their results */
var STEPKEY={1:'predict',2:'x1',3:'x2',4:'apply'};
function restartStep(){var stp=S.step;if(stp>=5)return;var k=STEPKEY[stp];
  $$('#current-control [data-step], #current-task [data-step]').forEach(function(p){if(p.getAttribute('data-step').split(' ').indexOf(String(stp))<0)return;
    $$('input',p).forEach(function(i){i.checked=false;i.disabled=false;});$$('.opt',p).forEach(function(o){o.classList.remove('right','wrong','mine');});
    $$('.oexp,.badges',p).forEach(function(e){e.remove();});$$('.opts.explained',p).forEach(function(o){o.classList.remove('explained');});});
  if(stp===1){pc.hidden=false;pc.disabled=true;$('#conf0').closest('.row').hidden=false;}
  Object.keys(checks).forEach(function(ck){if(checks[ck].step===stp)checks[ck].reset();});
  delete S.done[k];delete S.results[k];next.hidden=true;fb.textContent='';
  if(P.resetStep)P.resetStep(stp);
  progress();say([{c:'verdict info',s:'Activity restarted. Earlier activities keep their results.'}]);var h=$('#teach-'+stp+'-h');if(h)h.focus();}
$('#reset').addEventListener('click',restartStep);
