import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import LoginButton from "./LoginButton";

describe("LoginButton", () => {
  it("renders the button with correct text", () => {
    render(<LoginButton />);
    expect(screen.getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<LoginButton onClick={handleClick} />);
    fireEvent.click(screen.getByText("Kirjaudu sisään"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
