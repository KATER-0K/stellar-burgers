/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getIngredients(): Chainable<JQuery<HTMLElement>>;
      getModal(): Chainable<JQuery<HTMLElement>>;
      openIngredientModalByName(name: string): Chainable<void>;
      closeModalByButton(): Chainable<void>;
    }
  }
}

export {};