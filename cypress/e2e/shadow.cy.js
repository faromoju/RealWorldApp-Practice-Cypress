/// <reference types="Cypress" />

describe('Shadow DOM Test', function() {
    it('The Actual Test', () => {
        cy.visit('https://radogado.github.io/shadow-dom-demo/')
        cy.get('#app').shadow().find('#container')
    })
})