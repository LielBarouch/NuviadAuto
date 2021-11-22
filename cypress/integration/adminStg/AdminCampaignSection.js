/// <reference types="Cypress" />

const testActorId='actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO'
const testActorName='Patternz'

describe('Login to admin dashboard', function () {
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

describe('Campaign section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getCampaignsApi(urlToTest) {
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
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(5) > .nav-link').click()
        cy.wait(3000)
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/campaigns')
    })
    it('Search for actor',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type(testActorName)
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`, Authorization)
    })

    it('Compare table data to with API data - All',function(){
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`)).then(response=>{
            cy.log(response.body.length)
        })
    })
})