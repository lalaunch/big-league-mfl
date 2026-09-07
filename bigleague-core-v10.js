/* The Big League — Sports Network V10
   MFL stays the league engine. GitHub controls presentation and layout.
*/
(function(){
  'use strict';

  var YEAR=2026;
  var LEAGUE='73086';
  var BASE='https://www42.myfantasyleague.com/'+YEAR;

  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}
  function esc(v){return clean(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
  function teamKey(v){return clean(v).toLowerCase().replace(/[^a-z0-9]/g,'');}

  function loadStyles(){
    [
      ['blx-dashboard','https://lalaunch.github.io/big-league-mfl/dashboard-v8.css?v=5'],
      ['blsn-network','https://lalaunch.github.io/big-league-mfl/sports-network.css?v=5']
    ].forEach(function(x){
      if(document.querySelector('link[data-'+x[0]+']')) return;
      var l=document.createElement('link');
      l.rel='stylesheet';
      l.href=x[1];
      l.setAttribute('data-'+x[0],'1');
      document.head.appendChild(l);
    });
  }

  function upgradeNav(){
    var nav=document.querySelector('.bl-mainnav');
    if(!nav || nav.getAttribute('data-blsn-upgraded')==='1') return;

    var tabLinks=Array.from(document.querySelectorAll('#homepagetabs a'));
    function hrefFor(rx,fallback){
      var a=tabLinks.find(function(x){return rx.test(clean(x.textContent));});
      return a&&a.href?a.href:fallback;
    }

    var extras=[
      {label:'Messages',href:BASE+'/mb/board_show.pl?bid=202673086'},
      {label:'History',href:hrefFor(/history/i,BASE+'/home/'+LEAGUE+'#3')},
      {label:'Rules',href:hrefFor(/league rules/i,BASE+'/home/'+LEAGUE+'#1')}
    ];

    var existing=Array.from(nav.querySelectorAll('a')).map(function(a){return clean(a.textContent).toLowerCase();});
    extras.forEach(function(x){
      if(existing.indexOf(x.label.toLowerCase())>=0) return;
      var a=document.createElement('a');
      a.href=x.href;
      a.textContent=x.label;
      nav.appendChild(a);
    });

    nav.setAttribute('data-blsn-upgraded','1');
    var tabs=document.querySelector('.main_tabmenu');
    if(tabs) tabs.style.setProperty('display','none','important');
  }

  function getLatestTransaction(){
    var table=document.querySelector('#transactions');
    if(!table) return null;
    var direct=table.querySelector('td.transaction');
    if(direct){
      var row=direct.closest('tr');
      var team=row && (row.querySelector('td.franchisename,td.franchise') || row.querySelector('a[class*="franchise_"]'));
      var date=row && row.querySelector('td.timestamp,td.date');
      return {team:clean(team&&team.textContent),text:clean(direct.textContent),date:clean(date&&date.textContent)};
    }
    var rows=Array.from(table.querySelectorAll('tr'));
    for(var i=0;i<rows.length;i++){
      var text=clean(rows[i].textContent);
      if(!/\b(acquired|dropped|traded|claimed|waived|activated|signed|released)\b|gave up|picked up/i.test(text)) continue;
      var cells=Array.from(rows[i].querySelectorAll('td'));
      var tx=cells.find(function(c){return /\b(acquired|dropped|traded|claimed|waived|activated|signed|released)\b|gave up|picked up/i.test(clean(c.textContent));});
      var teamEl=rows[i].querySelector('a[class*="franchise_"]')||rows[i].querySelector('td.franchisename,td.franchise');
      var dateEl=rows[i].querySelector('td.timestamp,td.date');
      return {team:clean(teamEl&&teamEl.textContent),text:clean(tx?tx.textContent:text),date:clean(dateEl&&dateEl.textContent)};
    }
    return null;
  }

  function getTopic(){
    var links=Array.from(document.querySelectorAll('#message_board_summary a'));
    for(var i=0;i<links.length;i++){
      var t=clean(links[i].textContent);
      if(t && !/view message board/i.test(t)) return t;
    }
    return 'mKp looking to trade 2nd round for cash';
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
    if(!tx) return '<div class="blx-main" data-blx-latest-main>See Recent Transactions.</div><div class="blx-sub" data-blx-latest-sub>Waiting for MFL transaction data.</div>';
    return '<div class="blx-main" data-blx-latest-main>'+esc((tx.team?tx.team+' — ':'')+tx.text)+'</div><div class="blx-sub" data-blx-latest-sub>'+esc(tx.date||'Latest MFL transaction')+'</div>';
  }

  /* ---------------- Championship count: the league's plaques, 1990-2025 (2026-09-07) ----------------
     Source of record: the three "BIG LEAGUE RECORD" plaque files Dan keeps (champion "over" runner-up,
     every season since 1990). MFL's League Champions page (options O=194) only starts in 2004 and
     disagrees with the plaques in three seasons (2011, 2020, 2022 runner-up) and is blank for 2021, so
     it is used only to APPEND seasons newer than the last plaque row. To add a season, add a row here. */
  var FINALS=[
    [1990,'Hartland Hitmen','L.A. Launch'],
    [1991,'L.A. Launch','Terminators'],
    [1992,'Kansas City Killers','L.A. Launch'],
    [1993,'Orlando Vipers','San Francisco Freeze'],
    [1994,'Terminators','Orlando Vipers'],
    [1995,'Kansas City Killers','Hartland Hitmen'],
    [1996,'Orlando Vipers','Kansas City Killers'],
    [1997,'Reno Gamblers','L.A. Launch'],
    [1998,'Reno Gamblers','L.A. Launch'],
    [1999,'Hartland Hitmen','Kansas City Killers'],
    [2000,'Hartland Hitmen','Kansas City Killers'],
    [2001,'Hartland Hitmen','Cincinnati Stormtroopers'],
    [2002,'Orlando Vipers','L.A. Launch'],
    [2003,'Orlando Vipers','L.A. Launch'],
    [2004,'L.A. Launch','Reno Gamblers'],
    [2005,'L.A. Launch','Jersey Jackhammers'],
    [2006,'Orange County Mad Hatters','Brooklyn Brawlers'],
    [2007,'Reno Gamblers','Kansas City Killers'],
    [2008,'L.A. Launch','Cincinnati Stormtroopers'],
    [2009,'Reno Gamblers','Orlando Vipers'],
    [2010,'Orlando Vipers','Brooklyn Brawlers'],
    [2011,'Kansas City Killers','L.A. Launch'],
    [2012,'Cincinnati Stormtroopers','Kansas City Killers'],
    [2013,'Sussex Stonemen','Reno Gamblers'],
    [2014,'L.A. Launch','Tampa Bay Roxx Gang'],
    [2015,'Reno Gamblers','L.A. Launch'],
    [2016,'Kansas City Killers','Tampa Bay Roxx Gang'],
    [2017,'L.A. Launch','Reno Gamblers'],
    [2018,'Jersey Jackhammers','Milwaukee Killer Pugs'],
    [2019,'Reno Gamblers','Bristol Steampunks'],
    [2020,'L.A. Launch','Reno Gamblers'],
    [2021,'Tampa Bay Roxx Gang','Reno Gamblers'],
    [2022,'Reno Gamblers','L.A. Launch'],
    [2023,'Brooklyn Brawlers','Bristol Steampunks'],
    [2024,'Tampa Bay Roxx Gang','Bristol Steampunks'],
    [2025,'Milwaukee Killer Pugs','L.A. Launch']
  ];
  /* Top Gun Trophy, from MFL League Awards (options O=202), 2000-2025, as listed by Dan 2026-09-07.
     MFL is the only record of this award. Seasons newer than the last row are appended from the awards page. */
  var TOPGUN=[
    [2000,'L.A. Launch'],[2001,'Cincinnati Stormtroopers'],[2002,'Orlando Vipers'],[2003,'Orlando Vipers'],
    [2004,'L.A. Launch'],[2005,'L.A. Launch'],[2006,'Tampa Bay Roxx Gang'],[2007,'Tampa Bay Roxx Gang'],
    [2008,'L.A. Launch'],[2009,'Tampa Bay Roxx Gang'],[2010,'Orlando Vipers'],[2011,'L.A. Launch'],
    [2012,'L.A. Launch'],[2013,'L.A. Launch'],[2014,'Orlando Vipers'],[2015,'Phelps Phantoms'],
    [2016,'Brooklyn Brawlers'],[2017,'Jersey Jackhammers'],[2018,'Orlando Vipers'],[2019,'Phelps Phantoms'],
    [2020,'Reno Gamblers'],[2021,'Brooklyn Brawlers'],[2022,'Reno Gamblers'],[2023,'Brooklyn Brawlers'],
    [2024,'Reno Gamblers'],[2025,'L.A. Launch']
  ];
  var CANON=['L.A. Launch','Reno Gamblers','Orlando Vipers','Hartland Hitmen','Kansas City Killers','Tampa Bay Roxx Gang','Terminators','Orange County Mad Hatters','Cincinnati Stormtroopers','Sussex Stonemen','Jersey Jackhammers','Brooklyn Brawlers','Milwaukee Killer Pugs','Bristol Steampunks','Winnebago Campers','Delafield Draft Attics','San Francisco Freeze','Phelps Phantoms'];

  function canonName(raw){
    var k=teamKey(raw);
    for(var i=0;i<CANON.length;i++){
      var ck=teamKey(CANON[i]);
      if(ck===k) return CANON[i];
      if((ck.indexOf(k)===0&&ck.length-k.length<=2)||(k.indexOf(ck)===0&&k.length-ck.length<=2)) return CANON[i]; /* "MILWAUKEE KILLER PUG" as typed in MFL */
    }
    return clean(raw).toLowerCase().replace(/\b\w/g,function(c){return c.toUpperCase();});
  }

  /* Seasons newer than the tables, read from MFL: League Champions (O=194) for finals, League Awards (O=202)
     for Top Gun. Same-origin fetches; either one failing just leaves the tables as rendered. */
  function loadNewerSeasons(cb){
    var lastF=FINALS[FINALS.length-1][0],lastT=TOPGUN[TOPGUN.length-1][0],done=false,pending=2,finals=[],topgun=[];
    function finish(){if(done)return;done=true;cb({finals:finals,topgun:topgun});}
    function one(){if(--pending<=0)finish();}
    setTimeout(finish,6000);
    try{
      fetch(BASE+'/options?L='+LEAGUE+'&O=194',{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        var year=null,by={};
        Array.from(doc.querySelectorAll('table.report tr')).forEach(function(tr){
          var th=tr.querySelector('th[colspan]');
          if(th&&/^\d{4}$/.test(clean(th.textContent))){year=parseInt(clean(th.textContent),10);return;}
          var rank=tr.querySelector('td.rank'),name=tr.querySelector('td.franchisename');
          if(year&&year>lastF&&rank&&name){by[year]=by[year]||{};by[year][parseInt(rank.textContent,10)]=canonName(name.textContent);}
        });
        finals=Object.keys(by).filter(function(y){return by[y][1];}).sort().map(function(y){return [parseInt(y,10),by[y][1],by[y][2]||''];});
        one();
      }).catch(one);
      fetch(BASE+'/options?L='+LEAGUE+'&O=202',{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        Array.from(doc.querySelectorAll('table.report tr')).forEach(function(tr){
          var y=tr.querySelector('td.year'),a=tr.querySelector('td.awardtitle'),n=tr.querySelector('td.franchisename');
          if(!y||!a||!n) return;
          var yr=parseInt(clean(y.textContent),10);
          if(yr>lastT&&/top gun/i.test(a.textContent)) topgun.push([yr,canonName(n.textContent)]);
        });
        topgun.sort(function(p,q){return p[0]-q[0];});
        one();
      }).catch(one);
    }catch(e){finish();}
  }

  function ringRace(extra){
    extra=extra||{};
    var rows=FINALS.concat(extra.finals||[]),guns=TOPGUN.concat(extra.topgun||[]);
    var teams={};
    /* One franchise under two names (Dan, 2026-09-07): Hartland Hitmen became Sussex Stonemen. Counted together. */
    var SAME={'Hartland Hitmen':'Hartland Hitmen / Sussex Stonemen','Sussex Stonemen':'Hartland Hitmen / Sussex Stonemen'};
    function T(n){n=SAME[n]||n;return teams[n]||(teams[n]={name:n,titles:0,runners:0,topgun:0,titleYears:[],runnerYears:[],topgunYears:[]});}
    rows.forEach(function(r){
      T(r[1]).titles++;T(r[1]).titleYears.push(r[0]);
      if(r[2]){T(r[2]).runners++;T(r[2]).runnerYears.push(r[0]);}
    });
    guns.forEach(function(g){T(g[1]).topgun++;T(g[1]).topgunYears.push(g[0]);});
    var list=Object.keys(teams).map(function(k){return teams[k];});
    /* Top Gun is display only (Dan, 2026-09-07): rank on titles, then runner-ups. */
    list.sort(function(a,b){return b.titles-a.titles||b.runners-a.runners||a.name.localeCompare(b.name);});
    var rank=0;
    function same(a,b){return a.titles===b.titles&&a.runners===b.runners;}
    list.forEach(function(t,i){
      if(i===0||!same(t,list[i-1])) rank=i+1;
      t.rank=rank;
      t.tie=list.some(function(o){return o!==t&&same(o,t);});
    });
    return {list:list,max:Math.max(1,list[0].titles),seasons:rows.length,first:rows[0][0],last:rows[rows.length-1][0],champs:list.filter(function(t){return t.titles>0;}).length,gunFirst:guns[0][0],gunLast:guns[guns.length-1][0]};
  }

  function ringCards(data){
    var logos=getLogoMap();
    return data.list.map(function(t){
      var logo=logos[teamKey(t.name)];
      var crest=logo?'<img class="blx-ring-crest" src="'+esc(logo)+'" alt="" aria-hidden="true">':'<span class="blx-ring-mono">'+esc((t.name.match(/\b[A-Za-z]/g)||[t.name.charAt(0)]).slice(0,2).join('').toUpperCase())+'</span>';
      var years=t.titleYears.slice().sort().map(function(y){return '<span>'+y+'</span>';}).join('');
      var tier=t.rank===1?'gold':t.rank===2?'silver':t.rank===3?'bronze':'';
      var bar=Math.round(100*t.titles/data.max);
      return '<div class="blx-ring-card'+(tier?' blx-tier-'+tier:'')+(t.titles===0?' blx-ring-noring':'')+'" style="--bar:'+bar+'%">'+
        '<span class="blx-ring-rank">'+(t.tie?'T-':'')+t.rank+'</span>'+crest+
        '<div class="blx-ring-body"><div class="blx-ring-name">'+esc(t.name)+'</div>'+(years?'<div class="blx-ring-years">'+years+'</div>':'')+'</div>'+
        '<div class="blx-ring-stats">'+
          '<div class="blx-ring-titles" title="Championships: '+esc(t.titleYears.join(', ')||'none')+'"><b>'+t.titles+'</b><small>'+(t.titles===1?'title':'titles')+'</small></div>'+
          '<div class="blx-ring-runner" title="Runner-up: '+esc(t.runnerYears.join(', ')||'none')+'"><b>'+t.runners+'</b><small>runner-up</small></div>'+
          '<div class="blx-ring-gun" title="Top Gun Trophy: '+esc(t.topgunYears.join(', ')||'none')+'"><b>'+t.topgun+'</b><small>top gun</small></div>'+
        '</div>'+
        '<i class="blx-ring-bar"></i></div>';
    }).join('');
  }

  function ringNote(data){
    return data.seasons+' completed seasons \u2022 '+data.champs+' championship franchises \u2022 champions and runners-up from the league plaques, '+data.first+'-'+data.last+' \u2022 Top Gun Trophy from MFL league awards, '+data.gunFirst+'-'+data.gunLast;
  }

  function upgradeRingRace(){
    var box=document.querySelector('.blx-count-feature .blx-trophies');
    if(!box||box.getAttribute('data-blsn-live')==='1') return;
    box.setAttribute('data-blsn-live','1');
    loadNewerSeasons(function(extra){
      if(!extra.finals.length&&!extra.topgun.length) return; /* the table render already stands */
      var data=ringRace(extra);
      box.innerHTML=ringCards(data);
      var note=box.parentNode.querySelector('.blx-note');
      if(note) note.textContent=ringNote(data);
    });
  }

  function trophyRows(){
    return ringCards(ringRace(null));
  }

  function getLogoMap(){
    var map={};
    Array.from(document.querySelectorAll('#standings tr')).forEach(function(row){
      var team=row.querySelector('a[class*="franchise_"]');
      var img=row.querySelector('img');
      if(team&&img&&img.src) map[teamKey(team.textContent)]=img.src;
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
        '<div class="blx-hof-champ">'+esc(x.champ)+'</div><div class="blx-hof-label">WORLD CHAMPION</div><div class="blx-hof-over">over</div><div class="blx-hof-runner">'+esc(x.runner)+'</div></article>';
    }).join('');
  }

  function buildLowerDashboard(){
    if(document.querySelector('.blx-dashboard')) return true;
    var c4=document.querySelector('#homepagecolumn4');
    if(!c4) return false;
    var anchor=c4.closest('table#homepagecolumns');
    if(!anchor||!anchor.parentNode) return false;
    var old=document.querySelector('.bl-lower-dashboard');
    if(old) old.remove();

    var game=getClosestMatchup();
    var gameText=game?game.a+' vs '+game.b+' — '+game.spread:'Week 1 • Five head-to-head matchups';
    var wrap=document.createElement('div');
    wrap.className='blx-dashboard';
    wrap.innerHTML=`
      <div class="blx-grid blx-three">
        <section class="blx-card"><div class="blx-title">Around the Big League</div><div class="blx-body">
          <div class="blx-news"><span class="blx-kicker">Defending Champs</span><div class="blx-main">Milwaukee Killer Pugs enter 2026 with the target on their backs.</div><div class="blx-sub">2025 Big League Champions</div></div>
          <div class="blx-news"><span class="blx-kicker">Game of the Week</span><div class="blx-main">${esc(gameText)}</div><div class="blx-sub">Closest current MFL matchup line</div></div>
          <div class="blx-news"><span class="blx-kicker">Trade Block</span><div class="blx-main">${esc(getTopic())}</div><div class="blx-sub">Latest message-board topic</div></div>
          <div class="blx-news"><span class="blx-kicker">Latest Move</span>${latestHtml()}</div>
        </div></section>
        <section class="blx-card"><div class="blx-title">Injury Report</div><div class="blx-body">
          <div class="blx-ir"><span class="blx-kicker">IR Money Back</span><div class="blx-main">$100k back for a $100k player • $200k back for a player at $200k or more.</div></div>
          <div class="blx-ir"><span class="blx-kicker">Required Process</span><div class="blx-main">Place the player on IR, drop him, then notify the commissioner for the cap adjustment.</div></div>
          <div class="blx-actions"><a class="blx-btn" href="${BASE}/injury?L=${LEAGUE}">NFL Injury Report</a><a class="blx-btn" href="${BASE}/home/${LEAGUE}#1">League Rules</a></div>
        </div></section>
        <section class="blx-card"><div class="blx-title">Big League Deadlines</div><div class="blx-body">
          <div class="blx-deadline"><span class="blx-kicker">Waivers</span><div class="blx-main">Wednesday for Thursday games • Saturday night for Sunday games.</div></div>
          <div class="blx-deadline"><span class="blx-kicker">Trade Deadline</span><div class="blx-main">Prior to kickoff of Week 11.</div></div>
          <div class="blx-deadline"><span class="blx-kicker">Postseason</span><div class="blx-main">Playoffs Week 15 • Championship Week 16.</div></div>
        </div></section>
      </div>
      <section class="blx-card blx-hof-feature"><div class="blx-hof-header"><div class="blx-hof-eyebrow">★ BIG LEAGUE LEGACY ★</div><div class="blx-hof-title">HALL OF CHAMPIONS</div><div class="blx-hof-subtitle">THE LAST 10 WORLD CHAMPIONS • 2016–2025</div></div><div class="blx-body"><div class="blx-hof-grid">${hallCards()}</div><div class="blx-hof-footer"><span>10 seasons. 10 stories. One Big League.</span><a class="blx-btn blx-hof-btn" href="${BASE}/home/${LEAGUE}#3">View Full Championship History</a></div></div></section>
      <section class="blx-card blx-count-feature"><div class="blx-title">Championship Count — 1990 to 2025</div><div class="blx-body"><div class="blx-trophies blx-ring-grid">${trophyRows()}</div><div class="blx-note">${ringNote(ringRace(null))}</div></div></section>`;
    anchor.insertAdjacentElement('afterend',wrap);
    return true;
  }

  function makeQuickLinks(){
    var div=document.createElement('aside');
    div.className='blsn-quicklinks';
    div.innerHTML='<div class="blsn-panel-title">League Quick Links</div><div class="blsn-quicklinks-body">'+
      '<a class="blsn-quicklink" href="'+BASE+'/options?L='+LEAGUE+'&O=02"><i class="fas fa-football-ball"></i><span>Submit Lineup</span></a>'+
      '<a class="blsn-quicklink" href="'+BASE+'/options?L='+LEAGUE+'&O=07"><i class="fas fa-users"></i><span>View Rosters</span></a>'+
      '<a class="blsn-quicklink" href="'+BASE+'/options?L='+LEAGUE+'&O=05"><i class="fas fa-exchange-alt"></i><span>Make a Trade</span></a>'+
      '<a class="blsn-quicklink" href="'+BASE+'/add_drop?L='+LEAGUE+'"><i class="fas fa-clipboard-list"></i><span>Waivers</span></a>'+
      '<a class="blsn-quicklink" href="'+BASE+'/ajax_ls?L='+LEAGUE+'"><i class="fas fa-trophy"></i><span>Scoreboard</span></a>'+
      '<a class="blsn-quicklink" href="'+BASE+'/mb/board_show.pl?bid=202673086'+'"><i class="fas fa-comment"></i><span>League Talk</span></a>'+
      '</div>';
    return div;
  }

  function makeDeadlines(){
    var div=document.createElement('aside');
    div.className='blsn-deadlines';
    div.innerHTML='<div class="blsn-panel-title">▣ Big League Deadlines</div><div class="blsn-deadline-body">'+
      '<div class="blsn-deadline-row"><div class="blsn-deadline-when">Wed</div><div class="blsn-deadline-date">Sep 9</div><div class="blsn-deadline-what">Waivers Process</div></div>'+
      '<div class="blsn-deadline-row"><div class="blsn-deadline-when">Thu</div><div class="blsn-deadline-date">Sep 10</div><div class="blsn-deadline-what">TNF Lineup Deadline</div></div>'+
      '<div class="blsn-deadline-row"><div class="blsn-deadline-when">Sun</div><div class="blsn-deadline-date">Sep 13</div><div class="blsn-deadline-what">All Lineups Due</div></div>'+
      '<div class="blsn-deadline-row"><div class="blsn-deadline-when">Week 11</div><div class="blsn-deadline-date">—</div><div class="blsn-deadline-what">Trade Deadline</div></div>'+
      '<a class="blsn-calendar-btn" href="'+BASE+'/options?L='+LEAGUE+'&O=123">View Full Calendar</a></div>';
    return div;
  }

  function findChampionAnchor(){
    var nodes=Array.from(document.querySelectorAll('#tabcontent0 div,#tabcontent0 table,#tabcontent0 td'));
    var matches=nodes.filter(function(el){
      if(el.closest('.blx-dashboard')) return false;
      var t=clean(el.textContent).toUpperCase();
      return t.indexOf('MILWAUKEE KILLER PUGS')>=0 && (t.indexOf('DEFENDING')>=0 || t.indexOf('36')>=0) && t.length<900;
    });
    if(!matches.length) return null;
    matches.sort(function(a,b){return clean(a.textContent).length-clean(b.textContent).length;});
    var el=matches[0];
    return el.closest('.mobile-wrap')||el;
  }

  function applySportsNetworkLayout(){
    if(document.body) document.body.classList.add('blsn-mode');
    if(document.querySelector('.blsn-hero-grid')) return true;

    var champ=findChampionAnchor();
    var matchup=document.querySelector('#next_weeks_fantasy_schedule');
    var standings=document.querySelector('#standings');
    var power=document.querySelector('#power_rank');
    var transactions=document.querySelector('#transactions');
    var dashboard=document.querySelector('.blx-dashboard');
    if(!matchup||!standings||!power||!transactions||!dashboard) return false;

    if(champ && champ.parentNode){
      var hero=document.createElement('div');
      hero.className='blsn-hero-grid';
      champ.parentNode.insertBefore(hero,champ);
      var main=document.createElement('div');
      main.className='blsn-hero-main';
      hero.appendChild(main);
      main.appendChild(champ);
      hero.appendChild(makeQuickLinks());
    }

    var matchWrap=matchup.closest('.mobile-wrap')||matchup;
    if(matchWrap.parentNode){
      var mr=document.createElement('div');
      mr.className='blsn-matchups-row';
      matchWrap.parentNode.insertBefore(mr,matchWrap);
      var mm=document.createElement('div');
      mm.className='blsn-matchups-main';
      mr.appendChild(mm);
      mm.appendChild(matchWrap);
      mr.appendChild(makeDeadlines());
      var quote=document.createElement('div');
      quote.className='blsn-playoff-quote';
      quote.textContent='“Every week feels like the playoffs.”';
      mr.insertAdjacentElement('afterend',quote);
    }

    var standWrap=standings.closest('.mobile-wrap')||standings;
    var powerWrap=power.closest('.mobile-wrap')||power;
    if(standWrap.parentNode){
      var sp=document.createElement('div');
      sp.className='blsn-standings-power';
      standWrap.parentNode.insertBefore(sp,standWrap);
      var sm=document.createElement('div');
      sm.className='blsn-standings-main';
      sp.appendChild(sm);
      sm.appendChild(standWrap);
      var pm=document.createElement('div');
      pm.className='blsn-power-main';
      sp.appendChild(pm);
      pm.appendChild(powerWrap);
    }

    var txWrap=transactions.closest('.mobile-wrap')||transactions;
    var around=dashboard.querySelector('.blx-grid.blx-three > .blx-card:nth-child(1)');
    var injury=dashboard.querySelector('.blx-grid.blx-three > .blx-card:nth-child(2)');
    var hall=dashboard.querySelector('.blx-hof-feature');
    if(txWrap&&around&&injury&&hall){
      var nr=document.createElement('div');
      nr.className='blsn-news-row';
      hall.parentNode.insertBefore(nr,hall);
      nr.appendChild(txWrap);
      nr.appendChild(around);
      nr.appendChild(injury);
      var oldGrid=dashboard.querySelector('.blx-grid.blx-three');
      if(oldGrid) oldGrid.remove();
    }

    return true;
  }

  function decorateHero(){
    var hero=document.querySelector('.blsn-hero-main');
    if(!hero || hero.getAttribute('data-blsn-decorated')==='1') return;
    if(hero.getAttribute('data-blsn-hero-v3')==='1') return; /* v8 loader owns the hero: no overlays, no duplicate quote or tagline */
    hero.setAttribute('data-blsn-decorated','1');
    hero.style.minHeight='318px';
    hero.style.background='radial-gradient(circle at 63% 45%,rgba(28,75,103,.28),transparent 34%),linear-gradient(115deg,#071821 0%,#06141d 48%,#02080d 100%)';
    hero.style.boxShadow='inset 0 0 0 1px rgba(31,145,193,.35),0 8px 24px rgba(0,0,0,.3)';

    var child=hero.firstElementChild;
    if(child){
      child.style.setProperty('min-height','318px','important');
      child.style.setProperty('height','318px','important');
    }

    var art=document.createElement('img');
    art.src='https://lalaunch.github.io/big-league-mfl/assets/hero-player.svg?v=2';
    art.alt='';
    art.setAttribute('aria-hidden','true');
    art.style.cssText='position:absolute;right:25%;bottom:-7%;width:34%;max-height:108%;object-fit:contain;opacity:.88;pointer-events:none;z-index:5;filter:drop-shadow(0 10px 12px rgba(0,0,0,.65));';
    hero.appendChild(art);

    var shade=document.createElement('div');
    shade.style.cssText='position:absolute;z-index:6;right:0;top:0;width:31%;height:100%;background:linear-gradient(90deg,rgba(2,8,13,.45),rgba(2,8,13,.93) 24%,rgba(3,12,18,.98));border-left:1px solid rgba(33,121,160,.28);pointer-events:none;';
    hero.appendChild(shade);

    var quote=document.createElement('div');
    quote.innerHTML='<div style="font-size:21px;line-height:1.16;font-weight:900;font-style:italic;color:#f4f8fb;text-shadow:0 3px 4px #000;">“SAME LEAGUE.<br>DIFFERENT YEAR.<br>BIGGER STORIES.”</div><div style="margin-top:8px;color:#57cfff;font-size:11px;font-weight:900;letter-spacing:.08em;">— THE BIG LEAGUE</div>';
    quote.style.cssText='position:absolute;z-index:8;right:2.3%;top:14%;width:26%;text-align:left;pointer-events:none;';
    hero.appendChild(quote);

    var go=document.createElement('div');
    go.textContent="IT'S GO TIME.";
    go.style.cssText='position:absolute;z-index:8;right:5.5%;bottom:10%;padding:0 8px 7px;color:#fff;font-size:34px;line-height:1;font-weight:900;font-style:italic;letter-spacing:-.025em;text-shadow:0 4px 5px #000;border-bottom:6px solid #e2b719;transform:rotate(-2deg);pointer-events:none;';
    hero.appendChild(go);
  }

  function decorateMatchups(){
    var span=document.querySelector('#next_weeks_fantasy_schedule caption span');
    if(span && span.getAttribute('data-blsn-caption')!=='1'){
      span.setAttribute('data-blsn-caption','1');
      span.textContent='';
      span.style.setProperty('display','flex','important');
      span.style.setProperty('align-items','center','important');
      span.style.setProperty('justify-content','space-between','important');
      span.style.setProperty('gap','12px','important');
      var left=document.createElement('strong');
      left.textContent='WEEK 1 MATCHUPS';
      left.style.cssText='font-size:22px;color:#fff;letter-spacing:.02em;';
      var right=document.createElement('strong');
      right.textContent='SEP 10 – SEP 14';
      right.style.cssText='font-size:13px;color:#eef8ff;letter-spacing:.04em;white-space:nowrap;';
      span.appendChild(left);
      span.appendChild(right);
    }
  }

  function swapStandings(){
    var rows=Array.from(document.querySelectorAll('#standings tbody > tr'));
    if(rows.length<14) return;
    rows.forEach(function(row,i){
      var left=i>=7;
      var pos=(i%7)+1;
      row.style.setProperty('grid-column',left?'1':'2','important');
      row.style.setProperty('grid-row',String(pos),'important');
    });
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
    loadStyles();
    upgradeNav();
    var tries=0;
    (function wait(){
      tries++;
      var built=buildLowerDashboard();
      if(built && applySportsNetworkLayout()){
        upgradeNav();
        decorateHero();
        decorateMatchups();
        swapStandings();
        [250,900,1800,3500].forEach(function(ms){setTimeout(refreshLatest,ms);});
        upgradeRingRace();
        [500,1500].forEach(function(ms){setTimeout(function(){decorateHero();decorateMatchups();swapStandings();upgradeNav();},ms);});
        return;
      }
      if(tries<40) setTimeout(wait,200);
    })();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();