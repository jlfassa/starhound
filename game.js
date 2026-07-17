/* =========================================================
   STARHOUND
   MOTOR PRINCIPAL DEL JUEGO
   ========================================================= */


/* =========================================================
   ESTADO GLOBAL
   ========================================================= */

const STARHOUND = {
    version: "0.4.0",

    perfil: null,

    pantalla: "agentes",

    agente: null,
    contrato: null,
    sospechoso: null,

    ubicacion: null,
    indiceRuta: 0,

    horas: 0,
    horasIniciales: 0,

    pistas: [],
    pistasDestino: [],
    pistasIdentidad: [],

    identidad: 0,

    accionesRealizadas: [],
    lugaresInvestigados: [],

    casoActivo: false,
    casoFinalizado: false,

    mensajeSistema: ""
};


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CONFIG_JUEGO = {
    horasErrorPrueba: 4,
    horasViajeIncorrecto: 8,
    identidadMinimaCaptura: 65,
    identidadRecomendadaCaptura: 80,
    bonusPrueba: 4,
    penalizacionCapturaTemprana: 0.25
};


/* =========================================================
   ALMACENAMIENTO
   ========================================================= */

const ALMACEN_STARHOUND = {
    clave: "starhound_perfil_v1",

    crearPerfil() {
        return {
            nombre: "CAZADOR",
            nivel: 1,
            experiencia: 0,
            experienciaTotal: 0,
            creditos: 500,

            rango: 0,

            contratosCompletados: 0,
            contratosFallidos: 0,

            sospechososCapturados: [],

            agentesDesbloqueados: [
                obtenerIdAgente(obtenerAgentes()[0])
            ].filter(Boolean),

            perksDesbloqueados: [],

            archivo: {},

            estadisticas: {
                investigaciones: 0,
                pruebasSuperadas: 0,
                pruebasFallidas: 0,
                viajes: 0,
                erroresRuta: 0,
                horasPerdidas: 0
            }
        };
    },

    cargar() {
        try {
            const datos = localStorage.getItem(this.clave);

            if (!datos) {
                return this.crearPerfil();
            }

            const perfil = JSON.parse(datos);
            const base = this.crearPerfil();

            return {
                ...base,
                ...perfil,

                estadisticas: {
                    ...base.estadisticas,
                    ...(perfil.estadisticas || {})
                },

                archivo: perfil.archivo || {},

                agentesDesbloqueados:
                    perfil.agentesDesbloqueados ||
                    base.agentesDesbloqueados,

                perksDesbloqueados:
                    perfil.perksDesbloqueados || [],

                sospechososCapturados:
                    perfil.sospechososCapturados || []
            };

        } catch (error) {
            console.error(
                "STARHOUND // ERROR AL CARGAR PERFIL",
                error
            );

            return this.crearPerfil();
        }
    },

    guardar() {
        try {
            localStorage.setItem(
                this.clave,
                JSON.stringify(STARHOUND.perfil)
            );
        } catch (error) {
            console.error(
                "STARHOUND // ERROR AL GUARDAR",
                error
            );
        }
    }
};


/* =========================================================
   COMPATIBILIDAD CON DATA.JS
   ========================================================= */

function obtenerAgentes() {
    if (typeof AGENTES !== "undefined") return AGENTES;
    if (typeof AGENTS !== "undefined") return AGENTS;

    return [];
}


function obtenerContratos() {
    if (typeof CONTRATOS !== "undefined") return CONTRATOS;
    if (typeof CASOS !== "undefined") return CASOS;
    if (typeof CASES !== "undefined") return CASES;

    return [];
}


function obtenerSospechosos() {
    if (typeof SOSPECHOSOS !== "undefined") return SOSPECHOSOS;
    if (typeof THIEVES !== "undefined") return THIEVES;

    return [];
}


function obtenerPlanetas() {
    if (typeof PLANETAS !== "undefined") return PLANETAS;
    if (typeof COLONIAS !== "undefined") return COLONIAS;
    if (typeof CITIES !== "undefined") return CITIES;

    return [];
}


function obtenerPerks() {
    if (typeof PERKS !== "undefined") return PERKS;

    return [];
}


function obtenerRangos() {
    if (typeof RANGOS !== "undefined") return RANGOS;

    return [];
}


function obtenerIdAgente(agente) {
    return agente?.id || agente?.codigo || agente?.nombre;
}


function obtenerIdContrato(contrato) {
    return contrato?.id || contrato?.codigo || contrato?.nombre;
}


function obtenerIdSospechoso(sospechoso) {
    return sospechoso?.id ||
        sospechoso?.codigo ||
        sospechoso?.nombre;
}


function obtenerIdPlaneta(planeta) {
    return planeta?.id ||
        planeta?.codigo ||
        planeta?.nombre;
}


function obtenerNombre(elemento, fallback = "SIN DATOS") {
    return elemento?.nombre ||
        elemento?.name ||
        elemento?.titulo ||
        fallback;
}


function obtenerDescripcion(elemento) {
    return elemento?.descripcion ||
        elemento?.description ||
        elemento?.descripcion_larga ||
        elemento?.description_long ||
        "SIN INFORMACIÓN DISPONIBLE.";
}


function obtenerRutaContrato(contrato) {
    return contrato?.ruta ||
        contrato?.ruta_escape ||
        contrato?.planetas ||
        contrato?.destinos ||
        [];
}


function obtenerAccionesPlaneta(planeta) {
    return planeta?.acciones ||
        planeta?.opciones ||
        planeta?.investigacion ||
        planeta?.investigation_options ||
        [];
}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    console.log(
        `%cSTARHOUND // ${STARHOUND.version}`,
        "color:#9cff9c"
    );

    STARHOUND.perfil = ALMACEN_STARHOUND.cargar();

    aplicarDesbloqueos();

    crearAplicacion();

    mostrarPantalla("agentes");
});


/* =========================================================
   APLICACIÓN
   ========================================================= */

function crearAplicacion() {
    let app = document.getElementById("starhound-app");

    if (!app) {
        app = document.createElement("main");
        app.id = "starhound-app";

        document.body.innerHTML = "";
        document.body.appendChild(app);
    }

    app.innerHTML = `
        <header class="barra-starhound">

            <div class="marca-starhound">
                <span class="marca-codigo">
                    STARHOUND
                </span>

                <span class="marca-subtitulo">
                    ACADEMIA INTERGALÁCTICA DE RASTREADORES
                </span>
            </div>

            <div class="estado-cazador">

                <div class="dato-superior">
                    <span>RANGO</span>
                    <strong id="ui-rango">---</strong>
                </div>

                <div class="dato-superior">
                    <span>NIVEL</span>
                    <strong id="ui-nivel">1</strong>
                </div>

                <div class="dato-superior">
                    <span>CRÉDITOS</span>
                    <strong id="ui-creditos">0</strong>
                </div>

            </div>

        </header>


        <nav class="navegacion-starhound">

            <button data-pantalla="agentes">
                AGENTE
            </button>

            <button data-pantalla="contratos">
                CONTRATOS
            </button>

            <button data-pantalla="caso">
                CASO
            </button>

            <button data-pantalla="archivo">
                ARCHIVO
            </button>

            <button data-pantalla="perfil">
                PERFIL
            </button>

        </nav>


        <section
            id="pantalla-starhound"
            class="pantalla-starhound">
        </section>


        <div
            id="mensaje-starhound"
            class="mensaje-starhound">
        </div>
    `;

    document
        .querySelectorAll("[data-pantalla]")
        .forEach(boton => {

            boton.addEventListener("click", () => {
                mostrarPantalla(
                    boton.dataset.pantalla
                );
            });

        });

    actualizarCabecera();
}


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function mostrarPantalla(nombre) {
    STARHOUND.pantalla = nombre;

    document
        .querySelectorAll("[data-pantalla]")
        .forEach(boton => {

            boton.classList.toggle(
                "activo",
                boton.dataset.pantalla === nombre
            );

        });

    const pantallas = {
        agentes: renderAgentes,
        contratos: renderContratos,
        caso: renderCaso,
        archivo: renderArchivo,
        perfil: renderPerfil
    };

    const render = pantallas[nombre] || renderAgentes;

    render();

    actualizarCabecera();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   AGENTES
   ========================================================= */

function renderAgentes() {
    const pantalla = obtenerPantalla();

    pantalla.innerHTML = `
        ${crearCabeceraSeccion(
            "01 // IDENTIDAD OPERATIVA",
            "SELECCIONÁ TU CAZADOR",
            "Cada agente altera la forma de investigar un contrato."
        )}

        <div
            id="lista-agentes"
            class="grid-seleccion">
        </div>
    `;

    const lista = document.getElementById("lista-agentes");

    obtenerAgentes().forEach((agente, indice) => {

        const id = obtenerIdAgente(agente);

        const desbloqueado =
            STARHOUND.perfil.agentesDesbloqueados.includes(id);

        const seleccionado =
            obtenerIdAgente(STARHOUND.agente) === id;

        const tarjeta = document.createElement("article");

        tarjeta.className = `
            tarjeta-terminal
            ${seleccionado ? "seleccionada" : ""}
            ${!desbloqueado ? "bloqueada" : ""}
        `;

        tarjeta.innerHTML = `
            <div class="tarjeta-indice">
                AG-${String(indice + 1).padStart(2, "0")}
            </div>

            <h3>
                ${obtenerNombre(agente)}
            </h3>

            <p class="tarjeta-rol">
                ${agente.clase || agente.rol || "RASTREADOR"}
            </p>

            <p>
                ${obtenerDescripcion(agente)}
            </p>

            <div class="bloque-datos">

                <span>
                    PERK //
                    ${agente.perk ||
                    agente.habilidad ||
                    "PROTOCOLO ESTÁNDAR"}
                </span>

                <span>
                    ${desbloqueado
                        ? "ESTADO // DISPONIBLE"
                        : "ESTADO // BLOQUEADO"}
                </span>

            </div>

            <button
                class="boton-terminal"
                ${!desbloqueado ? "disabled" : ""}
            >
                ${seleccionado
                    ? "AGENTE ACTIVO"
                    : desbloqueado
                        ? "SELECCIONAR"
                        : "ACCESO DENEGADO"}
            </button>
        `;

        if (desbloqueado) {
            tarjeta
                .querySelector("button")
                .addEventListener("click", () => {

                    STARHOUND.agente = agente;

                    notificar(
                        `${obtenerNombre(agente)} // IDENTIDAD CONFIRMADA`
                    );

                    renderAgentes();

                    setTimeout(() => {
                        mostrarPantalla("contratos");
                    }, 450);
                });
        }

        lista.appendChild(tarjeta);
    });
}


/* =========================================================
   CONTRATOS
   ========================================================= */

function renderContratos() {
    const pantalla = obtenerPantalla();

    if (!STARHOUND.agente) {
        pantalla.innerHTML = crearBloqueRestriccion(
            "IDENTIDAD NO CONFIRMADA",
            "Seleccioná un agente antes de acceder a la red de contratos.",
            "SELECCIONAR AGENTE",
            "agentes"
        );

        return;
    }

    pantalla.innerHTML = `
        ${crearCabeceraSeccion(
            "02 // RED DE RECOMPENSAS",
            "CONTRATOS DISPONIBLES",
            "Elegí una señal. Una vez aceptado el contrato, el reloj comienza."
        )}

        <div
            id="lista-contratos"
            class="grid-seleccion">
        </div>
    `;

    const lista = document.getElementById("lista-contratos");

    obtenerContratos().forEach((contrato, indice) => {

        const nivelMinimo =
            contrato.nivelMinimo ||
            contrato.nivel_minimo ||
            contrato.nivel ||
            1;

        const disponible =
            STARHOUND.perfil.nivel >= nivelMinimo;

        const recompensa =
            contrato.recompensa ||
            contrato.creditos ||
            300;

        const tarjeta = document.createElement("article");

        tarjeta.className = `
            tarjeta-terminal
            ${!disponible ? "bloqueada" : ""}
        `;

        tarjeta.innerHTML = `
            <div class="tarjeta-indice">
                CT-${String(indice + 1).padStart(3, "0")}
            </div>

            <h3>
                ${obtenerNombre(contrato)}
            </h3>

            <p>
                ${obtenerDescripcion(contrato)}
            </p>

            <div class="bloque-datos">

                <span>
                    AMENAZA //
                    ${contrato.dificultad ||
                    contrato.amenaza ||
                    "MEDIA"}
                </span>

                <span>
                    RECOMPENSA //
                    ${recompensa} CR
                </span>

                <span>
                    NIVEL REQUERIDO //
                    ${nivelMinimo}
                </span>

            </div>

            <button
                class="boton-terminal"
                ${!disponible ? "disabled" : ""}
            >
                ${disponible
                    ? "ACEPTAR CONTRATO"
                    : `BLOQUEADO // NIVEL ${nivelMinimo}`}
            </button>
        `;

        if (disponible) {
            tarjeta
                .querySelector("button")
                .addEventListener("click", () => {
                    aceptarContrato(contrato);
                });
        }

        lista.appendChild(tarjeta);
    });
}


/* =========================================================
   ACEPTAR CONTRATO
   ========================================================= */

function aceptarContrato(contrato) {
    const sospechoso =
        buscarSospechosoContrato(contrato);

    if (!sospechoso) {
        notificar(
            "CONTRATO INVÁLIDO // OBJETIVO NO ENCONTRADO"
        );

        return;
    }

    STARHOUND.contrato = contrato;
    STARHOUND.sospechoso = sospechoso;

    if (
        typeof sistemaEvidencias !== "undefined"
    ) {

        sistemaEvidencias.iniciarOperacion();

    }

    STARHOUND.indiceRuta = 0;

    STARHOUND.pistas = [];
    STARHOUND.pistasDestino = [];
    STARHOUND.pistasIdentidad = [];

    STARHOUND.identidad = 0;

    STARHOUND.accionesRealizadas = [];
    STARHOUND.lugaresInvestigados = [];

    STARHOUND.casoActivo = true;
    STARHOUND.casoFinalizado = false;

    const horas =
        contrato.horas ||
        contrato.tiempo ||
        contrato.limite ||
        72;

    STARHOUND.horas = horas;
    STARHOUND.horasIniciales = horas;

    const ruta = obtenerRutaContrato(contrato);

    STARHOUND.ubicacion = buscarPlaneta(ruta[0]);

    registrarArchivoSospechoso();

    notificar(
        `CONTRATO ACEPTADO // ${obtenerNombre(contrato)}`
    );

    ALMACEN_STARHOUND.guardar();

    mostrarPantalla("caso");
}


function buscarSospechosoContrato(contrato) {
    const referencia =
        contrato.ladrón_asignado_id ||
        contrato.ladron_asignado_id ||
        contrato.sospechoso ||
        contrato.sospechosoId ||
        contrato.sospechoso_id ||
        contrato.objetivo;

    if (typeof referencia === "object") {
        return referencia;
    }

    const encontrado = obtenerSospechosos().find(
        sospechoso =>
            obtenerIdSospechoso(sospechoso) === referencia
    );

    if (encontrado) return encontrado;

    if (referencia) return null;

    return obtenerSospechosos()[
        Math.floor(
            Math.random() * obtenerSospechosos().length
        )
    ];
}


/* =========================================================
   CASO
   ========================================================= */

function renderCaso() {
    const pantalla = obtenerPantalla();

    if (!STARHOUND.casoActivo) {
        pantalla.innerHTML = crearBloqueRestriccion(
            "SIN CONTRATO ACTIVO",
            "La nave no posee una señal de recompensa asignada.",
            "ABRIR RED DE CONTRATOS",
            "contratos"
        );

        return;
    }

    if (STARHOUND.casoFinalizado) {
        renderResultadoCaso();
        return;
    }

    const planeta = STARHOUND.ubicacion;

    pantalla.innerHTML = `
        ${crearCabeceraSeccion(
            "03 // OPERACIÓN ACTIVA",
            obtenerNombre(STARHOUND.contrato),
            obtenerDescripcion(STARHOUND.contrato)
        )}

        <div class="panel-operacion">

            <div class="hud-caso">

                ${crearDatoCaso(
                    "UBICACIÓN",
                    obtenerNombre(planeta)
                )}

                ${crearDatoCaso(
                    "VENTANA",
                    `${STARHOUND.horas} H`
                )}

                ${crearDatoCaso(
                    "IDENTIDAD",
                    `${STARHOUND.identidad}%`
                )}

                ${crearDatoCaso(
                    "INTEL",
                    STARHOUND.pistas.length
                )}

            </div>


            <article class="terminal-localizacion">

                <span class="etiqueta-terminal">
                    UBICACIÓN ACTUAL
                </span>

                <h2>
                    ${obtenerNombre(planeta)}
                </h2>

                <p>
                    ${obtenerDescripcion(planeta)}
                </p>

            </article>


            <div class="acciones-caso">

                <button
                    id="boton-investigar"
                    class="boton-terminal boton-principal">
                    INVESTIGAR SECTOR
                </button>

                <button
                    id="boton-viajar"
                    class="boton-terminal">
                    PLANIFICAR VIAJE
                </button>

                <button
                    id="boton-archivo-caso"
                    class="boton-terminal">
                    ABRIR ARCHIVO
                </button>

                <button
                    class="boton-terminal"
                    onclick="abrirTableroDeduccion()"
                >
                    TABLERO DE DEDUCCIÓN
                </button>

                <button
                    class="boton-terminal"
                    onclick="
                        investigarSectorStarhound({
                            id: 'rastreo_local',
                            nombre: 'Rastreo del sector',
                            categoria: 'logica',
                            horas: 2
                        })
                    "
                >
                    RASTREAR SECTOR
                </button>

                <button
                    id="boton-capturar"
                    class="boton-terminal boton-peligro">
                    INTENTAR CAPTURA
                </button>

            </div>


            <div
                id="subpantalla-caso"
                class="subpantalla-caso">
            </div>

        </div>
    `;

    document
        .getElementById("boton-investigar")
        .addEventListener(
            "click",
            renderOpcionesInvestigacion
        );

    document
        .getElementById("boton-viajar")
        .addEventListener(
            "click",
            renderPlanificarViaje
        );

    document
        .getElementById("boton-archivo-caso")
        .addEventListener(
            "click",
            () => mostrarPantalla("archivo")
        );

    document
        .getElementById("boton-capturar")
        .addEventListener(
            "click",
            intentarCaptura
        );

    renderResumenOperacion();
}


/* =========================================================
   RESUMEN OPERACIÓN
   ========================================================= */

function renderResumenOperacion() {
    const zona = obtenerSubpantalla();

    zona.innerHTML = `
        <div class="marco-contenido">

            <span class="etiqueta-terminal">
                CONSOLA DE NAVE
            </span>

            <h3>
                ESPERANDO ORDEN
            </h3>

            <p>
                Elegí una operación. Investigá la colonia,
                analizá la inteligencia recuperada o
                calculá el siguiente salto.
            </p>

            <div class="linea-sistema">
                STARHOUND //
                ${obtenerNombre(STARHOUND.agente)}
                EN SERVICIO
            </div>

        </div>
    `;
}


/* =========================================================
   INVESTIGACIÓN
   ========================================================= */

function renderOpcionesInvestigacion() {
    const zona = obtenerSubpantalla();

    const acciones =
        obtenerAccionesPlaneta(STARHOUND.ubicacion);

    zona.innerHTML = `
        <div class="marco-contenido">

            <div class="cabecera-submenu">

                <div>
                    <span class="etiqueta-terminal">
                        INVESTIGACIÓN
                    </span>

                    <h3>
                        SELECCIONÁ UN PUNTO DE INTERÉS
                    </h3>
                </div>

                <button
                    id="volver-operacion"
                    class="boton-volver">
                    ← VOLVER
                </button>

            </div>

            <div
                id="lista-investigaciones"
                class="lista-operaciones">
            </div>

        </div>
    `;

    const lista = document.getElementById(
        "lista-investigaciones"
    );

    acciones.forEach((accion, indice) => {

        const nombre =
            accion.nombre ||
            accion.name ||
            `SECTOR ${indice + 1}`;

        const idAccion =
            `${obtenerIdPlaneta(STARHOUND.ubicacion)}_${indice}`;

        const realizada =
            STARHOUND.accionesRealizadas.includes(idAccion);

        const boton = document.createElement("button");

        boton.className = "opcion-operacion";

        boton.disabled = realizada;

        boton.innerHTML = `
            <span class="opcion-numero">
                ${String(indice + 1).padStart(2, "0")}
            </span>

            <span class="opcion-texto">

                <strong>
                    ${nombre}
                </strong>

                <small>
                    ${realizada
                        ? "SECTOR YA ANALIZADO"
                        : describirTipoAccion(accion)}
                </small>

            </span>

            <span class="opcion-flecha">
                ${realizada ? "✓" : "→"}
            </span>
        `;

        if (!realizada) {
            boton.addEventListener("click", () => {
                ejecutarInvestigacion(
                    accion,
                    idAccion
                );
            });
        }

        lista.appendChild(boton);
    });

    document
        .getElementById("volver-operacion")
        .addEventListener(
            "click",
            renderResumenOperacion
        );
}


function describirTipoAccion(accion) {
    const tipo =
        accion.tipo ||
        accion.focus ||
        accion.enfoque ||
        "mixed";

    const textos = {
        identidad:
            "POSIBLE INTEL DE IDENTIDAD",

        identity:
            "POSIBLE INTEL DE IDENTIDAD",

        destino:
            "POSIBLE FIRMA DE SALTO",

        destination:
            "POSIBLE FIRMA DE SALTO",

        mixed:
            "INTEL MIXTA",

        mixto:
            "INTEL MIXTA"
    };

    return textos[tipo] || "ANÁLISIS DE CAMPO";
}


/* =========================================================
   EJECUTAR INVESTIGACIÓN
   ========================================================= */

async function ejecutarInvestigacion(
    accion,
    idAccion
) {
    const tipoPrueba =
        accion.minijuego ||
        accion.prueba ||
        seleccionarPruebaAccion(accion);

    const dificultad =
        calcularDificultadPrueba();

    STARHOUND.perfil.estadisticas.investigaciones++;

    const resultado =
        await iniciarPruebaInvestigacion(
            tipoPrueba,
            dificultad
        );

    STARHOUND.accionesRealizadas.push(idAccion);

    if (!resultado.exito) {
        const penalizacion =
            calcularPenalizacionError();

        consumirHoras(penalizacion);

        STARHOUND.perfil.estadisticas.pruebasFallidas++;

        STARHOUND.perfil.estadisticas.horasPerdidas +=
            penalizacion;

        notificar(
            `PRUEBA FALLIDA // -${penalizacion} HORAS`
        );

        ALMACEN_STARHOUND.guardar();

        comprobarTiempo();

        if (!STARHOUND.casoFinalizado) {
            renderCaso();
            renderOpcionesInvestigacion();
        }

        return;
    }

    STARHOUND.perfil.estadisticas.pruebasSuperadas++;

    const pista = obtenerPistaInvestigacion(accion);

    if (pista) {
        registrarPista(pista);
    }

    ganarExperiencia(
        CONFIG_JUEGO.bonusPrueba,
        false
    );

    ALMACEN_STARHOUND.guardar();

    notificar(
        pista
            ? "INTEL RECUPERADA // ARCHIVO ACTUALIZADO"
            : "SECTOR LIMPIO // SIN INTEL ÚTIL"
    );

    renderCaso();
    renderOpcionesInvestigacion();
}


/* =========================================================
   PRUEBAS
   ========================================================= */

function seleccionarPruebaAccion(accion) {
    const nombre = (
        accion.nombre ||
        accion.name ||
        ""
    ).toLowerCase();

    const tipo =
        accion.tipo ||
        accion.focus ||
        accion.enfoque ||
        "";

    if (
        nombre.includes("hack") ||
        nombre.includes("terminal") ||
        nombre.includes("registro") ||
        nombre.includes("sistema")
    ) {
        return "hack";
    }

    if (
        nombre.includes("interro") ||
        nombre.includes("preguntar") ||
        nombre.includes("hablar") ||
        nombre.includes("informante")
    ) {
        return "interrogatorio";
    }

    if (
        nombre.includes("mercado") ||
        nombre.includes("cantina") ||
        nombre.includes("bar")
    ) {
        return Math.random() > 0.5
            ? "cartas"
            : "interrogatorio";
    }

    if (
        nombre.includes("baliza") ||
        nombre.includes("señal")
    ) {
        return Math.random() > 0.5
            ? "secuencia"
            : "pulso";
    }

    if (
        tipo === "destination" ||
        tipo === "destino"
    ) {
        const pruebas = [
            "logica",
            "matematica",
            "secuencia",
            "pulso"
        ];

        return elegirAleatorio(pruebas);
    }

    if (
        tipo === "identity" ||
        tipo === "identidad"
    ) {
        const pruebas = [
            "acertijo",
            "memoria",
            "interrogatorio",
            "logica"
        ];

        return elegirAleatorio(pruebas);
    }

    return elegirAleatorio([
        "matematica",
        "logica",
        "acertijo",
        "memoria",
        "secuencia",
        "hack",
        "interrogatorio"
    ]);
}


function calcularDificultadPrueba() {
    const base =
        STARHOUND.contrato?.nivel ||
        STARHOUND.contrato?.dificultadNumerica ||
        2;

    const progreso =
        Math.floor(STARHOUND.indiceRuta / 2);

    return Math.min(
        6,
        Math.max(1, Number(base) + progreso)
    );
}


function calcularPenalizacionError() {
    let horas = CONFIG_JUEGO.horasErrorPrueba;

    const agente = STARHOUND.agente;

    if (
        agente?.bonusTiempo ||
        agente?.habilidad === "rastreador"
    ) {
        horas = Math.max(1, horas - 1);
    }

    return horas;
}


/* =========================================================
   PISTAS
   ========================================================= */

function obtenerPistaInvestigacion(accion) {
    const planeta = STARHOUND.ubicacion;

    const referencias =
        accion.pistas ||
        accion.posibles_pistas ||
        planeta.pistas ||
        planeta.possible_clues ||
        [];

    let banco = [];

    if (referencias.length) {
        banco = referencias
            .map(referencia =>
                buscarPista(referencia)
            )
            .filter(Boolean);
    }

    if (!banco.length) {
        banco = generarPistasDinamicas(accion);
    }

    const noObtenidas = banco.filter(
        pista =>
            !STARHOUND.pistas.some(
                existente =>
                    obtenerIdPista(existente) ===
                    obtenerIdPista(pista)
            )
    );

    if (!noObtenidas.length) {
        return null;
    }

    return elegirAleatorio(noObtenidas);
}


function buscarPista(referencia) {
    if (typeof referencia === "object") {
        return referencia;
    }

    const bancos = [];

    if (typeof PISTAS !== "undefined") {
        bancos.push(...PISTAS);
    }

    if (typeof CLUES !== "undefined") {
        bancos.push(...CLUES);
    }

    return bancos.find(
        pista =>
            obtenerIdPista(pista) === referencia
    );
}


function obtenerIdPista(pista) {
    return pista?.id ||
        pista?.codigo ||
        pista?.texto ||
        pista?.text_pista;
}


/* =========================================================
   PISTAS DINÁMICAS
   ========================================================= */

function generarPistasDinamicas(accion) {
    const tipo =
        accion.tipo ||
        accion.focus ||
        accion.enfoque ||
        "mixed";

    const pistas = [];

    const siguiente = obtenerSiguientePlaneta();

    if (
        siguiente &&
        (
            tipo === "destination" ||
            tipo === "destino" ||
            tipo === "mixed" ||
            tipo === "mixto"
        )
    ) {
        pistas.push({
            id:
                `destino_${obtenerIdPlaneta(siguiente)}`,

            tipo: "destino",

            texto:
                `La firma de navegación coincide con el corredor de ${obtenerNombre(siguiente)}.`,

            valor:
                obtenerIdPlaneta(siguiente)
        });
    }

    if (
        tipo === "identity" ||
        tipo === "identidad" ||
        tipo === "mixed" ||
        tipo === "mixto"
    ) {
        pistas.push(
            crearPistaIdentidadDinamica()
        );
    }

    return pistas.filter(Boolean);
}


function crearPistaIdentidadDinamica() {
    const sospechoso = STARHOUND.sospechoso;

    if (!sospechoso) return null;

    const propiedades = [
        ["especie", "ESPECIE"],
        ["origen", "ORIGEN"],
        ["especialidad", "ESPECIALIDAD"],
        ["rasgo", "RASGO"],
        ["arma", "EQUIPO"],
        ["nave", "NAVE"],
        ["afiliacion", "AFILIACIÓN"]
    ];

    const disponibles = propiedades.filter(
        ([propiedad]) =>
            sospechoso[propiedad] !== undefined
    );

    if (!disponibles.length) {
        return {
            id:
                `identidad_${Date.now()}_${Math.random()}`,

            tipo: "identidad",

            texto:
                "La silueta coincide parcialmente con un objetivo registrado por la Academia.",

            valor: "COINCIDENCIA PARCIAL"
        };
    }

    const [propiedad, etiqueta] =
        elegirAleatorio(disponibles);

    return {
        id:
            `identidad_${propiedad}_${sospechoso[propiedad]}`,

        tipo: "identidad",

        propiedad,

        valor: sospechoso[propiedad],

        texto:
            `${etiqueta} CONFIRMADO // ${sospechoso[propiedad]}`
    };
}


/* =========================================================
   REGISTRAR PISTA
   ========================================================= */

function registrarPista(pista) {
    const yaRegistrada = STARHOUND.pistas.some(
        existente =>
            obtenerIdPista(existente) ===
            obtenerIdPista(pista)
    );

    if (yaRegistrada) return;

    STARHOUND.pistas.push(pista);

    const tipo =
        pista.tipo ||
        pista.type ||
        "identidad";

    if (
        tipo === "destination" ||
        tipo === "destino"
    ) {
        STARHOUND.pistasDestino.push(pista);
    }

    else {
        STARHOUND.pistasIdentidad.push(pista);

        recalcularIdentidad();
    }

    actualizarArchivoSospechoso(pista);

    if (
        typeof sistemaEvidencias !== "undefined" &&
        typeof sistemaEvidencias.registrarPistaOperacion ===
            "function"
    ) {
        sistemaEvidencias.registrarPistaOperacion(pista);
    }
}


function recalcularIdentidad() {
    const valoresUnicos = new Set(
        STARHOUND.pistasIdentidad.map(pista =>
            pista.propiedad ||
            pista.value_associated?.property ||
            obtenerIdPista(pista)
        )
    );

    STARHOUND.identidad = Math.min(
        100,
        valoresUnicos.size * 18
    );

    const agente = STARHOUND.agente;

    if (
        agente?.bonusIdentidad ||
        agente?.especialidad === "perfilador"
    ) {
        STARHOUND.identidad = Math.min(
            100,
            STARHOUND.identidad + 8
        );
    }
}


/* =========================================================
   VIAJE
   ========================================================= */

function renderPlanificarViaje() {
    const zona = obtenerSubpantalla();

    const siguiente = obtenerSiguientePlaneta();

    if (!siguiente) {
        zona.innerHTML = `
            <div class="marco-contenido">

                <div class="cabecera-submenu">

                    <div>
                        <span class="etiqueta-terminal">
                            NAVEGACIÓN
                        </span>

                        <h3>
                            FIN DE LA FIRMA DE SALTO
                        </h3>
                    </div>

                    <button
                        id="volver-operacion"
                        class="boton-volver">
                        ← VOLVER
                    </button>

                </div>

                <p>
                    No existen nuevos saltos registrados.
                    El objetivo debería encontrarse en esta colonia.
                </p>

                <div class="alerta-terminal">
                    PROTOCOLO RECOMENDADO //
                    COMPLETAR IDENTIFICACIÓN E INTENTAR CAPTURA
                </div>

            </div>
        `;

        document
            .getElementById("volver-operacion")
            .addEventListener(
                "click",
                renderResumenOperacion
            );

        return;
    }

    const opciones = generarOpcionesViaje(siguiente);

    zona.innerHTML = `
        <div class="marco-contenido">

            <div class="cabecera-submenu">

                <div>
                    <span class="etiqueta-terminal">
                        NAVEGACIÓN
                    </span>

                    <h3>
                        SELECCIONÁ CORREDOR DE SALTO
                    </h3>
                </div>

                <button
                    id="volver-operacion"
                    class="boton-volver">
                    ← VOLVER
                </button>

            </div>

            <p>
                La computadora propone cuatro destinos.
                Revisá la inteligencia antes de confirmar.
            </p>

            <div
                id="opciones-viaje"
                class="lista-operaciones">
            </div>

        </div>
    `;

    const lista = document.getElementById(
        "opciones-viaje"
    );

    opciones.forEach((planeta, indice) => {

        const boton = document.createElement("button");

        boton.className = "opcion-operacion";

        boton.innerHTML = `
            <span class="opcion-numero">
                ${String(indice + 1).padStart(2, "0")}
            </span>

            <span class="opcion-texto">

                <strong>
                    ${obtenerNombre(planeta)}
                </strong>

                <small>
                    ${planeta.sector ||
                    planeta.region ||
                    "CORREDOR INTERESTELAR"}
                </small>

            </span>

            <span class="opcion-flecha">
                →
            </span>
        `;

        boton.addEventListener("click", () => {
            viajarA(planeta);
        });

        lista.appendChild(boton);
    });

    document
        .getElementById("volver-operacion")
        .addEventListener(
            "click",
            renderResumenOperacion
        );
}


function generarOpcionesViaje(correcto) {
    const planetas = obtenerPlanetas();

    const incorrectos = mezclar(
        planetas.filter(planeta =>
            obtenerIdPlaneta(planeta) !==
                obtenerIdPlaneta(correcto) &&

            obtenerIdPlaneta(planeta) !==
                obtenerIdPlaneta(STARHOUND.ubicacion)
        )
    ).slice(0, 3);

    return mezclar([
        correcto,
        ...incorrectos
    ]);
}


function viajarA(planeta) {
    const siguiente = obtenerSiguientePlaneta();

    STARHOUND.perfil.estadisticas.viajes++;

    const correcto =
        obtenerIdPlaneta(planeta) ===
        obtenerIdPlaneta(siguiente);

    if (!correcto) {
        consumirHoras(
            CONFIG_JUEGO.horasViajeIncorrecto
        );

        STARHOUND.perfil.estadisticas.erroresRuta++;

        STARHOUND.perfil.estadisticas.horasPerdidas +=
            CONFIG_JUEGO.horasViajeIncorrecto;

        notificar(
            `RUTA INCORRECTA // -${CONFIG_JUEGO.horasViajeIncorrecto} HORAS`
        );

        ALMACEN_STARHOUND.guardar();

        comprobarTiempo();

        if (!STARHOUND.casoFinalizado) {
            renderCaso();
            renderPlanificarViaje();
        }

        return;
    }

    STARHOUND.indiceRuta++;

    STARHOUND.ubicacion = planeta;

    notificar(
        `SALTO CONFIRMADO // ${obtenerNombre(planeta)}`
    );

    ALMACEN_STARHOUND.guardar();

    renderCaso();
}


/* =========================================================
   SIGUIENTE PLANETA
   ========================================================= */

function obtenerSiguientePlaneta() {
    const ruta = obtenerRutaContrato(
        STARHOUND.contrato
    );

    const referencia =
        ruta[STARHOUND.indiceRuta + 1];

    if (!referencia) return null;

    return buscarPlaneta(referencia);
}


function buscarPlaneta(referencia) {
    if (typeof referencia === "object") {
        return referencia;
    }

    return obtenerPlanetas().find(
        planeta =>
            obtenerIdPlaneta(planeta) === referencia
    );
}


/* =========================================================
   CAPTURA
   ========================================================= */

function intentarCaptura() {
    const siguiente = obtenerSiguientePlaneta();

    if (siguiente) {
        notificar(
            "CAPTURA IMPOSIBLE // EL OBJETIVO YA ABANDONÓ EL SECTOR"
        );

        return;
    }

    if (
        STARHOUND.identidad <
        CONFIG_JUEGO.identidadMinimaCaptura
    ) {
        confirmarCapturaTemprana();
        return;
    }

    ejecutarCaptura();
}


function confirmarCapturaTemprana() {
    const zona = obtenerSubpantalla();

    zona.innerHTML = `
        <div class="marco-contenido alerta-captura">

            <span class="etiqueta-terminal">
                ADVERTENCIA DE ACADEMIA
            </span>

            <h3>
                IDENTIDAD INCOMPLETA //
                ${STARHOUND.identidad}%
            </h3>

            <p>
                El archivo no posee suficiente información
                para confirmar al objetivo.
            </p>

            <p>
                Una captura prematura puede permitir que
                un señuelo active la fuga del verdadero sospechoso.
            </p>

            <div class="acciones-confirmacion">

                <button
                    id="confirmar-captura"
                    class="boton-terminal boton-peligro">
                    ASUMIR RIESGO
                </button>

                <button
                    id="cancelar-captura"
                    class="boton-terminal">
                    CONTINUAR INVESTIGANDO
                </button>

            </div>

        </div>
    `;

    document
        .getElementById("confirmar-captura")
        .addEventListener(
            "click",
            ejecutarCaptura
        );

    document
        .getElementById("cancelar-captura")
        .addEventListener(
            "click",
            renderResumenOperacion
        );
}


function ejecutarCaptura() {
    iniciarCapturaSospechoso(
        STARHOUND.sospechoso,

        exitoMinijuego => {

            let exito = exitoMinijuego;

            if (
                STARHOUND.identidad <
                CONFIG_JUEGO.identidadMinimaCaptura
            ) {
                const probabilidad =
                    STARHOUND.identidad / 100;

                if (
                    Math.random() >
                    probabilidad +
                    CONFIG_JUEGO.penalizacionCapturaTemprana
                ) {
                    exito = false;
                }
            }

            finalizarCaso(exito);
        }
    );
}


/* =========================================================
   FINAL DEL CASO
   ========================================================= */

function finalizarCaso(exito) {
    STARHOUND.casoFinalizado = true;

    if (exito) {
        const recompensa =
            STARHOUND.contrato.recompensa ||
            STARHOUND.contrato.creditos ||
            300;

        const experiencia =
            STARHOUND.contrato.experiencia ||
            STARHOUND.contrato.xp ||
            80;

        STARHOUND.perfil.creditos += recompensa;

        STARHOUND.perfil.contratosCompletados++;

        const idSospechoso =
            obtenerIdSospechoso(
                STARHOUND.sospechoso
            );

        if (
            !STARHOUND.perfil
                .sospechososCapturados
                .includes(idSospechoso)
        ) {
            STARHOUND.perfil
                .sospechososCapturados
                .push(idSospechoso);
        }

        ganarExperiencia(experiencia);

        completarArchivoSospechoso();

        notificar(
            `OBJETIVO CAPTURADO // +${recompensa} CR`
        );
    }

    else {
        STARHOUND.perfil.contratosFallidos++;

        notificar(
            "OBJETIVO PERDIDO // CONTRATO FALLIDO"
        );
    }

    aplicarDesbloqueos();

    ALMACEN_STARHOUND.guardar();

    renderResultadoCaso();
}


/* =========================================================
   RESULTADO
   ========================================================= */

function renderResultadoCaso() {
    const pantalla = obtenerPantalla();

    const capturado =
        STARHOUND.perfil
            .sospechososCapturados
            .includes(
                obtenerIdSospechoso(
                    STARHOUND.sospechoso
                )
            );

    pantalla.innerHTML = `
        <div class="resultado-caso">

            <span class="etiqueta-terminal">
                INFORME POST-OPERACIÓN
            </span>

            <h1>
                ${capturado
                    ? "OBJETIVO CAPTURADO"
                    : "CONTRATO FALLIDO"}
            </h1>

            <div class="marco-contenido">

                <h2>
                    ${obtenerNombre(
                        STARHOUND.sospechoso
                    )}
                </h2>

                <p>
                    ${capturado
                        ? "La recompensa fue transferida. El objetivo fue entregado a la Academia."
                        : "El objetivo rompió el cerco y abandonó el sistema."}
                </p>

                <div class="bloque-datos">

                    <span>
                        IDENTIDAD FINAL //
                        ${STARHOUND.identidad}%
                    </span>

                    <span>
                        HORAS RESTANTES //
                        ${STARHOUND.horas}
                    </span>

                    <span>
                        INTEL RECUPERADA //
                        ${STARHOUND.pistas.length}
                    </span>

                </div>

            </div>

            <button
                id="nuevo-contrato"
                class="boton-terminal boton-principal">
                VOLVER A LA RED DE CONTRATOS
            </button>

            <button
                id="abrir-archivo-final"
                class="boton-terminal">
                CONSULTAR ARCHIVO
            </button>

        </div>
    `;

    document
        .getElementById("nuevo-contrato")
        .addEventListener("click", () => {

            limpiarCaso();

            mostrarPantalla("contratos");
        });

    document
        .getElementById("abrir-archivo-final")
        .addEventListener(
            "click",
            () => mostrarPantalla("archivo")
        );
}


/* =========================================================
   ARCHIVO / POKÉDEX
   ========================================================= */

function renderArchivo() {
    const pantalla = obtenerPantalla();

    pantalla.innerHTML = `
        ${crearCabeceraSeccion(
            "04 // ARCHIVO STARHOUND",
            "ÍNDICE DE OBJETIVOS",
            "La Academia reconstruye perfiles a partir de inteligencia recuperada."
        )}

        <div
            id="archivo-sospechosos"
            class="grid-archivo">
        </div>
    `;

    const archivo = document.getElementById(
        "archivo-sospechosos"
    );

    obtenerSospechosos().forEach(
        (sospechoso, indice) => {

            const id =
                obtenerIdSospechoso(sospechoso);

            const registro =
                STARHOUND.perfil.archivo[id];

            const progreso =
                registro?.progreso || 0;

            const capturado =
                STARHOUND.perfil
                    .sospechososCapturados
                    .includes(id);

            const tarjeta =
                document.createElement("button");

            tarjeta.className = "tarjeta-archivo";

            tarjeta.innerHTML = `
                <span class="archivo-codigo">
                    OBJ-${String(indice + 1).padStart(3, "0")}
                </span>

                <div class="archivo-silueta">
                    ${progreso >= 40
                        ? obtenerIniciales(
                            obtenerNombre(sospechoso)
                        )
                        : "?"}
                </div>

                <h3>
                    ${progreso >= 65
                        ? obtenerNombre(sospechoso)
                        : "IDENTIDAD DESCONOCIDA"}
                </h3>

                <div class="barra-archivo">

                    <div
                        style="width:${progreso}%">
                    </div>

                </div>

                <span>
                    DATOS // ${progreso}%
                </span>

                <span>
                    ${capturado
                        ? "ESTADO // CAPTURADO"
                        : "ESTADO // ACTIVO"}
                </span>
            `;

            tarjeta.addEventListener("click", () => {
                abrirFichaArchivo(sospechoso);
            });

            archivo.appendChild(tarjeta);
        }
    );
}


/* =========================================================
   FICHA ARCHIVO
   ========================================================= */

function abrirFichaArchivo(sospechoso) {
    const pantalla = obtenerPantalla();

    const id =
        obtenerIdSospechoso(sospechoso);

    const registro =
        STARHOUND.perfil.archivo[id] || {
            progreso: 0,
            datos: {}
        };

    const progreso = registro.progreso || 0;

    pantalla.innerHTML = `
        <div class="ficha-objetivo">

            <button
                id="volver-archivo"
                class="boton-volver">
                ← VOLVER AL ÍNDICE
            </button>

            <div class="marco-contenido">

                <span class="etiqueta-terminal">
                    ARCHIVO CLASIFICADO
                </span>

                <h1>
                    ${progreso >= 65
                        ? obtenerNombre(sospechoso)
                        : "OBJETIVO SIN IDENTIFICAR"}
                </h1>

                <div class="progreso-identidad">

                    <div class="barra-archivo grande">

                        <div
                            style="width:${progreso}%">
                        </div>

                    </div>

                    <strong>
                        RECONSTRUCCIÓN //
                        ${progreso}%
                    </strong>

                </div>

                <div class="datos-ficha">

                    ${crearCampoArchivo(
                        "ESPECIE",
                        registro.datos?.especie
                    )}

                    ${crearCampoArchivo(
                        "ORIGEN",
                        registro.datos?.origen
                    )}

                    ${crearCampoArchivo(
                        "ESPECIALIDAD",
                        registro.datos?.especialidad
                    )}

                    ${crearCampoArchivo(
                        "RASGO",
                        registro.datos?.rasgo
                    )}

                    ${crearCampoArchivo(
                        "EQUIPO",
                        registro.datos?.arma
                    )}

                    ${crearCampoArchivo(
                        "NAVE",
                        registro.datos?.nave
                    )}

                    ${crearCampoArchivo(
                        "AFILIACIÓN",
                        registro.datos?.afiliacion
                    )}

                </div>

            </div>

        </div>
    `;

    document
        .getElementById("volver-archivo")
        .addEventListener(
            "click",
            renderArchivo
        );
}


/* =========================================================
   SISTEMA DE ARCHIVO
   ========================================================= */

function registrarArchivoSospechoso() {
    const sospechoso = STARHOUND.sospechoso;

    if (!sospechoso) return;

    const id = obtenerIdSospechoso(sospechoso);

    if (!STARHOUND.perfil.archivo[id]) {
        STARHOUND.perfil.archivo[id] = {
            progreso: 5,
            datos: {},
            encuentros: 0
        };
    }

    STARHOUND.perfil.archivo[id].encuentros++;
}


function actualizarArchivoSospechoso(pista) {
    const sospechoso = STARHOUND.sospechoso;

    if (!sospechoso) return;

    const id = obtenerIdSospechoso(sospechoso);

    registrarArchivoSospechoso();

    const registro =
        STARHOUND.perfil.archivo[id];

    const propiedad =
        pista.propiedad ||
        pista.value_associated?.property;

    const valor =
        pista.valor ||
        pista.value_associated?.value;

    if (propiedad && valor) {
        registro.datos[propiedad] = valor;
    }

    registro.progreso = Math.max(
        registro.progreso,
        STARHOUND.identidad
    );
}


function completarArchivoSospechoso() {
    const sospechoso = STARHOUND.sospechoso;

    if (!sospechoso) return;

    const id = obtenerIdSospechoso(sospechoso);

    registrarArchivoSospechoso();

    const registro =
        STARHOUND.perfil.archivo[id];

    registro.progreso = 100;

    [
        "especie",
        "origen",
        "especialidad",
        "rasgo",
        "arma",
        "nave",
        "afiliacion"
    ].forEach(propiedad => {

        if (sospechoso[propiedad] !== undefined) {
            registro.datos[propiedad] =
                sospechoso[propiedad];
        }

    });
}


/* =========================================================
   PERFIL
   ========================================================= */

function renderPerfil() {
    const pantalla = obtenerPantalla();

    const perfil = STARHOUND.perfil;

    const rango = obtenerRangoActual();

    pantalla.innerHTML = `
        ${crearCabeceraSeccion(
            "05 // EXPEDIENTE PERSONAL",
            "REGISTRO DEL CAZADOR",
            "Historial operativo sincronizado con la Academia."
        )}

        <div class="perfil-cazador">

            <article class="marco-contenido">

                <span class="etiqueta-terminal">
                    IDENTIDAD
                </span>

                <h2>
                    ${perfil.nombre}
                </h2>

                <div class="bloque-datos">

                    <span>
                        RANGO //
                        ${obtenerNombre(rango, "CADETE")}
                    </span>

                    <span>
                        NIVEL //
                        ${perfil.nivel}
                    </span>

                    <span>
                        EXPERIENCIA //
                        ${perfil.experiencia} /
                        ${experienciaSiguienteNivel()}
                    </span>

                    <span>
                        CRÉDITOS //
                        ${perfil.creditos}
                    </span>

                </div>

                <div class="barra-archivo grande">

                    <div
                        style="width:${porcentajeExperiencia()}%">
                    </div>

                </div>

            </article>


            <article class="marco-contenido">

                <span class="etiqueta-terminal">
                    HISTORIAL
                </span>

                <div class="datos-ficha">

                    ${crearDatoEstadistica(
                        "CONTRATOS COMPLETADOS",
                        perfil.contratosCompletados
                    )}

                    ${crearDatoEstadistica(
                        "CONTRATOS FALLIDOS",
                        perfil.contratosFallidos
                    )}

                    ${crearDatoEstadistica(
                        "OBJETIVOS CAPTURADOS",
                        perfil.sospechososCapturados.length
                    )}

                    ${crearDatoEstadistica(
                        "INVESTIGACIONES",
                        perfil.estadisticas.investigaciones
                    )}

                    ${crearDatoEstadistica(
                        "PRUEBAS SUPERADAS",
                        perfil.estadisticas.pruebasSuperadas
                    )}

                    ${crearDatoEstadistica(
                        "ERRORES DE RUTA",
                        perfil.estadisticas.erroresRuta
                    )}

                </div>

            </article>

        </div>
    `;
}


/* =========================================================
   EXPERIENCIA
   ========================================================= */

function ganarExperiencia(
    cantidad,
    guardar = true
) {
    STARHOUND.perfil.experiencia += cantidad;

    STARHOUND.perfil.experienciaTotal += cantidad;

    while (
        STARHOUND.perfil.experiencia >=
        experienciaSiguienteNivel()
    ) {
        const necesaria =
            experienciaSiguienteNivel();

        STARHOUND.perfil.experiencia -= necesaria;

        STARHOUND.perfil.nivel++;

        notificar(
            `ASCENSO // NIVEL ${STARHOUND.perfil.nivel}`
        );

        aplicarDesbloqueos();
    }

    if (guardar) {
        ALMACEN_STARHOUND.guardar();
    }
}


function experienciaSiguienteNivel() {
    return 100 +
        (STARHOUND.perfil.nivel - 1) * 60;
}


function porcentajeExperiencia() {
    return Math.min(
        100,
        Math.round(
            STARHOUND.perfil.experiencia /
            experienciaSiguienteNivel() *
            100
        )
    );
}


/* =========================================================
   DESBLOQUEOS
   ========================================================= */

function aplicarDesbloqueos() {
    const agentes = obtenerAgentes();

    agentes.forEach((agente, indice) => {

        const nivel =
            agente.nivelMinimo ||
            agente.nivel_minimo ||
            indice * 2 + 1;

        const id = obtenerIdAgente(agente);

        if (
            STARHOUND.perfil.nivel >= nivel &&
            !STARHOUND.perfil
                .agentesDesbloqueados
                .includes(id)
        ) {
            STARHOUND.perfil
                .agentesDesbloqueados
                .push(id);
        }
    });

    obtenerPerks().forEach((perk, indice) => {

        const nivel =
            perk.nivelMinimo ||
            perk.nivel_minimo ||
            indice + 2;

        const id =
            perk.id ||
            perk.codigo ||
            perk.nombre;

        if (
            STARHOUND.perfil.nivel >= nivel &&
            !STARHOUND.perfil
                .perksDesbloqueados
                .includes(id)
        ) {
            STARHOUND.perfil
                .perksDesbloqueados
                .push(id);
        }
    });

    ALMACEN_STARHOUND.guardar();
}


/* =========================================================
   RANGO
   ========================================================= */

function obtenerRangoActual() {
    const rangos = obtenerRangos();

    if (!rangos.length) {
        return {
            nombre:
                STARHOUND.perfil.nivel >= 10
                    ? "STARHOUND"
                    : STARHOUND.perfil.nivel >= 5
                        ? "RASTREADOR"
                        : "CADETE"
        };
    }

    let actual = rangos[0];

    rangos.forEach(rango => {

        const nivel =
            rango.nivel ||
            rango.nivelMinimo ||
            rango.nivel_minimo ||
            1;

        if (STARHOUND.perfil.nivel >= nivel) {
            actual = rango;
        }
    });

    return actual;
}


/* =========================================================
   TIEMPO
   ========================================================= */

function consumirHoras(cantidad) {
    STARHOUND.horas = Math.max(
        0,
        STARHOUND.horas - cantidad
    );
}


function comprobarTiempo() {
    if (STARHOUND.horas > 0) {
        return false;
    }

    STARHOUND.casoFinalizado = true;

    STARHOUND.perfil.contratosFallidos++;

    notificar(
        "VENTANA OPERATIVA AGOTADA // OBJETIVO PERDIDO"
    );

    ALMACEN_STARHOUND.guardar();

    renderResultadoCaso();

    return true;
}


/* =========================================================
   LIMPIAR CASO
   ========================================================= */

function limpiarCaso() {
    STARHOUND.contrato = null;
    STARHOUND.sospechoso = null;
    STARHOUND.ubicacion = null;

    STARHOUND.indiceRuta = 0;

    STARHOUND.horas = 0;
    STARHOUND.horasIniciales = 0;

    STARHOUND.pistas = [];
    STARHOUND.pistasDestino = [];
    STARHOUND.pistasIdentidad = [];

    STARHOUND.identidad = 0;

    STARHOUND.accionesRealizadas = [];
    STARHOUND.lugaresInvestigados = [];

    STARHOUND.casoActivo = false;
    STARHOUND.casoFinalizado = false;
}


/* =========================================================
   UI
   ========================================================= */

function obtenerPantalla() {
    return document.getElementById(
        "pantalla-starhound"
    );
}


function obtenerSubpantalla() {
    return document.getElementById(
        "subpantalla-caso"
    );
}


function actualizarCabecera() {
    const rango = document.getElementById("ui-rango");
    const nivel = document.getElementById("ui-nivel");
    const creditos = document.getElementById("ui-creditos");

    if (!rango) return;

    rango.textContent =
        obtenerNombre(
            obtenerRangoActual(),
            "CADETE"
        );

    nivel.textContent =
        STARHOUND.perfil.nivel;

    creditos.textContent =
        STARHOUND.perfil.creditos;
}


function crearCabeceraSeccion(
    codigo,
    titulo,
    descripcion
) {
    return `
        <header class="cabecera-seccion">

            <span class="etiqueta-terminal">
                ${codigo}
            </span>

            <h1>
                ${titulo}
            </h1>

            <p>
                ${descripcion}
            </p>

        </header>
    `;
}


function crearBloqueRestriccion(
    titulo,
    descripcion,
    textoBoton,
    destino
) {
    setTimeout(() => {

        const boton =
            document.getElementById(
                "boton-restriccion"
            );

        if (boton) {
            boton.addEventListener("click", () => {
                mostrarPantalla(destino);
            });
        }

    }, 0);

    return `
        <div class="bloque-restriccion">

            <span class="etiqueta-terminal">
                ACCESO RESTRINGIDO
            </span>

            <h2>
                ${titulo}
            </h2>

            <p>
                ${descripcion}
            </p>

            <button
                id="boton-restriccion"
                class="boton-terminal">
                ${textoBoton}
            </button>

        </div>
    `;
}


function crearDatoCaso(etiqueta, valor) {
    return `
        <div class="dato-caso">

            <span>
                ${etiqueta}
            </span>

            <strong>
                ${valor}
            </strong>

        </div>
    `;
}


function crearCampoArchivo(etiqueta, valor) {
    return `
        <div class="campo-archivo">

            <span>
                ${etiqueta}
            </span>

            <strong>
                ${valor || "DATOS INSUFICIENTES"}
            </strong>

        </div>
    `;
}


function crearDatoEstadistica(etiqueta, valor) {
    return `
        <div class="campo-archivo">

            <span>
                ${etiqueta}
            </span>

            <strong>
                ${valor}
            </strong>

        </div>
    `;
}


/* =========================================================
   MENSAJES
   ========================================================= */

function notificar(texto) {
    STARHOUND.mensajeSistema = texto;

    const mensaje =
        document.getElementById(
            "mensaje-starhound"
        );

    if (!mensaje) return;

    mensaje.textContent = texto;

    mensaje.classList.add("activo");

    clearTimeout(notificar.temporizador);

    notificar.temporizador = setTimeout(() => {
        mensaje.classList.remove("activo");
    }, 2600);
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function elegirAleatorio(array) {
    if (!array || !array.length) {
        return null;
    }

    return array[
        Math.floor(Math.random() * array.length)
    ];
}


function mezclar(array) {
    return [...array].sort(
        () => Math.random() - 0.5
    );
}


function obtenerIniciales(nombre) {
    return nombre
        .split(" ")
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();
}


/* =========================================================
   STARHOUND
   PUENTE DE INVESTIGACIÓN
   ========================================================= */

function investigarSectorStarhound(
    opcion
) {

    if (
        typeof ejecutarInvestigacion
        === "undefined"
    ) {

        console.error(
            "[STARHOUND] Motor de investigación no disponible."
        );

        return;

    }

    if (!STARHOUND.casoActivo || STARHOUND.casoFinalizado) {
        notificar("NO HAY UNA OPERACIÓN ACTIVA");
        return;
    }

    ejecutarInvestigacion(
        opcion,
        opcion.id || `sector_${Date.now()}`
    );

}


function abrirTableroDeduccion() {

    if (
        typeof motorDeduccion
        === "undefined"
    ) {

        console.error(
            "[STARHOUND] Motor de deducción no disponible."
        );

        return;

    }


    motorDeduccion.abrir();

}


window.investigarSectorStarhound =
    investigarSectorStarhound;


window.abrirTableroDeduccion =
    abrirTableroDeduccion;
