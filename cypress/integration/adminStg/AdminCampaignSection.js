/// <reference types="Cypress" />
const dayjs = require('dayjs')
const testActorId = 'actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO'
const testActorName = 'Patternz'
const token = Cypress.env('token');
const Authorization = token;

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
    it('Search for actor', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type(testActorName)
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`, Authorization)
    })

    it('Refreshing the table', function () {
        cy.get('.sc-bdVaJa').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`, Authorization)
    })

    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 0, '#nuviad-campaigns-card')
        cy.selectTableRows('50', 50, 0, '#nuviad-campaigns-card')
        cy.selectTableRows('10', 10, 0, '#nuviad-campaigns-card')
        cy.selectTableRows('100', 100, 0, '#nuviad-campaigns-card')
    })

    it('Compare table data to with API data - All', function () {
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`)).then(response => {
            for (let i = 0; i < response.body.length; i++) {

                cy.get('tbody > tr').then($tableRows => {
                    for (let j = 1; j <= $tableRows.length; j++) {
                        cy.get(`tbody > :nth-child(${j}) > :nth-child(2)`).then($id => {
                            if ($id.text() == response.body[i].id) {
                                cy.get(`tbody > :nth-child(${j}) > :nth-child(3)`).then($name => {
                                    expect($name.text()).to.eq(response.body[i].name)
                                })
                                cy.get(`tbody > :nth-child(${j}) > :nth-child(5)`).then($status => {
                                    expect($status.text()).to.eq(response.body[i].status)
                                })
                                cy.get(`tbody > :nth-child(${j}) > :nth-child(6)`).then($margin => {
                                    expect(Number($margin.text())).to.eq(response.body[i].margin)
                                })
                                cy.get(`tbody > :nth-child(${j}) > :nth-child(7)`).then($spending => {
                                    const spending = Number(response.body[i].spending) / 1000000
                                    let spend = $spending.text()
                                    spend = Number(spend.replace(/\$|,/g, ''))
                                    cy.log(spending.toFixed(2) + ' ' + spend.toFixed(2))
                                    expect(spending.toFixed(2)).to.eq(spend.toFixed(2))
                                })
                            }
                        })
                    }
                })
            }
        })
    })

})