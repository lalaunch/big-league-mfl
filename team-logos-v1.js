/* The Big League — 2026 custom franchise crest pack */
(function(){
  'use strict';

  var PUGS='https://lalaunch.github.io/big-league-mfl/assets/killer-pugs-official.webp?v=2';
  var SPR='data:image/webp;base64,'+(window.BL_TEAM_SPRITE||'');
  var PIX='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  var POS={
    '0001':'0% 0%',
    '0002':'25% 0%',
    '0003':'50% 0%',
    '0004':'75% 0%',
    '0005':'100% 0%',
    '0006':'0% 100%',
    '0007':'25% 100%',
    '0008':'50% 100%',
    '0009':'75% 100%'
  };

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function idClass(el){
    for(var n=el,i=0;n&&i<5;n=n.parentElement,i++){
      var m=String(n.className||'').match(/franchise_(000[1-9]|0010)/i);
      if(m) return m[1];
    }
    return null;
  }

  function idSrc(src){
    src=String(src||'');
    var m=src.match(/franchise_(?:logo|icon)(000[1-9]|0010)/i);
    if(m) return m[1];
    m=src.match(/(?:^|[_\/-])(000[1-9]|0010)(?=\.(?:jpg|jpeg|png|gif|webp)|[_\/-]|$)/i);
    return m?m[1]:null;
  }

  function sprite(img,id){
    if(!img||!POS[id]||!SPR) return;
    img.src=PIX;
    img.removeAttribute('srcset');
    img.style.backgroundImage='url("'+SPR+'")';
    img.style.backgroundSize='500% 200%';
    img.style.backgroundPosition=POS[id];
    img.style.backgroundRepeat='no-repeat';
    img.style.backgroundColor='transparent';
    img.style.objectFit='contain';
    img.setAttribute('data-bl-team-logo',id);
  }

  function pugs(img){
    if(!img) return;
    img.src=PUGS;
    img.removeAttribute('srcset');
    img.style.backgroundImage='none';
    img.style.backgroundPosition='center';
    img.style.backgroundSize='contain';
    img.style.objectFit='contain';
    img.setAttribute('data-bl-team-logo','0010');
  }

  function patchImages(){
    document.querySelectorAll('img').forEach(function(img){
      var id=idClass(img)||idSrc(img.getAttribute('src'))||idSrc(img.getAttribute('data-src'));
      if(!id||img.getAttribute('data-bl-team-logo')===id) return;
      if(id==='0010') pugs(img);
      else if(POS[id]) sprite(img,id);
    });
  }

  function patchPseudo(){
    if(document.getElementById('bl-team-crest-pack')) return;
    var style=document.createElement('style');
    style.id='bl-team-crest-pack';
    var css='';
    Object.keys(POS).forEach(function(id){
      css+='#body_home a.franchise_'+id+':before,#body_home a[class*="franchise_'+id+'"]:before{'+
        'background-image:url("'+SPR+'")!important;'+
        'background-size:500% 200%!important;'+
        'background-position:'+POS[id]+'!important;'+
        'background-repeat:no-repeat!important;'+
        'background-color:transparent!important;'+
        'content:""!important;}\n';
    });
    css+='#body_home a.franchise_0010:before,#body_home a[class*="franchise_0010"]:before{'+
      'background-image:url("'+PUGS+'")!important;'+
      'background-size:contain!important;'+
      'background-position:center!important;'+
      'background-repeat:no-repeat!important;'+
      'background-color:transparent!important;'+
      'content:""!important;}';
    style.textContent=css;
    document.head.appendChild(style);
  }

  function patchPugsHero(){
    document.querySelectorAll('.bl-champ-card,.bl-champion,#body_home [class*="champ"],#body_home #homepagecolumn3').forEach(function(box){
      if(/milwaukee\s+killer\s+pugs/i.test(clean(box.textContent))){
        var img=box.querySelector('img');
        if(img) pugs(img);
      }
    });
  }

  function patch(){
    patchPseudo();
    patchImages();
    patchPugsHero();
  }

  function start(){
    if(!window.BL_TEAM_SPRITE||window.BL_TEAM_SPRITE.length<60000) return;
    patch();
    var n=0;
    var timer=setInterval(function(){
      patch();
      if(++n>=60) clearInterval(timer);
    },300);
    if(window.MutationObserver){
      var queued=false;
      var observer=new MutationObserver(function(){
        if(queued) return;
        queued=true;
        setTimeout(function(){queued=false;patch();},80);
      });
      observer.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(function(){try{observer.disconnect();}catch(e){}},30000);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
