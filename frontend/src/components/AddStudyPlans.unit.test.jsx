import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import AddStudyPlans from './AddStudyPlans';
import { MemoryRouter} from 'react-router-dom';

// Mocking useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useNavigate: vi.fn(),
    };
  });
  
describe('AddStudyPlans', () => {
    it('does not render when isOpen is false', () => {
      const onCloseMock = vi.fn();
      const { queryByText } = render(<AddStudyPlans isOpen={false} onClose={onCloseMock} baseURL="/" />, { wrapper: MemoryRouter });
      expect(queryByText('Luo kurssikokonaisuus')).toBeNull();
    });
  
    it('renders when isOpen is true', () => {
      const onCloseMock = vi.fn();
      const { getByText } = render(<AddStudyPlans isOpen={true} onClose={onCloseMock} baseURL="/" />, { wrapper: MemoryRouter });
      expect(getByText('Luo kurssikokonaisuus')).not.toBeNull();
    });



});