/* The Big League — hosted loader + nav + direct team crest pack */
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var CORE=HOST+'bigleague-core-v10.js?v=4';
  var MASTHEAD_CSS=HOST+'masthead-v16.css?v=3';
  var HERO_CSS=HOST+'hero-v2.css?v=17';
  var TEAM_LOGOS=HOST+'team-logos-v2.js?v=4';
  var PUGS_LOGO=HOST+'assets/logos/milwaukee-killer-pugs.webp?v=4';

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
    ['bl-hero-v1-css','bl-hero-v2-css'].forEach(function(id){
      var old=document.getElementById(id);
      if(old && id!=='bl-hero-v2-css') old.remove();
    });
    var current=document.getElementById('bl-hero-v2-css');
    if(current && current.href.indexOf('v=17')>=0) return;
    if(current) current.remove();
    var link=document.createElement('link');
    link.id='bl-hero-v2-css';
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

  function patchHeroPanel(){
    var hero=document.querySelector('.blsn-hero-main');
    if(!hero) return false;
    if(hero.getAttribute('data-blsn-hero-v3')==='1') return true;

    hero.setAttribute('data-blsn-hero-v3','1');
    hero.removeAttribute('data-blsn-decorated');
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
        '<div class="blsn-year-badge"><span>37</span><small>YEARS OF<br>BIG LEAGUE FOOTBALL</small></div>'+
        '<div class="blsn-callout-go">IT\'S GO TIME.</div>'+
      '</section>';
    hero.appendChild(shell);
    return true;
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
    patchHeroPanel();
    var tries=0;
    var timer=setInterval(function(){
      loadStyle();
      loadHeroStyle();
      loadTeamLogos();
      patchNav();
      patchDashboardLinks();
      patchHeroPanel();
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
