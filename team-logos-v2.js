/* The Big League — direct 2026 team logo pack */
(function(){
  'use strict';

  var HOST='https://lalaunch.github.io/big-league-mfl/assets/logos/';
  var LOGOS={
    '0001':HOST+'tampa-bay-roxx-gang.webp?v=4',
    '0002':HOST+'la-launch.webp?v=4',
    '0003':HOST+'reno-gamblers.webp?v=4',
    '0004':HOST+'bristol-steampunks.webp?v=4',
    '0005':HOST+'delafield-draft-attics.webp?v=4',
    '0006':HOST+'kansas-city-killers.webp?v=4',
    '0007':HOST+'brooklyn-brawlers.webp?v=4',
    '0008':HOST+'winnebago-campers.webp?v=4',
    '0009':HOST+'jersey-jackhammers.webp?v=4',
    '0010':HOST+'milwaukee-killer-pugs.webp?v=4'
  };

  function getId(el){
    var n=el;
    for(var i=0;n&&i<6;i++,n=n.parentElement){
      /* franchise pages: <img id="franchiselogo_0002" class="franchiselogo"> (2026-09-06) */
      var idm=String(n.id||'').match(/franchise_?(?:logo|icon)?_?(000[1-9]|0010)(?!\d)/i);
      if(idm) return idm[1];
      var c=String(n.className||'').match(/franchise_(000[1-9]|0010)/i);
      if(c) return c[1];
    }
    var src=String(el.getAttribute&&el.getAttribute('src')||'');
    var m=src.match(/franchise_(?:logo|icon)(000[1-9]|0010)/i);
    if(m) return m[1];
    m=src.match(/(?:^|[_\/-])(000[1-9]|0010)(?=\.(?:jpg|jpeg|png|gif|webp)|[_\/-]|$)/i);
    return m?m[1]:null;
  }

  function patchImages(){
    document.querySelectorAll('img').forEach(function(img){
      var id=getId(img);
      if(!id||!LOGOS[id]) return;
      if(img.src!==LOGOS[id]){
        img.src=LOGOS[id];
        img.removeAttribute('srcset');
      }
      img.style.backgroundImage='none';
      img.style.backgroundColor='transparent';
      img.style.objectFit='contain';
      img.setAttribute('data-bl-team-logo',id);
    });
  }

  function patchPseudo(){
    var style=document.getElementById('bl-team-crest-pack-v2');
    if(!style){
      style=document.createElement('style');
      style.id='bl-team-crest-pack-v2';
      document.head.appendChild(style);
    }
    var css='';
    Object.keys(LOGOS).forEach(function(id){
      css+='#body_home a.franchise_'+id+':before,#body_home a[class*="franchise_'+id+'"]:before{'+
        'content:""!important;'+
        'background-image:url("'+LOGOS[id]+'")!important;'+
        'background-size:contain!important;'+
        'background-position:center!important;'+
        'background-repeat:no-repeat!important;'+
        'background-color:transparent!important;}\n';
    });
    style.textContent=css;
  }

  /* 2026-09-07: crest in every roster/report caption that names a franchise
     (<caption><span><a class="franchise_0007">...</a></span></caption>). Any page. */
  function patchCaptions(){
    var style=document.getElementById('bl-caption-crest-css');
    if(!style){
      style=document.createElement('style');
      style.id='bl-caption-crest-css';
      style.textContent=
        'table.report caption .bl-caption-crest{display:inline-block!important;width:34px!important;height:34px!important;'+
        'vertical-align:middle!important;margin:-4px 10px -4px 0!important;object-fit:contain!important;'+
        'filter:drop-shadow(0 3px 5px rgba(0,0,0,.6))!important;background:none!important;}'+
        'table.report caption:has(.bl-caption-crest){padding:6px 10px!important;line-height:34px!important;}'+
        /* MFL's own icons were 100x100 and rendered at natural size; ours are 400x400. Cap, never force (home CSS sets 36px). */
        'img[data-bl-team-logo]{max-width:100px!important;max-height:100px!important;}';
      document.head.appendChild(style);
    }
    document.querySelectorAll('table.report caption a[class*="franchise_"]').forEach(function(a){
      var m=String(a.className).match(/franchise_(000[1-9]|0010)/i);
      if(!m||!LOGOS[m[1]]) return;
      var cap=a.closest('caption');
      if(!cap||cap.querySelector('.bl-caption-crest')) return;
      var img=document.createElement('img');
      img.className='bl-caption-crest';
      img.src=LOGOS[m[1]];
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.setAttribute('data-bl-team-logo',m[1]);
      a.parentNode.insertBefore(img,a);
    });
  }

  function patch(){patchPseudo();patchImages();patchCaptions();}

  function start(){
    patch();
    var n=0;
    var timer=setInterval(function(){patch();if(++n>=80)clearInterval(timer);},250);
    if(window.MutationObserver){
      var pending=false;
      var mo=new MutationObserver(function(){
        if(pending)return;
        pending=true;
        setTimeout(function(){pending=false;patch();},60);
      });
      mo.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(function(){try{mo.disconnect();}catch(e){}},30000);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();
