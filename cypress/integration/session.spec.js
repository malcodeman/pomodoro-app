describe("Start session", () => {
  beforeEach(() => {
    cy.visit("/");
    localStorage.setItem("devTools", true);
  });
  it("succesfully runs session", () => {
    const sessionLength = Cypress.env("sessionLength");
    const shortBreakLength = Cypress.env("shortBreakLength");

    cy.get("[data-cy=time]").contains(sessionLength);
    cy.get("[data-cy=start-countdown]").click();
    cy.get("[data-cy=zero-out]").click();
    cy.get("[data-cy=time]").contains(shortBreakLength);
    cy.get("[data-cy=session-counter]").contains(1);
  });
});
