function progress(){var n=0,set=0;KEYS.forEach(function(k){var pip=$('.pip[data-k="'+k+'"]');pip.className='pip';if(S.done[k]){n++;if(S.results[k]==='settled')set++;pip.className='pip '+(S.results[k]==='settled'?'settled':'on');}});
  $('#prog-text').textContent='Activities done: '+n+' of 4'+(set?' ('+set+(set>1?' checks':' check')+' settled, not correct)':'');}
var WORD={'correct':'correct on the first try','correct-retry':'correct on the second try','settled':'answered and settled, not marked correct'};
function complete(k,label){S.done[k]=true;progress();next.textContent=label||'Continue';next.hidden=false;}
