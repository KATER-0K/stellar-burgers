Cypress.Commands.add('getIngredients', () => {
  return cy.get('[data-cy="ingredient-item"]');
});

Cypress.Commands.add('getModal', () => {
  return cy.get('body').find('[data-cy="modal"]', { timeout: 10000 });
});

Cypress.Commands.add('openIngredientModalByName', (name: string) => {
  cy.get('[data-cy="ingredient-item"]')
    .contains(name)
    .scrollIntoView()
    .parents('[data-cy="ingredient-item"]')
    .find('button')
    .click();
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-cy="modal-close-button"]').click();
});
