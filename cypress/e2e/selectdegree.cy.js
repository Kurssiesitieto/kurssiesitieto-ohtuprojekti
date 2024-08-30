describe("Degree selection and course inspection", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Can press the degree selection", () => {
    cy.get("#degreeSelectionButton").click();
  });

  it("Can select a degree", () => {
    cy.get("#degreeSelectionButton").click();
    cy.get("[id^=degree-option-]")
      .contains("Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026")
      .click();
  });

  it("Can see right courses from the selected degree", () => {
    cy.get("#degreeSelectionButton").click();
    cy.get("[id^=degree-option-]")
      .contains("Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026")
      .click();
    cy.get("body").contains("Johdatus yliopisto");
    cy.get("body").should("not.contain", "Kekkonen");
  });

  it("Can see right courses from another selected degree", () => {
    cy.get("#degreeSelectionButton").click();
    cy.get("[id^=degree-option-]")
      .contains("Matemaattisten tieteiden kandiohjelma 2023-2026")
      .click();
    cy.get("body").contains("Vektorianalyysi I");
    cy.get("body").should("not.contain", "Ohjelmoinnin perusteet");
  });
});
