/// <reference types="Cypress" />

describe('Express user login', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    

    it('Start campaign without login', function () {
        cy.visit(`${this.data.NuviadExpressBaseURL}/campaign_planning`)
        cy.wait(2000)
        cy.url().should('eq', `${this.data.NuviadExpressBaseURL}/campaign_planning`)
    })


})

describe('Locations', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    
    it('Search for location 1', function () {
        cy.locationSearch('Haifa')
    })
    it('Select location', function () {
        cy.get('.ng-scope>.item>div>.ng-binding').click({ force: true })
    })
})

describe('Audience targeting',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    it('verify location and radius',function(){
        cy.url().should('eq', `${this.data.NuviadExpressBaseURL}/campaign_planning`)
        cy.get('.main-title').should('include.text', 'Haifa')
    })
})

describe('Business details',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    it('Go to business details',function(){
        cy.get('.footerControls > .btn').click()
        cy.url().should('eq', `${this.data.NuviadExpressBaseURL}/business_details`)
    })
   
    it('Business name',function(){
        
        cy.get('input').type('test')
        
    })

   
})
