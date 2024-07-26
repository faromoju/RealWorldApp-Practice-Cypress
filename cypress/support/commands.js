/// <reference types="Cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('signInCommand', () => {
    const userCredentials = {
        "user": {
            "email": Cypress.env("email"),
            "password": Cypress.env("password")
        }
    }

    cy.request('POST', `${Cypress.env("apiURL")}/api/users/login`, userCredentials).its('body').then((body) => {
        const token = body.user.token
        cy.wrap(token).as('token')

        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('', token)
            }
        })
        //cy.visit('/')
    })
})

Cypress.Commands.add('credentialsCommand', (email, password) => {
    cy.fixture('selectors').then((selector) => {
        cy.get(selector.signInLabel).should('be.visible').click()
        cy.get(selector.signInEmailField).should('be.visible').type(email)
        cy.get(selector.signInPasswordField).should('be.visible').type(password)
        cy.get(selector.signInButton).should('be.visible').click()
        cy.wait(2000)
    })
})

Cypress.Commands.add('signOutCommand', () => {
    cy.fixture('selectors').then((selector) => {
        cy.get(selector.settingsLabel).should('be.visible').click()
        cy.get(selector.logoutButton).should('be.visible').click()
    })
})