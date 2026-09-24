import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock the AuthContext with the full real context shape
// (see src/contexts/AuthContext.tsx AuthContextType).
const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const fullMock = (overrides: Record<string, unknown> = {}) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  loginWithGoogle: vi.fn(),
  loginWithEmail: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  clearError: vi.fn(),
  fetchUserProfile: vi.fn(),
  ...overrides,
});

const renderNavbar = () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseAuth.mockReturnValue(
      fullMock({ user: mockUser, token: 'fake-token', logout: mockLogout })
    );
  });

  it('renders nav links, logo, and the user menu button when authenticated', () => {
    renderNavbar();

    expect(screen.getByText('SkillForge')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    // Authenticated state shows the user's first name, not a direct
    // Profile/Logout link (those live inside the user dropdown).
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('renders a login button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue(fullMock({ user: null, token: null }));

    renderNavbar();

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /test/i })).not.toBeInTheDocument();
  });

  it('renders the logo', () => {
    renderNavbar();
    expect(screen.getByText('SkillForge')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuButton);

    // Mobile menu renders the nav links a second time (desktop + mobile).
    expect(screen.getAllByText('Home').length).toBeGreaterThan(1);
    expect(screen.getAllByText('About').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Courses').length).toBeGreaterThan(1);
  });

  it('opens the user dropdown and calls logout when logout is clicked', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /test/i }));

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
