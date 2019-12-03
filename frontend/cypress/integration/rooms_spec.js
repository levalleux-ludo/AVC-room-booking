describe('Testing the home page when logged in', function() {

    // let user = ;

    beforeEach(function setUser() {
        let userJSON;
        cy.fixture('user').then(json => {
            userJSON = json;
        })
        cy.server();
        // cy.route('GET', '/room', 'fixture:rooms.json');
        cy.fixture('rooms').then((json) => {
            cy.route('GET', '/room', json)
        })
        cy.visit('/rooms', {
                onBeforeLoad(win) {
                    // and before the page finishes loading
                    // set the user object in local storage
                    win.localStorage.setItem('currentUser', JSON.stringify(userJSON))
                },
            })
            // the page should be opened and the user should be logged in
    })

    it('should allow to logout, configure and navigate to rooms', function() {
        cy.contains("Room Booking Service");
        cy.get('.nav-item').contains('Logout');
        cy.get('.nav-item').contains('Configure');
        cy.get('.nav-item').contains('Bookings');
        cy.get('.nav-item').contains('Rooms');
    })


});
