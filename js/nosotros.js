(()=>{const els=document.querySelectorAll('.reveal-n');if(!('IntersectionObserver'in window)){els.forEach(x=>x.classList.add('in'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(x=>io.observe(x));})();

(()=>{
  function makeDots(container,count,onPick){if(!container)return[];container.innerHTML='';return Array.from({length:count},(_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver ${i+1}`);b.addEventListener('click',()=>onPick(i));container.appendChild(b);return b})}
  const ps=document.querySelector('[data-slider="process"]');
  if(ps){const track=ps.querySelector('.process-track'),slides=[...ps.querySelectorAll('.process-slide')],dotsBox=ps.querySelector('.slider-dots');let i=0;let dots=[];const show=n=>{i=(n+slides.length)%slides.length;track.style.transform=`translateX(-${i*100}%)`;slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((d,j)=>d.classList.toggle('active',j===i))};dots=makeDots(dotsBox,slides.length,show);ps.querySelector('.prev').onclick=()=>show(i-1);ps.querySelector('.next').onclick=()=>show(i+1);show(0);let x=0;track.addEventListener('pointerdown',e=>x=e.clientX);track.addEventListener('pointerup',e=>{const dx=e.clientX-x;if(Math.abs(dx)>45)show(i+(dx<0?1:-1))})}
  const copies=[...document.querySelectorAll('.community-copy')],masters=[...document.querySelectorAll('.masters')],hotspots=[...document.querySelectorAll('.map-hotspot')],box=document.querySelector('.community-copy-slider'),dotsBox=document.querySelector('.community-dots');
  if(copies.length&&box){let i=0;let dots=[];const show=n=>{i=(n+copies.length)%copies.length;const key=copies[i].dataset.community;copies.forEach((x,j)=>x.classList.toggle('active',j===i));masters.forEach(x=>x.classList.toggle('active',x.dataset.masters===key));hotspots.forEach(x=>x.classList.toggle('active',x.dataset.target===key));dots.forEach((d,j)=>d.classList.toggle('active',j===i))};dots=makeDots(dotsBox,copies.length,show);box.querySelector('.prev').onclick=()=>show(i-1);box.querySelector('.next').onclick=()=>show(i+1);hotspots.forEach(h=>h.addEventListener('click',()=>show(copies.findIndex(c=>c.dataset.community===h.dataset.target))));let x=0;box.addEventListener('pointerdown',e=>x=e.clientX);box.addEventListener('pointerup',e=>{const dx=e.clientX-x;if(Math.abs(dx)>45)show(i+(dx<0?1:-1))});show(0)}
})();

// En pantallas táctiles, el toque reproduce el hover de las marcas de cada maestro.
(()=>{const cards=[...document.querySelectorAll('.master-card')];cards.forEach(card=>{card.tabIndex=0;card.addEventListener('click',()=>{const open=!card.classList.contains('is-open');cards.forEach(c=>c.classList.remove('is-open'));if(open)card.classList.add('is-open')})})})();

// V9 — navegación integrada de comunidades, maestros y mapa
(()=>{
 const pages=[...document.querySelectorAll('[data-community-page]')];
 if(!pages.length)return;
 const order=pages.map(p=>p.dataset.communityPage);
 const allHotspots=[...document.querySelectorAll('.communities-v9 .map-hotspot')];
 const current=document.querySelector('.travel-current');
 const miniPoint=document.querySelector('.mini-point');
 const modal=document.querySelector('#communityMapModal');
 const coords={matatlan:['52.7%','56.5%'],guelavila:['56%','58.5%'],ejutla:['44%','63.5%'],sanluis:['59%','62%'],zoquitlan:['54.5%','66.5%'],rioseco:['56.5%','68%'],lachigui:['48%','72%'],sola:['39.5%','67%']};
 let i=0, touchX=0;
 const show=(n,opts={})=>{
   i=(n+pages.length)%pages.length; const key=order[i];
   pages.forEach((p,j)=>{const on=j===i;p.classList.toggle('active',on);p.setAttribute('aria-hidden',String(!on))});
   allHotspots.forEach(h=>h.classList.toggle('active',h.dataset.target===key));
   if(current)current.textContent=i+1;
   if(miniPoint&&coords[key]){miniPoint.style.left=coords[key][0];miniPoint.style.top=coords[key][1]}
   if(opts.scroll && window.innerWidth<=800) document.querySelector('.communities-v9')?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 document.querySelector('.travel-prev')?.addEventListener('click',()=>show(i-1,{scroll:true}));
 document.querySelector('.travel-next')?.addEventListener('click',()=>show(i+1,{scroll:true}));
 allHotspots.forEach(h=>h.addEventListener('click',()=>{const n=order.indexOf(h.dataset.target);if(n>=0){show(n,{scroll:true});if(modal){modal.hidden=true;document.body.style.overflow=''}}}));
 document.querySelectorAll('.read-more').forEach(b=>b.addEventListener('click',()=>{const s=b.closest('.community-story');const on=s.classList.toggle('expanded');b.textContent=on?'Leer menos':'Leer más';b.setAttribute('aria-expanded',String(on))}));
 document.querySelector('.explore-map')?.addEventListener('click',()=>{if(modal){modal.hidden=false;document.body.style.overflow='hidden'}});
 document.querySelectorAll('[data-close-map]').forEach(b=>b.addEventListener('click',()=>{modal.hidden=true;document.body.style.overflow=''}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden){modal.hidden=true;document.body.style.overflow=''}});
 const content=document.querySelector('.community-v9-content');
 content?.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 content?.addEventListener('touchend',e=>{if(e.target.closest('.masters,.mini-map,button'))return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>70)show(i+(dx<0?1:-1),{scroll:true})},{passive:true});
 show(0);
})();
