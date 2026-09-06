/* The Big League — hosted UI layer
   MFL stays the league engine. GitHub hosts the presentation layer.
*/

(function () {
  'use strict';

  document.documentElement.classList.add('big-league-hosted');

  var YEAR = 2026;
  var LEAGUE = '73086';
  var BASE = 'https://www42.myfantasyleague.com/' + YEAR;

  function addDashboardStyles() {
    if (document.querySelector('link[data-bl-dashboard]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://lalaunch.github.io/big-league-mfl/dashboard.css?v=2';
    link.setAttribute('data-bl-dashboard', '1');
    document.head.appendChild(link);
  }

  function clean(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(text) {
    return clean(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---------------------------------------------------------
     Header injection remains as a fallback only.
     If Message #1 already contains the header, nothing happens.
     --------------------------------------------------------- */
  var headerHtml = `
<div class="bl-masthead">
  <div class="bl-topline">
    <div class="bl-topline-side bl-topline-left">Fantasy Football<br>Real Friends</div>
    <div class="bl-est">EST. 1990</div>
    <div class="bl-topline-side bl-topline-right">Different Teams<br>Same Obsession</div>
  </div>
  <div class="bl-title">THE BIG LEAGUE</div>
  <div class="bl-tagline">36 YEARS. SAME CREW. BIGGER LEGENDS.</div>
  <div class="bl-subline">Rivalries • Trades • Championships • Brotherhood</div>
  <div class="bl-mainnav">
    <a href="${BASE}/home/${LEAGUE}">Home</a>
    <a href="${BASE}/options?L=${LEAGUE}&O=07">Rosters</a>
    <a href="${BASE}/options?L=${LEAGUE}&O=15">Schedule</a>
    <a href="${BASE}/standings?L=${LEAGUE}">Standings</a>
    <a href="${BASE}/options?L=${LEAGUE}&O=03">Transactions</a>
    <a href="${BASE}/player_search?L=${LEAGUE}">Players</a>
    <a href="${BASE}/options?L=${LEAGUE}&O=101">Power Rank</a>
  </div>
</div>
<div class="bl-iconbar">
  <a href="${BASE}/options?L=${LEAGUE}&O=02"><i class="fas fa-clipboard-list"></i>Submit Lineup</a>
  <a href="${BASE}/add_drop?L=${LEAGUE}"><i class="fas fa-exchange-alt"></i>Add / Drop</a>
  <a href="${BASE}/options?L=${LEAGUE}&O=05"><i class="fas fa-handshake"></i>Trades</a>
  <a href="${BASE}/options?L=${LEAGUE}&O=07"><i class="fas fa-users"></i>Rosters</a>
  <a href="${BASE}/ajax_ls?L=${LEAGUE}"><i class="fas fa-tv"></i>Scoreboard</a>
</div>`;

  function injectHostedHeader() {
    if (document.querySelector('.bl-masthead')) return;
    var tabs = document.querySelector('#body_home .main_tabmenu') || document.querySelector('.main_tabmenu');
    if (!tabs || !tabs.parentNode) return;
    var holder = document.createElement('div');
    holder.className = 'bl-hosted-ui';
    holder.innerHTML = headerHtml;
    tabs.parentNode.insertBefore(holder, tabs);
  }

  function getLatestTransaction() {
    var rows = Array.from(document.querySelectorAll('#transactions tbody tr'));
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var transaction = row.querySelector('td.transaction');
      if (!transaction) continue;
      var team = row.querySelector('td.franchisename');
      var date = row.querySelector('td.timestamp');
      return {
        team: clean(team && team.textContent),
        text: clean(transaction.textContent),
        date: clean(date && date.textContent)
      };
    }
    return null;
  }

  function getMessageBoardTopic() {
    var links = Array.from(document.querySelectorAll('#message_board_summary a'));
    for (var i = 0; i < links.length; i++) {
      var txt = clean(links[i].textContent);
      if (!txt || /view message board/i.test(txt)) continue;
      return txt;
    }
    return '';
  }

  function getClosestMatchup() {
    var table = document.querySelector('#next_weeks_fantasy_schedule');
    if (!table) return null;

    var rows = Array.from(table.querySelectorAll('tbody > tr')).filter(function (row) {
      return !row.classList.contains('reportfooter') && row.querySelector('a[class*="franchise_"]');
    });

    var best = null;
    for (var i = 0; i + 1 < rows.length; i += 2) {
      var a = rows[i].querySelector('a[class*="franchise_"]');
      var b = rows[i + 1].querySelector('a[class*="franchise_"]');
      if (!a || !b) continue;

      var spreadRaw = clean(
        Array.from(rows[i].querySelectorAll('.points'))
          .concat(Array.from(rows[i + 1].querySelectorAll('.points')))
          .map(function (el) { return el.textContent; })
          .join(' ')
      );

      var value = 999;
      if (/even/i.test(spreadRaw)) value = 0;
      else {
        var m = spreadRaw.match(/[-+]?\d+(?:\.\d+)?/);
        if (m) value = Math.abs(parseFloat(m[0]));
      }

      if (!best || value < best.value) {
        best = {
          value: value,
          team1: clean(a.textContent),
          team2: clean(b.textContent),
          spread: spreadRaw || 'Line pending'
        };
      }
    }
    return best;
  }

  function aroundTheLeagueHtml() {
    var tx = getLatestTransaction();
    var topic = getMessageBoardTopic();
    var game = getClosestMatchup();

    var txMain = tx ? escapeHtml(tx.team + ' — ' + tx.text) : 'Transaction wire is quiet.';
    var txSub = tx && tx.date ? escapeHtml(tx.date) : 'Updates automatically from the MFL transaction module.';

    var topicMain = topic ? escapeHtml(topic) : 'No active trade-block post found.';

    var gameMain = game
      ? escapeHtml(game.team1 + ' vs ' + game.team2 + ' — ' + game.spread)
      : 'Week 1 • Five head-to-head matchups';

    return `
      <div class="bl-news-item">
        <span class="bl-kicker">Defending Champs</span>
        <div class="bl-item-main">Milwaukee Killer Pugs enter 2026 with the target on their backs.</div>
        <div class="bl-item-sub">2025 Big League Champions</div>
      </div>
      <div class="bl-news-item">
        <span class="bl-kicker">Game of the Week</span>
        <div class="bl-item-main">${gameMain}</div>
        <div class="bl-item-sub">Closest current MFL matchup line</div>
      </div>
      <div class="bl-news-item">
        <span class="bl-kicker">Trade Block</span>
        <div class="bl-item-main">${topicMain}</div>
        <div class="bl-item-sub">Latest message-board topic</div>
      </div>
      <div class="bl-news-item">
        <span class="bl-kicker">Latest Move</span>
        <div class="bl-item-main">${txMain}</div>
        <div class="bl-item-sub">${txSub}</div>
      </div>`;
  }

  function trophyRowsHtml() {
    var champs = [
      ['L.A. Launch', 7],
      ['Reno Gamblers', 7],
      ['Orlando Vipers', 5],
      ['Hartland Hitmen', 4],
      ['Kansas City Killers', 4],
      ['Tampa Bay Roxx Gang', 2],
      ['Terminators', 1],
      ['Orange County Mad Hatters', 1],
      ['Cincinnati Stormtroopers', 1],
      ['Sussex Stonemen', 1],
      ['Jersey Jackhammers', 1],
      ['Brooklyn Brawlers', 1],
      ['Milwaukee Killer Pugs', 1]
    ];

    return champs.map(function (item) {
      return '<div class="bl-trophy-row"><span class="bl-trophy-team">' +
        escapeHtml(item[0]) + '</span><span class="bl-trophy-count">' + item[1] + '</span></div>';
    }).join('');
  }

  function injectLowerDashboard() {
    if (document.querySelector('.bl-lower-dashboard')) return true;

    var column4 = document.querySelector('#homepagecolumn4');
    if (!column4) return false;

    var anchorTable = column4.closest('table#homepagecolumns');
    if (!anchorTable || !anchorTable.parentNode) return false;

    var wrap = document.createElement('div');
    wrap.className = 'bl-lower-dashboard';
    wrap.innerHTML = `
      <div class="bl-dashboard-grid three">

        <section class="bl-card">
          <div class="bl-card-title">Around the Big League</div>
          <div class="bl-card-body">${aroundTheLeagueHtml()}</div>
        </section>

        <section class="bl-card">
          <div class="bl-card-title">Injury Report</div>
          <div class="bl-card-body">
            <div class="bl-ir-item">
              <span class="bl-kicker">IR Money Back</span>
              <div class="bl-item-main">$100k back for a $100k player • $200k back for a player at $200k or more.</div>
            </div>
            <div class="bl-ir-item">
              <span class="bl-kicker">Required Process</span>
              <div class="bl-item-main">Place the player on IR, drop him, then notify the commissioner for the cap adjustment.</div>
            </div>
            <div class="bl-action-row">
              <a class="bl-btn" href="${BASE}/injury?L=${LEAGUE}">NFL Injury Report</a>
              <a class="bl-btn" href="${BASE}/home/${LEAGUE}#1">League Rules</a>
            </div>
          </div>
        </section>

        <section class="bl-card">
          <div class="bl-card-title">Big League Deadlines</div>
          <div class="bl-card-body">
            <div class="bl-deadline-item">
              <span class="bl-kicker">Waivers</span>
              <div class="bl-item-main">Wednesday for Thursday games • Saturday night for Sunday games.</div>
            </div>
            <div class="bl-deadline-item">
              <span class="bl-kicker">Trade Deadline</span>
              <div class="bl-item-main">Prior to kickoff of Week 11.</div>
            </div>
            <div class="bl-deadline-item">
              <span class="bl-kicker">Postseason</span>
              <div class="bl-item-main">Playoffs Week 15 • Championship Week 16.</div>
            </div>
            <div class="bl-action-row">
              <a class="bl-btn" href="${BASE}/options?L=${LEAGUE}&O=123">League Calendar</a>
            </div>
          </div>
        </section>

      </div>

      <div class="bl-dashboard-grid two">

        <section class="bl-card">
          <div class="bl-card-title">Hall of Champions — Recent Crowns</div>
          <div class="bl-card-body">
            <div class="bl-champ-list">
              <div class="bl-champ"><div class="bl-champ-year">2025</div><div class="bl-champ-team">Milwaukee Killer Pugs</div></div>
              <div class="bl-champ"><div class="bl-champ-year">2024</div><div class="bl-champ-team">Tampa Bay Roxx Gang</div></div>
              <div class="bl-champ"><div class="bl-champ-year">2023</div><div class="bl-champ-team">Brooklyn Brawlers</div></div>
              <div class="bl-champ"><div class="bl-champ-year">2022</div><div class="bl-champ-team">Reno Gamblers</div></div>
              <div class="bl-champ"><div class="bl-champ-year">2021</div><div class="bl-champ-team">Tampa Bay Roxx Gang</div></div>
            </div>
            <div class="bl-action-row">
              <a class="bl-btn" href="${BASE}/home/${LEAGUE}#3">Full Championship History</a>
            </div>
          </div>
        </section>

        <section class="bl-card">
          <div class="bl-card-title">Championship Count — 1990 to 2025</div>
          <div class="bl-card-body">
            <div class="bl-trophy-grid">${trophyRowsHtml()}</div>
            <div class="bl-card-note">36 completed seasons • 13 championship franchises</div>
          </div>
        </section>

      </div>`;

    anchorTable.insertAdjacentElement('afterend', wrap);
    return true;
  }

  function boot() {
    addDashboardStyles();
    injectHostedHeader();

    var attempts = 0;
    function tryDashboard() {
      attempts += 1;
      if (injectLowerDashboard() || attempts >= 20) return;
      window.setTimeout(tryDashboard, 250);
    }
    tryDashboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
