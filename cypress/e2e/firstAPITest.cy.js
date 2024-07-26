import { homePageObject } from "./pages/homePage"

describe('API Testing', () => {
  beforeEach('Login to Website', () => {
    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags' })
    cy.signInCommand()
    cy.credentialsCommand('testuser@mailer.com', 'password')
  })

  afterEach('Sign Out of Website', () => {
    cy.signOutCommand()
  })
  it.skip('Sign Up Process', () => {
    cy.visitWebsite()

    homePageObject.SignUpProcess('testuser78', 'testuser@mailer.com', 'password')
  })

  it('Verify Correct Request and Response', () => {
    homePageObject.publishArticle('Test Title', 'Test Description', 'Test Body')
  })

  it('Intercept Request and Response', () => {
    homePageObject.interceptArticle('Test Title', 'Test Description', 'Test Body')
  })

  it('Verify Popular Tags are Displayed', () => {
    homePageObject.tagsAPITest()
  })

  it('Verify Global Likes Count', () => {
    homePageObject.articlesAPITest()
  })

  it('Practice API Testing', () => {
    homePageObject.practiceAPITest()
  })

  it('Delete Article using API', () => {
    homePageObject.deleteArticle()
  })
})