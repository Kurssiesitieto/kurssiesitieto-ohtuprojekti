import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import AddPrerequites from './AddPrerequisites';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mocking useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useNavigate: vi.fn(),
    };
  });
  
describe('AddPrerequites', () => {
    it('does not render when isOpen is false', () => {
      const onCloseMock = vi.fn();
      const { queryByText } = render(<AddPrerequites isOpen={false} onClose={onCloseMock} baseURL="/" />, { wrapper: MemoryRouter });
    });
  
    it('renders when isOpen is true', () => {
      const onCloseMock = vi.fn();
      const { getByText } = render(<AddPrerequites isOpen={true} onClose={onCloseMock} baseURL="/" />, { wrapper: MemoryRouter });
    });

});