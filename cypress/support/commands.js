Cypress.Commands.add('getIngredients', () => {
  return cy.get('[data-cy="ingredient-item"]');
});

Cypress.Commands.add('getModal', () => {
  return cy.get('#modals > div');
});

Cypress.Commands.add('openIngredientModalByName', (name) => {
  cy.contains(name).scrollIntoView().click();
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-cy="modal-close-button"]').click();
});
