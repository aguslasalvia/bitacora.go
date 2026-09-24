import { Toaster } from 'react-hot-toast';

// Renders the toast viewport. Notifications themselves are fired from plain
// TS via `toast.success(...)` / `toast.error(...)` (see src/scripts/toast.ts)
// — this is the only piece of the page that needs to be a React island.
export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: 'Archivo, system-ui, sans-serif',
          fontSize: '0.85rem',
          background: '#ffffff',
          color: '#10151a',
          border: '1px solid #ccd5cd',
          borderRadius: '4px',
          boxShadow: '0 14px 32px rgba(16, 21, 26, 0.12)',
        },
        success: { iconTheme: { primary: '#0e7c86', secondary: '#ffffff' } },
        error: { iconTheme: { primary: '#b3261e', secondary: '#ffffff' } },
      }}
    />
  );
}
