(function(){
  var href='https://lalaunch.github.io/big-league-mfl/hero-v2.css?v=2';
  var id='bl-hero-v2-css';
  var old=document.getElementById('bl-hero-v1-css');
  if(old) old.remove();
  if(document.getElementById(id)) return;
  var link=document.createElement('link');
  link.id=id; link.rel='stylesheet'; link.href=href;
  document.head.appendChild(link);
})();
