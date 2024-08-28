import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import AddStudyPlans from './AddStudyPlans';
import { MemoryRouter } from 'react-router-dom';

// Mocking axios globally
vi.mock('axios');

// Mocking useNavigate from react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('AddStudyPlans', () => {
    const mockAxiosInstance = {
        get: vi.fn(),
        post: vi.fn()
    };

    it('does not render when isOpen is false', () => {
        const onCloseMock = vi.fn();
        const { queryByText } = render(
            <AddStudyPlans 
                isOpen={false} 
                axiosInstance={mockAxiosInstance} 
                onCreate={onCloseMock} 
                setNewCoursePlan={() => {}} 
                onClick={onCloseMock}
                userUid="testUser"
            />, 
            { wrapper: MemoryRouter }
        );
        expect(queryByText('Luo kurssikokonaisuus')).toBeNull();
    });

    it('renders when isOpen is true', async () => {
        const onCloseMock = vi.fn();

        // Mocking the get call to return some degrees
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: [
                { hy_degree_id: 1, degree_name: 'Degree 1' },
                { hy_degree_id: 2, degree_name: 'Degree 2' }
            ]
        });

        const { getByText } = render(
            <AddStudyPlans 
                isOpen={true} 
                axiosInstance={mockAxiosInstance} 
                onCreate={onCloseMock} 
                setNewCoursePlan={() => {}} 
                onClick={onCloseMock}
                userUid="testUser"
            />, 
            { wrapper: MemoryRouter }
        );

        await waitFor(() => expect(getByText('Luo kurssikokonaisuus')).toBeInTheDocument());
    });
});

