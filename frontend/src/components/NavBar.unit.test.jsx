import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

// Mock the subcomponents
vi.mock('./SearchBar', () => ({
  default: () => <div>SearchBar</div>,
}));
vi.mock('./InfoBox', () => ({
  default: ({ isOpen, onClose, baseURL }) => (
    <div>
      {isOpen ? 'InfoBox is open' : 'InfoBox is closed'}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock('./DegreeSelectionMenu', () => ({
  default: () => <div>DegreeSelectionMenu</div>,
}));
vi.mock('./InfoButton', () => ({
  default: ({ onClick }) => <button onClick={onClick}>InfoButton</button>,
}));

describe('Navbar', () => {
  const mockHandleDegreeChange = vi.fn();
  const mockHandleSearch = vi.fn();
  const mockAxiosInstance = {};
  const mockBaseURL = 'http://example.com';
  const mockSelectedDegreeName = 'Test Degree';
  const mockListOfDegrees = ['Degree 1', 'Degree 2'];

  it('renders all components', () => {
    render(
      <Navbar
        handleDegreeChange={mockHandleDegreeChange}
        listOfDegrees={mockListOfDegrees}
        axiosInstance={mockAxiosInstance}
        handleSearch={mockHandleSearch}
        baseURL={mockBaseURL}
        selectedDegreeName={mockSelectedDegreeName}
      />
    );

    // Check if all components are rendered
    expect(screen.getByText('SearchBar')).toBeInTheDocument();
    expect(screen.getByText('DegreeSelectionMenu')).toBeInTheDocument();
    expect(screen.getByText('InfoButton')).toBeInTheDocument();
    expect(screen.getByText('InfoBox is closed')).toBeInTheDocument();
    expect(screen.getByText(mockSelectedDegreeName)).toBeInTheDocument();
  });

  it('toggles InfoBox visibility when InfoButton is clicked', () => {
    render(
      <Navbar
        handleDegreeChange={mockHandleDegreeChange}
        listOfDegrees={mockListOfDegrees}
        axiosInstance={mockAxiosInstance}
        handleSearch={mockHandleSearch}
        baseURL={mockBaseURL}
        selectedDegreeName={mockSelectedDegreeName}
      />
    );

    // Initially, the InfoBox should be closed
    expect(screen.getByText('InfoBox is closed')).toBeInTheDocument();

    // Click the InfoButton to open the InfoBox
    fireEvent.click(screen.getByText('InfoButton'));
    expect(screen.getByText('InfoBox is open')).toBeInTheDocument();

    // Click the Close button to close the InfoBox
    fireEvent.click(screen.getByText('Close'));
    expect(screen.getByText('InfoBox is closed')).toBeInTheDocument();
  });
});