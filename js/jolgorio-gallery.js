(()=>{
 document.querySelectorAll('.ej-gallery').forEach(root=>{
 const cards=[...root.querySelectorAll('button.ej-gallery-card')];if(!cards.length)return;
 const detail=root.querySelector('.ej-gallery-detail'),photo=detail.querySelector('img'),heading=detail.querySelector('h3');
 const close=detail.querySelector('.ej-gallery-close'),prev=detail.querySelector('.ej-gallery-prev'),next=detail.querySelector('.ej-gallery-next');
 const buy=detail.querySelector('.ej-gallery-buy');
 let index=0,previous=null,lastFocus=null,oldOverflow='',touchX=null,panX=0,panY=0,scale=1,pinchStart=0,initialScale=1,startX=0,startY=0,originX=0,originY=0,dragging=false,moved=false;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 function render(){photo.style.transform=`translate(${panX}px,${panY}px) scale(${scale})`;photo.setAttribute('aria-label',scale>1?'Restablecer botella':'Ampliar botella');detail.classList.toggle('is-zoomed',scale>1);}
 function reset(){scale=1;panX=panY=0;render();}
 function show(i){index=(i+cards.length)%cards.length;const card=cards[index];reset();photo.src=card.dataset.label;photo.alt='Botella completa de El Jolgorio '+card.dataset.name;heading.textContent=card.dataset.name;if(buy){buy.href=card.dataset.shop||"#";buy.hidden=!card.dataset.shop;}}
 function open(i){previous=cards[i];lastFocus=document.activeElement;oldOverflow=document.body.style.overflow;show(i);detail.hidden=false;document.body.style.overflow='hidden';close.focus();}
 function hide(){detail.hidden=true;document.body.style.overflow=oldOverflow;photo.removeAttribute('src');reset();(previous||lastFocus)?.focus();}
 cards.forEach((card,i)=>card.addEventListener('click',()=>open(i)));
 close.addEventListener('click',hide);prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
 photo.addEventListener('click',()=>{if(moved||pinchStart){moved=false;return;}if(scale>1)reset();else{scale=2.5;render();}});
 photo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();photo.click();}});
 photo.addEventListener('wheel',e=>{e.preventDefault();scale=clamp(scale+(e.deltaY<0?.3:-.3),1,4);if(scale===1)panX=panY=0;render();},{passive:false});
 detail.addEventListener('click',e=>{if(e.target===detail)hide();});
 photo.addEventListener('pointerdown',e=>{if(scale<=1)return;dragging=true;moved=false;startX=e.clientX;startY=e.clientY;originX=panX;originY=panY;photo.setPointerCapture(e.pointerId);});
 photo.addEventListener('pointermove',e=>{if(!dragging)return;if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>5)moved=true;panX=originX+e.clientX-startX;panY=originY+e.clientY-startY;render();});
 photo.addEventListener('pointerup',()=>dragging=false);photo.addEventListener('pointercancel',()=>dragging=false);
 photo.addEventListener('touchstart',e=>{if(e.touches.length===2){pinchStart=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);initialScale=scale;}},{passive:true});
 photo.addEventListener('touchmove',e=>{if(e.touches.length===2&&pinchStart){e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);scale=clamp(initialScale*d/pinchStart,1,4);if(scale===1)panX=panY=0;render();}},{passive:false});
 photo.addEventListener('touchend',()=>pinchStart=0,{passive:true});
 detail.addEventListener('touchstart',e=>{if(e.target===photo||scale>1)return;touchX=e.changedTouches[0].screenX;},{passive:true});
 detail.addEventListener('touchend',e=>{if(touchX===null||scale>1)return;const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>55)show(index+(delta<0?1:-1));touchX=null;},{passive:true});
 document.addEventListener('keydown',e=>{if(detail.hidden)return;if(e.key==='Escape'){hide();return;}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='+'||e.key==='='){scale=clamp(scale+.5,1,4);render();}if(e.key==='-'){scale=clamp(scale-.5,1,4);render();}if(e.key==='Tab'){const items=[close,prev,photo,buy,next].filter(Boolean),current=items.indexOf(document.activeElement);e.preventDefault();items[(current+(e.shiftKey?-1:1)+items.length)%items.length].focus();}});
 });
})();
