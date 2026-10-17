  $$('.lb').forEach(function(b){b.addEventListener('click',function(){var it=ITEMS[idx];if(!it||placed[idx])return;var lane=b.getAttribute('data-lane');
    var names={share:'Share',redact:'Redact first',never:'Never share'};
    if(lane===it.lane){placed[idx]=lane;var msg=[{c:'verdict ok',s:it.n+' → '+names[lane]+'.'},{s:it.ok}];idx++;renderLanes();
      if(idx>=ITEMS.length){msg.push({s:'All six sorted. The two in Redact first are useful once one part is removed; the next step shows how.'});E.say(msg,true);E.complete('x1');$$('.lb').forEach(function(x){x.disabled=true;});$('#cur-name').textContent='all sorted';$('#cur-desc').textContent='';}
      else E.say(msg);}
    else E.say([{c:'verdict no',s:'Not '+names[lane]+'. '+it.w[lane]},{s:'Choose another lane for '+it.n+'.'}]);});});
