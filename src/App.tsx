import { useState } from 'react';
import LoginForm from './components/LoginForm';
import { LoginFormData, AuthState } from './types/auth';
import './App.css';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const handleLogin = async (data: LoginFormData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate authentication logic
      // For demo purposes, we'll accept any password longer than 6 characters
      if (data.password.length >= 6) {
        setAuthState({
          isAuthenticated: true,
          user: { role: data.role },
          loading: false,
          error: null,
        });
      } else {
        throw new Error('Ugyldige loginoplysninger');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Der opstod en fejl ved login',
      }));
    }
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  if (authState.isAuthenticated && authState.user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Velkommen!</h1>
        <p>Du er logget ind som: <strong>{authState.user.role === 'user' ? 'Bruger' : 'Administrator'}</strong></p>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Log ud
        </button>
      </div>
    );
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={authState.loading}
      error={authState.error}
    />
  );
}

export default App;
