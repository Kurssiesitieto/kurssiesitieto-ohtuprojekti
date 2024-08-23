import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import StartPage from './StartPage';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';

const { location } = window;

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});

afterAll(() => {
  window.location = location;
});

const mockSetCurrentPlanId = vi.fn();
const mockOnDegreeChange = vi.fn();
const mockSetIsStartPageOpen = vi.fn();

describe('StartPage', () => {
  it('renders StartPage component with correct elements', () => {
    render(
      <StartPage
        listOfDegrees={[]}
        onDegreeChange={mockOnDegreeChange}
        setCurrentPlanId={mockSetCurrentPlanId}
        setIsStartPageOpen={mockSetIsStartPageOpen}
      />
    );

    expect(screen.getByText('Kurssin esitietojen visualisointityökalu')).toBeInTheDocument();
    expect(screen.getByText('Tämä sovellus näyttää tarvittavat kurssiesitiedot tietyille tutkinto-ohjelmille Helsingin yliopistossa.')).toBeInTheDocument();
  });

  it('displays degrees in the menu and handles degree selection', async () => {
    const degrees = [
      { plan_id: 1, degree_name: 'Degree 1' },
      { plan_id: 2, degree_name: 'Degree 2' },
    ];

    render(
      <StartPage
        listOfDegrees={degrees}
        onDegreeChange={mockOnDegreeChange}
        setCurrentPlanId={mockSetCurrentPlanId}
        setIsStartPageOpen={mockSetIsStartPageOpen}
      />
    );

    fireEvent.click(screen.getByText('Näytä tutkinnot'));

    await waitFor(() => {
      degrees.forEach(degree => {
        expect(screen.getByText(degree.degree_name)).toBeInTheDocument();
      });
    });

    fireEvent.click(screen.getByText('Degree 1'));

    expect(mockSetCurrentPlanId).toHaveBeenCalledWith(1);
    expect(mockOnDegreeChange).toHaveBeenCalledWith(degrees[0]);
    expect(mockSetIsStartPageOpen).toHaveBeenCalledWith(false);
  });

  it('handles "Kirjaudu sisään" button click', () => {
    render(
      <StartPage
        listOfDegrees={[]}
        onDegreeChange={mockOnDegreeChange}
        setCurrentPlanId={mockSetCurrentPlanId}
        setIsStartPageOpen={mockSetIsStartPageOpen}
      />
    );

    fireEvent.click(screen.getByText('Kirjaudu sisään'));

    expect(window.location.href).toBe(import.meta.env.BASE_URL);
  });
});