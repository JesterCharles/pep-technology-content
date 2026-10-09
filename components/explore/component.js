  var wrap=$('#segs');SEGS.forEach(function(sg,i){var b=document.createElement('button');b.type='button';b.className='seg';b.id='seg-'+i;b.setAttribute('aria-pressed','false');b.setAttribute('aria-describedby','task-3');b.textContent=sg.t;
    b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');renderMsg();});wrap.appendChild(b);});
  $('#redact-check').addEventListener('click',function(){var issues=[],good=true;
    $$('.seg').forEach(function(b,i){var on=b.getAttribute('aria-pressed')==='true';if(on!==SEGS[i].need){good=false;issues.push(SEGS[i].why);}});
    if(good){E.say([{c:'verdict ok',s:'Redacted correctly.'},{s:'The email and the token are now placeholders; the error code and the file and line stay, so the assistant can still help.'}],true);if(!E.state().done.x2)E.complete('x2');$$('.seg').forEach(function(b){b.disabled=true;});$('#redact-check').disabled=true;}
    else{var n=$$('.seg[aria-pressed="true"]').length;E.say([{c:'verdict no',s:n?'Not yet. Check these parts:':'Nothing is redacted yet. Check these parts:'},{list:issues.map(function(w){return ['•',w];})}]);}});
