import { useForm } from 'react-hook-form';
import type { LoginFormData, LoginFormProps } from '../../types/auth';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSubmit, loading = false, error = null }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      role: 'user',
      password: '',
    },
  });

  const onFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Error handling is managed by parent component
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={styles.form}
        data-testid="login-form"
        noValidate
      >
        <h1 className={styles.title}>Log ind</h1>

        {/* Role Selection */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Vælg rolle</legend>

          <div className={styles.radioGroup}>
            <div className={styles.radioItem}>
              <input
                type="radio"
                id="role-user"
                value="user"
                {...register('role', { required: 'Vælg venligst en rolle' })}
                className={styles.radioInput}
                data-testid="role-user"
                aria-describedby={errors.role ? 'role-error' : undefined}
              />
              <label htmlFor="role-user" className={styles.radioLabel}>
                Bruger
              </label>
            </div>

            <div className={styles.radioItem}>
              <input
                type="radio"
                id="role-administrator"
                value="administrator"
                {...register('role', { required: 'Vælg venligst en rolle' })}
                className={styles.radioInput}
                data-testid="role-administrator"
                aria-describedby={errors.role ? 'role-error' : undefined}
              />
              <label htmlFor="role-administrator" className={styles.radioLabel}>
                Administrator
              </label>
            </div>
          </div>

          {errors.role && (
            <div
              id="role-error"
              className={styles.errorMessage}
              role="alert"
              aria-live="polite"
              data-testid="role-error"
            >
              {errors.role.message}
            </div>
          )}
        </fieldset>

        {/* Password Field */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Adgangskode
          </label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Adgangskode er påkrævet',
              minLength: {
                value: 6,
                message: 'Adgangskode skal være mindst 6 tegn',
              },
            })}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="Indtast din adgangskode"
            data-testid="password-input"
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={loading}
          />
          {errors.password && (
            <div
              id="password-error"
              className={styles.errorMessage}
              role="alert"
              aria-live="polite"
              data-testid="password-error"
            >
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Global Error Message */}
        {error && (
          <div
            className={styles.globalError}
            role="alert"
            aria-live="polite"
            data-testid="global-error"
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          data-testid="login-submit"
          aria-describedby={loading ? 'login-loading' : undefined}
        >
          {loading ? (
            <span className={styles.loadingContent}>
              <span className={styles.spinner} aria-hidden="true"></span>
              <span id="login-loading">Logger ind...</span>
            </span>
          ) : (
            'Log ind'
          )}
        </button>

        {/* Forgot Password Link */}
        <div className={styles.forgotPassword}>
          <button
            type="button"
            className={styles.forgotLink}
            data-testid="forgot-password"
            onClick={() => {
              // Placeholder - not functional as per requirements
              alert('Glemt adgangskode funktionalitet kommer snart');
            }}
          >
            Glemt adgangskode?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;