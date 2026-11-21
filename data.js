// =============================================================
// DecideU – Datos del prototipo
// IMPORTANTE: los costos, programas y apoyos son DATOS DE DEMOSTRACIÓN.
// Antes de usar la app con usuarios reales hay que verificarlos en la
// página oficial de cada institución.
// =============================================================

// Áreas del perfil vocacional (basadas en el modelo RIASEC de Holland)
const AREAS = {
  R: { name: "Práctico / Técnico", desc: "te gusta construir, reparar y trabajar con herramientas o máquinas" },
  I: { name: "Investigador", desc: "disfrutas analizar, resolver problemas y entender cómo funcionan las cosas" },
  A: { name: "Creativo", desc: "te expresas con el diseño, el arte, la música o las ideas nuevas" },
  S: { name: "Social", desc: "te motiva ayudar, enseñar y trabajar con personas" },
  E: { name: "Emprendedor", desc: "te gusta liderar, convencer y crear proyectos o negocios" },
  C: { name: "Organizado", desc: "eres ordenado, te gustan los datos, los números y los procesos claros" }
};

// Preguntas del test: cada una suma puntos a un área
const QUESTIONS = [
  { text: "¿Te gusta armar, reparar o entender cómo funcionan los aparatos?", area: "R" },
  { text: "¿Te gustaría trabajar al aire libre, con la naturaleza o con animales?", area: "R" },
  { text: "¿Disfrutas resolver problemas de matemáticas o de lógica?", area: "I" },
  { text: "¿Te da curiosidad investigar temas de ciencia, salud o tecnología?", area: "I" },
  { text: "¿Te gusta dibujar, diseñar, hacer videos o crear cosas nuevas?", area: "A" },
  { text: "¿Te gusta expresar ideas con la música, la escritura o el arte?", area: "A" },
  { text: "¿Te sientes bien ayudando a otras personas con sus problemas?", area: "S" },
  { text: "¿Te gustaría enseñar o explicarle cosas a otras personas?", area: "S" },
  { text: "¿Te gusta liderar grupos y tomar decisiones?", area: "E" },
  { text: "¿Te imaginas creando tu propio negocio o emprendimiento?", area: "E" },
  { text: "¿Te gusta organizar información, datos o presupuestos?", area: "C" },
  { text: "¿Prefieres seguir pasos claros y hacer las cosas con orden?", area: "C" }
];

const ANSWERS = [
  { label: "Me encanta", value: 4 },
  { label: "Me gusta", value: 3 },
  { label: "Más o menos", value: 2 },
  { label: "No mucho", value: 1 },
  { label: "Nada", value: 0 }
];

// Carreras: el perfil indica cuánto pesa cada área (0 a 1)
const CAREERS = [
  { id: "sistemas", name: "Ingeniería de Sistemas", profile: { I: 1, C: .7, R: .5, E: .3 }, desc: "Desarrollo de software, apps, redes y datos.", tags: ["Programación", "Tecnología", "Alta demanda"] },
  { id: "industrial", name: "Ingeniería Industrial", profile: { C: 1, E: .8, I: .7 }, desc: "Mejorar procesos, producción y logística de las empresas.", tags: ["Procesos", "Gestión", "Empresas"] },
  { id: "civil", name: "Ingeniería Civil", profile: { R: 1, I: .8, C: .5 }, desc: "Diseño y construcción de vías, puentes y edificios.", tags: ["Construcción", "Obras", "Cálculo"] },
  { id: "mecatronica", name: "Ingeniería Mecatrónica", profile: { R: 1, I: .9, A: .2 }, desc: "Robots, máquinas automáticas y electrónica.", tags: ["Robótica", "Electrónica", "Automatización"] },
  { id: "medicina", name: "Medicina", profile: { I: 1, S: .9 }, desc: "Prevenir, diagnosticar y tratar enfermedades.", tags: ["Salud", "Ciencia", "Servicio"] },
  { id: "enfermeria", name: "Enfermería", profile: { S: 1, I: .5, C: .4 }, desc: "Cuidado de pacientes y promoción de la salud.", tags: ["Salud", "Cuidado", "Personas"] },
  { id: "psicologia", name: "Psicología", profile: { S: 1, I: .7, A: .3 }, desc: "Entender la mente y el comportamiento para ayudar a otros.", tags: ["Personas", "Bienestar", "Investigación"] },
  { id: "licenciatura", name: "Licenciatura en Educación", profile: { S: 1, A: .5, C: .3 }, desc: "Formar a niños y jóvenes como docente.", tags: ["Enseñanza", "Personas", "Impacto social"] },
  { id: "diseno", name: "Diseño Gráfico", profile: { A: 1, E: .3, R: .2 }, desc: "Comunicar ideas con imágenes, marcas y contenido digital.", tags: ["Creatividad", "Digital", "Marcas"] },
  { id: "arquitectura", name: "Arquitectura", profile: { A: 1, R: .7, I: .4 }, desc: "Diseñar espacios y edificios funcionales y bonitos.", tags: ["Diseño", "Espacios", "Construcción"] },
  { id: "comunicacion", name: "Comunicación Social y Periodismo", profile: { A: .9, S: .8, E: .5 }, desc: "Contar historias en medios, redes y organizaciones.", tags: ["Medios", "Redes", "Escritura"] },
  { id: "administracion", name: "Administración de Empresas", profile: { E: 1, C: .8, S: .3 }, desc: "Dirigir equipos, finanzas y estrategias de negocio.", tags: ["Negocios", "Liderazgo", "Gestión"] },
  { id: "contaduria", name: "Contaduría Pública", profile: { C: 1, E: .4, I: .3 }, desc: "Manejo de cuentas, impuestos y finanzas.", tags: ["Números", "Finanzas", "Orden"] },
  { id: "marketing", name: "Mercadeo y Publicidad", profile: { E: 1, A: .8, S: .4 }, desc: "Crear campañas y estrategias para vender productos.", tags: ["Creatividad", "Ventas", "Digital"] },
  { id: "derecho", name: "Derecho", profile: { E: .9, S: .7, C: .6, I: .4 }, desc: "Defender derechos y asesorar en temas legales.", tags: ["Leyes", "Argumentación", "Justicia"] },
  { id: "agronomia", name: "Ingeniería Agronómica", profile: { R: 1, I: .6, S: .2 }, desc: "Producción agrícola sostenible y cuidado del campo.", tags: ["Campo", "Naturaleza", "Sostenibilidad"] },
  { id: "deporte", name: "Ciencias del Deporte", profile: { S: .8, R: .8, E: .3 }, desc: "Entrenamiento, actividad física y salud.", tags: ["Deporte", "Salud", "Personas"] }
];

// Municipios para elegir la ubicación (coordenadas aproximadas)
const TOWNS = [
  { name: "Tocancipá", lat: 4.9653, lng: -73.9124 },
  { name: "Gachancipá", lat: 4.9915, lng: -73.8722 },
  { name: "Zipaquirá", lat: 5.0221, lng: -73.9950 },
  { name: "Cajicá", lat: 4.9186, lng: -74.0276 },
  { name: "Chía", lat: 4.8633, lng: -74.0583 },
  { name: "Sopó", lat: 4.9077, lng: -73.9396 },
  { name: "Bogotá (norte)", lat: 4.7300, lng: -74.0450 },
  { name: "Bogotá (centro)", lat: 4.6097, lng: -74.0817 }
];

// Universidades (ubicación aproximada). Programas y costos = DEMO.
const UNIVERSITIES = [
  { name: "Universidad de La Sabana", town: "Chía", type: "Privada", lat: 4.8612, lng: -74.0325,
    web: "https://www.unisabana.edu.co", programs: { sistemas: 10500000, industrial: 10500000, medicina: 19800000, enfermeria: 9200000, psicologia: 9800000, comunicacion: 9900000, administracion: 9900000, derecho: 10900000, licenciatura: 6500000, marketing: 9900000 } },
  { name: "Universidad Militar Nueva Granada – Campus Cajicá", town: "Cajicá", type: "Pública", lat: 4.9440, lng: -74.0112,
    web: "https://www.umng.edu.co", programs: { sistemas: 4300000, industrial: 4300000, civil: 4300000, mecatronica: 4300000, administracion: 3900000, contaduria: 3900000, derecho: 4100000, medicina: 9500000 } },
  { name: "Universidad de Cundinamarca – Extensión Zipaquirá", town: "Zipaquirá", type: "Pública", lat: 5.0270, lng: -74.0010,
    web: "https://www.ucundinamarca.edu.co", programs: { sistemas: 1900000, administracion: 1700000, contaduria: 1700000, agronomia: 1900000 } },
  { name: "Universidad de Cundinamarca – Extensión Chía", town: "Chía", type: "Pública", lat: 4.8700, lng: -74.0560,
    web: "https://www.ucundinamarca.edu.co", programs: { sistemas: 1900000, deporte: 1800000, contaduria: 1700000 } },
  { name: "Uniminuto – Centro Regional Zipaquirá", town: "Zipaquirá", type: "Privada", lat: 5.0190, lng: -73.9920,
    web: "https://www.uniminuto.edu", programs: { administracion: 2600000, contaduria: 2600000, psicologia: 3100000, licenciatura: 2300000, comunicacion: 2800000, sistemas: 2900000 } },
  { name: "UNICOC – Bogotá", town: "Bogotá (norte)", type: "Privada", lat: 4.7450, lng: -74.0460,
    web: "https://www.unicoc.edu.co", programs: { sistemas: 5200000, diseno: 5000000, administracion: 4800000, derecho: 5300000 } },
  { name: "Universidad Nacional de Colombia – Bogotá", town: "Bogotá (centro)", type: "Pública", lat: 4.6381, lng: -74.0840,
    web: "https://unal.edu.co", programs: { sistemas: 900000, industrial: 900000, civil: 900000, mecatronica: 900000, medicina: 900000, enfermeria: 900000, psicologia: 900000, diseno: 900000, arquitectura: 900000, derecho: 900000, contaduria: 900000, agronomia: 900000, administracion: 900000 } },
  { name: "Universidad Pedagógica Nacional", town: "Bogotá (centro)", type: "Pública", lat: 4.6560, lng: -74.0620,
    web: "https://www.pedagogica.edu.co", programs: { licenciatura: 800000, deporte: 800000, diseno: 800000 } },
  { name: "Universidad Manuela Beltrán – Cajicá", town: "Cajicá", type: "Privada", lat: 4.9230, lng: -74.0300,
    web: "https://umb.edu.co", programs: { psicologia: 4200000, enfermeria: 4500000, marketing: 3900000, deporte: 3800000, diseno: 4000000 } },
  { name: "Universidad Jorge Tadeo Lozano – Bogotá", town: "Bogotá (centro)", type: "Privada", lat: 4.6020, lng: -74.0660,
    web: "https://www.utadeo.edu.co", programs: { diseno: 8900000, arquitectura: 9300000, marketing: 8700000, comunicacion: 8600000, agronomia: 8200000 } }
];

// Becas, descuentos y apoyos (DEMO – verificar condiciones reales)
const SUPPORTS = [
  { name: "Crédito educativo ICETEX", scope: "Nacional", applies: "all",
    detail: "Crédito para pagar la matrícula, con opciones de pago durante y después de la carrera.", saving: "Hasta el 100 % de la matrícula financiado" },
  { name: "Gratuidad en la matrícula (universidades públicas)", scope: "Nacional", applies: "Pública",
    detail: "Estudiantes de estratos bajos pueden no pagar matrícula en instituciones públicas, según las condiciones vigentes.", saving: "Hasta el 100 % de la matrícula" },
  { name: "Beca por excelencia académica", scope: "Institucional", applies: "all",
    detail: "Para estudiantes con buen puntaje en las pruebas Saber 11.", saving: "Descuento de 20 % a 50 % (según la institución)" },
  { name: "Descuento por convenio con tu municipio", scope: "Local", applies: "local",
    detail: "Algunas alcaldías tienen convenios con universidades de la región para sus habitantes.", saving: "Descuento de 10 % a 30 % (según convenio)" },
  { name: "Descuento por hermanos o pago de contado", scope: "Institucional", applies: "Privada",
    detail: "Muchas universidades privadas dan descuento si pagas el semestre completo o si tienes un hermano estudiando ahí.", saving: "Descuento de 5 % a 15 %" }
];
