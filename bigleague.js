/* The Big League — hosted UI layer
   Safe migration helper: if MFL Message #1 already contains the header,
   this script leaves it alone. If not, it injects the hosted header + quick links.
*/

(function () {
  'use strict';

  document.documentElement.classList.add('big-league-hosted');

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
    <a href="https://www42.myfantasyleague.com/2026/home/73086">Home</a>
    <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=07">Rosters</a>
    <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=15">Schedule</a>
    <a href="https://www42.myfantasyleague.com/2026/standings?L=73086">Standings</a>
    <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=03">Transactions</a>
    <a href="https://www42.myfantasyleague.com/2026/player_search?L=73086">Players</a>
    <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=101">Power Rank</a>
  </div>
</div>

<div class="bl-iconbar">
  <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=02">
    <i class="fas fa-clipboard-list"></i>Submit Lineup
  </a>
  <a href="https://www42.myfantasyleague.com/2026/add_drop?L=73086">
    <i class="fas fa-exchange-alt"></i>Add / Drop
  </a>
  <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=05">
    <i class="fas fa-handshake"></i>Trades
  </a>
  <a href="https://www42.myfantasyleague.com/2026/options?L=73086&O=07">
    <i class="fas fa-users"></i>Rosters
  </a>
  <a href="https://www42.myfantasyleague.com/2026/ajax_ls?L=73086">
    <i class="fas fa-tv"></i>Scoreboard
  </a>
</div>`;

  function injectHostedHeader() {
    if (document.querySelector('.bl-masthead')) return;

    var tabs = document.querySelector('#body_home .main_tabmenu') ||
               document.querySelector('.main_tabmenu');

    if (!tabs || !tabs.parentNode) return;

    var holder = document.createElement('div');
    holder.className = 'bl-hosted-ui';
    holder.innerHTML = headerHtml;
    tabs.parentNode.insertBefore(holder, tabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHostedHeader);
  } else {
    injectHostedHeader();
  }
})();
