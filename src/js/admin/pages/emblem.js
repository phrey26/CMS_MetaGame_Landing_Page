import { apiGet, apiPatch, apiPost, apiDelete } from '../services.js';
import { ArrayEditor } from '../components/ArrayEditor.js';

const API = '/api/admin/emblem.php';

(async function init() {
  const data = await apiGet(API);

  ArrayEditor.mount({
    container: '#card-stops',
    label: 'Emblem Color Stops',
    items: data.stops,
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'hex', label: 'Hex color' },
      { key: 'meaning', label: 'Meaning' },
    ],
    onSave: (i, val) => apiPatch(API, 'stops', val, i),
    onDelete: (i) => apiDelete(API, 'stops', i),
    onAdd: (item) => apiPost(API, 'stops', item),
  });
})();
