/* =========================================================
   STARHOUND
   BASE DE DATOS GALÁCTICA
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN DEL UNIVERSO
   ========================================================= */

const UNIVERSO = {
    nombre: "FRONTERA HELIOS",
    año: 3178,
    academia: "ACADEMIA STARHOUND",
    division: "DIVISIÓN DE RASTREO Y CAPTURA",
    moneda: "CR",
    lema: "ENCONTRAR. RASTREAR. COBRAR."
};


/* =========================================================
   RANGOS
   ========================================================= */

const RANGOS = [
    {
        id: "cadete",
        nombre: "CADETE DE POLVO",
        nivelMinimo: 1,
        reputacion: 0
    },
    {
        id: "rastreador",
        nombre: "RASTREADOR",
        nivelMinimo: 3,
        reputacion: 150
    },
    {
        id: "sabueso",
        nombre: "SABUESO ESTELAR",
        nivelMinimo: 6,
        reputacion: 450
    },
    {
        id: "marshal",
        nombre: "MARSHAL DE FRONTERA",
        nivelMinimo: 10,
        reputacion: 900
    },
    {
        id: "leyenda",
        nombre: "LEYENDA DEL VACÍO",
        nivelMinimo: 15,
        reputacion: 1800
    }
];


/* =========================================================
   AGENTES JUGABLES
   ========================================================= */

const AGENTES = [
    {
        id: "espectro",
        nombre: "ESPECTRO",
        titulo: "EL QUE ESCUCHA EL RUIDO",
        especialidad: "ANÁLISIS FORENSE",
        descripcion:
            "Graduado del Archivo Negro de Starhound. Es capaz de reconstruir una identidad a partir de residuos aparentemente inútiles.",
        icono: "fa-user-secret",

        estadisticas: {
            rastreo: 7,
            ingenio: 9,
            tecnologia: 8,
            presencia: 4
        },

        perk: {
            id: "ojo_residual",
            nombre: "OJO RESIDUAL",
            descripcion:
                "Las pistas de identidad otorgan un 25% más de progreso."
        }
    },

    {
        id: "vector",
        nombre: "VECTOR",
        titulo: "EL CAZADOR DE RUTAS",
        especialidad: "RASTREO INTERESTELAR",
        descripcion:
            "Antiguo cartógrafo de contrabando. Reconoce patrones de fuga en rutas orbitales antes de que los sistemas de tráfico detecten una anomalía.",
        icono: "fa-route",

        estadisticas: {
            rastreo: 10,
            ingenio: 6,
            tecnologia: 6,
            presencia: 5
        },

        perk: {
            id: "olfato_orbital",
            nombre: "OLFATO ORBITAL",
            descripcion:
                "Los viajes incorrectos cuestan 4 horas menos."
        }
    },

    {
        id: "nexo",
        nombre: "NEXO",
        titulo: "CIEN ROSTROS",
        especialidad: "INFILTRACIÓN",
        descripcion:
            "Especialista en fuentes humanas, sindicatos criminales y conversaciones donde nadie debería hablar.",
        icono: "fa-masks-theater",

        estadisticas: {
            rastreo: 6,
            ingenio: 7,
            tecnologia: 5,
            presencia: 10
        },

        perk: {
            id: "lengua_plata",
            nombre: "LENGUA DE PLATA",
            descripcion:
                "Los interrogatorios permiten un error adicional."
        }
    },

    {
        id: "cobre",
        nombre: "COBRE",
        titulo: "EL ÚLTIMO SHERIFF",
        especialidad: "CAZA DE CAMPO",
        descripcion:
            "Creció en colonias mineras sin ley. No confía demasiado en terminales, pero puede seguir una huella sobre roca volcánica.",
        icono: "fa-hat-cowboy",

        estadisticas: {
            rastreo: 9,
            ingenio: 5,
            tecnologia: 3,
            presencia: 8
        },

        perk: {
            id: "polvo_botas",
            nombre: "POLVO EN LAS BOTAS",
            descripcion:
                "La primera investigación física de cada planeta no consume tiempo."
        }
    },

    {
        id: "pixel",
        nombre: "PIXEL",
        titulo: "FANTASMA DE SILICIO",
        especialidad: "INTRUSIÓN DIGITAL",
        descripcion:
            "Expulsada tres veces del Instituto de Sistemas de Vega. Starhound decidió contratarla antes de tener que arrestarla.",
        icono: "fa-microchip",

        estadisticas: {
            rastreo: 5,
            ingenio: 8,
            tecnologia: 10,
            presencia: 3
        },

        perk: {
            id: "puerta_trasera",
            nombre: "PUERTA TRASERA",
            descripcion:
                "Las pruebas tecnológicas comienzan con una ventaja."
        }
    },

    {
        id: "monje",
        nombre: "MONJE",
        titulo: "EL HOMBRE QUIETO",
        especialidad: "DEDUCCIÓN",
        descripcion:
            "Durante doce años estudió lógica criminal en las lunas monasterio de Orpheus. Habla poco. Recuerda todo.",
        icono: "fa-chess-knight",

        estadisticas: {
            rastreo: 7,
            ingenio: 10,
            tecnologia: 5,
            presencia: 6
        },

        perk: {
            id: "mente_fractal",
            nombre: "MENTE FRACTAL",
            descripcion:
                "Los acertijos ofrecen una pista después del primer error."
        }
    }
];


/* =========================================================
   PERKS DESBLOQUEABLES
   ========================================================= */

const PERKS = [
    {
        id: "cronometro_roto",
        nombre: "CRONÓMETRO ROTO",
        tipo: "tiempo",
        descripcion:
            "La primera penalización temporal de una misión se reduce a la mitad.",
        nivelRequerido: 2
    },

    {
        id: "memoria_fotografica",
        nombre: "MEMORIA FOTOGRÁFICA",
        tipo: "investigacion",
        descripcion:
            "Las pruebas de memoria muestran sus elementos durante más tiempo.",
        nivelRequerido: 3
    },

    {
        id: "viejo_contacto",
        nombre: "VIEJO CONTACTO",
        tipo: "social",
        descripcion:
            "Una vez por misión podés obtener una pista parcial sin superar una prueba.",
        nivelRequerido: 4
    },

    {
        id: "motor_caliente",
        nombre: "MOTOR CALIENTE",
        tipo: "viaje",
        descripcion:
            "El primer salto interestelar cuesta 2 horas menos.",
        nivelRequerido: 5
    },

    {
        id: "calculadora_mental",
        nombre: "CALCULADORA MENTAL",
        tipo: "logica",
        descripcion:
            "Las pruebas matemáticas eliminan una respuesta incorrecta.",
        nivelRequerido: 6
    },

    {
        id: "lector_de_huellas",
        nombre: "LECTOR DE HUELLAS",
        tipo: "rastreo",
        descripcion:
            "Las pistas físicas revelan su categoría antes de realizar la prueba.",
        nivelRequerido: 7
    },

    {
        id: "cara_de_piedra",
        nombre: "CARA DE PIEDRA",
        tipo: "social",
        descripcion:
            "Fallás un interrogatorio sin perder horas una vez por misión.",
        nivelRequerido: 8
    },

    {
        id: "cartografo_negro",
        nombre: "CARTÓGRAFO NEGRO",
        tipo: "viaje",
        descripcion:
            "El archivo marca un destino como improbable.",
        nivelRequerido: 9
    },

    {
        id: "sabueso",
        nombre: "INSTINTO DE SABUESO",
        tipo: "rastreo",
        descripcion:
            "Al superar 75% de identidad, se revela automáticamente un rasgo desconocido.",
        nivelRequerido: 10
    }
];


/* =========================================================
   PLANETAS Y COLONIAS
   ========================================================= */

const CITIES = [

    {
        id: "dustfall",
        name: "Dustfall",
        country: "Sistema Caldera",
        tipo: "COLONIA MINERA",

        description_corta:
            "Polvo rojo, motores viejos y demasiadas armas.",

        description_long:
            "Dustfall fue construida alrededor de una mina de iridio que dejó de ser rentable hace treinta años. Nadie se fue. Los bares permanecen abiertos, los generadores tiemblan y cada callejón tiene su propio sheriff no oficial.",

        investigation_options: [
            {
                id: "dust_cantina",
                name: "INTERROGAR EN LA CANTINA BLACK COMET",
                focus: "identity",
                prueba: "interrogatorio",
                dificultad: 2,
                costo: 3
            },
            {
                id: "dust_huellas",
                name: "ANALIZAR HUELLAS DEL PUERTO",
                focus: "destination",
                prueba: "logica",
                dificultad: 2,
                costo: 3
            },
            {
                id: "dust_mina",
                name: "EXPLORAR LA MINA ABANDONADA",
                focus: "mixed",
                prueba: "secuencia",
                dificultad: 3,
                costo: 4
            },
            {
                id: "dust_terminal",
                name: "HACKEAR EL REGISTRO DE CARGA",
                focus: "destination",
                prueba: "hack",
                dificultad: 3,
                costo: 3
            },
            {
                id: "dust_mecanico",
                name: "HABLAR CON EL MECÁNICO TUERTO",
                focus: "identity",
                prueba: "matematica",
                dificultad: 1,
                costo: 2
            }
        ],

        possible_clues: [
            "dest_neon",
            "dest_cinder",
            "id_implante_cromo",
            "id_arma_revolver",
            "id_nave_courier",
            "id_especie_humano"
        ]
    },


    {
        id: "neon",
        name: "Neon Meridian",
        country: "Sistema Vega",
        tipo: "MEGACIUDAD",

        description_corta:
            "Una ciudad vertical donde nunca apagan los anuncios.",

        description_long:
            "Neon Meridian ocupa cuatrocientos niveles de una torre continental. Las corporaciones gobiernan arriba. Los sindicatos criminales controlan abajo. Entre ambos existe una franja de clubes, mercados de memoria y oficinas que oficialmente no existen.",

        investigation_options: [
            {
                id: "neon_camaras",
                name: "RECONSTRUIR RED DE CÁMARAS",
                focus: "identity",
                prueba: "memoria",
                dificultad: 3,
                costo: 3
            },
            {
                id: "neon_corredor",
                name: "SEGUIR A UN CORREDOR DE DATOS",
                focus: "destination",
                prueba: "pulso",
                dificultad: 3,
                costo: 4
            },
            {
                id: "neon_casino",
                name: "INFILTRARSE EN EL CASINO ZERO",
                focus: "mixed",
                prueba: "cartas",
                dificultad: 3,
                costo: 4
            },
            {
                id: "neon_servidor",
                name: "ROMPER EL SERVIDOR MUNICIPAL",
                focus: "destination",
                prueba: "hack",
                dificultad: 4,
                costo: 3
            },
            {
                id: "neon_informante",
                name: "NEGOCIAR CON LA INFORMANTE KIRA-9",
                focus: "identity",
                prueba: "interrogatorio",
                dificultad: 4,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_orpheus",
            "dest_helix",
            "id_implante_optico",
            "id_arma_plasma",
            "id_nave_interceptor",
            "id_especie_sintetico"
        ]
    },


    {
        id: "cinder",
        name: "Cinder Reach",
        country: "Cinturón Ash",
        tipo: "LUNA INDUSTRIAL",

        description_corta:
            "Fundiciones orbitales bajo un cielo permanentemente naranja.",

        description_long:
            "Las chimeneas de Cinder Reach son visibles desde órbita. Miles de trabajadores procesan aleaciones para las flotas del núcleo. Los capataces compran silencio y los contrabandistas compran a los capataces.",

        investigation_options: [
            {
                id: "cinder_fundicion",
                name: "INSPECCIONAR LA FUNDICIÓN 12",
                focus: "identity",
                prueba: "logica",
                dificultad: 2,
                costo: 3
            },
            {
                id: "cinder_manifiesto",
                name: "REVISAR MANIFIESTOS DE CARGA",
                focus: "destination",
                prueba: "matematica",
                dificultad: 3,
                costo: 3
            },
            {
                id: "cinder_sindicato",
                name: "PRESIONAR AL SINDICATO DE ESTIBADORES",
                focus: "mixed",
                prueba: "interrogatorio",
                dificultad: 3,
                costo: 4
            },
            {
                id: "cinder_drones",
                name: "RECUPERAR MEMORIA DE UN DRON",
                focus: "identity",
                prueba: "memoria",
                dificultad: 3,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_frost",
            "dest_neon",
            "id_implante_cromo",
            "id_arma_rifle",
            "id_nave_freighter",
            "id_especie_humano"
        ]
    },


    {
        id: "orpheus",
        name: "Orpheus",
        country: "Nebulosa Silente",
        tipo: "LUNA MONASTERIO",

        description_corta:
            "Bibliotecas de piedra suspendidas sobre océanos negros.",

        description_long:
            "Los monjes de Orpheus conservan registros que preceden a la Federación. No usan redes inalámbricas. No aceptan créditos. Para conseguir información hay que demostrar que uno merece conocerla.",

        investigation_options: [
            {
                id: "orpheus_archivo",
                name: "CONSULTAR EL ARCHIVO DE LOS NUEVE",
                focus: "identity",
                prueba: "acertijo",
                dificultad: 3,
                costo: 3
            },
            {
                id: "orpheus_observatorio",
                name: "INTERPRETAR EL MAPA ESTELAR",
                focus: "destination",
                prueba: "logica",
                dificultad: 4,
                costo: 4
            },
            {
                id: "orpheus_monje",
                name: "SOMETERSE AL JUICIO DEL MONJE",
                focus: "mixed",
                prueba: "acertijo",
                dificultad: 4,
                costo: 3
            },
            {
                id: "orpheus_campanas",
                name: "DESCIFRAR LA SECUENCIA DE CAMPANAS",
                focus: "destination",
                prueba: "secuencia",
                dificultad: 3,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_frost",
            "dest_grave",
            "id_implante_neural",
            "id_arma_hoja",
            "id_nave_sloop",
            "id_especie_velari"
        ]
    },


    {
        id: "frost",
        name: "Frostbite",
        country: "Sistema Boreal",
        tipo: "PLANETA GLACIAL",

        description_corta:
            "Una estación científica enterrada bajo kilómetros de hielo.",

        description_long:
            "En Frostbite la noche dura ciento veinte días. Las tormentas pueden borrar una nave del radar en segundos. Los científicos locales aprendieron a desconfiar de cualquiera que llegue sin una buena explicación.",

        investigation_options: [
            {
                id: "frost_laboratorio",
                name: "REGISTRAR EL LABORATORIO SELLADO",
                focus: "identity",
                prueba: "memoria",
                dificultad: 3,
                costo: 3
            },
            {
                id: "frost_radar",
                name: "RECONSTRUIR ECO DE RADAR",
                focus: "destination",
                prueba: "secuencia",
                dificultad: 4,
                costo: 4
            },
            {
                id: "frost_cientifico",
                name: "INTERROGAR AL JEFE CIENTÍFICO",
                focus: "identity",
                prueba: "interrogatorio",
                dificultad: 3,
                costo: 3
            },
            {
                id: "frost_generador",
                name: "REACTIVAR EL GENERADOR AUXILIAR",
                focus: "mixed",
                prueba: "matematica",
                dificultad: 3,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_grave",
            "dest_helix",
            "id_implante_termico",
            "id_arma_plasma",
            "id_nave_courier",
            "id_especie_humano"
        ]
    },


    {
        id: "helix",
        name: "Helix Prime",
        country: "Dominio Central",
        tipo: "MUNDO CORPORATIVO",

        description_corta:
            "Cristal, acero y contratos de cuatrocientas páginas.",

        description_long:
            "Helix Prime es legalmente propiedad de siete corporaciones. Cada ciudadano tiene un índice de productividad. Cada calle tiene sensores. Paradójicamente, si uno posee suficientes créditos, puede desaparecer por completo.",

        investigation_options: [
            {
                id: "helix_banco",
                name: "RASTREAR TRANSFERENCIAS FANTASMA",
                focus: "destination",
                prueba: "matematica",
                dificultad: 4,
                costo: 3
            },
            {
                id: "helix_biometria",
                name: "COMPARAR REGISTROS BIOMÉTRICOS",
                focus: "identity",
                prueba: "logica",
                dificultad: 4,
                costo: 3
            },
            {
                id: "helix_ejecutivo",
                name: "ACORRALAR A UN EJECUTIVO",
                focus: "mixed",
                prueba: "interrogatorio",
                dificultad: 4,
                costo: 4
            },
            {
                id: "helix_ascensor",
                name: "INFILTRAR EL ASCENSOR PRIVADO",
                focus: "identity",
                prueba: "pulso",
                dificultad: 3,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_grave",
            "dest_sundown",
            "id_implante_optico",
            "id_arma_revolver",
            "id_nave_yacht",
            "id_especie_velari"
        ]
    },


    {
        id: "grave",
        name: "Graveyard",
        country: "Sector Muerto",
        tipo: "CEMENTERIO DE NAVES",

        description_corta:
            "Miles de cascos flotan alrededor de una estrella apagada.",

        description_long:
            "Graveyard no aparece en mapas comerciales. Chatarreros, fugitivos y cultos mecánicos viven dentro de naves abandonadas conectadas por túneles improvisados.",

        investigation_options: [
            {
                id: "grave_casco",
                name: "EXPLORAR UN CASCO SIN ENERGÍA",
                focus: "identity",
                prueba: "secuencia",
                dificultad: 4,
                costo: 4
            },
            {
                id: "grave_chatarrero",
                name: "NEGOCIAR CON LOS CHATARREROS",
                focus: "destination",
                prueba: "cartas",
                dificultad: 3,
                costo: 3
            },
            {
                id: "grave_ia",
                name: "DESPERTAR UNA IA DAÑADA",
                focus: "mixed",
                prueba: "logica",
                dificultad: 5,
                costo: 4
            },
            {
                id: "grave_baliza",
                name: "DESCIFRAR UNA BALIZA ROTA",
                focus: "destination",
                prueba: "hack",
                dificultad: 4,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_sundown",
            "dest_redemption",
            "id_implante_neural",
            "id_arma_rifle",
            "id_nave_freighter",
            "id_especie_sintetico"
        ]
    },


    {
        id: "sundown",
        name: "Sundown",
        country: "Frontera Exterior",
        tipo: "MUNDO DESÉRTICO",

        description_corta:
            "Duelos al atardecer y estaciones de combustible.",

        description_long:
            "Sundown es lo más parecido a una frontera antigua. Los colonos llevan armas en el cinturón. Las recompensas se clavan en paredes. Los marshals duran poco.",

        investigation_options: [
            {
                id: "sun_saloon",
                name: "JUGAR UNA MANO EN EL SALOON",
                focus: "identity",
                prueba: "cartas",
                dificultad: 3,
                costo: 3
            },
            {
                id: "sun_rastreo",
                name: "SEGUIR HUELLAS EN EL DESIERTO",
                focus: "destination",
                prueba: "logica",
                dificultad: 4,
                costo: 4
            },
            {
                id: "sun_duelo",
                name: "DESAFIAR AL INFORMANTE",
                focus: "mixed",
                prueba: "pulso",
                dificultad: 4,
                costo: 3
            },
            {
                id: "sun_estacion",
                name: "REVISAR VENTAS DE COMBUSTIBLE",
                focus: "destination",
                prueba: "matematica",
                dificultad: 2,
                costo: 2
            }
        ],

        possible_clues: [
            "dest_redemption",
            "dest_blackreef",
            "id_implante_cromo",
            "id_arma_revolver",
            "id_nave_sloop",
            "id_especie_humano"
        ]
    },


    {
        id: "redemption",
        name: "Redemption",
        country: "Sistema Lazarus",
        tipo: "COLONIA PENITENCIARIA",

        description_corta:
            "Una prisión convertida en ciudad independiente.",

        description_long:
            "Cuando la Federación abandonó la prisión Lazarus, los internos cerraron las puertas desde dentro y fundaron Redemption. Allí nadie pregunta qué hiciste. Sólo preguntan cuánto pagás.",

        investigation_options: [
            {
                id: "red_guardia",
                name: "INTERROGAR A UN EX GUARDIA",
                focus: "identity",
                prueba: "interrogatorio",
                dificultad: 4,
                costo: 3
            },
            {
                id: "red_celdas",
                name: "REGISTRAR LOS BLOQUES ANTIGUOS",
                focus: "mixed",
                prueba: "memoria",
                dificultad: 4,
                costo: 4
            },
            {
                id: "red_tunel",
                name: "MAPEAR TÚNELES DE CONTRABANDO",
                focus: "destination",
                prueba: "logica",
                dificultad: 5,
                costo: 4
            },
            {
                id: "red_apuestas",
                name: "GANAR INFORMACIÓN EN LAS APUESTAS",
                focus: "identity",
                prueba: "cartas",
                dificultad: 4,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_blackreef",
            "dest_eidolon",
            "id_implante_termico",
            "id_arma_hoja",
            "id_nave_interceptor",
            "id_especie_velari"
        ]
    },


    {
        id: "blackreef",
        name: "Black Reef",
        country: "Mar de Gas Nox",
        tipo: "ESTACIÓN PIRATA",

        description_corta:
            "Un puerto criminal escondido dentro de una tormenta.",

        description_long:
            "Black Reef fue construida sobre los restos de un crucero de guerra. Sus corredores cambian de dueño cada semana. No existe policía. Sólo acuerdos temporales.",

        investigation_options: [
            {
                id: "reef_capitan",
                name: "INTERROGAR A UN CAPITÁN PIRATA",
                focus: "destination",
                prueba: "interrogatorio",
                dificultad: 5,
                costo: 4
            },
            {
                id: "reef_dados",
                name: "APOSTAR EN LA MESA DEL VACÍO",
                focus: "identity",
                prueba: "cartas",
                dificultad: 4,
                costo: 3
            },
            {
                id: "reef_dique",
                name: "INSPECCIONAR EL DIQUE CLANDESTINO",
                focus: "mixed",
                prueba: "memoria",
                dificultad: 4,
                costo: 3
            },
            {
                id: "reef_radio",
                name: "INTERCEPTAR RADIO PIRATA",
                focus: "destination",
                prueba: "hack",
                dificultad: 5,
                costo: 4
            }
        ],

        possible_clues: [
            "dest_eidolon",
            "dest_eden",
            "id_implante_neural",
            "id_arma_plasma",
            "id_nave_yacht",
            "id_especie_sintetico"
        ]
    },


    {
        id: "eidolon",
        name: "Eidolon",
        country: "Vacío Cartografiado",
        tipo: "PLANETA RUINA",

        description_corta:
            "Ciudades alienígenas vacías desde hace milenios.",

        description_long:
            "Nadie sabe quién construyó Eidolon. Las estructuras reaccionan a la presencia humana y algunos corredores parecen cambiar cuando nadie los observa.",

        investigation_options: [
            {
                id: "eidolon_simbolos",
                name: "DESCIFRAR LOS SÍMBOLOS DEL MURO",
                focus: "destination",
                prueba: "acertijo",
                dificultad: 5,
                costo: 4
            },
            {
                id: "eidolon_eco",
                name: "RECONSTRUIR UN ECO BIOMÉTRICO",
                focus: "identity",
                prueba: "secuencia",
                dificultad: 5,
                costo: 4
            },
            {
                id: "eidolon_camara",
                name: "ABRIR LA CÁMARA CENTRAL",
                focus: "mixed",
                prueba: "logica",
                dificultad: 5,
                costo: 5
            },
            {
                id: "eidolon_dron",
                name: "SEGUIR AL DRON DESCONOCIDO",
                focus: "destination",
                prueba: "pulso",
                dificultad: 4,
                costo: 3
            }
        ],

        possible_clues: [
            "dest_eden",
            "dest_academia",
            "id_implante_optico",
            "id_arma_hoja",
            "id_nave_courier",
            "id_especie_velari"
        ]
    },


    {
        id: "eden",
        name: "New Eden",
        country: "Sistema Arcadia",
        tipo: "MUNDO PARAÍSO",

        description_corta:
            "Playas artificiales y millonarios que compraron otro nombre.",

        description_long:
            "New Eden vende anonimato como servicio premium. Villas privadas flotan sobre mares diseñados. La mitad de sus residentes oficialmente están muertos.",

        investigation_options: [
            {
                id: "eden_registro",
                name: "CRUZAR IDENTIDADES FALSAS",
                focus: "identity",
                prueba: "logica",
                dificultad: 5,
                costo: 3
            },
            {
                id: "eden_marina",
                name: "INSPECCIONAR LA MARINA PRIVADA",
                focus: "destination",
                prueba: "memoria",
                dificultad: 4,
                costo: 3
            },
            {
                id: "eden_subasta",
                name: "INFILTRARSE EN UNA SUBASTA",
                focus: "mixed",
                prueba: "cartas",
                dificultad: 5,
                costo: 4
            },
            {
                id: "eden_conserje",
                name: "PRESIONAR AL CONSERJE SINTÉTICO",
                focus: "identity",
                prueba: "interrogatorio",
                dificultad: 5,
                costo: 4
            }
        ],

        possible_clues: [
            "dest_academia",
            "dest_dust",
            "id_implante_termico",
            "id_arma_revolver",
            "id_nave_yacht",
            "id_especie_humano"
        ]
    }
];


/* =========================================================
   SOSPECHOSOS / RECOMPENSAS
   ========================================================= */

const THIEVES = [

    {
        id: "silas_vane",
        name: "SILAS VANE",
        alias: "EL PREDICADOR",
        especie: "Humano",
        implante: "Cromo",
        arma: "Revolver",
        nave: "Courier",
        rasgo: "Coleccionista de monedas",
        peligrosidad: 2,
        recompensa: 3200,
        minijuego: "pulso"
    },

    {
        id: "kira_nueve",
        name: "KIRA-9",
        alias: "LA HIJA DEL CÓDIGO",
        especie: "Sintético",
        implante: "Óptico",
        arma: "Plasma",
        nave: "Interceptor",
        rasgo: "Obsesión por música analógica",
        peligrosidad: 4,
        recompensa: 7800,
        minijuego: "hack"
    },

    {
        id: "cassian_rook",
        name: "CASSIAN ROOK",
        alias: "EL JUGADOR",
        especie: "Humano",
        implante: "Neural",
        arma: "Revolver",
        nave: "Yacht",
        rasgo: "Jugador compulsivo",
        peligrosidad: 3,
        recompensa: 5400,
        minijuego: "cartas"
    },

    {
        id: "vesper_morne",
        name: "VESPER MORNE",
        alias: "LA VIUDA DEL VACÍO",
        especie: "Velari",
        implante: "Térmico",
        arma: "Hoja",
        nave: "Sloop",
        rasgo: "Nunca duerme dos veces en el mismo lugar",
        peligrosidad: 5,
        recompensa: 12000,
        minijuego: "secuencia"
    },

    {
        id: "brakk",
        name: "BRAX KORR",
        alias: "BRAKK",
        especie: "Humano",
        implante: "Cromo",
        arma: "Rifle",
        nave: "Freighter",
        rasgo: "Ex minero de Cinder Reach",
        peligrosidad: 3,
        recompensa: 6100,
        minijuego: "memoria"
    },

    {
        id: "morrow",
        name: "DOCTOR MORROW",
        alias: "EL TAXIDERMISTA",
        especie: "Humano",
        implante: "Neural",
        arma: "Plasma",
        nave: "Courier",
        rasgo: "Colecciona especies extintas",
        peligrosidad: 5,
        recompensa: 14500,
        minijuego: "logica"
    },

    {
        id: "nyx",
        name: "NYX VALENTINE",
        alias: "LA ÚLTIMA LUZ",
        especie: "Velari",
        implante: "Óptico",
        arma: "Hoja",
        nave: "Interceptor",
        rasgo: "Antigua agente Starhound",
        peligrosidad: 5,
        recompensa: 18000,
        minijuego: "ajedrez"
    },

    {
        id: "hollis",
        name: "HOLLIS GRAVES",
        alias: "EL SEPULTURERO",
        especie: "Humano",
        implante: "Térmico",
        arma: "Rifle",
        nave: "Freighter",
        rasgo: "Experto en naves abandonadas",
        peligrosidad: 4,
        recompensa: 8900,
        minijuego: "memoria"
    },

    {
        id: "zero",
        name: "ZERO SAINT",
        alias: "NINGÚN HOMBRE",
        especie: "Sintético",
        implante: "Neural",
        arma: "Plasma",
        nave: "Sloop",
        rasgo: "Borra su propia memoria",
        peligrosidad: 5,
        recompensa: 21000,
        minijuego: "hack"
    },

    {
        id: "mara_quell",
        name: "MARA QUELL",
        alias: "LA CARTÓGRAFA",
        especie: "Humano",
        implante: "Óptico",
        arma: "Revolver",
        nave: "Courier",
        rasgo: "Memoriza rutas estelares",
        peligrosidad: 3,
        recompensa: 6800,
        minijuego: "secuencia"
    },

    {
        id: "father_ash",
        name: "FATHER ASH",
        alias: "EL HOMBRE DE CENIZA",
        especie: "Velari",
        implante: "Cromo",
        arma: "Hoja",
        nave: "Sloop",
        rasgo: "Predicador itinerante",
        peligrosidad: 4,
        recompensa: 10500,
        minijuego: "acertijo"
    },

    {
        id: "ruby_hex",
        name: "RUBY HEX",
        alias: "SEIS ROJO",
        especie: "Sintético",
        implante: "Térmico",
        arma: "Rifle",
        nave: "Interceptor",
        rasgo: "Piloto de carreras clandestinas",
        peligrosidad: 4,
        recompensa: 9300,
        minijuego: "pulso"
    },

    {
        id: "jonah_black",
        name: "JONAH BLACK",
        alias: "EL MARSHAL MUERTO",
        especie: "Humano",
        implante: "Cromo",
        arma: "Revolver",
        nave: "Yacht",
        rasgo: "Antiguo agente federal",
        peligrosidad: 5,
        recompensa: 16500,
        minijuego: "ajedrez"
    },

    {
        id: "iris",
        name: "IRIS",
        alias: "LA TESTIGO",
        especie: "Sintético",
        implante: "Óptico",
        arma: "Hoja",
        nave: "Courier",
        rasgo: "Registra todas sus conversaciones",
        peligrosidad: 2,
        recompensa: 4500,
        minijuego: "logica"
    },

    {
        id: "dante_scar",
        name: "DANTE SCAR",
        alias: "EL PERRO DE SUNDOWN",
        especie: "Humano",
        implante: "Térmico",
        arma: "Rifle",
        nave: "Freighter",
        rasgo: "Cazarrecompensas renegado",
        peligrosidad: 5,
        recompensa: 19800,
        minijuego: "pulso"
    }
];


/* =========================================================
   PISTAS
   ========================================================= */

const CLUES = [

    /* DESTINOS */

    {
        id: "dest_neon",
        type: "destination",
        value_associated: "neon",
        text_pista:
            "Se detectó una transferencia de créditos en una ciudad del sistema Vega.",
        witness_statement:
            "El tipo preguntó dónde podía comprar recuerdos que no fueran suyos.",
        riddle_text:
            "Buscá una ciudad donde el sol existe, pero nadie puede verlo desde la calle."
    },

    {
        id: "dest_cinder",
        type: "destination",
        value_associated: "cinder",
        text_pista:
            "Residuos industriales coinciden con aleaciones del Cinturón Ash.",
        witness_statement:
            "Olía a metal quemado. Dijo que necesitaba una fundición que no hiciera preguntas.",
        riddle_text:
            "Donde el cielo arde aunque ninguna estrella esté cerca."
    },

    {
        id: "dest_orpheus",
        type: "destination",
        value_associated: "orpheus",
        text_pista:
            "La ruta interceptada apunta hacia la Nebulosa Silente.",
        witness_statement:
            "Preguntó por hombres que guardan libros pero no usan terminales.",
        riddle_text:
            "Buscá conocimiento donde las máquinas deben permanecer en silencio."
    },

    {
        id: "dest_frost",
        type: "destination",
        value_associated: "frost",
        text_pista:
            "El objetivo adquirió protección térmica extrema.",
        witness_statement:
            "Compró suficiente calefacción para sobrevivir una noche de ciento veinte días.",
        riddle_text:
            "La noche es larga y el mundo duerme bajo hielo."
    },

    {
        id: "dest_helix",
        type: "destination",
        value_associated: "helix",
        text_pista:
            "Una identidad corporativa falsa fue creada hace seis horas.",
        witness_statement:
            "Traje caro. Nombre falso. Hablaba como si cada palabra tuviera abogado.",
        riddle_text:
            "Siete compañías poseen el suelo bajo tus pies."
    },

    {
        id: "dest_grave",
        type: "destination",
        value_associated: "grave",
        text_pista:
            "La baliza del objetivo desapareció cerca del Sector Muerto.",
        witness_statement:
            "Buscaba un lugar donde una nave muerta pudiera esconder otra nave viva.",
        riddle_text:
            "Miles de cadáveres de metal orbitan una estrella sin luz."
    },

    {
        id: "dest_sundown",
        type: "destination",
        value_associated: "sundown",
        text_pista:
            "Se compraron municiones antiguas y combustible de baja pureza.",
        witness_statement:
            "Dijo que extrañaba los lugares donde una deuda todavía podía resolverse al mediodía.",
        riddle_text:
            "Cuando cae el sol, todos miran primero las manos del otro."
    },

    {
        id: "dest_redemption",
        type: "destination",
        value_associated: "redemption",
        text_pista:
            "Un antiguo código penitenciario apareció en una transmisión.",
        witness_statement:
            "Preguntó por una prisión donde los presos terminaron siendo los dueños.",
        riddle_text:
            "Las puertas siguen cerradas. Ahora es para mantener al gobierno afuera."
    },

    {
        id: "dest_blackreef",
        type: "destination",
        value_associated: "blackreef",
        text_pista:
            "Una señal pirata fue detectada dentro del Mar de Gas Nox.",
        witness_statement:
            "Quería un puerto sin marshal, sin aduana y sin memoria.",
        riddle_text:
            "Una tormenta esconde un barco que ya no puede navegar."
    },

    {
        id: "dest_eidolon",
        type: "destination",
        value_associated: "eidolon",
        text_pista:
            "El objetivo compró mapas arqueológicos de origen restringido.",
        witness_statement:
            "Hablaba de una ciudad donde las paredes observan.",
        riddle_text:
            "Sus constructores desaparecieron antes de que nuestra especie mirara las estrellas."
    },

    {
        id: "dest_eden",
        type: "destination",
        value_associated: "eden",
        text_pista:
            "Una cuenta anónima contrató servicios de reconstrucción facial.",
        witness_statement:
            "Preguntó cuánto costaba morir legalmente y seguir respirando.",
        riddle_text:
            "El paraíso tiene playa. La privacidad se cobra por hora."
    },

    {
        id: "dest_academia",
        type: "destination",
        value_associated: "dustfall",
        text_pista:
            "La trayectoria parece cerrar el circuito de la Frontera.",
        witness_statement:
            "Dijo que quería volver al lugar donde todo empezó.",
        riddle_text:
            "Polvo rojo. Minas vacías. Viejos pecados."
    },


    /* IDENTIDAD: ESPECIE */

    {
        id: "id_especie_humano",
        type: "identity",
        value_associated: {
            property: "especie",
            value: "Humano"
        },
        text_pista:
            "La muestra biológica pertenece a un humano.",
        witness_statement:
            "Sangró. Sangre roja. Nada sintético."
    },

    {
        id: "id_especie_sintetico",
        type: "identity",
        value_associated: {
            property: "especie",
            value: "Sintético"
        },
        text_pista:
            "Se recuperaron residuos de fluido dieléctrico.",
        witness_statement:
            "Parpadeaba demasiado perfecto. Eso nunca es buena señal."
    },

    {
        id: "id_especie_velari",
        type: "identity",
        value_associated: {
            property: "especie",
            value: "Velari"
        },
        text_pista:
            "El análisis celular presenta marcadores Velari.",
        witness_statement:
            "Los ojos reflejaban la luz violeta. Velari. Seguro."
    },


    /* IMPLANTES */

    {
        id: "id_implante_cromo",
        type: "identity",
        value_associated: {
            property: "implante",
            value: "Cromo"
        },
        text_pista:
            "Se detectó abrasión metálica de una prótesis cromada.",
        witness_statement:
            "Una mano brilló cuando levantó el vaso."
    },

    {
        id: "id_implante_optico",
        type: "identity",
        value_associated: {
            property: "implante",
            value: "Óptico"
        },
        text_pista:
            "Una cámara registró interferencia causada por óptica aumentada.",
        witness_statement:
            "Uno de sus ojos ajustó el foco. Lo vi."
    },

    {
        id: "id_implante_neural",
        type: "identity",
        value_associated: {
            property: "implante",
            value: "Neural"
        },
        text_pista:
            "La señal contiene pulsos de sincronización neural.",
        witness_statement:
            "Se quedó quieto dos segundos. Como si estuviera descargando un pensamiento."
    },

    {
        id: "id_implante_termico",
        type: "identity",
        value_associated: {
            property: "implante",
            value: "Térmico"
        },
        text_pista:
            "El escáner detectó regulación térmica artificial.",
        witness_statement:
            "Hacía veinte bajo cero y no llevaba abrigo."
    },


    /* ARMAS */

    {
        id: "id_arma_revolver",
        type: "identity",
        value_associated: {
            property: "arma",
            value: "Revolver"
        },
        text_pista:
            "Se encontró un casquillo de munición balística artesanal.",
        witness_statement:
            "Arma vieja. Cilindro. Seis tiros."
    },

    {
        id: "id_arma_plasma",
        type: "identity",
        value_associated: {
            property: "arma",
            value: "Plasma"
        },
        text_pista:
            "La pared presenta vitrificación por plasma.",
        witness_statement:
            "No escuché disparo. Sólo vi la pared derretirse."
    },

    {
        id: "id_arma_rifle",
        type: "identity",
        value_associated: {
            property: "arma",
            value: "Rifle"
        },
        text_pista:
            "La trayectoria indica un arma larga estabilizada.",
        witness_statement:
            "Llevaba algo largo envuelto bajo el abrigo."
    },

    {
        id: "id_arma_hoja",
        type: "identity",
        value_associated: {
            property: "arma",
            value: "Hoja"
        },
        text_pista:
            "Los cortes fueron realizados con una hoja monomolecular.",
        witness_statement:
            "No sacó un arma. Sacó una línea de luz."
    },


    /* NAVES */

    {
        id: "id_nave_courier",
        type: "identity",
        value_associated: {
            property: "nave",
            value: "Courier"
        },
        text_pista:
            "La firma del motor coincide con una nave Courier.",
        witness_statement:
            "Pequeña. Rápida. Motor nervioso."
    },

    {
        id: "id_nave_interceptor",
        type: "identity",
        value_associated: {
            property: "nave",
            value: "Interceptor"
        },
        text_pista:
            "La aceleración registrada corresponde a un interceptor.",
        witness_statement:
            "Despegó como si el planeta la hubiera insultado."
    },

    {
        id: "id_nave_freighter",
        type: "identity",
        value_associated: {
            property: "nave",
            value: "Freighter"
        },
        text_pista:
            "Los sensores detectaron una firma de carguero pesado.",
        witness_statement:
            "Un monstruo lento. Podías escuchar los motores desde el bar."
    },

    {
        id: "id_nave_sloop",
        type: "identity",
        value_associated: {
            property: "nave",
            value: "Sloop"
        },
        text_pista:
            "La trayectoria coincide con una balandra estelar modificada.",
        witness_statement:
            "Parecía una aguja negra."
    },

    {
        id: "id_nave_yacht",
        type: "identity",
        value_associated: {
            property: "nave",
            value: "Yacht"
        },
        text_pista:
            "Se registró una nave recreativa con identificación falsa.",
        witness_statement:
            "Demasiado elegante para este puerto."
    }
];


/* =========================================================
   CONTRATOS
   ========================================================= */

const CASES = [

    {
        id: "contrato001",
        titulo: "POLVO Y SEIS BALAS",
        objeto_robado: "NÚCLEO DE IRIDIO K-12",
        ciudad_inicial_id: "dustfall",
        ladrón_asignado_id: "silas_vane",
        ruta_escape: [
            "dustfall",
            "neon",
            "orpheus",
            "frost",
            "grave"
        ],
        nivelRequerido: 1,
        recompensa: 3200,
        dificultad: 1
    },

    {
        id: "contrato002",
        titulo: "FANTASMAS DE SILICIO",
        objeto_robado: "MATRIZ DE CONCIENCIA AION",
        ciudad_inicial_id: "neon",
        ladrón_asignado_id: "kira_nueve",
        ruta_escape: [
            "neon",
            "helix",
            "grave",
            "blackreef",
            "eidolon"
        ],
        nivelRequerido: 1,
        recompensa: 7800,
        dificultad: 3
    },

    {
        id: "contrato003",
        titulo: "LA ÚLTIMA MANO",
        objeto_robado: "BONOS DE HELIX // SERIE NEGRA",
        ciudad_inicial_id: "helix",
        ladrón_asignado_id: "cassian_rook",
        ruta_escape: [
            "helix",
            "sundown",
            "redemption",
            "blackreef",
            "eden"
        ],
        nivelRequerido: 2,
        recompensa: 5400,
        dificultad: 2
    },

    {
        id: "contrato004",
        titulo: "LA VIUDA DEL VACÍO",
        objeto_robado: "RELICARIO DE ORPHEUS",
        ciudad_inicial_id: "orpheus",
        ladrón_asignado_id: "vesper_morne",
        ruta_escape: [
            "orpheus",
            "frost",
            "grave",
            "eidolon",
            "eden"
        ],
        nivelRequerido: 3,
        recompensa: 12000,
        dificultad: 4
    },

    {
        id: "contrato005",
        titulo: "HIERRO CALIENTE",
        objeto_robado: "PLANO DEL REACTOR ASH-9",
        ciudad_inicial_id: "cinder",
        ladrón_asignado_id: "brakk",
        ruta_escape: [
            "cinder",
            "neon",
            "helix",
            "sundown",
            "redemption"
        ],
        nivelRequerido: 3,
        recompensa: 6100,
        dificultad: 2
    },

    {
        id: "contrato006",
        titulo: "EL TAXIDERMISTA",
        objeto_robado: "GENOMA DE LA BALLENA DE TITÁN",
        ciudad_inicial_id: "frost",
        ladrón_asignado_id: "morrow",
        ruta_escape: [
            "frost",
            "helix",
            "grave",
            "eidolon",
            "blackreef"
        ],
        nivelRequerido: 5,
        recompensa: 14500,
        dificultad: 5
    },

    {
        id: "contrato007",
        titulo: "PROTOCOLO NYX",
        objeto_robado: "ARCHIVO NEGRO STARHOUND",
        ciudad_inicial_id: "neon",
        ladrón_asignado_id: "nyx",
        ruta_escape: [
            "neon",
            "orpheus",
            "grave",
            "redemption",
            "eidolon"
        ],
        nivelRequerido: 7,
        recompensa: 18000,
        dificultad: 5
    },

    {
        id: "contrato008",
        titulo: "LOS MUERTOS NO PAGAN",
        objeto_robado: "TRANSPONDEDOR DE FLOTA FEDERAL",
        ciudad_inicial_id: "grave",
        ladrón_asignado_id: "hollis",
        ruta_escape: [
            "grave",
            "cinder",
            "sundown",
            "redemption",
            "blackreef"
        ],
        nivelRequerido: 4,
        recompensa: 8900,
        dificultad: 3
    },

    {
        id: "contrato009",
        titulo: "NINGÚN HOMBRE",
        objeto_robado: "SEMILLA DE IA OMEGA",
        ciudad_inicial_id: "helix",
        ladrón_asignado_id: "zero",
        ruta_escape: [
            "helix",
            "neon",
            "grave",
            "eidolon",
            "eden"
        ],
        nivelRequerido: 8,
        recompensa: 21000,
        dificultad: 5
    },

    {
        id: "contrato010",
        titulo: "MAPA PARA NINGUNA PARTE",
        objeto_robado: "CARTA ESTELAR PRE-FEDERACIÓN",
        ciudad_inicial_id: "orpheus",
        ladrón_asignado_id: "mara_quell",
        ruta_escape: [
            "orpheus",
            "dustfall",
            "cinder",
            "frost",
            "eidolon"
        ],
        nivelRequerido: 4,
        recompensa: 6800,
        dificultad: 3
    },

    {
        id: "contrato011",
        titulo: "CENIZA A CENIZA",
        objeto_robado: "CÓDICE DEL PRIMER SOL",
        ciudad_inicial_id: "cinder",
        ladrón_asignado_id: "father_ash",
        ruta_escape: [
            "cinder",
            "orpheus",
            "sundown",
            "redemption",
            "eidolon"
        ],
        nivelRequerido: 6,
        recompensa: 10500,
        dificultad: 4
    },

    {
        id: "contrato012",
        titulo: "SEIS ROJO",
        objeto_robado: "MOTOR EXPERIMENTAL VANTA",
        ciudad_inicial_id: "neon",
        ladrón_asignado_id: "ruby_hex",
        ruta_escape: [
            "neon",
            "cinder",
            "frost",
            "sundown",
            "blackreef"
        ],
        nivelRequerido: 5,
        recompensa: 9300,
        dificultad: 4
    },

    {
        id: "contrato013",
        titulo: "EL MARSHAL MUERTO",
        objeto_robado: "LISTA DE TESTIGOS FEDERALES",
        ciudad_inicial_id: "sundown",
        ladrón_asignado_id: "jonah_black",
        ruta_escape: [
            "sundown",
            "dustfall",
            "redemption",
            "blackreef",
            "eden"
        ],
        nivelRequerido: 9,
        recompensa: 16500,
        dificultad: 5
    },

    {
        id: "contrato014",
        titulo: "TODO LO QUE VIO IRIS",
        objeto_robado: "MEMORIA SINTÉTICA IRIS-01",
        ciudad_inicial_id: "helix",
        ladrón_asignado_id: "iris",
        ruta_escape: [
            "helix",
            "neon",
            "orpheus",
            "frost",
            "grave"
        ],
        nivelRequerido: 3,
        recompensa: 4500,
        dificultad: 2
    },

    {
        id: "contrato015",
        titulo: "EL PERRO DE SUNDOWN",
        objeto_robado: "INSIGNIA DEL PRIMER MARSHAL",
        ciudad_inicial_id: "sundown",
        ladrón_asignado_id: "dante_scar",
        ruta_escape: [
            "sundown",
            "redemption",
            "grave",
            "blackreef",
            "eidolon"
        ],
        nivelRequerido: 10,
        recompensa: 19800,
        dificultad: 5
    }
];


/* =========================================================
   ACERTIJOS
   ========================================================= */

const ACERTIJOS = [
    {
        pregunta:
            "Tengo ciudades sin gente, rutas sin naves y fronteras sin soldados. ¿Qué soy?",
        respuestas: [
            "Un mapa",
            "Una prisión",
            "Una memoria",
            "Un planeta"
        ],
        correcta: 0
    },

    {
        pregunta:
            "Cuanto más de mí eliminás, más grande me vuelvo.",
        respuestas: [
            "Una deuda",
            "Un agujero",
            "Una sombra",
            "El tiempo"
        ],
        correcta: 1
    },

    {
        pregunta:
            "Un carguero tarda 3 horas por salto. Realiza 4 saltos y pierde 2 horas reparando motores. ¿Cuántas horas pasan?",
        respuestas: [
            "10",
            "12",
            "14",
            "16"
        ],
        correcta: 2
    },

    {
        pregunta:
            "Una baliza transmite cada 6 minutos y otra cada 8. Si transmiten juntas ahora, ¿en cuántos minutos coinciden?",
        respuestas: [
            "12",
            "18",
            "24",
            "48"
        ],
        correcta: 2
    },

    {
        pregunta:
            "Tres sospechosos dicen: A acusa a B. B acusa a C. C dice que B miente. Si sólo uno dice la verdad, ¿quién es culpable?",
        respuestas: [
            "A",
            "B",
            "C",
            "No puede determinarse"
        ],
        correcta: 2
    },

    {
        pregunta:
            "Serie de acceso: 2, 6, 12, 20, 30...",
        respuestas: [
            "36",
            "40",
            "42",
            "44"
        ],
        correcta: 2
    },

    {
        pregunta:
            "Una nave consume 8 celdas por 200 parsecs. ¿Cuántas necesita para recorrer 750 parsecs?",
        respuestas: [
            "24",
            "28",
            "30",
            "32"
        ],
        correcta: 2
    },

    {
        pregunta:
            "Código detectado: 1, 1, 2, 3, 5, 8...",
        respuestas: [
            "10",
            "11",
            "12",
            "13"
        ],
        correcta: 3
    },

    {
        pregunta:
            "Dos puertas. Un guardia siempre miente y otro siempre dice la verdad. Sólo podés hacer una pregunta. ¿Qué preguntás?",
        respuestas: [
            "¿Sos el mentiroso?",
            "¿Qué puerta elegiría el otro?",
            "¿Esta puerta es segura?",
            "¿Quién construyó las puertas?"
        ],
        correcta: 1
    },

    {
        pregunta:
            "Si STAR = 58 usando la suma de posiciones del alfabeto, ¿cuánto vale DOG?",
        respuestas: [
            "24",
            "25",
            "26",
            "27"
        ],
        correcta: 2
    }
];


/* =========================================================
   FRASES DE SISTEMA
   ========================================================= */

const MENSAJES_SISTEMA = {
    acceso: [
        "VERIFICANDO LICENCIA DE CAZA...",
        "SINCRONIZANDO BALIZA STARHOUND...",
        "CARGANDO ARCHIVO DE RECOMPENSAS...",
        "COMPROBANDO ARMAMENTO DECLARADO..."
    ],

    viaje: [
        "CALCULANDO SALTO...",
        "PURGANDO CÁMARA DE COMBUSTIÓN...",
        "ALINEANDO NÚCLEO DE NAVEGACIÓN...",
        "ENTRANDO EN CORREDOR DE TRÁNSITO..."
    ],

    pista: [
        "PATRÓN DETECTADO.",
        "ARCHIVO ACTUALIZADO.",
        "NUEVA COINCIDENCIA.",
        "INTELIGENCIA RECUPERADA."
    ],

    fallo: [
        "LA FRONTERA COBRA CADA ERROR.",
        "TIEMPO PERDIDO.",
        "EL OBJETIVO SIGUE MOVIÉNDOSE.",
        "MALA LECTURA, CAZADOR."
    ]
};