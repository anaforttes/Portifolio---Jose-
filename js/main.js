import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

/* ==========================================================================
   1. BANCO DE DADOS DE PROJETOS (FÁCIL DE EDITAR E ADICIONAR NOVOS)
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 'prj-redutor',
    code: 'SW-ASM-001',
    title: 'Redutor de Velocidade Industrial de Eixos Paralelos',
    category: 'maquinas',
    software: 'SolidWorks 3D + Simulation',
    preset3d: 'gear',
    cadFile: 'PRT-01_ENGRENAGEM_MOD4.SLDPRT',
    summary:
      'Projeto mecânico completo de transmissão por engrenagens cilíndricas, dimensionamento segundo AGMA, seleção de rolamentos e carcaça bipartida.',
    specs: {
      Material: 'Aço Liga SAE 4140 / SAE 8620',
      Norma: 'AGMA 2001 / DIN 3990',
      Relacao: 'i = 4,5:1 (Potência 15 kW)',
      Tolerancia: 'ISO IT7 / GD&T Completo'
    },
    deliverables: [
      'Modelagem 3D paramétrica de conjunto (38 componentes)',
      'Memória de cálculo de engrenagens, eixos e chavetas',
      'Detalhamento executivo 2D para usinagem e lista de materiais (BOM)',
      'Arquivo STL/STEP para inspeção tridimensional'
    ]
  },
  {
    id: 'prj-flange',
    code: 'SW-PRT-002',
    title: 'Manifold & Flange de Alta Pressão ANSI B16.5',
    category: 'estruturas',
    software: 'SolidWorks Routing & FEA',
    preset3d: 'flange',
    cadFile: 'PRT-02_FLANGE_ANSI_300.SLDPRT',
    summary:
      'Conexão flangeada e tubulação industrial para linha de processo pressurizada, com verificação de aperto de estojos e vedação.',
    specs: {
      Material: 'Aço Carbono ASTM A105 / Inox 316L',
      Norma: 'ASME B16.5 / ASME B31.3',
      ClassePressao: 'Classe 300# (PN 50)',
      Processo: 'Forjamento + Torneamento CNC'
    },
    deliverables: [
      'Modelo paramétrico com tabela de projeto (Design Table) para múltiplos diâmetros',
      'Isométrico de tubulação e lista de corte/solda',
      'Análise de tensões no pescoço do flange via Elementos Finitos'
    ]
  },
  {
    id: 'prj-suporte',
    code: 'SW-FEA-003',
    title: 'Suporte Estrutural Otimizado para Atuador Hidráulico',
    category: 'simulacao',
    software: 'SolidWorks Simulation (FEA)',
    preset3d: 'bracket',
    cadFile: 'PRT-03_SUPORTE_ATUADOR.SLDPRT',
    summary:
      'Desenvolvimento e otimização estrutural de suporte submetido a cargas cíclicas de 45 kN, reduzindo 28% da massa mantendo Fator de Segurança > 2,5.',
    specs: {
      Material: 'Aço Estrutural ASTM A36 / SAE 1020',
      CargaNominal: '45 kN Axial + Momento Fletor',
      FatorSeguranca: 'FS = 2,65 (Von Mises)',
      Fabricacao: 'Corte Laser + Dobra + Solda MIG'
    },
    deliverables: [
      'Relatório de Simulação Estrutural Estática e Fadiga',
      'Arquivos DXF planificados para corte a laser',
      'Desenho de conjunto soldado com simbologia AWS/ABNT'
    ]
  },
  {
    id: 'prj-atuador',
    code: 'SW-ASM-004',
    title: 'Conjunto Êmbolo & Dispositivo de Prensagem Pneumática',
    category: 'maquinas',
    software: 'SolidWorks Motion & CAD',
    preset3d: 'piston',
    cadFile: 'ASM-04_CONJUNTO_EMBOLO.SLDASM',
    summary:
      'Dispositivo dedicado para linha de montagem automotiva com guiamento linear, alojamento de vedações e estudo cinemático de curso.',
    specs: {
      Material: 'Alumínio 7075-T6 / Aço Cromado',
      CursoTrabalho: '250 mm @ 6 bar',
      Acabamento: 'Anodização Dura + Retífica H7/g6',
      Norma: 'ISO 15552 / NR-12'
    },
    deliverables: [
      'Montagem completa com verificação de interferência dinâmica',
      'Especificação de anéis O-Ring, buchas guia e tolerâncias de ajuste',
      'Pacote técnico completo para fabricação em ferramentaria'
    ]
  }
];

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
  const specEntries = Object.entries(project.specs).slice(0, 4);

  return `
    <article class="project-card" data-category="${project.category}">
      <div class="project-blueprint-thumb">
        <div class="thumb-top-row">
          <span class="project-code-badge">${project.code}</span>
          <span class="project-software-badge">${project.software}</span>
        </div>

        <div class="thumb-svg-art">
          <svg width="78" height="78" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>

        <div class="thumb-bottom-row">
          <span>ARQUIVO: ${project.cadFile}</span>
          <span>ESCALA 1:1</span>
        </div>
      </div>

      <div class="project-body">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>

        <div class="project-specs-mini">
          ${specEntries
            .map(
              ([label, val]) => `
            <div class="spec-cell">
              <span>${label.toUpperCase()}</span>
              <strong>${val}</strong>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="project-actions">
          <button class="btn btn-secondary js-open-details" data-id="${project.id}">
            Ficha Técnica
          </button>
          <button class="btn btn-primary js-inspect-3d" data-id="${project.id}">
            Ver em 3D
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProjects(filter = 'todos', searchQuery = '') {
  const mainGrid = document.getElementById('projects-main-grid');
  const featuredGrid = document.getElementById('home-featured-grid');
  const badge = document.getElementById('project-count-badge');

  if (badge) badge.textContent = PROJECTS_DATA.length;

  // Renderiza destaques na Home (primeiros 3)
  if (featuredGrid) {
    featuredGrid.innerHTML = PROJECTS_DATA.slice(0, 3).map(createProjectCardHTML).join('');
  }

  // Filtra projetos na aba Projetos
  if (mainGrid) {
    const query = searchQuery.trim().toLowerCase();
    const filtered = PROJECTS_DATA.filter((p) => {
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
  const presets = ['gear', 'flange', 'bracket', 'piston'];
  const filenames = [
    'CONJUNTO_REDUTOR_V2.SLDASM',
    'FLANGE_ANSI_B16_5.SLDPRT',
    'SUPORTE_ESTRUTURAL_FEA.SLDPRT',
    'ATUADOR_EMBOLO_PINO.SLDASM'
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
  loadPresetIntoLab('gear', 'PRT-01_ENGRENAGEM_MOD4.SLDPRT');

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
   6. FORMULÁRIO DE CONTATO & INICIALIZAÇÃO GERAL
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

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderProjects();
  initProjectFiltersAndModal();
  initHeroViewport();
  initLabViewport();
  initContactForm();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

