/// <reference types="Cypress" />



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
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/ads')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`, Authorization)
    })
})

describe('Test ads table', function () {
    let adToTest = {
        name: 'Ad preview test',
        owner: '',
        campaign: '',
        id: ''
    }
    Cypress.Commands.add("adToTest_owner", { prevSubject: true }, (value) => {
        adToTest.owner = value
    })
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAdsApi(urlToTest) {
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
    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 0, '#nuviad-ads-card')
        cy.selectTableRows('50', 50, 0, '#nuviad-ads-card')
        cy.selectTableRows('10', 10, 0, '#nuviad-ads-card')
        cy.selectTableRows('100', 100, 0, '#nuviad-ads-card')
    })
    it('Test pending ads', function () {
        cy.request(getAdsApi(`${this.data.API_BASE_URL}/admin/ads/?status=PENDING_VERIFICATION`)).then(res => {
            for (let i = 0; i < res.body.items.length; i++) {
                cy.get('tbody > tr').then($tableRows => {
                    for (let j = 1; j < $tableRows.length; j++) {
                        cy.get(`tbody > :nth-child(${j}) > :nth-child(5)`).then($id => {
                            if ($id.text() == res.body.items[i]._id) {
                                expect(res.body.items[i].status).to.eq('PENDING_VERIFICATION')
                            }
                        })
                    }
                })
            }
        })
    })

    it('Get ad details', function () {
        cy.request(getAdsApi(`${this.data.API_BASE_URL}/admin/ads/?status=PENDING_VERIFICATION`)).then(res => {
            for (let i = 0; i < res.body.items.length; i++) {
                if (res.body.items[i].name == adToTest.name) {

                    adToTest.id = res.body.items[i]._id
                    cy.log(res.body.items[i].owner).adToTest_owner()
                }
            }
        })

        cy.log(adToTest.owner)
    })

    it('Ad preview', function () {
        cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').type(adToTest.name)
        cy.wait(4000)
        cy.get('.btn-group > :nth-child(1) > svg').click()
    })
    /* it('Test active ads', function () {
        cy.get('.css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('INACTIVE').click()
        cy.wait(20000)
        cy.request(getAdsApi(`${this.data.API_BASE_URL}/admin/ads/?status=INACTIVE`)).then(res=>{
            for(let i=0;i<res.body.items.length;i++){
                cy.get('tbody > tr').then($tableRows=>{
                    for(let j=1;j<$tableRows.length;j++){
                        cy.get(`tbody > :nth-child(${j}) > :nth-child(5)`).then($id=>{
                            if($id.text()==res.body.items[i]._id){
                                expect(res.body.items[i].status).to.eq('INACTIVE')
                            }
                        })
                    }
                })
            }
        })
    }) */
    /* it('Test search', function () {
        cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').type('LielTest')
        cy.get('tbody > tr').then($tableRows=>{
            for(let j=1;j<$tableRows.length;j++){
                cy.get(`tbody > :nth-child(${j}) > :nth-child(2)`).then($user=>{
                    expect($user.text()).to.eq('LielTest')
                })
            }
        })
    }) */


})