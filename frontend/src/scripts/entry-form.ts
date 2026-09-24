import toast from 'react-hot-toast';
import { COMMENT_REQUIRED } from '../data/equipment';

interface EntryPayload {
  name: string;
  lab: string;
  endUser: string;
  equipment: string;
  comments: string;
  startDateTime: number;
  endDateTime: number | null;
  received: boolean;
  returned: boolean;
}

function field<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function updateCommentsRequiredLabel() {
  const equipment = field<HTMLSelectElement>('equipment').value;
  const label = field<HTMLLabelElement>('required-comments');
  label.innerHTML = COMMENT_REQUIRED.has(equipment)
    ? 'Comentarios<span class="required">*</span>'
    : 'Comentarios';
}

function readForm(): EntryPayload {
  const date = field<HTMLInputElement>('date').value;
  const startTime = field<HTMLInputElement>('startTime').value;
  const endTime = field<HTMLInputElement>('endTime').value;

  return {
    name: field<HTMLInputElement>('name').value,
    lab: field<HTMLInputElement>('lab').value,
    endUser: field<HTMLInputElement>('endUser').value,
    equipment: field<HTMLSelectElement>('equipment').value,
    comments: field<HTMLTextAreaElement>('comments').value,
    startDateTime: new Date(`${date}T${startTime}`).getTime(),
    endDateTime: endTime ? new Date(`${date}T${endTime}`).getTime() : null,
    received: field<HTMLInputElement>('received').checked,
    returned: field<HTMLInputElement>('returned').checked,
  };
}

function verifyMandatoryFields(form: EntryPayload): boolean {
  if (Number.isNaN(form.startDateTime)) {
    toast.error('Ingrese una fecha y hora de inicio válidas');
    return false;
  }
  if (form.equipment === '') {
    toast.error('Seleccione un equipo');
    return false;
  }
  if (form.name === '') {
    toast.error('Ingrese su nombre');
    return false;
  }
  if (form.lab === '') {
    toast.error('Ingrese un laboratorio');
    return false;
  }
  if (COMMENT_REQUIRED.has(form.equipment) && form.comments === '') {
    toast.error('Debe ingresar un comentario');
    return false;
  }
  return true;
}

function cleanFieldsOnSuccess() {
  field<HTMLInputElement>('name').value = '';
  field<HTMLInputElement>('lab').value = '';
  field<HTMLInputElement>('endUser').value = '';
  field<HTMLSelectElement>('equipment').value = '';
  field<HTMLInputElement>('date').value = '';
  field<HTMLInputElement>('startTime').value = '';
  field<HTMLInputElement>('endTime').value = '';
  field<HTMLInputElement>('received').checked = false;
  field<HTMLInputElement>('returned').checked = false;
  field<HTMLTextAreaElement>('comments').value = '';
  updateCommentsRequiredLabel();
}

async function submitForm(form: EntryPayload): Promise<boolean> {
  const response = await fetch('/records/add', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(form),
  });

  if (response.status !== 201) {
    toast.error('Error al ingresar');
    return false;
  }

  toast.success('Ingresado exitosamente');
  cleanFieldsOnSuccess();
  return true;
}

export function initEntryForm(onSaved: () => void) {
  const formEl = document.getElementById('entry-form') as HTMLFormElement | null;
  const backdrop = field<HTMLDivElement>('entry-modal-backdrop');
  if (!formEl) return;

  const open = () => {
    backdrop.hidden = false;
  };
  const close = () => {
    backdrop.hidden = true;
  };

  field<HTMLButtonElement>('open-entry-btn').addEventListener('click', open);
  field<HTMLButtonElement>('entry-modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) close();
  });

  field<HTMLSelectElement>('equipment').addEventListener('change', updateCommentsRequiredLabel);

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = readForm();
    if (!verifyMandatoryFields(form)) return;
    const ok = await submitForm(form);
    if (ok) {
      close();
      onSaved();
    }
  });
}
