/* HERO V4 loader: converts the hosted base64 payload into the approved photographic panel. */
(function(){
  'use strict';
  var B64='https://lalaunch.github.io/big-league-mfl/hero-right-v4.b64.txt?v=1';
  function apply(){
    var panel=document.querySelector('#body_home.blsn-mode .blsn-hero-v4-panel');
    if(!panel) return false;
    if(panel.getAttribute('data-v4-ready')==='1') return true;
    panel.setAttribute('data-v4-ready','1');
    fetch(B64,{cache:'no-store'})
      .then(function(r){if(!r.ok) throw new Error('payload '+r.status);return r.text();})
      .then(function(b64){
        b64=b64.replace(/\s+/g,'');
        var img=new Image();
        img.onload=function(){panel.style.backgroundImage='linear-gradient(90deg,rgba(4,17,26,.90) 0%,rgba(4,17,26,.22) 10%,rgba(4,17,26,0) 18%),url("'+img.src+'")';panel.style.backgroundSize='cover';panel.style.backgroundPosition='center';};
        img.onerror=function(){panel.style.display='none';};
        img.src='data:image/webp;base64,'+b64;
      })
      .catch(function(){panel.style.display='none';});
    return true;
  }
  var tries=0;(function wait(){if(apply())return;if(++tries<80)setTimeout(wait,200);})();
})();
