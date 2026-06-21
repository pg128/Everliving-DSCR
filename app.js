(() => {
  const appShell = document.querySelector('.app-shell');
  const navLinks = [...document.querySelectorAll('[data-view]')];
  const panels = [...document.querySelectorAll('[data-view-panel]')];
  const pageTitle = document.querySelector('#page-title');
  const pageEyebrow = document.querySelector('#page-eyebrow');
  const toast = document.querySelector('#toast');
  const dialog = document.querySelector('#record-dialog');
  const noteForm = document.querySelector('#note-form');
  let toastTimer;

  const headings = {
    overview: ['Good morning, Eleanor', 'Monday, 21 June'],
    people: ['People', 'Willow House · 24 people'],
    'care-plans': ['Care plans', 'Willow House · 24 people'],
    'daily-notes': ['Daily notes', 'Monday, 21 June'],
    medicines: ['Medicines', 'Monday, 21 June'],
    tasks: ['Tasks', 'Your day at Willow House'],
    reports: ['Reports', 'Willow House · June 2026'],
    help: ['Help centre', 'Everchanging support']
  };

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function showView(viewName, shouldUpdateHash = true) {
    const target = document.querySelector(`[data-view-panel="${viewName}"]`) || document.querySelector('[data-view-panel="overview"]');
    const resolvedName = target.dataset.viewPanel;
    panels.forEach((panel) => panel.classList.toggle('active', panel === target));
    navLinks.forEach((link) => link.classList.toggle('active', link.dataset.view === resolvedName));
    const [title, eyebrow] = headings[resolvedName] || headings.overview;
    pageTitle.textContent = title;
    pageEyebrow.textContent = eyebrow;
    document.title = `${title} — Everchanging`;
    if (shouldUpdateHash && window.location.hash !== `#${resolvedName}`) history.replaceState(null, '', `#${resolvedName}`);
    appShell.classList.remove('menu-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.Everchanging = { showToast, showView };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showView(link.dataset.view);
    });
  });

  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.viewTarget));
  });

  document.querySelector('.mobile-menu').addEventListener('click', () => {
    appShell.classList.toggle('menu-open');
  });

  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.toast));
  });

  function openNewNote() {
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    else showToast('New daily note ready to capture.');
  }

  document.querySelector('#new-note').addEventListener('click', openNewNote);
  document.querySelector('#quick-add').addEventListener('click', openNewNote);

  noteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    dialog.close();
    noteForm.reset();
    showToast('Daily note saved and linked to Rosemary’s record.');
  });

  document.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.parentElement;
      group.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
      showToast(`${button.textContent.trim()} selected.`);
    });
  });

  document.querySelectorAll('.task-row input').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) showToast('Task marked complete. Lovely work.');
    });
  });

  document.querySelector('#global-search').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const query = event.currentTarget.value;
    if (!query.trim()) return;
    showView('people');
    window.dispatchEvent(new CustomEvent('everchanging:people-search', { detail: query }));
  });

  const initialView = window.location.hash.slice(1);
  showView(headings[initialView] ? initialView : 'overview', false);
})();
