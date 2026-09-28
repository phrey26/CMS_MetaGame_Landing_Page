import { showToast, escHtml } from '../utilities.js';

/**
 * Renders a list field with full CRUD: each item is editable and deletable,
 * plus an "add new" row. itemType 'object' renders `fields` as a mini-form
 * per item; itemType 'string' renders each item as one plain text input
 * (e.g. header's `colors`, a list of class-name strings, not objects).
 */
export const ArrayEditor = {
  mount({ container, label, items, fields = [], itemType = 'object', onSave, onAdd, onDelete }) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    this._render(el, { label, items, fields, itemType, onSave, onAdd, onDelete });
  },

  _readRow(row, fields, itemType) {
    if (itemType === 'string') {
      return row.querySelector('[data-value]').value;
    }
    const value = {};
    fields.forEach((f) => {
      value[f.key] = row.querySelector(`[data-key="${f.key}"]`).value;
    });
    return value;
  },

  _rowFieldsHtml(fields, itemType, item) {
    if (itemType === 'string') {
      return `<input type="text" data-value class="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" value="${escHtml(item ?? '')}" />`;
    }
    return fields
      .map(
        (f) => `
        <input type="text" data-key="${escHtml(f.key)}" placeholder="${escHtml(f.label)}"
               class="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
               value="${escHtml(item ? item[f.key] : '')}" />`
      )
      .join('');
  },

  _render(el, state) {
    const { label, items, fields, itemType, onSave, onAdd, onDelete } = state;

    el.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <h3 class="font-bold text-lg text-white mb-4">${escHtml(label)}</h3>
        <div class="space-y-2" data-rows></div>
        <div class="flex gap-2 mt-4 pt-4 border-t border-slate-700" data-add-row>
          ${this._rowFieldsHtml(fields, itemType, null)}
          <button type="button" data-add class="bg-green-600 hover:bg-green-500 transition text-white px-4 py-2 rounded font-semibold text-sm shrink-0">Add</button>
        </div>
      </div>
    `;

    const rowsHost = el.querySelector('[data-rows]');
    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'flex gap-2 items-center';
      row.dataset.index = String(index);
      row.innerHTML = `
        ${this._rowFieldsHtml(fields, itemType, item)}
        <button type="button" data-row-save class="bg-blue-600 hover:bg-blue-500 transition text-white px-3 py-2 rounded text-sm shrink-0">Save</button>
        <button type="button" data-row-delete class="bg-red-600 hover:bg-red-500 transition text-white px-3 py-2 rounded text-sm shrink-0">Delete</button>
      `;

      row.querySelector('[data-row-save]').addEventListener('click', async () => {
        const value = this._readRow(row, fields, itemType);
        try {
          const res = await onSave(index, value);
          showToast('Saved.');
          this._render(el, { label, items: res.items, fields, itemType, onSave, onAdd, onDelete });
        } catch (err) {
          showToast(err.message || 'Save failed.', 'error');
        }
      });

      row.querySelector('[data-row-delete]').addEventListener('click', async () => {
        try {
          const res = await onDelete(index);
          showToast('Deleted.');
          this._render(el, { label, items: res.items, fields, itemType, onSave, onAdd, onDelete });
        } catch (err) {
          showToast(err.message || 'Delete failed.', 'error');
        }
      });

      rowsHost.appendChild(row);
    });

    el.querySelector('[data-add]').addEventListener('click', async () => {
      const addRow = el.querySelector('[data-add-row]');
      const value = this._readRow(addRow, fields, itemType);
      try {
        const res = await onAdd(value);
        showToast('Added.');
        this._render(el, { label, items: res.items, fields, itemType, onSave, onAdd, onDelete });
      } catch (err) {
        showToast(err.message || 'Add failed.', 'error');
      }
    });
  },
};
