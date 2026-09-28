import { apiGet, apiPatch, apiPost, apiDelete } from '../services.js';
import { ObjectEditor } from '../components/ObjectEditor.js';
import { ArrayEditor } from '../components/ArrayEditor.js';

const API = '/api/admin/header.php';

(async function init() {
  const data = await apiGet(API);

  ObjectEditor.mount({
    container: '#card-title',
    label: 'Title',
    data: { title: data.title },
    fields: [{ key: 'title', label: 'Header title' }],
    onSave: (val) => apiPatch(API, 'title', val.title),
  });

  ArrayEditor.mount({
    container: '#card-colors',
    label: 'Stripe Colors (Tailwind classes)',
    items: data.colors,
    itemType: 'string',
    onSave: (i, val) => apiPatch(API, 'colors', val, i),
    onDelete: (i) => apiDelete(API, 'colors', i),
    onAdd: (item) => apiPost(API, 'colors', item),
  });

  ObjectEditor.mount({
    container: '#card-scrollEffect',
    label: 'Scroll Behavior',
    data: data.scrollEffect,
    fields: [
      { key: 'hideOnScrollDown', label: 'Hide on scroll down', type: 'checkbox' },
      { key: 'revealThreshold', label: 'Reveal threshold (px)', type: 'number' },
    ],
    onSave: (val) => apiPatch(API, 'scrollEffect', val),
  });
})();
