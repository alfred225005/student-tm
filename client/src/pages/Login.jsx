import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Check the server and your details.'); }
    finally { setBusy(false); }
  }
  return <main className="auth-layout"><section className="auth-intro"><div className="brand brand-light"><span className="brand-mark">S</span> StudyFlow</div><div><p className="eyebrow">YOUR STUDY SPACE</p><h1>Make room for your best work.</h1><p>One calm place to organize assignments, deadlines and progress.</p></div><div className="auth-note">Plan your work. Track your progress. Keep moving.</div></section><section className="auth-panel"><div className="auth-card"><p className="eyebrow">WELCOME BACK</p><h2>Log in to StudyFlow</h2><p className="muted">Pick up where you left off.</p><form onSubmit={submit} className="stack-form"><label>Email address<input type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label><label>Password<input type="password" autoComplete="current-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button></form><p className="auth-switch">New to StudyFlow? <Link to="/register">Create an account</Link></p></div></section></main>;
}
