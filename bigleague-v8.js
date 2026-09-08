/* The Big League — loader
   This is the one script the MFL header includes (as bigleague-v8.js?v=1; the
   filename is fixed by MFL, so it stays). It loads every hosted file with one
   version stamp, adds the theme class to body on every page, fixes nav links,
   and builds the home-page hero panel. Bump V to bust every cache at once. */
(function(){
  'use strict';

  var V='20260908l';
  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var BOARD=BASE+'/mb/board_show.pl?bid=202673086';
  var PUGS_LOGO=HOST+'assets/logos/milwaukee-killer-pugs.webp?v='+V;

  window.BL_VERSION=V;

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}

  function addStyle(id,file){
    if(document.getElementById(id)) return;
    var link=document.createElement('link');
    link.id=id;
    link.rel='stylesheet';
    link.href=HOST+file+'?v='+V;
    document.head.appendChild(link);
  }
  function addScript(id,file,onload){
    if(document.getElementById(id)) return;
    var s=document.createElement('script');
    s.id=id;
    s.src=HOST+file+'?v='+V;
    s.defer=true;
    if(onload){s.onload=onload;s.onerror=onload;}
    document.head.appendChild(s);
  }

  function themeEveryPage(){
    if(document.body && !document.body.classList.contains('blsn-mode')) document.body.classList.add('blsn-mode');
  }

  function patchHeroPanel(){
    var hero=document.querySelector('.blsn-hero-main');
    if(!hero) return false;
    if(hero.getAttribute('data-blsn-hero')==='1') return true;
    hero.setAttribute('data-blsn-hero','1');
    hero.innerHTML='';
    var shell=document.createElement('div');
    shell.className='blsn-hero-shell';
    shell.innerHTML=''+
      '<section class="blsn-champ-side">'+
        '<div class="blsn-champ-logo-wrap"><img class="blsn-champ-logo" src="'+PUGS_LOGO+'" alt="Milwaukee Killer Pugs"></div>'+
        '<div class="blsn-champ-copy">'+
          '<div class="blsn-champ-eyebrow">★ DEFENDING BIG LEAGUE CHAMPIONS ★</div>'+
          '<div class="blsn-champ-title">MILWAUKEE<br>KILLER PUGS</div>'+
          '<div class="blsn-champ-tagline">RAISE THE BANNER.<br>SET THE TARGET.</div>'+
          '<div class="blsn-champ-meta">2025 WORLD CHAMPIONS • DEFENDING THE CROWN IN 2026</div>'+
        '</div>'+
      '</section>'+
      '<section class="blsn-callout-side">'+
        '<div class="blsn-callout-quote">“SAME LEAGUE.<br>DIFFERENT YEAR.<br>BIGGER STORIES.”</div>'+
        '<div class="blsn-callout-by">— THE BIG LEAGUE</div>'+
        '<div class="blsn-callout-go">IT\'S<br>GO TIME.</div>'+
      '</section>';
    hero.appendChild(shell);
    return true;
  }

  function tabClick(a,tab){
    if(a.getAttribute('data-bl-tab-fix')==='1') return;
    a.setAttribute('data-bl-tab-fix','1');
    a.addEventListener('click',function(e){
      if(document.getElementById('tab'+tab) && typeof window.show_tab==='function'){
        e.preventDefault();
        window.show_tab(String(tab));
        try{history.replaceState(null,'','#'+tab);}catch(err){}
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
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
      messageLink.href=BOARD;
      messageLinks.slice(1).forEach(function(a){a.remove();});
      if(rulesLink && rulesLink.nextElementSibling!==messageLink) rulesLink.insertAdjacentElement('afterend',messageLink);
    }
    Array.from(nav.querySelectorAll('a')).forEach(function(a){
      var label=clean(a.textContent).toLowerCase();
      if(label==='history'){a.href=BASE+'/options?L='+LEAGUE+'&O=194';tabClick(a,3);}
      if(label==='rules'){a.href=BASE+'/options?L='+LEAGUE+'&O=09';tabClick(a,1);}
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

  function pass(){
    themeEveryPage();
    patchNav();
    patchDashboardLinks();
    patchHeroPanel();
  }

  function watch(){
    pass();
    var tries=0;
    var timer=setInterval(function(){pass();if(++tries>=50) clearInterval(timer);},300);
  }

  themeEveryPage();
  addStyle('bl-masthead-css','masthead.css');
  addStyle('bl-hero-css','hero.css');
  addStyle('bl-team-css','team.css');
  addScript('bl-team-logos-script','team-logos.js');
  addScript('bl-core-script','bigleague-core.js',watch);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();
