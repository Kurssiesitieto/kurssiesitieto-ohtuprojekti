describe("See user messages", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Can see the right user message after clicking a degree", () => {
    cy.get("#degreeSelectionButton").click();
    cy.get("body").contains("Haettiin tutkinto: Tietojenkä");
    cy.get("body").should("not.contain", "Fetched degree: Celsius");
  });
});
