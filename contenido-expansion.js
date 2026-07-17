/* =========================================================
   STARHOUND // EXPANSIÓN DE FRONTERA 0.5
   Contenido adicional centralizado.
   ========================================================= */

const CATEGORIAS_PERK = ["RASTREO","DEDUCCIÓN","TECNOLOGÍA","SOCIAL","SUPERVIVENCIA","CONTRATISTA"];

RANGOS.splice(0, RANGOS.length,
    {id:"cadete",nombre:"CADETE DE POLVO",nivelMinimo:1,descripcion:"Licencia provisional de caza.",recompensaAscenso:0,desbloqueos:["Contratos D y C"]},
    {id:"rastreador",nombre:"RASTREADOR",nivelMinimo:3,descripcion:"Operador autorizado de frontera.",recompensaAscenso:600,desbloqueos:["Contratos B"]},
    {id:"sabueso",nombre:"SABUESO ESTELAR",nivelMinimo:5,descripcion:"Especialista en objetivos móviles.",recompensaAscenso:1200,desbloqueos:["Intel avanzada"]},
    {id:"cazador",nombre:"CAZADOR",nivelMinimo:8,descripcion:"Licencia plena de captura.",recompensaAscenso:2200,desbloqueos:["Contratos A"]},
    {id:"marshal",nombre:"MARSHAL ESTELAR",nivelMinimo:12,descripcion:"Autoridad operativa multisistema.",recompensaAscenso:4000,desbloqueos:["Contratos S"]},
    {id:"starhound",nombre:"STARHOUND",nivelMinimo:16,descripcion:"Sabueso mayor de la Frontera Helios.",recompensaAscenso:8000,desbloqueos:["Archivo Negro"]}
);

AGENTES.push(
 {id:"bruma",nombre:"BRUMA",alias:"LA CAZADORA SILENCIOSA",titulo:"NADIE OYE EL SEGUNDO PASO",origen:"Lunas de Khepri",edad:"30-35",especialidad:"VIGILANCIA",descripcion:"Ex exploradora de convoyes. Lee multitudes como otros leen mapas.",frase:"Si me viste, ya llegué tarde.",icono:"fa-eye",nivelMinimo:2,estadisticas:{rastreo:9,ingenio:7,tecnologia:5,presencia:6},perk:{id:"paso_fantasma",nombre:"PASO FANTASMA",descripcion:"La primera pesquisa de rastreo de cada mundo cuesta 1 hora menos."},desventaja:"Los desafíos sociales no reciben ayudas."},
 {id:"mercurio",nombre:"MERCURIO",alias:"EL PILOTO IMPOSIBLE",titulo:"NO EXISTE RUTA RECTA",origen:"Anillo de Sundown",edad:"25-30",especialidad:"PILOTAJE",descripcion:"Corredor orbital retirado después de ganar una carrera con un motor incendiado.",frase:"El mapa es una opinión.",icono:"fa-rocket",nivelMinimo:4,estadisticas:{rastreo:8,ingenio:6,tecnologia:8,presencia:5},perk:{id:"linea_roja",nombre:"LÍNEA ROJA",descripcion:"El primer viaje de cada contrato cuesta 2 horas menos."},desventaja:"Las pistas de archivo aportan menos contexto narrativo."},
 {id:"sutura",nombre:"SUTURA",alias:"LA FORENSE",titulo:"LOS MUERTOS DEJAN INVENTARIO",origen:"Helix Prime",edad:"40-45",especialidad:"MEDICINA FORENSE",descripcion:"Médica de guerra que cambió el quirófano por escenas criminales.",frase:"Todo cuerpo firma su propio informe.",icono:"fa-dna",nivelMinimo:6,estadisticas:{rastreo:7,ingenio:10,tecnologia:7,presencia:3},perk:{id:"tejido_testigo",nombre:"TEJIDO TESTIGO",descripcion:"La primera pista física fuerte aporta inteligencia adicional."},desventaja:"Los interrogatorios cuestan 1 hora adicional."},
 {id:"diplomatico",nombre:"CÓNSUL",alias:"EL DIPLOMÁTICO CAÍDO",titulo:"SONRÍE ANTES DEL EMBARGO",origen:"Eidolon",edad:"45-55",especialidad:"NEGOCIACIÓN",descripcion:"Antiguo enviado de siete casas corporativas. Conoce el precio exacto de una mentira.",frase:"Toda puerta tiene protocolo. O bisagra.",icono:"fa-comments",nivelMinimo:8,estadisticas:{rastreo:4,ingenio:8,tecnologia:5,presencia:10},perk:{id:"inmunidad_caducada",nombre:"INMUNIDAD CADUCADA",descripcion:"El primer interrogatorio fallido no consume horas."},desventaja:"Los errores de ruta cuestan 1 hora adicional."},
 {id:"axioma",nombre:"AXIOMA-7",alias:"EL TESTIGO SINTÉTICO",titulo:"LA MEMORIA NO JURA",origen:"Fábrica Orpheus 7",edad:"12 ciclos",especialidad:"ANÁLISIS SINTÉTICO",descripcion:"Androide investigador emancipado. Conserva fragmentos de casos borrados por orden judicial.",frase:"No olvido. Priorizo.",icono:"fa-robot",nivelMinimo:10,estadisticas:{rastreo:7,ingenio:10,tecnologia:10,presencia:2},perk:{id:"checksum",nombre:"CHECKSUM",descripcion:"En memoria, la señal permanece visible ligeramente más tiempo."},desventaja:"No obtiene ventajas sociales."},
 {id:"meridiano",nombre:"MERIDIANO",alias:"EL CARTÓGRAFO CIEGO",titulo:"DIBUJA EL VACÍO",origen:"Caravana Nómada 44",edad:"35-40",especialidad:"CARTOGRAFÍA",descripcion:"Perdió la vista biológica y aprendió a navegar por telemetría gravitacional.",frase:"El espacio también deja huellas.",icono:"fa-compass",nivelMinimo:12,estadisticas:{rastreo:10,ingenio:9,tecnologia:7,presencia:4},perk:{id:"mapa_negativo",nombre:"MAPA NEGATIVO",descripcion:"Una ruta improbable queda marcada durante la planificación."},desventaja:"Las capturas tempranas sufren una penalización mayor."}
);

PERKS.push(
 {id:"huella_termica",nombre:"HUELLA TÉRMICA",categoria:"RASTREO",tipo:"rastreo",descripcion:"La primera investigación de cada planeta cuesta 1 hora menos.",efecto:"Ahorro visible de tiempo",rareza:"COMÚN",nivelRequerido:2},
 {id:"olfato_de_ozono",nombre:"OLFATO DE OZONO",categoria:"RASTREO",tipo:"rastreo",descripcion:"Las pistas de señal aportan +4 de inteligencia al archivo.",efecto:"Intel adicional",rareza:"COMÚN",nivelRequerido:3},
 {id:"rastreador_de_motores",nombre:"RASTREADOR DE MOTORES",categoria:"RASTREO",tipo:"viaje",descripcion:"El primer error de ruta pierde 2 horas menos.",efecto:"Reduce penalización",rareza:"RARO",nivelRequerido:5},
 {id:"archivista",nombre:"ARCHIVISTA",categoria:"DEDUCCIÓN",tipo:"investigacion",descripcion:"Las evidencias ambiguas aportan +3 de inteligencia.",efecto:"Mejora intel débil",rareza:"COMÚN",nivelRequerido:4},
 {id:"hipotesis_roja",nombre:"HIPÓTESIS ROJA",categoria:"DEDUCCIÓN",tipo:"logica",descripcion:"La primera prueba lógica fallida de un contrato pierde 2 horas menos.",efecto:"Amortigua un fallo",rareza:"RARO",nivelRequerido:6},
 {id:"perfilador",nombre:"PERFILADOR",categoria:"DEDUCCIÓN",tipo:"investigacion",descripcion:"Al alcanzar 60% de intel se revela un dato extra del objetivo.",efecto:"Umbral de archivo",rareza:"ÉPICO",nivelRequerido:9},
 {id:"puente_frio",nombre:"PUENTE FRÍO",categoria:"TECNOLOGÍA",tipo:"tecnologia",descripcion:"Los fallos de hack pierden 1 hora menos.",efecto:"Reduce coste de hack",rareza:"COMÚN",nivelRequerido:3},
 {id:"buffer_fantasma",nombre:"BUFFER FANTASMA",categoria:"TECNOLOGÍA",tipo:"tecnologia",descripcion:"La señal de memoria permanece visible un instante adicional.",efecto:"Ventaja perceptible",rareza:"RARO",nivelRequerido:5},
 {id:"mano_estable",nombre:"MANO ESTABLE",categoria:"TECNOLOGÍA",tipo:"pulso",descripcion:"La zona LOCK del rastreador de pulso es ligeramente más tolerante.",efecto:"Ventana de captura",rareza:"RARO",nivelRequerido:7},
 {id:"cara_de_poker",nombre:"CARA DE PÓKER",categoria:"SOCIAL",tipo:"social",descripcion:"El primer interrogatorio del contrato cuesta 1 hora menos.",efecto:"Ahorro social",rareza:"COMÚN",nivelRequerido:2},
 {id:"nombre_de_bar",nombre:"NOMBRE DE BAR",categoria:"SOCIAL",tipo:"social",descripcion:"Las pesquisas en cantinas y mercados aportan +3 de intel.",efecto:"Contactos locales",rareza:"RARO",nivelRequerido:5},
 {id:"deuda_ajena",nombre:"DEUDA AJENA",categoria:"SOCIAL",tipo:"social",descripcion:"Una vez por contrato, un fallo social no consume horas.",efecto:"Seguro social",rareza:"ÉPICO",nivelRequerido:8},
 {id:"racion_seca",nombre:"RACIÓN SECA",categoria:"SUPERVIVENCIA",tipo:"tiempo",descripcion:"Comenzás cada contrato con 2 horas operativas extra.",efecto:"Tiempo adicional",rareza:"COMÚN",nivelRequerido:4},
 {id:"cazador_frio",nombre:"CAZADOR FRÍO",categoria:"SUPERVIVENCIA",tipo:"captura",descripcion:"Una captura fallida temprana recibe una penalización menor.",efecto:"Captura más estable",rareza:"RARO",nivelRequerido:7},
 {id:"comision_negra",nombre:"COMISIÓN NEGRA",categoria:"CONTRATISTA",tipo:"creditos",descripcion:"Las capturas correctas pagan 8% más créditos.",efecto:"Bonus de recompensa",rareza:"RARO",nivelRequerido:6}
);

const NUEVOS_CRIMINALES = [
 ["solenne_vex","SOLENNE VEX","LA NOTARIA","Humana","Eidolon","Casa Vanta","Falsificación de identidades",3,7200,"Tatuaje de tinta térmica","Vendió tres veces la misma ciudadanía planetaria.","Nunca firma con la misma mano.","logica"],
 ["oro_kest","ORO KEST","EL CARTÓGRAFO ROJO","Marciano adaptado","Dustfall","Rutas Kest","Tráfico de mapas",2,5100,"Brújula mecánica al cuello","Conoce corredores borrados del registro federal.","Los mapas mienten menos que los marshals.","pulso"],
 ["mira_sable","MIRA SABLE","LA COSTURERA","Humana","Helix","Telar Gris","Falsificación genética",4,11800,"Guantes quirúrgicos negros","Reescribe marcadores biológicos por encargo.","La sangre es un documento editable.","memoria"],
 ["garrick_flux","GARRICK FLUX","EL REMOLCADOR","Humano","Cinder","Sindicato de Grúas","Robo de naves",3,8600,"Brazo hidráulico civil","Robó un destructor fingiendo una avería portuaria.","Todo flota si cortás suficientes cables.","secuencia"],
 ["luma_veil","LUMA VEIL","SANTA ESTÁTICA","Sintética","Neon","Coro de Ruido","Piratería de datos",5,16400,"Voz con doble frecuencia","Secuestra memorias y las subasta como sueños.","No robé tu recuerdo. Lo liberé.","hack"],
 ["torren_bale","TORREN BALE","EL HUESERO","Humano","Frost","Ninguna","Arqueología ilegal",3,9400,"Prótesis de marfil sintético","Desmantela tumbas precoloniales para coleccionistas.","Los muertos no presentan denuncia.","acertijo"],
 ["ix_chel","IX CHEL","LA ASTRÓLOGA","Quimérica","Orpheus","Observatorio Ciego","Fraude predictivo",2,4800,"Pupilas hexagonales","Manipula mercados con profecías fabricadas.","El futuro es más barato al por mayor.","matematica"],
 ["ransom_kade","RANSOM KADE","PERRO DE ADUANA","Humano","Redemption","Ex Aduana Helios","Contrabando",4,13200,"Insignia limada","Convirtió protocolos de inspección en rutas privadas.","Yo escribí la puerta trasera.","interrogatorio"],
 ["naia_drift","NAIA DRIFT","LA NÁUFRAGA","Humana","Blackreef","Flota Drift","Piratería",4,14100,"Cabello con fibras ópticas","Ataca cargueros desde cementerios de naves.","El vacío devuelve lo que le tiran.","cartas"],
 ["doctor_coda","DR. CODA","EL EDITOR","Humano","Helix","Clínica Coda","Falsificación genética",5,18900,"Máscara clínica blanca","Borró la identidad genética de una célula insurgente.","Diagnóstico: jurídicamente inexistente.","logica"],
 ["pax_morrow","PAX MORROW","EL CORREO","Clon","Sundown","Posta 13","Espionaje corporativo",3,7900,"Doce sellos postales tatuados","Transporta secretos en recuerdos implantados.","Abrir correspondencia es delito.","memoria"],
 ["sister_glass","SISTER GLASS","LA VITRAL","Humana","Eden","Iglesia Prisma","Robo de reliquias",4,12600,"Ojo de vidrio verde","Sustrajo reliquias mientras oficiaba sus funerales.","Toda fe necesita inventario.","acertijo"],
 ["mako_renn","MAKO RENN","EL DENTISTA","Belter","Cinder","Mandíbula Roja","Sabotaje orbital",3,8800,"Mandíbula cromada","Especialista en hacer fallar estaciones sin explosión visible.","La buena avería parece mantenimiento.","secuencia"],
 ["echo_var","ECHO VAR","NINGUNA PERSONA","Sintética","Neon","Null Choir","Falsificación de identidades",5,20100,"Sombra facial inestable","Ha usado 412 identidades verificadas.","Decime quién buscás y lo habré sido.","hack"],
 ["delia_quartz","DELIA QUARTZ","REINA DEL POLVO","Humana","Dustfall","Caravana Quartz","Contrabando de reliquias",3,10300,"Diente de cuarzo","Cruza desiertos radiactivos sin baliza.","La ley no soporta el calor.","pulso"],
 ["varko_tin","VARKO TIN","EL CHATARRERO","Cyborg","Grave","Mercado Óxido","Robo de naves",2,5900,"Tres dedos magnéticos","Reconstruye naves robadas hasta volverlas irreconocibles.","Número de serie es una superstición.","matematica"],
 ["sen_ardent","SEN ARDENT","EL EMBAJADOR","Humano","Eidolon","Ex Liga Solar","Espionaje",5,22400,"Anillo diplomático quemado","Vendió tratados antes de que fueran redactados.","La paz también tiene precio de preventa.","interrogatorio"],
 ["kora_melt","KORA MELT","LA FUNDIDORA","Humana","Cinder","Forja Melt","Sabotaje industrial",4,13700,"Quemadura dorada en cuello","Convierte accidentes laborales en armas económicas.","Todo metal recuerda el fuego.","pulso"],
 ["umbra_joy","UMBRA JOY","LA SONRISA NEGRA","Humana","Blackreef","Circo Umbra","Estafa",3,7600,"Sonrisa tatuada","Vacía casinos con equipos de probabilistas cautivos.","La suerte trabaja para alguien.","cartas"],
 ["teth_omega","TETH OMEGA","EL CRONISTA","Sintético","Orpheus","Archivo Omega","Robo temporal experimental",5,25000,"Reloj sin agujas","Robó telemetría de un experimento de dilatación temporal.","Llegaste puntual en una versión del caso.","secuencia"],
 ["juno_fall","JUNO FALL","LA PARACAIDISTA","Humana","Sundown","Ninguna","Robo de cargamentos",2,6200,"Arnés orbital rojo","Aborda cargueros durante descenso atmosférico.","El suelo es un problema futuro.","pulso"],
 ["quill_rho","QUILL RHO","EL ESCRIBANO","Aviano","Eidolon","Registro Rho","Fraude documental",3,8300,"Plumas con tinta azul","Fabrica historiales legales completos para criminales.","Un sello correcto mata una investigación.","logica"],
 ["bex_nova","BEX NOVA","LA MECÁNICA","Humana","Redemption","Taller Nova","Sabotaje de motores",3,9100,"Llave de torque ceremonial","Deja motores funcionando exactamente hasta salir del puerto.","La garantía ya venció.","matematica"],
 ["alder_wake","ALDER WAKE","EL DORMIDO","Humano","Frost","Proyecto Wake","Espionaje",4,14900,"Pulso cardíaco de 20 bpm","Usa criosueño para romper cronologías de vigilancia.","Preguntale a alguien que estuviera despierto.","memoria"],
 ["maeve_null","MAEVE NULL","LA ÚLTIMA COPIA","Clon","Grave","Ninguna","Robo de identidades",5,23100,"Sin huellas dactilares","Cada captura atribuida a ella reveló ser otra persona.","No soy la original. Esa es la ventaja.","ajedrez"]
];

NUEVOS_CRIMINALES.forEach((c, i) => THIEVES.push({
 id:c[0], name:c[1], alias:c[2], especie:c[3], origen:c[4], afiliacion:c[5],
 especialidad:c[6], peligrosidad:c[7], amenaza:["D","C","B","A","S"][Math.max(0,c[7]-1)],
 recompensa:c[8], rasgo:c[9], historial:c[10], rumor:c[11], minijuego:c[12],
 arma:["Pistola de pulsos","Dron señuelo","Hoja cerámica","Ninguna declarada"][i%4],
 nave:["Courier","Skiff","Mule","Wraith","Clipper"][i%5],
 implante:["Ninguno","Óptico","Neural","Cromo"][i%4]
}));

const RUTAS_EXPANSION = [
 ["dustfall","cinder","sundown","grave","blackreef"],["eidolon","helix","neon","orpheus","grave"],
 ["helix","neon","frost","eidolon","eden"],["cinder","dustfall","redemption","sundown","blackreef"],
 ["neon","helix","grave","blackreef","eidolon"],["orpheus","frost","grave","eden","blackreef"],
 ["orpheus","helix","neon","eidolon","eden"],["redemption","sundown","dustfall","cinder","grave"],
 ["blackreef","grave","frost","eidolon","eden"],["helix","orpheus","neon","grave","blackreef"],
 ["sundown","redemption","dustfall","grave","eden"],["eden","orpheus","frost","grave","eidolon"],
 ["cinder","neon","helix","redemption","sundown"],["neon","grave","blackreef","eidolon","eden"],
 ["dustfall","redemption","sundown","cinder","frost"]
];
const TITULOS_EXPANSION = [
 ["PAPELES PARA UN MUERTO","FRAUDE","CIUDADANÍA DIPLOMÁTICA EIDOLON","solenne_vex"],
 ["LA RUTA QUE NO EXISTE","CONTRABANDO","ATLAS DE CORREDORES ROJOS","oro_kest"],
 ["SANGRE DE ALQUILER","FRAUDE","MATRIZ GENÉTICA CONSULAR","mira_sable"],
 ["REMOLQUE SIN DESTINO","ROBO","CORBETA JUDICIAL KESTREL","garrick_flux"],
 ["SUEÑOS EN VENTA","PIRATERÍA","BANCO MNÉMICO HELIX","luma_veil"],
 ["HUESOS BAJO ORPHEUS","RELIQUIAS","ÍDOLO PRECOLONIAL","torren_bale"],
 ["EL PRECIO DEL MAÑANA","FRAUDE","ALGORITMO DE MERCADO IX","ix_chel"],
 ["SELLO DE SALIDA","CONTRABANDO","MANIFIESTO ADUANERO NEGRO","ransom_kade"],
 ["NAUFRAGIO VOLUNTARIO","PIRATERÍA","CARGAMENTO DE HELIO-9","naia_drift"],
 ["PACIENTE CERO","FRAUDE","REGISTRO GENÉTICO FEDERAL","doctor_coda"],
 ["CORREO PARA NADIE","ESPIONAJE","MEMORIA DE DIRECTORIO PAX","pax_morrow"],
 ["VIDRIO SAGRADO","RELIQUIAS","VITRAL DE EDEN","sister_glass"],
 ["MANTENIMIENTO PROGRAMADO","SABOTAJE","CONTROL ORBITAL CINDER","mako_renn"],
 ["CUATROCIENTOS DOCE ROSTROS","ESPIONAJE","CLAVE BIOMÉTRICA NULL","echo_var"],
 ["RELOJ SIN AGUJAS","DESAPARICIÓN","TELEMETRÍA TETH","teth_omega"]
];
TITULOS_EXPANSION.forEach((x,i) => CASES.push({
 id:`contrato${String(16+i).padStart(3,"0")}`, titulo:x[0], categoria:x[1],
 descripcion:`La red de contratos marcó una anomalía de clase ${["D","C","B","A","S"][Math.min(4,Math.floor(i/3))]}.`,
 briefing:`${x[2]} desapareció. La última firma válida apunta a ${RUTAS_EXPANSION[i][0]}. Recuperá inteligencia, confirmá identidad y cerrá el cerco.`,
 objeto_robado:x[2], ciudad_inicial_id:RUTAS_EXPANSION[i][0], ladrón_asignado_id:x[3],
 ruta_escape:RUTAS_EXPANSION[i], nivelRequerido:1+Math.floor(i/2),
 recompensa:4200+i*1100, experiencia:70+i*8, dificultad:1+Math.min(4,Math.floor(i/3)),
 rangoDificultad:["D","C","B","A","S"][Math.min(4,Math.floor(i/3))], tiempo_maximo:72-Math.min(20,i)
}));

CASES.forEach((c,i) => {
 c.categoria ||= ["ROBO","SABOTAJE","CONTRABANDO","ESPIONAJE","FRAUDE","DESAPARICIÓN","PIRATERÍA","RELIQUIAS"][i%8];
 c.rangoDificultad ||= ["D","C","B","A","S"][Math.max(0,Math.min(4,(c.dificultad||1)-1))];
 c.descripcion ||= `Contrato ${c.rangoDificultad} emitido por la red STARHOUND.`;
 c.briefing ||= `${c.objeto_robado} fue sustraído. Seguí la ruta de fuga, reuní evidencia y confirmá al objetivo antes de capturarlo.`;
 c.experiencia ||= 60 + (c.dificultad||1)*25;
 c.tiempo_maximo ||= 72 - (c.dificultad||1)*3;
});

AGENTES.forEach((a,i) => {
 a.alias ||= a.titulo;
 a.origen ||= ["Dustfall","Neon","Helix","Sundown","Orpheus","Frost"][i%6];
 a.edad ||= `${28+i*3}-${34+i*3}`;
 a.frase ||= "El rastro siempre cobra intereses.";
 a.desventaja ||= "Sin desventaja operativa registrada.";
 a.nivelMinimo ||= i===0 ? 1 : i*2+1;
});
PERKS.forEach((p,i) => {
 p.categoria ||= ({rastreo:"RASTREO",investigacion:"DEDUCCIÓN",social:"SOCIAL",viaje:"SUPERVIVENCIA",logica:"DEDUCCIÓN",tiempo:"SUPERVIVENCIA",tecnologia:"TECNOLOGÍA",creditos:"CONTRATISTA"})[p.tipo] || "CONTRATISTA";
 p.rareza ||= i < 8 ? "COMÚN" : "RARO";
 p.efecto ||= p.descripcion;
});

const MICROEVENTOS = [
 ["mercado","DEUDA EN CHATARRA","El comerciante apaga el soplete al ver tu insignia. Tiene un nombre, pero antes exige verificar una vieja cuenta.","matematica",2,"La deuda cierra. El nombre aparece en un recibo térmico.","La cuenta no coincide y el comerciante baja la persiana."],
 ["mercado","PRECIO DE RUMOR","Una corredora vende rutas de fuga como si fueran especias.","cartas",2,"Ganás la mano y también un destino probable.","La mesa se ríe. El rumor cambia de dueño."],
 ["mercado","SERIE LIMADA","Un motor conserva tres dígitos bajo la pintura.","memoria",2,"Reconstruís la serie del transpondedor.","La interferencia borra el último bloque."],
 ["puerto","OCHO SEGUNDOS","Una cámara portuaria conserva una ráfaga corrupta.","memoria",2,"La frecuencia recompone una silueta útil.","La señal colapsa antes del checksum."],
 ["puerto","RUTA FANTASMA","Dos balizas registran el mismo carguero en horarios imposibles.","logica",3,"La contradicción revela el salto real.","El tráfico se mezcla con una caravana civil."],
 ["puerto","MUELLE TRECE","El capataz sólo habla mientras calibra una esclusa.","pulso",2,"Bloqueás la frecuencia y escucha tu pregunta.","Perdés el canal entre alarmas de presión."],
 ["cantina","LA ÚLTIMA MANO","Un piloto jura haber visto al objetivo. No regala información.","cartas",3,"La última carta compra un relato completo.","La deuda de mesa te cuesta tiempo y silencio."],
 ["cantina","VASO SIN DUEÑO","Hay una bebida intacta y tres versiones de quién la pidió.","logica",2,"Separás la coartada del recuerdo real.","Las versiones se contaminan entre sí."],
 ["cantina","MÚSICA DEMASIADO ALTA","El informante acepta hablar por el canal de servicio.","secuencia",2,"Repetís el código y abre la línea privada.","Una nota errónea corta la comunicación."],
 ["archivo","EXPEDIENTE QUEMADO","Faltan páginas, pero la numeración todavía respira.","acertijo",2,"El patrón reconstruye el folio ausente.","Archivás una hipótesis inútil."],
 ["archivo","SELLO DOBLE","Dos documentos auténticos se contradicen.","logica",3,"La firma temporal delata la copia.","El sistema marca ambos como dudosos."],
 ["archivo","ÍNDICE NEGRO","Un nodo clasificado exige una ruta de acceso manual.","hack",3,"El índice entrega una afiliación parcial.","El firewall mueve el expediente."],
 ["callejon","TRES SOMBRAS","Un dron vio tres figuras y sólo una evitó la luz.","pulso",2,"Aislás el movimiento deliberado.","El eco térmico se dispersa."],
 ["callejon","MARCA DE BOTA","La lluvia ácida dejó medio dibujo de suela.","memoria",2,"La trama coincide con un lote restringido.","El agua termina de borrar el borde."],
 ["callejon","PUERTA SIN CERRADURA","Un refugio usa golpes codificados.","secuencia",2,"La puerta responde y alguien huye por atrás.","El código activa silencio total."],
 ["terminal","NODO HUÉRFANO","Una terminal pública habla con un servidor que oficialmente no existe.","hack",3,"Trazás la conexión hasta una cuenta puente.","El nodo quema su ruta."],
 ["terminal","SUMA DE COMBUSTIBLE","Los consumos declarados no alcanzan para la ruta registrada.","matematica",2,"Calculás el desvío oculto.","La estimación queda fuera de tolerancia."],
 ["terminal","LATENCIA","Cuatro paquetes llegan fuera de orden.","secuencia",3,"Reconstruís el handshake clandestino.","El buffer se purga."],
 ["taller","MOTOR TODAVÍA TIBIO","El mecánico niega haber trabajado de noche.","interrogatorio",2,"La presión correcta rompe su libreto.","Se encierra detrás de la garantía del cliente."],
 ["taller","PIEZAS DE CINCO NAVES","Un propulsor está armado con componentes incompatibles.","logica",3,"Identificás la pieza que conserva matrícula.","El inventario falso te desvía."],
 ["taller","BANCO DE PRUEBA","La firma del motor sólo aparece en una frecuencia estrecha.","pulso",2,"Capturás la firma completa.","La lectura se satura."],
 ["aduana","DECLARACIÓN 77-B","Un manifiesto pesa nueve toneladas menos que el carguero.","matematica",2,"El faltante coincide con un módulo oculto.","La balanza entra en recalibración."],
 ["aduana","INSPECTOR CANSADO","El agente vio algo, pero teme perder la pensión.","interrogatorio",3,"Le das una salida y entrega el horario.","Se aferra al protocolo."],
 ["aduana","CÓDIGO DE SELLO","El precinto usa una secuencia de cinco pulsos.","secuencia",2,"Replicás el patrón sin disparar alarma.","El sello invalida el registro."],
 ["estacion","ECO EN ANDÉN","Un anuncio contiene una segunda señal enterrada.","memoria",2,"Recordás el bloque y aislás el alias.","La voz pública tapa la portadora."],
 ["estacion","CASILLERO 404","El casillero no figura en el plano físico.","acertijo",2,"La numeración revela un nivel de mantenimiento.","Perdés tiempo revisando depósitos reales."],
 ["estacion","CRUCE DE HORARIOS","Tres trenes orbitales comparten una ventana imposible.","logica",3,"Detectás el convoy usado como cobertura.","La tabla cambia con el turno."],
 ["ruinas","MAPA DE ESTRELLAS","Un mural antiguo coincide con rutas modernas sólo si se rota.","acertijo",3,"La orientación señala un refugio actual.","La interpretación no produce coordenadas."],
 ["ruinas","BALIZA BAJO PIEDRA","Un pulso débil atraviesa veinte metros de basalto.","pulso",3,"Fijás la señal antes del derrumbe.","La frecuencia se pierde bajo estática mineral."],
 ["ruinas","CÁMARA DE ECO","La puerta repite una serie luminosa incompleta.","secuencia",3,"Completás la serie y accedés al registro.","La cámara vuelve a estado sellado."]
];
