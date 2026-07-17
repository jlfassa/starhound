/* =========================================================
   STARHOUND
   SISTEMA DE EVIDENCIAS E INTELIGENCIA
   ========================================================= */

class SistemaEvidencias {

    constructor() {

        this.evidenciasObtenidas = [];

        this.investigacionesRealizadas = {};

        this.nivelInteligencia = 0;

        this.ultimaEvidencia = null;

        this.tipos = [
            "biologia",
            "tecnologia",
            "conducta",
            "movilidad",
            "combate",
            "origen"
        ];

    }


    /* =====================================================
       NUEVA OPERACIÓN
       ===================================================== */

    iniciarOperacion() {

        this.evidenciasObtenidas = [];

        this.investigacionesRealizadas = {};

        this.nivelInteligencia = 0;

        this.ultimaEvidencia = null;


        if (
            typeof motorDeduccion !== "undefined"
        ) {

            motorDeduccion.iniciar(
                this.obtenerSospechosos()
            );

        }

    }


    /* =====================================================
       SOSPECHOSOS
       ===================================================== */

    obtenerSospechosos() {

        if (
            typeof THIEVES !== "undefined"
        ) {

            return THIEVES;

        }

        if (
            typeof sospechosos !== "undefined"
        ) {

            return sospechosos;

        }

        if (
            typeof SOSPECHOSOS !== "undefined"
        ) {

            return SOSPECHOSOS;

        }

        return [];

    }


    obtenerObjetivoReal() {

        if (
            typeof STARHOUND !== "undefined"
            &&
            STARHOUND.sospechoso
        ) {

            return STARHOUND.sospechoso;

        }


        const lista =
            this.obtenerSospechosos();


        if (!lista.length) {

            return null;

        }


        /*
         * Fallback únicamente para impedir
         * que el sistema se rompa.
         */

        return lista[0];

    }


    /* =====================================================
       INVESTIGACIONES
       ===================================================== */

    investigar(opcion = {}) {

        const clave =
            opcion.id
            ||
            opcion.nombre
            ||
            opcion.name
            ||
            `INV_${Date.now()}`;

        if (
            typeof ejecutarInvestigacion === "function" &&
            typeof STARHOUND !== "undefined"
        ) {

            return ejecutarInvestigacion(opcion, clave);

        }


        if (
            this.investigacionesRealizadas[
                clave
            ]
        ) {

            this.mostrarMensaje(

                "ESTA FUENTE YA FUE INVESTIGADA"

            );

            return;

        }


        const horasBase =
            opcion.horas
            ||
            opcion.costoTiempo
            ||
            2;


        this.consumirTiempo(
            horasBase
        );


        const desafio =
            this.crearDesafio(
                opcion
            );


        this.lanzarDesafio(

            desafio,

            resultado => {

                this.resolverInvestigacion(

                    clave,

                    opcion,

                    resultado

                );

            }

        );

    }


    resolverInvestigacion(
        clave,
        opcion,
        resultado
    ) {

        this.investigacionesRealizadas[
            clave
        ] = true;


        if (!resultado) {

            const penalizacion =
                this.numeroAleatorio(
                    1,
                    3
                );


            this.consumirTiempo(
                penalizacion
            );


            this.mostrarMensaje(

                `RASTREO FALLIDO // ${penalizacion}H PERDIDAS`

            );


            return;

        }


        const evidencia =
            this.generarEvidencia(
                opcion
            );


        if (!evidencia) {

            this.mostrarMensaje(

                "LA FUENTE NO PRODUJO INFORMACIÓN ÚTIL"

            );

            return;

        }


        this.registrarEvidencia(
            evidencia
        );

    }


    /* =====================================================
       DESAFÍOS
       ===================================================== */

    crearDesafio(opcion) {

        const categoria =
            opcion.categoria
            ||
            opcion.tipo
            ||
            this.elementoAleatorio(
                [
                    "logica",
                    "matematicas",
                    "memoria",
                    "codigo"
                ]
            );


        if (
            categoria === "matematicas"
        ) {

            return this.crearDesafioMatematico();

        }


        if (
            categoria === "memoria"
        ) {

            return this.crearDesafioMemoria();

        }


        if (
            categoria === "codigo"
        ) {

            return this.crearDesafioCodigo();

        }


        return this.crearDesafioLogico();

    }


    crearDesafioMatematico() {

        const a =
            this.numeroAleatorio(
                4,
                14
            );

        const b =
            this.numeroAleatorio(
                2,
                9
            );

        const multiplicador =
            this.numeroAleatorio(
                2,
                4
            );

        return {

            tipo:
                "pregunta",

            titulo:
                "CÁLCULO DE TRAYECTORIA",

            texto:
                `Un carguero recorrió ${a} sectores y consumió ${b} unidades por sector. El motor auxiliar multiplicó el consumo por ${multiplicador}. ¿Cuál fue el consumo registrado?`,

            respuesta:
                String(
                    a
                    *
                    b
                    *
                    multiplicador
                )

        };

    }


    crearDesafioLogico() {

        const desafios = [

            {

                titulo:
                    "ANÁLISIS DE TESTIMONIO",

                texto:
                    "Tres testigos declaran. A dice: «B miente». B dice: «C miente». C dice: «A y B mienten». Si solo uno dice la verdad, ¿qué testigo dice la verdad?",

                respuesta:
                    "b"

            },

            {

                titulo:
                    "SECUENCIA DE BALIZA",

                texto:
                    "La baliza transmite: 2, 6, 12, 20, 30. ¿Cuál es el siguiente valor?",

                respuesta:
                    "42"

            },

            {

                titulo:
                    "PUERTA DE CARGA",

                texto:
                    "Todos los drones K son negros. La unidad R-7 es un dron K. ¿De qué color es R-7?",

                respuesta:
                    "negro"

            },

            {

                titulo:
                    "RASTRO TÉRMICO",

                texto:
                    "Un objetivo entra en un túnel a las 22:10 y permanece 35 minutos. ¿A qué hora sale?",

                respuesta:
                    "22:45"

            }

        ];


        const elegido =
            this.elementoAleatorio(
                desafios
            );


        return {

            tipo:
                "pregunta",

            ...elegido

        };

    }


    crearDesafioCodigo() {

        const desafios = [

            {

                titulo:
                    "CÓDIGO DE TRANSPONDEDOR",

                texto:
                    "Completá la secuencia: A1, C3, E5, G7, __",

                respuesta:
                    "i9"

            },

            {

                titulo:
                    "CIFRADO DE MUELLE",

                texto:
                    "Si A=1, B=2, C=3... ¿cuánto suma la palabra CAB?",

                respuesta:
                    "6"

            },

            {

                titulo:
                    "NODO DE SEGURIDAD",

                texto:
                    "La clave duplica cada valor: 3 → 6, 5 → 10, 9 → ?",

                respuesta:
                    "18"

            }

        ];


        return {

            tipo:
                "pregunta",

            ...this.elementoAleatorio(
                desafios
            )

        };

    }


    crearDesafioMemoria() {

        const codigos = [

            "K7-N4-X2",

            "V9-R3-L8",

            "A6-Q1-M5",

            "T4-Z8-C3"

        ];


        const codigo =
            this.elementoAleatorio(
                codigos
            );


        return {

            tipo:
                "memoria",

            titulo:
                "MEMORIA DE FRECUENCIA",

            texto:
                "Memorizá el código del transpondedor.",

            codigo,

            respuesta:
                codigo.toLowerCase()

        };

    }


    lanzarDesafio(
        desafio,
        callback
    ) {

        if (
            desafio.tipo === "memoria"
        ) {

            this.lanzarMemoria(
                desafio,
                callback
            );

            return;

        }


        this.lanzarPregunta(
            desafio,
            callback
        );

    }


    lanzarPregunta(
        desafio,
        callback
    ) {

        const contenedor =
            document.getElementById(
                "contenedor-minijuegos"
            );


        if (!contenedor) {

            callback(false);

            return;

        }


        contenedor.innerHTML = `

            <div class="capa-desafio">

                <section class="terminal-desafio">

                    <span class="etiqueta-terminal">

                        FIELD_CHALLENGE

                    </span>


                    <h2>

                        ${desafio.titulo}

                    </h2>


                    <p>

                        ${desafio.texto}

                    </p>


                    <input
                        id="respuesta-evidencia"
                        type="text"
                        autocomplete="off"
                        placeholder="INGRESAR RESPUESTA"
                    >


                    <button
                        class="boton-terminal"
                        id="confirmar-evidencia"
                    >

                        PROCESAR RESPUESTA

                    </button>

                </section>

            </div>

        `;


        const input =
            document.getElementById(
                "respuesta-evidencia"
            );


        const boton =
            document.getElementById(
                "confirmar-evidencia"
            );


        const resolver = () => {

            const respuesta =
                this.normalizar(
                    input.value
                );


            const correcta =
                respuesta
                ===
                this.normalizar(
                    desafio.respuesta
                );


            contenedor.innerHTML = "";


            callback(
                correcta
            );

        };


        boton.addEventListener(
            "click",
            resolver
        );


        input.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Enter"
                ) {

                    resolver();

                }

            }
        );


        input.focus();

    }


    lanzarMemoria(
        desafio,
        callback
    ) {

        const contenedor =
            document.getElementById(
                "contenedor-minijuegos"
            );


        if (!contenedor) {

            callback(false);

            return;

        }


        contenedor.innerHTML = `

            <div class="capa-desafio">

                <section class="terminal-desafio">

                    <span class="etiqueta-terminal">

                        MEMORY_CAPTURE

                    </span>


                    <h2>

                        ${desafio.titulo}

                    </h2>


                    <p>

                        ${desafio.texto}

                    </p>


                    <div class="codigo-memoria">

                        ${desafio.codigo}

                    </div>


                    <div class="linea-sistema">

                        LA SEÑAL DESAPARECERÁ EN 4 SEGUNDOS

                    </div>

                </section>

            </div>

        `;


        setTimeout(
            () => {

                contenedor.innerHTML = `

                    <div class="capa-desafio">

                        <section class="terminal-desafio">

                            <span class="etiqueta-terminal">

                                MEMORY_RECALL

                            </span>


                            <h2>

                                RECONSTRUIR SEÑAL

                            </h2>


                            <input
                                id="respuesta-memoria"
                                type="text"
                                autocomplete="off"
                                placeholder="CÓDIGO DEL TRANSPONDEDOR"
                            >


                            <button
                                class="boton-terminal"
                                id="confirmar-memoria"
                            >

                                VALIDAR MEMORIA

                            </button>

                        </section>

                    </div>

                `;


                const input =
                    document.getElementById(
                        "respuesta-memoria"
                    );


                const boton =
                    document.getElementById(
                        "confirmar-memoria"
                    );


                const resolver = () => {

                    const correcta =

                        this.normalizar(
                            input.value
                        )

                        ===

                        this.normalizar(
                            desafio.respuesta
                        );


                    contenedor.innerHTML = "";


                    callback(
                        correcta
                    );

                };


                boton.addEventListener(
                    "click",
                    resolver
                );


                input.addEventListener(
                    "keydown",
                    evento => {

                        if (
                            evento.key === "Enter"
                        ) {

                            resolver();

                        }

                    }
                );


                input.focus();

            },

            4000
        );

    }


    /* =====================================================
       GENERACIÓN DE EVIDENCIA
       ===================================================== */

    generarEvidencia(opcion = {}) {

        const objetivo =
            this.obtenerObjetivoReal();


        if (!objetivo) {

            return null;

        }


        const atributos =
            this.obtenerAtributosValidos(
                objetivo
            );


        if (!atributos.length) {

            return this.generarEvidenciaNarrativa(
                objetivo,
                opcion
            );

        }


        const atributo =
            this.elementoAleatorio(
                atributos
            );


        const valor =
            objetivo[
                atributo
            ];


        const tirada =
            Math.random();


        let tipo =
            "verdadera";


        let fiabilidad =
            1;


        if (
            tirada < 0.10
        ) {

            tipo =
                "contradictoria";

            fiabilidad =
                0.45;

        }

        else if (
            tirada < 0.25
        ) {

            tipo =
                "incompleta";

            fiabilidad =
                0.7;

        }


        return {

            id:
                `EVIDENCIA_${Date.now()}_${atributo}`,

            categoria:
                this.clasificarAtributo(
                    atributo
                ),

            atributo,

            valor,

            tipo,

            fiabilidad,

            texto:
                this.crearTextoEvidencia(
                    atributo,
                    valor,
                    tipo,
                    opcion
                )

        };

    }


    obtenerAtributosValidos(
        sospechoso
    ) {

        const ignorar = [

            "id",

            "nombre",

            "name",

            "codigo",

            "descripcion",

            "description",

            "biografia",

            "bio",

            "imagen",

            "image",

            "minijuego"

        ];


        return Object.keys(
            sospechoso
        )
        .filter(
            clave => {

                const valor =
                    sospechoso[
                        clave
                    ];


                return (

                    !ignorar.includes(
                        clave
                    )

                    &&

                    (

                        typeof valor === "string"

                        ||

                        typeof valor === "number"

                        ||

                        typeof valor === "boolean"

                    )

                );

            }
        );

    }


    generarEvidenciaNarrativa(
        objetivo,
        opcion
    ) {

        return {

            id:
                `EVIDENCIA_NARRATIVA_${Date.now()}`,

            categoria:
                "conducta",

            atributo:
                null,

            valor:
                null,

            tipo:
                "incompleta",

            fiabilidad:
                0.65,

            texto:
                `La fuente vinculada a ${
                    opcion.nombre
                    ||
                    opcion.name
                    ||
                    "este sector"
                } afirma haber detectado un patrón compatible con ${
                    objetivo.nombre
                    ||
                    objetivo.name
                    ||
                    "uno de los objetivos registrados"
                }.`

        };

    }


    crearTextoEvidencia(
        atributo,
        valor,
        tipo,
        opcion
    ) {

        const fuente =
            opcion.nombre
            ||
            opcion.name
            ||
            "la fuente local";


        const textos = {

            origen:
                `Los registros recuperados en ${fuente} vinculan al objetivo con un origen clasificado como «${valor}».`,

            especie:
                `Un escáner residual detectó biomarcadores compatibles con la especie «${valor}».`,

            atmosfera:
                `El equipo abandonado utiliza calibración respiratoria para «${valor}».`,

            implante:
                `La firma tecnológica encontrada coincide con un implante de tipo «${valor}».`,

            arma:
                `El residuo de combate corresponde a un sistema de arma «${valor}».`,

            nave:
                `Los registros de tráfico señalan una nave de clase «${valor}».`,

            vehiculo:
                `El rastro de movilidad fue generado por «${valor}».`,

            conducta:
                `El testigo describe un patrón de conducta «${valor}».`,

            especialidad:
                `La técnica utilizada revela entrenamiento en «${valor}».`

        };


        let texto =
            textos[
                atributo.toLowerCase()
            ]
            ||
            `El análisis de ${fuente} aisló el parámetro «${atributo}» con valor «${valor}».`;


        if (
            tipo === "incompleta"
        ) {

            texto +=
                " La lectura está parcialmente degradada.";

        }


        if (
            tipo === "contradictoria"
        ) {

            texto =
                `TESTIMONIO DE BAJA CONFIANZA // ${texto}`;

        }


        return texto;

    }


    clasificarAtributo(
        atributo
    ) {

        const texto =
            atributo.toLowerCase();


        if (
            texto.includes("arma")
            ||
            texto.includes("combate")
        ) {

            return "combate";

        }


        if (
            texto.includes("nave")
            ||
            texto.includes("vehiculo")
            ||
            texto.includes("movilidad")
        ) {

            return "movilidad";

        }


        if (
            texto.includes("implante")
            ||
            texto.includes("tecn")
        ) {

            return "tecnologia";

        }


        if (
            texto.includes("especie")
            ||
            texto.includes("atmosfera")
            ||
            texto.includes("biolog")
        ) {

            return "biologia";

        }


        if (
            texto.includes("origen")
            ||
            texto.includes("planeta")
        ) {

            return "origen";

        }


        return "conducta";

    }


    /* =====================================================
       REGISTRO
       ===================================================== */

    registrarEvidencia(
        evidencia
    ) {

        this.evidenciasObtenidas.push(
            evidencia
        );


        this.ultimaEvidencia =
            evidencia;


        this.nivelInteligencia =
            Math.min(

                100,

                this.nivelInteligencia
                +
                this.calcularValorEvidencia(
                    evidencia
                )

            );


        if (
            typeof motorDeduccion !== "undefined"
        ) {

            motorDeduccion.registrarPista(
                evidencia
            );

        }


        this.mostrarEvidencia(
            evidencia
        );


        this.guardar();

    }


    registrarPistaOperacion(pista) {

        if (!pista) return;

        const id =
            pista.id ||
            pista.codigo ||
            pista.texto ||
            pista.text_pista;

        if (
            this.evidenciasObtenidas.some(
                evidencia => evidencia.id === id
            )
        ) {

            return;

        }

        const evidencia = {
            id,
            categoria:
                pista.categoria ||
                pista.tipo ||
                pista.type ||
                "general",
            atributo:
                pista.atributo ||
                pista.propiedad ||
                pista.value_associated?.property ||
                null,
            valor:
                pista.valor ||
                pista.value_associated?.value ||
                pista.value_associated ||
                null,
            tipo: "verdadera",
            fiabilidad: 1,
            texto:
                pista.texto ||
                pista.witness_statement ||
                pista.text_pista ||
                "Inteligencia recuperada durante la operación."
        };

        this.evidenciasObtenidas.push(evidencia);
        this.ultimaEvidencia = evidencia;
        this.nivelInteligencia = Math.min(
            100,
            this.nivelInteligencia +
                this.calcularValorEvidencia(evidencia)
        );

        if (typeof motorDeduccion !== "undefined") {
            motorDeduccion.registrarPista(evidencia);
        }

        this.guardar();
    }


    calcularValorEvidencia(
        evidencia
    ) {

        if (
            evidencia.tipo ===
            "verdadera"
        ) {

            return 14;

        }


        if (
            evidencia.tipo ===
            "incompleta"
        ) {

            return 8;

        }


        return 4;

    }


    /* =====================================================
       TIEMPO
       ===================================================== */

    consumirTiempo(
        horas
    ) {

        if (
            typeof STARHOUND !== "undefined"
            &&
            typeof STARHOUND.horas === "number"
        ) {

            STARHOUND.horas = Math.max(
                0,
                STARHOUND.horas - horas
            );

            if (typeof comprobarTiempo === "function") {
                comprobarTiempo();
            }

        }

    }


    /* =====================================================
       INTERFAZ
       ===================================================== */

    mostrarEvidencia(
        evidencia
    ) {

        const contenedor =
            document.getElementById(
                "contenedor-minijuegos"
            );


        if (!contenedor) {

            return;

        }


        contenedor.innerHTML = `

            <div class="capa-desafio">

                <section class="terminal-desafio evidencia-recibida">

                    <span class="etiqueta-terminal">

                        EVIDENCE_ACQUIRED

                    </span>


                    <h2>

                        EVIDENCIA RECUPERADA

                    </h2>


                    <div class="ficha-evidencia">

                        <span>

                            ${evidencia.categoria.toUpperCase()}

                        </span>


                        <p>

                            ${this.escaparHTML(
                                evidencia.texto
                            )}

                        </p>


                        <div class="fiabilidad-evidencia">

                            FIABILIDAD //

                            <strong>

                                ${
                                    Math.round(
                                        evidencia.fiabilidad
                                        *
                                        100
                                    )
                                }%

                            </strong>

                        </div>

                    </div>


                    <div class="barra-archivo grande">

                        <div
                            style="
                                width:
                                ${this.nivelInteligencia}%
                            "
                        ></div>

                    </div>


                    <p class="dato-inteligencia">

                        INTELIGENCIA TOTAL //

                        ${this.nivelInteligencia}%

                    </p>


                    <button
                        class="boton-terminal"
                        id="cerrar-evidencia"
                    >

                        ARCHIVAR EVIDENCIA

                    </button>

                </section>

            </div>

        `;


        document
            .getElementById(
                "cerrar-evidencia"
            )
            .addEventListener(
                "click",
                () => {

                    contenedor.innerHTML = "";


                    if (typeof renderCaso === "function") {
                        renderCaso();
                    }

                }
            );

    }


    mostrarMensaje(
        texto
    ) {

        const mensaje =
            document.getElementById(
                "mensaje-starhound"
            );


        if (!mensaje) {

            console.log(
                "[STARHOUND]",
                texto
            );

            return;

        }


        mensaje.textContent =
            texto;


        mensaje.classList.add(
            "visible"
        );


        setTimeout(
            () => {

                mensaje.classList.remove(
                    "visible"
                );

            },

            2800
        );

    }


    /* =====================================================
       GUARDADO
       ===================================================== */

    guardar() {

        try {

            localStorage.setItem(

                "STARHOUND_EVIDENCIAS",

                JSON.stringify({

                    evidencias:
                        this.evidenciasObtenidas,

                    investigaciones:
                        this.investigacionesRealizadas,

                    inteligencia:
                        this.nivelInteligencia

                })

            );

        }

        catch (error) {

            console.warn(

                "[STARHOUND] No fue posible guardar evidencias.",

                error

            );

        }

    }


    /* =====================================================
       UTILIDADES
       ===================================================== */

    normalizar(
        texto
    ) {

        return String(
            texto
            ??
            ""
        )
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

    }


    escaparHTML(
        texto
    ) {

        return String(
            texto
        )

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


    numeroAleatorio(
        minimo,
        maximo
    ) {

        return Math.floor(

            Math.random()
            *
            (
                maximo
                -
                minimo
                +
                1
            )

        )
        +
        minimo;

    }


    elementoAleatorio(
        lista
    ) {

        return lista[

            Math.floor(
                Math.random()
                *
                lista.length
            )

        ];

    }

}


/* =========================================================
   INSTANCIA GLOBAL
   ========================================================= */

const sistemaEvidencias =
    new SistemaEvidencias();


window.sistemaEvidencias =
    sistemaEvidencias;
