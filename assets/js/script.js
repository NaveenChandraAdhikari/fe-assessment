
const loader = document.getElementById('loading');
const dictionaryContainer = document.querySelector('.dictionary-container');
const heroSearchInput = document.querySelector('.hero-search-input');
const heroSearchBtn = document.querySelector('.hero-search-btn');

// Pagination controls
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageNumbers = document.getElementById('page-numbers');
const pageSizeSelect = document.getElementById('pageSize');

// Filters + sorting
const filterWord = document.getElementById('filterWord');
const filterPhonetic = document.getElementById('filterPhonetic');
const filterOrigin = document.getElementById('filterOrigin');

// Filters + sorting
const sortBySelect = document.getElementById('sortBy');
const applyFiltersBtn = document.getElementById('applyFilters');

const state = {
  page: 1,
  limit: pageSizeSelect ? Number(pageSizeSelect.value) : 6,
  search: '',
  sortBy: [],
  totalCount: 0,
  totalPages: 1,
};

function buildQuery() {
  const qs = new URLSearchParams({
    page: String(state.page),
    limit: String(state.limit),
  });

  if (state.search) qs.set('search', state.search);
  if (state.sortBy.length) state.sortBy.forEach(s => qs.append('sortBy', s));

  return qs.toString();
}

applyFiltersBtn.addEventListener('click', () => {
  const sortVal = sortBySelect.value;
  state.sortBy = sortVal ? [sortVal] : [];
  state.page = 1;
  updateList();
});



async function isAuthenticated() {
  try {
    const res = await fetch('http://localhost:3000/words?page=1&limit=1', { credentials: 'include' });
    return res.ok;
  } catch {
    return false;
  }
}


async function fetchPage() {
  if (!await isAuthenticated()) {
    window.location.href = '/login.html';
    return [];
  }
  const url = `http://localhost:3000/words?${buildQuery()}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch words: ' + res.status);

  const payload = await res.json(); // { status, count, page, page_size, data }
  state.totalCount = payload.count || 0;
  state.page = payload.page || state.page;
  state.limit = payload.page_size || state.limit;
  state.totalPages = Math.max(1, Math.ceil(state.totalCount / state.limit));

  return payload.data || [];
}
function renderPageNumbers() {
  pageNumbers.innerHTML = '';

  const makeBtn = (label, targetPage, active = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.className = 'page-link';
    btn.textContent = label;
    if (active) btn.classList.add('active');
    if (disabled) {
      btn.disabled = true;
      btn.classList.add('disabled');
    } else {
      btn.addEventListener('click', () => {
        if (targetPage !== state.page) {
          state.page = targetPage;
          updateList();
        }
      });
    }
    return btn;
  };

  const { page, totalPages } = state;
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, Math.min(start, Math.max(1, end - windowSize + 1)));

  if (start > 1) {
    pageNumbers.appendChild(makeBtn('1', 1, page === 1));
    if (start > 2) pageNumbers.appendChild(document.createTextNode(' ... '));
  }
  for (let p = start; p <= end; p++) {
    pageNumbers.appendChild(makeBtn(String(p), p, p === page));
  }
  if (end < totalPages) {
    if (end < totalPages - 1) pageNumbers.appendChild(document.createTextNode(' ... '));
    pageNumbers.appendChild(makeBtn(String(totalPages), totalPages, page === totalPages));
  }
}

function updatePrevNext() {
  prevButton.disabled = state.page === 1;
  nextButton.disabled = state.page === state.totalPages;
}

async function updateList() {
  loader.style.display = 'flex';
  dictionaryContainer.innerHTML = '';
  try {
    const words = await fetchPage();
    if (!words.length) {
      dictionaryContainer.innerHTML = '<p>No words found.</p>';
    } else {
      words.forEach(w => dictionaryContainer.appendChild(createWordCard(w)));
    }
    renderPageNumbers();
    updatePrevNext();
  } catch (e) {
    console.error(e);
    dictionaryContainer.innerHTML = '<p>Error loading words.</p>';
  } finally {
    loader.style.display = 'none';
  }
}

// Pagination buttons
prevButton.addEventListener('click', () => {
  if (state.page > 1) {
    state.page -= 1;
    updateList();
  }
});
nextButton.addEventListener('click', () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    updateList();
  }
});

if (pageSizeSelect) {
  pageSizeSelect.addEventListener('change', (e) => {
    state.limit = Number(e.target.value) || 6;
    state.page = 1;
    updateList();
  });
}

// Search (debounced)
let searchTimer = null;
heroSearchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = heroSearchInput.value.trim();
    state.page = 1;
    updateList();
  }, 300);
});
heroSearchBtn.addEventListener('click', () => {
  state.search = heroSearchInput.value.trim();
  state.page = 1;
  updateList();
});
heroSearchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    state.search = heroSearchInput.value.trim();
    state.page = 1;
    updateList();
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  const res = await fetch('http://localhost:3000/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (res.ok) {
    window.location.href = '/login.html';
  } else {
    alert('Failed to log out.');
  }
});
document.getElementById('addWordForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const meaningsInput = document.getElementById('newMeanings').value.trim();
  const meanings = meaningsInput ? meaningsInput.split(',').map(m => m.trim()) : []; // Split into array

  const payload = {
    word: document.getElementById('newWord').value.trim(),
    phonetic: document.getElementById('newPhonetic').value.trim(),
    origin: document.getElementById('newOrigin').value.trim(),
    meanings: meanings // Send as array
  };

  if (!payload.word) {
    alert("Word is required!");
    return;
  }
  // Optional: Require at least one meaning
  if (payload.meanings.length === 0) {
    alert("At least one meaning is required!");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/words/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to add word (${res.status})`);
    }

    // Clear form + close modal + refresh list
    e.target.reset();
    addWordModal.classList.add('hidden');
    updateList();
  } catch (err) {
    console.error(err);
    alert('Error adding word. Check console for details.');
  }
});


document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.stopPropagation(); // prevent navigation
    const id = btn.getAttribute('data-id');
    if (!confirm('Delete this word?')) return;
    const res = await fetch(`http://localhost:3000/words/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      updateList(); //Refresh
    } else {
      alert('Failed to delete word.');
    }
  });
});

function createWordCard(word) {
  const card = document.createElement('div');
  card.className = 'word-card';

  card.innerHTML = `
    <div class="word-content">
      <h4 class="word-title">${word.word}</h4>
      <p class="word-phonetic">${word.phonetic || 'N/A'}</p>
      <p class="word-description">${word.origin || 'N/A'}</p>
      <button class="delete-btn" data-id="${word.id}">Delete</button>
    </div>
  `;

  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this word?')) return;

    const res = await fetch(`http://localhost:3000/words/${word.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      updateList();
    } else {
      alert('Failed to delete word.');
    }
  });

 
  card.addEventListener('click', () => {
    localStorage.setItem('selectedWord', word.word);
    window.location.href = `detail.html?word=${encodeURIComponent(word.word)}`;
  });

  return card;
}

const addWordModal = document.getElementById('addWordModal');
const openModalBtn = document.getElementById('openAddWordModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
  addWordModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  addWordModal.classList.add('hidden');
});



// Initial load
updateList();
