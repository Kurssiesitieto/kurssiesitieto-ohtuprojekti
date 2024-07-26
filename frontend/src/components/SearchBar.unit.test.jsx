import axiosMock from 'axios';
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar.jsx';

vi.mock('axios');

describe("SearchBar unit testing", () => {
  const mockCourses = [
    {
      "id": 1,
      "kori_id": "hy-CU-117375413",
      "course_name": "Raja-arvot",
      "hy_course_id": "MAT11003"
    },
    {
      "id": 2,
      "kori_id": "hy-CU-117375394",
      "course_name": "Lineaarialgebra ja matriisilaskenta I",
      "hy_course_id": "MAT11002"
    }
  ];
  
  const mockHandleSearch = vi.fn();
  const mockHandleChange = vi.fn();

  beforeEach(() => {
    axiosMock.get.mockResolvedValueOnce({ data: mockCourses });
    vi.clearAllMocks();
  });

  it("The SearchBar renders properly", async () => {
    await act(async () => {
      render(
        <SearchBar 
          axiosInstance={axiosMock} 
          handleSearch={mockHandleSearch}
          handleChange={mockHandleChange}
        />
      );
    });

    const textField = screen.getByText('Hae kurssi:');
    expect(textField).toBeInTheDocument();
  });

  it("Courses are fetched when SearchBar is rendered", async () => {
    await act(async () => {
      render(
        <SearchBar 
          axiosInstance={axiosMock} 
          handleSearch={mockHandleSearch}
          handleChange={mockHandleChange}
        />
      );
    });

    await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(1));
  });

  it("Text input changes correctly", async () => {
    await act(async () => {
      render(
        <SearchBar 
          axiosInstance={axiosMock} 
          handleSearch={mockHandleSearch}
          handleChange={mockHandleChange}
        />
      );
    });

    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'Raja-arvot' } });
    await waitFor(() => expect(input).toHaveValue('Raja-arvot'));
  });
  
  it("Course selection triggers handleSelect correctly", async () => {
    await act(async () => {
      render(
        <SearchBar 
          axiosInstance={axiosMock} 
          handleSearch={mockHandleSearch}
          handleChange={mockHandleChange}
        />
      );
    });

    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'Raja-arvot' } });

    const option = await screen.findByText((content, element) => {
      return element.tagName.toLowerCase() === 'li' && content.includes('Raja-arvot');
    });
    fireEvent.click(option);

    await waitFor(() => expect(mockHandleSearch).toHaveBeenCalledWith('MAT11003'));
  });
});

