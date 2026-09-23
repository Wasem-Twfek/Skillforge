import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../ThemeToggle', () => ({
  default: () => <button type="button" aria-label="Theme toggle">Theme</button>,
}));

describe('Navbar', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: mockLogout,
      isLoading: false,
    });
  });

  it('renders navigation links when user is authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: mockLogout,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText('SkillForge')).toBeInTheDocument();
  });

  it('toggles the mobile navigation menu', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuButton);

    expect(screen.getAllByText('Home')).toHaveLength(2);
    expect(screen.getAllByText('About')).toHaveLength(2);
    expect(screen.getAllByText('Courses')).toHaveLength(2);
  });

  it('calls logout when the logout button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
