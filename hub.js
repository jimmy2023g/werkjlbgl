import { games } from './games.js';
import { banner, items, maintenanceMode } from './site-content.js';

const categories=[
{id:'all',label:'All items',icon:'fa-border-all'},{id:'games',label:'Arcade',icon:'fa-gamepad'},{id:'media',label:'Cinema & audio',icon:'fa-film'},{id:'tools',label:'Utilities',icon:'fa-wrench'},{id:'social',label:'Community',icon:'fa-users'}
];
const categoryHost=document.querySelector('#categories');
const grid=document.querySelector('#card-grid');
const queryInput=document.querySelector('#search');
let activeCategory='all';
function applyBanner(){
 document.querySelector('#banner-label').textContent=banner.label;
 document.querySelector('#banner-headline').textContent=banner.headline;
 document.querySelector('#banner-highlight').textContent=banner.highlight;
 document.querySelector('#banner-description').textContent=banner.description;
 const action=document.querySelector('#banner-action');
 action.href=banner.buttonLink;
 action.querySelector('span').textContent=banner.buttonText;
}
function renderCategories(){categoryHost.innerHTML=categories.map(c=>'<button class="dock-btn'+(activeCategory===c.id?' active':'')+'" data-category="'+c.id+'"><i class="fa-solid '+c.icon+'"></i>'+c.label+'</button>').join('')}
function renderHome(){
 const q=queryInput.value.trim().toLowerCase();
 const filtered=items.filter(item=>(activeCategory==='all'||item.category===activeCategory)&&(!q||(item.title+' '+item.desc).toLowerCase().includes(q)));
 document.querySelector('#collection-title').textContent=activeCategory==='all'?'All the good stuff':categories.find(c=>c.id===activeCategory).label;
 document.querySelector('#item-count').textContent=filtered.length+' '+(filtered.length===1?'item':'items');
 grid.innerHTML=filtered.map(item=>'<a class="app-card"'+(item.maintenance?' data-maintenance="true"':'')+' style="--accent:'+item.color+'" href="'+(item.page?'#'+item.page:item.url)+'"'+(!item.page&&item.url?' target="_blank" rel="noopener noreferrer"':'')+'><span class="badge-pill'+(item.maintenance?' maintenance-pill':'')+'"'+(item.badge||item.maintenance?'':' hidden')+'>'+(item.maintenance?'Maintenance':item.badge||'')+'</span><span class="icon-circle"><i class="fa-solid '+item.icon+'"></i></span><h3>'+item.title+'</h3><p>'+item.desc+'</p></a>').join('');
 document.querySelector('#empty-state').hidden=filtered.length>0;
 document.querySelector('#item-count').hidden=!filtered.length;
}
let activeTab='all';
function renderTabs(){const tabs=[{id:'all',label:'All games'},{id:'featured',label:'Featured'}];document.querySelector('#game-tabs').innerHTML=tabs.map(t=>'<button class="tab-btn'+(activeTab===t.id?' active':'')+'" role="tab" aria-selected="'+(activeTab===t.id)+'" data-tab="'+t.id+'">'+t.label+'</button>').join('')}
function renderGames(){
 const q=document.querySelector('#game-search').value.trim().toLowerCase();
 const shown=games.filter(game=>(activeTab==='all'||game.featured)&&(!q||game.title.toLowerCase().includes(q)));
 document.querySelector('#game-count').textContent=shown.length+' TITLES';
 document.querySelector('#game-grid').innerHTML=shown.map(game=>{
  const accent=game.color||'#d8ef70';
  const icon=game.icon||'fa-gamepad';
  const fallback='<div class="game-fallback" style="--accent:'+accent+'">'+(game.featured?'<span class="featured-symbol">↗</span>':'<i class="fa-solid '+icon+'"></i>')+'</div>';
  const image=game.image?'<img class="game-img" src="'+game.image+'" alt="" loading="lazy">':'';
  const external=/^https?:\/\//i.test(game.url);
  return '<a class="game-btn'+(game.featured?' featured-tile':'')+'" data-game-id="'+game.id+'" href="'+game.url+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+' style="--accent:'+accent+'">'+fallback+image+'<span class="tile-mark"><i class="fa-solid '+(external?'fa-arrow-up-right-from-square':'fa-play')+'"></i></span><span class="game-name">'+game.title+'</span></a>'
 }).join('');
 document.querySelectorAll('.game-img').forEach(img=>img.addEventListener('error',()=>img.remove()));
 document.querySelector('#game-empty').hidden=shown.length>0;
}
function renderDetail(slug){
 const item=items.find(entry=>entry.page===slug);if(!item)return;
 document.querySelector('#detail-kicker').textContent='GASHER HUB / '+item.category.toUpperCase();
 document.querySelector('#detail-title').textContent=item.title;
 document.querySelector('#detail-description').textContent=item.desc;
 const host=document.querySelector('#detail-content');
 if(item.maintenance){
  host.innerHTML='<article class="maintenance-panel" style="--accent:'+item.color+'"><div class="maintenance-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div><span class="section-kicker">SERVICE STATUS / TEMPORARILY OFFLINE</span><h2>Under maintenance</h2><p>'+item.title+' is being tuned up. Please check back soon.</p><div class="maintenance-status"><span></span> MAINTENANCE IN PROGRESS</div></article>';
  return;
 }
 if(slug==='popular'){
  host.innerHTML='<section class="leaderboard-page"><div class="leaderboard-heading"><span class="section-kicker">COMMUNITY RANKINGS</span><h2>Top 5 Games</h2></div><div class="leaderboard" id="popular-grid"></div></section>';
  renderPopular();
  return;
 }
 const related=items.filter(other=>other.category===item.category&&other!==item).slice(0,4);
 const relatedHtml=related.map(other=>'<a class="app-card" style="--accent:'+other.color+'" href="#'+other.page+'"><span class="icon-circle"><i class="fa-solid '+other.icon+'"></i></span><h3>'+other.title+'</h3><p>'+other.desc+'</p></a>').join('');
 host.innerHTML='<article class="destination-panel" style="--accent:'+item.color+'"><div class="destination-icon"><i class="fa-solid '+item.icon+'"></i></div><span class="section-kicker">'+item.category.toUpperCase()+' / GASHER HUB</span><h2>'+item.title+'</h2><p>'+item.desc+'. This page keeps the collection close and gives you a direct route to the original destination.</p><a class="destination-cta" href="'+item.url+'" target="_blank" rel="noopener noreferrer">OPEN '+item.title.toUpperCase()+' <i class="fa-solid fa-arrow-up-right-from-square"></i></a></article>'+(related.length?'<section class="related-section"><div class="collection-heading"><div><span class="section-kicker">KEEP EXPLORING</span><h2>More in '+categories.find(category=>category.id===item.category).label+'</h2></div></div><div class="card-grid">'+relatedHtml+'</div></section>':'');
}
async function renderPopular(){
 const board=document.querySelector('#popular-grid');if(!board)return;
 board.innerHTML='<p class="empty-state">Loading game rankings…</p>';
 try{
  const response=await fetch('/api/popular-games');
  if(!response.ok)throw new Error('Could not load game rankings');
  const {top=[]}=await response.json();
  const ranked=top.map(entry=>({game:games.find(game=>game.id===entry.id),clicks:entry.clicks})).filter(entry=>entry.game);
  if(!ranked.length){board.innerHTML='<p class="empty-state">Play a game to start the rankings.</p>';return}
  board.innerHTML=ranked.map(({game,clicks},index)=>'<a class="leaderboard-row'+([' first',' second',' third'][index]||'')+'" data-game-id="'+game.id+'" href="'+game.url+'"'+(/^https?:\/\//i.test(game.url)?' target="_blank" rel="noopener noreferrer"':'')+'><span class="rank">'+(index+1)+'</span>'+(game.image?'<img class="thumb" src="'+game.image+'" alt="" loading="lazy">':'<span class="thumb game-thumb-fallback"><i class="fa-solid '+(game.icon||'fa-gamepad')+'"></i></span>')+'<span class="popular-name">'+game.title+'</span><span class="popular-count">'+clicks+' plays</span><i class="fa-solid fa-arrow-up-right-from-square row-arrow" aria-hidden="true"></i></a>').join('');
 }catch(error){board.innerHTML='<p class="empty-state">Game rankings are unavailable right now.</p>';console.error(error)}
}
function syncRoute(){
 const route=location.hash.slice(1);const isGames=route==='games';const isSettings=route==='settings';const isHome=!isGames&&!isSettings&&!items.some(item=>item.page===route);
 const showMaintenance=maintenanceMode;
 document.querySelector('#maintenance-view').hidden=!showMaintenance;
 document.querySelector('#home-view').hidden=!isHome||showMaintenance;
 document.querySelector('#games-view').hidden=!isGames||showMaintenance;
 document.querySelector('#settings-view').hidden=!isSettings||showMaintenance;
 document.querySelector('#detail-view').hidden=isHome||isGames||isSettings||showMaintenance;
 document.querySelector('.footer-status').innerHTML=maintenanceMode?'<i></i> MAINTENANCE MODE':'<i></i> PORTAL ONLINE';
 if(isGames&&!showMaintenance){renderGames();window.scrollTo(0,0)}
 else if(!isHome&&!isSettings){renderDetail(route);window.scrollTo(0,0)}
}
categoryHost.addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderCategories();renderHome()});
document.querySelector('#game-tabs').addEventListener('click',e=>{const button=e.target.closest('[data-tab]');if(!button)return;activeTab=button.dataset.tab;renderTabs();renderGames()});
queryInput.addEventListener('input',renderHome);
document.querySelector('#game-search').addEventListener('input',renderGames);
document.querySelector('#game-grid').addEventListener('click',event=>{const tile=event.target.closest('[data-game-id]');if(tile)trackGameClick(tile.dataset.gameId)});
document.querySelector('#detail-content').addEventListener('click',event=>{const row=event.target.closest('[data-game-id]');if(row)trackGameClick(row.dataset.gameId)});
window.addEventListener('hashchange',syncRoute);
window.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&location.hash!=='#games'){e.preventDefault();queryInput.focus()}if(e.key==='Escape'&&location.hash==='#games')location.hash='#home'});
applyBanner();renderCategories();renderHome();renderTabs();syncRoute();

const savedTheme=localStorage.getItem('gasher-theme')||'dark';
document.body.classList.toggle('light-theme',savedTheme==='light');
function setTheme(theme){document.body.classList.toggle('light-theme',theme==='light');localStorage.setItem('gasher-theme',theme);document.querySelectorAll('.theme-option').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.theme===theme)));}
document.querySelector('#settings-view').addEventListener('click',event=>{const button=event.target.closest('[data-theme]');if(button)setTheme(button.dataset.theme)});
setTheme(savedTheme);
function trackGameClick(id){fetch('/api/game-click',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id}),keepalive:true}).catch(error=>console.error('Could not track game opening',error))}
