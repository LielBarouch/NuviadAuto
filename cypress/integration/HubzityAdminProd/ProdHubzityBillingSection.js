/// <reference types="Cypress" />
const path = require("path");
const dayjs = require('dayjs')

describe('Login to admin dashboard', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.HubzityAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/')
        cy.wait(10000)

    })
})

describe('Billing section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter Billing section', function () {
        cy.get(':nth-child(8) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url', function () {
        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/billing')
        cy.wait(25000)
    })
})

 describe('System daily billing',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getBillingApi(urlToTest) {
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

    it('Date change test',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-system-daily-billing-card > .pt-3 > :nth-child(1) > :nth-child(1) > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        cy.get('.react-datepicker__month-read-view').click()
        cy.get('.react-datepicker__month-dropdown').contains(thisMonth.format('MMMM')).click()
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/system/daily?date_start=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`,Authorization)
    })

    it('Compare API data with table data',function(){
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.request(getBillingApi(`${this.data.API_BASE_URL}/admin/billing/system/daily?date_start=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`)).then(response=>{
            for(let i=0;i<response.body.rows.length;i++){
                cy.get('#nuviad-system-daily-billing-table > .dataTables_wrapper > .table > tbody > tr').then($tableRows=>{
                    for(let j=1;j<=$tableRows.length;j++){
                        cy.get(`:nth-child(${j}) > .sorting_1`).then($dateInTable=>{
                            const dateInApi=response.body.rows[i].date
                            if(dateInApi.includes($dateInTable.text())){
                                cy.get(`#nuviad-system-daily-billing-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(2)`).then($cost=>{
                                    let costIntable=$cost.text()
                                    costIntable=Number(costIntable.replace(/\$|,/g, '')).toFixed(2)
                                    let costInApi=Number(response.body.rows[i].cost).toFixed(2)
                                    expect(costIntable).to.eq(costInApi)
                                })
                                cy.get(`#nuviad-system-daily-billing-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(3)`).then($billing=>{
                                    let billingInTable=$billing.text()
                                    billingInTable=Number(billingInTable.replace(/\$|,/g, '')).toFixed(2)
                                    let billingInApi=Number(response.body.rows[i].billing).toFixed(2)
                                    expect(billingInTable).to.eq(billingInApi)
                                })
                                cy.get(`#nuviad-system-daily-billing-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(4)`).then($margin=>{
                                    let marginInTable=$margin.text()
                                    marginInTable=Number(marginInTable.replace("%", '')).toFixed(2)
                                    let marginInApi=Number(response.body.rows[i].margin).toFixed(2)
                                    expect(marginInTable).to.eq(marginInApi)
                                })
                                cy.get(`#nuviad-system-daily-billing-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(5)`).then($impressions=>{
                                    let impInTable=$impressions.text()
                                    impInTable=Number(impInTable.replace(/\$|,/g, '')).toFixed(2)
                                    let impInApi=Number(response.body.rows[i].impressions).toFixed(2)
                                    expect(impInTable).to.eq(impInApi)
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    
    it('Test csv download',function(){
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-system-daily-billing-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `System daily billing ${yesterday.format('DD_MM_YYYY')} - ${thisMonth.format('DD_MM_YYYY')}.csv`)).should("exist");
    })

    it('Refresh table test',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-system-daily-billing-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(10000)
        cy.get('#nuviad-system-daily-billing-card > .align-items-center > .d-flex > span').then($span=>{
            expect($span.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/system/daily?date_start=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`,Authorization)
    })
}) 


describe('Accounts billing',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getBillingApi(urlToTest) {
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

    it('Date change test',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-accounts-billing-card > .pt-3 > :nth-child(1) > :nth-child(1) > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        cy.get('.react-datepicker__month-read-view').click()
        cy.get('.react-datepicker__month-dropdown').contains(thisMonth.format('MMMM')).click()
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/account?date_start=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`,Authorization)
    })

    it('Compare API data with table data',function(){
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.request(getBillingApi(`${this.data.API_BASE_URL}/admin/billing/account?account=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`)).then(response=>{
            for(let i=0;i<response.body.rows.length;i++){
                for(let j=0;j<response.body.related_entities.accounts.length;j++){
                    if(response.body.rows[i].actor_id==response.body.related_entities.accounts[j].id)
                    cy.get('#nuviad-accounts-billing-table > .dataTables_wrapper > .table > tbody > tr').then($tableRows=>{
                        for(let k=1;k<=$tableRows.length;k++){
                            cy.get(`#nuviad-accounts-billing-table > .dataTables_wrapper > .table > tbody > :nth-child(${k}) > :nth-child(1)`).then($nameInTable=>{
                                if($nameInTable.text()==response.body.related_entities.accounts[j].name){
                                    cy.log(response.body.rows[i].actor_id+' '+response.body.related_entities.accounts[j].id)
                                }
                            })
                        }
                    })
                }
                
            }
        })
    })
    
    it('Test csv download',function(){
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-accounts-billing-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Accounts billing ${yesterday.format('DD_MM_YYYY')} - ${thisMonth.format('DD_MM_YYYY')}.csv`)).should("exist");
    })

    it('Refresh table test',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        let thisMonth=dayjs()
        let yesterday=thisMonth.subtract(1,'day')
        cy.get('#nuviad-accounts-billing-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(10000)
        cy.get('#nuviad-accounts-billing-card > .align-items-center > .d-flex > span').then($span=>{
            expect($span.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/account?date_start=${yesterday.format('YYYY-MM-DD')}&date_end=${thisMonth.format('YYYY-MM-DD')}`,Authorization)
    })
})