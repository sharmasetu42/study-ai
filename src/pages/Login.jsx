// ============================================================
//  Login.jsx  –  Connected to real backend via useAuth()
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

// ── Left illustration panel ───────────────────────────────────
const IllustrationPanel = () => (
  <div
    style={{
      background: 'linear-gradient(145deg, var(--primary-700) 0%, var(--secondary-600) 100%)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {[
      { size: 300, top: '-80px', left: '-80px' },
      { size: 200, bottom: '40px', right: '-60px' },
      { size: 150, top: '50%', right: '10%' },
    ].map((c, i) => (
      <div key={i} style={{ position: 'absolute', width: c.size, height: c.size, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: c.top, bottom: c.bottom, left: c.left, right: c.right }} />
    ))}

    <div style={{ width: 70, height: 70, background: 'rgba(255,255,255,0.15)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, border: '1.5px solid rgba(255,255,255,0.2)' }}>
      <GraduationCap size={36} color="#fff" />
    </div>

    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.25, marginBottom: 16 }}>
      Learn Smarter<br />With AI
    </h1>
    <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontSize: '1rem', lineHeight: 1.6, maxWidth: 280 }}>
      Your personal AI study assistant. Upload notes, ask questions, and ace your exams.
    </p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 36, justifyContent: 'center' }}>
      {['AI Tutor', 'Smart Quiz', 'Flashcards', 'Analytics'].map((f) => (
        <span key={f} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
          {f}
        </span>
      ))}
    </div>

    <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[{ value: '10K+', label: 'Students' }, { value: '95%', label: 'Pass Rate' }, { value: '500+', label: 'Topics' }].map((s) => (
        <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', minWidth: 80 }}>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>{s.value}</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Reusable input field ──────────────────────────────────────
const InputField = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, rightEl, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px solid ${error ? 'var(--error-400)' : focused ? 'var(--primary-400)' : 'var(--gray-300)'}`, borderRadius: 'var(--radius-md)', padding: '11px 14px', background: '#fff', transition: 'all var(--transition-fast)', boxShadow: focused ? '0 0 0 3px var(--primary-100)' : 'none' }}>
        {Icon && <Icon size={16} color={error ? 'var(--error-400)' : focused ? 'var(--primary-500)' : 'var(--gray-400)'} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--gray-800)', background: 'transparent' }} />
        {rightEl}
      </div>
      {error && <p style={{ color: 'var(--error-500)', fontSize: '0.78rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
const Login = () => {
  const { login } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password.trim()) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      // ── REAL API CALL via AuthContext ──────────────────────
      await login(form.email, form.password);
      // navigate('/dashboard') is called inside AuthContext.login()
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@studyai.com', password: 'password123' });
    showToast('Demo credentials filled in!', 'default');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gray-50)' }}>
      <div className="login-left" style={{ flex: 1, display: 'flex' }}>
        <IllustrationPanel />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display: 'none', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={22} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyAI</span>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>Welcome Back 👋</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Sign in to your account to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <InputField label="Email Address" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" icon={Mail} error={errors.email} />

            <InputField label="Password" type={showPass ? 'text' : 'password'} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" icon={Lock} error={errors.password}
              rightEl={
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0, display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              } />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--primary-600)', width: 15, height: 15 }} />
                Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600 }}>
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
              iconRight={!loading ? <ArrowRight size={16} /> : undefined} style={{ marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
          </div>

          <Button variant="outline" size="md" fullWidth onClick={fillDemo}>
            🚀 Use Demo Account
          </Button>

          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
              Register for free
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
      <style>{`
        @media (max-width: 768px) {
          .login-left  { display: none !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
