/* Casa Cortés: GA4 y Clarity, sujetos a consentimiento de analítica. */
(function(){'use strict';
  var GA='G-S2N3CRLDQT', CLARITY='ytplaykx5q', loaded=false, clarityLoaded=false;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
  // El estado por defecto deniega almacenamiento y señales publicitarias.
  window.gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});
  function addScript(url){var s=document.createElement('script');s.async=true;s.src=url;document.head.appendChild(s)}
  // Modo avanzado: GA4 carga con almacenamiento denegado desde el inicio.
  window.gtag('js',new Date());
  window.gtag('config',GA,{'send_page_view':true});
  addScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA));
  function enable(){
    window.gtag('consent','update',{'analytics_storage':'granted'});
    loaded=true;
    if(clarityLoaded)return;
    clarityLoaded=true;
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,'clarity','script',CLARITY);
    window.clarity('consentv2',{'analytics_Storage':'granted','ad_Storage':'denied'});
  }
  function disable(){
    window.gtag('consent','update',{'analytics_storage':'denied'});
    loaded=false;
    if(clarityLoaded){
      // Reiniciar la página para retirar la biblioteca de Clarity tras revocación.
      ['_ga','_gid','_gat','_ga_'+GA.slice(2),'_clck','_clsk'].forEach(function(name){
        document.cookie=name+'=; Max-Age=0; path=/';
        var parts=location.hostname.split('.');
        if(parts.length>=2)document.cookie=name+'=; Max-Age=0; path=/; domain=.'+parts.slice(-2).join('.');
      });
      location.reload();
    }
  }
  window.addEventListener('cc:privacy-updated',function(e){if(e.detail&&e.detail.analytics)enable();else disable()});
  if(window.ccPrivacyPreferences){if(window.ccPrivacyPreferences.analytics)enable();else disable();}
  document.addEventListener('click',function(e){
    if(!loaded)return;
    var a=e.target.closest('a[href]');if(!a)return;
    var href=a.href||'';
    if(a.classList.contains('footer-shop-link')||a.classList.contains('nav-shop-link')||/casacortes\.mx\/ecommerce\/?/.test(href))
      window.gtag('event','click_tienda',{'link_url':href,'page_location':location.href});
    else if(/wa\.me\//.test(href))window.gtag('event','click_whatsapp',{'link_url':href});
  },true);
})();
