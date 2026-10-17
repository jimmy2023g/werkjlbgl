const canvas=document.querySelector('#game');
const ctx=canvas.getContext('2d');
const scoreEl=document.querySelector('#score');
const bestEl=document.querySelector('#best');
const lightEl=document.querySelector('#light');
const screen=document.querySelector('#screen');
const title=document.querySelector('#title');
const message=document.querySelector('#message');
const eyebrow=document.querySelector('#eyebrow');
const playButton=document.querySelector('#play');
const buttonLabel=document.querySelector('#button-label');

let width=0,height=0,dpr=1,last=0,elapsed=0,score=0,light=0,lane=1,playerX=0,entities=[],particles=[],stars=[];
let running=false,started=false,spawnClock=0,best=Number(localStorage.getItem('laneshift-best')||0);
bestEl.textContent=String(best).padStart(5,'0');

function resize(){
  const rect=canvas.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);
  width=rect.width;height=rect.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.floor(width*height/8500)},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.3+.25,a:Math.random()*.35+.08,p:Math.random()*6}));
  playerX=laneX(lane);
}
function laneX(n){return width*(.22+n*.28)}
function start(){
  running=true;started=true;elapsed=0;score=0;light=0;lane=1;playerX=laneX(1);entities=[];particles=[];spawnClock=.55;last=performance.now();screen.classList.remove('active');
  scoreEl.textContent='00000';lightEl.textContent='0';requestAnimationFrame(loop);
}
function endRun(){
  running=false;screen.classList.add('active');eyebrow.textContent='RUN COMPLETE';title.innerHTML='The night<br><em>keeps going.</em>';
  message.innerHTML='Distance '+String(score).padStart(5,'0')+'<br>'+light+' light gathered';buttonLabel.textContent='RUN IT BACK';
  if(score>best){best=score;localStorage.setItem('laneshift-best',best);bestEl.textContent=String(best).padStart(5,'0')}
}
function move(dir){if(!running)return;lane=Math.max(0,Math.min(2,lane+dir))}
function spawn(){
  const hazardLane=Math.floor(Math.random()*3);entities.push({lane:hazardLane,y:-35,type:'hazard',size:20+Math.random()*4});
  if(Math.random()<.47){let orbLane=Math.floor(Math.random()*3);if(orbLane===hazardLane)orbLane=(orbLane+1+Math.floor(Math.random()*2))%3;entities.push({lane:orbLane,y:-100,type:'orb',size:9})}
}
function burst(x,y,color,count=12){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=Math.random()*120+35;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+Math.random()*.45,max:.9,color,size:Math.random()*2.5+1})}}
function drawRoad(){
  const horizon=height*.13,bottom=height*1.08,cx=width/2;
  const grad=ctx.createLinearGradient(0,horizon,0,height);grad.addColorStop(0,'#101827');grad.addColorStop(.55,'#0b1220');grad.addColorStop(1,'#111a29');
  ctx.fillStyle=grad;ctx.fillRect(0,0,width,height);
  const roadTop=width*.26,roadBottom=width*.9;
  ctx.beginPath();ctx.moveTo(cx-roadTop/2,horizon);ctx.lineTo(cx+roadTop/2,horizon);ctx.lineTo(cx+roadBottom/2,bottom);ctx.lineTo(cx-roadBottom/2,bottom);ctx.closePath();
  const rg=ctx.createLinearGradient(0,horizon,0,height);rg.addColorStop(0,'rgba(27,39,60,.12)');rg.addColorStop(1,'rgba(31,46,66,.5)');ctx.fillStyle=rg;ctx.fill();
  ctx.strokeStyle='rgba(148,190,216,.13)';ctx.lineWidth=1;
  for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(cx+side*roadTop/2,horizon);ctx.lineTo(cx+side*roadBottom/2,bottom);ctx.stroke()}
  for(let i=1;i<3;i++){const topX=cx+(i-1.5)*roadTop/3,bottomX=cx+(i-1.5)*roadBottom/3;ctx.beginPath();ctx.moveTo(topX,horizon);ctx.lineTo(bottomX,bottom);ctx.strokeStyle='rgba(151,177,205,.105)';ctx.stroke()}
  const horizonGlow=ctx.createRadialGradient(cx,horizon,0,cx,horizon,width*.65);horizonGlow.addColorStop(0,'rgba(104,205,210,.13)');horizonGlow.addColorStop(1,'transparent');ctx.fillStyle=horizonGlow;ctx.fillRect(0,0,width,height*.55);
  for(const s of stars){ctx.globalAlpha=s.a*(.72+Math.sin(elapsed*1.6+s.p)*.28);ctx.fillStyle='#d4e9fb';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  const spacing=height*.19,offset=(elapsed*speed()*1.7)%spacing;
  for(let y=horizon+offset;y<height+spacing;y+=spacing){const t=(y-horizon)/(height-horizon);const py=horizon+t*(height-horizon);ctx.fillStyle='rgba(162,248,226,'+(.05+t*.13)+')';ctx.fillRect(cx-width*.39*t,py,width*.78*t,1+t*1.2)}
}
function speed(){return 205+Math.min(elapsed*5,180)}
function drawEntity(e){
  const y=e.y,depth=Math.max(.25,.38+y/height),x=laneX(e.lane),size=e.size*depth;
  if(e.type==='orb'){
    const pulse=1+Math.sin(elapsed*7+e.y)*.13;ctx.save();ctx.shadowColor='#a2f8e2';ctx.shadowBlur=18*depth;ctx.fillStyle='#c4ffed';ctx.beginPath();ctx.arc(x,y,size*.55*pulse,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.strokeStyle='rgba(162,248,226,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,size*1.2,0,Math.PI*2);ctx.stroke();
  }else{
    const w=size*1.3,h=size*1.45;ctx.save();ctx.shadowColor='#ff6e70';ctx.shadowBlur=15*depth;ctx.fillStyle='#fa6c72';ctx.beginPath();ctx.moveTo(x-w*.5,y-h*.4);ctx.lineTo(x+w*.5,y-h*.4);ctx.lineTo(x+w*.65,y+h*.4);ctx.lineTo(x,y+h*.57);ctx.lineTo(x-w*.65,y+h*.4);ctx.closePath();ctx.fill();ctx.restore();
    ctx.strokeStyle='rgba(255,206,195,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-w*.33,y-h*.23);ctx.lineTo(x+w*.3,y-h*.23);ctx.stroke();
  }
}
function drawPlayer(dt){
  const target=laneX(lane);playerX+=(target-playerX)*Math.min(1,dt*13);const y=height*.79;
  ctx.save();ctx.translate(playerX,y);ctx.shadowColor='#a2f8e2';ctx.shadowBlur=23;ctx.fillStyle='#baffeb';ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(12,10);ctx.lineTo(0,6);ctx.lineTo(-12,10);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle='rgba(162,248,226,.6)';ctx.beginPath();ctx.ellipse(playerX,y+15,3,6+Math.random()*4,0,0,Math.PI*2);ctx.fill();
  const ring=ctx.createRadialGradient(playerX,y,2,playerX,y,38);ring.addColorStop(0,'rgba(162,248,226,.15)');ring.addColorStop(1,'transparent');ctx.fillStyle=ring;ctx.fillRect(playerX-38,y-38,76,76);
}
function loop(now){
  if(!running)return;const dt=Math.min((now-last)/1000,.035);last=now;elapsed+=dt;score=Math.floor(elapsed*10);spawnClock-=dt;
  if(spawnClock<=0){spawn();spawnClock=Math.max(.42,1.04-elapsed*.009)+Math.random()*.25}
  drawRoad();
  const v=speed();
  for(let i=entities.length-1;i>=0;i--){const e=entities[i];e.y+=v*dt;drawEntity(e);
    if(e.y>height*.745&&e.y<height*.835&&e.lane===lane){if(e.type==='hazard'){burst(laneX(lane),height*.79,'#ff7275',22);endRun();return}else{light++;lightEl.textContent=light;burst(laneX(lane),e.y,'#a2f8e2',9);entities.splice(i,1);continue}}
    if(e.y>height+35)entities.splice(i,1)
  }
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);if(p.life<=0)particles.splice(i,1)}ctx.globalAlpha=1;
  drawPlayer(dt);scoreEl.textContent=String(score).padStart(5,'0');requestAnimationFrame(loop)
}
playButton.addEventListener('click',start);
document.querySelector('#left').addEventListener('pointerdown',()=>move(-1));
document.querySelector('#right').addEventListener('pointerdown',()=>move(1));
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' ','a','d','A','D'].includes(e.key))e.preventDefault();if(!running&&[' ','Enter'].includes(e.key)){start();return}if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')move(-1);if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')move(1)});
let touchX=null;canvas.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});canvas.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>20)move(dx>0?1:-1);touchX=null},{passive:true});
window.addEventListener('resize',resize);resize();
function idle(now){if(running)return;const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;drawRoad();drawPlayer(dt);requestAnimationFrame(idle)}requestAnimationFrame(idle);
