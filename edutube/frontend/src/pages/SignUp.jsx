import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/client';
import { useAuth } from '../context/AuthContext';
import EduTubeLogo from '../components/EduTubeLogo';
import { RippleButton } from '@/components/ui/ripple-button';
import { ShineBorder } from '@/components/ui/shine-border';
import styles from './Auth.module.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await register({ email, password, name });
      setAuth(data.access_token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-gradient min-h-screen flex flex-col items-center justify-start pt-16 md:pt-24 p-8">
      <div className="relative w-full max-w-[400px] rounded-xl">
        <ShineBorder
          borderWidth={3}
          duration={10}
          shineColor={['#6366f1', '#8b5cf6', '#a855f7']}
          className="rounded-xl"
        />
        <div className={`${styles.card} relative rounded-xl border-0 shadow-xl m-[3px]`}>
        <div className={styles.cardLogo}>
          <EduTubeLogo asLink={true} size="lg" />
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <label htmlFor="email">Your email</label>
          <input
            id="email"
            type="email"
            placeholder="abc@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <RippleButton
            type="submit"
            className={`${styles.submit} w-full justify-center border-0`}
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </RippleButton>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/auth">Sign in here</Link>
        </p>
        <div className={styles.social}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">Dribbble</a>
        </div>
        </div>
      </div>
    </div>
  );
}
