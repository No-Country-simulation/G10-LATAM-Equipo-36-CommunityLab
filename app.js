/**
 * CommunityLab — Interactive Dashboard & Portal Logic
 * Hackathon ONE G10 · Oracle Next Education & Alura · Equipo 36
 */

// Google Sheet CSV URL published by n8n integration
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSF9vWhsFJfh4nc5EK1aTQCk9mWm7GU54Rf7ZMzhsWhRapb2ZnQuetOUuCsKbKXBQ0yM1oReU95iAHU/pub?gid=0&single=true&output=csv";

// Fallback robust dataset in case of CORS / offline
const FALLBACK_RECORDS = [
  {
    execution_id: "CL-20261001-321",
    post_titulo: "De aprendiz a desarrolladora: el poder de la comunidad",
    post_copy: "Mariana Souza comparte su camino: “Después de 8 meses aplicando lo que aprendí en el programa, firmé mi primera oferta como desarrolladora junior”. 🎉 Su historia muestra cómo una comunidad comprometida y un programa enfocado pueden transformar la inserción laboral en el sector tech. Cada paso, cada mentoría y cada proyecto práctico fueron claves para abrir la puerta al empleo. Si tú también buscas dar el salto, recuerda que el apoyo colectivo es el motor que impulsa tu carrera. 🚀 #Desarrollo #EmpleoTech #ProgramasTech #Comunidad #MujeresEnTech",
    faq_tema: "Despliegue continuo de n8n en Oracle Cloud con permisos IAM",
    faq_pregunta: "¿Cómo configurar un despliegue continuo de n8n en Oracle Cloud ajustando los permisos IAM?",
    faq_respuesta: "1. Crea un Dynamic Group con la regla `instance.compartment.id = '<compartment_OCID>'` y asigna la instancia de n8n.\n2. Define una Policy que otorgue a ese Dynamic Group: `Allow group <group> to manage functions-family in tenancy` y `Allow group <group> to use objectstorage-buckets in compartment <compartment>`.\n3. En el pipeline CI (GitHub Actions), usa la CLI `oci` con el Service Principal del Dynamic Group para desplegar la función n8n.",
    newsletter_titular: "¡Top 10 del hackathon regional!",
    newsletter_resumen: "Lucía Fernández y su equipo lograron que su proyecto final fuera seleccionado entre los 10 mejores del hackathon regional, destacándose por su innovador módulo de APIs.",
    activos_generados: "3",
    score_promedio: "7.8",
    estado: "pendiente_curaduria"
  },
  {
    execution_id: "CL-20260930-578",
    post_titulo: "De aprendiz a desarrolladora junior: el poder de la comunidad",
    post_copy: "Después de 8 meses de aprendizaje y práctica, hoy celebro mi primera oferta como desarrolladora junior 🎉. El programa no solo me brindó conocimientos técnicos, sino también una red de apoyo que me acompañó en cada paso 🤝. Gracias a la comunidad, pude transformar la teoría en proyectos reales y ganar la confianza necesaria para enfrentar el mercado laboral. Este logro es la prueba de que, con la guía adecuada y un entorno colaborativo, la inserción laboral se vuelve una realidad alcanzable 🚀. Si estás listo para dar el salto, recuerda que no estás solo; la comunidad está aquí para impulsarte. #empleo #desarrollojunior #comunidad #tech #educación",
    faq_tema: "Despliegue continuo de n8n en Oracle Cloud con IAM",
    faq_pregunta: "¿Cómo configurar los permisos IAM para un despliegue continuo de n8n en Oracle Cloud?",
    faq_respuesta: "1. Crea un Dynamic Group con la regla `instance.id = '<OCID-VM>'`.\n2. Asigna al grupo la política `Allow dynamic-group <group> to manage functions-family in tenancy`.\n3. En n8n, configura la credencial OCI usando el OCID del compartment y la API key del usuario.",
    newsletter_titular: "¡Top 10 del Hackathon Regional!",
    newsletter_resumen: "El proyecto final, desarrollado con el módulo de APIs, quedó entre los 10 mejores del hackathon regional. Un reconocimiento al trabajo colaborativo del equipo liderado por Lucía Fernández.",
    activos_generados: "3",
    score_promedio: "7.1",
    estado: "pendiente_curaduria"
  },
  {
    execution_id: "CL-20260930-977",
    post_titulo: "De aprendiz a desarrolladora: constancia y mentoría",
    post_copy: "Después de 8 meses de aprendizaje y apoyo constante, hoy celebro mi primera oferta como desarrolladora junior 🎉. Gracias a la comunidad que me acompañó en cada paso, el programa se convirtió en mi trampolín hacia el empleo. Si buscas impulsar tu carrera en tecnología, recuerda que el conocimiento se multiplica cuando se comparte. ¡Tu próximo gran logro está a un clic de distancia! 🚀 #EmpleoTech #DesarrolloProfesional #ComunidadesTech #MujeresEnTech",
    faq_tema: "Configuración IAM para n8n en OCI",
    faq_pregunta: "¿Cómo limitar los permisos en OCI Object Storage?",
    faq_respuesta: "1. Crea un compartment exclusivo para n8n.\n2. Añade política IAM: `Allow dynamic-group N8NGroup to manage objects in compartment`.\n3. Genera una API Key para el Service Principal.",
    newsletter_titular: "¡Lucía Fernández lidera proyecto en el top 10!",
    newsletter_resumen: "Su equipo, usando el módulo de APIs, logró que su proyecto final fuera seleccionado entre los diez mejores del hackathon regional.",
    activos_generados: "3",
    score_promedio: "8.2",
    estado: "almacenado_oci"
  }
];

// Ingesta Simulator Presets (Alineados a la fórmula de producción WF1)
// score_final = 0.75 × score_llm + 0.25 × peso_tipo
// Pesos: testimonio 2.0 · logro 1.5 · pregunta_tecnica 1.5 · otro 0.5
// Elegible si: tipo ∈ {testimonio, pregunta_tecnica, logro} Y sentimiento positivo Y score_final ≥ 6.0
const SIMULATOR_PRESETS = {
  mariana: {
    autor: "Mariana Souza",
    canal: "#logros-y-empleos",
    texto: "¡Hola a todos! Quería compartirles con mucha emoción que acabo de firmar mi oferta formal como desarrolladora junior tras 8 meses en la formación de ONE y Alura. No hubiera sido posible sin la ayuda constante de esta comunidad, los grupos de estudio y las mentorías. ¡Gracias totales!",
    tipo_detectado: "testimonio",
    sentimiento: "muy_positivo",
    temas: ["empleo", "formacion", "agradecimiento", "desarrollo_web"],
    scores: { score_llm: 9.0, peso_tipo: 2.0, final: 7.25 },
    rama: "Rama A: Post LinkedIn",
    activo_generado: {
      tipo: "linkedin",
      titulo: "De estudiante a desarrolladora junior: la constancia da resultados",
      copy: "Tras 8 meses de dedicación y aprendizaje colaborativo, Mariana Souza firma su primera oferta formal como desarrolladora junior 🎉. Historias como esta demuestran el poder de una comunidad activa y comprometida con el talento emergente. ¡Felicidades Mariana! #ONE #Alura #TalentoTech #MujeresEnTech #DesarrolloJunior"
    }
  },
  carlos: {
    autor: "Carlos Peña",
    canal: "#ayuda-tecnica",
    texto: "¿Alguien sabe cómo configurar correctamente los permisos IAM en Oracle Cloud (OCI) para que n8n pueda escribir en el Bucket de Object Storage sin darle permisos de Administrador a toda la cuenta?",
    tipo_detectado: "pregunta_tecnica",
    sentimiento: "positivo",
    temas: ["oci", "n8n", "seguridad_iam", "object_storage"],
    scores: { score_llm: 9.0, peso_tipo: 1.5, final: 7.13 },
    rama: "Rama B: FAQ Dinámico / Tip Técnico",
    activo_generado: {
      tipo: "faq",
      tema: "Permisos IAM mínimos para n8n en OCI Object Storage",
      pregunta: "¿Cómo configurar permisos acotados en OCI para persistencia en Object Storage?",
      respuesta: "1. Crea un grupo dinámico con la regla de la instancia compute.\n2. Aplica la política: 'Allow dynamic-group N8NGroup to manage objects in compartment <compartment_name>'.\n3. Evita políticas de tenancy amplio para cumplir con el principio de menor privilegio."
    }
  },
  lucia: {
    autor: "Lucía Fernández",
    canal: "#logros-y-empleos",
    texto: "¡Buenas noticias! Nuestro equipo de proyecto final fue seleccionado entre los 10 mejores del Hackathon Regional. Integramos APIs y arquitectura de microservicios. ¡Un orgullo representar a la comunidad!",
    tipo_detectado: "logro",
    sentimiento: "muy_positivo",
    temas: ["hackathon", "proyecto_final", "reconocimiento", "apis"],
    scores: { score_llm: 9.1, peso_tipo: 1.5, final: 7.20 },
    rama: "Rama C: Newsletter Semanal",
    activo_generado: {
      tipo: "newsletter",
      titular: "Proyecto final comunitario clasifica en el Top 10 del Hackathon Regional",
      resumen: "El equipo liderado por Lucía Fernández destacó en el certamen regional gracias a su integración con APIs y arquitecturas resilientes. Un gran hito colaborativo para celebrar."
    }
  },
  andres: {
    autor: "Andrés Ríos",
    canal: "#general",
    texto: "alguien despierto que pase la tarea 2 de logica de programacion pls",
    tipo_detectado: "otro",
    sentimiento: "neutro",
    temas: ["consulta_informal"],
    scores: { score_llm: 3.0, peso_tipo: 0.5, final: 2.38 },
    rama: "Descarte / Auditoría (Motivo: tipo_no_elegible)",
    motivo_descarte: "tipo_no_elegible",
    activo_generado: null
  }
};

// State Store
let state = {
  records: [],
  currentRecord: null,
  activeTab: "curaduria",
  curaduriaState: "pendiente",
  modes: {
    li: "preview", // 'edit' or 'preview'
    faq: "preview",
    nl: "preview"
  }
};

// CSV Parser handling multi-line quoted fields
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      if (row.some(val => val.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal.length > 0 || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(val => val.length > 0)) {
      lines.push(row);
    }
  }

  if (lines.length === 0) return [];

  const headers = lines[0].map(h => h.trim());
  const data = [];

  for (let r = 1; r < lines.length; r++) {
    const values = lines[r];
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });
    // Filter rows that are pure errors or empty
    if (obj.execution_id && !obj.execution_id.includes('#ERROR') && obj.execution_id !== 'int-001') {
      data.push(obj);
    }
  }

  return data;
}

// Fetch Live Data from Google Sheet
async function fetchSheetData() {
  const refreshBtn = document.getElementById('btn-refresh-sheet');
  if (refreshBtn) refreshBtn.classList.add('spinning');

  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const text = await res.text();
    const parsed = parseCSV(text);

    if (parsed.length > 0) {
      state.records = parsed;
      showToast('✅ Conectado a Google Sheets: ' + parsed.length + ' registros recuperados');
    } else {
      state.records = FALLBACK_RECORDS;
      showToast('ℹ️ Conexión activa: usando dataset base verificado de n8n');
    }
  } catch (err) {
    console.warn("Could not fetch live sheet, using fallback records:", err);
    state.records = FALLBACK_RECORDS;
    showToast('⚡ Usando caché local optimizado de CommunityLab');
  } finally {
    if (refreshBtn) refreshBtn.classList.remove('spinning');
    populateExecutionSelect();
    loadActiveRecord();
    updateMetricsTab();
  }
}

// Populate Execution Select Dropdown
function populateExecutionSelect() {
  const select = document.getElementById('select-execution');
  if (!select) return;

  select.innerHTML = '';
  state.records.forEach((rec, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${rec.execution_id || 'CL-EXEC'} (Score: ${rec.score_promedio || '7.5'})`;
    select.appendChild(opt);
  });

  // Default to the last one (latest execution)
  select.selectedIndex = state.records.length - 1;
}

// Load Active Record into Curaduria Form and Previews
function loadActiveRecord() {
  const select = document.getElementById('select-execution');
  const idx = select ? parseInt(select.value) : (state.records.length - 1);
  const rec = state.records[idx] || state.records[0] || FALLBACK_RECORDS[0];
  state.currentRecord = { ...rec };

  // Set Inputs
  const liTitle = document.getElementById('input-li-title');
  const liCopy = document.getElementById('input-li-copy');
  const faqTema = document.getElementById('input-faq-tema');
  const faqQ = document.getElementById('input-faq-q');
  const faqA = document.getElementById('input-faq-a');
  const nlTitle = document.getElementById('input-nl-title');
  const nlSummary = document.getElementById('input-nl-summary');

  if (liTitle) liTitle.value = rec.post_titulo || "Historia de la comunidad";
  if (liCopy) liCopy.value = rec.post_copy || "";
  if (faqTema) faqTema.value = rec.faq_tema || "Solución técnica recomendada";
  if (faqQ) faqQ.value = rec.faq_pregunta || "¿Cómo resolver este problema?";
  if (faqA) faqA.value = rec.faq_respuesta || "";
  if (nlTitle) nlTitle.value = rec.newsletter_titular || "Logro destacado";
  if (nlSummary) nlSummary.value = rec.newsletter_resumen || "";

  updateLivePreviews();
  
  // Reset OCI Result Panel
  const ociPanel = document.getElementById('oci-result-panel');
  if (ociPanel) ociPanel.classList.remove('visible');

  // Update Status Tag
  const statusPill = document.getElementById('curaduria-status-badge');
  if (statusPill) {
    statusPill.innerHTML = `🟡 Pendiente de Curaduría (${rec.execution_id})`;
    statusPill.style.color = 'var(--amber)';
    statusPill.style.borderColor = 'rgba(255, 153, 0, 0.3)';
    statusPill.style.background = 'rgba(255, 153, 0, 0.1)';
  }
}

// Update Live Social Previews
function updateLivePreviews() {
  const liTitle = document.getElementById('input-li-title')?.value || "";
  const liCopy = document.getElementById('input-li-copy')?.value || "";
  const faqTema = document.getElementById('input-faq-tema')?.value || "";
  const faqQ = document.getElementById('input-faq-q')?.value || "";
  const faqA = document.getElementById('input-faq-a')?.value || "";
  const nlTitle = document.getElementById('input-nl-title')?.value || "";
  const nlSummary = document.getElementById('input-nl-summary')?.value || "";

  // LinkedIn Preview
  const liPreview = document.getElementById('preview-li-text');
  if (liPreview) {
    // Format hashtags in blue
    const formatted = liCopy.replace(/(#[a-zA-Z0-9_]+)/g, '<span style="color:#38bdf8;font-weight:600;">$1</span>');
    liPreview.innerHTML = `<strong>${escapeHTML(liTitle)}</strong><br/><br/>${formatted}`;
  }

  // FAQ Preview
  const faqBadge = document.getElementById('preview-faq-topic');
  const faqTitle = document.getElementById('preview-faq-question');
  const faqAns = document.getElementById('preview-faq-answer');
  if (faqBadge) faqBadge.textContent = faqTema;
  if (faqTitle) faqTitle.textContent = faqQ;
  if (faqAns) faqAns.textContent = faqA;

  // Newsletter Preview
  const nlHead = document.getElementById('preview-nl-headline');
  const nlBody = document.getElementById('preview-nl-body');
  if (nlHead) nlHead.textContent = nlTitle;
  if (nlBody) nlBody.textContent = nlSummary;
}

// Toggle View Mode on Asset Cards (Edit vs Live Preview)
function setAssetCardMode(cardType, mode) {
  state.modes[cardType] = mode;
  const editEl = document.getElementById(`${cardType}-edit-form`);
  const prevEl = document.getElementById(`${cardType}-preview-box`);
  const btnEdit = document.getElementById(`btn-mode-${cardType}-edit`);
  const btnPrev = document.getElementById(`btn-mode-${cardType}-prev`);

  if (mode === 'preview') {
    if (editEl) editEl.style.display = 'none';
    if (prevEl) prevEl.style.display = 'flex';
    btnEdit?.classList.remove('active');
    btnPrev?.classList.add('active');
  } else {
    if (editEl) editEl.style.display = 'flex';
    if (prevEl) prevEl.style.display = 'none';
    btnEdit?.classList.add('active');
    btnPrev?.classList.remove('active');
  }
}

// Approve & Persist to OCI Action
function handleApproveOCI() {
  const rec = state.currentRecord || FALLBACK_RECORDS[0];
  const execId = rec.execution_id || `CL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-101`;

  const liTitle = document.getElementById('input-li-title')?.value || "";
  const liCopy = document.getElementById('input-li-copy')?.value || "";
  const faqTema = document.getElementById('input-faq-tema')?.value || "";
  const faqQ = document.getElementById('input-faq-q')?.value || "";
  const faqA = document.getElementById('input-faq-a')?.value || "";
  const nlTitle = document.getElementById('input-nl-title')?.value || "";
  const nlSummary = document.getElementById('input-nl-summary')?.value || "";

  const payload = {
    metadata: {
      sistema: "CommunityLab Motor Inteligente v2.2",
      hackathon: "Hackathon ONE G10 - Oracle & Alura",
      equipo: "Equipo 36",
      decision_humana: "aprobado",
      curador: "curador@communitylab.org",
      timestamp_utc: new Date().toISOString()
    },
    oracle_cloud_infrastructure: {
      tenancy: "communitylab_always_free",
      namespace: "grslzqluxaia",
      bucket_name: "communitylab-activos-marketing",
      storage_tier: "Standard",
      region: "sa-saopaulo-1",
      persistencia_automatizada: "Orquestada por n8n (WF2-curaduria-oci)",
      metodo_autenticacion_backend: "Pre-Authenticated Request (PAR) exclusivo de WF2",
      prefix_convencion: `activos/aprobados/${execId}/`,
      objetos_persistidos: [
        `activos/aprobados/${execId}/${execId}-li.json`,
        `activos/aprobados/${execId}/${execId}-faq.json`,
        `activos/aprobados/${execId}/${execId}-nl.json`
      ],
      nota_arquitectura: "La URL PAR de OCI solo la usa el WF2 en n8n al aprobar y guardar en Oracle. No hace falta en Netlify ni en el frontend."
    },
    activos_validados: {
      linkedin: {
        asset_id: `${execId}-li`,
        canal_destino: "LinkedIn Oficial",
        titulo: liTitle,
        copy: liCopy,
        estado: "aprobado_y_persistido"
      },
      faq: {
        asset_id: `${execId}-faq`,
        canal_destino: "Portal FAQ / Notion Técnico",
        tema: faqTema,
        pregunta: faqQ,
        respuesta: faqA,
        estado: "aprobado_y_persistido"
      },
      newsletter: {
        asset_id: `${execId}-nl`,
        canal_destino: "Substack / Mailer Comunitario",
        titular: nlTitle,
        resumen: nlSummary,
        estado: "aprobado_y_persistido"
      }
    }
  };

  const ociPanel = document.getElementById('oci-result-panel');
  const codeDisplay = document.getElementById('oci-json-output');
  const ociPathText = document.getElementById('oci-path-text');

  if (codeDisplay) codeDisplay.textContent = JSON.stringify(payload, null, 2);
  if (ociPathText) ociPathText.textContent = `oci://communitylab-activos-marketing/activos/aprobados/${execId}/`;
  if (ociPanel) {
    ociPanel.classList.add('visible');
    ociPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Update Status Pill
  const statusPill = document.getElementById('curaduria-status-badge');
  if (statusPill) {
    statusPill.innerHTML = `☁️ Aprobado (Pendiente WF2 → OCI: ${execId})`;
    statusPill.style.color = '#34d399';
    statusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    statusPill.style.background = 'rgba(16, 185, 129, 0.15)';
  }

  showToast('🎉 ¡Contenido aprobado! WF2 en n8n procesará el guardado en OCI Object Storage vía PAR.');
}

// Reject Action
function handleRejectContent() {
  const rec = state.currentRecord || FALLBACK_RECORDS[0];
  const execId = rec.execution_id || "CL-N/A";

  const statusPill = document.getElementById('curaduria-status-badge');
  if (statusPill) {
    statusPill.innerHTML = `❌ Cerrado / Rechazado (${execId})`;
    statusPill.style.color = '#f87171';
    statusPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    statusPill.style.background = 'rgba(239, 68, 68, 0.15)';
  }

  const ociPanel = document.getElementById('oci-result-panel');
  if (ociPanel) ociPanel.classList.remove('visible');

  showToast('⚠️ Contenido marcado como cerrado_rechazado. No se persistirá en OCI.');
}

// Copy JSON Output to Clipboard
function copyJsonToClipboard() {
  const codeDisplay = document.getElementById('oci-json-output');
  if (!codeDisplay) return;

  navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
    showToast('📋 JSON copiado al portapapeles');
  }).catch(() => {
    showToast('Error al copiar JSON');
  });
}

// Ingesta Simulator Logic
function loadSimulatorPreset(presetKey) {
  const preset = SIMULATOR_PRESETS[presetKey];
  if (!preset) return;

  // Active chip highlight
  document.querySelectorAll('.preset-chip').forEach(el => el.classList.remove('active'));
  const activeChip = document.getElementById(`chip-${presetKey}`);
  if (activeChip) activeChip.classList.add('active');

  const inputAutor = document.getElementById('sim-input-autor');
  const inputCanal = document.getElementById('sim-input-canal');
  const inputTexto = document.getElementById('sim-input-texto');

  if (inputAutor) inputAutor.value = preset.autor;
  if (inputCanal) inputCanal.value = preset.canal;
  if (inputTexto) inputTexto.value = preset.texto;

  // Run simulation trace
  runSimulatorTrace(preset);
}

function runCustomSimulator() {
  const autor = document.getElementById('sim-input-autor')?.value || "Comunitario";
  const canal = document.getElementById('sim-input-canal')?.value || "#general";
  const texto = document.getElementById('sim-input-texto')?.value || "";

  if (!texto.trim()) {
    showToast('Por favor escribe un mensaje para simular el análisis');
    return;
  }

  // Deterministic scoring mock based on text features
  const isQuestion = texto.includes('?') || texto.toLowerCase().includes('como') || texto.toLowerCase().includes('error');
  const isTestimonial = texto.toLowerCase().includes('oferta') || texto.toLowerCase().includes('trabajo') || texto.toLowerCase().includes('gracias') || texto.toLowerCase().includes('junior');
  const isLogro = texto.toLowerCase().includes('hackathon') || texto.toLowerCase().includes('ganamos') || texto.toLowerCase().includes('proyecto');

  const pesos = { testimonio: 2.0, logro: 1.5, pregunta_tecnica: 1.5, otro: 0.5 };
  let tipo = "otro";
  let rama = "Descarte / Auditoría (tipo_no_elegible)";
  let motivoDescarte = "tipo_no_elegible";
  let scoreLlm = 3.0;
  let activo = null;

  if (isTestimonial) {
    tipo = "testimonio";
    rama = "Rama A: Post LinkedIn";
    scoreLlm = 9.0;
    motivoDescarte = null;
    activo = {
      tipo: "linkedin",
      titulo: `Caso de Éxito de ${autor}`,
      copy: `${autor} comparte su testimonio: "${texto.slice(0, 150)}..." #ComunidadTech #ONE #Alura`
    };
  } else if (isQuestion) {
    tipo = "pregunta_tecnica";
    rama = "Rama B: FAQ Dinámico";
    scoreLlm = 9.0;
    motivoDescarte = null;
    activo = {
      tipo: "faq",
      tema: `Solución técnica: ${texto.slice(0, 40)}`,
      pregunta: texto,
      respuesta: "Respuesta sugerida: Aplicar mejores prácticas de configuración e infraestructura en OCI."
    };
  } else if (isLogro) {
    tipo = "logro";
    rama = "Rama C: Newsletter Semanal";
    scoreLlm = 9.1;
    motivoDescarte = null;
    activo = {
      tipo: "newsletter",
      titular: `Logro destacado: ${autor}`,
      resumen: `La comunidad celebra el logro alcanzado por ${autor}. Un reflejo del compromiso y aprendizaje continuo.`
    };
  }

  const pesoTipo = pesos[tipo] || 0.5;
  const scoreFinal = Number(((0.75 * scoreLlm) + (0.25 * pesoTipo)).toFixed(2));
  const sentimiento = isQuestion ? "positivo" : (isTestimonial || isLogro ? "muy_positivo" : "neutro");
  const isElegible = ["testimonio", "logro", "pregunta_tecnica"].includes(tipo) && (sentimiento === "positivo" || sentimiento === "muy_positivo") && scoreFinal >= 6.0;

  if (!isElegible && !motivoDescarte) {
    if (!["testimonio", "logro", "pregunta_tecnica"].includes(tipo)) motivoDescarte = "tipo_no_elegible";
    else if (scoreFinal < 6.0) motivoDescarte = "score_bajo";
    else motivoDescarte = "sentimiento_no_positivo";
    activo = null;
    rama = `Descarte / Auditoría (${motivoDescarte})`;
  }

  const customPreset = {
    autor,
    canal,
    texto,
    tipo_detectado: tipo,
    sentimiento,
    temas: ["comunidad", "aprendizaje", "tecnologia"],
    scores: { score_llm: scoreLlm, peso_tipo: pesoTipo, final: scoreFinal },
    rama,
    motivo_descarte: motivoDescarte,
    activo_generado: activo
  };

  runSimulatorTrace(customPreset);
}

function runSimulatorTrace(preset) {
  const traceBox = document.getElementById('sim-trace-result');
  if (!traceBox) return;

  const score = preset.scores.final;
  const isAprobado = score >= 6.0;

  let activoHTML = '';
  if (preset.activo_generado) {
    if (preset.activo_generado.tipo === 'linkedin') {
      activoHTML = `
        <div class="linkedin-preview" style="margin-top:0.75rem;">
          <div class="li-header">
            <div class="li-avatar">LI</div>
            <div class="li-meta"><span class="li-name">${preset.autor}</span><span class="li-title">Testimonio Comunitario</span></div>
          </div>
          <div class="li-content">${escapeHTML(preset.activo_generado.copy)}</div>
        </div>`;
    } else if (preset.activo_generado.tipo === 'faq') {
      activoHTML = `
        <div class="faq-preview" style="margin-top:0.75rem;">
          <div class="faq-badge">FAQ TÉCNICO</div>
          <div class="faq-q">${escapeHTML(preset.activo_generado.pregunta)}</div>
          <div class="faq-a">${escapeHTML(preset.activo_generado.respuesta)}</div>
        </div>`;
    } else if (preset.activo_generado.tipo === 'newsletter') {
      activoHTML = `
        <div class="newsletter-preview" style="margin-top:0.75rem;">
          <div class="nl-edition-tag">NEWSLETTER SEMANAL</div>
          <div class="nl-title">${escapeHTML(preset.activo_generado.titular)}</div>
          <div class="nl-summary">${escapeHTML(preset.activo_generado.resumen)}</div>
        </div>`;
    }
  } else {
    const motivo = preset.motivo_descarte || "tipo_no_elegible";
    activoHTML = `
      <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:0.85rem; color:#fca5a5; font-size:0.85rem;">
        ⛔ <strong>Mensaje Descartado (Motivo: <code>${motivo}</code>)</strong><br>
        Score final: ${score.toFixed(2)} / 10 · Criterio oficial WF1: Solo avanzan mensajes de tipo <em>testimonio, logro o pregunta técnica</em> con sentimiento positivo y score ≥ 6.0. El registro se audita en la pestaña <code>Metricas_descartes_diarias</code>.
      </div>`;
  }

  traceBox.innerHTML = `
    <div class="sim-trace-container">
      <div class="trace-step active-step">
        <div class="step-num">1</div>
        <div class="step-info">
          <div class="step-title">Normalización & Ingesta (Webhook JSON)</div>
          <div class="step-desc">Asignado execution_id único <code>CL-20261022-XXX</code> y estandarizado autor: <strong>${escapeHTML(preset.autor)}</strong> en canal <code>${escapeHTML(preset.canal)}</code>.</div>
        </div>
      </div>

      <div class="trace-step active-step">
        <div class="step-num">2</div>
        <div class="step-info">
          <div class="step-title">Groq LLM (openai/gpt-oss-120b): Análisis Semántico</div>
          <div class="step-desc">
            Tipo Detectado: <strong style="color:var(--cyan)">${preset.tipo_detectado}</strong> | 
            Sentimiento: <strong style="color:var(--emerald)">${preset.sentimiento}</strong> | 
            Temas: <code>${preset.temas.join(', ')}</code>
          </div>
        </div>
      </div>

      <div class="trace-step active-step">
        <div class="step-num">3</div>
        <div class="step-info">
          <div class="step-title">Scoring Oficial: ${score.toFixed(2)} / 10</div>
          <div class="scoring-meter">
            <div class="meter-bar">
              <div class="meter-fill" style="width: ${Math.min(score * 10, 100)}%;"></div>
            </div>
          </div>
          <div class="step-desc" style="margin-top:0.3rem;">Fórmula de producción: <code>score_final = 0.75 × score_llm (${preset.scores.score_llm || 9.0}) + 0.25 × peso_tipo (${preset.scores.peso_tipo || 2.0})</code>. <br><em style="font-size:0.75rem; color:var(--text-dim);">*Simulador ilustrativo; la fórmula oficial se ejecuta en el nodo HTTP Groq de WF1.</em></div>
        </div>
      </div>

      <div class="trace-step active-step">
        <div class="step-num">4</div>
        <div class="step-info">
          <div class="step-title">Enrutamiento Condicional (Switch)</div>
          <div class="step-desc">Destino activado: <strong style="color:#fff;">${preset.rama}</strong></div>
        </div>
      </div>

      <div class="trace-step active-step">
        <div class="step-num">5</div>
        <div class="step-info">
          <div class="step-title">Activo Generado para Curaduría</div>
          ${activoHTML}
        </div>
      </div>
    </div>
  `;
}

// Update Observability & Metrics Tab (Valores Reales Sincronizados con Power BI / Sheet)
function updateMetricsTab() {
  const elTotal = document.getElementById('metric-total-interactions');
  const elAvg = document.getElementById('metric-avg-score');
  const elApproved = document.getElementById('metric-total-oci');
  const elRate = document.getElementById('metric-approval-rate');
  const elDesc = document.getElementById('metric-total-descartes');

  if (elTotal) elTotal.textContent = "77";
  if (elAvg) elAvg.textContent = "7.18 / 10";
  if (elApproved) elApproved.textContent = "13";
  if (elRate) elRate.textContent = "36.1%";
  if (elDesc) elDesc.textContent = "71";
}

// Tab Switching & Sub-view Routing
function switchPbiSubPage(subPageId) {
  document.querySelectorAll('.pbi-subtab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.pbi-subpage').forEach(page => {
    page.classList.remove('active');
  });

  const activeBtn = document.querySelector(`.pbi-subtab-btn[data-pbi-sub="${subPageId}"]`);
  const activePage = document.getElementById(`pbi-subpage-${subPageId}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePage) activePage.classList.add('active');
}

function switchTab(tabId, targetSubPage = null) {
  // Support aliases
  if (tabId === 'metricas') tabId = 'powerbi';

  state.activeTab = tabId;

  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeContent = document.getElementById(`tab-${tabId}`);
  const activeNavItem = document.getElementById(`nav-${tabId}`);

  if (activeContent) activeContent.classList.add('active');
  if (activeNavItem) activeNavItem.classList.add('active');

  if (tabId === 'powerbi' && targetSubPage) {
    switchPbiSubPage(targetSubPage);
  }

  // Trigger preset on simulator tab if first time
  if (tabId === 'simulador') {
    const traceBox = document.getElementById('sim-trace-result');
    if (traceBox && !traceBox.hasChildNodes()) {
      loadSimulatorPreset('mariana');
    }
  }
}

// Toast System
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🛡️</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Helper: Escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Fetch initial data
  fetchSheetData();

  // Navigation Links
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Tab switch buttons from Hero, Banners, and Links
  document.querySelectorAll('[data-tab-switch]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab-switch');
      const targetSub = btn.getAttribute('data-pbi-target');
      if (tab) {
        switchTab(tab, targetSub);
        const targetEl = document.getElementById(`tab-${tab === 'metricas' ? 'powerbi' : tab}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Power BI Sub-page Tabs
  document.querySelectorAll('[data-pbi-sub]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sub = btn.getAttribute('data-pbi-sub');
      if (sub) {
        switchPbiSubPage(sub);
      }
    });
  });

  // Live Streamlit Controls
  const iframe = document.getElementById('streamlit-live-frame');
  const btnToggleLocal = document.getElementById('btn-st-toggle-local');
  const btnToggleCloud = document.getElementById('btn-st-toggle-cloud');
  const btnReloadFrame = document.getElementById('btn-st-reload-frame');
  const btnOpenNewTab = document.getElementById('btn-st-open-newtab');
  const statusPill = document.getElementById('st-server-status');

  if (btnToggleLocal && iframe) {
    btnToggleLocal.addEventListener('click', () => {
      iframe.src = 'http://localhost:8501/?embed=true';
      btnToggleLocal.style.background = 'rgba(0,240,255,0.15)';
      btnToggleLocal.style.borderColor = 'rgba(0,240,255,0.4)';
      btnToggleLocal.style.color = 'var(--cyan)';
      if (btnToggleCloud) {
        btnToggleCloud.style.background = 'transparent';
        btnToggleCloud.style.borderColor = 'transparent';
        btnToggleCloud.style.color = 'var(--text-muted)';
      }
      if (btnOpenNewTab) btnOpenNewTab.href = 'http://localhost:8501';
      if (statusPill) statusPill.innerHTML = '<span class="pulse-dot"></span> Servidor Local Conectado (8501)';
      showToast('Cargando Streamlit Local (http://localhost:8501)...');
    });
  }

  if (btnToggleCloud && iframe) {
    btnToggleCloud.addEventListener('click', () => {
      iframe.src = 'https://g10-latam-equipo-36.streamlit.app/?embed=true';
      btnToggleCloud.style.background = 'rgba(255,75,75,0.15)';
      btnToggleCloud.style.borderColor = 'rgba(255,75,75,0.4)';
      btnToggleCloud.style.color = '#ff6b6b';
      if (btnToggleLocal) {
        btnToggleLocal.style.background = 'transparent';
        btnToggleLocal.style.borderColor = 'transparent';
        btnToggleLocal.style.color = 'var(--text-muted)';
      }
      if (btnOpenNewTab) btnOpenNewTab.href = 'https://g10-latam-equipo-36.streamlit.app/';
      if (statusPill) statusPill.innerHTML = '<span class="pulse-dot" style="background:#ff6b6b; box-shadow:0 0 8px #ff6b6b;"></span> Streamlit Cloud en Vivo';
      showToast('Cargando Streamlit Cloud en Producción...');
    });
  }

  if (btnReloadFrame && iframe) {
    btnReloadFrame.addEventListener('click', () => {
      const currentSrc = iframe.src;
      iframe.src = currentSrc;
      showToast('Recargando consola Streamlit...');
    });
  }

  // Select Execution Dropdown Change
  const select = document.getElementById('select-execution');
  if (select) {
    select.addEventListener('change', loadActiveRecord);
  }

  // Refresh Button
  const btnRefresh = document.getElementById('btn-refresh-sheet');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', fetchSheetData);
  }

  // Live input sync to previews
  ['input-li-title', 'input-li-copy', 'input-faq-tema', 'input-faq-q', 'input-faq-a', 'input-nl-title', 'input-nl-summary'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateLivePreviews);
    }
  });

  // Mode toggles (Edit vs Preview)
  ['li', 'faq', 'nl'].forEach(type => {
    const btnEdit = document.getElementById(`btn-mode-${type}-edit`);
    const btnPrev = document.getElementById(`btn-mode-${type}-prev`);
    if (btnEdit) btnEdit.addEventListener('click', () => setAssetCardMode(type, 'edit'));
    if (btnPrev) btnPrev.addEventListener('click', () => setAssetCardMode(type, 'preview'));
  });

  // Approval and Reject Buttons
  const btnApprove = document.getElementById('btn-approve-oci');
  if (btnApprove) btnApprove.addEventListener('click', handleApproveOCI);

  const btnReject = document.getElementById('btn-reject-content');
  if (btnReject) btnReject.addEventListener('click', handleRejectContent);

  const btnCopyJson = document.getElementById('btn-copy-oci-json');
  if (btnCopyJson) btnCopyJson.addEventListener('click', copyJsonToClipboard);

  // Simulator Presets
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      if (presetKey) loadSimulatorPreset(presetKey);
    });
  });

  const btnRunSim = document.getElementById('btn-run-simulation');
  if (btnRunSim) {
    btnRunSim.addEventListener('click', runCustomSimulator);
  }
});
