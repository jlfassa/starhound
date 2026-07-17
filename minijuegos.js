/* =========================================================
   STARHOUND
   MOTOR UNIVERSAL DE PRUEBAS Y MINIJUEGOS
   ========================================================= */

const MOTOR_MINIJUEGOS = {
    activo: false,
    tipo: null,
    dificultad: 1,
    resolver: null,
    estado: {},
    temporizador: null,
    timeouts: new Set(),
    sesion: 0
};


/* =========================================================
   API PRINCIPAL
   ========================================================= */

function iniciarPruebaInvestigacion(tipo, dificultad = 1) {
    return new Promise((resolve) => {
        cerrarMinijuego();

        MOTOR_MINIJUEGOS.activo = true;
        MOTOR_MINIJUEGOS.tipo = tipo;
        MOTOR_MINIJUEGOS.dificultad = dificultad;
        MOTOR_MINIJUEGOS.resolver = resolve;
        MOTOR_MINIJUEGOS.estado = {};
        MOTOR_MINIJUEGOS.sesion++;

        crearInterfazMinijuego();

        const motores = {
            matematica: iniciarMatematica,
            logica: iniciarLogica,
            acertijo: iniciarAcertijo,
            memoria: iniciarMemoria,
            secuencia: iniciarSecuencia,
            hack: iniciarHack,
            interrogatorio: iniciarInterrogatorio,
            cartas: iniciarCartas,
            pulso: iniciarPulso
        };

        const motor = motores[tipo] || iniciarLogica;
        motor(dificultad);
    });
}


/* =========================================================
   COMPATIBILIDAD CON CAPTURAS
   ========================================================= */

function iniciarMinijuegoCaptura(tipo, callback) {
    iniciarPruebaInvestigacion(tipo, 4).then(resultado => {
        if (typeof callback === "function") {
            callback(resultado.exito);
        }
    });
}


/* =========================================================
   INTERFAZ BASE
   ========================================================= */

function crearInterfazMinijuego() {
    let modal = document.getElementById("modal-minijuego");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-minijuego";
        modal.className = "modal-minijuego";

        modal.innerHTML = `
            <div class="terminal-prueba">

                <div class="terminal-prueba__cabecera">
                    <div>
                        <span class="terminal-prueba__codigo">
                            STARHOUND // PRUEBA DE CAMPO
                        </span>

                        <h2 id="minijuego-titulo">
                            PROCESANDO...
                        </h2>
                    </div>

                    <div class="terminal-prueba__estado">
                        <span class="punto-terminal"></span>
                        ENLACE ACTIVO
                    </div>
                </div>

                <div class="terminal-prueba__marco">

                    <div id="minijuego-descripcion"
                         class="minijuego-descripcion">
                    </div>

                    <div id="minijuego-contenido"
                         class="minijuego-contenido">
                    </div>

                    <div id="minijuego-mensaje"
                         class="minijuego-mensaje">
                    </div>

                </div>

                <div class="terminal-prueba__pie">
                    <span>
                        ERROR = PÉRDIDA DE TIEMPO OPERATIVO
                    </span>

                    <span id="minijuego-dificultad">
                        NIVEL //
                    </span>
                </div>

            </div>
        `;

        document.body.appendChild(modal);
    }

    modal.classList.add("activo");
}


function obtenerZonaMinijuego() {
    return {
        modal: document.getElementById("modal-minijuego"),
        titulo: document.getElementById("minijuego-titulo"),
        descripcion: document.getElementById("minijuego-descripcion"),
        contenido: document.getElementById("minijuego-contenido"),
        mensaje: document.getElementById("minijuego-mensaje"),
        dificultad: document.getElementById("minijuego-dificultad")
    };
}


function prepararPantalla(titulo, descripcion, dificultad) {
    const ui = obtenerZonaMinijuego();

    ui.modal.dataset.minijuego = MOTOR_MINIJUEGOS.tipo || "logica";
    ui.titulo.textContent = titulo;
    ui.descripcion.textContent = descripcion;
    ui.contenido.innerHTML = "";
    ui.mensaje.textContent = "";
    ui.mensaje.className = "minijuego-mensaje";
    ui.dificultad.textContent = `NIVEL // ${dificultad}`;

    ui.contenido.insertAdjacentHTML(
        "beforeend",
        crearContextoVisualPrueba(
            MOTOR_MINIJUEGOS.tipo,
            dificultad
        )
    );

    return ui;
}


function crearContextoVisualPrueba(tipo, dificultad) {
    const nivel = String(dificultad).padStart(2, "0");

    const contextos = {
        matematica: `
            <div class="escena-prueba escena-navegacion">
                <span>TRAJECTORY_COMPUTER // NAV-${nivel}</span>
                <div class="radar-navegacion"><i></i><b></b></div>
                <small>COMBUSTIBLE ESTIMADO // ESTABLE</small>
            </div>
        `,
        logica: `
            <div class="escena-prueba escena-forense">
                <span>FORENSIC_CASE // ${nivel}-X</span>
                <strong>HIPÓTESIS EN ANÁLISIS</strong>
                <small>CLASIFICACIÓN // RESTRINGIDA</small>
            </div>
        `,
        acertijo: `
            <div class="escena-prueba escena-forense">
                <span>ARCHIVO DE ENIGMAS // ${nivel}-X</span>
                <strong>HIPÓTESIS EN ANÁLISIS</strong>
                <small>CLASIFICACIÓN // RESTRINGIDA</small>
            </div>
        `,
        memoria: `
            <div class="escena-prueba escena-transpondedor">
                <span>SIGNAL // CAPTURANDO</span>
                <div class="barra-captura"><i></i></div>
                <small>FRECUENCIA MILITAR // ENLACE INESTABLE</small>
            </div>
        `,
        secuencia: `
            <div class="escena-prueba escena-consola">
                <span>SECUENCIADOR // MODO LECTURA</span>
                <div class="luces-consola"><i></i><i></i><i></i><i></i></div>
                <small id="estado-secuencia">OUTPUT // BLOQUEADO</small>
            </div>
        `,
        hack: `
            <div class="escena-prueba escena-circuito">
                <span>NETWORK_GRID // ENTRADA ABIERTA</span>
                <div class="rutas-circuito"><i></i><i></i><i></i></div>
                <small id="estado-hack">ENLACE // BUSCANDO NODOS 7X</small>
            </div>
        `,
        interrogatorio: `
            <div class="escena-prueba escena-comunicacion">
                <div class="avatar-informante"><i></i></div>
                <div><span>CANAL PRIVADO // INFORMANTE-09</span><small>CONEXIÓN // CIFRADA</small></div>
                <b>ESTRÉS // 62%</b>
            </div>
        `,
        pulso: `
            <div class="escena-prueba escena-osciloscopio">
                <span>FREQUENCY_TRACKER // SEARCHING</span>
                <small id="estado-pulso">LOCK // PENDIENTE</small>
            </div>
        `,
        cartas: `
            <div class="escena-prueba escena-cartas-codigo">
                <span>CASA DE FRONTERA // MESA 21</span>
                <small>PROTOCOLO // SUPERAR SIN EXCEDER</small>
            </div>
        `,
        ajedrez: `
            <div class="escena-prueba escena-ajedrez-codigo">
                <span>HOLO-TACTICAL // POSICIÓN CRÍTICA</span>
                <small>OBJETIVO // FORZAR VENTAJA</small>
            </div>
        `
    };

    return contextos[tipo] || contextos.logica;
}


/* =========================================================
   RESULTADOS
   ========================================================= */

function resolverPrueba(exito, datos = {}) {
    if (!MOTOR_MINIJUEGOS.activo) return;

    MOTOR_MINIJUEGOS.activo = false;

    limpiarTemporizadorMinijuego();

    const resolver = MOTOR_MINIJUEGOS.resolver;

    const resultado = {
        exito,
        tipo: MOTOR_MINIJUEGOS.tipo,
        dificultad: MOTOR_MINIJUEGOS.dificultad,
        ...datos
    };

    const ui = obtenerZonaMinijuego();

    bloquearControlesMinijuego();

    ui.contenido.insertAdjacentHTML(
        "beforeend",
        renderizarEstadoResultado(exito)
    );

    ui.mensaje.textContent = exito
        ? "PRUEBA SUPERADA // INTELIGENCIA RECUPERADA"
        : "PRUEBA FALLIDA // VENTANA OPERATIVA PERDIDA";

    ui.mensaje.classList.add(
        exito ? "minijuego-exito" : "minijuego-fallo"
    );

    const continuar = document.getElementById(
        "continuar-minijuego"
    );

    continuar?.addEventListener("click", () => {
        if (MOTOR_MINIJUEGOS.estado.resultadoEntregado) return;

        MOTOR_MINIJUEGOS.estado.resultadoEntregado = true;
        cerrarMinijuego();

        if (resolver) {
            resolver(resultado);
        }
    });
}


function renderizarEstadoResultado(exito) {
    return `
        <section class="resultado-prueba ${exito ? "resultado-exito" : "resultado-fallo"}">
            <div class="resultado-simbolo">
                ${exito ? "✓" : "×"}
            </div>
            <div>
                <span>${exito ? "CHALLENGE COMPLETE" : "CHALLENGE FAILED"}</span>
                <h3>${exito ? "SEÑAL DE EVIDENCIA ADQUIRIDA" : "TIEMPO DE BÚSQUEDA PERDIDO"}</h3>
                <p>${exito ? "La Academia integró la lectura al expediente operativo." : "La fuente se cerró antes de completar el rastreo."}</p>
            </div>
            <button id="continuar-minijuego" class="boton-prueba boton-continuar" type="button">
                CONTINUAR A OPERACIÓN
            </button>
        </section>
    `;
}


function bloquearControlesMinijuego() {
    const contenido = document.getElementById("minijuego-contenido");

    if (!contenido) return;

    contenido
        .querySelectorAll("button, input")
        .forEach(elemento => {
            elemento.disabled = true;
        });
}


function cerrarMinijuego() {
    limpiarTemporizadorMinijuego();

    const modal = document.getElementById("modal-minijuego");

    if (modal) {
        modal.classList.remove("activo");
    }
}


function limpiarTemporizadorMinijuego() {
    if (MOTOR_MINIJUEGOS.temporizador) {
        clearInterval(MOTOR_MINIJUEGOS.temporizador);
        clearTimeout(MOTOR_MINIJUEGOS.temporizador);
        MOTOR_MINIJUEGOS.temporizador = null;
    }

    MOTOR_MINIJUEGOS.timeouts.forEach(timeout => {
        clearTimeout(timeout);
    });

    MOTOR_MINIJUEGOS.timeouts.clear();
}


function programarTimeoutMinijuego(
    callback,
    demora,
    requiereActivo = true
) {
    const sesion = MOTOR_MINIJUEGOS.sesion;

    const timeout = setTimeout(() => {
        MOTOR_MINIJUEGOS.timeouts.delete(timeout);

        if (
            MOTOR_MINIJUEGOS.sesion === sesion &&
            (!requiereActivo || MOTOR_MINIJUEGOS.activo)
        ) {
            callback();
        }
    }, demora);

    MOTOR_MINIJUEGOS.timeouts.add(timeout);

    return timeout;
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function mezclarArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}


function crearBotonRespuesta(texto, callback) {
    const boton = document.createElement("button");

    boton.className = "boton-prueba";
    boton.textContent = texto;
    boton.addEventListener("click", callback);

    return boton;
}


function renderizarCarta(valor, oculta = false, indice = 0) {
    const palos = ["♠", "♥", "♣", "♦"];
    const palo = palos[indice % palos.length];
    const roja = palo === "♥" || palo === "♦";

    if (oculta) {
        return `
            <div class="carta-espacial carta-reverso" aria-label="Carta oculta">
                <i></i><i></i><i></i>
            </div>
        `;
    }

    return `
        <div class="carta-espacial ${roja ? "carta-roja" : "carta-negra"}">
            <span class="carta-esquina">${valor}<b>${palo}</b></span>
            <strong>${palo}</strong>
            <span class="carta-esquina carta-esquina-inferior">${valor}<b>${palo}</b></span>
        </div>
    `;
}


function mostrarMensajePrueba(texto, tipo = "") {
    const mensaje = document.getElementById("minijuego-mensaje");

    mensaje.textContent = texto;
    mensaje.className = "minijuego-mensaje";

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}


/* =========================================================
   MATEMÁTICA
   ========================================================= */

function iniciarMatematica(dificultad) {
    const ui = prepararPantalla(
        "CÁLCULO DE CAMPO",
        "RESOLVÉ EL CÁLCULO PARA ACCEDER AL REGISTRO.",
        dificultad
    );

    let a;
    let b;
    let correcta;
    let pregunta;

    if (dificultad <= 2) {
        a = numeroAleatorio(8, 30);
        b = numeroAleatorio(4, 20);

        correcta = a + b;
        pregunta = `${a} + ${b}`;
    }

    else if (dificultad <= 4) {
        a = numeroAleatorio(4, 12);
        b = numeroAleatorio(3, 9);

        correcta = a * b;
        pregunta = `${a} × ${b}`;
    }

    else {
        const saltos = numeroAleatorio(3, 7);
        const horas = numeroAleatorio(2, 6);
        const demora = numeroAleatorio(1, 5);

        correcta = saltos * horas + demora;

        pregunta =
            `${saltos} saltos consumen ${horas} horas cada uno. ` +
            `Una reparación agrega ${demora} horas. ` +
            `¿TIEMPO TOTAL?`;
    }

    const preguntaEl = document.createElement("div");
    preguntaEl.className = "pregunta-prueba";
    preguntaEl.textContent = pregunta;

    ui.contenido.appendChild(preguntaEl);

    const respuestas = new Set([correcta]);

    while (respuestas.size < 4) {
        const desviacion = numeroAleatorio(-8, 8);

        if (desviacion !== 0 && correcta + desviacion > 0) {
            respuestas.add(correcta + desviacion);
        }
    }

    const contenedor = document.createElement("div");
    contenedor.className = "grid-respuestas";

    mezclarArray([...respuestas]).forEach(respuesta => {
        contenedor.appendChild(
            crearBotonRespuesta(
                respuesta,
                () => resolverPrueba(respuesta === correcta)
            )
        );
    });

    ui.contenido.appendChild(contenedor);
}


/* =========================================================
   LÓGICA
   ========================================================= */

function iniciarLogica(dificultad) {
    const ui = prepararPantalla(
        "ANÁLISIS LÓGICO",
        "AISLÁ EL PATRÓN CORRECTO.",
        dificultad
    );

    const pruebas = [
        {
            pregunta: "2 // 4 // 8 // 16 // ?",
            respuestas: ["24", "30", "32", "36"],
            correcta: "32"
        },
        {
            pregunta: "3 // 6 // 11 // 18 // ?",
            respuestas: ["25", "27", "29", "31"],
            correcta: "27"
        },
        {
            pregunta: "1 // 1 // 2 // 3 // 5 // ?",
            respuestas: ["7", "8", "9", "10"],
            correcta: "8"
        },
        {
            pregunta:
                "ALFA VIAJÓ ANTES QUE BETA. GAMMA VIAJÓ DESPUÉS DE BETA. ¿ORDEN?",
            respuestas: [
                "ALFA // BETA // GAMMA",
                "BETA // ALFA // GAMMA",
                "GAMMA // BETA // ALFA",
                "ALFA // GAMMA // BETA"
            ],
            correcta: "ALFA // BETA // GAMMA"
        },
        {
            pregunta:
                "UNA BALIZA EMITE CADA 4 MINUTOS. OTRA CADA 6. ¿CUÁNDO COINCIDEN?",
            respuestas: [
                "8 MIN",
                "10 MIN",
                "12 MIN",
                "24 MIN"
            ],
            correcta: "12 MIN"
        }
    ];

    const prueba = pruebas[
        numeroAleatorio(0, pruebas.length - 1)
    ];

    const pregunta = document.createElement("div");
    pregunta.className = "pregunta-prueba";
    pregunta.textContent = prueba.pregunta;

    ui.contenido.appendChild(pregunta);

    const grid = document.createElement("div");
    grid.className = "grid-respuestas";

    mezclarArray(prueba.respuestas).forEach(respuesta => {
        grid.appendChild(
            crearBotonRespuesta(
                respuesta,
                () => resolverPrueba(
                    respuesta === prueba.correcta
                )
            )
        );
    });

    ui.contenido.appendChild(grid);
}


/* =========================================================
   ACERTIJOS
   ========================================================= */

function iniciarAcertijo(dificultad) {
    const ui = prepararPantalla(
        "PROTOCOLO DE DEDUCCIÓN",
        "EL ARCHIVO EXIGE UNA RESPUESTA.",
        dificultad
    );

    const banco = typeof ACERTIJOS !== "undefined"
        ? ACERTIJOS
        : [];

    if (!banco.length) {
        iniciarLogica(dificultad);
        return;
    }

    const acertijo = banco[
        numeroAleatorio(0, banco.length - 1)
    ];

    const pregunta = document.createElement("div");
    pregunta.className = "pregunta-prueba";
    pregunta.textContent = acertijo.pregunta;

    ui.contenido.appendChild(pregunta);

    const respuestas = acertijo.respuestas.map(
        (texto, indice) => ({
            texto,
            correcta: indice === acertijo.correcta
        })
    );

    const grid = document.createElement("div");
    grid.className = "grid-respuestas";

    mezclarArray(respuestas).forEach(respuesta => {
        grid.appendChild(
            crearBotonRespuesta(
                respuesta.texto,
                () => resolverPrueba(respuesta.correcta)
            )
        );
    });

    ui.contenido.appendChild(grid);
}


/* =========================================================
   MEMORIA
   ========================================================= */

function iniciarMemoria(dificultad) {
    const ui = prepararPantalla(
        "RECONSTRUCCIÓN DE MEMORIA",
        "MEMORIZÁ LA SECUENCIA DE SÍMBOLOS.",
        dificultad
    );

    const simbolos = [
        "△",
        "○",
        "□",
        "◇",
        "✦",
        "⬡",
        "Ψ",
        "Ω"
    ];

    const cantidad = Math.min(3 + dificultad, 7);

    const secuencia = [];

    for (let i = 0; i < cantidad; i++) {
        secuencia.push(
            simbolos[numeroAleatorio(0, simbolos.length - 1)]
        );
    }

    const visor = document.createElement("div");
    visor.className = "visor-memoria";
    visor.textContent = secuencia.join("  ");

    const carcasa = document.createElement("div");
    carcasa.className = "carcasa-transpondedor";
    carcasa.innerHTML = `
        <span>TRANSPONDER // SIGNAL LIVE</span>
        <i class="scanlines-transpondedor"></i>
    `;
    carcasa.appendChild(visor);

    ui.contenido.appendChild(carcasa);

    mostrarMensajePrueba(
        "REGISTRANDO PATRÓN // NO APARTES LA VISTA"
    );

    const tiempoVisualizacion = Math.max(
        1600,
        3400 - dificultad * 250
    );

    programarTimeoutMinijuego(() => {
        visor.textContent = "■  ■  ■  ■";
        carcasa.classList.add("senal-perdida");
        carcasa.querySelector("span").textContent =
            "TRANSPONDER // SIGNAL LOST";

        mostrarMensajePrueba(
            "SELECCIONÁ LA SECUENCIA ORIGINAL"
        );

        const opciones = [secuencia.join(" ")];

        while (opciones.length < 4) {
            const falsa = [...secuencia];

            const indiceA = numeroAleatorio(0, falsa.length - 1);
            const indiceB = numeroAleatorio(0, falsa.length - 1);

            [
                falsa[indiceA],
                falsa[indiceB]
            ] = [
                falsa[indiceB],
                falsa[indiceA]
            ];

            const texto = falsa.join(" ");

            if (!opciones.includes(texto)) {
                opciones.push(texto);
            }
        }

        const grid = document.createElement("div");
        grid.className = "grid-respuestas";

        mezclarArray(opciones).forEach(opcion => {
            grid.appendChild(
                crearBotonRespuesta(
                    opcion,
                    () => resolverPrueba(
                        opcion === secuencia.join(" ")
                    )
                )
            );
        });

        ui.contenido.appendChild(grid);

    }, tiempoVisualizacion);
}


/* =========================================================
   SECUENCIA
   ========================================================= */

function iniciarSecuencia(dificultad) {
    const ui = prepararPantalla(
        "SINCRONIZACIÓN DE BALIZA",
        "REPETÍ LA SECUENCIA DE PULSOS.",
        dificultad
    );

    const cantidadBotones = 4;

    const longitud = Math.min(3 + dificultad, 8);

    const secuencia = Array.from(
        { length: longitud },
        () => numeroAleatorio(0, cantidadBotones - 1)
    );

    let entrada = [];

    const panel = document.createElement("div");
    panel.className = "panel-secuencia";

    const botones = [];

    for (let i = 0; i < cantidadBotones; i++) {
        const boton = document.createElement("button");

        boton.className = "boton-secuencia";
        boton.textContent = String(i + 1);
        boton.disabled = true;

        boton.addEventListener("click", () => {
            entrada.push(i);

            boton.classList.add("activo");

            const estadoSecuencia = document.getElementById(
                "estado-secuencia"
            );

            if (estadoSecuencia) {
                estadoSecuencia.textContent =
                    `INPUT // ${entrada.length}/${secuencia.length}`;
            }

            programarTimeoutMinijuego(() => {
                boton.classList.remove("activo");
            }, 180);

            const posicion = entrada.length - 1;

            if (
                entrada[posicion] !== secuencia[posicion]
            ) {
                resolverPrueba(false);
                return;
            }

            if (entrada.length === secuencia.length) {
                resolverPrueba(true);
            }
        });

        botones.push(boton);
        panel.appendChild(boton);
    }

    ui.contenido.appendChild(panel);

    let indice = 0;

    const reproducir = () => {
        if (indice >= secuencia.length) {
            botones.forEach(boton => {
                boton.disabled = false;
            });

            mostrarMensajePrueba(
                "TU TURNO // REPETÍ LA FIRMA"
            );

            const estadoSecuencia = document.getElementById(
                "estado-secuencia"
            );

            if (estadoSecuencia) {
                estadoSecuencia.textContent =
                    "INPUT // ESPERANDO OPERADOR";
            }

            return;
        }

        const boton = botones[secuencia[indice]];

        boton.classList.add("activo");

        programarTimeoutMinijuego(() => {
            boton.classList.remove("activo");

            indice++;

            programarTimeoutMinijuego(reproducir, 280);
        }, 420);
    };

    mostrarMensajePrueba(
        "LEYENDO FIRMA DE BALIZA..."
    );

    programarTimeoutMinijuego(reproducir, 700);
}


/* =========================================================
   HACK
   ========================================================= */

function iniciarHack(dificultad) {
    const ui = prepararPantalla(
        "INTRUSIÓN DE SISTEMA",
        "LOCALIZÁ LOS NODOS VÁLIDOS ANTES DEL BLOQUEO.",
        dificultad
    );

    const total = Math.min(12 + dificultad * 2, 22);
    const objetivos = Math.min(3 + Math.floor(dificultad / 2), 5);

    const indicesObjetivo = mezclarArray(
        Array.from({ length: total }, (_, i) => i)
    ).slice(0, objetivos);

    let encontrados = 0;
    let errores = 0;

    const maxErrores = dificultad >= 5 ? 1 : 2;

    const panel = document.createElement("div");
    panel.className = "grid-hack";

    for (let i = 0; i < total; i++) {
        const boton = document.createElement("button");

        const esObjetivo = indicesObjetivo.includes(i);

        boton.className = "nodo-hack";

        boton.textContent = generarCodigoNodo();

        boton.addEventListener("click", () => {
            if (boton.disabled) return;

            boton.disabled = true;

            if (esObjetivo) {
                encontrados++;

                boton.classList.add("nodo-correcto");

                mostrarMensajePrueba(
                    `NODO ${encontrados}/${objetivos} AISLADO`
                );

                const estadoHack = document.getElementById("estado-hack");

                if (estadoHack) {
                    estadoHack.textContent =
                        `ENLACE // ${encontrados}/${objetivos} NODOS ACTIVOS`;
                }

                if (encontrados >= objetivos) {
                    resolverPrueba(true);
                }
            }

            else {
                errores++;

                boton.classList.add("nodo-error");

                mostrarMensajePrueba(
                    `FALLO DE SONDA // ${errores}/${maxErrores}`,
                    "minijuego-fallo"
                );

                const estadoHack = document.getElementById("estado-hack");

                if (estadoHack) {
                    estadoHack.textContent = "ENLACE // INTERFERENCIA DETECTADA";
                }

                if (errores >= maxErrores) {
                    resolverPrueba(false);
                }
            }
        });

        panel.appendChild(boton);
    }

    ui.contenido.appendChild(panel);

    mostrarMensajePrueba(
        "BUSCÁ NODOS CON PREFIJO 7X"
    );

    indicesObjetivo.forEach(indice => {
        panel.children[indice].textContent =
            `7X-${numeroAleatorio(10, 99)}`;
    });
}


function generarCodigoNodo() {
    const prefijos = [
        "AX",
        "K4",
        "M9",
        "Q2",
        "V8",
        "RX"
    ];

    return `${prefijos[numeroAleatorio(
        0,
        prefijos.length - 1
    )]}-${numeroAleatorio(10, 99)}`;
}


/* =========================================================
   INTERROGATORIO
   ========================================================= */

function iniciarInterrogatorio(dificultad) {
    const ui = prepararPantalla(
        "INTERROGATORIO DE CAMPO",
        "LEÉ AL INFORMANTE. ELEGÍ EL TONO CORRECTO.",
        dificultad
    );

    const perfiles = [
        {
            texto:
                "\"NO SÉ NADA. Y AUNQUE SUPIERA, NO HABLARÍA CON STARHOUND.\"",
            correcta: "presionar",
            opciones: {
                presionar: "MOSTRARLE QUE YA SABÉS PARTE DE LA VERDAD",
                pagar: "OFRECER CRÉDITOS",
                amable: "INTENTAR GANARSE SU CONFIANZA"
            }
        },
        {
            texto:
                "\"MIRÁ... YO TENGO FAMILIA. NO QUIERO PROBLEMAS.\"",
            correcta: "amable",
            opciones: {
                presionar: "AMENAZAR CON DETENERLO",
                pagar: "COMPRAR SU SILENCIO",
                amable: "GARANTIZAR PROTECCIÓN"
            }
        },
        {
            texto:
                "\"INFORMACIÓN CUESTA. TODO CUESTA EN ESTA LUNA.\"",
            correcta: "pagar",
            opciones: {
                presionar: "INTIMIDARLO",
                pagar: "NEGOCIAR UN PRECIO",
                amable: "APELAR A SU CONCIENCIA"
            }
        },
        {
            texto:
                "\"USTEDES LOS CAZADORES SIEMPRE LLEGAN TARDE.\"",
            correcta: "presionar",
            opciones: {
                presionar: "MENCIONAR UN DETALLE DEL CASO",
                pagar: "OFRECER RECOMPENSA",
                amable: "REÍRSE DEL COMENTARIO"
            }
        },
        {
            texto:
                "\"NO QUIERO CRÉDITOS. QUIERO SABER QUE ESE MONSTRUO CAERÁ.\"",
            correcta: "amable",
            opciones: {
                presionar: "EXIGIR RESPUESTAS",
                pagar: "DUPLICAR LA OFERTA",
                amable: "PROMETER LLEVARLO ANTE LA JUSTICIA"
            }
        }
    ];

    const perfil = perfiles[
        numeroAleatorio(0, perfiles.length - 1)
    ];

    const dialogo = document.createElement("div");
    dialogo.className = "dialogo-informante";
    dialogo.textContent = perfil.texto;

    ui.contenido.appendChild(dialogo);

    const grid = document.createElement("div");
    grid.className = "grid-respuestas";

    Object.entries(perfil.opciones).forEach(
        ([clave, texto]) => {
            grid.appendChild(
                crearBotonRespuesta(
                    texto,
                    () => resolverPrueba(
                        clave === perfil.correcta
                    )
                )
            );
        }
    );

    ui.contenido.appendChild(grid);
}


/* =========================================================
   CARTAS
   ========================================================= */

function iniciarCartas(dificultad) {
    const ui = prepararPantalla(
        "MESA DEL VACÍO",
        "SUPERÁ LA MANO DEL INFORMANTE SIN PASAR DE 21.",
        dificultad
    );

    let jugador = [
        numeroAleatorio(2, 10),
        numeroAleatorio(2, 10)
    ];

    const objetivo = numeroAleatorio(
        dificultad >= 4 ? 17 : 15,
        20
    );

    const panel = document.createElement("section");
    panel.className = "mesa-cartas";

    const objetivoPanel = document.createElement("aside");
    objetivoPanel.className = "objetivo-cartas";
    objetivoPanel.innerHTML = `
        <span>OBJETIVO DE MESA</span>
        <strong>ALCANZÁ ${objetivo}</strong>
        <small>SIN SUPERAR 21</small>
    `;

    const dealer = document.createElement("div");
    dealer.className = "zona-cartas zona-dealer";

    const manoDealer = document.createElement("div");
    manoDealer.className = "mano-cartas";

    const estadoDealer = document.createElement("span");
    estadoDealer.className = "estado-dealer";
    estadoDealer.textContent = "DEALER // CASA DE FRONTERA";

    dealer.append(estadoDealer, manoDealer);

    const separador = document.createElement("div");
    separador.className = "separador-mesa";
    separador.textContent = "MESA // 21";

    const jugadorZona = document.createElement("div");
    jugadorZona.className = "zona-cartas zona-jugador";

    const mano = document.createElement("div");
    mano.className = "mano-cartas";

    const estado = document.createElement("div");
    estado.className = "estado-cartas";

    const controles = document.createElement("div");
    controles.className = "grid-respuestas";

    let rondaResuelta = false;

    const resolverRonda = exito => {
        if (rondaResuelta) return;

        rondaResuelta = true;
        bloquearControlesMinijuego();
        resolverPrueba(exito);
    };

    const render = () => {
        const total = jugador.reduce(
            (suma, carta) => suma + carta,
            0
        );

        manoDealer.innerHTML =
            renderizarCarta(objetivo, false, 0) +
            renderizarCarta("?", true, 1);

        mano.innerHTML = jugador
            .map((carta, indice) => renderizarCarta(carta, false, indice + 2))
            .join("");

        estado.textContent =
            `CAZADOR // VALOR DE MANO ${total}`;

        if (total > 21) {
            resolverRonda(false);
        }
    };

    const pedir = crearBotonRespuesta(
        "PEDIR CARTA",
        () => {
            if (rondaResuelta) return;

            jugador.push(numeroAleatorio(2, 10));
            render();
        }
    );

    const plantar = crearBotonRespuesta(
        "MANTENER MANO",
        () => {
            if (rondaResuelta) return;

            const total = jugador.reduce(
                (suma, carta) => suma + carta,
                0
            );

            resolverRonda(
                total <= 21 && total >= objetivo
            );
        }
    );

    controles.appendChild(pedir);
    controles.appendChild(plantar);

    jugadorZona.append(mano, estado, controles);
    panel.append(objetivoPanel, dealer, separador, jugadorZona);

    ui.contenido.appendChild(panel);

    render();
}


/* =========================================================
   PULSO
   ========================================================= */

function iniciarPulso(dificultad) {
    const ui = prepararPantalla(
        "VENTANA DE INTERCEPCIÓN",
        "DETENÉ EL PULSO DENTRO DE LA ZONA DE CAPTURA.",
        dificultad
    );

    const pista = document.createElement("div");
    pista.className = "pista-pulso";

    const zona = document.createElement("div");
    zona.className = "zona-pulso";

    const cursor = document.createElement("div");
    cursor.className = "cursor-pulso";

    const anchoZona = Math.max(
        12,
        34 - dificultad * 4
    );

    const inicioZona = numeroAleatorio(
        18,
        78 - anchoZona
    );

    zona.style.left = `${inicioZona}%`;
    zona.style.width = `${anchoZona}%`;

    pista.appendChild(zona);
    pista.appendChild(cursor);

    const boton = crearBotonRespuesta(
        "FIJAR PULSO",
        () => {
            const posicion = MOTOR_MINIJUEGOS.estado.posicion;

            const exito =
                posicion >= inicioZona &&
                posicion <= inicioZona + anchoZona;

            const estadoPulso = document.getElementById("estado-pulso");

            if (estadoPulso) {
                estadoPulso.textContent = exito
                    ? "LOCK // SEÑAL FIJADA"
                    : "LOCK // SIGNAL LOST";
            }

            resolverPrueba(exito);
        }
    );

    ui.contenido.appendChild(pista);
    ui.contenido.appendChild(boton);

    let posicion = 0;
    let direccion = 1;

    const velocidad = 1 + dificultad * 0.18;

    MOTOR_MINIJUEGOS.estado.posicion = posicion;

    MOTOR_MINIJUEGOS.temporizador = setInterval(() => {
        posicion += direccion * velocidad;

        if (posicion >= 100) {
            posicion = 100;
            direccion = -1;
        }

        if (posicion <= 0) {
            posicion = 0;
            direccion = 1;
        }

        MOTOR_MINIJUEGOS.estado.posicion = posicion;

        cursor.style.left = `${posicion}%`;

    }, 16);
}


/* =========================================================
   CAPTURA: AJEDREZ TÁCTICO
   ========================================================= */

function iniciarAjedrezCaptura(callback) {
    cerrarMinijuego();

    MOTOR_MINIJUEGOS.activo = true;
    MOTOR_MINIJUEGOS.tipo = "ajedrez";
    MOTOR_MINIJUEGOS.dificultad = 5;
    MOTOR_MINIJUEGOS.sesion++;
    MOTOR_MINIJUEGOS.estado = {};
    MOTOR_MINIJUEGOS.resolver = resultado => {
        if (callback) {
            callback(resultado.exito);
        }
    };

    crearInterfazMinijuego();

    const ui = prepararPantalla(
        "DUELO TÁCTICO",
        "EL OBJETIVO ANTICIPA TUS MOVIMIENTOS. ENCONTRÁ LA JUGADA.",
        5
    );

    const posiciones = [
        {
            pregunta:
                "EL REY ENEMIGO ESTÁ AISLADO. TU TORRE CONTROLA LA FILA. ¿PRIORIDAD?",
            respuestas: [
                "CAMBIAR DAMAS",
                "DAR JAQUE",
                "MOVER UN PEÓN",
                "RETROCEDER LA TORRE"
            ],
            correcta: "DAR JAQUE"
        },
        {
            pregunta:
                "TU RIVAL AMENAZA MATE EN UNA JUGADA. ¿QUÉ HACÉS?",
            respuestas: [
                "ATACAR SU TORRE",
                "IGNORAR LA AMENAZA",
                "DETENER EL MATE",
                "SACRIFICAR LA DAMA SIN MOTIVO"
            ],
            correcta: "DETENER EL MATE"
        },
        {
            pregunta:
                "UN CABALLO ATACA DOS PIEZAS IMPORTANTES AL MISMO TIEMPO. ESO ES...",
            respuestas: [
                "ENROQUE",
                "HORQUILLA",
                "CLAVADA",
                "TABLAS"
            ],
            correcta: "HORQUILLA"
        }
    ];

    const posicion = posiciones[
        numeroAleatorio(0, posiciones.length - 1)
    ];

    const pregunta = document.createElement("div");
    pregunta.className = "pregunta-prueba";
    pregunta.textContent = posicion.pregunta;

    ui.contenido.insertAdjacentHTML(
        "beforeend",
        renderizarTableroTactico()
    );

    ui.contenido.appendChild(pregunta);

    const grid = document.createElement("div");
    grid.className = "grid-respuestas";

    mezclarArray(posicion.respuestas).forEach(respuesta => {
        grid.appendChild(
            crearBotonRespuesta(
                respuesta,
                () => {
                    resolverPrueba(
                        respuesta === posicion.correcta
                    );
                }
            )
        );
    });

    ui.contenido.appendChild(grid);
}


/* =========================================================
   ROUTER DE CAPTURA
   ========================================================= */

function iniciarCapturaSospechoso(sospechoso, callback) {
    if (!sospechoso) {
        if (callback) callback(false);
        return;
    }

    if (sospechoso.minijuego === "ajedrez") {
        iniciarAjedrezCaptura(callback);
        return;
    }

    iniciarPruebaInvestigacion(
        sospechoso.minijuego || "pulso",
        Math.max(3, sospechoso.peligrosidad || 3)
    ).then(resultado => {
        if (callback) {
            callback(resultado.exito);
        }
    });
}


function renderizarTableroTactico() {
    const piezas = [
        "♜", "", "", "", "♚", "", "", "♜",
        "♟", "♟", "♟", "", "", "♟", "♟", "♟",
        "", "", "♞", "", "", "", "", "",
        "", "", "", "♗", "", "", "", "",
        "", "", "", "", "♕", "", "", "",
        "", "", "", "", "", "♘", "", "",
        "♙", "♙", "♙", "", "", "♙", "♙", "♙",
        "♖", "", "", "", "♔", "", "", "♖"
    ];

    return `
        <div class="tablero-tactico" aria-label="Tablero táctico holográfico">
            ${piezas.map((pieza, indice) => `
                <span class="casilla-tactica ${
                    (Math.floor(indice / 8) + indice) % 2
                        ? "casilla-oscura"
                        : "casilla-clara"
                } ${indice === 27 ? "casilla-origen" : ""} ${
                    [19, 35, 43].includes(indice)
                        ? "casilla-destino"
                        : ""
                } ${indice === 4 ? "casilla-objetivo" : ""}">
                    ${pieza}
                </span>
            `).join("")}
        </div>
    `;
}
