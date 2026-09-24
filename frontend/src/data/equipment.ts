export interface EquipmentFamily {
  id: string;
  label: string;
  color: string;
  items: string[];
}

// Grouped by analytical technique so the ledger can mark each row with a
// family tick — this mirrors how the lab itself organizes its instruments.
export const FAMILIES: EquipmentFamily[] = [
  {
    id: 'sep',
    label: 'Separación',
    color: 'var(--fam-sep)',
    items: ['HPLC', 'UHPLC', 'UHPLC-MS', 'GC', 'TOC'],
  },
  {
    id: 'spec',
    label: 'Espectroscopía e imagen',
    color: 'var(--fam-spec)',
    items: ['UV', 'FTIR', 'NMR', 'EXRF', 'Microscopio electronico de barrido (SEM)'],
  },
  {
    id: 'elec',
    label: 'Electroquímica y electroforesis',
    color: 'var(--fam-elec)',
    items: [
      'Cuba electroforesis',
      'Potenciostato',
      'Documentador de geles',
      'Transiluminador',
      'Transiluminador UV',
    ],
  },
  {
    id: 'bio',
    label: 'Biología y titulación',
    color: 'var(--fam-bio)',
    items: ['PCR', 'Lector de microplacas', 'Titulador automático'],
  },
];

export const FAMILY_BY_EQUIPMENT: Record<string, EquipmentFamily> = Object.fromEntries(
  FAMILIES.flatMap((family) => family.items.map((item) => [item, family])),
);

// Equipment that requires a comment to justify the field entry (kept identical
// to the previous behaviour: liquid-chromatography instruments only).
export const COMMENT_REQUIRED = new Set(['HPLC', 'UHPLC', 'UHPLC-MS']);
