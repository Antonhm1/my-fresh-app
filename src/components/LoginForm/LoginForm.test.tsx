import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form elements with Danish labels', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Title
    expect(screen.getByRole('heading', { name: /log ind/i })).toBeInTheDocument();

    // Role selection
    expect(screen.getByText('Vælg rolle')).toBeInTheDocument();
    expect(screen.getByLabelText('Bruger')).toBeInTheDocument();
    expect(screen.getByLabelText('Administrator')).toBeInTheDocument();

    // Password field
    expect(screen.getByLabelText('Adgangskode')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Indtast din adgangskode')).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole('button', { name: /log ind/i })).toBeInTheDocument();

    // Forgot password link
    expect(screen.getByText('Glemt adgangskode?')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const form = screen.getByTestId('login-form');
    expect(form).toHaveAttribute('novalidate');

    // Fieldset and legend for role selection
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();

    // Radio buttons have proper attributes
    const userRadio = screen.getByTestId('role-user');
    const adminRadio = screen.getByTestId('role-administrator');
    expect(userRadio).toHaveAttribute('type', 'radio');
    expect(adminRadio).toHaveAttribute('type', 'radio');

    // Password input has proper attributes
    const passwordInput = screen.getByTestId('password-input');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits form with correct data when user role is selected', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Select user role (should be default)
    const userRadio = screen.getByTestId('role-user');
    await user.click(userRadio);

    // Enter password
    const passwordInput = screen.getByTestId('password-input');
    await user.type(passwordInput, 'testpassword123');

    // Submit form
    const submitButton = screen.getByTestId('login-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        role: 'user',
        password: 'testpassword123',
      });
    });
  });

  it('submits form with administrator role when selected', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Select administrator role
    const adminRadio = screen.getByTestId('role-administrator');
    await user.click(adminRadio);

    // Enter password
    const passwordInput = screen.getByTestId('password-input');
    await user.type(passwordInput, 'adminpass456');

    // Submit form
    const submitButton = screen.getByTestId('login-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        role: 'administrator',
        password: 'adminpass456',
      });
    });
  });

  it('displays validation error for empty password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Try to submit without entering password
    const submitButton = screen.getByTestId('login-submit');
    await user.click(submitButton);

    // Check for password validation error
    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
      expect(screen.getByText('Adgangskode er påkrævet')).toBeInTheDocument();
    });

    // Form should not be submitted
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Enter password that's too short
    const passwordInput = screen.getByTestId('password-input');
    await user.type(passwordInput, '12345');

    // Submit form
    const submitButton = screen.getByTestId('login-submit');
    await user.click(submitButton);

    // Check for password validation error
    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
      expect(screen.getByText('Adgangskode skal være mindst 6 tegn')).toBeInTheDocument();
    });

    // Form should not be submitted
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state when loading prop is true', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={true} />);

    // Submit button should show loading state
    expect(screen.getByText('Logger ind...')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeDisabled();

    // Password input should be disabled
    expect(screen.getByTestId('password-input')).toBeDisabled();

    // Loading spinner should be present (check for spinner by looking for loading content)
    const loadingContent = screen.getByText('Logger ind...');
    expect(loadingContent).toBeInTheDocument();
  });

  it('displays global error message when error prop is provided', () => {
    const errorMessage = 'Forkert adgangskode';
    render(<LoginForm onSubmit={mockOnSubmit} error={errorMessage} />);

    const errorElement = screen.getByTestId('global-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
    expect(errorElement).toHaveAttribute('role', 'alert');
  });

  it('handles forgot password click', async () => {
    const user = userEvent.setup();

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const forgotPasswordLink = screen.getByTestId('forgot-password');
    await user.click(forgotPasswordLink);

    expect(alertSpy).toHaveBeenCalledWith('Glemt adgangskode funktionalitet kommer snart');

    alertSpy.mockRestore();
  });

  it('prevents submission when onSubmit throws an error', async () => {
    const user = userEvent.setup();
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(new Error('Login failed'));

    render(<LoginForm onSubmit={mockOnSubmitWithError} />);

    // Fill form
    const passwordInput = screen.getByTestId('password-input');
    await user.type(passwordInput, 'testpassword123');

    // Submit form
    const submitButton = screen.getByTestId('login-submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmitWithError).toHaveBeenCalled();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Tab through form elements - radio buttons in a group act as one tab stop
    await user.tab();
    // First radio button should get focus (user radio is checked by default)
    expect(screen.getByTestId('role-user')).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId('password-input')).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId('login-submit')).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId('forgot-password')).toHaveFocus();

    // Test arrow key navigation within radio group
    await user.click(screen.getByTestId('role-user')); // Focus back to radio group
    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('role-administrator')).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByTestId('role-user')).toHaveFocus();
  });

  it('updates form state when user types in password field', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

    await user.type(passwordInput, 'mypassword');

    expect(passwordInput.value).toBe('mypassword');
  });

  it('shows correct role selection state', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const userRadio = screen.getByTestId('role-user') as HTMLInputElement;
    const adminRadio = screen.getByTestId('role-administrator') as HTMLInputElement;

    // User should be selected by default
    expect(userRadio).toBeChecked();
    expect(adminRadio).not.toBeChecked();

    // Click administrator radio
    await user.click(adminRadio);

    expect(userRadio).not.toBeChecked();
    expect(adminRadio).toBeChecked();

    // Click user radio again
    await user.click(userRadio);

    expect(userRadio).toBeChecked();
    expect(adminRadio).not.toBeChecked();
  });

  it('clears validation errors when user fixes input', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-submit');

    // Submit empty form to trigger validation error
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });

    // Type valid password
    await user.type(passwordInput, 'validpassword123');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
    });
  });
});