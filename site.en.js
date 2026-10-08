'use strict';
const roles = document.querySelectorAll('.role-card');
const filters = document.querySelectorAll('[data-filter]');
const search = document.getElementById('role-search');
let selectedTeam = 'all';
const normalized = value => value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g,'i');
function filterRoles() {
  const query = normalized(search.value.trim());
  let count = 0;
  roles.forEach(card => {
    const visible = (selectedTeam === 'all' || card.dataset.team === selectedTeam) && normalized(card.dataset.name).includes(query);
    card.hidden = !visible;
    if (visible) count++;
  });
  document.getElementById('result-count').textContent = `${count} roles shown`;
  document.getElementById('no-results').hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  selectedTeam = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterRoles();
}));
search?.addEventListener('input', filterRoles);
const teamNames = {villagers:'VILLAGERS', werewolves:'WEREWOLVES', neutral:'NEUTRALS'};
const teamColors = {villagers:'#22c55e', werewolves:'#ef4444', neutral:'#60a5fa'};
let roleData = JSON.parse(document.getElementById('role-data')?.textContent || 'null');
let roleLoad;
function loadRoles() {
  if (roleData) return Promise.resolve(roleData);
  if (!roleLoad) roleLoad = fetch('roles.en.json').then(response => {
    if (!response.ok) throw new Error('Role data unavailable');
    return response.json();
  }).then(data => { roleData = data; return data; }).catch(error => { roleLoad = null; throw error; });
  return roleLoad;
}
const roleDialog = document.getElementById('role-dialog');
roles.forEach(card => card.addEventListener('click', async () => {
  document.getElementById('dialog-title').textContent = card.dataset.name;
  document.getElementById('dialog-team').textContent = teamNames[card.dataset.team];
  document.getElementById('dialog-team').style.color = teamColors[card.dataset.team];
  document.getElementById('dialog-image').src = card.querySelector('img').getAttribute('src');
  document.getElementById('dialog-image').alt = card.dataset.name;
  document.getElementById('dialog-description').textContent = 'Loading role information…';
  roleDialog.showModal();
  try {
    await loadRoles();
    const role = roleData.find(item => item.id === card.dataset.role);
    if (document.getElementById('dialog-title').textContent === card.dataset.name) document.getElementById('dialog-description').textContent = role.description;
  } catch {
    document.getElementById('dialog-description').textContent = 'Role information could not load. Please check your connection and open the card again.';
  }
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
const phases = {
  setup: ['01 / SETUP', 'BUILD YOUR TABLE.', 'Add names, choose player avatars and pick the roles for your table. When everyone is ready, start passing the phone.', 'player-setup', 'Add-player screen'],
  reveal: ['02 / SECRET IDENTITY', 'TAKE A SECRET LOOK.', 'When the phone reaches you, check your role in private. Learn your identity, hide the screen and pass the phone to the next player.', '02-trust-no-one', 'Player secret-role screen'],
  night: ['03 / NIGHT', 'THE VILLAGE SLEEPS. WOLVES WAKE.', 'Close your eyes. Pass the phone to the active night roles. Players make secret choices while the app guides the night.', '01-night-falls', 'Werewolf night screen'],
  day: ['04 / DAY & VOTING', 'NOW EVERYONE IS INNOCENT.', 'Read the morning news, discuss what happened and vote on a suspect. One bluff, one accusation, one vote can change the table.', '06-every-vote-counts', 'Werewolf voting screen']
};
const phaseButtons = [...document.querySelectorAll('[data-phase]')];
function selectPhase(button) {
  phaseButtons.forEach(item => {
    item.setAttribute('aria-selected', String(item === button));
    item.tabIndex = item === button ? 0 : -1;
  });
  const phase = phases[button.dataset.phase];
  document.getElementById('setup-avatars').hidden = button.dataset.phase !== 'setup';
  document.getElementById('phase-note').textContent = button.dataset.phase === 'setup' ? 'PLAYERS READY. THE TABLE IS YOURS.' : 'GOLDEN RULE: NEVER SHOW YOUR ROLE.';
  document.getElementById('phase-label').textContent = phase[0];
  document.getElementById('phase-title').textContent = phase[1];
  document.getElementById('phase-description').textContent = phase[2];
  document.getElementById('phase-image').src = `assets/store/${phase[3]}.webp`;
  document.getElementById('phase-image').alt = phase[4];
  document.getElementById('phase-content').setAttribute('aria-labelledby', button.id);
}
phaseButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectPhase(button));
  button.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight','ArrowDown'].includes(event.key)) next = (index + 1) % phaseButtons.length;
    if (['ArrowLeft','ArrowUp'].includes(event.key)) next = (index - 1 + phaseButtons.length) % phaseButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = phaseButtons.length - 1;
    if (next !== undefined) { event.preventDefault(); selectPhase(phaseButtons[next]); phaseButtons[next].focus(); }
  });
});
document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => {
  const gallery = document.getElementById('store-gallery');
  gallery.scrollBy({left: gallery.clientWidth * .75 * Number(button.dataset.scroll), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}));
const imageDialog = document.getElementById('image-dialog');
let currentGallery = [], imageIndex = 0;
function showGalleryImage() {
  const current = currentGallery[imageIndex];
  document.getElementById('lightbox-image').src = current.dataset.image;
  document.getElementById('lightbox-image').alt = current.querySelector('img').alt;
  document.getElementById('image-position').textContent = `${imageIndex + 1} / ${currentGallery.length}`;
}
function moveImage(direction) { imageIndex = (imageIndex + direction + currentGallery.length) % currentGallery.length; showGalleryImage(); }
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  currentGallery = [...document.querySelectorAll(`[data-gallery="${button.dataset.gallery}"]`)];
  imageIndex = currentGallery.indexOf(button);
  showGalleryImage();
  imageDialog.showModal();
}));
document.getElementById('image-prev').addEventListener('click', () => moveImage(-1));
document.getElementById('image-next').addEventListener('click', () => moveImage(1));
imageDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveImage(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); moveImage(1); }
});
