import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it('renders church name', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    expect(screen.getByTestId('church-name')).toHaveTextContent('Sankt Nikolaj Kirke');
  });

  it('renders hamburger menu button', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    const hamburgerButton = screen.getByTestId('hamburger-menu');
    expect(hamburgerButton).toBeInTheDocument();
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Menu');
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    const hamburgerButton = screen.getByTestId('hamburger-menu');

    // Menu should not be visible initially
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // Click hamburger to open menu
    fireEvent.click(hamburgerButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Click again to close menu
    fireEvent.click(hamburgerButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('displays user role in mobile menu', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    // Open mobile menu
    fireEvent.click(screen.getByTestId('hamburger-menu'));

    expect(screen.getByText('Bruger')).toBeInTheDocument();
  });

  it('displays administrator role in mobile menu', () => {
    render(<HomePage userRole="administrator" onLogout={mockOnLogout} />);

    // Open mobile menu
    fireEvent.click(screen.getByTestId('hamburger-menu'));

    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    // Open mobile menu
    fireEvent.click(screen.getByTestId('hamburger-menu'));

    // Click logout button
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<HomePage userRole="user" onLogout={mockOnLogout} />);

    const hamburgerButton = screen.getByTestId('hamburger-menu');
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Menu');

    const churchNameHeading = screen.getByTestId('church-name');
    expect(churchNameHeading.tagName).toBe('H1');
  });
});