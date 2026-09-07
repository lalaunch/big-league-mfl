/* THE BIG LEAGUE — HERO CLEAN V4
   Makes the right side stable: no ghost 36, no line-art player, and prepares for photographic art. */
(function(){
  'use strict';
  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}
  function apply(){
    var hero=document.querySelector('#body_home.blsn-mode .blsn-hero-main');
    if(!hero) return false;

    hero.classList.add('blsn-hero-clean-v4');

    Array.from(hero.querySelectorAll('img[aria-hidden="true"]')).forEach(function(img){
      img.style.setProperty('display','none','important');
      img.style.setProperty('visibility','hidden','important');
    });

    var direct=Array.from(hero.children);
    var quote=direct.find(function(el){return /SAME LEAGUE\./i.test(clean(el.textContent)) && !/GO TIME/i.test(clean(el.textContent));});
    var go=direct.find(function(el){return /IT['’]?S GO TIME\.?/i.test(clean(el.textContent));});
    if(quote) quote.classList.add('blsn-hero-v4-quote');
    if(go) go.classList.add('blsn-hero-v4-go');

    var oldPanel=hero.querySelector('.blsn-hero-v4-panel');
    if(!oldPanel){
      var panel=document.createElement('div');
      panel.className='blsn-hero-v4-panel';
      hero.appendChild(panel);
    }

    return true;
  }

  var tries=0;
  (function wait(){
    if(apply()) return;
    if(++tries<80) setTimeout(wait,200);
  })();
})();
