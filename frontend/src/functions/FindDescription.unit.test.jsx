import { findDescription } from "./FindDescription";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

describe("findDescription unit testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("if text prop doesn't contain right keywords in titles it returns the keyword and a blank", () => {
    const mockText = "<h5>text</h5> <p> some text </h5>";
    const result = findDescription(mockText, ["title"]);
    expect(result[0]).toEqual(["title", ""]);
  });

  it("if text prop contains a correct title, the function returns the paragraph under it as a string", () => {
    const mockText =
      "<h5>Järjestämisajankohta opetusperiodin tarkkuudella</h5><p>1. periodi joka vuosi</p>" +
      "<h5>Suositeltava suoritusajankohta tai - vaihe</h5><p>1. vuosi matematiikan pääaineopinnoissa</p>";
    const result = findDescription(mockText, [
      "Järjestämisajankohta",
      "Suositeltava suoritusajankohta",
    ]);
    expect(result[0][1].trim()).toEqual("1. periodi joka vuosi");
    expect(result[1][1].trim()).toEqual(
      "1. vuosi matematiikan pääaineopinnoissa"
    );
  });
});
