import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../Hero';

const renderHero = () => {
  render(
    <BrowserRouter>
      <Hero />
    </BrowserRouter>
  );
};

describe('Hero', () => {
  it('renders the main heading with SkillForge text', () => {
    renderHero();
    expect(screen.getByText(/Forge Your Future with/i)).toBeInTheDocument();
    expect(screen.getByText(/SkillForge/i)).toBeInTheDocument();
  });

  it('renders the description text', () => {
    renderHero();
    expect(screen.getByText(/Master in-demand skills/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHero();
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn More/i)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    renderHero();
    const container = screen.getByText(/Master in-demand skills/i);
    expect(container).toHaveClass('text-xl', 'sm:text-2xl', 'text-gray-600', 'mb-8', 'max-w-3xl', 'mx-auto');
  });
});