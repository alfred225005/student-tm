import React from 'react';
import { useEffect, useState } from 'react';

const blank = { title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' };

export default function TaskForm({ initialTask, onSave, onCancel, saving }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) setForm({
      title: initialTask.title || '', description: initialTask.description || '',
      dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
      priority: initialTask.priority || 'Medium', status: initialTask.status || 'Pending'
    });
    else setForm(blank);
  }, [initialTask]);

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError('');
    if (!form.title.trim()) { setError('Please enter a task title.'); return; }
    try { await onSave({ ...form, title: form.title.trim() }); }
    catch (err) { setError(err.response?.data?.message || 'Could not save this task. Please try again.'); }
  }

  return <form className="task-form" onSubmit={submit}>
    <label>Task title *<input name="title" value={form.title} onChange={update} maxLength="100" required placeholder="e.g. Complete React assignment" /></label>
    <label>Description<textarea name="description" value={form.description} onChange={update} maxLength="500" rows="3" placeholder="Add a few details (optional)" /></label>
    <div className="form-grid">
      <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>
      <label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label>
    </div>
    <label>Status<select name="status" value={form.status} onChange={update}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save task'}</button><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button></div>
  </form>;
}
