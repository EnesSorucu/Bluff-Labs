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
  document.getElementById('result-count').textContent = `${count} rol gösteriliyor`;
  document.getElementById('no-results').hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  selectedTeam = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterRoles();
}));
search.addEventListener('input', filterRoles);
const teamNames = {villagers:'KÖYLÜLER', werewolves:'KURTLAR', neutral:'TARAFSIZLAR'};
const teamColors = {villagers:'#22c55e', werewolves:'#ef4444', neutral:'#60a5fa'};
let roleData = JSON.parse(document.getElementById('role-data')?.textContent || 'null');
let roleLoad;
function loadRoles() {
  if (roleData) return Promise.resolve(roleData);
  if (!roleLoad) roleLoad = fetch('roles.json').then(response => {
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
  document.getElementById('dialog-description').textContent = 'Rol bilgisi yükleniyor…';
  roleDialog.showModal();
  try {
    await loadRoles();
    const role = roleData.find(item => item.id === card.dataset.role);
    if (document.getElementById('dialog-title').textContent === card.dataset.name) document.getElementById('dialog-description').textContent = role.description;
  } catch {
    document.getElementById('dialog-description').textContent = 'Rol bilgisi yüklenemedi. Lütfen bağlantını kontrol edip kartı yeniden aç.';
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
  setup: ['01 / HAZIRLIK', 'HERKESİN BİR SIRRI VAR.', 'Oyuncuları ekle ve masanın rol dağılımını belirle. Telefonu sırayla dolaştır; herkes kendi gizli kimliğini öğrensin.', '02-trust-no-one', 'Oyuncunun gizli rol ekranı'],
  night: ['02 / GECE', 'KÖY UYUR. KURTLAR UYANIR.', 'Gözler kapansın. Telefon gece aktif olan rollere geçsin. Oyuncular gizlice seçimlerini yapar; uygulama gece akışını yönetir.', '01-night-falls', 'Werewolf gece başlangıç ekranı'],
  day: ['03 / GÜNDÜZ & OYLAMA', 'ŞİMDİ HERKES MASUM.', 'Sabah haberlerini dinleyin, yaşananları tartışın ve şüpheli oyuncuyu oylayın. Bir blöf, bir suçlama, bir oy: masanın kaderi değişebilir.', '06-every-vote-counts', 'Werewolf oylama ekranı']
};
const phaseButtons = [...document.querySelectorAll('[data-phase]')];
function selectPhase(button) {
  phaseButtons.forEach(item => {
    item.setAttribute('aria-selected', String(item === button));
    item.tabIndex = item === button ? 0 : -1;
  });
  const phase = phases[button.dataset.phase];
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
