// Componentes globales — seguros para todas las páginas del sitio.
(()=>{
  const header=document.querySelector('#header');
  if(header) addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30));

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Abrir menú');
    }));
  }

  // Galería de Inicio. Solo se inicializa cuando existe en la página.
  const track=document.querySelector('.track');
  if(track){
    let slide=0;
    const slides=[...track.children];
    const dots=[...document.querySelectorAll('.gallery-dots button')];
    const next=document.querySelector('.next');
    const prev=document.querySelector('.prev');
    const galleryMode=()=>innerWidth<=800?'mobile':'desktop';
    const show=(n,animate=true)=>{
      if(!slides.length)return;
      slide=(n+slides.length)%slides.length;
      slides.forEach((el,i)=>el.classList.toggle('active',i===slide));
      dots.forEach((el,i)=>el.classList.toggle('active',i===slide));
      const pct=galleryMode()==='mobile'?slide*100:slide*80;
      track.style.transition=animate?'transform .55s cubic-bezier(.22,.61,.36,1)':'none';
      track.style.transform=`translateX(-${pct}%)`;
    };
    if(next) next.addEventListener('click',()=>show(slide+1));
    if(prev) prev.addEventListener('click',()=>show(slide-1));
    dots.forEach(d=>d.addEventListener('click',()=>show(+d.dataset.slide)));
    let startX=null;
    track.addEventListener('pointerdown',e=>{if(galleryMode()==='mobile')startX=e.clientX});
    track.addEventListener('pointerup',e=>{
      if(startX===null)return;
      const dx=e.clientX-startX;
      if(Math.abs(dx)>45)show(slide+(dx<0?1:-1));
      startX=null;
    });
    addEventListener('resize',()=>show(slide,false));
    show(0,false);
  }

  document.querySelectorAll('.brand-card').forEach(card=>card.addEventListener('click',()=>{
    document.querySelectorAll('.brand-card').forEach(c=>c!==card&&c.classList.remove('active'));
    card.classList.toggle('active');
  }));

  const info=document.querySelector('.country-info');
  if(info){
    document.querySelectorAll('.map-buttons button').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.map-buttons button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      info.innerHTML=`<strong>${btn.dataset.country}</strong><span>${btn.dataset.info}</span>`;
    }));
  }

  // Confirmación de mayoría de edad, compartida por todo el sitio.
  const gate=document.querySelector('#ageGate');
  const yes=document.querySelector('#ageYes');
  const no=document.querySelector('#ageNo');
  if(gate&&yes&&no){
    const key='casaCortesAgeVerified';
    let verified=false;
    try{verified=localStorage.getItem(key)==='yes'}catch(e){}
    const closeGate=()=>{gate.hidden=true;document.body.classList.remove('age-locked')};
    if(verified) closeGate();
    else {
      requestAnimationFrame(()=>yes.focus());
      yes.addEventListener('click',()=>{
        try{localStorage.setItem(key,'yes')}catch(e){}
        closeGate();
      });
      no.addEventListener('click',()=>window.location.href='https://www.google.com/');
    }
  }

  const world=document.querySelector('#mundo');
  const worldNext=document.querySelector('#worldNext');
  const worldBack=document.querySelector('#worldBack');
  if(world&&worldNext&&worldBack){
    worldNext.addEventListener('click',()=>world.classList.add('show-map'));
    worldBack.addEventListener('click',()=>world.classList.remove('show-map'));
  }

  // Tap en móvil para Mezcalogía / Casa Pina.
  const cards=[...document.querySelectorAll('.experience-grid article')];
  cards.forEach(card=>{
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    card.setAttribute('aria-expanded','false');
    const toggleCard=()=>{
      if(window.innerWidth>800)return;
      const willOpen=!card.classList.contains('active');
      cards.forEach(c=>{c.classList.remove('active');c.setAttribute('aria-expanded','false')});
      if(willOpen){card.classList.add('active');card.setAttribute('aria-expanded','true')}
    };
    card.addEventListener('click',e=>{if(window.innerWidth<=800&&!e.target.closest('a'))toggleCard()});
    card.addEventListener('keydown',e=>{
      if(window.innerWidth<=800&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggleCard()}
    });
  });
})();
