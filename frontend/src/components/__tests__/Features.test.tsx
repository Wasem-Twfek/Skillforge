import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features', () => {
  const renderFeatures = () => render(<Features />);

  it('renders the main heading', () => {
    renderFeatures();
    expect(screen.getByText('Why Choose SkillForge?')).toBeInTheDocument();
  });

  it('renders the subheading', () => {
    renderFeatures();
    expect(
      screen.getByText("Learn at your own pace with SkillForge's flexible courses and hands-on projects."),
    ).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    renderFeatures();
    expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
    expect(screen.getByText('Expert-Led Content')).toBeInTheDocument();
    expect(screen.getByText('Track Progress')).toBeInTheDocument();
    expect(screen.getByText('Community Learning')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    renderFeatures();
    expect(screen.getByText(/Engage with hands-on exercises/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn from industry professionals/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor your learning journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Join a vibrant community/i)).toBeInTheDocument();
  });

  it('renders all icons', () => {
    renderFeatures();
    const icons = screen.getAllByTestId('feature-icon');
    expect(icons).toHaveLength(4);
  });

  it('applies the expected layout classes', () => {
    renderFeatures();

    const section = screen.getByRole('region', { name: /features/i });
    expect(section).toHaveClass('py-20', 'bg-white');

    const featureCards = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.closest('div'));

    featureCards.forEach((card) => {
      expect(card).toHaveClass('relative');
    });
  });
});
