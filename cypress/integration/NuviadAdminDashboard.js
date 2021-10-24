/// <reference types="Cypress" />
let initCredit = 0
let creditToComp = 0
const dayjs = require('dayjs')

describe('Login Admin dashboard', function () {
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
    /* it('Logout',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.NuviadAdminDashboard}/login/`)
    })
    it('Login again', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(6000)

    }) */
})
/* describe('Stats and APIs tests',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getApiRes(data){
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${data.API_BASE_URL}/v2/campaigns?limit=15&offset=0&order=status&order=-spending_today&order=created&page_number=1&q=`,
            headers: {
                Authorization,
            },
            body:{}
        } 
        return apiToTest
    }
    it('Check stats and charts APIs', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        // cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily/summary`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/minute`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/campaigns/daily/summary`, Authorization)
    })
    it('Check stats data',{retries:{openMode:3}}, function () {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/admin/stats/daily/summary`,
            headers: {
                Authorization,
            },
            body:{}
        }
        cy.get('.align-items-center > :nth-child(2) > .sc-bdVaJa').click({force:true})
        cy.request(apiToTest).then(response=>{
            const imp=Number(response.body.impressions)
            const clicks=Number(response.body.clicks)
            const cpc=Number(response.body.cpc)+0.1
            const revenue=Number(response.body.revenue)
            const cost=Number(response.body.cost)
            const profit=Number(response.body.profit)
            const arr=[imp,clicks,cpc,revenue,cost,profit]
            var i=0

            cy.get('.tx-normal').each(($el,index,$list)=>{
                var elValue=$el.text()
                elValue=Number(elValue.replace(/\$|,/g, ''))

                cy.log(elValue)
                cy.wrap(arr[i]++).should('be.gte',elValue)

            })


        })
    })
    
}) */
/* describe('Test pending ads table',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAdsApi(data){
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
        cy.get(':nth-child(5) > .col-md-12 > .mg-b-10 > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click({force:true})
        
        cy.request(getAdsApi(this.data)).then(response => {
            
            const adsCount=Number(response.body.items.length)
            cy.get('.dataTables_info').eq(0).should('contain.text',adsCount)
            cy.wrap(adsCount).should('eq',response.body.meta_data.total)
            let count=0;
            for(let i=0;i<response.body.items.length;i++){
                if(response.body.items[i].owner=="actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO" && response.body.items[i].approved==false){
                    count++;
                }
            }
            cy.log(count)
        })
    })
    it('Test search',function(){
        cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        // cy.get(':nth-child(1) > :nth-child(8) > .btn-group > :nth-child(1) > svg').eq(0).click()
        cy.request(getAdsApi(this.data)).then(response=>{
            let count=0;
            for(let i=0;i<response.body.items.length;i++){
                if(response.body.items[i].owner=="actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO" && response.body.items[i].approved==false){
                    count++;
                }
            }
            cy.log(count)
            cy.get('.dataTables_info').eq(0).should('contain.text',count)
            cy.get('.mg-b-10 > .card-body > :nth-child(2) > .col-lg-12 > .table-responsive > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        })
    })
    it('Table rows display test',function(){
        cy.selectTableRows('25',25,0,'#nuviad-ads-card')
        cy.selectTableRows('50',50,0,'#nuviad-ads-card')
        cy.selectTableRows('100',100,0,'#nuviad-ads-card')
        cy.selectTableRows('10',10,0,'#nuviad-ads-card')
    })
    it('Ad preview',function(){
        cy.get(':nth-child(1) > :nth-child(8) > .btn-group > :nth-child(1) > svg').click()
        cy.get('.btn-primary').click()
    })
}) */
/* describe('Test pending accounts table',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAccountsApi(urlToTest){
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
    function accountsSorting(col,apiUp,apiDown){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-accounts-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp,Authorization)
        cy.get(`#nuviad-accounts-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown,Authorization)
    }
    it('Test pending accounts count with the API', function () {
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`)).then(response => {
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count) 
        })
    })
    it('Test all accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container > .css-yk16xz-control > .css-1wy0on6 > .css-tlfecz-indicatorContainer').click()
        cy.get('#react-select-6-option-0').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count) 
        })
    })
    it('Test active accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-2').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=ACTIVE`)).then(response => {
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"ACTIVE")
            }
        })
    })
    it('Test inactive accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-3').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=INACTIVE`)).then(response => {
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"INACTIVE")
            }
        })
    })
    it('Test suspended accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-4').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=SUSPENDED`)).then(response => {
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"SUSPENDED")
            }
        })
    })
    it('Test search',function(){
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-1').click()
        cy.wait(3000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Liel')
        cy.wait(3000)
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`)).then(response=>{
            let count=0;
            for(let i=0;i<response.body.rows.length;i++){
                if(response.body.rows[i].name=="Liel"){
                    count++;
                }
            }
            cy.log(count)
            cy.get('.dataTables_info').eq(1).should('contain.text',count)
            cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
            cy.wait(3000)
        })
    })
    it('Table rows display test',function(){
        cy.selectTableRows('25',25,1,'#nuviad-accounts-table')
        cy.selectTableRows('50',50,1,'#nuviad-accounts-table')
        cy.selectTableRows('100',100,1,'#nuviad-accounts-table')
        cy.selectTableRows('10',10,1,'#nuviad-accounts-table')
    })
    it('Table rows display test',function(){
        cy.selectTableRows('25',25,1,'#nuviad-accounts-card')
        cy.selectTableRows('50',50,1,'#nuviad-accounts-card')
        cy.selectTableRows('100',100,1,'#nuviad-accounts-card')
        cy.selectTableRows('10',10,1,'#nuviad-accounts-card')
    })
    it('ID sorting',function(){
        accountsSorting(1,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=v1_id`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-v1_id`)
    })
    it('Name sorting',function(){
        accountsSorting(2,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=name`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-name`)
    })
    it('Created at sorting',function(){
        accountsSorting(4,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=created_at`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)
    })
    it('Email sorting',function(){
        accountsSorting(5,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=email`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-email`)
    })
    it('Views sorting',function(){
        accountsSorting(6,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=views`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-views`)
    })
    it('Views today sorting',function(){
        accountsSorting(7,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=views_today`,`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-views_today`)
    })
}) */
/* describe('Create credit request through accounts table',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAccountsApi(urlToTest){
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
    function getCreditApi(urlToTest){
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
    it('View active accounts',function(){
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-2').click()
    })
    it('User check',function(){
        let userName=''
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        cy.wait(3000)
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .table > tbody > :nth-child(2) > :nth-child(2)').then($nameText=>{
            cy.get('#nuviad-accounts-table > .dataTables_wrapper > .table > tbody > :nth-child(2) > :nth-child(5)').then($emailText=>{
                userName=$nameText.text()+" ("+$emailText.text()+")"
                cy.get(':nth-child(2) > :nth-child(12) > .btn-group > :nth-child(4) > svg').click()
                cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').should('contain.text',userName)
            })  
        })
    })
    it('Creating a credit request with negative value',function(){
        cy.get('#amount').clear()
        cy.get('#amount').type('-50')
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(6000)
    })
    it('Compare api data and credit request details',function(){
        let amount=5
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests`)).then((response)=>{
            cy.log(response.status)
            cy.log(response.body.status)
            cy.log(response.body.requester_id)
            amount=Number(response.body.amount)
            cy.log(amount)
        })
    })
}) */

/* describe('Test transactions table',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getTransactionsApi(urlToTest){
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
    function transactionsSorting(col,apiUp,apiDown){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-billing-transactions-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp,Authorization)
        cy.get(`#nuviad-billing-transactions-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown,Authorization)
    }
    it('Table rows display test',function(){
        cy.selectTableRows('25',25,2,'.mg-t-40 > :nth-child(5) > :nth-child(3)')
        cy.selectTableRows('50',50,2,'.mg-t-40 > :nth-child(5) > :nth-child(3)')
        cy.selectTableRows('100',100,2,'.mg-t-40 > :nth-child(5) > :nth-child(3)')
        cy.selectTableRows('10',10,2,'.mg-t-40 > :nth-child(5) > :nth-child(3)')
    })
    it('Search test',function(){
        cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_filter > label > input').type('Patternz')
        cy.wait(3000)
        cy.request(getTransactionsApi(`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at&q=Patternz`)).then(response=>{
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].custom).should('eq',"actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO")
            }
            cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_info').should('contain.text',response.body.total_count)
        })
        cy.get('#nuviad-billing-transactions-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        cy.wait(3000)
    })
    it('ID sorting',function(){
        transactionsSorting(1,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=txn_id`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-txn_id`)
    })
    it('Account sorting',function(){
        transactionsSorting(2,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=custom`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-custom`)
    })
    it('Created at sorting',function(){
        transactionsSorting(3,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=created_at`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at`)
    })
    it('Payment type sorting',function(){
        transactionsSorting(4,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=payment_type`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-payment_type`)
    })
    it('Payment gross sorting',function(){
        transactionsSorting(5,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=payment_gross`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-payment_gross`)
    })
    it('Currency sorting',function(){
        transactionsSorting(6,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=mc_currency`,`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-mc_currency`)
    })
}) */

/* describe('Credit requests',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function creditSorting(col,apiUp,apiDown){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-credit-request-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp,Authorization)
        cy.get(`#nuviad-credit-request-table > .dataTables_wrapper > .table > thead > tr > :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown,Authorization)
    }
    function getCreditApi(urlToTest){
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
    it('Account sorting',function(){
        creditSorting(1,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=account_id&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-account_id&status=PENDING`)
    })
    it('Created at sorting',function(){
        creditSorting(3,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=created_at&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`)
    })
    it('Updated at sorting',function(){
        creditSorting(4,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=updated_at&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-updated_at&status=PENDING`)
    })
    it('Amount sorting',function(){
        creditSorting(5,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=amount&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-amount&status=PENDING`)
    })
    it('Currency sorting',function(){
        creditSorting(6,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=currency&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-currency&status=PENDING`)
    })
    it('Notes sorting',function(){
        creditSorting(7,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=notes&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-notes&status=PENDING`)
    })
    it('ID sorting',function(){
        creditSorting(8,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=_id&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-_id&status=PENDING`)
    })
    it('Requester sorting',function(){
        creditSorting(9,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=requester_id&status=PENDING`,`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-requester_id&status=PENDING`)
    })
    it('Refresh table',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.align-items-center > .d-flex > :nth-child(2) > .sc-bdVaJa').click
        cy.wait(4000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`,Authorization)
    })
    it('View all requests',function(){
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('#react-select-7-option-0').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at`)).then(response=>{
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text',response.body.total_count)
        })
    })
    it('View approved requests',function(){
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-7-option-2').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=APPROVED`)).then(response=>{
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text',response.body.total_count)
            for(let i=0;i<response.body.rows.lenght;i++){
                cy.wrap(response.body.rows[i].status).should('eq','APPROVED')
            }
        })
    })
    it('View rejected requests',function(){
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-7-option-3').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=REJECTED`)).then(response=>{
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text',response.body.total_count)
            for(let i=0;i<response.body.rows.lenght;i++){
                cy.wrap(response.body.rows[i].status).should('eq','REJECTED')
            }
        })
    })
    it('View pending requests',function(){
        cy.get('#nuviad-credit-request-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-7-option-1').click()
        cy.wait(3000)
        cy.request(getCreditApi(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`)).then(response=>{
            cy.get('#nuviad-credit-request-table > .dataTables_wrapper > .dataTables_info').should('contain.text',response.body.total_count)
            for(let i=0;i<response.body.rows.lenght;i++){
                cy.wrap(response.body.rows[i].status).should('eq','PENDING')
            }
        })
    })
})
describe('Test credit request approving process',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Login to dashboard',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
    it('Get the credit amount of the user',function(){
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el)=>{
            let spending=$el.text()
            initCredit=Number(spending.replace(/\$|,/g, ''))
        })
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.log(initCredit)
    })
    it('Create credit request',function(){
        cy.get('#nuviad-credit-request-card > .align-items-center > .d-flex > :nth-child(1) > .sc-bdVaJa').click()
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.form-group > .css-2b097c-container').type('Patternz')
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.get('#amount').clear()
        cy.get('#amount').type(1000)
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        creditToComp=initCredit+1000
    })
    it('Approve request',function(){
        cy.get(':nth-child(1) > :nth-child(10) > .btn-group > :nth-child(1) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(10000)
    })
    it('Login to dashboard',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
    it('Check credit change for the user',function(){
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el)=>{
            let credit=$el.text()
            credit=Number(credit.replace(/\$|,/g, ''))
            cy.wrap(credit).should('eq',creditToComp)
        })
    })
})

describe('Test credit request rejecting process',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Login to dashboard',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
    it('Get the credit amount of the user',function(){
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el)=>{
            let credit=$el.text()
            initCredit=Number(credit.replace(/\$|,/g, ''))
        })
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.log(initCredit)
    })
    it('Create credit request',function(){
        cy.get('#nuviad-credit-request-card > .align-items-center > .d-flex > :nth-child(1) > .sc-bdVaJa').click()
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.form-group > .css-2b097c-container').type('Patternz')
        cy.get('.css-11unzgr').contains('Patternz (sivangrisario@gmail.com)').click()
        cy.get('#amount').clear()
        cy.get('#amount').type(1000)
        cy.get('#notes').type('Automation test')
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        
    })
    it('Reject request',function(){
        cy.get(':nth-child(1) > :nth-child(10) > .btn-group > :nth-child(2) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
    })
    it('Login to dashboard',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
    it('Check credit change for the user',function(){
        cy.getToken("sivangrisario@gmail.com", "sivan")
        cy.get('h3').eq(0).then(($el)=>{
            let credit=$el.text()
            credit=Number(credit.replace(/\$|,/g, ''))
            cy.wrap(credit).should('eq',initCredit)
        })
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.log(initCredit)
    })
}) */

/* describe('Charts',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getMinApi(urlToTest){
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
    it('Check actors names in Wins per minutes chart',function(){
        cy.get('#nuviad-per-minute-card-wins > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(5000)
        cy.get('#nuviad-per-minute-card-wins > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
                cy.log(actorsArr[i])
            }
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsLenght;i++){
                    for(let j=0;j<actorsLenght;j++){
                        if(actorsArr[i]==response.body.related_entities.accounts[j].name){
                            compCount++
                        }
                    }
                }
                cy.wrap(compCount).should('eq',actorsLenght)
            })
        })
    })
    it('Check actors names in Clicks per minutes chart',function(){
        cy.get('#nuviad-per-minute-card-clicks > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(5000)
        cy.get('#nuviad-per-minute-card-clicks > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
                cy.log(actorsArr[i])
            }
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsLenght;i++){
                    for(let j=0;j<actorsLenght;j++){
                        if(actorsArr[i]==response.body.related_entities.accounts[j].name){
                            compCount++
                        }
                    }
                }
                cy.wrap(compCount).should('eq',actorsLenght)
            })
        })
    })
    it('Check actors names in Spend per minutes chart',function(){
        cy.get('#nuviad-per-minute-card-spend > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(5000)
        cy.get('#nuviad-per-minute-card-spend > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
            }
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsLenght;i++){
                    for(let j=0;j<actorsLenght;j++){
                        if(actorsArr[i]==response.body.related_entities.accounts[j].name){
                            compCount++
                        }
                    }
                }
                cy.wrap(compCount).should('eq',actorsLenght)
            })
        })
    })
}) */

describe('Daily actor spend', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getActorSpendAPI(urlToTest) {
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
            const actorsCount = response.body.rows.length
            cy.get('#nuviad-daily-actor-spend-table > .dataTables_wrapper > .dataTables_info').should('contain.text', actorsCount + " entries")
        })
    })
     it('Table rows display test',function(){
         cy.selectTableRows('25',25,4,'#nuviad-daily-actor-spend-card')
         cy.selectTableRows('50',50,4,'#nuviad-daily-actor-spend-card')
         /* cy.selectTableRows('100',100,4,'#nuviad-daily-actor-spend-card') */
         cy.selectTableRows('10',10,4,'#nuviad-daily-actor-spend-card')
     })

    it('Test date change', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-daily-actor-spend-card > .pt-3 > :nth-child(1) > .col-lg-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        let currentDate = dayjs()
        let yesterday=currentDate.subtract(1,'days')
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/accounts/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`,Authorization)
    })
})

/* describe('Allowed features',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-2').click()
        
    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('TestUser')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Allow Use JS tags & Vast tags',function(){
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('#react-select-8-option-1').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-8-option-2').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
        cy.get(':nth-child(4) > a').click()
        cy.get('#upload-ads-button').click()
        cy.get('.uib-dropdown-menu > :nth-child(4) > .ng-scope').should('be.visible')
        cy.get('.uib-dropdown-menu > :nth-child(5) > .ng-scope').should('be.visible')
    })
    it('Login again to admin dashboard',function(){
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.get('#react-select-6-option-2').click()
        
    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('TestUser')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Disable Use JS tags & Vast tags',function(){
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
        cy.get(':nth-child(4) > a').click()
        cy.get('#upload-ads-button').click()
        cy.get('.uib-dropdown-menu > :nth-child(4) > .ng-scope').should('not.be.visible')
        cy.get('.uib-dropdown-menu > :nth-child(5) > .ng-scope').should('not.be.visible')
    })
}) */