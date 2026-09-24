import toast from 'react-hot-toast';
import { FAMILY_BY_EQUIPMENT } from '../data/equipment';
import type { RecordDetail } from '../types/record';

function field<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function setStatus(itemId: string, valueId: string, active: boolean) {
  field(itemId).classList.toggle('active', active);
  field(valueId).textContent = active ? 'Sí' : 'No';
}

function renderDetail(detail: RecordDetail) {
  const { Record: record, Start, End } = detail;
  const family = FAMILY_BY_EQUIPMENT[record.Equipment];

  const badge = field<HTMLSpanElement>('modal-equipment');
  badge.textContent = record.Equipment;
  badge.style.setProperty('--fam-color', family?.color ?? '');

  field('modal-name').textContent = record.Name;
  field('modal-lab').textContent = record.Lab;
  field('modal-enduser').textContent = record.EndUser;
  field('modal-start').textContent = Start;
  field('modal-end').textContent = End;

  setStatus('modal-received-item', 'modal-received-value', record.Received);
  setStatus('modal-returned-item', 'modal-returned-value', record.Returned);

  field('modal-comments').textContent = record.Comments;
}

export function initModal() {
  const backdrop = field<HTMLDivElement>('modal-backdrop');

  const close = () => {
    backdrop.hidden = true;
  };

  field<HTMLButtonElement>('modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) close();
  });

  return async function openRecordModal(id: number) {
    const response = await fetch(`/records/open?id=${id}`, { method: 'GET' });
    if (!response.ok) {
      toast.error('No se pudo cargar el detalle del registro');
      return;
    }
    const detail: RecordDetail = await response.json();
    renderDetail(detail);
    backdrop.hidden = false;
  };
}
