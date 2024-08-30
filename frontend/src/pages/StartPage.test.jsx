import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StartPage from "./StartPage";
import axios from "axios";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

// Mock the window.location object
const { location } = window;

beforeAll(() => {
  delete window.location;
  window.location = { href: "" };
});

afterAll(() => {
  window.location = location;
});

// Mock axios and messager
vi.mock("axios");
vi.mock("../components/messager/messager");

describe("StartPage", () => {
  it("renders StartPage component with correct elements", () => {
    render(<StartPage axiosInstance={axios} />);

    expect(
      screen.getByText("Kurssin esitietojen visualisointityökalu")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tämä sovellus näyttää tarvittavat kurssiesitiedot tietyille tutkinto-ohjelmille Helsingin yliopistossa."
      )
    ).toBeInTheDocument();
  });

  it('handles "Kirjaudu sisään" button click', () => {
    render(<StartPage axiosInstance={axios} />);

    fireEvent.click(screen.getByText("Kirjaudu sisään"));
    expect(window.location.href).toBe(import.meta.env.BASE_URL);
  });
});
