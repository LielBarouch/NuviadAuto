/// <reference types="Cypress" />
const path = require("path");
const dayjs = require('dayjs')
let initCredit = 0
let creditToComp = 0
const qps = 120
const testActor = {
    id: 'actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO',
    name: 'Patternz',
    newMargin: Math.floor(Math.random() * 101)
}

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

/* describe('Accounts section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url and API load', function () {
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/accounts')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`, Authorization)
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
        cy.wait(20000)
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
}) */

/*  describe('Test pending accounts table', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAccountsApi(urlToTest) {
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
    function accountsSorting(col, apiUp, apiDown) {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-accounts-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`#nuviad-accounts-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }
    it('Test pending accounts count with the API', function () {
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count)
        })
    })
    it('Test all accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container > .css-yk16xz-control > .css-1wy0on6 > .css-tlfecz-indicatorContainer').click()
        cy.contains('ALL').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count)
        })
    })
    it('Test active accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ACTIVE').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=ACTIVE`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.length; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', "ACTIVE")
            }
        })
    })
    it('Test inactive accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('INACTIVE').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=INACTIVE`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.length; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', "INACTIVE")
            }
        })
    })
    it('Test suspended accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('SUSPENDED').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=SUSPENDED`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.length; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', "SUSPENDED")
            }
        })
    })
    it('Test search', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('PENDING').click()
        cy.wait(3000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Liel')
        cy.wait(3000)
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`)).then(response => {
            let count = 0;
            for (let i = 0; i < response.body.rows.length; i++) {
                if (response.body.rows[i].name == "Liel") {
                    count++;
                }
            }
            cy.log(count)
            cy.get('.dataTables_info').should('contain.text', count)
            cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
            cy.wait(3000)
        })
    })
    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 0, '#nuviad-accounts-table')
        cy.selectTableRows('50', 50, 0, '#nuviad-accounts-table')
        cy.selectTableRows('100', 100, 0, '#nuviad-accounts-table')
        cy.selectTableRows('10', 10, 0, '#nuviad-accounts-table')
    })

    it('ID sorting', function () {
        accountsSorting(1, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=v1_id`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-v1_id`)
    })
    it('Name sorting', function () {
        accountsSorting(2, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=name`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-name`)
    })
    it('Created at sorting', function () {
        accountsSorting(4, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=created_at`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)
    })
    it('Email sorting', function () {
        accountsSorting(5, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=email`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-email`)
    })
    it('Views sorting', function () {
        accountsSorting(6, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=views`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-views`)
    })
    it('Views today sorting', function () {
        accountsSorting(7, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=views_today`, `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-views_today`)
    })
}) */ 

 /* describe('Test margin set', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAccountsApi(urlToTest) {
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

    it('Set margin for an actor with wrong values', function () {
        const negativeValue=-1
        const overValue=200
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type(testActor.id)
        cy.wait(4000)
        cy.get(':nth-child(5) > .svg-inline--fa').click()
        cy.get('#margin').clear()
        cy.get('#margin').type(negativeValue)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Minimum margin is 0')
        })
        cy.get('#margin').clear()
        cy.get('#margin').type(overValue)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.get('.invalid-feedback').then($invalidError => {
            cy.wrap($invalidError).should('be.visible')
            expect($invalidError.text()).to.eq('Maximum margin is 100')
        })
    })

    it('Set margin for an actor', function () {
        cy.get('#margin').clear()
        cy.get('#margin').type(testActor.newMargin)
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(5000)
    })
    
    it('Check margin API load',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&q=${testActor.id}`)).then(response=>{
            expect(response.body.rows[0].margin).to.eq(testActor.newMargin)
        })
    })

    it('Check margin for all campaigns for this actor',function(){
        cy.get(':nth-child(5) > .nav-link').click()
        cy.wait(5000)
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type(testActor.name)
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.selectTableRows('100', 100, 0, '#nuviad-campaigns-card')
        cy.wait(3000)
        cy.get('#nuviad-campaigns-card').find('tbody > tr').then($tableRows => {
            for (let j = 1; j <= $tableRows.length; j++) {
                cy.get('#nuviad-campaigns-card').find(`tbody > :nth-child(${j}) > :nth-child(6)`).then($margin => {
                    const margin=Number($margin.text())
                    expect(margin*100).to.eq(testActor.newMargin)
                })
            }
        })
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=${testActor.id}`)).then(response=>{
            for (let i = 0; i < response.body.length; i++){
                expect((response.body[i].margin)*100).to.eq(testActor.newMargin)
            }
        })
    })

    it('Enter Exchanges section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
})  */

 /* describe('Test transactions table', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getTransactionsApi(urlToTest) {
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
    function transactionsSorting(col, apiUp, apiDown) {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-billing-transactions-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`#nuviad-billing-transactions-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }
    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 1, '#nuviad-billing-transactions-table')
        cy.selectTableRows('50', 50, 1, '#nuviad-billing-transactions-table')
        cy.selectTableRows('100', 100, 1, '#nuviad-billing-transactions-table')
        cy.selectTableRows('10', 10, 1, '#nuviad-billing-transactions-table')
    })
    it('Search test', function () {
        cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        cy.wait(3000)
        cy.request(getTransactionsApi(`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at&q=Patternz`)).then(response => {
            for (let i = 0; i < response.body.rows.length; i++) {
                cy.wrap(response.body.rows[i].custom).should('eq', "actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO")
            }
            cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count)
        })
        cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        cy.wait(3000)
    })
    it('ID sorting', function () {
        transactionsSorting(1, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=txn_id`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-txn_id`)
    })
    it('Account sorting', function () {
        transactionsSorting(2, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=custom`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-custom`)
    })
    it('Created at sorting', function () {
        transactionsSorting(3, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=created_at`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at`)
    })
    it('Payment type sorting', function () {
        transactionsSorting(4, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=payment_type`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-payment_type`)
    })
    it('Payment gross sorting', function () {
        transactionsSorting(5, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=payment_gross`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-payment_gross`)
    })
    it('Currency sorting', function () {
        transactionsSorting(6, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=mc_currency`, `${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-mc_currency`)
    })

    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Transactions - page 1.csv`)).should("exist")
        
    })
})  */
 /* describe('Credit requests', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function creditSorting(col, apiUp, apiDown) {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-credit-request-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`#nuviad-credit-request-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click({force:true})
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }
    function getCreditApi(urlToTest) {
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
 
    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-credit-request-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Credit requests - page 1.csv`)).should("exist");
    })
 
    it('Account sorting', function () {
        creditSorting(1, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=account_id&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-account_id&status=PENDING`)
    })
    it('Created at sorting', function () {
        creditSorting(3, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=created_at&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`)
    })
    it('Updated at sorting', function () {
        creditSorting(4, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=updated_at&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-updated_at&status=PENDING`)
    })
    it('Amount sorting', function () {
        creditSorting(5, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=amount&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-amount&status=PENDING`)
    })
    it('Currency sorting', function () {
        creditSorting(6, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=currency&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-currency&status=PENDING`)
    })
    it('Notes sorting', function () {
        creditSorting(7, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=notes&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-notes&status=PENDING`)
    })
    it('ID sorting', function () {
        creditSorting(8, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=_id&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-_id&status=PENDING`)
    })
    it('Requester sorting', function () {
        creditSorting(9, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=requester_id&status=PENDING`, `${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-requester_id&status=PENDING`)
    })
    it('Refresh table', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.align-items-center > .d-flex > :nth-child(2) > .sc-bdVaJa').click
        cy.wait(6000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
    })
    it('View all requests', function () {
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.contains('ALL').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count)
        })
    })
    it('View approved requests', function () {
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('APPROVED').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=APPROVED`)).then(response => {
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.lenght; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', 'APPROVED')
            }
        })
    })
    it('View rejected requests', function () {
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('REJECTED').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=REJECTED`)).then(response => {
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.lenght; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', 'REJECTED')
            }
        })
    })
    it('View pending requests', function () {
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('PENDING').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`)).then(response => {
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count)
            for (let i = 0; i < response.body.rows.lenght; i++) {
                cy.wrap(response.body.rows[i].status).should('eq', 'PENDING')
            }
        })
    })
    it("Test actor details modal",function(){
        const searchActor='LielTest'
        cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchActor)
        cy.wait(6000)
        cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .table > tbody > :nth-child(1) > :nth-child(1) > a').click()
        cy.get('.modal-body').should('be.visible')
        cy.get(':nth-child(1) > .col-sm-10').then($el=>{
            expect($el.text()).to.eq(searchActor)
        })
        cy.get('.modal-footer > .btn').click()
    })
 })  */

 describe('Test credit request approving process', function () {
    
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken('liel@nuviad.com', 'lb123456')
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NUVIAD_PROD_DASHBOARD}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(10000)
    })
    it('Get the credit amount of the user', function () {
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el) => {
            let spending = $el.text()
            initCredit = Number(spending.replace(/\$|,/g, ''))
        })
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

    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(10000)

    })
    it('Create credit request', function () {
        cy.get(':nth-child(3) > .sc-bdVaJa').click()
        cy.get('form > .row > :nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type('Patternz')
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.get('#amount').clear()
        cy.get('#amount').type(1000)
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        creditToComp = initCredit + 1000
    })
    it('Approve request', function () {
        cy.get(':nth-child(1) > :nth-child(10) > .btn-group > :nth-child(1) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(10000)
    })
    it('Check credit change in accounts table',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        cy.wait(4000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .table > tbody > :nth-child(2) > :nth-child(6)').then($amount=>{
            let amountOfUser=$amount.text()
            amountOfUser=Number(amountOfUser.replace(/\$|,/g, ''))
            expect(amountOfUser).to.eq(creditToComp)
        })
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NUVIAD_PROD_DASHBOARD}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(20000)
    })
    it('Check credit change for the user', function () {
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el) => {
            let credit = $el.text()
            credit = Number(credit.replace(/\$|,/g, ''))
            creditToComp=Number(creditToComp)
            cy.wrap(credit).should('eq', creditToComp)
        })
    })
})

describe('Test credit request rejecting process', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(20000)
    })
    it('Get the credit amount of the user', function () {
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el) => {
            let credit = $el.text()
            initCredit = Number(credit.replace(/\$|,/g, ''))
        })
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(20000)
        cy.log(initCredit)
    })

    it('Enter accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(5000)

    })
    it('Create credit request', function () {
        cy.get(':nth-child(3) > .sc-bdVaJa').click()
        cy.get('form > .row > :nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type('Patternz')
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.get('#amount').clear()
        cy.get('#amount').type(1000)
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()

    })
    it('Reject request', function () {
        cy.get(':nth-child(1) > :nth-child(10) > .btn-group > :nth-child(2) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(20000)
    })
    it('Check credit change for the user', function () {
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el) => {
            let credit = $el.text()
            credit = Number(credit.replace(/\$|,/g, ''))
            cy.wrap(credit).should('eq', initCredit)
        })
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(20000)
        
    })
    it('Enter account section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(5000)

    })
})

 describe('Daily actors spend', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getActorSpendAPI(urlToTest) {
        let currentDate = dayjs()
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
    function actorSpendSorting(col, apiUp, apiDown) {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-daily-actor-spend-card > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`#nuviad-daily-actor-spend-card > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }
    it('Test daily actor spend table', function () {
        cy.get('#nuviad-daily-actor-spend-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click({ force: true })
        cy.wait(5000)
        cy.request(getActorSpendAPI(`${this.data.API_BASE_URL}/admin/stats/accounts/daily/summary`)).then(response => {
            const actorsCount = response.body.related_entities.accounts.length
            cy.get('#nuviad-daily-actor-spend-table > .dataTables_wrapper > .dataTables_info').should('contain.text', actorsCount + " entries")
        })
    })

    it('Table rows display test', function () {
        cy.selectTableRows('25', 25, 3, '#nuviad-daily-actor-spend-card')
        
        cy.selectTableRows('10', 10, 3, '#nuviad-daily-actor-spend-card')
        cy.selectTableRows('50', 50, 3, '#nuviad-daily-actor-spend-card')
    })

    it('Test date change and compare table data with API data', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-daily-actor-spend-card > .pt-3 > :nth-child(1) > .col-lg-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.log(yesterday.format('DD'))
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.wait(5000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/accounts/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`, Authorization)
        let actorsCountCheck = 0
        cy.request(getActorSpendAPI(`${this.data.API_BASE_URL}/admin/stats/accounts/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`)).then(response => {
            for (let i = 0; i < response.body.related_entities.accounts.length; i++) {
                for (let j = 0; j < response.body.related_entities.accounts.length; j++) {
                    cy.get(`#nuviad-daily-actor-spend-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(1) > a`).then($el => {
                        let elementText = $el.text()
                        let nameInApi = response.body.related_entities.accounts[i].name
                        if (elementText == nameInApi) {
                            actorsCountCheck++
                            for (let t = 0; t < response.body.rows.length; t++) {
                                if (response.body.rows[t].actor_id == response.body.related_entities.accounts[i].id) {
                                    for (let k = 2; k <= 7; k++) {
                                        cy.get(`#nuviad-daily-actor-spend-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(${k})`).then($el => {
                                            let elementValue = $el.text()
                                            if (k == 2) {
                                                elementValue = Number(elementValue.replace(/\$|,/g, ''))
                                                expect(elementValue).eq(response.body.rows[t].impressions)
                                            }
                                            if (k == 3) {
                                                elementValue = Number(elementValue.replace(/\$|,/g, ''))
                                                expect(elementValue).eq(response.body.rows[t].clicks)
                                            }
                                            if (k == 4) {
                                                elementValue = Number(elementValue.replace(/\$|,/g, '')).toFixed(2)
                                                let cpc = (response.body.rows[t].cpc).toFixed(2)
                                                expect(elementValue).eq(cpc)
                                            }
                                            if (k == 5) {
                                                elementValue = Number(elementValue.replace("%", '')).toFixed(2)
                                                let ctr = (response.body.rows[t].ctr).toFixed(2)
                                                if (elementValue > 1) {
                                                    elementValue = Math.round(elementValue)
                                                }
                                                if (ctr > 1) {
                                                    ctr = Math.round(ctr)
                                                }
                                                expect(elementValue).eq(ctr)
                                            }
                                            if (k == 6) {
                                                elementValue = Number(elementValue.replace(/\$|,/g, '')).toFixed(2)
                                                let cost = Number(response.body.rows[t].cost).toFixed(2)
                                                expect(elementValue).eq(cost)
                                            }
                                            if (k == 7) {
                                                elementValue = Number(elementValue.replace(/\$|,/g, '')).toFixed(2)
                                                let spend = Number(response.body.rows[t].spend).toFixed(2)
                                                expect(elementValue).eq(spend)
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    })
                }
            }
            cy.log(actorsCountCheck).then(() => expect(actorsCountCheck).equal(response.body.related_entities.accounts.length))
        })
    })

    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-daily-actor-spend-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Daily actor spend ${yesterday.format('DD_MM_YYYY')}.csv`)).should("exist");
    })
}) 

 describe('Create credit request through accounts table', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAccountsApi(urlToTest) {
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
    function getCreditApi(urlToTest) {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'POST',
            url: urlToTest,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }
    it('View active accounts', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ACTIVE').click()
    })
    it('User check', function () {
        let userName = ''
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        cy.wait(3000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .table > tbody > :nth-child(2) > :nth-child(2)').then($nameText => {
            cy.get('#nuviad-accounts-table > .dataTables_wrapper > .table > tbody > :nth-child(2) > :nth-child(5)').then($emailText => {
                userName = $nameText.text() + " (" + $emailText.text() + ")"
                cy.get(':nth-child(2) > :nth-child(14) > .btn-group > :nth-child(6) > svg').click()
                cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').should('contain.text', userName)
            })
        })
    })
    it('Creating a credit request with negative value', function () {
        cy.get('#amount').clear()
        cy.get('#amount').type('-50')
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(6000)
    })

}) 

 describe('Allowed features', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        cy.wait(3000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Allow Use JS tags, Vast tags, Create video ad, Landing pages, Audience segments, GEO traps,Targeting lists,Frequency Cap, User ID in report and Campaigns bulk update', function () {
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.contains('Use JS Tags').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Use VAST Tags').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Display campaign frequency cap in table').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Create video ads').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaigns bulk update').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Targeting lists').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Landing pages').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('GEO Traps').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Audience segments').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Report show user id').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get(':nth-child(5) > a').click()
        cy.get('#upload-ads-button').click()
        cy.contains('Use Ad tag').should('be.visible')
        cy.contains('Use VAST').should('be.visible')
        cy.contains('Create video Ad').should('be.visible')
        cy.contains('Landing Pages').should('be.visible')
        cy.contains('GEO Traps').should('be.visible')
        cy.contains('Targeting Lists').should('be.visible')
        cy.contains('Audience Segments').should('be.visible')
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.contains('Frequency Cap').should('be.visible')
        cy.get('.md-checkbox-column > .ng-scope > .md-container').click()
        cy.get(':nth-child(2) > .btn-group').click()
        cy.contains('Update campaigns').should('be.visible')
        cy.get(':nth-child(3) > .menu-drop-content > :nth-child(1) > a').click()
        cy.get('.btn').click()
        cy.get('segments-selection > .Select > .Select-control').click()
        cy.get('segments-selection > .Select > .Select-control').click()
        cy.get('#react-select-3--list').contains('User ID').should('exist')

    })
    it('Login again to admin dashboard', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Disable Use JS tags, Vast tags, Create video ad, Landing pages, Audience segments, GEO traps,Targeting lists,Frequency Cap and Campaigns bulk update', function () {
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if disabled', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get(':nth-child(5) > a').click()
        cy.get('#upload-ads-button').click()
        cy.contains('Use Ad tag').should('not.be.visible')
        cy.contains('Use VAST').should('not.be.visible')
        cy.contains('Create video Ad').should('not.exist')
        cy.contains('Landing Pages').should('not.exist')
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.contains('Frequency Cap').should('not.be.visible')
        cy.get('.md-checkbox-column > .ng-scope > .md-container').click()
        cy.get(':nth-child(2) > .btn-group').click()
        cy.contains('Update campaigns').should('not.exist')
        cy.get(':nth-child(3) > .menu-drop-content > :nth-child(1) > a').click()
        cy.get('.btn').click()
        cy.get('segments-selection > .Select > .Select-control').click()
        cy.get('segments-selection > .Select > .Select-control').click()
        cy.get('#react-select-3--list').contains('User ID').should('not.exist')
    })

    it('Login again to admin dashboard', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Allow ZipCode targeting, Account labels, Allow setting campaign learning attributes, Retargeting, Campaign cpc goal Apps targeting users Age targeting and Gender targeting', function () {
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.contains('Zip codes targeting').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign auction type').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign frequency cap cooldown').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign user gender targeting').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign user age targeting').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Account labels').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Apps targeting users').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Allow setting campaign learning attributes').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Retargeting').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign cpc goal').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('fieldset > :nth-child(2) > .ng-scope > .ng-binding').should('be.visible')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('Gender Targeting').should('be.visible')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('Age Targeting').should('be.visible')
        cy.get('#form_basic_info > .col-md-12 > .well').contains('Labels').should('be.visible')
        cy.get('#form_app_targeting > .col-md-12 > .well > fieldset > :nth-child(2) > .checkbox > .ng-binding > .ng-pristine').click()
        cy.get('.row > .checkbox > .ng-binding').should('be.visible')
        cy.get('#form_campaign_learning > .col-md-12 > .well').contains('Maximum number of impressions per source').should('be.visible')
        cy.get('fieldset > :nth-child(2) > :nth-child(1) > :nth-child(2) > .form-control').should('be.enabled')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('User cooldown').should('be.visible')
        cy.get('.sidebar').contains('Retargeting').should('be.visible')
        cy.get('[du-smooth-scroll="form_user_retargeting"]').should('be.visible')
        cy.get('#form_budget > .col-md-12 > .well').contains('CPC goal').should('be.visible')
    })
    it('Login again to admin dashboard', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Disable ZipCode targeting, Account labels, Allow setting campaign learning attributes, Retargeting, Campaign cpc goal Apps targeting users Age targeting and Gender targeting', function () {
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if disabled', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('fieldset > :nth-child(2) > .ng-scope > .ng-binding').should('not.exist')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('Gender Targeting').should('not.exist')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('Age Targeting').should('not.exist')
        cy.get('#form_basic_info > .col-md-12 > .well').contains('Labels').should('not.exist')
        cy.get('#form_app_targeting > .col-md-12 > .well > fieldset > :nth-child(2) > .checkbox > .ng-binding > .ng-pristine').click()
        cy.get('.row > .checkbox > .ng-binding').should('not.exist')
        cy.get('.col-lg-10').contains('App / Domain impression limit').should('not.exist')
        cy.get('fieldset > :nth-child(2) > :nth-child(1) > :nth-child(2) > .form-control').should('be.disabled')
        cy.get('#form_user_targeting > .col-md-12 > .well').contains('User cooldown').should('not.exist')
        cy.get('.sidebar').contains('Retargeting').should('not.exist')
        cy.get('[du-smooth-scroll="form_user_retargeting"]').should('not.exist')
        cy.get('#form_budget > .col-md-12 > .well').contains('CPC goal').should('not.exist')
    })

    it('Login again to admin dashboard', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Allow Target google billing id, Target app rank, RTB campaign configuration, Impression delivery limit, Allow quick spend, Enable option to set click to chat, Click to call and Campaign placements targeting', function () {
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.contains('RTB campaign configuration').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Target app rank').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Target google billing id').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Allow quick spend').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Impression delivery limit').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Enable option to set click to chat').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Click to call').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.contains('Campaign placements targeting').click()
        
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('#form_targeting_exchange_networks > .col-md-12 > .well').contains('Target Billing Ids').should('be.visible')
        cy.get('.col-lg-10').contains('Set Campaign as RTB Campaign').should('be.visible')
        cy.get('#form_app_targeting > .col-md-12 > .well > fieldset > :nth-child(2) > .checkbox > .ng-binding > .ng-pristine').click()
        cy.get('#form_app_targeting > .col-md-12 > .well').contains('Target by App Rank in store').should('be.visible')
        cy.get('#d').select('As quickly as possible').should('be.visible')
        cy.get('.modal-footer > .btn-link').click()
        cy.get('#form_budget > .col-md-12 > .well').contains('Use impression limit').should('be.visible')
        cy.get('fieldset > .filled > .form-control').select('Click to Chat').should('be.visible')
        cy.get('fieldset > .filled > .form-control').select('Leads or Calls to your business').should('be.visible')
        cy.get('.col-lg-10').contains('Placements Targeting').should('be.visible')
    })
    it('Login again to admin dashboard', function () {
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Accounts section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account', function () {
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal', function () {
        cy.get(':nth-child(8) > svg').click()
    })
    it('Disable Target google billing id, Target app rank, RTB campaign configuration, Impression delivery limit, Allow quick spend, Enable option to set click to chat, Click to call and Campaign placements targeting', function () {
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if disabled', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER, this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('#form_targeting_exchange_networks > .col-md-12 > .well').contains('Target Billing Ids').should('not.exist')
        cy.get('.col-lg-10').contains('Set Campaign as RTB Campaign').should('not.exist')
        cy.get('#form_app_targeting > .col-md-12 > .well > fieldset > :nth-child(2) > .checkbox > .ng-binding > .ng-pristine').click()
        cy.get('#form_app_targeting > .col-md-12 > .well').contains('Target by App Rank in store').should('not.exist')
        cy.get('#d').should('be.disabled')
        cy.get('#form_budget > .col-md-12 > .well').contains('Use impression limit').should('not.exist')
        cy.get('fieldset > .filled > .form-control').should('not.exist')
        cy.get('.col-lg-10').contains('Placements Targeting').should('not.exist')
    }) 
})