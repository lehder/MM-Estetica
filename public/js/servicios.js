let currentPage = 1;
let currentCategory = '';
const limit = 6;

// Imagen de respaldo garantizada para cualquier fallo de carga
const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80';

// Catálogo de fotografías exclusivas por tratamiento
const treatmentPhotos = {
  // Faciales
  'punta de diamante': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'hidrafacial': 'https://images.unsplash.com/photo-1512290900672-1f48039c362a?auto=format&fit=crop&w=800&q=80',
  'dermapen con vitaminas': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
  'dermapen exosomas y adn salmon': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'tratamiento vitamina c': 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=800&q=80',
  'tratamiento antimanchas': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  'tratamiento ojeras': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
  'tratamiento antiarrugas': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
  'hollywood peel': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  'masaje craneofacial': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  'laser facial shr': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',

  // Corporales
  'maderoterapia': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
  'drenaje linfatico manual': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  'presoterapia': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
  'masaje relajante (30 min)': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
  'masaje relajante y descontracturante (60 min)': 'https://images.unsplash.com/photo-1519824145371-296894a0dc91?auto=format&fit=crop&w=800&q=80',
  'laser corporal shr': 'https://images.unsplash.com/photo-1512290903048-84dc55673070?auto=format&fit=crop&w=800&q=80',
  'eliminacion de estrias': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
};

// Normalizar texto para comparación robusta
function normalizeString(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, '')
    .trim();
}

// Selector de imagen según título o categoría
function getTreatmentImage(title, category) {
  if (!title) {
    return category === 'CORPORAL'
      ? 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'
      : DEFAULT_FALLBACK_IMG;
  }

  const cleanTitle = normalizeString(title);

  for (const [key, url] of Object.entries(treatmentPhotos)) {
    const cleanKey = normalizeString(key);
    if (cleanTitle.includes(cleanKey) || cleanKey.includes(cleanTitle)) {
      return url;
    }
  }

  return category === 'CORPORAL'
    ? 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'
    : DEFAULT_FALLBACK_IMG;
}

// Obtener datos del endpoint de la API
async function fetchServices(page = 1, category = '') {
  const container = document.getElementById('servicesContainer');
  try {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando catálogo...</p>';

    let url = `/api/services?page=${page}&limit=${limit}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al conectar con el servidor.');

    const result = await response.json();
    renderCards(result.data);
    renderPagination(result.pagination);
  } catch (error) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gold-primary);">${error.message}</p>`;
  }
}

// Renderizado de tarjetas con control de errores de imagen
function renderCards(services) {
  const container = document.getElementById('servicesContainer');
  container.innerHTML = '';

  if (!services || services.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay tratamientos disponibles en esta categoría.</p>';
    return;
  }

  services.forEach(item => {
    const card = document.createElement('article');
    card.className = 'service-card';
    const imgUrl = getTreatmentImage(item.title, item.category);

    card.innerHTML = `
      <div class="card-image-wrap">
        <span class="card-badge-overlay">${item.category || 'ESTÉTICA'}</span>
        <img 
          src="${imgUrl}" 
          alt="${item.title}" 
          class="card-img" 
          loading="lazy"
          onerror="this.onerror=null; this.src='${DEFAULT_FALLBACK_IMG}';"
        >
      </div>
      <div class="card-body">
        <div>
          <h3>${item.title}</h3>
          <p>${item.description || 'Protocolo personalizado con aparatología de última generación.'}</p>
        </div>
        <div class="service-meta">
          <span>⏱ ${item.duration_min || 45} min</span>
          <a href="contacto.html?service=${encodeURIComponent(item.title)}">Reservar &rarr;</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Renderizado de botones de paginación
function renderPagination(pagination) {
  const pagWrapper = document.getElementById('paginationWrapper');
  pagWrapper.innerHTML = '';

  if (!pagination || pagination.totalPages <= 1) return;

  const { currentPage: page, totalPages } = pagination;

  // Botón anterior
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '←';
  prevBtn.disabled = page === 1;
  prevBtn.addEventListener('click', () => {
    currentPage = page - 1;
    fetchServices(currentPage, currentCategory);
  });
  pagWrapper.appendChild(prevBtn);

  // Botones numéricos
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === page ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      fetchServices(currentPage, currentCategory);
    });
    pagWrapper.appendChild(btn);
  }

  // Botón siguiente
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.textContent = '→';
  nextBtn.disabled = page === totalPages;
  nextBtn.addEventListener('click', () => {
    currentPage = page + 1;
    fetchServices(currentPage, currentCategory);
  });
  pagWrapper.appendChild(nextBtn);
}

// Inicialización de listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchServices(currentPage, currentCategory);

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCategory = e.currentTarget.dataset.category || '';
      currentPage = 1;
      fetchServices(currentPage, currentCategory);
    });
  });
});