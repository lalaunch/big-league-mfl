/* THE BIG LEAGUE — HERO V3
   Replaces the old line-art right side with the concept-style photographic panel. */
(function(){
  'use strict';
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var ART=HOST+'assets/hero-right-v3.b64.txt?v=2';

  function addStyle(){
    if(document.getElementById('bl-hero-v3-style')) return;
    var s=document.createElement('style');
    s.id='bl-hero-v3-style';
    s.textContent=`
      #body_home.blsn-mode .blsn-hero-main{position:relative!important;overflow:hidden!important;}
      #body_home.blsn-mode .blsn-hero-main .blsn-hero-v3-panel{
        position:absolute!important;z-index:60!important;right:0!important;top:5%!important;width:43%!important;height:90%!important;
        overflow:hidden!important;pointer-events:none!important;background:#02090f!important;
        border-left:1px solid rgba(70,181,232,.45)!important;
        box-shadow:inset 30px 0 38px rgba(2,8,13,.50),-10px 0 24px rgba(0,0,0,.18)!important;
      }
      #body_home.blsn-mode .blsn-hero-main .blsn-hero-v3-panel:before{
        content:"";position:absolute;z-index:2;left:0;top:0;bottom:0;width:18%;pointer-events:none;
        background:linear-gradient(90deg,#06141d 0%,rgba(6,20,29,.70) 28%,rgba(6,20,29,0) 100%);
      }
      #body_home.blsn-mode .blsn-hero-main .blsn-hero-v3-art{
        position:absolute!important;z-index:1!important;inset:0!important;width:100%!important;height:100%!important;
        object-fit:fill!important;display:block!important;filter:brightness(1.04) contrast(1.06) saturate(1.05)!important;
      }
      #body_home.blsn-mode .blsn-hero-main > img[aria-hidden="true"]{opacity:0!important;visibility:hidden!important;}
      @media(max-width:980px){
        #body_home.blsn-mode .blsn-hero-main .blsn-hero-v3-panel{width:44%!important;top:7%!important;height:86%!important;}
      }
      @media(max-width:760px){
        #body_home.blsn-mode .blsn-hero-main .blsn-hero-v3-panel{width:48%!important;opacity:.92!important;}
      }
    `;
    document.head.appendChild(s);
  }

  function apply(){
    addStyle();
    var hero=document.querySelector('#body_home.blsn-mode .blsn-hero-main');
    if(!hero) return false;
    if(hero.querySelector('.blsn-hero-v3-panel')) return true;

    var panel=document.createElement('div');
    panel.className='blsn-hero-v3-panel';
    var img=document.createElement('img');
    img.className='blsn-hero-v3-art';
    img.alt='';
    img.setAttribute('aria-hidden','true');
    panel.appendChild(img);
    hero.appendChild(panel);

    fetch(ART,{cache:'no-store'})
      .then(function(r){if(!r.ok) throw new Error('hero asset '+r.status);return r.text();})
      .then(function(b64){img.src='data:image/webp;base64,'+b64.replace(/\s+/g,'');})
      .catch(function(){panel.remove();});

    return true;
  }

  var tries=0;
  (function wait(){
    if(apply()) return;
    if(++tries<80) setTimeout(wait,200);
  })();
})();
