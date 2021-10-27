/// <reference types="Cypress" />
const dayjs = require('dayjs')

/* describe('Check Exchange section with non master account',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("stg-admin@nuviad.com", "qwerty123")
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login with non master account', function () {
        cy.AdminLogin("stg-admin@nuviad.com", "qwerty123")
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)

    })
    it('Check if Exchange section is visable to the account',function(){
        cy.get('.with-sub > .nav-link').click()
        cy.get('.navbar-menu-sub>.nav-sub-item').then($el=>{
            cy.wrap($el.length).should('eq',2)
        })
    })
    it('Logout',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.NuviadAdminDashboard}/login/`)
    })
}) */

describe('Login to admin dashboard',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)

    })
})

describe('Exchanges section',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter Exchanges section',function(){
        cy.get('.with-sub > .nav-link').click()
        cy.get(':nth-child(3) > .nav-sub-link').click()
        cy.wait(3000)
        
    })
    it('Check the url and API load',function(){
        cy.url().should('eq','https://admin-stg.nuviad.com/dashboard/exchanges')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
})

describe('Table tests',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest){
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: urlToTest,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }
    it('Test table refreshing',function(){
        cy.get(':nth-child(2) > .sc-bdVaJa').click()
        cy.wait(3000)
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
    it('Test search',function(){
        const searchWord='test1'
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('input').type(searchWord)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`, Authorization)
        cy.request(getExchangesApi(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`)).then(response=>{
            cy.get('.dataTables_info').should('contain.text',response.body.total_count+" entries")
            for(let i=1;i<=response.body.total_count;i++){
                cy.get(`:nth-child(${i}) > .sorting_1`).then($el=>{
                    let exName=$el.text()
                    exName=exName.toLowerCase()
                    expect(exName).to.contain(searchWord)
                })
            }
        })
    })
})
