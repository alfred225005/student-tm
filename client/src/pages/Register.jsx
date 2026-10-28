import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="auth-layout"><section className="auth-intro"><div className="brand brand-light"><span className="brand-mark">S</span> StudyFlow</div><div><p className="eyebrow">START FRESH</p><h1>Your goals deserve a plan.</h1><p>Create your student workspace and bring every assignment into focus.</p></div><div className="auth-note">Small steps make big progress.</div></section><section className="auth-panel"><div className="auth-card"><p className="eyebrow">CREATE YOUR ACCOUNT</p><h2>Join StudyFlow</h2><p className="muted">It only takes a minute to get started.</p><form onSubmit={submit} className="stack-form"><label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" maxLength="60" required /></label><label>Email address<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" required /></label><label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="new-password" minLength="8" required /><span className="field-help">Use at least 8 characters.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button></form><p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p></div></section></main>;
}
