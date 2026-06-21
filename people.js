(() => {
  'use strict';

  // This module owns only the service-user directory. Other modules can later
  // request a small, explicit person summary instead of sharing page state.
  const storageKey = 'everchanging-people-v1';
  const defaultPeople = [
    { id: 'arthur-bennett', name: 'Arthur Bennett', floor: 'Willow', room: '12', status: 'settled', focus: 'GP follow-up', colour: 'arthur' },
    { id: 'priya-shah', name: 'Priya Shah', floor: 'Willow', room: '14', status: 'review', focus: 'Skin integrity review', colour: 'priya' },
    { id: 'rosemary-ellis', name: 'Rosemary Ellis', floor: 'Maple', room: '03', status: 'settled', focus: 'Family visit at 14:30', colour: 'rosemary' },
    { id: 'douglas-ward', name: 'Douglas Ward', floor: 'Maple', room: '07', status: 'watch', focus: 'Fluid intake observation', colour: 'douglas' },
    { id: 'mabel-hart', name: 'Mabel Hart', floor: 'Willow', room: '09', status: 'settled', focus: 'Activity at 11:30', colour: 'mabel' },
    { id: 'george-kelly', name: 'George Kelly', floor: 'Maple', room: '11', status: 'settled', focus: 'Care plan reviewed 18 Jun', colour: 'george' }
  ];
  const colourCycle = ['arthur', 'priya', 'rosemary', 'douglas', 'mabel', 'george'];
  const statusLabels = { settled: 'Settled', review: 'Review due', watch: 'Observe' };

  const ui = {
    add: document.querySelector('#add-person'),
    list: document.querySelector('#people-list'),
    empty: document.querySelector('#people-empty'),
    total: document.querySelector('#people-total'),
    search: document.querySelector('#people-search'),
    floor: document.querySelector('#people-floor-filter'),
    status: document.querySelector('#people-status-filter'),
    clear: document.querySelector('#clear-people-filters'),
    formDialog: document.querySelector('#person-dialog'),
    profileDialog: document.querySelector('#person-profile-dialog'),
    profile: document.querySelector('#person-profile-content'),
    form: document.querySelector('#person-form'),
    formLabel: document.querySelector('#person-form-label'),
    formTitle: document.querySelector('#person-form-title'),
    id: document.querySelector('#person-id'),
    name: document.querySelector('#person-name'),
    formFloor: document.querySelector('#person-floor'),
    room: document.querySelector('#person-room'),
    formStatus: document.querySelector('#person-status'),
    focus: document.querySelector('#person-focus')
  };

  let people = loadPeople();

  function loadPeople() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (Array.isArray(saved) && saved.every((person) => person.id && person.name)) return saved;
    } catch (_) {
      // A bad local record should never stop the directory from loading.
    }
    return defaultPeople.map((person) => ({ ...person }));
  }

  function savePeople() {
    window.localStorage.setItem(storageKey, JSON.stringify(people));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function matchingPeople() {
    const search = ui.search.value.trim().toLocaleLowerCase('en-GB');
    const floor = ui.floor.value;
    const status = ui.status.value;
    return people.filter((person) => {
      const matchesSearch = !search || [person.name, person.floor, person.room, person.focus].join(' ').toLocaleLowerCase('en-GB').includes(search);
      return matchesSearch && (floor === 'all' || person.floor === floor) && (status === 'all' || person.status === status);
    });
  }

  function render() {
    const visiblePeople = matchingPeople();
    ui.list.innerHTML = visiblePeople.map((person) => `
      <article class="person-card" data-person-id="${escapeHtml(person.id)}">
        <span class="person-photo ${escapeHtml(person.colour || 'arthur')}">${escapeHtml(initials(person.name))}</span>
        <div><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(person.floor)} · Room ${escapeHtml(person.room)}</p></div>
        <span class="person-status ${escapeHtml(person.status)}">${escapeHtml(statusLabels[person.status] || 'Settled')}</span>
        <div class="person-footer"><span>${escapeHtml(person.focus)}</span><button type="button" data-person-action="open" data-person-id="${escapeHtml(person.id)}">Open <span aria-hidden="true">→</span></button></div>
      </article>
    `).join('');
    ui.empty.hidden = visiblePeople.length !== 0;
    ui.total.textContent = `${visiblePeople.length} of ${people.length} ${people.length === 1 ? 'person' : 'people'} shown`;
    return visiblePeople.length;
  }

  function showDialog(dialog) {
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    else window.Everchanging.showToast('This browser does not support the form window.');
  }

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function openForm(person) {
    ui.form.reset();
    if (person) {
      ui.formLabel.textContent = 'Edit person';
      ui.formTitle.textContent = 'Keep their details current';
      ui.id.value = person.id;
      ui.name.value = person.name;
      ui.formFloor.value = person.floor;
      ui.room.value = person.room;
      ui.formStatus.value = person.status;
      ui.focus.value = person.focus;
    } else {
      ui.formLabel.textContent = 'New person';
      ui.formTitle.textContent = 'Add a person';
      ui.id.value = '';
      ui.focus.value = 'Initial assessment to be completed';
    }
    showDialog(ui.formDialog);
    window.setTimeout(() => ui.name.focus(), 0);
  }

  function openProfile(id) {
    const person = people.find((entry) => entry.id === id);
    if (!person) return;
    const status = statusLabels[person.status] || 'Settled';
    ui.profile.innerHTML = `
      <div class="profile-heading">
        <span class="person-photo ${escapeHtml(person.colour || 'arthur')}">${escapeHtml(initials(person.name))}</span>
        <div><p class="eyebrow">Person summary</p><h2>${escapeHtml(person.name)}</h2><p>${escapeHtml(person.floor)} · Room ${escapeHtml(person.room)}</p></div>
        <span class="person-status ${escapeHtml(person.status)}">${escapeHtml(status)}</span>
      </div>
      <div class="profile-grid">
        <section><p class="eyebrow">Today’s focus</p><h3>${escapeHtml(person.focus)}</h3><p>This summary belongs to the People directory. Care plans, notes and medicines will connect through a person reference when those modules are built.</p></section>
        <section><p class="eyebrow">Directory details</p><dl><div><dt>Location</dt><dd>${escapeHtml(person.floor)} floor, room ${escapeHtml(person.room)}</dd></div><div><dt>Current status</dt><dd>${escapeHtml(status)}</dd></div><div><dt>Record type</dt><dd>Demo data, stored locally</dd></div></dl></section>
      </div>
      <div class="profile-actions"><button class="outline-button" type="button" data-person-action="edit" data-person-id="${escapeHtml(person.id)}">Edit details</button><button class="add-button" type="button" data-dialog-close="person-profile-dialog">Done</button></div>
    `;
    showDialog(ui.profileDialog);
  }

  function savePerson(event) {
    event.preventDefault();
    const person = {
      id: ui.id.value || (window.crypto?.randomUUID?.() || `person-${Date.now()}`),
      name: ui.name.value.trim(),
      floor: ui.formFloor.value,
      room: ui.room.value.trim(),
      status: ui.formStatus.value,
      focus: ui.focus.value.trim(),
      colour: colourCycle[people.length % colourCycle.length]
    };
    if (!person.name || !person.room || !person.focus) return;
    const existingIndex = people.findIndex((entry) => entry.id === person.id);
    if (existingIndex >= 0) person.colour = people[existingIndex].colour || person.colour;
    if (existingIndex >= 0) people.splice(existingIndex, 1, person);
    else people.unshift(person);
    savePeople();
    render();
    closeDialog(ui.formDialog);
    window.Everchanging.showToast(existingIndex >= 0 ? `${person.name}'s details were updated.` : `${person.name} was added to the directory.`);
  }

  ui.add.addEventListener('click', () => openForm());
  ui.search.addEventListener('input', render);
  ui.floor.addEventListener('change', render);
  ui.status.addEventListener('change', render);
  ui.clear.addEventListener('click', () => {
    ui.search.value = '';
    ui.floor.value = 'all';
    ui.status.value = 'all';
    render();
    ui.search.focus();
  });
  ui.list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-person-action="open"]');
    if (button) openProfile(button.dataset.personId);
  });
  ui.profile.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-person-action="edit"]');
    const closeButton = event.target.closest('[data-dialog-close]');
    if (editButton) {
      closeDialog(ui.profileDialog);
      openForm(people.find((person) => person.id === editButton.dataset.personId));
    }
    if (closeButton) closeDialog(document.querySelector(`#${closeButton.dataset.dialogClose}`));
  });
  ui.form.addEventListener('submit', savePerson);
  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(document.querySelector(`#${button.dataset.dialogClose}`)));
  });
  window.addEventListener('everchanging:people-search', (event) => {
    ui.search.value = event.detail;
    const matches = render();
    window.Everchanging.showToast(matches ? `${matches} ${matches === 1 ? 'person' : 'people'} found.` : `No people match “${event.detail}”.`);
  });

  render();
})();
