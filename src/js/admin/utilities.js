function ensureToastHost() {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.style.position = 'fixed';
    host.style.right = '1rem';
    host.style.bottom = '1rem';
    host.style.zIndex = '999';
    host.style.display = 'flex';
    host.style.flexDirection = 'column';
    host.style.gap = '0.5rem';
    document.body.appendChild(host);
  }
  return host;
}

export function showToast(message, type = 'success') {
  const host = ensureToastHost();
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className =
    type === 'error'
      ? 'bg-red-600 text-white px-4 py-2 rounded shadow-lg text-sm'
      : 'bg-blue-600 text-white px-4 py-2 rounded shadow-lg text-sm';
  host.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

export function escHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}
