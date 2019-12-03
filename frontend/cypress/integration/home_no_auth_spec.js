describe('Testing the home page without logged in', function() {

    beforeEach(function setUser() {
        let userJSON;
        cy.server();
        cy.fixture('user').then(json => {
            userJSON = json;
            cy.route('POST', '/users/authenticate', JSON.stringify(userJSON));
        })
    })

    it('should allow to login', function() {
        cy.visit('/');
        cy.url().should('include', '/login');
        cy.contains("Room Booking Service");
        cy.contains("Login");


        cy.get('[data-cy=username]').should('be.empty');
        cy.get('[data-cy=username]').type("test");
        cy.get('[data-cy=password]').should('be.empty');
        cy.get('[data-cy=password]').type("test");

        cy.get('button').contains('Login').click();
        cy.url().should('not.include', '/login');

    })
});
