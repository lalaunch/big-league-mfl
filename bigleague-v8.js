/* The Big League — hosted loader + nav fix */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var CORE='https://lalaunch.github.io/big-league-mfl/bigleague-core-v10.js?v=1';

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function patchNav(){
    var nav=document.querySelector('.bl-mainnav');
    if(!nav) return false;

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
    patchNav();
    patchDashboardLinks();
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      patchNav();
      patchDashboardLinks();
      if(tries>=30) clearInterval(timer);
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