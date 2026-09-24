import { initMasthead } from './masthead';
import { initEntryForm } from './entry-form';
import { initLedger, loadLogsTable } from './ledger';
import { initModal } from './modal';

initMasthead();

const openRecordModal = initModal();
initLedger(openRecordModal);
initEntryForm(loadLogsTable);
