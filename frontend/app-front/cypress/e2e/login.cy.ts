describe("Login should fail when wrong credentials", () => {
  beforeEach(() => {
    cy.intercept("POST", "/refresh_token", {
      statusCode: 200,
      body: { accessToken: "fake-token" },
    }).as("refreshToken");
  });

  it("passes", () => {
    cy.visit("/");

    cy.fixture("login/not-valid-user.json").then(
      (user: { username: string; password: string }) => {
        cy.get("input[name='username']").type(user.username);
        cy.get("input[name='password']").type(user.password);
      }
    );

    cy.get("button[type='submit']").click();

    cy.contains("Username or password are incorrect").should("be.visible");
  });
});
