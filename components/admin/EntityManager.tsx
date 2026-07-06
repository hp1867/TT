'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, X, Save, Loader2 } from 'lucide-react';
import { apiGet, apiCreate, apiUpdate, apiDelete } from '@/lib/adminClient';
import { cn } from '@/lib/utils';

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'image';

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  step?: string;
};

export type ColumnDef = {
  name: string;
  label: string;
  image?: boolean;
};

type Row = { id: string } & Record<string, any>;

export default function EntityManager({
  title,
  endpoint,
  fields,
  columns,
}: {
  title: string;
  endpoint: string;
  fields: FieldDef[];
  columns: ColumnDef[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Row[]>(endpoint);
      setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openNew = () => {
    const blank: Row = { id: '' };
    fields.forEach((f) => (blank[f.name] = f.type === 'number' ? 0 : ''));
    setEditing(blank);
    setIsNew(true);
  };

  const openEdit = (row: Row) => {
    setEditing({ ...row });
    setIsNew(false);
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${row[columns[0].name] ?? row.id}"?`)) return;
    await apiDelete(`${endpoint}/${row.id}`);
    await load();
  };

  const save = async () => {
    if (!editing) return;
    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      payload[f.name] =
        f.type === 'number' ? Number(editing[f.name]) || 0 : editing[f.name];
    });
    if (isNew) {
      await apiCreate(endpoint, payload);
    } else {
      await apiUpdate(`${endpoint}/${editing.id}`, payload);
    }
    setEditing(null);
    await load();
  };

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neon-grad text-ink-950 text-xs font-semibold shadow-glow"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <div className="py-10 grid place-items-center text-white/50">
            <Loader2 className="animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-white/50 text-sm">
            Nothing here yet. Click “Add”.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 text-xs uppercase tracking-wider">
                {columns.map((c) => (
                  <th key={c.name} className="py-2 pr-3 font-normal">
                    {c.label}
                  </th>
                ))}
                <th className="py-2 pr-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/5">
                  {columns.map((c, i) => (
                    <td key={c.name} className="py-3 pr-3 align-middle">
                      {c.image ? (
                        <div className="flex items-center gap-3">
                          {row[c.name] && (
                            <img
                              src={row[c.name]}
                              className="h-8 w-8 rounded-lg object-cover"
                              alt=""
                            />
                          )}
                          {i === 0 ? '' : null}
                        </div>
                      ) : (
                        <span className={i === 0 ? 'font-medium' : 'text-white/70'}>
                          {String(row[c.name] ?? '')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 pr-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => openEdit(row)}
                        className="h-8 w-8 grid place-items-center rounded-lg glass text-white/60 hover:text-white"
                        aria-label="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => remove(row)}
                        className="h-8 w-8 grid place-items-center rounded-lg glass text-white/60 hover:text-rose-400"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit / create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl glass-strong p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold">
                {isNew ? `Add ${title.replace(/s$/, '')}` : 'Edit'}
              </h4>
              <button
                onClick={() => setEditing(null)}
                className="h-8 w-8 grid place-items-center rounded-lg glass"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div
                  key={f.name}
                  className={cn(
                    f.type === 'textarea' || f.type === 'image'
                      ? 'sm:col-span-2'
                      : '',
                  )}
                >
                  <label className="text-xs uppercase tracking-[0.16em] text-white/50">
                    {f.label}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      value={editing[f.name] ?? ''}
                      onChange={(e) =>
                        setEditing({ ...editing, [f.name]: e.target.value })
                      }
                      className="mt-2 w-full h-11 px-3 rounded-xl bg-ink-800 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
                    >
                      <option value="">—</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={editing[f.name] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setEditing({ ...editing, [f.name]: e.target.value })
                      }
                      className="mt-2 w-full p-3 rounded-xl bg-ink-800 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      step={f.step}
                      value={editing[f.name] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setEditing({ ...editing, [f.name]: e.target.value })
                      }
                      className="mt-2 w-full h-11 px-3 rounded-xl bg-ink-800 border border-white/10 focus:border-neon-cyan/60 outline-none text-sm"
                    />
                  )}
                  {f.type === 'image' && editing[f.name] && (
                    <img
                      src={editing[f.name]}
                      alt=""
                      className="mt-2 h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl glass text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-grad text-ink-950 text-sm font-semibold shadow-glow"
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
