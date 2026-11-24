import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

/* ==========================================================================
   1. BANCO DE DADOS DE PROJETOS & PERSISTÊNCIA (NÍVEL DE ACESSO ADMIN)
   ========================================================================== */
const STORAGE_KEY_PROJECTS = 'jose_portfolio_projects_v2';
const STORAGE_KEY_ADMIN_SESSION = 'jose_portfolio_admin_logged';
const STORAGE_KEY_CLIENT_SESSION = 'jose_portfolio_client_session';

const DEFAULT_PROJECTS_DATA = [
  {
    id: 'prj-icamento',
    code: 'EST-SW-001',
    title: 'Dispositivo de Içamento & Suporte Estrutural Industrial',
    category: 'estruturas',
    software: 'SolidWorks 3D + Memória de Cálculo',
    preset3d: 'bracket',
    cadFile: 'EST-01_SUPORTE_ICAMENTO.SLDPRT',
    visibility: 'publico',
    clientCode: 'CLIENTE2026',
    progress: 100,
    stage: 'Concluído & Validado (ART / Laudo Emitido)',
    clientNotes:
      'Memória de cálculo validada segundo ABNT NBR 8800 e ASME BTH-1. Tensão máxima equivalente (Von Mises) dentro do limite admissível com Fator de Segurança FS = 2,85. Pacote CAD (.SLDPRT / .STEP) e folha executiva liberados.',
    summary:
      'Desenvolvimento de projeto 3D e memória de cálculo detalhada para validação estrutural de dispositivo de içamento e suporte metálico submetido a cargas críticas de operação.',
    specs: {
      Material: 'Aço Estrutural ASTM A36 / SAE 1020',
      Norma: 'ABNT NBR 8800 / ASME BTH-1',
      Verificacao: 'Tensão de Von Mises, Cisalhamento e Solda',
      Software: 'SolidWorks & Excel (Memorial)'
    },
    deliverables: [
      'Modelagem 3D paramétrica em SolidWorks do suporte e olhais de içamento',
      'Memória de cálculo estrutural detalhada com verificação de fator de segurança',
      'Desenho técnico executivo com simbologia de solda e lista de materiais (BOM)',
      'Emissão de documentação técnica para validação operacional'
    ]
  },
  {
    id: 'prj-nr12',
    code: 'NR12-HRN-002',
    title: 'Adequação de Máquinas à NR-12 & Apreciação de Risco (HRN)',
    category: 'maquinas',
    software: 'SolidWorks / Inventor + Método HRN',
    preset3d: 'gear',
    cadFile: 'MEC-02_TRANSMISSAO_NR12.SLDASM',
    visibility: 'publico',
    clientCode: 'CLIENTE2026',
    progress: 100,
    stage: 'Concluído & Validado (ART / Laudo Emitido)',
    clientNotes:
      'Apreciação de Riscos concluída pelo método HRN: redução do índice de risco de HRN Inicial = 65 (Alto Risco) para HRN Residual = 1,5 (Risco Desprezível) após instalação das proteções fixas e intertravadas modeladas em SolidWorks.',
    summary:
      'Engenharia diagnóstica, elaboração de Laudo de Apreciação de Riscos pelo método HRN (Hazard Rating Number) e concepção de enclausuramento/proteções físicas para transmissões de força.',
    specs: {
      Metodologia: 'HRN (Hazard Rating Number)',
      Normas: 'NR-12 / ABNT NBR ISO 12100',
      ModelagemCAD: 'Proteções Fixas e Móveis Intertravadas',
      Aplicacao: 'Máquinas Industriais e Pesadas'
    },
    deliverables: [
      'Laudo Técnico de Apreciação de Riscos (HRN) com matriz de severidade e probabilidade',
      'Modelagem 3D das grades e proteções mecânicas de sistemas de transmissão',
      'Plano de ação para adequação de segurança operacional',
      'Padronização visual e técnica conforme exigências normativas'
    ]
  },
  {
    id: 'prj-andaimes',
    code: 'EST-NR35-003',
    title: 'Validação Estrutural de Andaimes & Pontos de Ancoragem (NR-35)',
    category: 'estruturas',
    software: 'Inventor / SolidWorks + Cálculo Estrutural',
    preset3d: 'flange',
    cadFile: 'TUB-03_ANCORAGEM_ESTRUTURAL.SLDPRT',
    visibility: 'publico',
    clientCode: 'CLIENTE2026',
    progress: 100,
    stage: 'Concluído & Validado (ART / Laudo Emitido)',
    clientNotes:
      'Estrutura de andaime e ponto de ancoragem verificados contra flambagem crítica de Euler e tração axial de impacto conforme NR-35 / NR-18. Estabilidade global aprovada para operação em altura.',
    summary:
      'Elaboração de memória de cálculo e verificação de estabilidade, flambagem e resistência para estruturas de andaimes, plataformas de acesso e pontos de ancoragem em altura.',
    specs: {
      Normas: 'NR-18 / NR-35 / ABNT NBR 6494',
      Analise: 'Tração, Flambagem e Reações de Apoio',
      Qualificacao: 'Supervisor NR-35 Trabalho em Altura',
      Material: 'Tubos e Perfis de Aço Carbono'
    },
    deliverables: [
      'Memória de cálculo completa de estabilidade e capacidade de carga',
      'Detalhamento de conexões flangeadas, grampos e pontos de ancoragem',
      'Laudo técnico de liberação e diretrizes de segurança em altura (NR-35)'
    ]
  },
  {
    id: 'prj-pcm',
    code: 'PCM-AT-004',
    title: 'Gestão de Ativos (PCM) & Confiabilidade de Frota e Maquinários',
    category: 'simulacao',
    software: 'SolidWorks + Excel Avançado (PCM)',
    preset3d: 'piston',
    cadFile: 'AT-04_CONJUNTO_ATUADOR_FROTA.SLDASM',
    visibility: 'publico',
    clientCode: 'CLIENTE2026',
    progress: 90,
    stage: 'Em Cálculo Estrutural / Análise HRN',
    clientNotes:
      'Planos preventivos implantados para frota e equipamentos pesados. Redesenho 3D do conjunto de atuador hidráulico concluído para nacionalização de sobressalentes e redução de MTTR.',
    summary:
      'Estruturação e implementação de planos de manutenção preventiva e corretiva para equipamentos pesados e frota logística, aliados ao redesenho CAD de componentes críticos.',
    specs: {
      Foco: 'Confiabilidade e Disponibilidade Física',
      Estrategia: 'Manutenção Preventiva, Corretiva e Diagnóstica',
      Ferramentas: 'SolidWorks, Inventor & Excel',
      Setor: 'Operações Logísticas e Maquinário Pesado'
    },
    deliverables: [
      'Planos mestres de manutenção preventiva e lubrificação por família de ativos',
      'Padronização de ordens de serviço, checklists de inspeção e indicadores de frota',
      'Modelagem 3D de subconjuntos hidráulicos/mecânicos para reposição e melhoria'
    ]
  }
];

function loadProjectsFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Erro ao ler projetos salvos:', e);
  }
  return [...DEFAULT_PROJECTS_DATA];
}

function saveProjectsToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
  } catch (e) {
    console.warn('Erro ao salvar projetos no navegador:', e);
  }
}

let PROJECTS_DATA = loadProjectsFromStorage();
let isAdminLoggedIn = sessionStorage.getItem(STORAGE_KEY_ADMIN_SESSION) === 'true';
let clientSession = (() => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CLIENT_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

function hasClientOrAdminAccess(project = null) {
  if (isAdminLoggedIn) return true;
  if (!clientSession) return false;
  if (!project || !project.clientCode) return true;
  return (
    clientSession.code === 'CLIENTE2026' ||
    clientSession.code === project.clientCode.toUpperCase()
  );
}

/* ==========================================================================
   2. NAVEGAÇÃO POR ABAS
   ========================================================================== */
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tabTarget === tabId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Ajusta o canvas 3D quando a aba fica visível
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 60);
}

function initTabs() {
  document.querySelectorAll('[data-tab-target]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.tabTarget;
      if (target) switchTab(target);
    });
  });
}

/* ==========================================================================
   3. RENDERIZAÇÃO DOS CARDS DE PROJETOS & MODAL
   ========================================================================== */
function createProjectCardHTML(project) {
  const specValues = Object.values(project.specs || {});
  const primaryTag = specValues[1] || project.software;

  const adminToolbarHTML = isAdminLoggedIn
    ? `
      <div class="admin-card-toolbar">
        <span class="mono-text">ADMIN</span>
        <div class="admin-card-btns">
          <button type="button" class="btn-admin-card js-admin-edit" data-id="${project.id}">
            Editar
          </button>
          <button type="button" class="btn-admin-card danger js-admin-delete" data-id="${project.id}">
            Excluir
          </button>
        </div>
      </div>
    `
    : '';

  const centerVisualHTML = project.imageUrl
    ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-custom-thumb" />`
    : `
        <div class="thumb-svg-art">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
      `;

  return `
    <article class="project-card" data-category="${project.category}">
      ${adminToolbarHTML}
      <div class="project-blueprint-thumb">
        <div class="thumb-top-row">
          <span class="project-code-badge">${project.code}</span>
          <span class="project-software-badge">${project.software}</span>
        </div>

        ${centerVisualHTML}
      </div>

      <div class="project-body">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>

        <div class="project-clean-meta mono-text">
          <span>${primaryTag}</span>
        </div>

        <div class="project-actions">
          <button class="btn btn-secondary js-open-details" data-id="${project.id}">
            Detalhes
          </button>
          <button class="btn btn-outline js-inspect-3d" data-id="${project.id}">
            Ver 3D
          </button>
          <a href="https://wa.me/5598984869252?text=${encodeURIComponent(
            `Olá Eng. José Antonio! Vi o projeto "${project.code} - ${project.title}" no seu portfólio e gostaria de conversar.`
          )}" target="_blank" rel="noopener" class="btn btn-primary" title="Falar no WhatsApp sobre este projeto">
            Fale Comigo
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProjects(filter = 'todos', searchQuery = '') {
  const mainGrid = document.getElementById('projects-main-grid');
  const featuredGrid = document.getElementById('home-featured-grid');
  const badge = document.getElementById('project-count-badge');

  // Filtra visibilidade: projetos 'restrito' só aparecem para Cliente autenticado ou Admin
  const visibleProjects = PROJECTS_DATA.filter((p) => {
    if (p.visibility === 'restrito') {
      return hasClientOrAdminAccess(p);
    }
    return true;
  });

  if (badge) badge.textContent = visibleProjects.length;

  // Renderiza destaques na Home (primeiros 3 visíveis)
  if (featuredGrid) {
    featuredGrid.innerHTML = visibleProjects.slice(0, 3).map(createProjectCardHTML).join('');
  }

  // Filtra projetos na aba Projetos
  if (mainGrid) {
    const query = searchQuery.trim().toLowerCase();
    const filtered = visibleProjects.filter((p) => {
      const matchesCategory = filter === 'todos' || p.category === filter;
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        JSON.stringify(p.specs).toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    mainGrid.innerHTML = filtered.length
      ? filtered.map(createProjectCardHTML).join('')
      : `<p class="mono-text">Nenhum projeto encontrado para o filtro selecionado.</p>`;
  }

  bindProjectCardEvents();
}

function bindProjectCardEvents() {
  document.querySelectorAll('.js-open-details').forEach((btn) => {
    btn.onclick = () => openProjectModal(btn.dataset.id);
  });

  document.querySelectorAll('.js-inspect-3d').forEach((btn) => {
    btn.onclick = () => {
      const proj = PROJECTS_DATA.find((p) => p.id === btn.dataset.id);
      if (proj) {
        switchTab('visualizador');
        if (window.loadLabPreset) {
          window.loadLabPreset(proj.preset3d, proj.cadFile);
        }
      }
    };
  });

  document.querySelectorAll('.js-admin-edit').forEach((btn) => {
    btn.onclick = () => openAdminProjectForm(btn.dataset.id);
  });

  document.querySelectorAll('.js-admin-delete').forEach((btn) => {
    btn.onclick = () => deleteAdminProject(btn.dataset.id);
  });
}

function openProjectModal(projectId) {
  const proj = PROJECTS_DATA.find((p) => p.id === projectId);
  if (!proj) return;

  const modal = document.getElementById('project-modal');
  document.getElementById('modal-project-code').textContent = `${proj.code} • ${proj.software}`;
  document.getElementById('modal-project-title').textContent = proj.title;
  document.getElementById('modal-project-desc').textContent = proj.summary;

  document.getElementById('modal-project-specs').innerHTML = Object.entries(proj.specs)
    .map(
      ([k, v]) => `
      <div class="spec-cell" style="background:rgba(8,44,67,0.6);padding:0.65rem;border-radius:6px;border:1px solid rgba(205,210,213,0.15)">
        <span>${k.toUpperCase()}</span>
        <strong>${v}</strong>
      </div>
    `
    )
    .join('');

  document.getElementById('modal-project-deliverables').innerHTML = proj.deliverables
    .map((item) => `<li>${item}</li>`)
    .join('');

  const vaultEl = document.getElementById('modal-client-vault');
  if (vaultEl) {
    const waMsg = encodeURIComponent(
      `Olá Eng. José Antonio, vi o projeto "${proj.code} - ${proj.title}" no seu portfólio e gostaria de conversar!`
    );
    const waLink = `https://wa.me/5598984869252?text=${waMsg}`;

    const modalContactBtn = document.getElementById('modal-contact-btn');
    if (modalContactBtn) {
      modalContactBtn.href = waLink;
    }

    vaultEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">
        <span class="mono-text text-accent">✔ PARECER TÉCNICO & VALIDAÇÃO DE ENGENHARIA</span>
        <span class="client-stage-badge">${proj.stage || 'Concluído & Validado'}</span>
      </div>
      <p style="font-size:0.86rem;margin-bottom:0.85rem;">
        <strong>Resumo Técnico:</strong> ${proj.clientNotes ||
      'Memorial de cálculo e modelagem 3D validados conforme normas técnicas aplicáveis.'
      }
      </p>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
        <button type="button" class="btn btn-secondary btn-sm" id="modal-download-dossier-btn">
          Baixar Ficha / Memorial (${proj.code}.txt)
        </button>
        <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
          Fale Comigo no WhatsApp sobre este Projeto
        </a>
      </div>
    `;
    document.getElementById('modal-download-dossier-btn')?.addEventListener('click', () => {
      downloadClientDossier(proj);
    });
  }

  const open3dBtn = document.getElementById('modal-open-3d-btn');
  open3dBtn.onclick = () => {
    modal.classList.remove('open');
    switchTab('visualizador');
    if (window.loadLabPreset) {
      window.loadLabPreset(proj.preset3d, proj.cadFile);
    }
  };

  modal.classList.add('open');
}

function initProjectFiltersAndModal() {
  let activeFilter = 'todos';
  const searchInput = document.getElementById('project-search');

  document.querySelectorAll('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      renderProjects(activeFilter, searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProjects(activeFilter, searchInput.value);
    });
  }

  const modal = document.getElementById('project-modal');
  const closeModal = () => modal.classList.remove('open');
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-close-secondary')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   4. GERADOR DE GEOMETRIAS MECÂNICAS 3D (ESTILO SOLIDWORKS CAD)
   ========================================================================== */
function createMechanicalPresetGeometry(presetName) {
  const group = new THREE.Group();

  // Material base e arestas CAD
  const mainMat = new THREE.MeshStandardMaterial({
    color: 0xcdd2d5,
    metalness: 0.65,
    roughness: 0.32,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xdf6112,
    metalness: 0.45,
    roughness: 0.4
  });

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x4a5455,
    metalness: 0.75,
    roughness: 0.28
  });

  const addWithCadEdges = (geometry, material, parent = group) => {
    const mesh = new THREE.Mesh(geometry, material);
    const edgesGeo = new THREE.EdgesGeometry(geometry, 22);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x082c43,
      transparent: true,
      opacity: 0.65
    });
    const line = new THREE.LineSegments(edgesGeo, edgesMat);
    mesh.add(line);
    parent.add(mesh);
    return mesh;
  };

  if (presetName === 'gear') {
    // Corpo principal da engrenagem
    const outerRing = new THREE.CylinderGeometry(2.1, 2.1, 0.8, 36);
    addWithCadEdges(outerRing, mainMat);

    // Cubo central ressaltado
    const hub = new THREE.CylinderGeometry(1.05, 1.05, 1.25, 32);
    addWithCadEdges(hub, darkSteelMat);

    // Furo central de eixo
    const bore = new THREE.CylinderGeometry(0.55, 0.55, 1.32, 28);
    addWithCadEdges(bore, accentMat);

    // Dentes da engrenagem (18 dentes)
    const numTeeth = 18;
    const toothGeo = new THREE.BoxGeometry(0.34, 0.82, 0.48);
    for (let i = 0; i < numTeeth; i++) {
      const angle = (i / numTeeth) * Math.PI * 2;
      const tooth = addWithCadEdges(toothGeo, mainMat);
      tooth.position.set(Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2);
      tooth.rotation.y = -angle;
    }

    // Furos de alívio de massa
    const holeGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.86, 20);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const hole = addWithCadEdges(holeGeo, darkSteelMat);
      hole.position.set(Math.cos(angle) * 1.52, 0, Math.sin(angle) * 1.52);
    }

    group.rotation.x = Math.PI * 0.22;
    return {
      group,
      dims: '142.0 × 142.0 × 38.0 mm',
      tris: '3.120',
      label: 'Engrenagem Cilíndrica Módulo 4'
    };
  }

  if (presetName === 'flange') {
    // Disco do flange
    const baseDisc = new THREE.CylinderGeometry(2.35, 2.35, 0.45, 40);
    addWithCadEdges(baseDisc, mainMat);

    // Pescoço cônico (Weld Neck)
    const neck = new THREE.CylinderGeometry(1.15, 1.5, 1.35, 36);
    const neckMesh = addWithCadEdges(neck, mainMat);
    neckMesh.position.y = 0.85;

    // Ressalto de vedação (Raised Face)
    const rf = new THREE.CylinderGeometry(1.65, 1.65, 0.12, 36);
    const rfMesh = addWithCadEdges(rf, accentMat);
    rfMesh.position.y = -0.25;

    // Furo interno da tubulação
    const innerPipe = new THREE.CylinderGeometry(0.85, 0.85, 2.2, 32);
    const innerMesh = addWithCadEdges(innerPipe, darkSteelMat);
    innerMesh.position.y = 0.55;

    // 8 Parafusos/Furos de fixação
    const boltGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 18);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bolt = addWithCadEdges(boltGeo, darkSteelMat);
      bolt.position.set(Math.cos(angle) * 1.92, 0, Math.sin(angle) * 1.92);
    }

    return {
      group,
      dims: '230.0 × 230.0 × 110.0 mm',
      tris: '2.840',
      label: 'Flange Weld-Neck ANSI B16.5 #300'
    };
  }

  if (presetName === 'bracket') {
    // Base horizontal
    const basePlate = new THREE.BoxGeometry(3.4, 0.38, 2.1);
    const baseMesh = addWithCadEdges(basePlate, mainMat);
    baseMesh.position.y = -0.9;

    // Parede vertical de ancoragem
    const upright = new THREE.BoxGeometry(0.42, 2.2, 2.1);
    const upMesh = addWithCadEdges(upright, mainMat);
    upMesh.position.set(-1.49, 0.2, 0);

    // Duas nervuras triangulares de reforço (gussets)
    const ribGeo = new THREE.BoxGeometry(1.8, 0.24, 0.28);
    [-0.75, 0.75].forEach((zPos) => {
      const rib = addWithCadEdges(ribGeo, accentMat);
      rib.position.set(-0.65, -0.05, zPos);
      rib.rotation.z = -Math.PI * 0.23;
    });

    // Olhal superior do pino
    const boss = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 28);
    const bossMesh = addWithCadEdges(boss, darkSteelMat);
    bossMesh.rotation.x = Math.PI / 2;
    bossMesh.position.set(0.85, -0.35, 0);

    return {
      group,
      dims: '180.0 × 115.0 × 130.0 mm',
      tris: '1.960',
      label: 'Suporte Estrutural com Nervuras FEA'
    };
  }

  // Default / 'piston': Conjunto Êmbolo & Pino
  const crown = new THREE.CylinderGeometry(1.65, 1.65, 2.1, 36);
  addWithCadEdges(crown, mainMat);

  // Anéis de segmento (laranja industrial)
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.67, 0.06, 16, 40);
    const ring = addWithCadEdges(ringGeo, accentMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.75 - i * 0.26;
  }

  // Pino transversal (Gudgeon Pin)
  const pinGeo = new THREE.CylinderGeometry(0.45, 0.45, 3.6, 28);
  const pin = addWithCadEdges(pinGeo, darkSteelMat);
  pin.rotation.z = Math.PI / 2;
  pin.position.y = -0.25;

  // Haste central (Biela/Haste do Atuador)
  const rodGeo = new THREE.CylinderGeometry(0.32, 0.42, 2.4, 24);
  const rod = addWithCadEdges(rodGeo, accentMat);
  rod.position.y = -1.6;

  return {
    group,
    dims: '165.0 × 165.0 × 285.0 mm',
    tris: '3.640',
    label: 'Conjunto Êmbolo & Haste de Atuador'
  };
}

/* ==========================================================================
   5. INICIALIZAÇÃO DOS VIEWPORTS 3D (HERO & LABORATÓRIO STL)
   ========================================================================== */
function createCadScene(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(4.6, 3.4, 5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;

  // Iluminação técnica de estúdio CAD
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(6, 10, 7);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xdf6112, 0.55);
  rimLight.position.set(-6, -4, -5);
  scene.add(rimLight);

  // Grid de piso estilo plano de trabalho do SolidWorks
  const grid = new THREE.GridHelper(10, 20, 0xdf6112, 0x4a5455);
  grid.position.y = -2.1;
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  scene.add(grid);

  return { scene, camera, renderer, controls };
}

function initHeroViewport() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container) return;

  const { scene, camera, renderer, controls } = createCadScene(container);
  const presets = ['bracket', 'gear', 'flange', 'piston'];
  const filenames = [
    'EST-01_SUPORTE_ICAMENTO.SLDPRT',
    'MEC-02_TRANSMISSAO_NR12.SLDASM',
    'TUB-03_ANCORAGEM_ESTRUTURAL.SLDPRT',
    'AT-04_CONJUNTO_ATUADOR_FROTA.SLDASM'
  ];
  let currentIdx = 0;
  let currentGroup = null;
  let isWireframe = false;

  const loadHeroModel = (index) => {
    if (currentGroup) scene.remove(currentGroup);
    const { group, label } = createMechanicalPresetGeometry(presets[index]);
    currentGroup = group;
    scene.add(currentGroup);

    const fileEl = document.getElementById('hero-model-filename');
    const labelEl = document.getElementById('hero-part-label');
    if (fileEl) fileEl.textContent = filenames[index];
    if (labelEl) labelEl.textContent = `PEÇA: ${label}`;
    applyWireframe(isWireframe);
  };

  const applyWireframe = (wire) => {
    isWireframe = wire;
    if (!currentGroup) return;
    currentGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wire;
      }
    });
  };

  loadHeroModel(0);

  document.getElementById('hero-btn-solid')?.addEventListener('click', (e) => {
    applyWireframe(false);
    e.currentTarget.classList.add('active');
    document.getElementById('hero-btn-wire')?.classList.remove('active');
  });

  document.getElementById('hero-btn-wire')?.addEventListener('click', (e) => {
    applyWireframe(true);
    e.currentTarget.classList.add('active');
    document.getElementById('hero-btn-solid')?.classList.remove('active');
  });

  document.getElementById('hero-btn-switch')?.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % presets.length;
    loadHeroModel(currentIdx);
  });

  window.addEventListener('resize', () => {
    if (container.clientWidth === 0 || container.clientHeight === 0) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

function initLabViewport() {
  const container = document.getElementById('lab-3d-canvas');
  if (!container) return;

  const { scene, camera, renderer, controls } = createCadScene(container);
  let activeModel = null;
  let currentColor = '#cdd2d5';
  let currentDisplayMode = 'solid';

  const applyDisplaySettings = () => {
    if (!activeModel) return;
    activeModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = currentDisplayMode === 'wireframe';
        child.material.transparent = currentDisplayMode === 'xray';
        child.material.opacity = currentDisplayMode === 'xray' ? 0.45 : 1.0;
      }
    });
  };

  const applyMaterialColor = (hexColor) => {
    currentColor = hexColor;
    if (!activeModel) return;
    activeModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(hexColor);
      }
    });
  };

  const loadPresetIntoLab = (presetKey, customFilename) => {
    if (activeModel) scene.remove(activeModel);
    const { group, dims, tris } = createMechanicalPresetGeometry(presetKey);
    activeModel = group;
    scene.add(activeModel);

    document.getElementById('lab-dims').textContent = dims;
    document.getElementById('lab-tris').textContent = tris;
    document.getElementById('lab-status').textContent = 'MODELO CAD CARREGADO';
    if (customFilename) {
      document.getElementById('lab-current-filename').textContent = customFilename;
    }

    document.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.preset === presetKey);
    });

    applyDisplaySettings();
  };

  // Expõe globalmente para os botões "Ver em 3D" dos cards de projetos
  window.loadLabPreset = loadPresetIntoLab;

  // Carrega peça inicial
  loadPresetIntoLab('bracket', 'EST-01_SUPORTE_ICAMENTO.SLDPRT');

  // Cliques nos presets da barra lateral
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      const code = btn.querySelector('.preset-code')?.textContent || 'PRT';
      loadPresetIntoLab(preset, `${code}_SOLIDWORKS_MODEL.SLDPRT`);
    });
  });

  // Modos de exibição (Sólido, Wireframe, Raio-X)
  const modeButtons = {
    solid: document.getElementById('lab-mode-solid'),
    wireframe: document.getElementById('lab-mode-wireframe'),
    xray: document.getElementById('lab-mode-xray')
  };

  Object.entries(modeButtons).forEach(([mode, btn]) => {
    btn?.addEventListener('click', () => {
      currentDisplayMode = mode;
      Object.values(modeButtons).forEach((b) => b?.classList.remove('active'));
      btn.classList.add('active');
      applyDisplaySettings();
    });
  });

  // Seletor de acabamento de cor
  document.querySelectorAll('.material-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.material-swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      applyMaterialColor(swatch.dataset.color);
    });
  });

  // Botões de câmera no topo do palco
  document.getElementById('lab-btn-reset-cam')?.addEventListener('click', () => {
    camera.position.set(4.6, 3.4, 5.2);
    controls.target.set(0, 0, 0);
    controls.update();
  });

  document.getElementById('lab-btn-autorotate')?.addEventListener('click', (e) => {
    controls.autoRotate = !controls.autoRotate;
    e.currentTarget.classList.toggle('active', controls.autoRotate);
  });

  // Upload de arquivo .STL real exportado do SolidWorks
  const stlInput = document.getElementById('stl-file-input');
  const handleStlFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    document.getElementById('lab-status').textContent = 'PROCESSANDO MALHA STL...';

    reader.onload = (event) => {
      try {
        const loader = new STLLoader();
        const geometry = loader.parse(event.target.result);
        geometry.computeVertexNormals();
        geometry.center();

        // Normaliza a escala para caber perfeitamente na tela
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = 3.8 / maxDim;

        const mat = new THREE.MeshStandardMaterial({
          color: currentColor,
          metalness: 0.6,
          roughness: 0.35
        });

        const mesh = new THREE.Mesh(geometry, mat);
        mesh.scale.setScalar(scaleFactor);

        const edges = new THREE.EdgesGeometry(geometry, 25);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x082c43, transparent: true, opacity: 0.55 })
        );
        mesh.add(line);

        if (activeModel) scene.remove(activeModel);
        const group = new THREE.Group();
        group.add(mesh);
        activeModel = group;
        scene.add(activeModel);

        // Atualiza telemetria com dimensões reais do STL do SolidWorks
        const triCount = geometry.attributes.position.count / 3;
        document.getElementById('lab-current-filename').textContent = file.name.toUpperCase();
        document.getElementById('lab-dims').textContent = `${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} unid.`;
        document.getElementById('lab-tris').textContent = Math.round(triCount).toLocaleString('pt-BR');
        document.getElementById('lab-status').textContent = 'ARQUIVO DO SOLIDWORKS CARREGADO';

        document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
        applyDisplaySettings();
      } catch (err) {
        console.error(err);
        document.getElementById('lab-status').textContent = 'ERRO AO LER ARQUIVO STL';
      }
    };

    reader.readAsArrayBuffer(file);
  };

  stlInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handleStlFile(file);
  });

  const dropzone = document.getElementById('stl-dropzone');
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleStlFile(file);
  });

  window.addEventListener('resize', () => {
    if (container.clientWidth === 0 || container.clientHeight === 0) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

/* ==========================================================================
   6. SISTEMA DE NÍVEL DE ACESSO (PAINEL ADMINISTRADOR)
   ========================================================================== */
const ADMIN_CREDENTIALS = {
  user: 'jose.admin',
  pass: 'crea112340'
};

let pendingProjectImageBase64 = null;

function setUnifiedLoginRole(role = 'cliente') {
  const clientTab = document.getElementById('tab-role-cliente');
  const adminTab = document.getElementById('tab-role-admin');
  const clientForm = document.getElementById('client-login-form');
  const adminForm = document.getElementById('admin-login-form');

  const isClient = role === 'cliente';
  clientTab?.classList.toggle('active', isClient);
  adminTab?.classList.toggle('active', !isClient);
  if (clientForm) clientForm.hidden = !isClient;
  if (adminForm) adminForm.hidden = isClient;
}

function openUnifiedLoginModal(defaultRole = 'cliente') {
  const modal = document.getElementById('unified-login-modal');
  const clientErr = document.getElementById('client-login-error');
  const adminErr = document.getElementById('admin-login-error');
  if (clientErr) clientErr.hidden = true;
  if (adminErr) adminErr.hidden = true;

  setUnifiedLoginRole(defaultRole);
  modal?.classList.add('open');
}

function closeUnifiedLoginModal() {
  document.getElementById('unified-login-modal')?.classList.remove('open');
}

function updateAdminUI() {
  const topbar = document.getElementById('admin-topbar');
  const projectsAddWrap = document.getElementById('projects-header-admin-btn');
  const unifiedLabel = document.getElementById('unified-login-label');
  const navTabCliente = document.getElementById('nav-tab-cliente');

  if (topbar) topbar.hidden = !isAdminLoggedIn;
  if (projectsAddWrap) projectsAddWrap.hidden = !isAdminLoggedIn;

  // A aba "Área do Cliente" só aparece no menu após login de Cliente ou Admin
  const isAnyAuthenticated = Boolean(clientSession) || isAdminLoggedIn;
  if (navTabCliente) {
    navTabCliente.hidden = !isAnyAuthenticated;
  }

  if (unifiedLabel) {
    if (isAdminLoggedIn) {
      unifiedLabel.textContent = 'Painel Admin';
    } else if (clientSession) {
      unifiedLabel.textContent = `Cliente: ${clientSession.name.split(' ')[0]}`;
    } else {
      unifiedLabel.textContent = 'Entrar';
    }
  }

  renderProjects();
  if (typeof updateClientPortalUI === 'function') updateClientPortalUI();
  if (window.lucide) window.lucide.createIcons();
}

function openAdminProjectForm(projectId = null) {
  if (!isAdminLoggedIn) return;

  const modal = document.getElementById('admin-project-modal');
  const titleEl = document.getElementById('admin-form-title');
  const form = document.getElementById('admin-project-form');
  const imgStatus = document.getElementById('proj-image-status');
  form.reset();
  pendingProjectImageBase64 = null;

  if (projectId) {
    const proj = PROJECTS_DATA.find((p) => p.id === projectId);
    if (!proj) return;

    titleEl.textContent = `Editar Projeto • ${proj.code}`;
    document.getElementById('proj-id').value = proj.id;
    document.getElementById('proj-code').value = proj.code;
    document.getElementById('proj-category').value = proj.category;
    document.getElementById('proj-title').value = proj.title;
    document.getElementById('proj-software').value = proj.software;
    document.getElementById('proj-cadfile').value = proj.cadFile;
    document.getElementById('proj-preset3d').value = proj.preset3d || 'bracket';
    document.getElementById('proj-summary').value = proj.summary;

    const specValues = Object.values(proj.specs || {});
    document.getElementById('proj-spec-1').value = specValues[0] || '';
    document.getElementById('proj-spec-2').value = specValues[1] || '';
    document.getElementById('proj-spec-3').value = specValues[2] || '';
    document.getElementById('proj-spec-4').value = specValues[3] || '';

    document.getElementById('proj-deliverables').value = (proj.deliverables || []).join('\n');
    document.getElementById('proj-visibility').value = proj.visibility || 'publico';
    document.getElementById('proj-client-code').value = proj.clientCode || 'CLIENTE2026';
    document.getElementById('proj-progress').value = proj.progress ?? 100;
    document.getElementById('proj-stage').value =
      proj.stage || 'Concluído & Validado (ART / Laudo Emitido)';
    document.getElementById('proj-client-notes').value = proj.clientNotes || '';

    pendingProjectImageBase64 = proj.imageUrl || null;
    if (imgStatus) {
      imgStatus.textContent = proj.imageUrl
        ? 'Imagem personalizada já anexada. Envie outra se quiser substituir.'
        : 'Usando blueprint técnico padrão.';
    }
  } else {
    titleEl.textContent = 'Cadastrar Novo Projeto no Portfólio';
    document.getElementById('proj-id').value = '';
    if (imgStatus) {
      imgStatus.textContent = 'Se não enviar, será exibido o blueprint técnico padrão.';
    }
  }

  modal.classList.add('open');
}

function deleteAdminProject(projectId) {
  if (!isAdminLoggedIn) return;
  const proj = PROJECTS_DATA.find((p) => p.id === projectId);
  if (!proj) return;

  const confirmed = window.confirm(
    `Tem certeza que deseja excluir o projeto "${proj.code} — ${proj.title}"?`
  );
  if (!confirmed) return;

  PROJECTS_DATA = PROJECTS_DATA.filter((p) => p.id !== projectId);
  saveProjectsToStorage(PROJECTS_DATA);
  renderProjects();
}

function initAdminAccessLevel() {
  const loginModal = document.getElementById('unified-login-modal');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');
  const projectModal = document.getElementById('admin-project-modal');
  const projectForm = document.getElementById('admin-project-form');

  // Botão único "Entrar" no cabeçalho
  document.getElementById('btn-unified-login')?.addEventListener('click', () => {
    if (isAdminLoggedIn) {
      openAdminProjectForm(null);
    } else if (clientSession) {
      switchTab('cliente');
    } else {
      openUnifiedLoginModal('cliente');
    }
  });

  // Alternar entre "Sou Cliente" e "Administrador (José)" dentro da janela de login
  document.querySelectorAll('[data-login-role]').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      setUnifiedLoginRole(tabBtn.dataset.loginRole);
    });
  });

  document.getElementById('unified-login-close')?.addEventListener('click', closeUnifiedLoginModal);
  document.querySelectorAll('.js-close-unified-login').forEach((btn) => {
    btn.addEventListener('click', closeUnifiedLoginModal);
  });
  loginModal?.addEventListener('click', (e) => {
    if (e.target === loginModal) closeUnifiedLoginModal();
  });

  // Autenticação do Administrador
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('admin-user').value.trim();
    const passVal = document.getElementById('admin-pass').value.trim();

    if (userVal === ADMIN_CREDENTIALS.user && passVal === ADMIN_CREDENTIALS.pass) {
      isAdminLoggedIn = true;
      sessionStorage.setItem(STORAGE_KEY_ADMIN_SESSION, 'true');
      closeUnifiedLoginModal();
      document.getElementById('admin-pass').value = '';
      updateAdminUI();
      switchTab('projetos');
    } else {
      if (loginError) loginError.hidden = false;
    }
  });

  // Logout do Admin
  document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
    isAdminLoggedIn = false;
    sessionStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    updateAdminUI();
    if (!clientSession) {
      switchTab('inicio');
    }
  });

  // Abrir modal de Novo Projeto
  document.getElementById('btn-admin-new-project')?.addEventListener('click', () => {
    switchTab('projetos');
    openAdminProjectForm(null);
  });
  document.getElementById('btn-projects-add')?.addEventListener('click', () => {
    openAdminProjectForm(null);
  });

  const closeProjectModal = () => projectModal?.classList.remove('open');
  document.getElementById('admin-project-close')?.addEventListener('click', closeProjectModal);
  document.getElementById('admin-project-cancel')?.addEventListener('click', closeProjectModal);

  // Leitura opcional de imagem do projeto
  document.getElementById('proj-image-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pendingProjectImageBase64 = ev.target.result;
      const imgStatus = document.getElementById('proj-image-status');
      if (imgStatus) imgStatus.textContent = `Imagem carregada: ${file.name}`;
    };
    reader.readAsDataURL(file);
  });

  // Salvar Novo Projeto ou Edição
  projectForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const existingId = document.getElementById('proj-id').value;
    const deliverablesRaw = document.getElementById('proj-deliverables').value;
    const deliverables = deliverablesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const projectPayload = {
      id: existingId || `prj-${Date.now()}`,
      code: document.getElementById('proj-code').value.trim(),
      category: document.getElementById('proj-category').value,
      title: document.getElementById('proj-title').value.trim(),
      software: document.getElementById('proj-software').value.trim(),
      cadFile: document.getElementById('proj-cadfile').value.trim(),
      preset3d: document.getElementById('proj-preset3d').value,
      visibility: document.getElementById('proj-visibility').value,
      clientCode: (document.getElementById('proj-client-code').value.trim() || 'CLIENTE2026').toUpperCase(),
      progress: Number(document.getElementById('proj-progress').value) || 100,
      stage: document.getElementById('proj-stage').value,
      clientNotes: document.getElementById('proj-client-notes').value.trim(),
      summary: document.getElementById('proj-summary').value.trim(),
      imageUrl: pendingProjectImageBase64 || null,
      specs: {
        Material: document.getElementById('proj-spec-1').value.trim(),
        Norma: document.getElementById('proj-spec-2').value.trim(),
        Verificacao: document.getElementById('proj-spec-3').value.trim(),
        Ferramentas: document.getElementById('proj-spec-4').value.trim()
      },
      deliverables
    };

    if (existingId) {
      PROJECTS_DATA = PROJECTS_DATA.map((p) => (p.id === existingId ? projectPayload : p));
    } else {
      PROJECTS_DATA = [projectPayload, ...PROJECTS_DATA];
    }

    saveProjectsToStorage(PROJECTS_DATA);
    closeProjectModal();
    renderProjects();
    updateClientPortalUI();
  });

  // Exportar JSON dos projetos para backup/repositório
  document.getElementById('btn-admin-export')?.addEventListener('click', () => {
    const dataStr = JSON.stringify(PROJECTS_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projetos-jose-antonio.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Importar JSON de projetos
  document.getElementById('admin-import-json')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          PROJECTS_DATA = imported;
          saveProjectsToStorage(PROJECTS_DATA);
          renderProjects();
          updateClientPortalUI();
          alert('Acervo de projetos importado com sucesso!');
        }
      } catch (err) {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  });

  updateAdminUI();
}

/* ==========================================================================
   7. PORTAL DO CLIENTE (NÍVEL DE ACESSO CLIENTE)
   ========================================================================== */
function downloadClientDossier(proj) {
  const specsLines = Object.entries(proj.specs || {})
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join('\n');
  const deliverablesLines = (proj.deliverables || [])
    .map((d, i) => `  ${i + 1}. ${d}`)
    .join('\n');

  const content = [
    '=========================================================================',
    'DOSSIÊ TÉCNICO DE ENGENHARIA & MEMORIAL DESCRITIVO',
    'Responsável Técnico: Eng. José Antonio Silva de Sá',
    'Títulos: Engenheiro Mecânico (UEMA) • Engenheiro de Segurança do Trabalho',
    'Registro: CREA NACIONAL - MA/PA 112340922-6 | São Luís - MA',
    'Contato: (98) 9 8486-9252 | joseantonio3108@gmail.com',
    '=========================================================================',
    '',
    `CÓDIGO DO PROJETO : ${proj.code}`,
    `TÍTULO            : ${proj.title}`,
    `SOFTWARE / MÉTODO : ${proj.software}`,
    `ARQUIVO CAD 3D    : ${proj.cadFile}`,
    `STATUS DA ENTREGA : ${proj.stage || 'Concluído & Validado'} (${proj.progress ?? 100}%)`,
    '',
    '1. RESUMO TÉCNICO',
    proj.summary,
    '',
    '2. PARECER TÉCNICO / LAUDO & MEMORIAL DE CÁLCULO',
    proj.clientNotes ||
    'Projeto verificado e validado de acordo com as normas técnicas aplicáveis.',
    '',
    '3. ESPECIFICAÇÕES TÉCNICAS',
    specsLines,
    '',
    '4. ENTREGÁVEIS DE ENGENHARIA',
    deliverablesLines,
    '',
    '=========================================================================',
    `Documento emitido eletronicamente pelo Portal de Engenharia — ${new Date().toLocaleDateString('pt-BR')}`,
    '========================================================================='
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DOSSIE_${proj.code}_ENG_JOSE_ANTONIO.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function updateClientPortalUI() {
  const dashboardBox = document.getElementById('client-dashboard-box');
  const logoutWrap = document.getElementById('client-logout-wrap');
  const navTabCliente = document.getElementById('nav-tab-cliente');
  const unifiedLabel = document.getElementById('unified-login-label');
  const welcomeTitle = document.getElementById('client-welcome-title');
  const container = document.getElementById('client-projects-container');

  const isUnlocked = Boolean(clientSession) || isAdminLoggedIn;

  if (navTabCliente) navTabCliente.hidden = !isUnlocked;
  if (dashboardBox) dashboardBox.hidden = !isUnlocked;
  if (logoutWrap) logoutWrap.hidden = !clientSession;

  if (unifiedLabel) {
    if (isAdminLoggedIn) {
      unifiedLabel.textContent = 'Painel Admin';
    } else if (clientSession) {
      unifiedLabel.textContent = `Cliente: ${clientSession.name.split(' ')[0]}`;
    } else {
      unifiedLabel.textContent = 'Entrar';
    }
  }

  if (!isUnlocked || !container) return;

  const clientName = isAdminLoggedIn
    ? 'Visão Completa do Administrador (Eng. José Antonio)'
    : `${clientSession.name} (Código: ${clientSession.code})`;

  if (welcomeTitle) {
    welcomeTitle.textContent = `Ambiente Técnico • ${clientName}`;
  }

  const accessibleProjects = PROJECTS_DATA.filter((p) => hasClientOrAdminAccess(p));

  container.innerHTML = accessibleProjects
    .map(
      (proj) => `
      <div class="client-delivery-card">
        <div class="client-delivery-top">
          <div>
            <span class="mono-text text-accent">${proj.code} • ${proj.software}</span>
            <h4>${proj.title}</h4>
          </div>
          <span class="client-stage-badge">${proj.stage || 'Concluído & Validado'}</span>
        </div>

        <div class="client-progress-wrap">
          <div class="client-progress-header">
            <span>ANDAMENTO DO PROJETO / LAUDO</span>
            <strong>${proj.progress ?? 100}% CONCLUÍDO</strong>
          </div>
          <div class="client-progress-bar">
            <div class="client-progress-fill" style="width:${proj.progress ?? 100}%"></div>
          </div>
        </div>

        <div class="client-notes-box">
          <strong>Parecer Técnico & Validação (Eng. José Antonio — CREA MA/PA 112340922-6):</strong>
          <p style="margin-top:0.35rem;">
            ${proj.clientNotes ||
        'Memorial de cálculo, análise de risco e modelagem 3D validados conforme normas aplicáveis.'
        }
          </p>
        </div>

        <div class="client-files-row">
          <div class="client-file-tags">
            <span class="file-chip">CAD: ${proj.cadFile}</span>
            <span class="file-chip">NORMA: ${Object.values(proj.specs || {})[1] || 'ABNT / NR'}</span>
            <span class="file-chip">ACESSO: ${proj.clientCode || 'CLIENTE2026'}</span>
          </div>

          <div style="display:flex;gap:0.55rem;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm js-client-dossier" data-id="${proj.id}">
              Baixar Dossiê / Memorial (.TXT)
            </button>
            <button type="button" class="btn btn-primary btn-sm js-client-3d" data-id="${proj.id}">
              Inspecionar em 3D
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  container.querySelectorAll('.js-client-dossier').forEach((btn) => {
    btn.onclick = () => {
      const proj = PROJECTS_DATA.find((p) => p.id === btn.dataset.id);
      if (proj) downloadClientDossier(proj);
    };
  });

  container.querySelectorAll('.js-client-3d').forEach((btn) => {
    btn.onclick = () => {
      const proj = PROJECTS_DATA.find((p) => p.id === btn.dataset.id);
      if (proj) {
        switchTab('visualizador');
        if (window.loadLabPreset) {
          window.loadLabPreset(proj.preset3d, proj.cadFile);
        }
      }
    };
  });

  if (window.lucide) window.lucide.createIcons();
}

function initClientPortal() {
  const form = document.getElementById('client-login-form');
  const errEl = document.getElementById('client-login-error');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name-input').value.trim();
    const code = document.getElementById('client-code-input').value.trim().toUpperCase();

    const validCodes = new Set([
      'CLIENTE2026',
      'LUCENA2026',
      ...PROJECTS_DATA.map((p) => (p.clientCode || 'CLIENTE2026').toUpperCase())
    ]);

    if (validCodes.has(code)) {
      clientSession = { name, code };
      sessionStorage.setItem(STORAGE_KEY_CLIENT_SESSION, JSON.stringify(clientSession));
      if (errEl) errEl.hidden = true;
      document.getElementById('client-code-input').value = '';
      closeUnifiedLoginModal();
      renderProjects();
      updateClientPortalUI();
      switchTab('cliente');
    } else {
      if (errEl) errEl.hidden = false;
    }
  });

  document.getElementById('btn-client-logout')?.addEventListener('click', () => {
    clientSession = null;
    sessionStorage.removeItem(STORAGE_KEY_CLIENT_SESSION);
    renderProjects();
    updateClientPortalUI();
    if (!isAdminLoggedIn) {
      switchTab('inicio');
    }
  });

  document.getElementById('btn-visitor-go-projects')?.addEventListener('click', () => {
    closeUnifiedLoginModal();
    switchTab('projetos');
  });

  document.getElementById('btn-visitor-go-contact')?.addEventListener('click', () => {
    closeUnifiedLoginModal();
    switchTab('contato');
  });

  updateClientPortalUI();
}

/* ==========================================================================
   8. FORMULÁRIO DE CONTATO & INICIALIZAÇÃO GERAL
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.textContent = 'Mensagem Registrada com Sucesso!';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      if (window.lucide) window.lucide.createIcons();
    }, 3000);
  });
}

function initThemeToggle() {
  const THEME_KEY = 'jose_portfolio_theme';
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);

    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      const iconName = theme === 'light' ? 'moon' : 'sun';
      btn.innerHTML = `<i data-lucide="${iconName}" id="theme-toggle-icon"></i>`;
      btn.title = theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro';
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  applyTheme(savedTheme);

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTabs();
  renderProjects();
  initProjectFiltersAndModal();
  initAdminAccessLevel();
  initClientPortal();
  initHeroViewport();
  initLabViewport();
  initContactForm();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

