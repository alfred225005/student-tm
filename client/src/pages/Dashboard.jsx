import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';

function dateLabel(value) {
  if (!value) return 'No due date';
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const [tasks, setTasks] = useState([]); const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(''); const [notice, setNotice] = useState('');
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null); const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('All');

  const loadTasks = useCallback(async () => {
    setLoading(true); setPageError('');
    try { const { data } = await api.get('/tasks'); setTasks(data.tasks); }
    catch (err) { setPageError(err.response?.data?.message || 'Could not load tasks. Check that the backend and database are running.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadTasks(); }, [loadTasks]);

  const counts = useMemo(() => ({ total: tasks.length, pending: tasks.filter(t => t.status === 'Pending').length, progress: tasks.filter(t => t.status === 'In Progress').length, completed: tasks.filter(t => t.status === 'Completed').length }), [tasks]);
  const filtered = useMemo(() => tasks.filter(t => (filter === 'All' || t.status === filter) && `${t.title} ${t.description || ''}`.toLowerCase().includes(search.toLowerCase())), [tasks, filter, search]);

  function openCreate() { setEditing(null); setModal(true); setNotice(''); }
  function openEdit(task) { setEditing(task); setModal(true); setNotice(''); }
  async function saveTask(form) {
    setSaving(true);
    try {
      if (editing) await api.put(`/tasks/${editing._id}`, form); else await api.post('/tasks', form);
      setModal(false); setEditing(null); setNotice(editing ? 'Task updated successfully.' : 'Task added successfully.'); await loadTasks();
    } finally { setSaving(false); }
  }
  async function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
    try { await api.delete(`/tasks/${task._id}`); setNotice('Task deleted.'); await loadTasks(); }
    catch (err) { setPageError(err.response?.data?.message || 'Could not delete task.'); }
  }
  async function toggleComplete(task) {
    try { await api.put(`/tasks/${task._id}`, { status: task.status === 'Completed' ? 'Pending' : 'Completed' }); await loadTasks(); }
    catch (err) { setPageError(err.response?.data?.message || 'Could not update task.'); }
  }
  function signOut() { logout(); navigate('/login'); }

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">S</span> StudyFlow</div><div className="side-label">WORKSPACE</div><div className="nav-item nav-item-active"><span>▦</span> My tasks</div><div className="sidebar-bottom"><div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</div><div className="user-details"><strong>{user?.name}</strong><span>{user?.email}</span></div><button className="icon-button logout-button" title="Log out" onClick={signOut} aria-label="Log out">↗</button></div></aside>
    <main className="main-content"><header className="topbar"><div><p className="eyebrow">STUDENT WORKSPACE</p><h1>My tasks</h1></div><button className="button button-primary" onClick={openCreate}><span>＋</span> Add task</button></header>
      <section className="welcome-row"><div><h2>Let's make progress, {user?.name?.split(' ')[0] || 'student'}.</h2><p className="muted">One task at a time. You've got this.</p></div><div className="date-chip">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div></section>
      <section className="stats-grid" aria-label="Task summary"><article className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon lavender">▤</span></div><strong>{counts.total}</strong><small>All your assignments</small></article><article className="stat-card"><div className="stat-top"><span>Pending</span><span className="stat-icon amber">◷</span></div><strong>{counts.pending}</strong><small>Ready to get started</small></article><article className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue">↗</span></div><strong>{counts.progress}</strong><small>Work underway</small></article><article className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green">✓</span></div><strong>{counts.completed}</strong><small>Look at you go</small></article></section>
      <section className="task-section"><div className="section-heading"><div><h2>Your assignments</h2><p className="muted">Keep everything moving forward.</p></div><span className="task-count">{filtered.length} shown</span></div>
        <div className="toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…" aria-label="Search tasks" /></label><label className="filter-label"><span>Filter</span><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></label></div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
        {pageError && <div className="error-panel" role="alert"><span>{pageError}</span><button className="button button-quiet" onClick={loadTasks}>Try again</button></div>}
        {loading ? <div className="empty-state"><div className="loading-dot"/><p>Loading your tasks…</p></div> : !pageError && filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">✓</div><h3>{tasks.length === 0 ? 'A fresh start' : 'No matching tasks'}</h3><p>{tasks.length === 0 ? 'Add your first assignment and make a plan.' : 'Try a different search or status filter.'}</p>{tasks.length === 0 && <button className="button button-primary" onClick={openCreate}>Create your first task</button>}</div> : <div className="task-list">{filtered.map(task => <article className="task-card" key={task._id}><button className={`task-check ${task.status === 'Completed' ? 'task-check-done' : ''}`} onClick={() => toggleComplete(task)} aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}>{task.status === 'Completed' ? '✓' : ''}</button><div className="task-main"><h3 className={task.status === 'Completed' ? 'completed-title' : ''}>{task.title}</h3>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className="due-date">◷ {dateLabel(task.dueDate)}</span><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority} priority</span></div></div><div className="task-actions"><span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span><button className="icon-button" onClick={() => openEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task">✎</button><button className="icon-button danger-hover" onClick={() => deleteTask(task)} aria-label={`Delete ${task.title}`} title="Delete task">×</button></div></article>)}</div>}
      </section><footer className="footer-note">A little progress each day adds up. <span>StudyFlow</span></footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><p className="eyebrow">TASK DETAILS</p><h2 id="modal-title">{editing ? 'Edit task' : 'Add a new task'}</h2></div><button className="icon-button" onClick={() => setModal(false)} aria-label="Close dialog">×</button></div><TaskForm initialTask={editing} onSave={saveTask} onCancel={() => setModal(false)} saving={saving}/></section></div>}
  </div>;
}
