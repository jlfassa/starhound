(()=>{"use strict";
const VERSION="1.0.1";
const PASOS=[
{sel:".app-starhound",t:"01 // TU PUESTO DE MANDO",x:"Ésta es la vista general de STARHOUND. Pensala como el escritorio del Fleet Carrier: barra superior, navegación lateral y área central. Todo el juego se opera desde esta máquina."},
{sel:".barra-starhound",t:"02 // BARRA DE ESTADO",x:"Esto no es decoración. Es el resumen vivo de tu operación. Aunque cambies de pantalla, esta franja te dice si todavía podés seguir cazando."},
{sel:".sh-recursos span:nth-child(1)",t:"03 // CRÉDITOS",x:"CR paga naves, reparaciones y módulos. Una recompensa grande puede no convenirte si el viaje y los daños cuestan más."},
{sel:".sh-recursos span:nth-child(2)",t:"04 // COMBUSTIBLE",x:"FUEL limita tu movilidad. Si no llegás a un sistema, tendrás que preparar otra nave, conseguir combustible o hacer una salida corta."},
{sel:".sh-recursos span:nth-child(3)",t:"05 // CASCO",x:"HULL es la integridad de tu nave activa. Eventos, piratas y malas decisiones pueden dañarla."},
{sel:".sh-recursos span:nth-child(4),.sh-recursos span:nth-child(5)",t:"06 // LICENCIA Y RANGO",x:"Tu nivel y rango representan progreso profesional. Más adelante abrirán contratos, equipo y sectores."},
{sel:".sh-recursos span:nth-child(6),.sh-recursos span:nth-child(7)",t:"07 // POSICIÓN Y CICLO",x:"POS indica dónde estás. DAY registra el avance del mundo. La frontera no debería sentirse congelada mientras vos jugás."},
{sel:".navegacion-starhound",t:"08 // CONSOLA LATERAL",x:"Éste es el índice de la computadora. Cada botón abre una función del Carrier. Ahora voy a mostrarte qué significa cada una, sin obligarte a entrar."},
{sel:'[data-sh="mapa"]',t:"09 // CARTA TÁCTICA",x:"Tu vista macro. Acá ves sistemas y rutas. El mapa es el mundo; no es una lista de niveles."},
{sel:'[data-sh="base"]',t:"10 // FLEET CARRIER",x:"Tu base persistente. Construís infraestructura y mejorás el lugar al que siempre regresás."},
{sel:'[data-sh="hangar"]',t:"11 // HANGAR",x:"Tus naves viven acá. Cada casco sirve para una logística distinta: rango, tanque, resistencia y bodega."},
{sel:'[data-sh="explorar"]',t:"12 // SUPERFICIE",x:"Cuando descendés, la escala cambia. Investigás lugares concretos, hablás con fuentes y enfrentás eventos locales."},
{sel:'[data-sh="cazador"]',t:"13 // IDENTIDAD",x:"Tu cazador define especialidad, pasiva y desventaja. Podés inspeccionar expedientes antes de asignar uno."},
{sel:'[data-sh="contratos"]',t:"14 // CONTRATOS",x:"La red de recompensas. Revisá briefing, dificultad, tiempo y pago antes de aceptar."},
{sel:'[data-sh="caso"]',t:"15 // CASO ACTIVO",x:"Cuando aceptás un contrato, su operación vive acá. Es el centro de la investigación actual."},
{sel:'[data-sh="deduccion"]',t:"16 // DEDUCCIÓN",x:"El tablero cruza lo que aprendiste. La máquina organiza; vos decidís qué hipótesis tiene sentido."},
{sel:'[data-sh="archivo"]',t:"17 // ARCHIVO CRIMINAL",x:"Tu Pokédex criminal. Evidencias, procedencia y conocimiento acumulado quedan registrados acá."},
{sel:'[data-sh="inventario"]',t:"18 // INVENTARIO",x:"Recursos y objetos físicos. La bodega y la logística harán que no puedas cargar con todo."},
{sel:'[data-sh="sistemas"]',t:"19 // SISTEMAS",x:"Estado técnico de la nave y sus capacidades. Los módulos podrán cambiar opciones durante eventos."},
{sel:'[data-sh="perfil"]',t:"20 // PERFIL Y SAVE",x:"Tu progreso persistente. Desde acá podés revisar la partida y reiniciar esta guía."},
{sel:".sh-mapa-toolbar",t:"21 // CABECERA DE LA CARTA",x:"Volvemos al centro. Esta cabecera identifica la carta y concentra controles de navegación."},
{sel:".sh-map-layers",t:"22 // CAPAS TÁCTICAS",x:"Rutas, señales, contratos y frontera son capas de lectura. La idea es mirar el mismo espacio con información distinta."},
{sel:".sh-mapa-controles",t:"23 // ZOOM Y CENTRADO",x:"Estos controles mueven la escala del mapa. También podés usar la rueda sobre la carta."},
{sel:"#sh-mapa-viewport",t:"24 // EL MAPA ES INTERACTIVO",x:"Arrastrá el fondo para desplazar la carta. Los puntos son sistemas reales del juego. Todavía no selecciones nada: primero terminemos la guía."},
{sel:".sh-nodo-estelar.actual",t:"25 // TU POSICIÓN",x:"El sistema marcado como actual es donde se encuentra tu operación. Desde ahí calculás el siguiente movimiento."},
{sel:"#sh-mapa-info",t:"26 // INSPECTOR DE SISTEMA",x:"Cuando selecciones una estrella, este panel mostrará nombre, sector, descripción y acciones posibles. El texto que veías de «seleccioná un sistema» pertenece a este inspector, no al tutorial."},
{sel:".sh-mapa-leyenda",t:"27 // LEYENDA",x:"La leyenda explica posición, sistemas y vectores conocidos. No necesitás memorizarla: está siempre al pie de la carta."},
{sel:".app-starhound",t:"28 // FIN DE INDUCCIÓN",x:"Ya viste la máquina completa de macro a micro. Ahora sí: elegí identidad, revisá un contrato y empezá tu primera caza. EL MUNDO ES TUYO."}
];
let i=0,activo=false,obj=null,observer=null;
const $=s=>document.querySelector(s);
function estado(){let p=typeof shPerfilMundo==="function"?shPerfilMundo():STARHOUND.perfil;p.tutorialSpotlight||={};return p.tutorialSpotlight}
function guardar(){try{typeof shGuardar==="function"?shGuardar():ALMACEN_STARHOUND.guardar()}catch(e){}}
function visible(e){if(!e)return false;let r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>3&&r.height>3&&c.display!=="none"&&c.visibility!=="hidden"}
function buscar(s){return [...document.querySelectorAll(s)].find(visible)||null}
function montar(){if($("#sh-tour-v101"))return;let e=document.createElement("div");e.id="sh-tour-v101";e.className="sh-tour101 oculto";e.innerHTML=`<div class="sh101-dim"></div><div class="sh101-hole"></div><section class="sh101-card"><header><b>C9</b><div><strong>CLIP-9</strong><small>INDUCCIÓN DE CONSOLA</small></div><button id="sh101-salir" title="Cerrar">×</button></header><main><small id="sh101-num"></small><h2 id="sh101-titulo"></h2><p id="sh101-texto"></p></main><footer><button id="sh101-ant">ANTERIOR</button><button id="sh101-sig">SIGUIENTE</button></footer></section>`;document.body.appendChild(e);$("#sh101-ant").onclick=()=>ir(i-1);$("#sh101-sig").onclick=()=>i===PASOS.length-1?terminar():ir(i+1);$("#sh101-salir").onclick=terminar;addEventListener("resize",ubicar);addEventListener("scroll",ubicar,true)}
function ubicar(){if(!activo)return;let hole=$(".sh101-hole"),card=$(".sh101-card");let r=obj?.getBoundingClientRect();if(!r||!visible(obj))r={left:innerWidth*.08,top:innerHeight*.08,right:innerWidth*.92,bottom:innerHeight*.75,width:innerWidth*.84,height:innerHeight*.67};let pad=6,x=Math.max(5,r.left-pad),y=Math.max(5,r.top-pad),w=Math.min(innerWidth-x-5,r.width+pad*2),h=Math.min(innerHeight-y-5,r.height+pad*2);hole.style.left=x+"px";hole.style.top=y+"px";hole.style.width=w+"px";hole.style.height=h+"px";let cw=Math.min(430,innerWidth-20),cy=y+h+12;if(cy+270>innerHeight)cy=Math.max(10,y-282);card.style.width=cw+"px";card.style.left=Math.max(10,Math.min(innerWidth-cw-10,x))+"px";card.style.top=cy+"px"}
function ir(n){montar();i=Math.max(0,Math.min(PASOS.length-1,n));let p=PASOS[i];obj=buscar(p.sel);if(obj)obj.scrollIntoView({block:"center",inline:"center"});$("#sh-tour-v101").classList.remove("oculto");activo=true;$("#sh101-num").textContent=`GUÍA ${String(i+1).padStart(2,"0")} / ${PASOS.length}`;$("#sh101-titulo").textContent=p.t;$("#sh101-texto").textContent=p.x;$("#sh101-ant").disabled=i===0;$("#sh101-sig").textContent=i===PASOS.length-1?"EL MUNDO ES MÍO":"SIGUIENTE";let s=estado();s.version=VERSION;s.paso=i;s.completa=false;guardar();requestAnimationFrame(()=>setTimeout(ubicar,50))}
function terminar(){activo=false;let s=estado();s.version=VERSION;s.paso=PASOS.length;s.completa=true;guardar();$("#sh-tour-v101")?.classList.add("oculto");obj=null}
function reiniciar(){let s=estado();s.version=VERSION;s.paso=0;s.completa=false;guardar();if(typeof shIr==="function")shIr("mapa");setTimeout(()=>ir(0),100)}
function iniciar(){montar();document.getElementById("sh-clip")?.classList.add("hidden");let s=estado();if(s.version!==VERSION){s.version=VERSION;s.paso=0;s.completa=false;guardar()}if(!s.completa){if(typeof shIr==="function")shIr("mapa");setTimeout(()=>ir(s.paso||0),120)}}
addEventListener("load",()=>setTimeout(iniciar,700));
window.STARHOUND_TOUR={iniciar:()=>ir(0),reiniciar,terminar};
})();