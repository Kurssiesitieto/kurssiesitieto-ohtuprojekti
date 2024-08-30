import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import InfoButton from "./InfoButton";

describe("InfoButton", () => {
  it("renders the button with correct text", () => {
    const { getByText } = render(<InfoButton />);
    expect(getByText("INFO")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    const { getByText } = render(<InfoButton onClick={handleClick} />);
    fireEvent.click(getByText("INFO"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
