describe("exchange", () => {
  beforeEach(() => {
    cy.visit("/exchange");
    cy.viewport(470, 840); // Mobile
  });

  it("exchange main 조회", () => {
    cy.get("h1").should("exist").contains("Exchange");
    cy.get("#moc-to-mmoc-button").should("exist").click();
  });

  it("moc-to-mmoc 조회", () => {
    cy.get("#moc-to-mmoc-button").should("exist").click();
    cy.url().should("include", "/exchange/moc-to-mmoc");
  });

  it("mmoc-to-moc 조회", () => {
    cy.get("#mmoc-to-moc-button").should("exist").click();
    cy.url().should("include", "/exchange/mmoc-to-moc");
    cy.get("#mmoc-to-moc-input").should("have.value", "0"); // 초기값 0
    cy.get("#max-button").should("be.visible"); // max 버튼 보임
    cy.get("#max-button").should("exist").click(); // max 버튼 클릭
    cy.get("#max-button").should("be.not.visible"); // max 버튼 보이지 않음
    cy.get("#mmoc-to-moc-input").should("have.not.value", "0"); // 입력값 변경됨
  });
});
