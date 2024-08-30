describe("Can visit the site", () => {
  it("Passes", () => {
    cy.visit("http://localhost:3000/");
  });
});
