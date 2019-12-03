describe('Testing the Configure page', function() {

    let rooms;
    beforeEach(function setUser() {
        let userJSON;
        cy.fixture('user').then(json => {
            userJSON = json;
        })
        cy.server();
        // cy.route('GET', '/room', 'fixture:rooms.json');
        cy.fixture('rooms').then((json) => {
            rooms = json;
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

        expect(rooms).to.have.lengthOf(2);
        let room1 = rooms[0];
        let room2 = rooms[1];
        expect(room1).to.have.property('name', "Conference");
        expect(room2).to.have.property('name', "Thurston");

        cy.get('app-room-card').should('have.length', 2);
        cy.get('[data-cy=room-link]').eq(0).click();
        cy.url().should('include', rooms[0].name);
        cy.go('back');
        cy.get('[data-cy=room-link]').eq(1).click();
        cy.url().should('include', rooms[1].name);
        cy.go('back');

    })


});
