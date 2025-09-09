describe("Login should fail when wrong credentials", () => {
  it("passes", () => {
    cy.intercept("POST", "**/refresh_token", {
      statusCode: 200,
      body: {
        access_token: "fake-access",
        refresh_token: "fake-refresh",
        access_token_expiration_time: 3600,
        refresh_token_expiration_time: 86400,
      },
    }).as("refreshToken");

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
