/* =========================================================
   STARHOUND // SISTEMAS DE FRONTERA 0.5
   Progresión, microeventos, archivo criminal y resultados.
   ========================================================= */

STARHOUND.version = "0.5.0";

const _crearPerfilBase = ALMACEN_STARHOUND.crearPerfil.bind(ALMACEN_STARHOUND);
ALMACEN_STARHOUND.crearPerfil = function () {
    const perfil = _crearPerfilBase();
    return {
        ...perfil,
        versionPerfil: 2,
        capturas: perfil.sospechososCapturados?.length || 0,
        capturasFallidas: 0,
        contratosAbandonados: 0,
        historialContratos: [],
        intelUmbralesNotificados: {},
        rango: perfil.rango || 0
    };
};

const _cargarPerfilBase = ALMACEN_STARHOUND.cargar.bind(ALMACEN_STARHOUND);
ALMACEN_STARHOUND.cargar = function () {
    const perfil = _cargarPerfilBase();
    const base = this.crearPerfil();
    return {
        ...base,
        ...perfil,
        versionPerfil: 2,
        capturas: Number.isFinite(perfil.capturas) ? perfil.capturas : (perfil.sospechososCapturados?.length || 0),
        capturasFallidas: perfil.capturasFallidas || 0,
        contratosAbandonados: perfil.contratosAbandonados || 0,
        historialContratos: Array.isArray(perfil.historialContratos) ? perfil.historialContratos : [],
        intelUmbralesNotificados: perfil.intelUmbralesNotificados || {},
        archivo: perfil.archivo || {}
    };
};

function tienePerkExpansion(id) {
    return STARHOUND.perfil?.perksDesbloqueados?.includes(id);
}

function obtenerCategoriaAccion(accion) {
    const texto = `${accion.id || ""} ${accion.name || accion.nombre || ""}`.toLowerCase();
    if (texto.includes("mercado")) return "mercado";
    if (texto.includes("puerto") || texto.includes("muelle")) return "puerto";
    if (texto.includes("cantina") || texto.includes("bar")) return "cantina";
    if (texto.includes("archivo") || texto.includes("registro")) return "archivo";
    if (texto.includes("calle") || texto.includes("huella")) return "callejon";
    if (texto.includes("terminal") || texto.includes("sistema") || texto.includes("hack")) return "terminal";
    if (texto.includes("taller") || texto.includes("motor")) return "taller";
    if (texto.includes("aduana") || texto.includes("manifiesto")) return "aduana";
    if (texto.includes("estacion") || texto.includes("estación") || texto.includes("anden")) return "estacion";
    if (texto.includes("ruina") || texto.includes("reliquia")) return "ruinas";
    return ["mercado","puerto","cantina","archivo","callejon","terminal","taller","aduana","estacion","ruinas"][
        Math.abs((accion.id || accion.name || "x").length) % 10
    ];
}

function seleccionarMicroevento(accion, idAccion) {
    const categoria = obtenerCategoriaAccion(accion);
    const candidatos = MICROEVENTOS.filter(e => e[0] === categoria);
    const semilla = [...String(idAccion || accion.id || accion.name || categoria)]
        .reduce((a, c) => a + c.charCodeAt(0), 0);
    return candidatos[semilla % candidatos.length] || MICROEVENTOS[semilla % MICROEVENTOS.length];
}

function presentarMicroevento(evento) {
    return new Promise(resolve => {
        const pantalla = obtenerPantalla();
        pantalla.innerHTML = `
            <section class="microevento">
                <button id="microevento-volver" class="boton-volver">← VOLVER A OPERACIÓN</button>
                <span class="etiqueta-terminal">MICROEVENTO // ${evento[0].toUpperCase()}</span>
                <div class="microevento-marco">
                    <div class="microevento-codigo">INCIDENTE ${String(Math.abs(evento[1].length * 73)).padStart(4,"0")}</div>
                    <h1>${evento[1]}</h1>
                    <p>${evento[2]}</p>
                    <div class="microevento-ficha">
                        <span>DESAFÍO // ${evento[3].toUpperCase()}</span>
                        <span>COSTE OPERATIVO // ${evento[4]} H</span>
                    </div>
                </div>
                <button id="microevento-iniciar" class="boton-terminal boton-principal">INICIAR INTERVENCIÓN</button>
            </section>`;
        document.getElementById("microevento-iniciar").addEventListener("click", () => resolve(true), {once:true});
        document.getElementById("microevento-volver").addEventListener("click", () => {
            renderCaso();
            renderOpcionesInvestigacion();
            resolve(false);
        }, {once:true});
    });
}

const _ejecutarInvestigacionBase = ejecutarInvestigacion;
ejecutarInvestigacion = async function (accion, idAccion) {
    const evento = seleccionarMicroevento(accion, idAccion);
    const continuar = await presentarMicroevento(evento);
    if (!continuar) return;

    const horasAntes = STARHOUND.horas;
    consumirHoras(evento[4]);
    if (comprobarTiempo()) return;

    const accionContextual = {
        ...accion,
        prueba: evento[3],
        minijuego: evento[3],
        microevento: evento[1]
    };

    const pistasAntes = STARHOUND.pistas.length;
    const fallosAntes = STARHOUND.perfil.estadisticas.pruebasFallidas;

    await _ejecutarInvestigacionBase(accionContextual, idAccion);

    if (STARHOUND.casoFinalizado) return;

    const exito = STARHOUND.pistas.length > pistasAntes;
    const fallo = STARHOUND.perfil.estadisticas.pruebasFallidas > fallosAntes;

    if (exito || fallo) {
        notificar(exito ? evento[5] : evento[6]);
    }

    if (STARHOUND.horas === horasAntes) {
        console.warn("STARHOUND // Microevento sin consumo temporal detectado");
    }
    ALMACEN_STARHOUND.guardar();
};

function calidadIntelPista(pista) {
    const tipo = String(pista?.tipo || pista?.category || pista?.focus || "").toLowerCase();
    const tieneDato = Boolean(pista?.propiedad || pista?.value_associated?.property);
    if (tipo.includes("crit") || pista?.critica) return 18;
    if (tipo.includes("ident") && tieneDato) return 12;
    if (tieneDato) return 7;
    return 4;
}

const _actualizarArchivoBase = actualizarArchivoSospechoso;
actualizarArchivoSospechoso = function (pista) {
    const sospechoso = STARHOUND.sospechoso;
    if (!sospechoso) return;

    const id = obtenerIdSospechoso(sospechoso);
    registrarArchivoSospechoso();
    const registro = STARHOUND.perfil.archivo[id];
    const anterior = registro.progreso || 0;

    const propiedad = pista?.propiedad || pista?.value_associated?.property;
    const valor = pista?.valor || pista?.value_associated?.value;
    if (propiedad && valor) registro.datos[propiedad] = valor;

    let incremento = calidadIntelPista(pista);
    if (tienePerkExpansion("archivista") && incremento <= 4) incremento += 3;
    if (tienePerkExpansion("olfato_de_ozono") && String(pista?.tipo || "").includes("signal")) incremento += 4;
    if (tienePerkExpansion("nombre_de_bar") && ["mercado","cantina"].includes(obtenerCategoriaAccion({name:pista?.texto || ""}))) incremento += 3;

    registro.progreso = Math.min(100, anterior + incremento);

    const umbrales = [20,40,60,80,100];
    STARHOUND.perfil.intelUmbralesNotificados[id] ||= [];
    const cruzado = umbrales.find(u => anterior < u && registro.progreso >= u &&
        !STARHOUND.perfil.intelUmbralesNotificados[id].includes(u));

    if (cruzado) {
        STARHOUND.perfil.intelUmbralesNotificados[id].push(cruzado);
        setTimeout(() => notificar(`NUEVA INTELIGENCIA DESBLOQUEADA // ARCHIVO ${cruzado}%`), 80);
    }

    if (tienePerkExpansion("perfilador") && anterior < 60 && registro.progreso >= 60) {
        const dato = ["especie","origen","especialidad","rasgo","arma","nave","afiliacion"]
            .find(k => !registro.datos[k] && sospechoso[k] !== undefined);
        if (dato) registro.datos[dato] = sospechoso[dato];
    }

    ALMACEN_STARHOUND.guardar();
};

function estadoArchivo(registro, capturado) {
    if (capturado) return "CAPTURADO";
    const p = registro?.progreso || 0;
    if (p >= 80) return "LOCALIZADO";
    if (p >= 40) return "IDENTIFICADO";
    return "DESCONOCIDO";
}

renderArchivo = function () {
    const pantalla = obtenerPantalla();
    pantalla.innerHTML = `
        ${crearCabeceraSeccion("04 // ARCHIVO STARHOUND","REGISTRO GALÁCTICO DE OBJETIVOS","La inteligencia se revela por umbrales. Nada se entrega gratis.")}
        <div class="archivo-herramientas">
            <input id="archivo-buscar" class="archivo-buscar" type="search" placeholder="BUSCAR OBJETIVO / ALIAS..." aria-label="Buscar objetivo">
            <select id="archivo-filtro" class="archivo-filtro" aria-label="Filtrar estado">
                <option value="TODOS">TODOS LOS ESTADOS</option>
                <option>DESCONOCIDO</option><option>IDENTIFICADO</option><option>LOCALIZADO</option><option>CAPTURADO</option>
            </select>
        </div>
        <div id="archivo-sospechosos" class="grid-archivo"></div>`;

    const grid = document.getElementById("archivo-sospechosos");
    const buscador = document.getElementById("archivo-buscar");
    const filtro = document.getElementById("archivo-filtro");

    const pintar = () => {
        const q = buscador.value.trim().toLowerCase();
        const f = filtro.value;
        grid.innerHTML = "";

        obtenerSospechosos().forEach((sospechoso, indice) => {
            const id = obtenerIdSospechoso(sospechoso);
            const registro = STARHOUND.perfil.archivo[id] || {progreso:0,datos:{}};
            const progreso = registro.progreso || 0;
            const capturado = STARHOUND.perfil.sospechososCapturados.includes(id);
            const estado = estadoArchivo(registro, capturado);
            const nombre = obtenerNombre(sospechoso);
            const alias = sospechoso.alias || "";

            if (f !== "TODOS" && estado !== f) return;
            if (q && progreso >= 20 && !`${nombre} ${alias}`.toLowerCase().includes(q)) return;
            if (q && progreso < 20 && !"objetivo desconocido".includes(q)) return;

            const tarjeta = document.createElement("button");
            tarjeta.className = "tarjeta-archivo";
            tarjeta.innerHTML = `
                <span class="archivo-codigo">OBJ-${String(indice+1).padStart(3,"0")}</span>
                <div class="archivo-silueta">${progreso >= 20 ? obtenerIniciales(nombre) : "████"}</div>
                <h3>${progreso >= 20 ? (progreso >= 40 ? nombre : alias || "ALIAS PARCIAL") : "OBJETIVO DESCONOCIDO"}</h3>
                <div class="barra-archivo"><div style="width:${progreso}%"></div></div>
                <span>INTEL RECOPILADA // ${progreso}%</span>
                <span>ESTADO // ${estado}</span>`;
            tarjeta.addEventListener("click", () => abrirFichaArchivo(sospechoso));
            grid.appendChild(tarjeta);
        });

        if (!grid.children.length) grid.innerHTML = `<div class="marco-contenido"><p>SIN COINCIDENCIAS EN EL ARCHIVO.</p></div>`;
    };

    buscador.addEventListener("input", pintar);
    filtro.addEventListener("change", pintar);
    pintar();
};

abrirFichaArchivo = function (sospechoso) {
    const pantalla = obtenerPantalla();
    const id = obtenerIdSospechoso(sospechoso);
    const registro = STARHOUND.perfil.archivo[id] || {progreso:0,datos:{}};
    const p = registro.progreso || 0;
    const capturado = STARHOUND.perfil.sospechososCapturados.includes(id);
    const revelar = (umbral, valor, oculto="DATOS INSUFICIENTES") => p >= umbral ? (valor || "SIN REGISTRO") : oculto;

    pantalla.innerHTML = `
        <div class="ficha-objetivo">
            <button id="volver-archivo" class="boton-volver">← VOLVER AL ÍNDICE</button>
            <div class="marco-contenido ficha-criminal-expandida">
                <span class="etiqueta-terminal">ARCHIVO CLASIFICADO // ${estadoArchivo(registro,capturado)}</span>
                <h1>${revelar(40, obtenerNombre(sospechoso), "████████ // OBJETIVO DESCONOCIDO")}</h1>
                <p class="archivo-alias">${revelar(20, sospechoso.alias, "ALIAS // BLOQUEADO")}</p>
                <div class="barra-archivo grande"><div style="width:${p}%"></div></div>
                <strong>INTEL RECOPILADA // ${p}%</strong>
                <div class="datos-ficha">
                    ${crearCampoArchivo("ESPECIALIDAD", revelar(40,sospechoso.especialidad))}
                    ${crearCampoArchivo("ESPECIE / TIPO", revelar(60,sospechoso.especie))}
                    ${crearCampoArchivo("ORIGEN", revelar(60,sospechoso.origen))}
                    ${crearCampoArchivo("RASGO", revelar(60,sospechoso.rasgo))}
                    ${crearCampoArchivo("AFILIACIÓN", revelar(80,sospechoso.afiliacion))}
                    ${crearCampoArchivo("HISTORIAL", revelar(80,sospechoso.historial))}
                    ${crearCampoArchivo("RUMOR", revelar(80,sospechoso.rumor))}
                    ${crearCampoArchivo("NAVE", revelar(100,sospechoso.nave))}
                    ${crearCampoArchivo("RECOMPENSA", revelar(100,`${sospechoso.recompensa || 0} CR`))}
                </div>
            </div>
        </div>`;
    document.getElementById("volver-archivo").addEventListener("click", renderArchivo);
};

const _finalizarCasoBase = finalizarCaso;
finalizarCaso = function (exito) {
    const perfil = STARHOUND.perfil;
    const nivelAntes = perfil.nivel;
    const rangoAntes = obtenerRangoActual().id || obtenerRangoActual().nombre;
    const creditosAntes = perfil.creditos;
    const xpTotalAntes = perfil.experienciaTotal;
    const horas = Math.max(0, STARHOUND.horas);
    const pistas = STARHOUND.pistas.length;

    _finalizarCasoBase(exito);

    if (exito) perfil.capturas = (perfil.capturas || 0) + 1;
    else perfil.capturasFallidas = (perfil.capturasFallidas || 0) + 1;

    const base = STARHOUND.contrato?.recompensa || 300;
    const bonusTiempo = exito ? Math.round(Math.min(base * 0.2, horas * 12)) : 0;
    const bonusEvidencia = exito ? Math.round(Math.min(base * 0.15, pistas * 45)) : 0;
    const bonusCaptura = exito && STARHOUND.identidad >= 80 ? Math.round(base * 0.1) : 0;
    const bonusContratista = exito && tienePerkExpansion("comision_negra") ? Math.round(base * 0.08) : 0;
    const extras = bonusTiempo + bonusEvidencia + bonusCaptura + bonusContratista;

    if (extras) perfil.creditos += extras;

    STARHOUND.ultimoResultado = {
        exito, base, bonusTiempo, bonusEvidencia, bonusCaptura, bonusContratista,
        creditosGanados: perfil.creditos - creditosAntes,
        experienciaGanada: perfil.experienciaTotal - xpTotalAntes,
        nivelAntes, nivelDespues: perfil.nivel,
        rangoAntes, rangoDespues: obtenerRangoActual().id || obtenerRangoActual().nombre
    };

    perfil.historialContratos.unshift({
        id: STARHOUND.contrato?.id,
        titulo: STARHOUND.contrato?.titulo,
        exito,
        fecha: new Date().toISOString(),
        objetivo: obtenerNombre(STARHOUND.sospechoso),
        creditos: STARHOUND.ultimoResultado.creditosGanados
    });
    perfil.historialContratos = perfil.historialContratos.slice(0, 30);

    ALMACEN_STARHOUND.guardar();
    renderResultadoCaso();
};

renderResultadoCaso = function () {
    const pantalla = obtenerPantalla();
    const r = STARHOUND.ultimoResultado || {};
    const exito = Boolean(r.exito);
    const subioNivel = r.nivelDespues > r.nivelAntes;
    const cambioRango = r.rangoDespues && r.rangoAntes !== r.rangoDespues;
    const rango = obtenerRangoActual();

    pantalla.innerHTML = `
        <div class="resultado-caso resultado-expandido">
            <span class="etiqueta-terminal">INFORME POST-OPERACIÓN</span>
            <h1>${exito ? "CONTRATO COMPLETADO" : "CONTRATO FALLIDO"}</h1>
            <div class="resultado-columnas">
                <section class="marco-contenido">
                    <h2>${obtenerNombre(STARHOUND.sospechoso)}</h2>
                    <div class="desglose-recompensa">
                        <span>RECOMPENSA BASE <strong>${r.base || 0} CR</strong></span>
                        <span>BONUS DE TIEMPO <strong>+${r.bonusTiempo || 0} CR</strong></span>
                        <span>BONUS DE EVIDENCIA <strong>+${r.bonusEvidencia || 0} CR</strong></span>
                        <span>BONUS DE CAPTURA <strong>+${r.bonusCaptura || 0} CR</strong></span>
                        ${r.bonusContratista ? `<span>COMISIÓN NEGRA <strong>+${r.bonusContratista} CR</strong></span>` : ""}
                    </div>
                    <div class="resultado-total">CRÉDITOS OBTENIDOS // ${r.creditosGanados || 0} CR</div>
                </section>
                <section class="marco-contenido">
                    <span class="etiqueta-terminal">PROGRESO DE CAZADOR</span>
                    <h2>NIVEL ${STARHOUND.perfil.nivel} // ${rango.nombre}</h2>
                    <div class="barra-archivo grande"><div style="width:${porcentajeExperiencia()}%"></div></div>
                    <p>XP OBTENIDA // +${r.experienciaGanada || 0}</p>
                    <p>XP ACTUAL // ${STARHOUND.perfil.experiencia} / ${experienciaSiguienteNivel()}</p>
                    ${subioNivel ? `<div class="ascenso-alerta">ASCENSO CONFIRMADO // NIVEL ${STARHOUND.perfil.nivel}</div>` : ""}
                    ${cambioRango ? `<div class="ascenso-alerta">NUEVO RANGO AUTORIZADO // ${rango.nombre}</div>` : ""}
                    ${cambioRango && rango.desbloqueos ? `<p>DESBLOQUEOS // ${rango.desbloqueos.join(" · ")}</p>` : ""}
                </section>
            </div>
            <button id="nuevo-contrato" class="boton-terminal boton-principal">VOLVER A LA RED DE CONTRATOS</button>
            <button id="abrir-archivo-final" class="boton-terminal">CONSULTAR ARCHIVO</button>
        </div>`;

    document.getElementById("nuevo-contrato").addEventListener("click", () => {
        limpiarCaso();
        mostrarPantalla("contratos");
    });
    document.getElementById("abrir-archivo-final").addEventListener("click", () => mostrarPantalla("archivo"));
};

const _aplicarDesbloqueosBase = aplicarDesbloqueos;
aplicarDesbloqueos = function () {
    const rangoAntes = STARHOUND.perfil.rango || 0;
    _aplicarDesbloqueosBase();
    const rangos = obtenerRangos();
    let indice = 0;
    rangos.forEach((r, i) => { if (STARHOUND.perfil.nivel >= (r.nivelMinimo || 1)) indice = i; });
    if (indice > rangoAntes) {
        const nuevo = rangos[indice];
        STARHOUND.perfil.creditos += nuevo.recompensaAscenso || 0;
        STARHOUND.perfil.rango = indice;
    }
    ALMACEN_STARHOUND.guardar();
};
