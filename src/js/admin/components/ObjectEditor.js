import { showToast, escHtml } from '../utilities.js';

/**
 * Renders a single object (or single-field-wrapped scalar) as a small form
 * with one input per field and a Save button. Read + Update only — no
 * add/delete, since the CRUD rule reserves those for list fields.
 */
export const ObjectEditor = {
  mount({ container, label, data, fields, onSave }) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    this._render(el, { label, data, fields, onSave });
  },

  _render(el, state) {
    const { label, data, fields, onSave } = state;

    el.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <h3 class="font-bold text-lg text-white mb-4">${escHtml(label)}</h3>
        <div class="space-y-3" data-fields></div>
        <button type="button" data-save class="mt-4 bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded font-semibold text-sm">Save</button>
      </div>
    `;

    const fieldsHost = el.querySelector('[data-fields]');
    fields.forEach((f) => {
      const wrap = document.createElement('label');
      wrap.className = 'block text-sm text-slate-300';
      wrap.innerHTML = `
        <span class="block mb-1">${escHtml(f.label)}</span>
        <input type="${f.type === 'checkbox' ? 'checkbox' : f.type === 'number' ? 'number' : 'text'}"
               data-key="${escHtml(f.key)}"
               class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" />
      `;
      const input = wrap.querySelector('input');
      const value = data ? data[f.key] : undefined;
      if (f.type === 'checkbox') {
        input.checked = Boolean(value);
        input.className = 'ml-2';
      } else {
        input.value = value ?? '';
      }
      fieldsHost.appendChild(wrap);
    });

    el.querySelector('[data-save]').addEventListener('click', async () => {
      const value = {};
      fields.forEach((f) => {
        const input = fieldsHost.querySelector(`[data-key="${f.key}"]`);
        value[f.key] = f.type === 'checkbox' ? input.checked : f.type === 'number' ? Number(input.value) : input.value;
      });

      try {
        await onSave(value);
        showToast('Saved.');
        this._render(el, { label, data: value, fields, onSave });
      } catch (err) {
        showToast(err.message || 'Save failed.', 'error');
      }
    });
  },
};
