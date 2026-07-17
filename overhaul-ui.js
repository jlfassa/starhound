/* STARHOUND 0.8 // OVERHAUL DE INTERFAZ Y BASE MÓVIL */
STARHOUND.version = "0.8.0";
const SH_UI = { agenteVista: 0, contratoVista: 0, filtroContrato: "TODOS", mapaCapa: "RUTAS" };

function shEsc(v){return String(v??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function shVolverMapa(){ shIr("mapa"); }
function shBotonVolver(label="VOLVER AL MAPA"){return `<button class="sh-back" data-sh-back>← ${label}</button>`;}
function shBindBack(){document.querySelectorAll("[data-sh-back]").forEach(b=>b.onclick=shVolverMapa);}

function shInstalarInterfaz(){
  shPerfilMundo();
  const nav=document.querySelector(".navegacion-starhound");
  if(nav) nav.innerHTML=`
    <div class="sh-nav-marca">SH<span>08</span></div>
    <button data-sh="mapa"><i>✦</i><span>CARTA TÁCTICA</span></button>
    <button data-sh="base"><i>▰</i><span>FLEET CARRIER</span></button>
    <button data-sh="explorar"><i>⌖</i><span>SUPERFICIE</span></button>
    <div class="sh-nav-separador">CAZADOR</div>
    <button data-sh="cazador"><i>◉</i><span>IDENTIDAD</span></button>
    <button data-sh="contratos"><i>▤</i><span>CONTRATOS</span></button>
    <button data-sh="caso"><i>◫</i><span>CASO ACTIVO</span></button>
    <button data-sh="deduccion"><i>◇</i><span>DEDUCCIÓN</span></button>
    <button data-sh="archivo"><i>▦</i><span>ARCHIVO CRIMINAL</span></button>
    <div class="sh-nav-separador">LOGÍSTICA</div>
    <button data-sh="inventario"><i>▥</i><span>INVENTARIO</span></button>
    <button data-sh="sistemas"><i>⚙</i><span>SISTEMAS</span></button>
    <button data-sh="perfil"><i>◎</i><span>PERFIL / SAVE</span></button>`;
  document.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>shIr(b.dataset.sh));
  shActualizarBarraEstrategica(); shIr("mapa");
}

function shIr(destino){
  SH_MUNDO.pantallaAnterior=destino;
  document.querySelectorAll("[data-sh]").forEach(b=>b.classList.toggle("activo",b.dataset.sh===destino));
  const p=shPerfilMundo(), planeta=STARHOUND.ubicacion||buscarPlaneta(p.mundo.planeta)||obtenerPlanetas()[0];
  const rutas={mapa:shRenderMapa,base:shRenderFleetCarrier,explorar:()=>shRenderDistrito(planeta),cazador:renderAgentes,contratos:renderContratos,caso:()=>STARHOUND.casoActivo?renderCaso():shRenderSinCaso(),deduccion:()=>STARHOUND.casoActivo?abrirTableroDeduccion():shRenderSinCaso(),archivo:renderArchivo,inventario:shRenderInventario,sistemas:shRenderSistemasNave,perfil:renderPerfil};
  (rutas[destino]||shRenderMapa)(); shActualizarBarraEstrategica();
}

renderAgentes=function(){
  const agentes=obtenerAgentes(); SH_UI.agenteVista=Math.min(SH_UI.agenteVista,agentes.length-1); const a=agentes[SH_UI.agenteVista];
  const id=obtenerIdAgente(a), unlocked=STARHOUND.perfil.agentesDesbloqueados.includes(id), activo=obtenerIdAgente(STARHOUND.agente)===id;
  shPantalla().innerHTML=`<section class="sh-selector-rpg">
    <header>${shBotonVolver()}<div><span>DOSSIER DE PERSONAL // ${String(SH_UI.agenteVista+1).padStart(2,"0")}/${String(agentes.length).padStart(2,"0")}</span><h1>SELECCIÓN DE CAZADOR</h1><p>Inspeccioná el expediente. Nada se confirma hasta pulsar ASIGNAR IDENTIDAD.</p></div><button class="sh-close" data-sh-back>×</button></header>
    <div class="sh-selector-body"><aside class="sh-roster">${agentes.map((x,i)=>`<button data-agent-i="${i}" class="${i===SH_UI.agenteVista?"activo":""} ${!STARHOUND.perfil.agentesDesbloqueados.includes(obtenerIdAgente(x))?"locked":""}"><i>${String(i+1).padStart(2,"0")}</i><span>${shEsc(obtenerNombre(x))}<small>${shEsc(x.alias||x.clase||x.rol||"RASTREADOR")}</small></span></button>`).join("")}</aside>
    <main class="sh-dossier"><div class="sh-agent-visual"><div class="sh-agent-scan"></div><strong>${shEsc((a.alias||obtenerNombre(a)).slice(0,2).toUpperCase())}</strong><span>${unlocked?"LICENCIA VÁLIDA":"EXPEDIENTE RESTRINGIDO"}</span></div>
    <div class="sh-agent-data"><span class="sh-kicker">${shEsc(a.origen||"FRONTERA HELIOS")} // ${shEsc(a.especialidad||a.clase||"CAZA")}</span><h2>${shEsc(obtenerNombre(a))}</h2><h3>«${shEsc(a.alias||a.frase||"SIN ALIAS REGISTRADO") }»</h3><p>${shEsc(obtenerDescripcion(a))}</p>
    <div class="sh-stat-grid"><article><small>ESPECIALIDAD</small><b>${shEsc(a.especialidad||a.rol||a.clase||"RASTREO")}</b></article><article><small>PASIVA</small><b>${shEsc(a.habilidadPasiva?.nombre||a.habilidad||a.perk||"PROTOCOLO ESTÁNDAR")}</b></article><article><small>DESVENTAJA</small><b>${shEsc(a.desventaja||"SIN REGISTRO")}</b></article><article><small>ESTADO</small><b>${activo?"ACTIVO":unlocked?"DISPONIBLE":"BLOQUEADO"}</b></article></div>
    <div class="sh-selector-actions"><button data-sh-back>CANCELAR</button><button id="sh-agent-confirm" class="primary" ${!unlocked?"disabled":""}>${activo?"IDENTIDAD ACTIVA":"ASIGNAR IDENTIDAD"}</button></div></div></main></div></section>`;
  shBindBack(); document.querySelectorAll("[data-agent-i]").forEach(b=>b.onclick=()=>{SH_UI.agenteVista=+b.dataset.agentI;renderAgentes();});
  const confirm=document.getElementById("sh-agent-confirm"); if(confirm&&unlocked)confirm.onclick=()=>{STARHOUND.agente=a;ALMACEN_STARHOUND.guardar();notificar(`${obtenerNombre(a)} // IDENTIDAD ASIGNADA`);shIr("contratos");};
};

renderContratos=function(){
  if(!STARHOUND.agente){renderAgentes();return;}
  const todos=obtenerContratos(); const cats=["TODOS",...new Set(todos.map(c=>String(c.categoria||"OTROS").toUpperCase()))];
  const lista=SH_UI.filtroContrato==="TODOS"?todos:todos.filter(c=>String(c.categoria||"OTROS").toUpperCase()===SH_UI.filtroContrato);
  SH_UI.contratoVista=Math.min(SH_UI.contratoVista,Math.max(0,lista.length-1)); const c=lista[SH_UI.contratoVista]||todos[0]; const nivel=c.nivelMinimo||c.nivel_minimo||c.nivel||1; const disponible=STARHOUND.perfil.nivel>=nivel;
  shPantalla().innerHTML=`<section class="sh-selector-rpg sh-contract-browser"><header>${shBotonVolver()}<div><span>BOUNTY NETWORK // ENLACE CIFRADO</span><h1>RED DE CONTRATOS</h1><p>Filtrá señales, inspeccioná el briefing y aceptá sólo cuando estés listo.</p></div><button class="sh-close" data-sh-back>×</button></header>
  <div class="sh-contract-filters">${cats.map(x=>`<button data-contract-filter="${shEsc(x)}" class="${x===SH_UI.filtroContrato?"activo":""}">${shEsc(x)}</button>`).join("")}</div>
  <div class="sh-selector-body"><aside class="sh-roster sh-contract-list">${lista.map((x,i)=>{const req=x.nivelMinimo||x.nivel_minimo||x.nivel||1;return `<button data-contract-i="${i}" class="${i===SH_UI.contratoVista?"activo":""} ${STARHOUND.perfil.nivel<req?"locked":""}"><i>${shEsc(x.dificultad||"D")}</i><span>${shEsc(obtenerNombre(x))}<small>${shEsc(x.categoria||"CONTRATO")} · ${x.recompensa||x.creditos||300} CR</small></span></button>`}).join("")}</aside>
  <main class="sh-dossier sh-contract-dossier"><div class="sh-contract-visual"><span>SEÑAL</span><b>${shEsc(c.dificultad||"D")}</b><small>AMENAZA</small></div><div class="sh-agent-data"><span class="sh-kicker">${shEsc(c.categoria||"CONTRATO")} // CT-${String(todos.indexOf(c)+1).padStart(3,"0")}</span><h2>${shEsc(obtenerNombre(c))}</h2><p class="sh-briefing">${shEsc(c.briefing||obtenerDescripcion(c))}</p><div class="sh-stat-grid"><article><small>RECOMPENSA</small><b>${c.recompensa||c.creditos||300} CR</b></article><article><small>VENTANA</small><b>${c.horas||c.tiempo||c.limite||72} H</b></article><article><small>LICENCIA</small><b>NIVEL ${nivel}</b></article><article><small>ESTADO</small><b>${disponible?"AUTORIZADO":"RESTRINGIDO"}</b></article></div><div class="sh-selector-actions"><button data-sh-back>CANCELAR</button><button id="sh-contract-confirm" class="primary" ${!disponible?"disabled":""}>ACEPTAR CONTRATO</button></div></div></main></div></section>`;
  shBindBack(); document.querySelectorAll("[data-contract-i]").forEach(b=>b.onclick=()=>{SH_UI.contratoVista=+b.dataset.contractI;renderContratos();}); document.querySelectorAll("[data-contract-filter]").forEach(b=>b.onclick=()=>{SH_UI.filtroContrato=b.dataset.contractFilter;SH_UI.contratoVista=0;renderContratos();});
  const confirm=document.getElementById("sh-contract-confirm"); if(confirm&&disponible)confirm.onclick=()=>aceptarContrato(c);
};

function shRenderFleetCarrier(){
 const p=shPerfilMundo(); p.base ||= {nombre:"NIDO-01",nivel:1,energia:64,hangar:1,modulos:["CENTRO DE OPERACIONES","TALLER DE CAMPO"]};
 const mods=[{id:"ops",n:"CENTRO DE OPERACIONES",d:"Amplía capacidad de contratos y análisis de señales.",cost:900},{id:"hangar",n:"HANGAR AUXILIAR",d:"Reserva espacio para futuras naves y drones.",cost:1400},{id:"intel",n:"NODO DE INTELIGENCIA",d:"Cruce pasivo de hechos y archivos criminales.",cost:1800},{id:"med",n:"MÓDULO MÉDICO",d:"Recuperación y tratamiento entre operaciones.",cost:1100},{id:"cargo",n:"BODEGA BLINDADA",d:"Inventario ampliado y carga de contrabando incautado.",cost:1250},{id:"relay",n:"RELÉ DE FRONTERA",d:"Mejora navegación y lectura de sectores remotos.",cost:2200}];
 shPantalla().innerHTML=`<section class="sh-base-screen"><header>${shBotonVolver()}<div><span>FLEET CARRIER // BASE PERSISTENTE</span><h1>${shEsc(p.base.nombre)}</h1><p>Tu hogar, taller y centro de caza. La base permanece entre contratos.</p></div></header><div class="sh-base-grid"><div class="sh-base-art"><div class="sh-carrier"><i></i><b></b><span></span></div><div class="sh-base-telemetry"><span>REACTOR <b>${p.base.energia}%</b></span><span>NIVEL <b>${p.base.nivel}</b></span><span>HANGAR <b>${p.base.hangar}/4</b></span><span>CRÉDITOS <b>${p.creditos}</b></span></div></div><main><h2>PLANO DE CUBIERTAS</h2><div class="sh-module-grid">${mods.map(m=>{const on=p.base.modulos.includes(m.n);return `<article class="${on?"online":""}"><span>${on?"ONLINE":"PROYECTO"}</span><h3>${m.n}</h3><p>${m.d}</p><button data-base-module="${m.id}" ${on||p.creditos<m.cost?"disabled":""}>${on?"INSTALADO":`${m.cost} CR // CONSTRUIR`}</button></article>`}).join("")}</div></main></div></section>`;
 shBindBack(); document.querySelectorAll("[data-base-module]").forEach(b=>b.onclick=()=>{const m=mods.find(x=>x.id===b.dataset.baseModule);if(!m||p.creditos<m.cost)return;p.creditos-=m.cost;p.base.modulos.push(m.n);p.base.nivel++;shGuardar();notificar(`${m.n} // CONSTRUCCIÓN COMPLETA`);shRenderFleetCarrier();});
}

// Corrige el zoom: la cámara mueve el universo, pero etiquetas y nodos conservan tamaño legible.
const _shRenderMapa08=shRenderMapa;
shRenderMapa=function(){
 _shRenderMapa08(); const vista=SH_MUNDO.vistaMapa, universo=document.getElementById("sh-mapa-universo"), viewport=document.getElementById("sh-mapa-viewport"); if(!universo||!viewport)return;
 const sync=()=>{universo.style.setProperty("--sh-inv-zoom",String(1/vista.escala)); universo.style.setProperty("--sh-zoom",String(vista.escala)); const label=document.getElementById("sh-zoom-label");if(label)label.textContent=`${Math.round(vista.escala*100)}%`;}; sync();
 const obs=new MutationObserver(sync);obs.observe(universo,{attributes:true,attributeFilter:["style"]});
 const toolbar=document.querySelector(".sh-mapa-toolbar"); if(toolbar){const layers=document.createElement("div");layers.className="sh-map-layers";layers.innerHTML=`<button class="activo">RUTAS</button><button>SEÑALES</button><button>CONTRATOS</button><button>FRONTERA</button>`;toolbar.insertBefore(layers,toolbar.lastElementChild);}
};
