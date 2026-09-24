export function initMasthead() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;

  dateEl.textContent = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
