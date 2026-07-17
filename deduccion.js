/* =========================================================
   STARHOUND
   MOTOR DE DEDUCCIÓN
   ========================================================= */

const ESTADOS_DEDUCCION = {
    NEUTRO: "neutro",
    SOSPECHA: "sospecha",
    DESCARTADO: "descartado",
    PRIORIDAD: "prioridad"
};


class MotorDeduccion {

    constructor() {

        this.hipotesis = {};

        this.pistas = [];

        this.historial = [];

    }


    /* =====================================================
       INICIALIZACIÓN
       ===================================================== */

    iniciar(sospechosos = []) {

        this.hipotesis = {};

        sospechosos.forEach(sospechoso => {

            this.hipotesis[sospechoso.id] = {

                estado:
                    ESTADOS_DEDUCCION.NEUTRO,

                notas: [],

                coincidencias: 0,

                contradicciones: 0

            };

        });

        this.pistas = [];

        this.historial = [];

    }


    /* =====================================================
       PISTAS
       ===================================================== */

    registrarPista(pista) {

        if (!pista) {
            return;
        }

        const existe =
            this.pistas.some(
                item => item.id === pista.id
            );

        if (existe) {
            return;
        }

        const pistaProcesada = {

            id:
                pista.id ||
                `PISTA_${Date.now()}`,

            texto:
                pista.texto ||
                "Información no clasificada.",

            categoria:
                pista.categoria ||
                "general",

            atributo:
                pista.atributo ||
                null,

            valor:
                pista.valor ??
                null,

            fiabilidad:
                pista.fiabilidad ??
                1,

            tipo:
                pista.tipo ||
                "verdadera",

            descubierta:
                new Date().toISOString()

        };

        this.pistas.push(
            pistaProcesada
        );

        this.historial.push({

            tipo: "PISTA",

            texto:
                pistaProcesada.texto,

            fecha:
                Date.now()

        });

        this.analizarPista(
            pistaProcesada
        );

    }


    /* =====================================================
       ANÁLISIS AUTOMÁTICO
       ===================================================== */

    analizarPista(pista) {

        if (
            !pista.atributo ||
            pista.valor === null
        ) {
            return;
        }

        const sospechosos =
            this.obtenerSospechosos();

        sospechosos.forEach(
            sospechoso => {

                const registro =
                    this.hipotesis[
                        sospechoso.id
                    ];

                if (!registro) {
                    return;
                }

                const valorSospechoso =
                    sospechoso[
                        pista.atributo
                    ];

                if (
                    valorSospechoso === undefined
                ) {
                    return;
                }

                if (
                    this.compararValores(
                        valorSospechoso,
                        pista.valor
                    )
                ) {

                    registro.coincidencias++;

                } else {

                    registro.contradicciones++;

                }

            }
        );

    }


    compararValores(a, b) {

        if (
            Array.isArray(a)
        ) {

            return a.includes(b);

        }

        if (
            Array.isArray(b)
        ) {

            return b.includes(a);

        }

        return (
            String(a).toLowerCase()
            ===
            String(b).toLowerCase()
        );

    }


    /* =====================================================
       ESTADO MANUAL
       ===================================================== */

    cambiarEstado(
        sospechosoId
    ) {

        const registro =
            this.hipotesis[
                sospechosoId
            ];

        if (!registro) {
            return;
        }

        const orden = [

            ESTADOS_DEDUCCION.NEUTRO,

            ESTADOS_DEDUCCION.SOSPECHA,

            ESTADOS_DEDUCCION.PRIORIDAD,

            ESTADOS_DEDUCCION.DESCARTADO

        ];

        const indice =
            orden.indexOf(
                registro.estado
            );

        registro.estado =
            orden[
                (indice + 1)
                %
                orden.length
            ];

        this.historial.push({

            tipo:
                "CAMBIO_ESTADO",

            sospechosoId,

            estado:
                registro.estado,

            fecha:
                Date.now()

        });

        this.renderizar();

    }


    /* =====================================================
       NOTAS
       ===================================================== */

    agregarNota(
        sospechosoId,
        texto
    ) {

        const registro =
            this.hipotesis[
                sospechosoId
            ];

        if (
            !registro ||
            !texto.trim()
        ) {
            return;
        }

        registro.notas.push(
            texto.trim()
        );

        this.historial.push({

            tipo:
                "NOTA",

            sospechosoId,

            texto:
                texto.trim(),

            fecha:
                Date.now()

        });

        this.renderizar();

    }


    eliminarNota(
        sospechosoId,
        indice
    ) {

        const registro =
            this.hipotesis[
                sospechosoId
            ];

        if (!registro) {
            return;
        }

        registro.notas.splice(
            indice,
            1
        );

        this.renderizar();

    }


    /* =====================================================
       DATOS
       ===================================================== */

    obtenerSospechosos() {

        if (
            typeof THIEVES !==
            "undefined"
        ) {

            return THIEVES;

        }

        if (
            typeof sospechosos !==
            "undefined"
        ) {

            return sospechosos;

        }

        if (
            typeof SOSPECHOSOS !==
            "undefined"
        ) {

            return SOSPECHOSOS;

        }

        return [];

    }


    obtenerRegistro(
        sospechosoId
    ) {

        return (
            this.hipotesis[
                sospechosoId
            ]
            ||
            null
        );

    }


    calcularAfinidad(
        sospechosoId
    ) {

        const registro =
            this.obtenerRegistro(
                sospechosoId
            );

        if (!registro) {
            return 0;
        }

        const total =
            registro.coincidencias
            +
            registro.contradicciones;

        if (total === 0) {
            return 0;
        }

        return Math.round(

            (
                registro.coincidencias
                /
                total
            )
            *
            100

        );

    }


    /* =====================================================
       INTERFAZ
       ===================================================== */

    abrir() {

        this.renderizar();

    }


    cerrar() {
        if (
            typeof renderCaso ===
            "function"
        ) {

            renderCaso();

            return;

        }

    }


    renderizar() {

        const pantalla =
            document.querySelector(
                ".pantalla-starhound"
            );

        if (!pantalla) {
            return;
        }

        const sospechosos =
            this.obtenerSospechosos();

        pantalla.innerHTML = `

            <section class="tablero-deduccion">

                <div class="cabecera-submenu">

                    <div>

                        <span class="etiqueta-terminal">
                            STARHOUND_DEDUCTION_MATRIX
                        </span>

                        <h2>
                            TABLERO DE DEDUCCIÓN
                        </h2>

                        <p>
                            Cruzá pistas.
                            Marcá sospechosos.
                            Construí tu propia hipótesis.
                        </p>

                    </div>

                    <button
                        class="boton-volver"
                        onclick="motorDeduccion.cerrar()"
                    >
                        ← VOLVER A OPERACIÓN
                    </button>

                </div>


                <div class="resumen-deduccion">

                    <div>

                        <span>
                            PISTAS REGISTRADAS
                        </span>

                        <strong>
                            ${this.pistas.length}
                        </strong>

                    </div>

                    <div>

                        <span>
                            OBJETIVOS ANALIZADOS
                        </span>

                        <strong>
                            ${sospechosos.length}
                        </strong>

                    </div>

                    <div>

                        <span>
                            PRIORIDAD
                        </span>

                        <strong>
                            ${
                                Object.values(
                                    this.hipotesis
                                )
                                .filter(
                                    registro =>
                                        registro.estado
                                        ===
                                        ESTADOS_DEDUCCION
                                            .PRIORIDAD
                                )
                                .length
                            }
                        </strong>

                    </div>

                </div>


                <div class="grid-deduccion">

                    ${
                        sospechosos
                        .map(
                            sospechoso =>
                                this.crearTarjeta(
                                    sospechoso
                                )
                        )
                        .join("")
                    }

                </div>


                <div class="panel-pistas-deduccion">

                    <span class="etiqueta-terminal">
                        EVIDENCE_STREAM
                    </span>

                    <h3>
                        REGISTRO DE EVIDENCIAS
                    </h3>

                    ${this.renderizarPistas()}

                </div>

            </section>

        `;

    }


    crearTarjeta(
        sospechoso
    ) {

        const registro =
            this.hipotesis[
                sospechoso.id
            ]
            ||
            {

                estado:
                    ESTADOS_DEDUCCION.NEUTRO,

                notas: [],

                coincidencias: 0,

                contradicciones: 0

            };

        const afinidad =
            this.calcularAfinidad(
                sospechoso.id
            );

        return `

            <article
                class="
                    tarjeta-deduccion
                    estado-${registro.estado}
                "
            >

                <div class="deduccion-codigo">

                    ${
                        sospechoso.codigo
                        ||
                        sospechoso.id
                    }

                </div>


                <h3>

                    ${
                        sospechoso.nombre
                        ||
                        sospechoso.name
                        ||
                        "OBJETIVO SIN IDENTIFICAR"
                    }

                </h3>


                <div class="estado-hipotesis">

                    ESTADO //

                    <strong>

                        ${
                            registro.estado
                            .toUpperCase()
                        }

                    </strong>

                </div>


                <button
                    class="boton-estado-deduccion"
                    onclick="
                        motorDeduccion
                        .cambiarEstado(
                            '${sospechoso.id}'
                        )
                    "
                >

                    CAMBIAR MARCA

                </button>


                <div class="metricas-deduccion">

                    <div>

                        <span>
                            COINCIDENCIAS
                        </span>

                        <strong>
                            ${registro.coincidencias}
                        </strong>

                    </div>

                    <div>

                        <span>
                            CONTRADICCIONES
                        </span>

                        <strong>
                            ${registro.contradicciones}
                        </strong>

                    </div>

                </div>


                <div class="afinidad-deduccion">

                    <span>
                        AFINIDAD DE EVIDENCIA
                    </span>

                    <div class="barra-archivo grande">

                        <div
                            style="
                                width:
                                ${afinidad}%
                            "
                        ></div>

                    </div>

                    <strong>
                        ${afinidad}%
                    </strong>

                </div>


                <div class="notas-deduccion">

                    <span>
                        NOTAS DEL CAZADOR
                    </span>

                    <div class="lista-notas">

                        ${
                            registro.notas.length
                            ?
                            registro.notas
                            .map(
                                (nota, indice) => `

                                    <div
                                        class="nota-deduccion"
                                    >

                                        <p>
                                            ${this.escaparHTML(nota)}
                                        </p>

                                        <button
                                            onclick="
                                                motorDeduccion
                                                .eliminarNota(
                                                    '${sospechoso.id}',
                                                    ${indice}
                                                )
                                            "
                                        >
                                            ×
                                        </button>

                                    </div>

                                `
                            )
                            .join("")
                            :
                            `

                                <small>
                                    SIN ANOTACIONES
                                </small>

                            `
                        }

                    </div>


                    <div class="entrada-nota">

                        <input
                            id="
                                nota-${sospechoso.id}
                            "
                            type="text"
                            maxlength="120"
                            placeholder="
                                Escribir hipótesis...
                            "
                        >

                        <button
                            onclick="
                                motorDeduccion
                                .capturarNota(
                                    '${sospechoso.id}'
                                )
                            "
                        >
                            +
                        </button>

                    </div>

                </div>

            </article>

        `;

    }


    capturarNota(
        sospechosoId
    ) {

        const input =
            document.getElementById(
                `nota-${sospechosoId}`
            );

        if (!input) {
            return;
        }

        this.agregarNota(
            sospechosoId,
            input.value
        );

    }


    renderizarPistas() {

        if (
            this.pistas.length === 0
        ) {

            return `

                <div class="linea-sistema">

                    NO HAY EVIDENCIA
                    REGISTRADA.

                    INVESTIGÁ EL SECTOR
                    PARA ALIMENTAR
                    LA MATRIZ.

                </div>

            `;

        }

        return `

            <div class="lista-pistas-deduccion">

                ${
                    this.pistas
                    .map(
                        pista => `

                            <div
                                class="
                                    pista-deduccion
                                    pista-${pista.tipo}
                                "
                            >

                                <div>

                                    <span>
                                        ${
                                            pista.categoria
                                            .toUpperCase()
                                        }
                                    </span>

                                    <p>
                                        ${
                                            this.escaparHTML(
                                                pista.texto
                                            )
                                        }
                                    </p>

                                </div>

                                <strong>

                                    ${
                                        Math.round(
                                            pista.fiabilidad
                                            *
                                            100
                                        )
                                    }%

                                </strong>

                            </div>

                        `
                    )
                    .join("")
                }

            </div>

        `;

    }


    /* =====================================================
       SEGURIDAD DE TEXTO
       ===================================================== */

    escaparHTML(texto) {

        return String(texto)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }

}


/* =========================================================
   INSTANCIA GLOBAL
   ========================================================= */

const motorDeduccion =
    new MotorDeduccion();


/* =========================================================
   PUENTE GLOBAL
   ========================================================= */

window.motorDeduccion =
    motorDeduccion;
