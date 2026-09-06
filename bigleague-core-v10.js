          <div class="blx-deadline"><span class="blx-kicker">Waivers</span><div class="blx-main">Wednesday for Thursday games • Saturday night for Sunday games.</div></div>
          <div class="blx-deadline"><span class="blx-kicker">Trade Deadline</span><div class="blx-main">Prior to kickoff of Week 11.</div></div>
          <div class="blx-deadline"><span class="blx-kicker">Postseason</span><div class="blx-main">Playoffs Week 15 • Championship Week 16.</div></div>
        </div></section>
      </div>
      <section class="blx-card blx-hof-feature"><div class="blx-hof-header"><div class="blx-hof-eyebrow">★ BIG LEAGUE LEGACY ★</div><div class="blx-hof-title">HALL OF CHAMPIONS</div><div class="blx-hof-subtitle">THE LAST 10 WORLD CHAMPIONS • 2016–2025</div></div><div class="blx-body"><div class="blx-hof-grid">${hallCards()}</div><div class="blx-hof-footer"><span>10 seasons. 10 stories. One Big League.</span><a class="blx-btn blx-hof-btn" href="${BASE}/home/${LEAGUE}#3">View Full Championship History</a></div></div></section>
      <section class="blx-card blx-count-feature"><div class="blx-title">Championship Count — 1990 to 2025</div><div class="blx-body"><div class="blx-trophies">${trophyRows()}</div><div class="blx-note">36 completed seasons • 13 championship franchises</div></div></section>`;
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
      '<a class="blsn-quicklink" href="'+BASE+'/options?L='+LEAGUE+'&O=17"><i class="fas fa-comment"></i><span>League Talk</span></a>'+
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