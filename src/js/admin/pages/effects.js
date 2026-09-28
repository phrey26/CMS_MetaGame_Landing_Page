import { apiGet, apiPatch } from '../services.js';
import { ObjectEditor } from '../components/ObjectEditor.js';

const API = '/api/admin/effects.php';

(async function init() {
  const data = await apiGet(API);

  ObjectEditor.mount({
    container: '#card-reveal',
    label: 'Scroll Reveal',
    data: data.reveal,
    fields: [
      { key: 'threshold', label: 'Threshold (0-1)', type: 'number' },
      { key: 'rootMargin', label: 'Root margin' },
      { key: 'defaultDistance', label: 'Default distance (px)', type: 'number' },
      { key: 'defaultDuration', label: 'Default duration (ms)', type: 'number' },
    ],
    onSave: (val) => apiPatch(API, 'reveal', val),
  });

  ObjectEditor.mount({
    container: '#card-progressBar',
    label: 'Progress Bar',
    data: data.progressBar,
    fields: [
      { key: 'color', label: 'Color' },
      { key: 'height', label: 'Height (px)', type: 'number' },
    ],
    onSave: (val) => apiPatch(API, 'progressBar', val),
  });

  ObjectEditor.mount({
    container: '#card-tilt',
    label: 'Tilt',
    data: data.tilt,
    fields: [{ key: 'maxTilt', label: 'Max tilt (deg)', type: 'number' }],
    onSave: (val) => apiPatch(API, 'tilt', val),
  });
})();
