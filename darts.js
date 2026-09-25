/* The Big League — darts (2026-09-25, temporary)
   Swaps the champion crest in the home hero for a photo target and makes it a dart game.
   Click or tap to throw; each dart lands near the aim with a little wobble and sticks.
   Rings are scored from the bull (the face): 50 / 25 / 15 / 10 / 5, off the disc is a miss.
   Three darts a round; each viewer's best round is kept in their own browser only.
   Loaded by bigleague-v8.js only while its DARTS flag is true; set it false to bring the crest back. */
(function(){
  'use strict';

  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var IMG=HOST+'assets/dart-target.webp?v='+(window.BL_VERSION||'0');
  var BULL={x:50,y:47};            /* % of the disc: the face, with the photo framed as below */
  var RINGS=[[7,50],[16,25],[28,15],[40,10],[50,5]]; /* [radius as % of disc width, points] */
  var WOBBLE=5;                    /* max scatter, % of disc width */
  var PER_ROUND=3;
  var KEY='bl-darts-best';

  function css(){
    if(document.getElementById('bl-darts-css')) return;
    var s=document.createElement('style');
    s.id='bl-darts-css';
    s.textContent=[
      '#body_home.blsn-mode .blsn-champ-logo-wrap.bl-darts{overflow:visible;cursor:crosshair;background:none;box-shadow:0 12px 26px rgba(0,0,0,.58);touch-action:manipulation;user-select:none;-webkit-user-select:none;}',
      '.bl-darts .bl-dt-disc{position:absolute;inset:0;border-radius:50%;overflow:hidden;border:4px solid #f5c72f;box-shadow:inset 0 0 0 3px #041018;}',
      '.bl-darts .bl-dt-photo{width:100%;height:100%;object-fit:cover;object-position:41% 30%;display:block;pointer-events:none;}',
      '.bl-darts .bl-dt-ring{position:absolute;border-radius:50%;border:1px solid rgba(245,199,47,.55);transform:translate(-50%,-50%);pointer-events:none;}',
      '.bl-darts .bl-dt-ring.bull{background:rgba(255,43,43,.28);border-color:rgba(255,43,43,.9);}',
      '.bl-darts .bl-dt-dart{position:absolute;width:34px;height:34px;margin:-3px 0 0 -3px;pointer-events:none;z-index:4;transform-origin:3px 3px;animation:bl-dt-fly .16s ease-out;}',
      '@keyframes bl-dt-fly{from{transform:translate(90px,110px) scale(1.8);opacity:.2;}to{transform:none;opacity:1;}}',
      '.bl-darts .bl-dt-pop{position:absolute;transform:translate(-50%,-120%);font:900 16px/1 "Arial Black",Arial,sans-serif;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 8px rgba(0,0,0,.8);pointer-events:none;z-index:5;animation:bl-dt-pop .9s ease-out forwards;white-space:nowrap;}',
      '.bl-darts .bl-dt-pop.big{color:#ff2b2b;font-size:20px;}',
      '@keyframes bl-dt-pop{from{opacity:1;margin-top:0;}to{opacity:0;margin-top:-26px;}}',
      '.bl-darts .bl-dt-board{position:absolute;left:50%;bottom:-30px;transform:translateX(-50%);padding:3px 10px;border:1px solid #155b80;border-radius:12px;background:#041018;color:#e8f5fa;font:700 11px/1.4 Arial,sans-serif;white-space:nowrap;z-index:5;pointer-events:none;}',
      '.bl-darts .bl-dt-board b{color:#f5c72f;}',
      '@media (prefers-reduced-motion:reduce){.bl-darts .bl-dt-dart,.bl-darts .bl-dt-pop{animation:none;}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* a dart, drawn tip at (3,3) pointing up-left, flights toward the thrower */
  var DART='<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">'+
    '<line x1="3" y1="3" x2="13" y2="13" stroke="#cfd8dc" stroke-width="2"/>'+
    '<line x1="13" y1="13" x2="24" y2="24" stroke="#b71c1c" stroke-width="4" stroke-linecap="round"/>'+
    '<path d="M22 22 L33 20 L27 27 L20 33 Z" fill="#f5c72f" stroke="#041018" stroke-width="1"/></svg>';

  function best(){ try{return parseInt(localStorage.getItem(KEY),10)||0;}catch(e){return 0;} }
  function saveBest(n){ try{localStorage.setItem(KEY,String(n));}catch(e){} }

  function build(wrap){
    if(wrap.getAttribute('data-bl-darts')) return;
    wrap.setAttribute('data-bl-darts','1');
    wrap.classList.add('bl-darts');
    wrap.setAttribute('title','Click to throw a dart');
    wrap.innerHTML='<div class="bl-dt-disc"><img class="bl-dt-photo" src="'+IMG+'" alt="Dart target" draggable="false"></div><div class="bl-dt-board"></div>';
    RINGS.slice().reverse().forEach(function(r,i){
      var d=document.createElement('div');
      d.className='bl-dt-ring'+(i===RINGS.length-1?' bull':'');
      d.style.left=BULL.x+'%'; d.style.top=BULL.y+'%';
      d.style.width=d.style.height=(r[0]*2)+'%';
      wrap.querySelector('.bl-dt-disc').appendChild(d);
    });

    var board=wrap.querySelector('.bl-dt-board'), darts=[], round=0;
    function show(){ board.innerHTML='🎯 Darts <b>'+darts.length+'/'+PER_ROUND+'</b> · Round <b>'+round+'</b> · Best <b>'+best()+'</b>'; }
    show();

    function throwAt(clientX,clientY){
      if(darts.length>=PER_ROUND){ darts.forEach(function(d){d.remove();}); darts=[]; round=0; }
      var box=wrap.getBoundingClientRect();
      var ax=(clientX-box.left)/box.width*100, ay=(clientY-box.top)/box.height*100;
      var ang=Math.random()*Math.PI*2, rad=Math.random()*WOBBLE;
      var x=ax+Math.cos(ang)*rad, y=ay+Math.sin(ang)*rad;

      var fromCenter=Math.sqrt(Math.pow(x-50,2)+Math.pow(y-50,2));
      var fromBull=Math.sqrt(Math.pow(x-BULL.x,2)+Math.pow(y-BULL.y,2));
      var pts=0;
      if(fromCenter<=50){ for(var i=0;i<RINGS.length;i++){ if(fromBull<=RINGS[i][0]){pts=RINGS[i][1];break;} } }

      var dart=document.createElement('div');
      dart.className='bl-dt-dart'; dart.innerHTML=DART;
      dart.style.left=x+'%'; dart.style.top=y+'%';
      wrap.appendChild(dart); darts.push(dart);

      var pop=document.createElement('div');
      pop.className='bl-dt-pop'+(pts===50?' big':'');
      pop.textContent=pts===50?'BULLSEYE! +50':(pts?'+'+pts:'MISS');
      pop.style.left=x+'%'; pop.style.top=y+'%';
      wrap.appendChild(pop);
      setTimeout(function(){pop.remove();},950);

      round+=pts;
      if(darts.length===PER_ROUND && round>best()) saveBest(round);
      show();
    }

    wrap.addEventListener('click',function(e){ e.preventDefault(); throwAt(e.clientX,e.clientY); });
  }

  function start(){
    css();
    var tries=0;
    (function wait(){
      var wrap=document.querySelector('.blsn-champ-logo-wrap');
      if(wrap){ build(wrap); return; }
      if(++tries<60) setTimeout(wait,250);
    })();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
