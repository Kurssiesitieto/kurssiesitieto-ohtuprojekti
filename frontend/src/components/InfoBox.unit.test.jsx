import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import InfoBox from "./InfoBox";

// Poistetaan tarpeeton mockaus ja päivitykset, joita ei käytetä tässä komponentissa

describe("InfoBox", () => {
  it("does not render when isOpen is false", () => {
    const onCloseMock = vi.fn();
    const { queryByText } = render(
      <InfoBox isOpen={false} onClose={onCloseMock} />
    );
    expect(queryByText("Kurssin esitietojen visualisointityökalu")).toBeNull();
  });

  it("renders when isOpen is true", () => {
    const onCloseMock = vi.fn();
    const { getByText } = render(
      <InfoBox isOpen={true} onClose={onCloseMock} />
    );
    expect(
      getByText("Kurssin esitietojen visualisointityökalu")
    ).toBeInTheDocument();
  });

  it("calls onClose when Sulje button is clicked", () => {
    const onCloseMock = vi.fn();
    const { getByText } = render(
      <InfoBox isOpen={true} onClose={onCloseMock} />
    );
    fireEvent.click(getByText("Sulje"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
