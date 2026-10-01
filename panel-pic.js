/* The Big League — panel picture (2026-09-30, temporary)
   Fills the champion panel in the home hero with one picture, shown whole (contain) over a
   blurred copy of itself so a picture of any shape fills the box without cropping its text.
   The panel's own content stays in place, hidden, so the panel keeps its height.
   Loaded by bigleague-v8.js only while its PANEL_PIC is set; empty string = crest back. */
(function(){
  'use strict';

  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var PIC=window.BL_PANEL_PIC; if(!PIC) return;
  var SRC=HOST+PIC+'?v='+(window.BL_VERSION||'0');

  function css(){
    if(document.getElementById('bl-pic-css')) return;
    var s=document.createElement('style');
    s.id='bl-pic-css';
    s.textContent=[
      '#body_home.blsn-mode .blsn-champ-side.bl-pic{position:relative;overflow:hidden;}',
      '#body_home.blsn-mode .blsn-champ-side.bl-pic > :not(.bl-pic-fill){visibility:hidden;}',
      '.bl-pic-fill{position:absolute;inset:0;z-index:2;background:#02080d;}',
      '.bl-pic-fill .bl-pic-bg{position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(18px) brightness(.45);}',
      '.bl-pic-fill .bl-pic-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function build(side){
    if(side.classList.contains('bl-pic')) return;
    side.classList.add('bl-pic');
    var fill=document.createElement('div');
    fill.className='bl-pic-fill';
    fill.innerHTML='<img class="bl-pic-bg" src="'+SRC+'" alt="" aria-hidden="true"><img class="bl-pic-img" src="'+SRC+'" alt="">';
    side.appendChild(fill);
  }

  function start(){
    css();
    var tries=0;
    (function wait(){
      var side=document.querySelector('.blsn-champ-side');
      if(side){ build(side); return; }
      if(++tries<60) setTimeout(wait,250);
    })();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
