import { FAMILY_BY_EQUIPMENT } from '../data/equipment';
import type { Record as BitacoraRecord } from '../types/record';

function field<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function formatDate(epochMs: number): string {
  const [month, day, year] = new Date(epochMs).toLocaleDateString().split('/');
  return `${day}/${month}/${year}`;
}

// Rows are built as plain HTML strings, so these two icons (used only here)
// are inlined directly rather than routed through the Icon.astro component,
// which only runs at build/server time.
const ICON_EYE =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>';

const ICON_INBOX =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>';

function renderRow(record: BitacoraRecord, index: number): string {
  const family = FAMILY_BY_EQUIPMENT[record.Equipment];
  const famStyle = family ? ` style="--fam-color: ${family.color}"` : '';

  return `
    <tr>
      <td data-label="#"><span class="cell-idx">${String(index + 1).padStart(2, '0')}</span></td>
      <td data-label="Nombre"><span class="cell-name">${record.Name}</span></td>
      <td data-label="Usuario final"><span class="cell-lab">${record.EndUser}</span></td>
      <td data-label="Laboratorio"><span class="cell-lab">${record.Lab}</span></td>
      <td data-label="Equipo"><span class="equipment-tag"${famStyle}>${record.Equipment}</span></td>
      <td data-label="Fecha"><span class="cell-date">${formatDate(record.StartDateTime)}</span></td>
      <td><button type="button" class="view-btn" data-record-id="${record.ID}" aria-label="Ver detalle">${ICON_EYE}</button></td>
    </tr>
  `;
}

const EMPTY_ROW = `
  <tr class="empty-row">
    <td colspan="7">
      ${ICON_INBOX}
      <div>Sin registros para este filtro.</div>
    </td>
  </tr>
`;

export async function loadLogsTable() {
  const tbody = field<HTMLTableSectionElement>('tbody-logs');
  const equipment = field<HTMLSelectElement>('slt-equipment').value;
  const limit = field<HTMLSelectElement>('slt-limit').value;

  const response = await fetch(`/records/machine?type=${equipment}&limit=${limit}`, { method: 'GET' }).then((res) =>
    res.json(),
  );

  const records: BitacoraRecord[] = Array.isArray(response) ? response : [];

  tbody.innerHTML = records.length ? records.map(renderRow).join('') : EMPTY_ROW;
}

export function initLedger(onView: (id: number) => void) {
  field<HTMLButtonElement>('btn-search').addEventListener('click', loadLogsTable);

  field<HTMLTableSectionElement>('tbody-logs').addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-record-id]');
    if (!target) return;
    onView(Number(target.dataset.recordId));
  });

  loadLogsTable();
}
