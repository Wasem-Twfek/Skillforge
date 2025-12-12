import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Create a mock for the useAuth hook
const mockUseAuth = vi.fn();

// Mock the module
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
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
    
    // Default mock implementation
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: mockLogout,
    });
  });

  it('renders navigation links when user is authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders login/register links when user is not authenticated', () => {
    // Override mock for this test
    mockUseAuth.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: mockLogout,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('SkillForge')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const menuButton = screen.getByRole('button', { name: '' }); // The menu button has no accessible name
    fireEvent.click(menuButton);
    
    // Check if mobile menu items are visible
    expect(screen.getAllByText('Home')[1]).toBeVisible();
    expect(screen.getAllByText('About')[1]).toBeVisible();
    expect(screen.getAllByText('Courses')[1]).toBeVisible();
  });

  it('calls logout function when logout button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
}); 