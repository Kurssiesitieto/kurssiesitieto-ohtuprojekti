import { info, error, subscribeToMessages } from "./messager";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("messager.js", () => {
  let mockSetMessage;
  let unsubscribe;

  beforeEach(() => {
    mockSetMessage = vi.fn();
    unsubscribe = subscribeToMessages(mockSetMessage);
  });

  afterEach(() => {
    unsubscribe();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should display an informational message", () => {
    vi.useFakeTimers();
    info("Test info message");

    expect(mockSetMessage).toHaveBeenCalledWith({
      text: "Test info message",
      type: "info",
    });

    vi.advanceTimersByTime(8000);
    expect(mockSetMessage).toHaveBeenCalledWith({ text: "", type: "" });
  });

  it("should display an error message", () => {
    vi.useFakeTimers();
    error("Test error message");

    expect(mockSetMessage).toHaveBeenCalledWith({
      text: "Virhe: Test error message",
      type: "error",
    });

    vi.advanceTimersByTime(8000);
    expect(mockSetMessage).toHaveBeenCalledWith({ text: "", type: "" });
  });

  it("should handle message subscription and unsubscription", () => {
    expect(typeof unsubscribe).toBe("function");

    info("Test info message");
    expect(mockSetMessage).toHaveBeenCalledWith({
      text: "Test info message",
      type: "info",
    });

    unsubscribe();
    info("Another test info message");
    expect(mockSetMessage).not.toHaveBeenCalledWith({
      text: "Another test info message",
      type: "info",
    });
  });
});
