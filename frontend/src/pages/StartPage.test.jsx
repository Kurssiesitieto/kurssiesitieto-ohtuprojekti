import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import StartPage from './StartPage';
import axios from 'axios';
import { error as displayError } from '../components/messager/messager';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock the window.location object
const { location } = window;

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});

afterAll(() => {
  window.location = location;
});

// Mock axios
vi.mock('axios');
vi.mock('../components/messager/messager');

describe('StartPage', () => {
  it('renders StartPage component with correct elements', () => {
    render(<StartPage axiosInstance={axios} />);

    expect(screen.getByText('Kurssin esitietojen visualisointityökalu')).toBeInTheDocument();
    expect(screen.getByText('Tämä sovellus näyttää tarvittavat kurssiesitiedot tietyille tutkinto-ohjelmille Helsingin yliopistossa.')).toBeInTheDocument();
  });
  /* OLD SCHEMA, needs adjustments
  it('fetches and displays degrees on load', async () => {
    const degrees = [
      { hy_degree_id: 1, degree_name: 'Degree 1' },
      { hy_degree_id: 2, degree_name: 'Degree 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: degrees });

    render(<StartPage axiosInstance={axios} />);

    fireEvent.click(screen.getByText('Näytä tutkinnot'));

    await waitFor(() => {
      degrees.forEach(degree => {
        expect(screen.getByText(degree.degree_name)).toBeInTheDocument();
      });
    });
  });
  */

  it('handles fetch degrees error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<StartPage axiosInstance={axios} />);

    await waitFor(() => {
      expect(displayError).toHaveBeenCalledWith('Jokin meni pieleen. Yritä uudestaan myöhemmin.');
    });
  });

  it('handles "Kirjaudu sisään" button click', () => {
    render(<StartPage axiosInstance={axios} />);

    fireEvent.click(screen.getByText('Kirjaudu sisään'));
    expect(window.location.href).toBe(import.meta.env.BASE_URL);
  });

  it('handles degree selection', async () => {
    const degrees = [
      { hy_degree_id: 1, degree_name: 'Degree 1' },
      { hy_degree_id: 2, degree_name: 'Degree 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: degrees });

    render(<StartPage axiosInstance={axios} />);

    fireEvent.click(screen.getByText('Näytä tutkinnot'));

    await waitFor(() => {
      degrees.forEach(degree => {
        expect(screen.getByText(degree.degree_name)).toBeInTheDocument();
      });
    });

    fireEvent.click(screen.getByText('Degree 1'));

    expect(localStorage.getItem('selectedDegree')).toBe(JSON.stringify(degrees[0]));
    expect(window.location.href).toContain('public');
  });
});