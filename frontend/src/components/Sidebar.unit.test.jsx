import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Sidebar from "./sidebar";
import * as CourseFunctions from "../functions/CourseFunctions";

vi.mock("../functions/CourseFunctions", () => ({
  handleFetchKORIByName: vi.fn(),
  handleFetchKORICourseInfo: vi.fn(),
}));

describe("Sidebar Component Tests", () => {
  const mockCloseSidebar = vi.fn();
  const mockAxiosInstance = {};
  const mockCourseInfo = {
    groupId: "123",
    outcomes: { fi: ["Testi kuvaus"] },
    credits: { max: 5 },
    additional: { fi: "Järjestämisajankohta Testi kuvaus Opintokokonaisuus" },
    code: "TKT123",
    id: "",
  };

  CourseFunctions.handleFetchKORICourseInfo.mockResolvedValue([mockCourseInfo]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when isOpen is true", () => {
    render(
      <Sidebar
        isOpen={true}
        closeSidebar={mockCloseSidebar}
        selectedCourseName="Testi kurssi"
        axiosInstance={mockAxiosInstance}
      />
    );
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Testi kurssi")).toBeInTheDocument();
  });

  it("fetches course information", async () => {
    render(
      <Sidebar
        isOpen={true}
        closeSidebar={mockCloseSidebar}
        selectedCourseName="Testi kurssi"
        selectedCourseGroupID="123"
        axiosInstance={mockAxiosInstance}
      />
    );
    await waitFor(() =>
      expect(CourseFunctions.handleFetchKORICourseInfo).toHaveBeenCalledWith(
        mockAxiosInstance,
        "123"
      )
    );
  });
});
