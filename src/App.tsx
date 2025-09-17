import { useState } from 'react';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import type { LoginFormData, AuthState } from './types/auth';
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
      <HomePage
        userRole={authState.user.role}
        onLogout={handleLogout}
      />
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
