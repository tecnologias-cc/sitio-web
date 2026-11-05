/* Preferencias de privacidad Casa Cortés: aviso no intrusivo y posterior a la verificación de edad. */
(function(){'use strict';
const KEY='ccPrivacyConsentV1',TTL=180*24*60*60*1000;
const panel=document.getElementById('cc-privacy-panel');if(!panel)return;
const options=document.getElementById('cc-privacy-options'),a=document.getElementById('cc-analytics'),m=document.getElementById('cc-marketing'),save=document.getElementById('cc-save'),config=document.getElementById('cc-configure');
const gate=document.getElementById('ageGate');
function ageOpen(){return !!(gate&&!gate.hidden);}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');const t=Date.parse(v?.updated);return v&&typeof v.analytics==='boolean'&&typeof v.marketing==='boolean'&&Number.isFinite(t)&&Date.now()>=t&&Date.now()-t<TTL?v:null}catch(e){return null}}
function dispatch(v){window.ccPrivacyPreferences={analytics:!!v.analytics,marketing:!!v.marketing};window.dispatchEvent(new CustomEvent('cc:privacy-updated',{detail:window.ccPrivacyPreferences}));}
function persist(v){try{localStorage.setItem(KEY,JSON.stringify({analytics:!!v.analytics,marketing:!!v.marketing,updated:new Date().toISOString()}))}catch(e){}dispatch(v);panel.hidden=true;}
function open(){const v=read();a.checked=v?!!v.analytics:false;m.checked=v?!!v.marketing:false;options.hidden=true;save.hidden=true;config.hidden=false;panel.hidden=ageOpen();}
function showWhenEligible(){if(!read()&&!ageOpen())open();}
document.getElementById('cc-reject').addEventListener('click',()=>persist({analytics:false,marketing:false}));
document.getElementById('cc-accept').addEventListener('click',()=>persist({analytics:true,marketing:false}));
config.addEventListener('click',()=>{options.hidden=false;save.hidden=false;config.hidden=true;});
save.addEventListener('click',()=>persist({analytics:a.checked,marketing:m.checked}));
document.querySelectorAll('[data-cc-privacy-open]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open();}));
const stored=read();if(stored)dispatch(stored);else showWhenEligible();
if(gate){new MutationObserver(()=>{if(ageOpen())panel.hidden=true;else showWhenEligible()}).observe(gate,{attributes:true,attributeFilter:['hidden']});}
})();
