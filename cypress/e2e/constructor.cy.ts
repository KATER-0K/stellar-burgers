describe('Проверка работы конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('fetchIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/orders', { fixture: 'order.json' });

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Ингредиенты успешно загружаются и отображаются на странице', () => {
    cy.wait('@fetchIngredients');
    cy.get('[data-cy="ingredient-item"]').should('have.length.greaterThan', 0);

    cy.contains('Краторная булка N-200i')
      .scrollIntoView()
      .should('be.visible');

    cy.contains('Соус Spicy-X')
      .scrollIntoView()
      .should('be.visible');
  });

  it('Добавляет ингредиент при клике по кнопке «Добавить»', () => {
    cy.get('[data-cy="bun-top"]').should('not.exist');
    cy.get('[data-cy="bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-filling"]').should('not.exist');

    cy.contains('Краторная булка N-200i')
      .scrollIntoView()
      .parents('[data-cy="ingredient-item"]')
      .find('button')
      .click();

    cy.contains('Биокотлета из марсианской Магнолии')
      .scrollIntoView()
      .parents('[data-cy="ingredient-item"]')
      .find('button')
      .click();

    cy.get('[data-cy="bun-top"]').should('contain', 'Краторная булка N-200i (верх)');
    cy.get('[data-cy="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-cy="bun-bottom"]').should('contain', 'Краторная булка N-200i (низ)');
  });

  it('Открывает модальное окно ингредиента', () => {
    cy.get('body').find('[data-cy="modal"]').should('not.exist');

    cy.contains('Краторная булка N-200i').click();

    cy.get('body').find('[data-cy="modal"]').should('be.visible').and('contain', 'Краторная булка N-200i');
  });

  it('Закрывает модальное окно по нажатию на крестик', () => {
    cy.contains('Соус Spicy-X').click();
    cy.get('body').find('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('body').find('[data-cy="modal"]').should('not.exist');
  });

  it('Пользователь может оформить заказ и конструктор очищается после этого', () => {
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    cy.contains('Краторная булка N-200i')
      .scrollIntoView()
      .parents('[data-cy="ingredient-item"]')
      .find('button')
      .click();

    cy.contains('Соус Spicy-X')
      .scrollIntoView()
      .parents('[data-cy="ingredient-item"]')
      .find('button')
      .click();

    cy.contains('Оформить заказ').click();

    cy.get('body').find('[data-cy="modal"]').should('contain', '12345');

    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('body').find('[data-cy="modal"]').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
