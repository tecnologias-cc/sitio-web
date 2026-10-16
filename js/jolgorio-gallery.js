(()=>{
 const root=document.querySelector('.ej-gallery');if(!root)return;
 const cards=[...root.querySelectorAll('.ej-gallery-card')];
 const detail=root.querySelector('.ej-gallery-detail'),photo=detail.querySelector('img'),heading=detail.querySelector('h3');
 const close=detail.querySelector('.ej-gallery-close'),prev=detail.querySelector('.ej-gallery-prev'),next=detail.querySelector('.ej-gallery-next');
 let index=0,previous=null,lastFocus=null,oldOverflow='',touchX=null;
 function show(i){index=(i+cards.length)%cards.length;const card=cards[index];photo.src=card.dataset.label;photo.alt='Botella completa de El Jolgorio '+card.dataset.name;heading.textContent=card.dataset.name;}
 function open(i){previous=cards[i];lastFocus=document.activeElement;oldOverflow=document.body.style.overflow;show(i);detail.hidden=false;document.body.style.overflow='hidden';close.focus();}
 function hide(){detail.hidden=true;document.body.style.overflow=oldOverflow;photo.removeAttribute('src');(previous||lastFocus)?.focus();}
 cards.forEach((card,i)=>card.addEventListener('click',()=>open(i)));
 close.addEventListener('click',hide);prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
 detail.addEventListener('click',e=>{if(e.target===detail)hide();});
 detail.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;},{passive:true});
 detail.addEventListener('touchend',e=>{if(touchX===null)return;const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>55)show(index+(delta<0?1:-1));touchX=null;},{passive:true});
 document.addEventListener('keydown',e=>{if(detail.hidden)return;if(e.key==='Escape'){hide();return;}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='Tab'){const items=[close,prev,next],current=items.indexOf(document.activeElement);e.preventDefault();items[(current+(e.shiftKey?-1:1)+items.length)%items.length].focus();}});
})();
