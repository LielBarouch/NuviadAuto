/// <reference types="Cypress" />

describe('Login to admin dashboard', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)

    })
})

describe('Ads section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(4) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url and API load', function () {
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/ads')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`, Authorization)
    })
})

describe('Test pending ads table', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAdsApi(data) {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }
    it('Test pending ads table', function () {
        cy.get('.sc-bdVaJa').click({ force: true })

        cy.request(getAdsApi(this.data)).then(response => {
            if (response.body.meta_data.total) {
                const adsCount = Number(response.body.items.length)
                cy.get('.dataTables_info').should('contain.text', adsCount)
                cy.wrap(adsCount).should('eq', response.body.meta_data.total)
                let count = 0;
                for (let i = 0; i < response.body.items.length; i++) {
                    if (response.body.items[i].owner == "actor_TPrgTKLaeL4qNVuNliGsqwe9imAzB" && response.body.items[i].approved == false) {
                        count++;
                    }
                }
                cy.log(count)
            }

        })
    })
    it('Test search', function () {
        cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').type('LielTest')
        cy.request(getAdsApi(this.data)).then(response => {
            if (response.body.meta_data.total) {
                let count = 0;
                for (let i = 0; i < response.body.items.length; i++) {
                    if (response.body.items[i].owner == "actor_TPrgTKLaeL4qNVuNliGsqwe9imAzB" && response.body.items[i].approved == false) {
                        count++;
                    }
                }
                cy.log(count)
                cy.get('.dataTables_info').should('contain.text', count)
            }

            cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        })
    })
    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 0, '#nuviad-ads-card')
        cy.selectTableRows('50', 50, 0, '#nuviad-ads-card')
        cy.selectTableRows('100', 100, 0, '#nuviad-ads-card')
        cy.selectTableRows('10', 10, 0, '#nuviad-ads-card')
    })
    it('Ad preview', function () {
        cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').type('LielTest')
        cy.wait(4000)
        
    })
})