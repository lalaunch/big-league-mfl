/* The Big League — hosted loader + nav + direct team crest pack */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var CORE=HOST+'bigleague-core-v10.js?v=1';
  var MASTHEAD_CSS=HOST+'masthead-v16.css?v=2';
  var HERO_CSS=HOST+'hero-v1.css?v=1';
  var TEAM_LOGOS=HOST+'team-logos-v2.js?v=3';

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function loadStyle(){
    ['bl-masthead-v13-css','bl-masthead-v14-css','bl-masthead-v15-css'].forEach(function(id){
      var old=document.getElementById(id);
      if(old) old.remove();
    });
    if(!document.getElementById('bl-masthead-v16-css')){
      var link=document.createElement('link');
      link.id='bl-masthead-v16-css';
      link.rel='stylesheet';
      link.href=MASTHEAD_CSS;
      document.head.appendChild(link);
    }
  }

  function loadHeroStyle(){
    if(document.getElementById('bl-hero-v1-css')) return;
    var link=document.createElement('link');
    link.id='bl-hero-v1-css';
    link.rel='stylesheet';
    link.href=HERO_CSS;
    document.head.appendChild(link);
  }

  function loadTeamLogos(){
    if(document.getElementById('bl-team-logos-v2-script')) return;
    var s=document.createElement('script');
    s.id='bl-team-logos-v2-script';
    s.src=TEAM_LOGOS;
    s.defer=true;
    document.head.appendChild(s);
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

  function watch(){
    loadStyle();
    loadHeroStyle();
    loadTeamLogos();
    patchNav();
    patchDashboardLinks();
    var tries=0;
    var timer=setInterval(function(){
      loadStyle();
      loadHeroStyle();
      loadTeamLogos();
      patchNav();
      patchDashboardLinks();
      if(++tries>=50) clearInterval(timer);
    },300);
  }

  loadStyle();
  loadHeroStyle();
  loadTeamLogos();

  var s=document.createElement('script');
  s.src=CORE;
  s.defer=true;
  s.onload=watch;
  s.onerror=watch;
  document.head.appendChild(s);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();
