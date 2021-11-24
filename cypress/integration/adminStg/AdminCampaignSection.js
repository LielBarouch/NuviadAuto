/// <reference types="Cypress" />
const dayjs = require('dayjs')
const testActorId = 'actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO'
const testActorName = 'Patternz'
const token = Cypress.env('token');
const Authorization = token;
const searchWord = 'flight'

const campToSearch = {
    id: 'campaign_1oCXpGca51PKrrEPfbIflkqPdSXi',
    name: 'Mexico casino'
}

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

    it('Search by campaign id',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.form-control').type(campToSearch.id)
        cy.wait(6000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns/${campToSearch.id}`, Authorization)
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns/${campToSearch.id}`)).then(response=>{
            cy.get('tbody > :nth-child(1) > :nth-child(1)').then($id=>{
                expect($id.text()).to.eq(response.body.id)
                expect($id.text()).to.eq(campToSearch.id)
            })
            cy.get('tbody > :nth-child(1) > :nth-child(2)').then($name=>{
                expect($name.text()).to.eq(response.body.name)
                expect($name.text()).to.eq(campToSearch.name)
            })
        })
    })

    it('Test margin with wrong values', function () {
        const negativeMargin = -2
        const wrongMargin = 2
        cy.get('.lh-0 > .svg-inline--fa').click()
        cy.get('#margin').clear()
        cy.get('#margin').type(negativeMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Minimum margin is 0')
        })
        cy.get('#margin').clear()
        cy.get('#margin').type(wrongMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Maximum margin is 1')
        })
    })

    it('Test margin',function(){
        const newMargin=Math.random()
        cy.get('#margin').clear()
        cy.get('#margin').type(newMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
        
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns/${campToSearch.id}`)).then(response=>{
            expect(response.body.margin).to.eq(newMargin)
        })
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
                                    expect(spending.toFixed(2)).to.eq(spend.toFixed(2))
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    it('Table search test',function(){
        cy.get('label > input').type(searchWord)
        cy.wait(4000)
        cy.get('tbody > tr').then($tableRows=>{
            for(let i=1;i<=$tableRows.length;i++){
                cy.get(`tbody > :nth-child(${i}) > :nth-child(3)`).then($name => {
                    expect($name.text()).to.contain(searchWord)
                })
            }
        })
    })

    it('Margin bulk update with wrong values',function(){
        const negativeMargin = -2
        const wrongMargin = 2
        cy.get('thead > tr > .DataTable_checkboxColumn__2D8Dj > .form-check > .form-check-input').click()
        cy.get('.nav > .lh-0 > .svg-inline--fa').click()
        cy.get('#margin').clear()
        cy.get('#margin').type(negativeMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Minimum margin is 0')
        })
        cy.get('#margin').clear()
        cy.get('#margin').type(wrongMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Maximum margin is 1')
        })
    })
    
    it('Maegin bulk update',function(){
        const newMargin=Math.random()
        cy.get('#margin').clear()
        cy.get('#margin').type(newMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActorId}`)).then(response=>{
            for(let i=0;i<response.body.length;i++){
                cy.get('tbody > tr').then($tableRows=>{
                    for(let j=1;j<=$tableRows.length;j++){
                        cy.get(`tbody > :nth-child(${j}) > :nth-child(2)`).then($idToTest=>{
                            if($idToTest.text()==response.body[i].id){
                                expect(response.body[i].margin).to.eq(newMargin)
                            }
                        })
                    }
                })
            }
        })
    })
})