/// <reference types="Cypress" />

export class homePage {
    SignUpProcess(username, email, password) {
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.signUpLabel).should('be.visible').click()
            cy.get(selector.usernameField).should('be.visible').type(username)
            cy.get(selector.emailField).should('be.visible').type(email)
            cy.get(selector.passwordField).should('be.visible').type(password)
            cy.get(selector.signUpButton).should('be.visible').click()
        })
    }

    signInProcess(email, password) {
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.signInLabel).should('be.visible').click()
            cy.get(selector.signInEmailField).should('be.visible').type(email)
            cy.get(selector.signInPasswordField).should('be.visible').type(password)
            cy.get(selector.signInButton).should('be.visible').click()
        })
    }

    publishArticle(title, description, body) {
        cy.fixture('selectors').then((selector) => {

            cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

            cy.get(selector.articleLabel).should('be.visible').click()
            cy.get(selector.articleTitleField).should('be.visible').type(title)
            cy.get(selector.articleDescField).should('be.visible').type(description)
            cy.get(selector.articleBodyField).should('be.visible').type(body)
            cy.get(selector.publishArticleButton).should('be.visible').click()

            cy.wait('@postArticles').then((xhr) => {
                console.log(xhr)
                expect(xhr.response.statusCode).to.equal(201)
                expect(xhr.request.body.article.body).to.equal('Test Body')
                expect(xhr.response.body.article.description).to.equal('Test Description')
            })
            cy.get(selector.deleteArticleButton).should('be.visible').click({ force: true })
            cy.wait(2000)
        })
    }

    interceptArticle(title, description, body) {
        cy.fixture('selectors').then((selector) => {

            cy.intercept({ method: 'POST', path: 'articles' }, (req) => {
                req.reply(res => {
                    expect(res.body.article.description).to.be.equal('Test Description')
                    res.body.article.description = 'Intercepted Description'
                })
            }).as('postArticles')

            cy.get(selector.articleLabel).should('be.visible').click()
            cy.get(selector.articleTitleField).should('be.visible').type(title)
            cy.get(selector.articleDescField).should('be.visible').type(description)
            cy.get(selector.articleBodyField).should('be.visible').type(body)
            cy.get(selector.publishArticleButton).should('be.visible').click()

            cy.wait('@postArticles').then((xhr) => {
                console.log(xhr)
                expect(xhr.response.statusCode).to.equal(201)
                expect(xhr.request.body.article.body).to.equal('Test Body')
                expect(xhr.response.body.article.description).to.equal('Intercepted Description')
            })
            cy.get(selector.deleteArticleButton).should('be.visible').click({ force: true })
            cy.wait(2000)
        })
    }

    tagsAPITest() {
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.tagListContainer)
                .should('contain', 'Cypress')
                .and('contain', 'Automation')
                .and('contain', 'Testing')
        })
    }

    articlesAPITest() {
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' })
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.yourFeedLink).contains('Your Feed').click()
            cy.wait(2000)
            cy.get(selector.globalFeedLink).contains('Global Feed').click()
            cy.wait(2000)
        })
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.articleListLikeCount).eq(0).should('contain', '2')
            cy.get(selector.articleListLikeCount).eq(1).should('contain', '5')
        })
        cy.fixture('articles').then(file => {
            const articleSlug = file.articles[0].slug
            file.articles[0].favoritesCount = 3
            cy.intercept('POST', `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/favorite`, file)
        })

        cy.fixture('selectors').then((selector) => {
            cy.get(selector.articleListLikeCount).eq(0).click().should('contain', '3')
        })
    }

    practiceAPITest() {

        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', { fixture: 'feed' })

        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'feed' })
        cy.fixture('selectors').then((selector) => {
            cy.get(selector.yourFeedLink).contains('Your Feed').should('be.visible').click()
            cy.get(selector.globalFeedLink).contains('Global Feed').should('be.visible').click()
            cy.get(selector.tagBoxes).contains('Cypress').should('be.visible').click()
        })
        cy.wait(5000)

        cy.fixture('selectors').then((selector) => {
            cy.get(selector.globalFeedLink).contains('Global Feed').click()
            cy.get(selector.articleListLikeCount).eq(3).click().should('contain', '17')
        })
    }

    deleteArticle() {

        const bodyRequest =
        {
            "article": {
                "title": "Test",
                "description": "Test",
                "body": "Test",
                "tagList": []
            }
        }
        cy.intercept('GET', `${Cypress.env("apiURL")}/api/articles*`).as('getArticles')
        cy.get('@token').then((token) => {
            cy.request({
                url: `${Cypress.env("apiURL")}/api/articles/`,
                headers: { "Authorization": "Token " + token },
                method: 'POST',
                body: bodyRequest
            }).then(response => {
                expect(response.status).to.be.equal(201)
            })
            cy.wait(5000)

            cy.request({
                url: `${Cypress.env("apiURL")}/api/articles?limit=10&offset=0`,
                headers: { "Authorization": "Token " + token },
                method: 'GET'
            })
            cy.fixture('selectors').then((selector) => {
                cy.get(selector.yourFeedLink).contains('Your Feed').click()
                cy.wait(2000)
                cy.get(selector.globalFeedLink).contains('Global Feed').click()
                cy.wait('@getArticles', 5000)
                cy.get(selector.allArticles).eq(0).click()
                cy.get(selector.deleteArticleButton).should('be.visible').click({ force: true })
                cy.wait(1000)
            })

            cy.request({
                url: `${Cypress.env("apiURL")}/api/articles?limit=10&offset=0`,
                headers: { "Authorization": "Token " + token },
                method: 'GET'
            }).its('body').then((body) => {
                expect(body.articles[0].title).not.to.equal('Test')
            })
        })
    }
}

export const homePageObject = new homePage()