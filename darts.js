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
      '.bl-darts .bl-dt-stage{position:absolute;max-width:none;opacity:0;transition:opacity .45s ease;pointer-events:none;}',
      '.bl-darts .bl-dt-stage.on{opacity:1;}',
      /* carnival booth (2026-09-25): the hero's champion side becomes sign | target | rules,
         target dead center; tent stripes under a dark wash, marquee bulbs chasing round the edge */
      '#body_home.blsn-mode .blsn-champ-side.bl-carnival{display:grid !important;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) !important;justify-items:center;align-items:center;gap:20px !important;padding:22px 26px 44px !important;text-align:center;background:linear-gradient(rgba(4,16,24,.60),rgba(4,16,24,.70)),repeating-linear-gradient(90deg,#a8141c 0 26px,#efe2c2 26px 52px) !important;}',
      '#body_home.blsn-mode .blsn-champ-side.bl-carnival .blsn-champ-copy{display:none !important;}',
      /* bigger target (2026-09-25): 240 on desktop fits the 318px-tall box with the scoreboard under it */
      '#body_home.blsn-mode .blsn-champ-side.bl-carnival .blsn-champ-logo-wrap{width:240px !important;height:240px !important;}',
      '#body_home.blsn-mode .blsn-champ-side.bl-carnival:after{content:"";position:absolute;inset:6px;pointer-events:none;z-index:1;border-radius:6px;background:radial-gradient(circle,#ffd54a 0 2.5px,rgba(255,213,74,.25) 3.5px,transparent 4.5px) 0 0/22px 12px repeat-x,radial-gradient(circle,#ffd54a 0 2.5px,rgba(255,213,74,.25) 3.5px,transparent 4.5px) 11px 100%/22px 12px repeat-x;animation:bl-cv-bulbs .7s steps(1,end) infinite;}',
      '@keyframes bl-cv-bulbs{50%{background-position:11px 0,0 100%;}}',
      '.bl-carnival .bl-cv-sign,.bl-carnival .bl-cv-rules{position:relative;z-index:3;min-width:0;}',
      '.bl-carnival .bl-cv-step{color:#efe2c2;font:900 11px/1.2 Arial,sans-serif;letter-spacing:.08em;white-space:nowrap;text-transform:uppercase;}',
      '.bl-carnival .bl-cv-title{margin:8px 0 6px;color:#ffc62d;font-family:Impact,"Arial Black",Arial,sans-serif;font-style:italic;font-weight:900;font-size:40px;line-height:.9;text-transform:uppercase;text-shadow:2px 2px 0 #a8141c,4px 4px 0 #5c0a0e,6px 6px 10px rgba(0,0,0,.6);}',
      '.bl-carnival .bl-cv-tag{color:#fff;font:italic 800 14px/1.25 Arial,sans-serif;}',
      '.bl-carnival .bl-cv-rules{color:#e8f5fa;font:600 12px/1.45 Arial,sans-serif;max-width:230px;}',
      '.bl-carnival .bl-cv-rules b{color:#ffd54a;}',
      '.bl-carnival .bl-cv-prize{margin-top:8px;color:#efe2c2;font-size:11px;font-style:italic;}',
      '@media(max-width:1200px){.bl-carnival .bl-cv-title{font-size:32px;}.bl-carnival .bl-cv-rules{font-size:11px;}#body_home.blsn-mode .blsn-champ-side.bl-carnival .blsn-champ-logo-wrap{width:205px !important;height:205px !important;}}',
      '@media(max-width:650px){#body_home.blsn-mode .blsn-champ-side.bl-carnival{grid-template-columns:1fr !important;padding:26px 18px 48px !important;}.bl-carnival .blsn-champ-logo-wrap{margin:0 auto 30px !important;}}',
      '@media (prefers-reduced-motion:reduce){.bl-darts .bl-dt-dart,.bl-darts .bl-dt-pop,#body_home.blsn-mode .blsn-champ-side.bl-carnival:after{animation:none;}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* a dart, drawn tip at (3,3) pointing up-left, flights toward the thrower */
  var DART='<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">'+
    '<line x1="3" y1="3" x2="13" y2="13" stroke="#cfd8dc" stroke-width="2"/>'+
    '<line x1="13" y1="13" x2="24" y2="24" stroke="#b71c1c" stroke-width="4" stroke-linecap="round"/>'+
    '<path d="M22 22 L33 20 L27 27 L20 33 Z" fill="#f5c72f" stroke="#041018" stroke-width="1"/></svg>';

  /* clown makeover (2026-09-25): three photos, least to most clown. Each scoring dart
     crossfades to the next; three hits is full clown, and a new round starts him clean.
     Each photo is 16:9 with the face framed differently, so each is placed by hand:
     n = the nose as a fraction of the photo (x, y), z = zoom as a multiple of the disc height.
     The photo is sized and shifted so its nose lands on the bull (BULL) and the face is
     about the width of the original's. Values read off the photos, then checked on screen. */
  var STAGES=[
    {src:'assets/dart-clown-1.webp',n:[.456,.382],z:1.26},
    {src:'assets/dart-clown-2.webp',n:[.455,.451],z:1.12},
    {src:'assets/dart-clown-3.webp',n:[.456,.466],z:1.30}
  ];
  var CLOWN=STAGES.map(function(st,i){
    var h=st.z*100, w=h*16/9;
    return '<img class="bl-dt-stage" data-stage="'+(i+1)+'" src="'+HOST+st.src+'?v='+(window.BL_VERSION||'0')+'" alt="" draggable="false" style="width:'+w.toFixed(2)+'%;height:'+h.toFixed(2)+'%;left:'+(BULL.x-st.n[0]*w).toFixed(2)+'%;top:'+(BULL.y-st.n[1]*h).toFixed(2)+'%">';
  }).join('');
  var CLOWN_STAGES=STAGES.length;

  /* honk-honk at full clown (2026-09-25): a bulb horn made in Web Audio, no sound file.
     Each honk is a buzzy square wave swooping up then down, pushed through a narrow band
     filter for the rubber-bulb nasal tone. Runs inside the click, so browsers allow the sound.
     Gain 1.8 peaks at 0.91 of full scale (measured offline 2026-09-25): loud, not clipping. */
  /* 2026-09-25: Dan's clown-horn MP3 is the sound; the Web Audio horn below is only the
     fallback if the file can't play. The file is preloaded so the honk lands on the hit. */
  var HORN=null;
  function honk(){
    try{
      if(!HORN){ HORN=new Audio(HOST+'assets/clown-horn.mp3?v='+(window.BL_VERSION||'0')); HORN.preload='auto'; }
      HORN.currentTime=0; HORN.volume=1;
      var p=HORN.play(); if(p&&p.catch) p.catch(synthHonk);
    }catch(e){ synthHonk(); }
  }
  var AUDIO=null;
  function synthHonk(){
    try{
      var Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx) return;
      AUDIO=AUDIO||new Ctx(); if(AUDIO.state==='suspended') AUDIO.resume();
      [0,.24].forEach(function(at){
        var t=AUDIO.currentTime+at, o=AUDIO.createOscillator(), f=AUDIO.createBiquadFilter(), g=AUDIO.createGain();
        o.type='square';
        o.frequency.setValueAtTime(330,t); o.frequency.linearRampToValueAtTime(420,t+.05); o.frequency.exponentialRampToValueAtTime(300,t+.18);
        f.type='bandpass'; f.frequency.value=1100; f.Q.value=4;
        g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(1.8,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.2);
        o.connect(f); f.connect(g); g.connect(AUDIO.destination);
        o.start(t); o.stop(t+.22);
      });
    }catch(e){}
  }

  function best(){ try{return parseInt(localStorage.getItem(KEY),10)||0;}catch(e){return 0;} }
  function saveBest(n){ try{localStorage.setItem(KEY,String(n));}catch(e){} }

  function build(wrap){
    if(wrap.getAttribute('data-bl-darts')) return;
    wrap.setAttribute('data-bl-darts','1');
    wrap.classList.add('bl-darts');
    wrap.setAttribute('title','Click to throw a dart');
    wrap.innerHTML='<div class="bl-dt-disc"><img class="bl-dt-photo" src="'+IMG+'" alt="Dart target" draggable="false">'+CLOWN+'</div><div class="bl-dt-board"></div>';
    RINGS.slice().reverse().forEach(function(r,i){
      var d=document.createElement('div');
      d.className='bl-dt-ring'+(i===RINGS.length-1?' bull':'');
      d.style.left=BULL.x+'%'; d.style.top=BULL.y+'%';
      d.style.width=d.style.height=(r[0]*2)+'%';
      wrap.querySelector('.bl-dt-disc').appendChild(d);
    });

    try{ HORN=new Audio(HOST+'assets/clown-horn.mp3?v='+(window.BL_VERSION||'0')); HORN.preload='auto'; }catch(e){}

    var side=wrap.closest('.blsn-champ-side');
    if(side && !side.classList.contains('bl-carnival')){
      side.classList.add('bl-carnival');
      var sign=document.createElement('div');
      sign.className='bl-cv-sign';
      sign.innerHTML='<div class="bl-cv-step">🎪 Step right up! 🎪</div><div class="bl-cv-title">Big League<br>Dart Toss</div><div class="bl-cv-tag">Three darts. One smile.<br>Wipe it off.</div>';
      var rules=document.createElement('div');
      rules.className='bl-cv-rules';
      rules.innerHTML='Click or tap the board to let a dart fly. Aim for the nose — the red bull is worth <b>50</b>; the rings pay <b>25</b>, <b>15</b>, <b>10</b> and <b>5</b>. Off the board is a miss. Every hit paints on more clown; three hits and he is the full circus. Three darts a round; your best round is kept on this device.'+
        '<div class="bl-cv-prize">🎟️ Every player a winner.* <br>*Prizes not available in Wisconsin.</div>';
      side.insertBefore(sign,wrap);
      if(wrap.nextSibling) side.insertBefore(rules,wrap.nextSibling); else side.appendChild(rules);
    }

    var board=wrap.querySelector('.bl-dt-board'), darts=[], round=0, clowned=0;
    function show(){ board.innerHTML='🎯 Darts <b>'+darts.length+'/'+PER_ROUND+'</b> · Round <b>'+round+'</b> · Best <b>'+best()+'</b>'; }
    show();

    function throwAt(clientX,clientY){
      if(darts.length>=PER_ROUND){
        darts.forEach(function(d){d.remove();}); darts=[]; round=0;
        clowned=0; Array.from(wrap.querySelectorAll('.bl-dt-stage.on')).forEach(function(im){im.classList.remove('on');});
      }
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

      if(pts && clowned<CLOWN_STAGES){
        clowned++;
        var layer=wrap.querySelector('.bl-dt-stage[data-stage="'+clowned+'"]');
        if(layer) layer.classList.add('on');
        if(clowned===CLOWN_STAGES) honk();
      }

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
