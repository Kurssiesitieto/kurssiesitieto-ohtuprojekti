import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import LogoutButton from "./LogoutButton";

describe("LogoutButton", () => {
  it("renders the button with correct text", () => {
    render(<LogoutButton />);
    expect(screen.getByText("Kirjaudu ulos")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<LogoutButton onClick={handleClick} />);
    fireEvent.click(screen.getByText("Kirjaudu ulos"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
