/* Casa Cortés — mapa mundial independiente. Países definidos mediante códigos ISO 3166-1 numéricos. */
const groups={
 america:[['484','México'],['840','Estados Unidos']],
 europe:[['276','Alemania'],['040','Austria'],['056','Bélgica'],['191','Croacia'],['250','Francia'],['372','Irlanda'],['380','Italia'],['528','Países Bajos'],['196','República de Chipre'],['752','Suecia'],['756','Suiza']],
 asia:[['158','Taiwán']],oceania:[['036','Australia']]
};
const importers={'484':'Casa Cortés','840':'Back Bar Project','276':'Right Spirits Germany','040':'Delicando Spirits','056':'ADS Group','191':'Fine Stvari','250':'Vintage Spirit Garage','372':'Comans Beverages','380':'Pallini','528':'Right Spirits','196':'Vassos Eliades','752':'Barkonsult','756':'Lean Services','158':'Drinking Life','036':'Mextrade'};
const all=Object.values(groups).flat();const names=new Map(all);const ids=new Set(names.keys());
let region='world',selected=null,features=[],path,projection,layer,svg;
let currentTransform=d3.zoomIdentity;
const center={world:[0,8],america:[-103,38],europe:[17,51],asia:[121,24],oceania:[134,-25]};
const regionZoom={world:1,america:2.25,europe:3.35,asia:5.2,oceania:3.4};
const width=1000,height=390;
function normalize(id){return String(id).padStart(3,'0')}
// world-atlas agrupa las regiones de ultramar bajo el mismo código ISO.
// Separamos los polígonos europeos para que los territorios lejanos
// conserven el color gris y no afecten al cálculo del zoom.
function splitEuropeanTerritories(feature){
 const id=normalize(feature.id);
 if(id!=='250'&&id!=='528')return [feature];
 const geom=feature.geometry;
 if(!geom||!['MultiPolygon','Polygon'].includes(geom.type))return [feature];
 const polys=geom.type==='MultiPolygon'?geom.coordinates:[geom.coordinates];
 const local=[],overseas=[];
 for(const poly of polys){
   const part={type:'Feature',geometry:{type:'Polygon',coordinates:poly},properties:feature.properties};
   const [lon,lat]=d3.geoCentroid(part);
   const inEurope=id==='250'?(lon>=-7&&lon<=12&&lat>=40&&lat<=52):(lon>=3&&lon<=8&&lat>=50&&lat<=54);
   (inEurope?local:overseas).push(poly);
 }
 const make=(parts,code)=>parts.length?{type:'Feature',id:code,properties:feature.properties,geometry:{type:'MultiPolygon',coordinates:parts}}:null;
 return [make(local,id),make(overseas,'overseas-'+id)].filter(Boolean);
}
// Mostrar únicamente los 48 estados contiguos en el mapa. Alaska, Hawái y
// demás territorios separados quedan fuera de la geometría visible y del zoom.
function mainlandUnitedStates(feature){
 if(normalize(feature.id)!=='840')return [feature];
 const g=feature.geometry;
 if(!g||!['MultiPolygon','Polygon'].includes(g.type))return [feature];
 const polygons=g.type==='MultiPolygon'?g.coordinates:[g.coordinates];
 const mainland=polygons.filter(poly=>{
   const f={type:'Feature',geometry:{type:'Polygon',coordinates:poly}};
   const [lon,lat]=d3.geoCentroid(f);
   return lon>=-125&&lon<=-66&&lat>=24&&lat<=50;
 });
 return mainland.length?[{...feature,geometry:{type:'MultiPolygon',coordinates:mainland}}]:[feature];
}
function showButtons(){const entries=region==='world'?all:groups[region];document.getElementById('countries').replaceChildren(...entries.map(([id,name])=>{const b=document.createElement('button');b.className='country'+(selected===id?' active':'');b.textContent=name;b.type='button';b.setAttribute('aria-pressed',String(selected===id));b.addEventListener('click',()=>selectCountry(id));return b}));document.getElementById('count').textContent=entries.length+' '+(entries.length===1?'país':'países');document.getElementById('countries-heading').textContent=region==='world'?'Presencia Global':{america:'América',europe:'Europa',asia:'Asia',oceania:'Oceanía'}[region]}
function updatePaths(){if(!layer)return;layer.selectAll('path').attr('class',d=>{const id=normalize(d.id);return 'country-path '+(selected===id?'selected':ids.has(id)?'present':'base')}).attr('aria-label',d=>names.get(normalize(d.id))||d.properties?.name||'País')}
function positionCallout(transform=currentTransform){
 const callout=d3.select('#map-callout');
 if(!selected||!importers[selected]||!path){callout.style('display','none').classed('visible',false);return}
 const f=features.find(d=>normalize(d.id)===selected);
 if(!f){callout.style('display','none');return}
 const centroid=path.centroid(f);
 if(!centroid.every(Number.isFinite)){callout.style('display','none');return}
 const [px,py]=transform.apply(centroid);
 const cardWidth=230,cardHeight=86;
 const x=Math.max(10,Math.min(width-cardWidth-10,px-cardWidth/2));
 // If near the upper edge, position the card below the marker.
 const below=py<120;
 const y=below?Math.min(height-cardHeight-8,py+24):Math.max(8,py-cardHeight-28);
 d3.select('#callout-box').attr('x',x).attr('y',y);
 d3.select('#callout-line').attr('d',`M${px},${py} L${Math.max(x+15,Math.min(x+cardWidth-15,px))},${below?y:y+cardHeight}`);
 d3.select('#callout-point').attr('cx',px).attr('cy',py);
 callout.style('display',null);
}
function animateTo(feature,reg){
 if(!layer)return;
 let tx=0,ty=0,k=1;
 if(feature && normalize(feature.id)==='840'){const pt=projection([-97,38]);tx=pt[0];ty=pt[1];k=2.8}
 else if(feature){const b=path.bounds(feature),dx=Math.max(1,b[1][0]-b[0][0]),dy=Math.max(1,b[1][1]-b[0][1]);k=Math.min(9,Math.max(1,Math.min(width*.42/dx,height*.54/dy)));tx=(b[0][0]+b[1][0])/2;ty=(b[0][1]+b[1][1])/2}
 else if(reg!=='world'){const pt=projection(center[reg]);tx=pt[0];ty=pt[1];k=regionZoom[reg]}
 else{tx=width/2;ty=height/2}
 const target=d3.zoomIdentity.translate(width/2,height/2).scale(k).translate(-tx,-ty);
 const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1050;
 const from=currentTransform;
 layer.interrupt();
 layer.transition().duration(duration).ease(d3.easeCubicInOut).attrTween('transform',()=>{
   // Interpolar directamente el zoom evita el alejamiento transitorio de interpolateZoom.
   const interp=d3.interpolateObject({x:from.x,y:from.y,k:from.k},{x:target.x,y:target.y,k:target.k});
   return t=>{const v=interp(t);currentTransform=d3.zoomIdentity.translate(v.x,v.y).scale(v.k);positionCallout(currentTransform);return currentTransform.toString()};
 }).on('end',()=>{currentTransform=target;positionCallout(target)});
}
function selectCountry(id){
 selected=id;
 
 document.getElementById('callout-country').textContent=(names.get(id)||'').toUpperCase();
 document.getElementById('callout-name').textContent=importers[id]||'';
 d3.select('#map-callout').classed('visible',!!importers[id]);
 showButtons();updatePaths();
 const activeButton=document.querySelector('#countries .country.active');
 if(activeButton && window.matchMedia('(max-width: 700px)').matches){
   const strip=document.getElementById('countries');
   const left=activeButton.offsetLeft-strip.offsetLeft-(strip.clientWidth-activeButton.offsetWidth)/2;
   strip.scrollTo({left:Math.max(0,left),behavior:'smooth'});
 }
 const f=features.find(d=>normalize(d.id)===id);
 if(f)animateTo(f,region);
}
function chooseRegion(next){region=next;selected=null;d3.select('#map-callout').style('display','none').classed('visible',false);document.querySelectorAll('.region').forEach(b=>{b.classList.toggle('active',b.dataset.region===next);b.setAttribute('aria-pressed',String(b.dataset.region===next))});showButtons();updatePaths();animateTo(null,next)}
document.querySelectorAll('.region').forEach(b=>b.addEventListener('click',()=>chooseRegion(b.dataset.region)));document.getElementById('reset').addEventListener('click',()=>chooseRegion('world'));showButtons();
async function init(){const loading=document.getElementById('loading');if(!window.d3||!window.topojson){loading.textContent='No se pudieron cargar las bibliotecas del mapa. Comprueba tu conexión.';return}try{
const response=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');if(!response.ok)throw new Error('HTTP '+response.status);const topology=await response.json();features=topojson.feature(topology,topology.objects.countries).features.flatMap(splitEuropeanTerritories).flatMap(mainlandUnitedStates);
svg=d3.select('#map');projection=d3.geoNaturalEarth1().fitExtent([[22,26],[width-22,height-24]],{type:'Sphere'});path=d3.geoPath(projection);layer=svg.select('#map-layer');layer.append('path').datum({type:'Sphere'}).attr('d',path).attr('fill','none');layer.selectAll('path.country-path').data(features).enter().append('path').attr('d',path).attr('tabindex',d=>ids.has(normalize(d.id))?0:null).attr('role',d=>ids.has(normalize(d.id))?'button':null).on('click',(e,d)=>{const id=normalize(d.id);if(ids.has(id))selectCountry(id)}).on('keydown',(e,d)=>{if((e.key==='Enter'||e.key===' ')&&ids.has(normalize(d.id))){e.preventDefault();selectCountry(normalize(d.id))}});updatePaths();loading.classList.add('hidden');
}catch(err){loading.textContent='No fue posible cargar el mapa. Revisa la conexión a Internet y vuelve a abrir la página.';console.error('Error al cargar mapa:',err)}}init();
