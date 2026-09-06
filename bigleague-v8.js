/* The Big League — hosted loader + nav/team-logo overrides */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var CORE='https://lalaunch.github.io/big-league-mfl/bigleague-core-v10.js?v=1';
  var LOGO_BASE='https://lalaunch.github.io/big-league-mfl/assets/logos/';

  var TEAM_LOGOS={
    '0001':LOGO_BASE+'tampa-bay-roxx-gang.png?v=1',
    '0002':LOGO_BASE+'la-launch.png?v=1',
    '0003':LOGO_BASE+'reno-gamblers.png?v=1',
    '0004':LOGO_BASE+'bristol-steampunks.png?v=1',
    '0005':LOGO_BASE+'delafield-draft-attics.png?v=1',
    '0006':LOGO_BASE+'kansas-city-killers.png?v=1',
    '0007':LOGO_BASE+'brooklyn-brawlers.png?v=1',
    '0008':LOGO_BASE+'winnebago-campers.png?v=1',
    '0009':LOGO_BASE+'jersey-jackhammers.png?v=1',
    '0010':LOGO_BASE+'milwaukee-killer-pugs.png?v=1'
  };

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

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

  function patchTeamLogos(){
    Object.keys(TEAM_LOGOS).forEach(function(id){
      var url=TEAM_LOGOS[id];
      var selectors=[
        'img[src*="franchise_logo'+id+'"]',
        'img[src*="franchise_icon'+id+'"]',
        'img[src*="_logo'+id+'"]',
        'img[src*="_icon'+id+'"]'
      ];

      document.querySelectorAll(selectors.join(',')).forEach(function(img){
        if(img.getAttribute('data-bl-team-logo')===id && img.src.indexOf('/assets/logos/')!==-1) return;
        img.src=url;
        img.setAttribute('data-bl-team-logo',id);
      });
    });

    var style=document.getElementById('bl-team-logo-overrides');
    if(!style){
      style=document.createElement('style');
      style.id='bl-team-logo-overrides';
      style.textContent=Object.keys(TEAM_LOGOS).map(function(id){
        return '#body_home a.franchise_'+id+':before{background-image:url("'+TEAM_LOGOS[id]+'") !important;background-size:contain !important;background-repeat:no-repeat !important;background-position:center !important;}';
      }).join('\n');
      document.head.appendChild(style);
    }
  }

  function watch(){
    patchNav();
    patchDashboardLinks();
    patchTeamLogos();
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      patchNav();
      patchDashboardLinks();
      patchTeamLogos();
      if(tries>=50) clearInterval(timer);
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