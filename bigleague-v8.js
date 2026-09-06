/* The Big League — hosted dashboard V8
   MFL remains the league engine. GitHub hosts presentation + enhancements.
*/
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}
  function esc(v){return clean(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
  function teamKey(v){return clean(v).toLowerCase().replace(/[^a-z0-9]/g,'');}

  function loadCss(){
    if(document.querySelector('link[data-blx-dashboard]')) return;
    var l=document.createElement('link');
    l.rel='stylesheet';
    l.href='https://lalaunch.github.io/big-league-mfl/dashboard-v8.css?v=2';
    l.setAttribute('data-blx-dashboard','1');
    document.head.appendChild(l);
  }

  function getLatestTransaction(){
    var table=document.querySelector('#transactions');
    if(!table) return null;

    var direct=table.querySelector('td.transaction');
    if(direct){
      var row=direct.closest('tr');
      var team=row && row.querySelector('td.franchisename,td.franchise,a[class*="franchise_"]');
      var date=row && row.querySelector('td.timestamp,td.date');
      return {
        team:clean(team && team.textContent),
        text:clean(direct.textContent),
        date:clean(date && date.textContent)
      };
    }

    var rows=Array.from(table.querySelectorAll('tr'));
    for(var i=0;i<rows.length;i++){
      var row=rows[i];
      var rowText=clean(row.textContent);
      if(!/\b(acquired|dropped|traded|claimed|waived|activated|signed|released)\b|gave up|picked up/i.test(rowText)) continue;

      var cells=Array.from(row.querySelectorAll('td'));
      var txCell=null;
      for(var c=0;c<cells.length;c++){
        if(/\b(acquired|dropped|traded|claimed|waived|activated|signed|released)\b|gave up|picked up/i.test(clean(cells[c].textContent))){
          txCell=cells[c];break;
        }
      }

      var teamEl=row.querySelector('a[class*="franchise_"]') || row.querySelector('td.franchisename,td.franchise');
      var team=clean(teamEl && teamEl.textContent);
      if(!team && txCell){
        var txIndex=cells.indexOf(txCell);
        if(txIndex>0) team=clean(cells[txIndex-1].textContent);
      }

      var dateEl=row.querySelector('td.timestamp,td.date');
      var date=clean(dateEl && dateEl.textContent);
      if(!date){
        for(var d=cells.length-1;d>=0;d--){
          var candidate=clean(cells[d].textContent);
          if(/2026|\b(?:ET|CT|MT|PT)\b|\b(?:a\.?m\.?|p\.?m\.?)\b/i.test(candidate)){date=candidate;break;}
        }
      }

      return {team:team,text:clean(txCell?txCell.textContent:rowText),date:date};
    }
    return null;
  }

  function getTopic(){
    var links=Array.from(document.querySelectorAll('#message_board_summary a'));
    for(var i=0;i<links.length;i++){
      var t=clean(links[i].textContent);
      if(t && !/view message board/i.test(t)) return t;
    }
    return '';
  }

  function getClosestMatchup(){
    var table=document.querySelector('#next_weeks_fantasy_schedule');
    if(!table) return null;
    var rows=Array.from(table.querySelectorAll('tbody>tr')).filter(function(r){return !r.classList.contains('reportfooter') && r.querySelector('a[class*="franchise_"]');});
    var best=null;
    for(var i=0;i+1<rows.length;i+=2){
      var a=rows[i].querySelector('a[class*="franchise_"]');
      var b=rows[i+1].querySelector('a[class*="franchise_"]');
      if(!a||!b) continue;
      var spread=clean(Array.from(rows[i].querySelectorAll('.points')).concat(Array.from(rows[i+1].querySelectorAll('.points'))).map(function(x){return x.textContent;}).join(' '));
      var val=999;
      if(/even/i.test(spread)) val=0;
      else {var m=spread.match(/[-+]?\d+(?:\.\d+)?/);if(m) val=Math.abs(parseFloat(m[0]));}
      if(!best||val<best.val) best={val:val,a:clean(a.textContent),b:clean(b.textContent),spread:spread||'Line pending'};
    }
    return best;
  }

  function latestHtml(){
    var tx=getLatestTransaction();
    if(!tx) return '<div class="blx-main" data-blx-latest-main>See Recent Transactions above.</div><div class="blx-sub" data-blx-latest-sub>Waiting for MFL transaction data.</div>';
    return '<div class="blx-main" data-blx-latest-main>'+esc((tx.team?tx.team+' — ':'')+tx.text)+'</div><div class="blx-sub" data-blx-latest-sub>'+esc(tx.date||'Latest MFL transaction')+'</div>';
  }

  function trophyRows(){
    var champs=[['L.A. Launch',7],['Reno Gamblers',7],['Orlando Vipers',5],['Hartland Hitmen',4],['Kansas City Killers',4],['Tampa Bay Roxx Gang',2],['Terminators',1],['Orange County Mad Hatters',1],['Cincinnati Stormtroopers',1],['Sussex Stonemen',1],['Jersey Jackhammers',1],['Brooklyn Brawlers',1],['Milwaukee Killer Pugs',1]];
    return champs.map(function(x){return '<div class="blx-trophy-row"><span class="blx-trophy-team">'+esc(x[0])+'</span><span class="blx-trophy-count">'+x[1]+'</span></div>';}).join('');
  }

  function getLogoMap(){
    var map={};
    Array.from(document.querySelectorAll('#standings tr')).forEach(function(row){
      var team=row.querySelector('a[class*="franchise_"]');
      var img=row.querySelector('img');
      if(team && img && img.src) map[teamKey(team.textContent)]=img.src;
    });
    return map;
  }

  function hallCards(){
    var logos=getLogoMap();
    var lastTen=[
      {year:2025,champ:'Milwaukee Killer Pugs',runner:'L.A. Launch'},
      {year:2024,champ:'Tampa Bay Roxx Gang',runner:'Bristol Steampunks'},
      {year:2023,champ:'Brooklyn Brawlers',runner:'Bristol Steampunks'},
      {year:2022,champ:'Reno Gamblers',runner:'L.A. Launch'},
      {year:2021,champ:'Tampa Bay Roxx Gang',runner:'Reno Gamblers'},
      {year:2020,champ:'L.A. Launch',runner:'Reno Gamblers'},
      {year:2019,champ:'Reno Gamblers',runner:'Bristol Steampunks'},
      {year:2018,champ:'Jersey Jackhammers',runner:'Milwaukee Killer Pugs'},
      {year:2017,champ:'L.A. Launch',runner:'Reno Gamblers'},
      {year:2016,champ:'Kansas City Killers',runner:'Tampa Bay Roxx Gang'}
    ];

    return lastTen.map(function(x,index){
      var logo=logos[teamKey(x.champ)]||'';
      return '<article class="blx-hof-card'+(index===0?' blx-hof-current':'')+'">'+
        '<div class="blx-hof-year">'+x.year+'</div>'+
        (logo?'<img class="blx-hof-logo" src="'+esc(logo)+'" alt="">':'<div class="blx-hof-logo blx-hof-logo-fallback">★</div>')+
        '<div class="blx-hof-champ">'+esc(x.champ)+'</div>'+
        '<div class="blx-hof-label">WORLD CHAMPION</div>'+
        '<div class="blx-hof-over">over</div>'+
        '<div class="blx-hof-runner">'+esc(x.runner)+'</div>'+
      '</article>';
    }).join('');
  }

  function build(){
    if(document.querySelector('.blx-dashboard')) return true;
    var c4=document.querySelector('#homepagecolumn4');
    if(!c4) return false;
    var anchor=c4.closest('table#homepagecolumns');
    if(!anchor||!anchor.parentNode) return false;

    var old=document.querySelector('.bl-lower-dashboard');
    if(old) old.remove();

    var game=getClosestMatchup();
    var topic=getTopic();
    var gameText=game?game.a+' vs '+game.b+' — '+game.spread:'Week 1 • Five head-to-head matchups';
    var topicText=topic||'No active trade-block post found.';

    var wrap=document.createElement('div');
    wrap.className='blx-dashboard';
    wrap.innerHTML=`
      <div class="blx-grid blx-three">
        <section class="blx-card">
          <div class="blx-title">Around the Big League</div>
          <div class="blx-body">
            <div class="blx-news"><span class="blx-kicker">Defending Champs</span><div class="blx-main">Milwaukee Killer Pugs enter 2026 with the target on their backs.</div><div class="blx-sub">2025 Big League Champions</div></div>
            <div class="blx-news"><span class="blx-kicker">Game of the Week</span><div class="blx-main">${esc(gameText)}</div><div class="blx-sub">Closest current MFL matchup line</div></div>
            <div class="blx-news"><span class="blx-kicker">Trade Block</span><div class="blx-main">${esc(topicText)}</div><div class="blx-sub">Latest message-board topic</div></div>
            <div class="blx-news"><span class="blx-kicker">Latest Move</span>${latestHtml()}</div>
          </div>
        </section>

        <section class="blx-card">
          <div class="blx-title">Injury Report</div>
          <div class="blx-body">
            <div class="blx-ir"><span class="blx-kicker">IR Money Back</span><div class="blx-main">$100k back for a $100k player • $200k back for a player at $200k or more.</div></div>
            <div class="blx-ir"><span class="blx-kicker">Required Process</span><div class="blx-main">Place the player on IR, drop him, then notify the commissioner for the cap adjustment.</div></div>
            <div class="blx-actions"><a class="blx-btn" href="${BASE}/injury?L=${LEAGUE}">NFL Injury Report</a><a class="blx-btn" href="${BASE}/home/${LEAGUE}#1">League Rules</a></div>
          </div>
        </section>

        <section class="blx-card">
          <div class="blx-title">Big League Deadlines</div>
          <div class="blx-body">
            <div class="blx-deadline"><span class="blx-kicker">Waivers</span><div class="blx-main">Wednesday for Thursday games • Saturday night for Sunday games.</div></div>
            <div class="blx-deadline"><span class="blx-kicker">Trade Deadline</span><div class="blx-main">Prior to kickoff of Week 11.</div></div>
            <div class="blx-deadline"><span class="blx-kicker">Postseason</span><div class="blx-main">Playoffs Week 15 • Championship Week 16.</div></div>
            <div class="blx-actions"><a class="blx-btn" href="${BASE}/options?L=${LEAGUE}&O=123">League Calendar</a></div>
          </div>
        </section>
      </div>

      <section class="blx-card blx-hof-feature">
        <div class="blx-hof-header">
          <div class="blx-hof-eyebrow">★ BIG LEAGUE LEGACY ★</div>
          <div class="blx-hof-title">HALL OF CHAMPIONS</div>
          <div class="blx-hof-subtitle">THE LAST 10 WORLD CHAMPIONS • 2016–2025</div>
        </div>
        <div class="blx-body">
          <div class="blx-hof-grid">${hallCards()}</div>
          <div class="blx-hof-footer"><span>10 seasons. 10 stories. One Big League.</span><a class="blx-btn blx-hof-btn" href="${BASE}/home/${LEAGUE}#3">View Full Championship History</a></div>
        </div>
      </section>

      <section class="blx-card blx-count-feature">
        <div class="blx-title">Championship Count — 1990 to 2025</div>
        <div class="blx-body"><div class="blx-trophies">${trophyRows()}</div><div class="blx-note">36 completed seasons • 13 championship franchises</div></div>
      </section>`;

    anchor.insertAdjacentElement('afterend',wrap);
    return true;
  }

  function refreshLatest(){
    var main=document.querySelector('[data-blx-latest-main]');
    var sub=document.querySelector('[data-blx-latest-sub]');
    if(!main||!sub) return;
    var tx=getLatestTransaction();
    if(!tx) return;
    main.textContent=(tx.team?tx.team+' — ':'')+tx.text;
    sub.textContent=tx.date||'Latest MFL transaction';
  }

  function boot(){
    loadCss();
    var tries=0;
    (function wait(){
      tries++;
      if(build()||tries>=30){
        [250,750,1500,3000,5000].forEach(function(ms){setTimeout(refreshLatest,ms);});
        var table=document.querySelector('#transactions');
        if(table && window.MutationObserver){new MutationObserver(refreshLatest).observe(table,{childList:true,subtree:true,characterData:true});}
        return;
      }
      setTimeout(wait,200);
    })();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
