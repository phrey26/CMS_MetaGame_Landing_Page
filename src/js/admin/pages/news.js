import { apiGet, apiPatch, apiPost, apiDelete } from '../services.js';
import { ArrayEditor } from '../components/ArrayEditor.js';

const API = '/api/admin/news.php';

(async function init() {
  const data = await apiGet(API);

  ArrayEditor.mount({
    container: '#card-items',
    label: 'News Items',
    items: data.items,
    fields: [
      { key: 'img', label: 'Image path' },
      { key: 'alt', label: 'Alt text' },
      { key: 'title', label: 'Title' },
      { key: 'desc', label: 'Description' },
    ],
    onSave: (i, val) => apiPatch(API, 'items', val, i),
    onDelete: (i) => apiDelete(API, 'items', i),
    onAdd: (item) => apiPost(API, 'items', item),
  });
})();
