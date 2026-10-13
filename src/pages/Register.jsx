// ============================================================
//  Register.jsx  –  Connected to real backend via useAuth()
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

// ── Left illustration panel ───────────────────────────────────
const IllustrationPanel = () => (
  <div style={{ background: 'linear-gradient(145deg, var(--secondary-600) 0%, var(--primary-700) 100%)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
    {[{ size: 280, top: '-60px', right: '-60px' }, { size: 180, bottom: '60px', left: '-40px' }].map((c, i) => (
      <div key={i} style={{ position: 'absolute', width: c.size, height: c.size, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: c.top, bottom: c.bottom, left: c.left, right: c.right }} />
    ))}
    <div style={{ width: 70, height: 70, background: 'rgba(255,255,255,0.15)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, border: '1.5px solid rgba(255,255,255,0.2)' }}>
      <GraduationCap size={36} color="#fff" />
    </div>
    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.25, marginBottom: 16 }}>
      Start Your<br />Learning Journey
    </h1>
    <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontSize: '1rem', lineHeight: 1.6, maxWidth: 280 }}>
      Join thousands of students studying smarter with AI.
    </p>
    <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {['AI-powered explanations for any topic', 'Auto-generated quizzes from your notes', 'Smart flashcards & spaced repetition', 'Detailed performance analytics'].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={13} color="#fff" />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Input field ───────────────────────────────────────────────
const InputField = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, rightEl, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px solid ${error ? 'var(--error-400)' : focused ? 'var(--primary-400)' : 'var(--gray-300)'}`, borderRadius: 'var(--radius-md)', padding: '11px 14px', background: '#fff', transition: 'all var(--transition-fast)', boxShadow: focused ? '0 0 0 3px var(--primary-100)' : 'none' }}>
        {Icon && <Icon size={16} color={error ? 'var(--error-400)' : focused ? 'var(--primary-500)' : 'var(--gray-400)'} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--gray-800)', background: 'transparent' }} />
        {rightEl}
      </div>
      {error && <p style={{ color: 'var(--error-500)', fontSize: '0.78rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
};

// ── Password strength meter ───────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special', pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['', 'var(--error-500)', 'var(--warning-500)', 'var(--warning-500)', 'var(--success-500)'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? colors[score] : 'var(--gray-200)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <span style={{ fontSize: '0.72rem', color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
const Register = () => {
  const { register } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = key => e => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      await register(form.fullName, form.email, form.password);
      // navigate('/dashboard') called inside AuthContext.register()
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gray-50)' }}>
      <div className="reg-left" style={{ flex: 1, display: 'flex' }}>
        <IllustrationPanel />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Mobile logo */}
          <div className="reg-mobile-logo" style={{ display: 'none', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyAI</span>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>Create Account ✨</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Join StudyAI and start learning smarter today</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputField label="Full Name" value={form.fullName} onChange={set('fullName')}
              placeholder="Setu Sharma" icon={User} error={errors.fullName} />

            <InputField label="Email Address" type="email" value={form.email} onChange={set('email')}
              placeholder="you@example.com" icon={Mail} error={errors.email} />

            <div>
              <InputField label="Password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={set('password')} placeholder="Create a strong password"
                icon={Lock} error={errors.password}
                rightEl={
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0, display: 'flex' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                } />
              <PasswordStrength password={form.password} />
            </div>

            <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword} onChange={set('confirmPassword')}
              placeholder="Re-enter your password" icon={Lock} error={errors.confirmPassword}
              rightEl={
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              } />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
              <input type="checkbox" required style={{ accentColor: 'var(--primary-600)', width: 14, height: 14, marginTop: 2, flexShrink: 0 }} />
              I agree to the{' '}
              <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Privacy Policy</span>
            </label>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
              iconRight={!loading ? <ArrowRight size={16} /> : undefined} style={{ marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <ToastContainer />
      <style>{`
        @media (max-width: 768px) {
          .reg-left        { display: none !important; }
          .reg-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;
