describe('Adjust post tags', () => {
  describe('from /mod page', () => {
    beforeEach(() => {
      cy.testSetup();
      cy.fixture('users/adminUser.json').as('user');

      cy.get('@user').then((user) => {
        cy.loginAndVisit(user, '/mod');
      });
    });

    it('should add a tag to a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' }).click();
      cy.getIframeBody('.article-iframe')
        .findByRole('link', { name: /# tag2/ })
        .should('not.exist');

      cy.getIframeBody('.actions-panel-iframe').within(() => {
        cy.findByRole('button', { name: 'Open adjust tags section' }).click();
        cy.findByTestId('add-tag-button').click();
        cy.findByPlaceholderText('Add a tag').type('tag2');
        cy.findByPlaceholderText('Reason to add tag (optional)').type(
          'testing',
        );
        cy.findByRole('button', { name: 'Add tag' }).click();
      });

      cy.getIframeBody('.article-iframe').within(() => {
        cy.findByText('The #tag2 tag was added.');
        cy.findByRole('link', { name: /# tag2/ });
      });
    });

    it('should remove a tag from a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' }).click();
      cy.getIframeBody('.article-iframe').findByRole('link', {
        name: /# tag1/,
      });

      cy.getIframeBody('.actions-panel-iframe').within(() => {
        cy.findByRole('button', { name: 'Open adjust tags section' }).click();
        cy.findByText('tag1').click();
        cy.findByPlaceholderText('Reason to remove tag (optional)').type(
          'testing',
        );

        cy.findByRole('button', { name: 'Remove tag' }).click();
      });

      cy.getIframeBody('.article-iframe').within(() => {
        cy.findByText('The #tag1 tag was removed.');
        cy.findByRole('link', { name: /# tag1/ }).should('not.exist');
      });
    });
  });

  describe('from /mod/tagname page', () => {
    beforeEach(() => {
      cy.testSetup();
      cy.fixture('users/adminUser.json').as('user');

      cy.get('@user').then((user) => {
        cy.loginAndVisit(user, '/mod/tag1');
      });
    });

    it('should add a tag to a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' }).click();
      cy.getIframeBody('.article-iframe')
        .findByRole('link', { name: /#tag2/ })
        .should('not.exist');

      cy.getIframeBody('.actions-panel-iframe').within(() => {
        cy.findByRole('button', { name: 'Open adjust tags section' }).click();
        cy.findByTestId('add-tag-button').click();
        cy.findByPlaceholderText('Add a tag').type('tag2');
        cy.findByPlaceholderText('Reason to add tag (optional)').type(
          'testing',
        );
        cy.findByRole('button', { name: 'Add tag' }).click();
      });

      cy.getIframeBody('.article-iframe').within(() => {
        cy.findByText('The #tag2 tag was added.');
        cy.findByRole('link', { name: /# tag2/ });
      });
    });

    it('should remove a tag from a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' }).click();
      cy.getIframeBody('.article-iframe').findByRole('link', {
        name: /# tag1/,
      });

      cy.getIframeBody('.actions-panel-iframe').within(() => {
        cy.findByRole('button', { name: 'Open adjust tags section' }).click();

        cy.findByText('tag1').click();
        cy.findByPlaceholderText('Reason to remove tag (optional)').type(
          'testing',
        );

        cy.findByRole('button', { name: 'Remove tag' }).click();
      });

      cy.getIframeBody('.article-iframe').within(() => {
        cy.findByText('The #tag1 tag was removed.');
        cy.findByRole('link', { name: /# tag1/ }).should('not.exist');
      });
    });
  });

  describe('from article page', () => {
    // Helper function for pipe command
    const click = ($el) => $el.click();

    beforeEach(() => {
      cy.testSetup();
      cy.fixture('users/adminUser.json').as('user');

      cy.get('@user').then((user) => {
        cy.loginAndVisit(user, '/admin_mcadmin/tag-test-article');
      });
    });

    it('should add a tag to a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' });
      cy.findByRole('main').as('main');

      cy.findByRole('link', { name: /# tag2/ }).should('not.exist');

      cy.findByRole('button', { name: 'Moderation' }).click();
      cy.getIframeBody('#mod-container').within(() => {
        // Click listeners are attached async so we use pipe() to retry click until condition met
        cy.findByRole('button', {
          name: 'Open adjust tags section',
        })
          .pipe(click)
          .should('have.attr', 'aria-expanded', 'true');

        cy.findByTestId('add-tag-button').click();
        cy.findByPlaceholderText('Add a tag').type('tag2');
        cy.findByPlaceholderText('Reason to add tag (optional)').type(
          'testing',
        );
        cy.findByRole('button', { name: 'Add tag' }).click();
      });

      cy.get('@main').within(() => {
        cy.findByRole('link', { name: /# tag2/ });
      });
    });

    it('should remove a tag from a post', () => {
      cy.findByRole('heading', { name: 'Tag test article' });
      cy.findByRole('main').as('main');

      cy.findByRole('link', { name: /# tag1/ }).should('exist');
      cy.findByRole('button', { name: 'Moderation' }).click();

      cy.getIframeBody('#mod-container').within(() => {
        // Click listeners are attached async so we use pipe() to retry click until condition met
        cy.findByRole('button', {
          name: 'Open adjust tags section',
        })
          .pipe(click)
          .should('have.attr', 'aria-expanded', 'true');

        cy.findByText('tag1').click();
        cy.findByPlaceholderText('Reason to remove tag (optional)').type(
          'testing',
        );

        cy.findByRole('button', { name: 'Remove tag' }).click();
      });

      cy.get('@main').within(() => {
        cy.findByRole('link', { name: /# tag1/ }).should('not.exist');
      });
    });
  });
});
