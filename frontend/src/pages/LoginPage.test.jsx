import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import LoginPage from "./LoginPage";

describe("LoginPage Integration Test", () => {
  it("should redirect to the base URL", () => {
    // Mock import.meta.env.BASE_URL
    const originalEnv = import.meta.env.BASE_URL;
    import.meta.env.BASE_URL = "/test-base";

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(window.location.pathname).toBe("/test-base/");

    import.meta.env.BASE_URL = originalEnv;
  });
});
