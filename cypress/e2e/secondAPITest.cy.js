/// <reference types = "Cypress"/>

describe('Second Test Lesson', function() {
    beforeEach(function() {
        cy.signInCommand()
        cy.credentialsCommand('testuser@mailer.com', 'password')
        cy.percySnapshot('Entire Page')
    })

    it('First Test', () => {
        cy.signOutCommand()
    })
})