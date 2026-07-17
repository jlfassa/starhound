/* STARHOUND // MUNDO PERSISTENTE 0.6 — CINTA NEGRA */
STARHOUND.version = "0.6.0";

const SH_MUNDO = {
  pantallaAnterior: "nave",
  lugar: null,
  npc: null,
  visita: 0,
  perfilesClave: "starhound_slots_v1",
  slotActivoClave: "starhound_slot_activo_v1"
};

const LUGARES_BASE = [
  ["puerto","PUERTO ORBITAL","Llegadas, carga, transpondedores y gente que evita mirar a Aduana.","▥"],
  ["cantina","CANTINA","Alcohol sintético, mesas de cartas y rumores vendidos dos veces.","♠"],
  ["mercado","MERCADO DE CHATARRA","Piezas sin serie, mapas usados y favores en efectivo.","⌁"],
  ["taller","TALLER DE MOTORES","Aceite negro, bobinas calientes y naves con nombres falsos.","⚙"],
  ["aduana","ADUANA","Manifiestos, cámaras y funcionarios que recuerdan demasiado.","▤"],
  ["subnivel","SUBNIVEL","Conductos de servicio, puertas clausuradas y señal residual.","⌄"]
];

const NPC_BASE = {
  puerto:[["operador","OPERADOR DE MUELLE","Controla atraques y transpondedores."],["piloto","PILOTO DE CARGA","Lleva tres noches sin dormir."],["estibador","ESTIBADOR 9-K","Ve cajas. Nunca hace preguntas gratis."]],
  cantina:[["barman","BARMAN","Recuerda vasos, deudas y caras."],["jugadora","JUGADORA DEL FONDO","Protege sus fichas como secretos."],["informante","INFORMANTE SIN PLACA","Dice conocer a todos. Probablemente miente."]],
  mercado:[["chatarrera","CHATARRERA","Compra piezas con números limados."],["cartografo","VENDEDOR DE MAPAS","Tiene rutas que no figuran en navegación."],["corredor","CORREDOR DE DATOS","Habla en precios y silencios."]],
  taller:[["mecanica","MECÁNICA","Reconoce un motor por el temblor del piso."],["aprendiz","APRENDIZ","Mira demasiado y entiende más de lo que dice."],["dron","DRON DE DIAGNÓSTICO","Su memoria local no fue purgada."]],
  aduana:[["inspectora","INSPECTORA","Tiene acceso a manifiestos restringidos."],["archivero","ARCHIVERO","Odia el desorden más que el delito."],["guardia","GUARDIA DE TURNO","Quiere terminar su turno sin incidentes."]],
  subnivel:[["vagabundo","HABITANTE DEL CONDUCTO","Escucha las tuberías y el tránsito."],["terminal","TERMINAL HUÉRFANA","Nodo viejo todavía conectado a algo."],["rastreador","RASTREADOR RIVAL","También sigue una recompensa."]]
};

function shHash(texto){ return [...String(texto)].reduce((a,c)=>((a*31)+c.charCodeAt(0))>>>0,2166136261); }
function shPerfilMundo(){
  const p=STARHOUND.perfil;
  p.mundo ||= {sistema:"frontera_helios", planeta:null, lugar:null, dia:1, turno:"NOCHE", semilla:shHash(p.nombre||"CAZADOR")};
  p.inventario ||= ["PLACA STARHOUND","COMUNICADOR MK-I"];
  p.nave ||= {nombre:"SABUESO-01", clase:"COURIER", combustible:100, casco:100, modulos:["NAVEGACIÓN","ARCHIVO","COMUNICACIONES"]};
  p.hechos ||= {};
  p.npcsConocidos ||= {};
  p.historialMundo ||= [];
  return p;
}

function shGuardar(){ shPerfilMundo(); ALMACEN_STARHOUND.guardar(); }
function shPantalla(){ return document.getElementById("pantalla-starhound"); }

function shMarco(etiqueta,titulo,texto=""){
 return `<div class="sh-marco"><span class="etiqueta-terminal">${etiqueta}</span><h2>${titulo}</h2>${texto?`<p>${texto}</p>`:""}</div>`;
}

function shInstalarInterfaz(){
  shPerfilMundo();
  const nav=document.querySelector(".navegacion-starhound");
  if(nav) nav.innerHTML=`
    <button data-sh="nave">NAVE</button><button data-sh="mapa">MAPA</button>
    <button data-sh="contratos">CONTRATOS</button><button data-sh="archivo">ARCHIVO</button>
    <button data-sh="perfil">PERFIL</button>`;
  document.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>shIr(b.dataset.sh));
  const subt=document.querySelector(".marca-subtitulo"); if(subt) subt.textContent="LICENCIA DE FRONTERA // RED DE CAZA HELIOS";
  shIr("nave");
}

function shIr(destino){
  SH_MUNDO.pantallaAnterior=destino;
  document.querySelectorAll("[data-sh]").forEach(b=>b.classList.toggle("activo",b.dataset.sh===destino));
  const rutas={nave:shRenderNave,mapa:shRenderMapa,contratos:renderContratos,archivo:renderArchivo,perfil:renderPerfil};
  (rutas[destino]||shRenderNave)(); window.scrollTo(0,0);
}

function shRenderNave(){
 const p=shPerfilMundo(), planeta=STARHOUND.ubicacion||buscarPlaneta(p.mundo.planeta)||obtenerPlanetas()[0];
 if(planeta&&!p.mundo.planeta)p.mundo.planeta=obtenerIdPlaneta(planeta);
 shPantalla().innerHTML=`
 <section class="sh-cabina">
  <div class="sh-ventanal"><div class="sh-estrellas"></div><div class="sh-planeta"></div><div class="sh-hud-vidrio">POS // ${obtenerNombre(planeta)}<br>DAY ${String(p.mundo.dia).padStart(3,"0")} // ${p.mundo.turno}</div></div>
  <div class="sh-consola">
   <div class="sh-crt">${shMarco("STARHOUND OS // MK-II",p.nave.nombre,"COURIER DE CAZA // ENLACE DE FRONTERA ESTABLE")}
    <div class="sh-menu-nave">
      <button data-accion="contratos">RED DE CONTRATOS <small>SEÑALES DE RECOMPENSA</small></button>
      <button data-accion="mapa">NAVEGACIÓN <small>SISTEMAS Y DESCENSO</small></button>
      <button data-accion="archivo">ARCHIVO CRIMINAL <small>HECHOS, NO PORCENTAJES</small></button>
      <button data-accion="explorar">DESCENDER A ${obtenerNombre(planeta)} <small>EXPLORACIÓN LOCAL</small></button>
    </div>
   </div>
   <aside class="sh-telemetria"><b>CASCO ${p.nave.casco}%</b><span>COMBUSTIBLE ${p.nave.combustible}%</span><span>CR ${p.creditos}</span><span>${STARHOUND.casoActivo?"CONTRATO ACTIVO":"SIN OBJETIVO"}</span></aside>
  </div>
 </section>`;
 shPantalla().querySelectorAll("[data-accion]").forEach(b=>b.onclick=()=>{
   if(b.dataset.accion==="explorar") shRenderDistrito(planeta); else shIr(b.dataset.accion);
 });
}

function shRenderMapa(){
 const p=shPerfilMundo();
 shPantalla().innerHTML=`${shMarco("NAVEGACIÓN // CARTA HELIOS","MAPA ESTELAR","No hay destino correcto marcado. Viajás por información, costo y criterio.")}
 <div class="sh-mapa">${obtenerPlanetas().map((pl,i)=>`<button class="sh-sistema ${obtenerIdPlaneta(pl)===p.mundo.planeta?"actual":""}" data-planeta="${obtenerIdPlaneta(pl)}" style="--x:${12+(shHash(obtenerIdPlaneta(pl))%76)}%;--y:${12+((shHash(obtenerIdPlaneta(pl)+"y"))%70)}%"><i></i><b>${obtenerNombre(pl)}</b><small>${pl.country||pl.sector||"FRONTERA"}</small></button>`).join("")}</div>
 <div id="sh-mapa-info" class="sh-panel-inferior">SELECCIONÁ UNA SEÑAL ESTELAR.</div>`;
 document.querySelectorAll(".sh-sistema").forEach(b=>b.onclick=()=>{
  const pl=buscarPlaneta(b.dataset.planeta); const info=document.getElementById("sh-mapa-info");
  info.innerHTML=`<b>${obtenerNombre(pl)}</b><p>${obtenerDescripcion(pl)}</p><button id="sh-viajar" class="boton-terminal boton-principal">TRAZAR SALTO // 8% COMBUSTIBLE</button>`;
  document.getElementById("sh-viajar").onclick=()=>shViajar(pl);
 });
}

function shViajar(planeta){
 const p=shPerfilMundo(); if(p.nave.combustible<8){notificar("COMBUSTIBLE INSUFICIENTE");return;}
 p.nave.combustible-=8; p.mundo.planeta=obtenerIdPlaneta(planeta); p.mundo.lugar=null; p.mundo.dia+=1; STARHOUND.ubicacion=planeta;
 if(STARHOUND.casoActivo){consumirHoras(4); comprobarTiempo();}
 shGuardar(); notificar(`SALTO COMPLETADO // ${obtenerNombre(planeta)}`); shRenderNave();
}

function shLugares(planeta){ return LUGARES_BASE.map((l,i)=>({id:`${obtenerIdPlaneta(planeta)}_${l[0]}`,tipo:l[0],nombre:l[1],descripcion:l[2],icono:l[3],riesgo:1+(shHash(obtenerIdPlaneta(planeta)+l[0])%5)})); }

function shRenderDistrito(planeta=STARHOUND.ubicacion||buscarPlaneta(shPerfilMundo().mundo.planeta)){
 const p=shPerfilMundo(); p.mundo.planeta=obtenerIdPlaneta(planeta); shGuardar();
 shPantalla().innerHTML=`${shMarco(`SUPERFICIE // ${planeta.country||"FRONTERA"}`,obtenerNombre(planeta),obtenerDescripcion(planeta))}
 <div class="sh-distrito"><div class="sh-calle-fondo"><span>${obtenerNombre(planeta).toUpperCase()}</span></div>
 <div class="sh-lugares">${shLugares(planeta).map(l=>`<button class="sh-lugar" data-lugar="${l.id}"><i>${l.icono}</i><b>${l.nombre}</b><small>${l.descripcion}</small><em>RUIDO ${l.riesgo}/5</em></button>`).join("")}</div></div>
 <button id="sh-volver-nave" class="boton-terminal">↑ REGRESAR A LA NAVE</button>`;
 document.querySelectorAll(".sh-lugar").forEach(b=>b.onclick=()=>shEntrarLugar(planeta,shLugares(planeta).find(l=>l.id===b.dataset.lugar)));
 document.getElementById("sh-volver-nave").onclick=shRenderNave;
}

function shNpcs(lugar,planeta){ return (NPC_BASE[lugar.tipo]||NPC_BASE.puerto).map((n,i)=>({id:`${obtenerIdPlaneta(planeta)}_${lugar.tipo}_${n[0]}`,nombre:n[1],descripcion:n[2],indice:i})); }
function shEntrarLugar(planeta,lugar){
 const p=shPerfilMundo(); p.mundo.lugar=lugar.id; SH_MUNDO.lugar=lugar; shGuardar();
 const npcs=shNpcs(lugar,planeta);
 shPantalla().innerHTML=`<section class="sh-escena sh-${lugar.tipo}"><div class="sh-escena-cabecera"><button id="sh-atras-distrito" class="boton-volver">← CALLE</button><span>${obtenerNombre(planeta)} // ${lugar.nombre}</span></div>
 <div class="sh-ambiente"><div class="sh-neon">${lugar.icono}</div><h1>${lugar.nombre}</h1><p>${lugar.descripcion}</p></div>
 <div class="sh-npcs">${npcs.map(n=>`<button class="sh-npc" data-npc="${n.id}"><span class="sh-silueta">${n.nombre.slice(0,1)}</span><b>${n.nombre}</b><small>${n.descripcion}</small></button>`).join("")}</div>
 <div id="sh-interaccion" class="sh-interaccion">MOVETE. OBSERVÁ. NO TODA PERSONA ES UNA PISTA.</div></section>`;
 document.getElementById("sh-atras-distrito").onclick=()=>shRenderDistrito(planeta);
 document.querySelectorAll(".sh-npc").forEach(b=>b.onclick=()=>shHablar(planeta,lugar,npcs.find(n=>n.id===b.dataset.npc)));
}

function shHechoPara(planeta,lugar,npc){
 const objetivo=STARHOUND.sospechoso; if(!objetivo) return null;
 const sem=shHash(`${obtenerIdSospechoso(objetivo)}:${npc.id}:${STARHOUND.perfil.mundo.semilla}`);
 const hechos=[
  ["nave",objetivo.nave,`Vi una nave clase ${objetivo.nave||"desconocida"}. El transpondedor parpadeaba como si estuviera puenteado.`],
  ["rasgo",objetivo.rasgo,`No vi bien la cara. Sí recuerdo ${String(objetivo.rasgo||"un rasgo extraño").toLowerCase()}.`],
  ["especie",objetivo.especie,`No puedo jurarlo, pero parecía ${objetivo.especie||"no humana"}.`],
  ["afiliacion",objetivo.afiliacion,`Escuché el nombre «${objetivo.afiliacion||"una banda"}» en una transmisión corta.`],
  ["especialidad",objetivo.especialidad,`Lo que hicieron acá huele a ${String(objetivo.especialidad||"trabajo profesional").toLowerCase()}.`]
 ].filter(h=>h[1]);
 return (sem%100)<58 ? hechos[sem%hechos.length] : null;
}

function shHablar(planeta,lugar,npc){
 const zona=document.getElementById("sh-interaccion"), p=shPerfilMundo(), hecho=shHechoPara(planeta,lugar,npc); p.npcsConocidos[npc.id]=true;
 const desafio=lugar.tipo==="cantina"&&npc.indice===1?"cartas":lugar.tipo==="subnivel"&&npc.indice===1?"hack":null;
 zona.innerHTML=`<div class="sh-dialogo"><span>${npc.nombre}</span><p>«${hecho?hecho[2]:"No sé nada de tu recompensa. Pero si buscás problemas, elegiste bien el lugar."}»</p>
 <div class="sh-decisiones">${hecho?`<button id="sh-registrar" class="boton-terminal boton-principal">REGISTRAR HECHO</button>`:""}${desafio?`<button id="sh-contextual" class="boton-terminal">${desafio==="cartas"?"SENTARSE A LA MESA":"ACCEDER A TERMINAL"}</button>`:""}<button id="sh-observar" class="boton-terminal">OBSERVAR</button><button id="sh-irse" class="boton-terminal">TERMINAR CONVERSACIÓN</button></div></div>`;
 if(hecho) document.getElementById("sh-registrar").onclick=()=>shRegistrarHecho(hecho,npc,planeta,lugar);
 if(desafio) document.getElementById("sh-contextual").onclick=()=>shDesafioContextual(desafio,hecho,npc,planeta,lugar);
 document.getElementById("sh-observar").onclick=()=>{zona.querySelector("p").textContent=`${npc.nombre} evita mirar hacia ${["las cámaras","la salida","su comunicador","el muelle"][shHash(npc.id)%4]}. No sabés todavía si significa algo.`;};
 document.getElementById("sh-irse").onclick=()=>zona.textContent="CONVERSACIÓN TERMINADA // EL MUNDO SIGUE MOVIÉNDOSE."; shGuardar();
}

function shRegistrarHecho(hecho,npc,planeta,lugar){
 const p=shPerfilMundo(), objetivo=STARHOUND.sospechoso, oid=obtenerIdSospechoso(objetivo), clave=`${oid}:${hecho[0]}`;
 if(p.hechos[clave]){notificar("HECHO YA REGISTRADO");return;}
 p.hechos[clave]={objetivo:oid,tipo:hecho[0],valor:hecho[1],texto:hecho[2],fuente:npc.nombre,lugar:lugar.nombre,planeta:obtenerNombre(planeta),certeza:"PROBABLE",fecha:`DÍA ${p.mundo.dia}`};
 const pista={id:`hecho_${clave}`,tipo:"identity",propiedad:hecho[0],valor:hecho[1],texto:hecho[2]}; STARHOUND.pistas.push(pista); STARHOUND.pistasIdentidad.push(pista);
 if(typeof actualizarArchivoSospechoso==="function") actualizarArchivoSospechoso(pista); recalcularIdentidad(); consumirHoras(1); shGuardar(); notificar(`HECHO REGISTRADO // ${String(hecho[0]).toUpperCase()}`);
 document.getElementById("sh-interaccion").innerHTML=`<div class="sh-hecho-confirmado"><b>ARCHIVO ACTUALIZADO</b><p>${hecho[2]}</p><small>FUENTE // ${npc.nombre} · CERTEZA PROBABLE</small></div>`;
}

function shDesafioContextual(tipo,hecho,npc,planeta,lugar){
 iniciarPruebaInvestigacion({prueba:tipo,minijuego:tipo,dificultad:2,nombre:tipo==="cartas"?"MESA DEL FONDO":"TERMINAL HUÉRFANA"}, exito=>{
   if(exito&&hecho) shRegistrarHecho(hecho,npc,planeta,lugar); else { consumirHoras(2); shGuardar(); notificar(exito?"NO HABÍA INFORMACIÓN ÚTIL":"INTERVENCIÓN FALLIDA // -2 H"); shEntrarLugar(planeta,lugar); }
 });
}

const _renderArchivo06=renderArchivo;
renderArchivo=function(){
 const p=shPerfilMundo(); if(!STARHOUND.casoActivo) return _renderArchivo06();
 const obj=STARHOUND.sospechoso, oid=obtenerIdSospechoso(obj), hechos=Object.values(p.hechos).filter(h=>h.objetivo===oid);
 shPantalla().innerHTML=`${shMarco("ARCHIVO // OBJETIVO ACTIVO","EXPEDIENTE DE CAMPO","El sistema conserva hechos y fuentes. La deducción sigue siendo tuya.")}
 <div class="sh-expediente"><aside><div class="sh-ficha-sombra">?</div><b>OBJETIVO EN INVESTIGACIÓN</b><small>${hechos.length} HECHOS REGISTRADOS</small><button id="sh-archivo-general" class="boton-terminal">REGISTRO GALÁCTICO</button></aside>
 <main><h3>HECHOS CONFIRMADOS / PROBABLES</h3>${hechos.length?hechos.map(h=>`<article class="sh-hecho"><span>${h.tipo.toUpperCase()} // ${h.certeza}</span><b>${h.valor}</b><p>${h.texto}</p><small>${h.planeta} · ${h.lugar} · FUENTE ${h.fuente}</small></article>`).join(""):`<div class="sh-vacio">SIN HECHOS. BAJÁ A SUPERFICIE Y HABLÁ CON EL MUNDO.</div>`}
 <div class="sh-candidatos"><h3>CRUCE MANUAL</h3><p>Compará estos datos con criminales conocidos. STARHOUND no elegirá al culpable por vos.</p><button id="sh-deduccion" class="boton-terminal boton-principal">ABRIR TABLERO DE DEDUCCIÓN</button></div></main></div>`;
 document.getElementById("sh-archivo-general").onclick=_renderArchivo06;
 document.getElementById("sh-deduccion").onclick=abrirTableroDeduccion;
};

// El flujo lineal queda disponible como compatibilidad, pero el caso vuelve al hub de nave.
const _aceptarContrato06=aceptarContrato;
aceptarContrato=function(contrato){ _aceptarContrato06(contrato); const p=shPerfilMundo(); p.mundo.planeta=obtenerIdPlaneta(STARHOUND.ubicacion); shGuardar(); setTimeout(shRenderNave,0); };

window.addEventListener("load",()=>setTimeout(shInstalarInterfaz,30));

/* =========================================================
   STARHOUND 0.7 // CARTA TÁCTICA
   Interfaz estratégica compacta y mapa interactivo.
   ========================================================= */

STARHOUND.version = "0.7.0";
SH_MUNDO.vistaMapa ||= { escala: 1, x: 0, y: 0, seleccionado: null };

function shActualizarBarraEstrategica() {
  const p = shPerfilMundo();
  const planeta = STARHOUND.ubicacion || buscarPlaneta(p.mundo.planeta) || obtenerPlanetas()[0];
  const cabecera = document.querySelector(".barra-starhound");
  if (!cabecera) return;
  cabecera.innerHTML = `
    <div class="sh-top-identidad"><b>STARHOUND</b><span>FRONTERA HELIOS // ${STARHOUND.version}</span></div>
    <div class="sh-recursos">
      <span title="Créditos"><i>CR</i><b id="ui-creditos">${p.creditos || 0}</b></span>
      <span title="Combustible"><i>FUEL</i><b>${p.nave.combustible}%</b></span>
      <span title="Casco"><i>HULL</i><b>${p.nave.casco}%</b></span>
      <span title="Nivel"><i>LV</i><b id="ui-nivel">${p.nivel || 1}</b></span>
      <span title="Rango"><i>RANK</i><b id="ui-rango">${obtenerRangoActual?.()?.nombre || p.rango || "CADETE"}</b></span>
      <span title="Posición"><i>POS</i><b>${obtenerNombre(planeta)}</b></span>
      <span title="Ciclo"><i>DAY</i><b>${String(p.mundo.dia).padStart(3,"0")}</b></span>
    </div>`;
}

function shInstalarInterfaz() {
  shPerfilMundo();
  const nav = document.querySelector(".navegacion-starhound");
  if (nav) nav.innerHTML = `
    <div class="sh-nav-marca">SH<span>OS</span></div>
    <button data-sh="mapa"><i>⌘</i><span>MAPA ESTELAR</span></button>
    <button data-sh="nave"><i>▣</i><span>CABINA</span></button>
    <button data-sh="explorar"><i>⌖</i><span>SUPERFICIE</span></button>
    <div class="sh-nav-separador">OPERACIÓN</div>
    <button data-sh="contratos"><i>▤</i><span>CONTRATOS</span></button>
    <button data-sh="caso"><i>◫</i><span>CASO ACTIVO</span></button>
    <button data-sh="deduccion"><i>◇</i><span>DEDUCCIÓN</span></button>
    <button data-sh="archivo"><i>▦</i><span>ARCHIVO</span></button>
    <div class="sh-nav-separador">SABUESO-01</div>
    <button data-sh="inventario"><i>▥</i><span>INVENTARIO</span></button>
    <button data-sh="sistemas"><i>⚙</i><span>SISTEMAS NAVE</span></button>
    <button data-sh="perfil"><i>◉</i><span>PERFIL</span></button>`;
  document.querySelectorAll("[data-sh]").forEach(b => b.onclick = () => shIr(b.dataset.sh));
  shActualizarBarraEstrategica();
  shIr("mapa");
}

function shIr(destino) {
  SH_MUNDO.pantallaAnterior = destino;
  document.querySelectorAll("[data-sh]").forEach(b => b.classList.toggle("activo", b.dataset.sh === destino));
  const p = shPerfilMundo();
  const planeta = STARHOUND.ubicacion || buscarPlaneta(p.mundo.planeta) || obtenerPlanetas()[0];
  const rutas = {
    mapa: shRenderMapa,
    nave: shRenderNave,
    explorar: () => shRenderDistrito(planeta),
    contratos: renderContratos,
    caso: () => STARHOUND.casoActivo ? renderCaso() : shRenderSinCaso(),
    deduccion: () => STARHOUND.casoActivo ? abrirTableroDeduccion() : shRenderSinCaso(),
    archivo: renderArchivo,
    inventario: shRenderInventario,
    sistemas: shRenderSistemasNave,
    perfil: renderPerfil
  };
  (rutas[destino] || shRenderMapa)();
  shActualizarBarraEstrategica();
  window.scrollTo(0, 0);
}

function shRenderSinCaso() {
  shPantalla().innerHTML = `${shMarco("RED DE CAZA // SIN ENLACE", "NO HAY CONTRATO ACTIVO", "Aceptá una señal de recompensa antes de abrir herramientas operativas.")}
  <button class="boton-terminal boton-principal" id="sh-ir-contratos">ABRIR RED DE CONTRATOS</button>`;
  document.getElementById("sh-ir-contratos").onclick = () => shIr("contratos");
}

function shRenderInventario() {
  const p = shPerfilMundo();
  shPantalla().innerHTML = `${shMarco("CARGA // MANIFIESTO PERSONAL", "INVENTARIO", "Equipo físico registrado en la nave y sobre el cazador.")}
  <div class="sh-grid-compacta">${p.inventario.map((item, i) => `<article class="sh-modulo"><span>ITEM ${String(i + 1).padStart(2,"0")}</span><b>${item}</b><small>REGISTRO LOCAL // DISPONIBLE</small></article>`).join("")}</div>`;
}

function shRenderSistemasNave() {
  const p = shPerfilMundo();
  shPantalla().innerHTML = `${shMarco("SABUESO-01 // DIAGNÓSTICO", p.nave.nombre, `${p.nave.clase} // TELEMETRÍA LOCAL`)}
  <div class="sh-grid-compacta">
    <article class="sh-modulo"><span>CASCO</span><b>${p.nave.casco}%</b><div class="sh-mini-bar"><i style="width:${p.nave.casco}%"></i></div></article>
    <article class="sh-modulo"><span>COMBUSTIBLE</span><b>${p.nave.combustible}%</b><div class="sh-mini-bar"><i style="width:${p.nave.combustible}%"></i></div></article>
    ${p.nave.modulos.map(m => `<article class="sh-modulo"><span>MÓDULO</span><b>${m}</b><small>ONLINE</small></article>`).join("")}
  </div>`;
}

function shCoordenadasMapa() {
  return obtenerPlanetas().map(pl => ({
    pl,
    id: obtenerIdPlaneta(pl),
    x: 90 + (shHash(obtenerIdPlaneta(pl)) % 1120),
    y: 70 + (shHash(obtenerIdPlaneta(pl) + "y") % 650)
  }));
}

function shConexionesMapa(nodos) {
  const conexiones = [];
  nodos.forEach((a, i) => {
    const cercanos = nodos.filter((_, j) => j !== i).map(b => ({b, d: Math.hypot(a.x-b.x,a.y-b.y)})).sort((u,v)=>u.d-v.d).slice(0, 2);
    cercanos.forEach(({b}) => {
      const clave = [a.id,b.id].sort().join("|");
      if (!conexiones.some(c => c.clave === clave)) conexiones.push({clave,a,b});
    });
  });
  return conexiones;
}

function shRenderMapa() {
  const p = shPerfilMundo();
  const nodos = shCoordenadasMapa();
  const conexiones = shConexionesMapa(nodos);
  const vista = SH_MUNDO.vistaMapa;
  shPantalla().innerHTML = `
    <section class="sh-carta-tactica">
      <div class="sh-mapa-toolbar">
        <div><b>CARTA HELIOS</b><span>RED DE NAVEGACIÓN DE FRONTERA</span></div>
        <div class="sh-mapa-controles"><button data-zoom="menos">−</button><b id="sh-zoom-label">${Math.round(vista.escala*100)}%</b><button data-zoom="mas">+</button><button data-zoom="reset">CENTRAR</button></div>
      </div>
      <div class="sh-mapa-viewport" id="sh-mapa-viewport">
        <div class="sh-mapa-universo" id="sh-mapa-universo" style="transform:translate(${vista.x}px,${vista.y}px) scale(${vista.escala})">
          <svg class="sh-rutas" viewBox="0 0 1300 800" preserveAspectRatio="none">${conexiones.map(c=>`<line x1="${c.a.x}" y1="${c.a.y}" x2="${c.b.x}" y2="${c.b.y}" />`).join("")}</svg>
          ${nodos.map((n,i) => `<button class="sh-nodo-estelar ${n.id===p.mundo.planeta?"actual":""} ${vista.seleccionado===n.id?"seleccionado":""}" data-planeta="${n.id}" style="left:${n.x}px;top:${n.y}px"><i></i><span>${obtenerNombre(n.pl)}</span><small>${n.pl.country || n.pl.sector || "FRONTERA"}</small><em>${String(i+1).padStart(2,"0")}</em></button>`).join("")}
        </div>
        <div class="sh-coordenadas">X ${Math.round(-vista.x)} // Y ${Math.round(-vista.y)} // Z ${vista.escala.toFixed(2)}</div>
        <aside class="sh-mapa-inspector" id="sh-mapa-info"><span>SELECCIÓN</span><b>NINGUNA SEÑAL</b><p>SIN OBJETIVO FIJADO // El inspector mostrará telemetría y acciones cuando marques una señal estelar.</p></aside>
      </div>
      <footer class="sh-mapa-leyenda"><span><i class="actual"></i> POSICIÓN ACTUAL</span><span><i></i> SISTEMA REGISTRADO</span><span>RUTAS = VECTORES DE SALTO CONOCIDOS</span></footer>
    </section>`;

  const viewport = document.getElementById("sh-mapa-viewport");
  const universo = document.getElementById("sh-mapa-universo");
  const aplicar = () => { universo.style.transform = `translate(${vista.x}px,${vista.y}px) scale(${vista.escala})`; const z=document.getElementById("sh-zoom-label"); if(z)z.textContent=`${Math.round(vista.escala*100)}%`; };
  const zoom = (delta, cx=viewport.clientWidth/2, cy=viewport.clientHeight/2) => {
    const anterior=vista.escala; vista.escala=Math.max(.65,Math.min(2.4,vista.escala+delta));
    const ratio=vista.escala/anterior; vista.x=cx-(cx-vista.x)*ratio; vista.y=cy-(cy-vista.y)*ratio; aplicar();
  };
  viewport.onwheel = e => { e.preventDefault(); const r=viewport.getBoundingClientRect(); zoom(e.deltaY<0?.12:-.12,e.clientX-r.left,e.clientY-r.top); };
  let arrastrando=false, sx=0, sy=0, ox=0, oy=0;
  viewport.onpointerdown=e=>{ if(e.target.closest(".sh-nodo-estelar,.sh-mapa-inspector,button"))return; arrastrando=true;sx=e.clientX;sy=e.clientY;ox=vista.x;oy=vista.y;viewport.setPointerCapture(e.pointerId);viewport.classList.add("arrastrando"); };
  viewport.onpointermove=e=>{ if(!arrastrando)return;vista.x=ox+e.clientX-sx;vista.y=oy+e.clientY-sy;aplicar(); };
  viewport.onpointerup=()=>{arrastrando=false;viewport.classList.remove("arrastrando");};
  document.querySelectorAll("[data-zoom]").forEach(b=>b.onclick=()=>{ if(b.dataset.zoom==="mas")zoom(.15); else if(b.dataset.zoom==="menos")zoom(-.15); else {vista.escala=1;vista.x=0;vista.y=0;aplicar();} });
  document.querySelectorAll(".sh-nodo-estelar").forEach(b=>b.onclick=()=>{
    vista.seleccionado=b.dataset.planeta; document.querySelectorAll(".sh-nodo-estelar").forEach(n=>n.classList.toggle("seleccionado",n===b));
    const pl=buscarPlaneta(b.dataset.planeta); const actual=obtenerIdPlaneta(pl)===p.mundo.planeta; const info=document.getElementById("sh-mapa-info");
    info.innerHTML=`<span>SISTEMA SELECCIONADO</span><b>${obtenerNombre(pl)}</b><small>${pl.country||pl.sector||"FRONTERA HELIOS"}</small><p>${obtenerDescripcion(pl)}</p><div class="sh-inspector-acciones">${actual?`<button id="sh-descender" class="boton-terminal boton-principal">DESCENDER</button>`:`<button id="sh-viajar" class="boton-terminal boton-principal">TRAZAR SALTO // 8 FUEL</button>`}<button id="sh-fijar" class="boton-terminal">FIJAR MARCADOR</button></div>`;
    const viajar=document.getElementById("sh-viajar"); if(viajar)viajar.onclick=()=>shViajar(pl);
    const descender=document.getElementById("sh-descender"); if(descender)descender.onclick=()=>shRenderDistrito(pl);
    document.getElementById("sh-fijar").onclick=()=>notificar(`MARCADOR TÁCTICO // ${obtenerNombre(pl)}`);
  });
}
