import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import AddStudyPlansButton from "./AddStudyPlansButton";

describe("AddStudyPlansButton", () => {
  it("renders the button with correct text", () => {
    const { getByText } = render(<AddStudyPlansButton />);
    expect(getByText("Lisää kurssikokonaisuus")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    const { getByText } = render(<AddStudyPlansButton onClick={handleClick} />);
    fireEvent.click(getByText("Lisää kurssikokonaisuus"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
