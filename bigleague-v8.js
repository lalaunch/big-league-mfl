/* The Big League — hosted loader + nav fix */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var CORE='https://lalaunch.github.io/big-league-mfl/bigleague-core-v10.js?v=1';
  var PUGS_LOGO='https://lalaunch.github.io/big-league-mfl/assets/killer-pugs-official.webp?v=1';

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function patchNav(){
    var nav=document.querySelector('.bl-mainnav');
    if(!nav) return false;

    var links=Array.from(nav.querySelectorAll('a'));
    var rulesIndex=links.findIndex(function(a){return clean(a.textContent).toLowerCase()==='rules';});
    var messageLink=links.find(function(a){return /^(messages|message board)$/i.test(clean(a.textContent));});
    if(messageLink){
      messageLink.textContent='MESSAGE BOARD';
      messageLink.href=BASE+'/options?L='+LEAGUE+'&O=17';
      if(rulesIndex>=0 && links[rulesIndex].nextElementSibling!==messageLink){
        links[rulesIndex].insertAdjacentElement('afterend',messageLink);
      }
    }

    Array.from(nav.querySelectorAll('a')).forEach(function(a){
      var label=clean(a.textContent).toLowerCase();

      if(label==='history'){
        a.href=BASE+'/options?L='+LEAGUE+'&O=194';
        if(a.getAttribute('data-bl-tab-fix')!=='1'){
          a.setAttribute('data-bl-tab-fix','1');
          a.addEventListener('click',function(e){
            var tab=document.getElementById('tab3');
            if(tab && typeof window.show_tab==='function'){
              e.preventDefault();
              window.show_tab('3');
              try{history.replaceState(null,'','#3');}catch(err){}
              window.scrollTo({top:0,behavior:'smooth'});
            }
          });
        }
      }

      if(label==='rules'){
        a.href=BASE+'/options?L='+LEAGUE+'&O=09';
        if(a.getAttribute('data-bl-tab-fix')!=='1'){
          a.setAttribute('data-bl-tab-fix','1');
          a.addEventListener('click',function(e){
            var tab=document.getElementById('tab1');
            if(tab && typeof window.show_tab==='function'){
              e.preventDefault();
              window.show_tab('1');
              try{history.replaceState(null,'','#1');}catch(err){}
              window.scrollTo({top:0,behavior:'smooth'});
            }
          });
        }
      }
    });

    return true;
  }

  function patchDashboardLinks(){
    Array.from(document.querySelectorAll('a')).forEach(function(a){
      var label=clean(a.textContent).toLowerCase();
      if(label==='league rules') a.href=BASE+'/options?L='+LEAGUE+'&O=09';
      if(label==='view full championship history') a.href=BASE+'/options?L='+LEAGUE+'&O=194';
    });
  }

  function patchPugsLogo(){
    var selectors=[
      'img[src*="franchise_logo0010"]',
      'img[src*="franchise_icon0010"]',
      'img[src*="0010.jpg"]',
      'img[src*="0010.png"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function(img){
      if(img.getAttribute('data-bl-pugs-logo')==='1') return;
      img.src=PUGS_LOGO;
      img.setAttribute('data-bl-pugs-logo','1');
    });

    Array.from(document.querySelectorAll('a[class*="franchise_0010"]')).forEach(function(a){
      a.style.setProperty('--bl-pugs-logo','url("'+PUGS_LOGO+'")');
    });

    var style=document.getElementById('bl-pugs-logo-override');
    if(!style){
      style=document.createElement('style');
      style.id='bl-pugs-logo-override';
      style.textContent='\n#body_home a.franchise_0010:before{background-image:url("'+PUGS_LOGO+'") !important;background-size:contain !important;background-repeat:no-repeat !important;background-position:center !important;}\n';
      document.head.appendChild(style);
    }
  }

  function watch(){
    patchNav();
    patchDashboardLinks();
    patchPugsLogo();
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      patchNav();
      patchDashboardLinks();
      patchPugsLogo();
      if(tries>=40) clearInterval(timer);
    },300);
  }

  var s=document.createElement('script');
  s.src=CORE;
  s.defer=true;
  s.onload=watch;
  s.onerror=watch;
  document.head.appendChild(s);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();