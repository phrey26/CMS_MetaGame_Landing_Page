import { apiGet, apiPatch, apiPost, apiDelete } from '../services.js';
import { ObjectEditor } from '../components/ObjectEditor.js';
import { ArrayEditor } from '../components/ArrayEditor.js';

const API = '/api/admin/navbar.php';

(async function init() {
  const data = await apiGet(API);

  ObjectEditor.mount({
    container: '#card-logo',
    label: 'Logo',
    data: data.logo,
    fields: [
      { key: 'src', label: 'Image src' },
      { key: 'alt', label: 'Alt text' },
    ],
    onSave: (val) => apiPatch(API, 'logo', val),
  });

  ObjectEditor.mount({
    container: '#card-cta',
    label: 'Join Button',
    data: data.cta,
    fields: [
      { key: 'text', label: 'Button text' },
      { key: 'url', label: 'URL' },
    ],
    onSave: (val) => apiPatch(API, 'cta', val),
  });

  ArrayEditor.mount({
    container: '#card-links',
    label: 'Navigation Links',
    items: data.links,
    fields: [
      { key: 'text', label: 'Link text' },
      { key: 'url', label: 'URL' },
    ],
    onSave: (i, val) => apiPatch(API, 'links', val, i),
    onDelete: (i) => apiDelete(API, 'links', i),
    onAdd: (item) => apiPost(API, 'links', item),
  });
})();
