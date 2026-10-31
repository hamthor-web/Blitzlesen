/* Perspective progress journey. Rendering never changes or saves game results. */
(function(){
'use strict';
const LIMIT=20;
const BEST_COLORS=["#d83c47","#f2bd20","#299954"];
const BEST_COLOR_NAMES=["Rot","Gelb","Grün"];
const clean=n=>Math.max(0,Math.min(LIMIT,Number(n)||0));
const valid=a=>a&&Number.isInteger(a.solved)&&a.solved>=0&&a.solved<=LIMIT&&Number.isFinite(a.timestamp)&&Number.isFinite(a.retries)&&a.retries>=0;
const topThree=attempts=>attempts.filter(valid).map((a,i)=>({...a,_order:i})).sort((a,b)=>b.solved-a.solved||b.timestamp-a.timestamp||b._order-a._order).slice(0,3);
const recentThree=attempts=>attempts.filter(valid).map((a,i)=>({...a,_order:i})).sort((a,b)=>b.timestamp-a.timestamp||b._order-a._order).slice(0,3);
const repeatedText=a=>a.legacyRetries?`${a.retries} erneute Versuche`:`${a.repeatedSentences??a.retries} ${(a.repeatedSentences??a.retries)===1?'Satz':'Sätze'} wiederholt`;
const date=a=>new Date(a.timestamp).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});
const worldX=v=>Math.sin(v*.53)*210+Math.sin(v*.18)*45;
function project(v,camera){
 const progress=Math.max(0,Math.min(20,camera+.25)),depth=Math.max(0,Math.min(1,v/20));
 const scale=.35+.65*(1-depth),zoom=1+.055*Math.sin(progress/20*Math.PI);
 const goalX=465+worldX(20)*.35;
 const x=465+worldX(v)*scale,y=245+500*Math.pow(1-depth,.85);
 return {x:goalX+(x-goalX)*zoom,y:245+(y-245)*zoom,s:scale*zoom};
}

let ready;
const assets={};
function load(){return ready||(ready=Promise.all(['strand.jpg','schatz-offen.png','schatz-halb.png','turn0.png','jump0.png','jump2.png','turn1.png','turn2.png','turn3.png','turn4.png'].map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{assets[name]=im;resolve()};im.onerror=()=>reject(Error('Ein Bild konnte nicht geladen werden. Bitte lade die Seite erneut.'));im.src='assets/'+name}))));}
function text(tag,value,className){const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;}
function round(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.6;c.stroke()}}
function crown(c,x,y,s,now){c.save();c.translate(x,y+Math.sin(now/370)*2*s);c.scale(s,s);c.rotate(.04*Math.sin(now/510));c.beginPath();c.moveTo(-20,11);c.lineTo(-24,-13);c.lineTo(-10,-3);c.lineTo(0,-20);c.lineTo(10,-3);c.lineTo(24,-13);c.lineTo(20,11);c.closePath();const g=c.createLinearGradient(0,-20,0,18);g.addColorStop(0,'#fff0a4');g.addColorStop(1,'#df9c29');c.fillStyle=g;c.fill();c.strokeStyle='#946226';c.lineWidth=2;c.stroke();c.fillStyle='#eab345';c.fillRect(-20,8,40,9);c.strokeRect(-20,8,40,9);c.beginPath();c.arc(0,5,3,0,Math.PI*2);c.fillStyle='#a77cc0';c.fill();c.restore()}
function star(c,x,y,r,alpha){c.save();c.globalAlpha=alpha;c.translate(x,y);c.beginPath();c.moveTo(0,-r);c.quadraticCurveTo(r*.22,-r*.22,r,0);c.quadraticCurveTo(r*.22,r*.22,0,r);c.quadraticCurveTo(-r*.22,r*.22,-r,0);c.quadraticCurveTo(-r*.22,-r*.22,0,-r);c.fillStyle='#fff5b1';c.shadowColor='#ffd548';c.shadowBlur=9;c.fill();c.restore()}
function chest(c,p,open=0,now=0){
 // Original transparent PNGs, anchored at the same point on the sand.
 const paint=(name,alpha)=>{if(alpha<=0)return;c.save();c.globalAlpha=alpha;const size=165+open*25;c.drawImage(assets[name],p.x-size/2,p.y-size,size,size);c.restore()};
 paint('schatz-halb.png',1-open);paint('schatz-offen.png',open);
 if(open>0)for(let i=0;i<14;i++){const phase=(now/1700+i*.137)%1,angle=i*2.399;const r=35+phase*65;star(c,p.x+Math.cos(angle)*r,p.y-85+Math.sin(angle)*r*.65-phase*15,2+5*Math.sin(phase*Math.PI),(1-phase)*open)}
}
function motivation(solved,best,variant=0){
 const count=solved===1?'einen Satz':solved+' Sätze';
 if(solved===0)return 'Das kleine Würstchen ist startklar. Beim nächsten Mal geht die Reise weiter!';
 if(best==null)return 'Du hast '+count+' geschafft. Dein erster Strandweg ist geschafft. Toll, dass du mitgemacht hast!';
 if(solved>best)return 'Wow! Du hast '+count+' geschafft. Das kleine Würstchen ist über deinen bisherigen Bestwert hinausgehüpft! Toll gemacht!';
 if(solved===best)return 'Du hast '+count+' geschafft und deinen Bestwert wieder erreicht. Klasse, weiter so!';
 const gap=best-solved;
 if(gap<=5){const missing=gap===1?'ein Satz':gap+' Sätze',w=solved===1?'Ein Satz':solved+' Sätze';return [
 'Ganz nah dran! Nur noch '+missing+' bis zu deinem Bestwert. Toll gelesen!',
 'Dein Strandweg heute war spitzenklasse! Du bist fast bei deinem Bestwert angekommen.',
 w+' geschafft! Dein Bestwert liegt bei '+best+'. Das war richtig knapp!',
 'Das kleine Würstchen ist ganz nah an deinen Bestwert herangehüpft. Prima gemacht!',
 'Nur '+missing+' '+(gap===1?'fehlt':'fehlen')+' bis zu deinem Bestwert. Das kleine Würstchen freut sich über diese tolle Reise!',
 'Fast geschafft! Mit '+count+' bist du deinem Bestwert ganz nah gekommen.',
 'Was für eine Reise! Dein Bestwert ist schon in Sicht. Weiter so!',
 w+' geschafft! Das '+(gap===1?'ist nur ein Satz':'sind nur '+gap+' Sätze')+' weniger als bei deinem weitesten Strandweg. Klasse!'
 ][((variant%8)+8)%8];}
 return 'Du hast '+count+' geschafft! Toll, dass du mitgemacht hast. Weiter so!';
}

function background(c,progress){c.drawImage(assets['strand.jpg'],0,0,900,800);}

class BeachJourney{
 constructor(root){this.root=root;this.run=0;this.progress=0;this.state=null;this.raf=null;root.classList.add('beachCard');root.innerHTML='<div class="beachScene"><aside class="beachTop" aria-label="Deine drei besten Ergebnisse"><h3>★ Deine drei besten</h3><div class="beachBest"></div></aside><div class="beachPins" aria-label="Bestwerte auf dem Weg"></div><canvas width="1800" height="1600" role="img" aria-label="Perspektivischer Strandweg von 0 bis 20 Sätzen. Beschriftete Stationen bei 0, 10 und 20."></canvas></div><div class="beachResult"><h3 class="journeyCount" aria-live="polite">Dein Strandweg</h3><div class="beachChips"></div><p class="journeyMessage" aria-live="polite"></p><div class="beachTools"><button class="journeyReplay" type="button">Sprünge noch einmal ansehen</button><button class="journeySkip" type="button">Direkt zum Ergebnis</button></div></div>';this.pins=root.querySelector('.beachPins');this.canvas=root.querySelector('canvas');this.c=this.canvas.getContext('2d');this.c.scale(2,2);this.count=root.querySelector('.journeyCount');this.message=root.querySelector('.journeyMessage');this.replay=root.querySelector('.journeyReplay');this.skip=root.querySelector('.journeySkip');this.replay.onclick=()=>this.play();this.skip.onclick=()=>this.finishNow();this.reduce=matchMedia('(prefers-reduced-motion: reduce)');}
 stop(){this.run++;if(this.raf)cancelAnimationFrame(this.raf);this.raf=null;this.running=false;}
 async show(state,{animate=true}={}){this.stop();this.facing=null;this.previousFacing=null;this.treasureStart=null;this.feedbackText=null;this.state={...state,solved:clean(state.solved),retries:Math.max(0,Number(state.retries)||0),attempts:state.attempts||[]};this.renderBest();this.root.querySelector('.beachChips').replaceChildren(text('span',this.state.solved+' Sätze geschafft','beachChip'),text('span',repeatedText(this.state),'beachChip yellow'));const token=this.run;try{await load()}catch(e){if(token===this.run)this.message.textContent=e.message;return}if(token!==this.run)return;if(animate)this.play();else this.finishNow();}
 renderBest(){const holder=this.root.querySelector('.beachBest'),best=topThree(this.state.attempts);holder.replaceChildren();best.forEach((a,i)=>{const el=document.createElement('article');el.style.setProperty('--best-color',BEST_COLORS[i]);el.setAttribute('aria-label',BEST_COLOR_NAMES[i]+', Bestwert '+(i+1));el.append(text('strong',a.solved+(a.solved===1?' Satz geschafft':' Sätze geschafft')),text('span',repeatedText(a)),text('time',date(a)));holder.append(el)});if(!best.length)holder.append(text('p','Hier erscheinen deine gespeicherten Ergebnisse.','beachEmpty'));}
 feedback(){if(this.feedbackText)return this.feedbackText;let choice=Math.floor(Math.random()*7);if(this.lastMotivation==null)choice=Math.floor(Math.random()*8);else if(choice>=this.lastMotivation)choice++;this.lastMotivation=choice;return this.feedbackText=motivation(this.state.solved,this.state.oldBest,choice);}

 finishNow(){if(!this.state)return;this.stop();this.facing=null;this.previousFacing=null;this.progress=this.state.solved;this.complete();this.treasureStart=this.progress===LIMIT?performance.now():null;this.draw(performance.now(),0,1,1,'turn0');this.count.textContent=this.state.solved+' Sätze geschafft';this.message.textContent=this.feedback()+(this.progress===LIMIT?' Die Schatztruhe an der Lagune öffnet sich!':'');this.replay.disabled=false;this.skip.disabled=true;if(this.progress===LIMIT&&!this.reduce.matches)this.celebrate();}
 celebrate(){const run=this.run;const tick=now=>{if(run!==this.run)return;this.draw(now);this.raf=requestAnimationFrame(tick)};this.raf=requestAnimationFrame(tick);}
 complete(){if(this.state.onComplete){const fn=this.state.onComplete;this.state.onComplete=null;fn();this.renderBest();}}
 play(){if(!this.state||!assets['strand.jpg'])return;this.stop();if(this.reduce.matches||this.state.solved===0){this.finishNow();return}const run=this.run,target=this.state.solved;this.progress=0;this.treasureStart=null;this.facing=null;this.previousFacing=null;this.running=true;this.draw(performance.now());this.replay.disabled=true;this.skip.disabled=false;this.message.textContent='Das kleine Würstchen hüpft los …';let start=null;const perJump=470;const frame=now=>{if(run!==this.run)return;if(start===null)start=now;const t=(now-start)/perJump;if(t>=target){this.finishNow();return}const base=Math.floor(t),phase=t-base;let move=Math.max(0,Math.min(1,(phase-.14)/.69)),h=63*Math.sin(Math.PI*move),sx=1,sy=1,key='jump2';if(phase<.14){key='jump0';const q=Math.sin(phase/.14*Math.PI/2);sx=1+.1*q;sy=1-.1*q}else if(phase>.83){key='jump0';const q=Math.sin((phase-.83)/.17*Math.PI);sx=1+.1*q;sy=1-.1*q}this.progress=base+move;this.draw(now,h,sx,sy,key);const done=Math.min(target,base);this.count.textContent=done+' von '+target+' Sätzen';this.raf=requestAnimationFrame(frame)};this.raf=requestAnimationFrame(frame);}
 draw(now=0,height=0,sx=1,sy=1,key='turn0'){const c=this.c;c.clearRect(0,0,900,800);background(c,this.progress);const cam=this.progress-.25,goal=project(20,cam);this.camera=cam;
 // Continuous route under discrete stepping stones.
 c.beginPath();let pen=false;for(let v=0;v<=20;v+=.07){const p=project(v,cam);if(!p||p.y>855)continue;if(!pen){c.moveTo(p.x,p.y);pen=true}else c.lineTo(p.x,p.y)}c.strokeStyle='#a87c3555';c.lineWidth=8;c.setLineDash([3,12]);c.lineCap='round';c.stroke();c.setLineDash([]);
 for(let v=20;v>=0;v--){const p=project(v,cam);if(!p||p.y>830)continue;const major=v%10===0;const r=(major?30:10)*p.s;c.beginPath();c.ellipse(p.x,p.y,r*1.15,r*.58,0,0,Math.PI*2);c.fillStyle=v<=this.progress?'#dcecb7':'#fffcee';c.fill();c.strokeStyle=v<=this.progress?'#6f9750':'#c69c56';c.lineWidth=2*p.s;c.stroke();if(major){c.save();c.font='800 '+Math.max(20,36*p.s)+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.lineWidth=5;c.strokeStyle='#fffced';c.strokeText(String(v),p.x,p.y+3);c.fillStyle='#445f40';c.fillText(String(v),p.x,p.y+3);c.restore()}}
 if(goal&&goal.y<820){const opening=this.treasureStart==null?0:this.reduce.matches?1:1-Math.pow(1-Math.min(1,Math.max(0,(now-this.treasureStart)/900)),3);chest(c,{...goal,s:goal.s,x:goal.x+110,y:goal.y+10},opening,now);this.canvas.dataset.treasure=opening===0?'halb geöffnet':opening<.999?'öffnet sich':'offen';round(c,goal.x-65*goal.s,goal.y+36*goal.s,130*goal.s,40*goal.s,8*goal.s,'#fffbeccc','#b9a46b');c.fillStyle='#59613c';c.font='800 '+Math.max(15,21*goal.s)+'px system-ui';c.textAlign='center';c.fillText('20 Sätze',goal.x,goal.y+63*goal.s)}
 // Matching colored dots show best positions without boxes or connector lines.
 const marks=topThree(this.state.attempts);this.pins.replaceChildren();
 // Draw one centered marker per station, split into sectors for equal scores.
 [...new Set(marks.map(a=>a.solved))].forEach(solved=>{
 const p=project(solved,cam);if(!p)return;
 const indices=marks.map((a,i)=>a.solved===solved?i:-1).filter(i=>i>=0),radius=12;
 c.save();indices.forEach((rank,slot)=>{const start=-Math.PI/2+slot*Math.PI*2/indices.length,end=start+Math.PI*2/indices.length;c.beginPath();c.moveTo(p.x,p.y);c.arc(p.x,p.y,radius,start,end);c.closePath();c.fillStyle=BEST_COLORS[rank];c.fill();});
 c.beginPath();c.arc(p.x,p.y,radius,0,Math.PI*2);c.strokeStyle='#fffdf1';c.lineWidth=3;c.stroke();c.restore();
 });

 if(this.state.legacyBest!=null&&!marks.some(a=>a.solved===this.state.legacyBest)){const p=project(this.state.legacyBest,cam);if(p&&p.y<790){c.fillStyle='#9a7233';c.font='bold 21px system-ui';c.textAlign='center';c.fillText('★ Früherer Bestwert: '+this.state.legacyBest,p.x,Math.min(780,p.y+48))}}
 const p=project(this.progress,cam);if(!p)return;const scale=p.s*1.15,high=height*scale;const shadow=22*scale;c.save();c.globalAlpha=.2-.1*height/63;c.fillStyle='#82652c';c.beginPath();c.ellipse(p.x,p.y,shadow,5*scale,0,0,Math.PI*2);c.fill();c.restore();
 // Look in the actual direction of the projected path: back, rear-quarter or side.
 const before=project(this.progress-.12,cam),after=project(this.progress+.12,cam);
 const angle=Math.atan2(after.x-before.x,before.y-after.y)*180/Math.PI;
 const absolute=Math.abs(angle);
 const desired=absolute<24?{key:'turn2',flip:1,label:'Rückenansicht'}:absolute<65?{key:angle<0?'turn3':'turn1',flip:1,label:angle<0?'von hinten links':'von hinten rechts'}:{key:'turn4',flip:angle<0?-1:1,label:angle<0?'linke Seitenansicht':'rechte Seitenansicht'};
 if(!this.facing){this.facing=desired;this.changedAt=now;this.previousFacing=null}
 else if(this.facing.key!==desired.key||this.facing.flip!==desired.flip){this.previousFacing=this.facing;this.facing=desired;this.changedAt=now;}
 const blend=Math.min(1,Math.max(0,(now-this.changedAt)/170));
 const paint=(view,alpha)=>{if(!view||alpha<=0)return;const im=assets[view.key+'.png'],ih=157*scale,iw=im.width/im.height*ih;c.save();c.globalAlpha=alpha;c.translate(p.x,p.y-high);c.rotate(height?Math.sin(this.progress*Math.PI*2)*.035:0);c.scale(view.flip*sx,sy);c.drawImage(im,-iw/2,-ih,iw,ih);c.restore()};
 if(this.previousFacing&&blend<1)paint(this.previousFacing,1-blend);paint(this.facing,this.previousFacing?blend:1);
 crown(c,p.x,p.y-high-184*scale,scale,now);
 this.canvas.dataset.view=this.facing.label;this.canvas.dataset.directionAngle=angle.toFixed(1);

 // Exact result badge follows the actor, away from the numbered stone.
 const nowBadge=text('strong',Math.floor(this.progress+.001)+' Sätze','beachNow');nowBadge.style.left=Math.max(2,Math.min(72,(this.progress>=19||p.x>=460?p.x-210:p.x+50*scale)/900*100))+'%';nowBadge.style.top=((p.y-high-75*scale)/800*100)+'%';this.pins.append(nowBadge);

 this.canvas.setAttribute('aria-label','Strandweg von 0 bis 20 Sätzen. Würstchen bei '+Math.floor(this.progress)+' Sätzen. Bestwerte: '+topThree(this.state.attempts).map(a=>a.solved).join(', ')+'. Blickrichtung: '+this.facing.label+(this.canvas.dataset.treasure==='offen'?'. Schatztruhe offen, glitzernder Schatz.':'. Schatztruhe halb geöffnet.'));
 }
}
function renderRecent(root,attempts){root.replaceChildren();const a=recentThree(attempts);if(!a.length){root.append(text('p','Hier erscheinen deine letzten drei Ergebnisse.'));return}a.forEach(item=>{const el=document.createElement('article'),left=document.createElement('div');left.append(text('strong',item.solved+' Sätze geschafft'),text('span',repeatedText(item)));el.append(left,text('time',date(item)));root.append(el)})}
window.BeachJourney=BeachJourney;window.BeachStats={topThree,recentThree,renderRecent,valid,project,repeatedText,motivation};
})();
