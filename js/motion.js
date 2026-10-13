/* Scroll-triggered motion; never hides content if IntersectionObserver is unavailable. */
(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))return;
  const main=document.querySelector('main');if(!main)return;
  const selectors=[
    ['h1,h2,h3', 'cc-reveal-title'],
    ['p', 'cc-reveal-copy'],
    ['.brand-card,.master-card,.experience-grid article,.ag-process li,.ag-collection nav a', 'cc-reveal-group'],
    ['.ag-product-art > img,.ns-product-art > img,.ns-product-image img,.soledad-product-art img', 'cc-reveal-bottle']
  ];
  const targets=[];
  selectors.forEach(([selector,cls])=>main.querySelectorAll(selector).forEach(el=>{
    if(el.closest('.ag-hero,.n-hero,.hero,.ns-hero,.age-gate,.ag-product-details,.ag-notes,.ag-tasting,.ns-tasting,.map-wrap,.interactive-oaxaca'))return;
    if(el.matches('p') && (el.closest('button,a') || el.textContent.trim().length<20))return;
    if(el.matches('h1,h2,h3') && el.closest('.ag-product-details'))return;
    if(el.classList.contains('cc-reveal-title')||el.classList.contains('cc-reveal-copy')||el.classList.contains('cc-reveal-group')||el.classList.contains('cc-reveal-bottle'))return;
    el.classList.add(cls);targets.push(el);
  }));
  main.querySelectorAll('.ag-product-art > img,.ns-product-art > img,.ns-product-image img,.soledad-product-art img').forEach(el=>{
    if(!el.classList.contains('cc-reveal-bottle')){el.classList.add('cc-reveal-bottle');targets.push(el)}
  });
  if(!targets.length)return;
  document.documentElement.classList.add('cc-motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('cc-inview');observer.unobserve(entry.target);
  }),{threshold:0.08,rootMargin:'0px 0px 45px 0px'});
  targets.forEach(el=>{
    if(el.classList.contains('cc-reveal-group')){
      const siblings=Array.from(el.parentElement.children).filter(e=>e.classList.contains('cc-reveal-group'));
      el.style.setProperty('--cc-stagger',Math.min(siblings.indexOf(el)%5*110,440)+'ms');
    }
    observer.observe(el);
  });
})();
