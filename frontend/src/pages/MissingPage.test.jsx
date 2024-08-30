import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import MissingPage from "./MissingPage";
import axios from "axios";

// Mock axios instance
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    create: vi.fn(() => ({
      get: vi.fn(),
      defaults: {
        baseURL: "http://localhost:3000",
      },
    })),
  };
});

describe("MissingPage", () => {
  let axiosInstance;

  beforeEach(() => {
    axiosInstance = axios.create();
  });

  test("renders the MissingPage component with 404 error message", () => {
    render(<MissingPage axiosInstance={axiosInstance} />);
    expect(screen.getByText(/Virhe 404/i)).toBeInTheDocument();
    expect(screen.getByText(/Sivua ei löytynyt/i)).toBeInTheDocument();
  });
});
