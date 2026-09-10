/* The Big League — loader
   This is the one script the MFL header includes (as bigleague-v8.js?v=1; the
   filename is fixed by MFL, so it stays). It loads every hosted file with one
   version stamp, adds the theme class to body on every page, fixes nav links,
   adds the Big League browser icon, and builds the home-page hero panel.
   Bump V to bust every cache at once. */
(function(){
  'use strict';

  var V='20260910e';
  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;
  var HOST='https://lalaunch.github.io/big-league-mfl/';
  var BOARD=BASE+'/mb/board_show.pl?bid=202673086';
  var PUGS_LOGO=HOST+'assets/logos/milwaukee-killer-pugs.webp?v='+V;
  var FAVICON='data:image/png;base64,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';

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

  function patchFavicon(){
    if(!document.head) return;
    Array.from(document.querySelectorAll('link[rel~="icon"],link[rel="shortcut icon"]')).forEach(function(n){
      if(n.id!=='bl-site-favicon' && n.id!=='bl-site-shortcut-icon') n.remove();
    });
    var icon=document.getElementById('bl-site-favicon');
    if(!icon){
      icon=document.createElement('link');
      icon.id='bl-site-favicon';
      icon.rel='icon';
      icon.type='image/png';
      icon.sizes='64x64';
      document.head.appendChild(icon);
    }
    icon.href=FAVICON;

    var shortcut=document.getElementById('bl-site-shortcut-icon');
    if(!shortcut){
      shortcut=document.createElement('link');
      shortcut.id='bl-site-shortcut-icon';
      shortcut.rel='shortcut icon';
      shortcut.type='image/png';
      document.head.appendChild(shortcut);
    }
    shortcut.href=FAVICON;

    var apple=document.getElementById('bl-site-apple-icon');
    if(!apple){
      apple=document.createElement('link');
      apple.id='bl-site-apple-icon';
      apple.rel='apple-touch-icon';
      document.head.appendChild(apple);
    }
    apple.href=FAVICON;
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
        '<div class="blsn-callout-clock" aria-live="off"><span class="blsn-clock-label">KICKOFF IN</span><span class="blsn-clock-digits"></span></div>'+
      '</section>';
    hero.appendChild(shell);
    startClock();
    return true;
  }

  /* ---- kickoff clock (2026-09-08) ----
     Lives in the photo callout, ticks once a second, no page refresh. Before the
     season opener it counts to that instant; after it, to the next Sunday noon CT
     (the fantasy slate). Sunday noon to midnight CT reads GAME DAY. Off after the
     regular season ends. Times are built in America/Chicago via Intl so DST is
     handled; the opener is a fixed UTC instant. */
  var KICKOFF_UTC=Date.UTC(2026,8,10,0,20,0); /* Wed 2026-09-09 8:20 PM ET = 7:20 PM CT: Seahawks vs Patriots, per NFL.com */
  var SEASON_END_UTC=Date.UTC(2027,0,12,6,0,0); /* stop after the regular season's last Monday night */
  function ctParts(ms){
    var p={};
    new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour12:false,weekday:'short',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'})
      .formatToParts(new Date(ms)).forEach(function(x){p[x.type]=x.value;});
    p.hour=+p.hour%24; p.day=+p.day; p.month=+p.month; p.year=+p.year;
    return p;
  }
  function ctTimeUtc(ms,h,m){
    /* the UTC instant of h:m CT on the CT calendar day containing ms */
    var p=ctParts(ms), guess=Date.UTC(p.year,p.month-1,p.day,h+5,m||0,0); /* +5 = CDT */
    var got=ctParts(guess); return guess+((h-got.hour)*60-(+got.minute-(m||0)))*60000; /* shift if that day is on CST */
  }
  /* weekly kickoff slots, CT: [weekday, hour, minute, window hours, label] */
  var SLOTS=[['Thu',19,15,4,'THURSDAY KICKOFF IN'],['Sun',12,0,12,'SUNDAY KICKOFF IN'],['Mon',19,15,4,'MONDAY KICKOFF IN']];
  var SLOT_OVERRIDES={'2026-9-10':[19,35]}; /* Rams at 49ers in Melbourne, 8:35 PM ET */
  function nextTarget(now){
    if(now<KICKOFF_UTC) return {label:'KICKOFF IN',at:KICKOFF_UTC};
    if(now>SEASON_END_UTC) return null;
    for(var d=0;d<8;d++){
      var day=now+d*86400000, p=ctParts(day);
      for(var k=0;k<SLOTS.length;k++){
        var sl=SLOTS[k]; if(p.weekday!==sl[0]) continue;
        var ov=SLOT_OVERRIDES[p.year+'-'+p.month+'-'+p.day], h=ov?ov[0]:sl[1], m=ov?ov[1]:sl[2];
        var at=ctTimeUtc(day,h,m), end=at+sl[3]*3600000;
        if(now>=at && now<end) return {label:'GAME DAY',at:null};
        if(at>now) return {label:sl[4],at:at};
      }
    }
    return null;
  }
  function pad(n){return (n<10?'0':'')+n;}
  function tickClock(){
    var el=document.querySelector('.blsn-callout-clock'); if(!el) return;
    var t=nextTarget(Date.now());
    if(!t){el.style.display='none';return;}
    el.style.display='';
    el.querySelector('.blsn-clock-label').textContent=t.label;
    var dig=el.querySelector('.blsn-clock-digits');
    if(!t.at){dig.innerHTML='<b>GO TIME</b>';return;}
    var s=Math.max(0,Math.floor((t.at-Date.now())/1000)), dd=Math.floor(s/86400), hh=Math.floor(s%86400/3600), mm=Math.floor(s%3600/60), ss=s%60;
    dig.innerHTML=(dd>0?'<b>'+dd+'</b><i>d</i> ':'')+'<b>'+pad(hh)+'</b><i>:</i><b>'+pad(mm)+'</b><i>:</i><b>'+pad(ss)+'</b>';
  }
  function startClock(){
    if(window.__blClock) return;
    window.__blClock=setInterval(tickClock,1000);
    tickClock();
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
    patchFavicon();
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

  patchFavicon();
  themeEveryPage();
  addStyle('bl-masthead-css','masthead.css');
  addStyle('bl-hero-css','hero.css');
  addStyle('bl-team-css','team.css');
  if(location.pathname.indexOf('/ajax_ls')>=0) addStyle('bl-live-css','live.css'); /* live scoring page only; body may not exist yet when this runs */
  addScript('bl-team-logos-script','team-logos.js');
  addScript('bl-core-script','bigleague-core.js',watch);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch);
  else watch();
})();
