describe('Testing the home page without logged in', function() {

    it('should allow to login', function() {
        cy.visit('/');
        cy.url().should('include', '/login');
        cy.contains("Room Booking Service");
        cy.contains("Login");
        cy.get('button').contains('Login');
    })
});
