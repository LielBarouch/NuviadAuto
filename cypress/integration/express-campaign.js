/// <reference types="Cypress" />

describe('Express user login', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    it('Enter to login', function () {
        cy.visit(`${this.data.NuviadExpressBaseURL}`)
        cy.get('.top-section > .content > button.ng-scope').click()
        cy.wait(2000)
        cy.get('.user > .button').click().then(function () {
            cy.wait(2000)
            cy.url().should('eq', `${this.data.NuviadExpressBaseURL}/sign_in`)
        })
    })

    it('Trying to login', function () {
        cy.get('.form-group>.form-control').eq(0).clear()
        cy.get('.form-group>.form-control').eq(1).clear()
        cy.login(this.data.emailExpressUser, this.data.password)
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
        cy.locationSearch('New York')
    })
    it('Search for location 2', function () {
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

        // for (let i = 1; i <= 7; i++) {
        //     cy.get('.input-group-btn > .btn').click()
        //     cy.get(`.dropdown-menu > :nth-child(${i})`).click()
        //     cy.wait(1500)
        // }
    })
    it('Check genders and ages',function(){
        cy.get('.group-selection>label').each(($el, index, $list) => {
                    cy.wrap($el).click({force:true})
                })
                cy.get('.group-selection>label').eq(0).click()
                cy.get('.rz-pointer-max').type('{leftArrow}{leftArrow}{leftArrow}')
                cy.wait(3000)
                cy.get('.rz-pointer-min').type('{rightArrow}{rightArrow}{rightArrow}')
                cy.wait(3000)
    })
    it('Check APIs',function(){
        cy.checkApiLoad('https://api-stg.nuviad.com/api/geo_insights/age_groups?alt_source=true&lat=32.7947631&lng=34.989209&targeting_radius=20000')
        cy.checkApiLoad('https://api-stg.nuviad.com/api/geo_insights/gender?alt_source=true&lat=32.7947631&lng=34.989209&targeting_radius=20000&yob_max=2002&yob_min=1964')
        cy.checkApiLoad('https://api-stg.nuviad.com/api/geo_insights/points?alt_source=true&lat=32.7947631&lng=34.989209&targeting_radius=20000&yob_max=2002&yob_min=1964')
        cy.checkApiLoad('https://api-stg.nuviad.com/api/geo_insights/impressions?alt_source=true&lat=32.7947631&lng=34.989209&targeting_radius=20000&yob_max=2003&yob_min=1964')
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
    // it('Continue without business name',function(){
    //     cy.get('.btn-primary').click()
    //     cy.get('.footerError').should('be.visible')
    //     cy.url().should('eq', `${this.data.NuviadExpressBaseURL}/business_details`)
    // })
    it('Provide business name',{retries:{openMode:3}},function(){
        cy.get('.form-group > input').type('Test business',{force:true})
    })
//     it('Test days and hours',function(){
//         cy.get('md-checkbox').each(($el, index, $list) => {
//             cy.wrap($el).click({ force: true })
//         })
//     })
   it('Continue',function(){
    cy.get('.btn-primary').click()
    cy.wait(5000)
   })
})