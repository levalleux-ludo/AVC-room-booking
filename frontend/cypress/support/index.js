let backEnd = false;

before(function() {
    const request = {
        url: Cypress.env('api_server'),
        method: 'GET',
        timeout: '2000',
        failOnStatusCode: false
    }
    cy.once('fail', (err, runnable) => {
        Cypress.log({ message: "Exception has been catch" });
        backEnd = false;
        Cypress.env('backEnd', "false");
        return false;
    })
    cy.request(request).then((response) => {
        if (response.status == 200) {
            backEnd = true;
            Cypress.env('backEnd', "true");
        }
    });
})


beforeEach(function() {
    cy.log({ message: "BackEnd=" + Cypress.env('backEnd') });
    if (Cypress.env('backEnd') === "true") {
        cy.log({ message: "Running with Backend" });
    } else {
        cy.log({ message: "Running without Backend" });
    }

})
