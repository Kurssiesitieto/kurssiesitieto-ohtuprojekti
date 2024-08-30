import React from "react";
import { CourseActivityDesc } from "./CourseActivityDesc";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

describe("CourseActivityDesc unit testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("if function receives blank/undefined desc, nothing renders", () => {
    const mockDesc = "";
    render(<CourseActivityDesc desc={mockDesc} />);
    const title = screen.queryByText("Suoritusaika");
    expect(title).toBe(null);
  });

  it("if function receives desc with activity info, the activity info gets rendered", () => {
    const mockDesc =
      "<h5>Suoritustavat</h5><p>Osallistuminen lähiopetukseen ja/tai tentti.<br /></p>" +
      "<h5>Järjestämisajankohta opetusperiodin tarkkuudella</h5><p>1. periodi joka vuosi</p>" +
      "<h5>Suositeltava suoritusajankohta tai - vaihe</h5><p>1. vuosi matematiikan pääaineopinnoissa</p>" +
      "<h5>Opintokokonaisuus</h5><p>MAT110 Matematiikan perusopinnot</p>";
    render(<CourseActivityDesc desc={mockDesc} />);

    const title = screen.queryByText("Suoritusaika");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H3");

    fireEvent.click(screen.getByTestId("infoIcon"));

    const activity = screen.queryByText("1. periodi joka vuosi");
    expect(activity).toBeInTheDocument();

    const recommendation = screen.queryByText(
      "1. vuosi matematiikan pääaineopinnoissa"
    );
    expect(recommendation).toBeInTheDocument();
  });
});
