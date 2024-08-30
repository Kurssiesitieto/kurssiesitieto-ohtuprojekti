import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom"; // Import jest-dom for the matchers
import MessagerComponent from "./MessagerComponent";
import { subscribeToMessages } from "./messager";

// Mock the subscribeToMessages function
vi.mock("./messager", () => ({
  subscribeToMessages: vi.fn(),
}));

describe("MessagerComponent", () => {
  // Enable fake timers
  vi.useFakeTimers();

  it("renders MessagerComponent with messages", async () => {
    const mockMessage = { text: "Test message", type: "info" };

    // Mock the implementation of subscribeToMessages to call the callback with the mock message
    subscribeToMessages.mockImplementation((callback) => {
      callback(mockMessage);
      return vi.fn(); // Return a mock unsubscribe function
    });

    // Render the component
    render(<MessagerComponent />);

    // Use act to ensure all updates are processed
    await act(async () => {
      vi.runAllTimers();
    });

    // Check if the message is rendered
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
  });
});
