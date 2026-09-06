/* The Big League — hosted loader + nav + complete team crest pack */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var CORE=HOST+'bigleague-core-v10.js?v=1';
  var PUGS_LOGO=HOST+'assets/killer-pugs-official.webp?v=2';
  var MASTHEAD_CSS=HOST+'masthead-v12.css?v=1';

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function loadMastheadCss(){
    if(document.getElementById('bl-masthead-v12-css')) return;
    var link=document.createElement('link');
    link.id='bl-masthead-v12-css';
    link.rel='stylesheet';
    link.href=MASTHEAD_CSS;
    document.head.appendChild(link);
  }

  function patchNav(){
    var nav=document.querySelector('.bl-mainnav');
    if(!nav) return false;

    var links=Array.from(nav.querySelectorAll('a'));
    var rulesLink=links.find(function(a){return clean(a.textContent).toLowerCase()==='rules';});
    var messageLinks=links.filter(function(a){return /^(messages|message board)$/i.test(clean(a.textContent));});

    if(messageLinks.length){
      var messageLink=messageLinks[0];
      messageLink.textContent='MESSAGE BOARD';
      messageLink.href=BASE+'/options?L='+LEAGUE+'&O=17';
      messageLinks.slice(1).forEach(function(a){a.remove();});
      if(rulesLink && rulesLink.nextElementSibling!==messageLink){
        rulesLink.insertAdjacentElement('afterend',messageLink);
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
      'img[src*="_logo0010"]',
      'img[src*="_icon0010"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function(img){
      if(img.getAttribute('data-bl-pugs-logo')==='1') return;
      img.src=PUGS_LOGO;
      img.removeAttribute('srcset');
      img.setAttribute('data-bl-pugs-logo','1');
    });
  }

  function loadTeamLogos(){
    if(window.__BL_TEAM_LOGOS_LOADING) return;
    window.__BL_TEAM_LOGOS_LOADING=true;
    window.BL_TEAM_SPRITE='';

    var urls=[];
    for(var i=1;i<=8;i++) urls.push(HOST+'logo-sprite-part-'+i+'.js?v=1');
    urls.push(HOST+'team-logos-v1.js?v=1');

    function next(index){
      if(index>=urls.length) return;
      var x=document.createElement('script');
      x.src=urls[index];
      x.defer=true;
      x.onload=function(){next(index+1);};
      x.onerror=function(){next(index+1);};
      document.head.appendChild(x);
    }
    next(0);
  }

  function watch(){
    loadMastheadCss();
    patchNav();
    patchDashboardLinks();
    patchPugsLogo();
    loadTeamLogos();
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      loadMastheadCss();
      patchNav();
      patchDashboardLinks();
      patchPugsLogo();
      if(tries>=50) clearInterval(timer);
    },300);
  }

  loadMastheadCss();

  var s=document.createElement('script');
  s.src=CORE;
  s.defer=true;
  s.onload=watch;
  s.onerror=watch;
  document.head.appendChild(s);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();
