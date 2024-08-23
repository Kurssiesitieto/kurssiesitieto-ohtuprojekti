import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DegreeSelectionMenu from './DegreeSelectionMenu'; 

// OLD SCHEMA or functionality, needs adjustments
describe('DegreeSelectionMenu', () => {
  const mockOnDegreeChange = vi.fn();
  const listOfDegrees = [
    {
      degree_name: 'Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026',
      degree_years: '2023-2026',
      hy_degree_id: 'kh50_005'
    },
    {
      degree_name: 'Matematiikan kandidaattitutkinto 2020-2023',
      degree_years: '2020-2023',
      hy_degree_id: 'kh50_001'
    }
  ];
  const degree = 'Valitse tutkinto';

  beforeEach(() => {
    render(
      <DegreeSelectionMenu 
        onDegreeChange={mockOnDegreeChange} 
        degree={degree} 
        listOfDegrees={listOfDegrees} 
      />
    );
  });

  it('renders with text Tutkinto', () => {
    expect(screen.getByRole('button', { name: degree })).toBeInTheDocument();
  });

  it('degree menu is initially not open', () => {
    const button = screen.getByRole('button', { name: degree });
    expect(button).not.toHaveAttribute('aria-expanded', 'true');
  });

  /*
  it('opens menu and displays all degree options', () => {
    fireEvent.click(screen.getByRole('button', { name: degree }));
    expect(screen.getByText(listOfDegrees[0].degree_name)).toBeInTheDocument();
    expect(screen.getByText(listOfDegrees[1].degree_name)).toBeInTheDocument();
  });

  it('calls onDegreeChange with selected degree and closes menu', () => {
    const button = screen.getByRole('button', { name: degree });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByText(listOfDegrees[1].degree_name));
    expect(mockOnDegreeChange).toHaveBeenCalledWith(listOfDegrees[1]);
    expect(button).not.toHaveAttribute('aria-expanded', 'true');
  });
  */
});
