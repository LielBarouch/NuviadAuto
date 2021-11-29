/// <reference types="Cypress" />
let initCredit = 0
let creditToComp = 0
const qps = 120
const path = require("path");
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
        cy.wait(30000)

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
/* describe('Stats and APIs tests', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getApiRes(data) {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${data.API_BASE_URL}/v2/campaigns?limit=15&offset=0&order=status&order=-spending_today&order=created&page_number=1&q=`,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }
    it('Check stats and charts APIs', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily/summary`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/minute`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/billing/transactions?limit=10&offset=0&sort=-created_at`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/credit_requests?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/campaigns/daily/summary`, Authorization)
    })
    it('Check stats data', { retries: { openMode: 3 } }, function () {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/admin/stats/daily/summary`,
            headers: {
                Authorization,
            },
            body: {}
        }
        cy.get(':nth-child(4) > .sc-bdVaJa').click({ force: true })
        cy.request(apiToTest).then(response => {
            const imp = Number(response.body.impressions)
            const clicks = Number(response.body.clicks)
            const cpc = Number(response.body.cpc) + 0.1
            const revenue = Number(response.body.revenue)
            const cost = Number(response.body.cost)
            const profit = Number(response.body.profit)
            const arr = [imp, clicks, cpc, revenue, cost, profit]
            var i = 0

            cy.get('.tx-normal').each(($el, index, $list) => {
                var elValue = $el.text()
                elValue = Number(elValue.replace(/\$|,/g, ''))

                cy.log(elValue)
                cy.wrap(arr[i]++).should('be.gte', elValue)

            })


        })
    })

}) */

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
        cy.selectTableRows('25', 25, 2, '#nuviad-billing-transactions-table')
        cy.selectTableRows('50', 50, 2, '#nuviad-billing-transactions-table')
        cy.selectTableRows('100', 100, 2, '#nuviad-billing-transactions-table')
        cy.selectTableRows('10', 10, 2, '#nuviad-billing-transactions-table')
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
}) */

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
}) */

/* describe('Test credit request approving process', function () {
    
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken('liel@nuviad.com', 'lb123456')
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
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
        
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.wait(10000)
    })
    it('Login', function () {
        
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(20000)
        cy.log(initCredit)
    })
    it('Create credit request', function () {
        cy.get('#nuviad-credit-request-card > .align-items-center > .d-flex > :nth-child(1) > .sc-bdVaJa').click()
        cy.get('form > .row > :nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').click()
        cy.get('[style="transform: none; width: 711px; height: 29px; position: absolute; z-index: 2147483647; background-color: rgb(159, 196, 231); top: -4105.58px; left: 626px;"]').type('Patternz')
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
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(20000)
        cy.log(initCredit)
    })
    it('Create credit request', function () {
        cy.get('#nuviad-credit-request-card > .align-items-center > .d-flex > :nth-child(1) > .sc-bdVaJa').click()
        cy.get('form > .row > :nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').click()
        cy.get('.form-group > .css-2b097c-container').type('Patternz')
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
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(20000)
        
    })
}) */

describe('Charts', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getAPI(urlToTest) {
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
    /* it('Check actors names in Wins per minutes chart',function(){
        cy.get('#nuviad-per-minute-card-wins > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(8000)
        cy.get('#nuviad-per-minute-card-wins > .align-items-center > .d-flex > span').then($updated=>{
            expect($updated.text()).to.eq('just now')
        })
        cy.get('#nuviad-per-minute-card-wins > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
            }
            cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsArr.length;i++){
                    for(let j=0;j<response.body.related_entities.accounts.length;j++){
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
        cy.wait(8000)
        cy.get('#nuviad-per-minute-card-clicks > .align-items-center > .d-flex > span').then($updated=>{
            expect($updated.text()).to.eq('just now')
        })
        cy.get('#nuviad-per-minute-card-clicks > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
                cy.log(actorsArr[i])
            }
            cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsArr.length;i++){
                    for(let j=0;j<response.body.related_entities.accounts.length;j++){
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
        cy.wait(8000)
        cy.get('#nuviad-per-minute-card-spend > .align-items-center > .d-flex > span').then($updated=>{
            expect($updated.text()).to.eq('just now')
        })
        cy.get('#nuviad-per-minute-card-spend > .card-body > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > .recharts-legend-wrapper > .recharts-default-legend>.recharts-legend-item>.recharts-legend-item-text').as('actorsInChart')
        let compCount=0
        let actorsArr=[]
        cy.get('@actorsInChart').then($el=>{
            let actorsLenght=$el.length
            for(let i=0;i<actorsLenght;i++){
                actorsArr[i]=$el.eq(i).text()
            }
            cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
                for(let i=0;i<actorsArr.length;i++){
                    for(let j=0;j<response.body.related_entities.accounts.length;j++){
                        if(actorsArr[i]==response.body.related_entities.accounts[j].name){
                            compCount++
                        }
                    }
                }
                cy.wrap(compCount).should('eq',actorsLenght)
            })
        })
    }) */

    /* it('Exchange minute traffice chart' ,{retries:3},function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchange-minute-traffic-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(8000)
        cy.get('#nuviad-exchange-minute-traffic-card > .align-items-center > .d-flex > span').then($updated=>{
            expect($updated.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=1`,Authorization)
        cy.get('.col-sm-2 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('2').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=2`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('3').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=3`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=6`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('12').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=12`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('24').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=24`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('48').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=48`,Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('72').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=72`,Authorization)
        cy.get('#nuviad-exchange-minute-traffic-card > .card-body > .p-2 > .col-sm-4 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('Beachfront').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_sQcqbo4KvZ/minute_traffic?hours=72`,Authorization)
    })
    it('Check if Exchange minute traffice chart is visable to non-admin user',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.NuviadAdminDashboard}/login/`)
        cy.wait(3000)
        cy.AdminLogin("stg-admin@nuviad.com", "qwerty123")
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.get('#nuviad-exchange-minute-traffic-card').should('not.exist')
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.NuviadAdminDashboard}/login/`)
        cy.wait(3000)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
    })

    it('Test Exchanges Minute QPS by server', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchange-minute-qps-by-server-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(20000)
        cy.get('#nuviad-exchange-minute-qps-by-server-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_server?hours=3`, Authorization)
        cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_server?hours=3`)).then(response => {
            for (let i = 0; i < response.body.rows.length / 2; i++) {
                cy.get('#nuviad-exchange-minute-qps-by-server-card').find('.recharts-legend-item-text').then($el => {
                    let flag = false
                    for (let j = 0; j < $el.length; j++) {
                        let serv = $el.eq(j)
                        serv = serv.text()
                        if (serv == response.body.rows[i].server_az) {
                            flag = true
                        }
                    }
                    expect(flag).to.eq(true)
                })
            }
        })

        cy.get('#nuviad-exchange-minute-qps-by-server-card > .card-body > .p-2 > .col-sm-2 > .mb-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_server?hours=6`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('12').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_server?hours=12`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('24').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_server?hours=24`, Authorization)
        cy.wait(5000)
    })

    it('Test Exchanges Minute QPS by country', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        const qps = 120
        cy.get('#nuviad-exchange-minute-qps-by-country-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(25000)
        cy.get('#nuviad-exchange-minute-qps-by-country-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=3`, Authorization)
        cy.get('#nuviad-exchange-minute-qps-by-country-card > .card-body > .p-2 > :nth-child(1) > .mb-3 > .form-control').clear()
        cy.get('#nuviad-exchange-minute-qps-by-country-card > .card-body > .p-2 > :nth-child(1) > .mb-3 > .form-control').type(qps)
        cy.get('#nuviad-exchange-minute-qps-by-country-card').find('.recharts-legend-item-text').then($el => {
            let flag = true

            let check = new Array($el.length).fill(false)
            for (let i = 0; i < $el.length; i++) {
                let country = $el.eq(i)
                country = country.text()
                cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=3`)).then(response => {
                    for (let j = 0; j < response.body.rows.length; j++) {
                        if (country == response.body.rows[j].cc) {
                            if (response.body.rows[j].qps >= qps) {

                                check[i] = true
                                cy.log(response.body.rows[j].qps+' '+response.body.rows[j].cc)
                            }
                        }
                    }
                })

            }
            cy.log('').then(() => {
                for (let i = 0; i < check.length; i++) {
                    expect(check[i]).to.eq(true)
                }
            })
        })

        cy.get('#nuviad-exchange-minute-qps-by-country-card > .card-body > .p-2 > .col-sm-2 > .mb-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=6`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('12').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=12`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('24').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=24`, Authorization)
        cy.wait(5000)
    })

    it('Test Minute Conversions',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-per-minute-card-conversions > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(20000)
        cy.get('#nuviad-per-minute-card-conversions > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.get('#nuviad-per-minute-card-conversions > .card-body > .p-2 > .col-sm-2 > .mb-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/conversions/minute?hours=6&stage=0`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('12').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/conversions/minute?hours=12&stage=0`, Authorization)
        cy.wait(5000)
        cy.get('.css-1pahdxg-control').click()
        cy.get('.css-11unzgr').contains('24').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/conversions/minute?hours=24&stage=0`, Authorization)
        cy.wait(5000)
        cy.get('#nuviad-per-minute-card-conversions').find('.recharts-legend-item-text').then($el => {
            let flag=false
            for (let i = 0; i < $el.length; i++) {
                let actors = $el.eq(i)
                actors = actors.text()
                cy.request(getAPI(`${this.data.API_BASE_URL}/admin/stats/conversions/minute?hours=24&stage=0`)).then(response => {
                    for (let j = 0; j < response.body.related_entities.accounts.length; j++) {
                        if(actors==response.body.related_entities.accounts[j].name){
                            for(let k=0;k<response.body.rows.length;k++){
                                if(response.body.rows[k].actor_id==response.body.related_entities.accounts[j].id){
                                    expect(actors).to.eq(response.body.related_entities.accounts[j].name)
                                }
                            }
                        }
                    }
                })

            }
            
        })
    }) */

    it('Exchange by Country',function(){
        const countryCode='ISR'
        const country='Israel'
        let count=0
        cy.get('#nuviad-exchange-country-qps-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({force:true})
        cy.wait(10000)
        cy.get('#nuviad-exchange-country-qps-card > .pt-3 > :nth-child(1) > .col-lg-4 > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type(countryCode)
        cy.get('.css-11unzgr').contains(country).click()
        cy.wait(4000)
        cy.get('#nuviad-exchange-country-qps-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Exchange by country ${country}.csv`)).should("exist");
        cy.request(getAPI(`${this.data.API_BASE_URL}//admin/stats/exchanges/country/qps?cc=${countryCode}`)).then(response=>{
            cy.get('#nuviad-exchange-country-qps-table > .dataTables_wrapper > .table > tbody > tr').then($tableRows=>{
                for(let i=1;i<=$tableRows.length;i++){
                    for(let j=0;j<response.body.related_entities.exchanges.length;j++){
                        cy.get(`#nuviad-exchange-country-qps-table > .dataTables_wrapper > .table > tbody > :nth-child(${i}) > :nth-child(1)`).then($exName=>{
                            if($exName.text()==response.body.related_entities.exchanges[j].name){
                                count++
                            }
                        })
                    }
                }
                cy.log(count).then(()=>{
                    expect(count).to.eq($tableRows.length)
                })
            })
        })
        
    })
})
/*
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
        cy.selectTableRows('25', 25, 4, '#nuviad-daily-actor-spend-card')
        cy.selectTableRows('50', 50, 4, '#nuviad-daily-actor-spend-card')
        cy.selectTableRows('10', 10, 4, '#nuviad-daily-actor-spend-card')
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


describe('Daily exchanges spend', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })

    function getExchangesSpendAPI(urlToTest) {
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

    it('Table rows display test', function () {
        cy.wait(8000)
        cy.selectTableRows('25', 25, 4, '#nuviad-daily-exchange-spend-card')
        cy.selectTableRows('50', 50, 4, '#nuviad-daily-exchange-spend-card')
        cy.selectTableRows('10', 10, 4, '#nuviad-daily-exchange-spend-card')
    })

    it('Refresh table', function () {
        const currentDate = dayjs()
        cy.get('#nuviad-daily-exchange-spend-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(5000)
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/daily/spend?date=${currentDate.format('YYYY-MM-DD')}`, Authorization)
    })


    it('Test date change and compare table data to API data', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-daily-exchange-spend-card > .pt-3 > :nth-child(1) > .col-lg-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.log(yesterday.format('DD'))
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.wait(5000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/accounts/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`, Authorization)
        cy.request(getExchangesSpendAPI(`${this.data.API_BASE_URL}/admin/stats/exchanges/daily/spend?date=${yesterday.format('YYYY-MM-DD')}`)).then(response => {
            cy.get('#nuviad-daily-exchange-spend-table > .dataTables_wrapper > .table>tbody>tr').then($row => {
                for (let i = 0; i < response.body.rows.length; i++) {
                    for (let j = 0; j < $row.length; j++) {
                        if (response.body.rows[i].exchange != "") {
                            cy.get(`#nuviad-daily-exchange-spend-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(2)`).then($el => {
                                if (response.body.rows[i].exchange == $el.text()) {
                                    for (let k = 3; k <= 9; k++) {
                                        cy.get(`#nuviad-daily-exchange-spend-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(${k})`).then($element => {
                                            let elementText = $element.text()
                                            if (k == 3) {
                                                elementText = Number(elementText.replace(/\$|,/g, ''))
                                                expect(elementText).eq(response.body.rows[i].impressions)
                                            }
                                            if (k == 4) {
                                                elementText = Number(elementText.replace(/\$|,/g, ''))
                                                expect(elementText).eq(response.body.rows[i].clicks)
                                            }
                                            if (k == 5) {
                                                elementText = Number(elementText.replace(/\$|,/g, '')).toFixed(2)
                                                let cpc = (response.body.rows[i].cpc).toFixed(2)


                                                expect(elementText).eq(cpc)
                                            }
                                            if (k == 6) {
                                                elementText = Number(elementText.replace("%", '')).toFixed(2)
                                                let ctr = (response.body.rows[i].ctr).toFixed(2)
                                                if (elementText > 1) {
                                                    elementText = Math.round(elementText)
                                                }
                                                if (ctr > 1) {
                                                    ctr = Math.round(ctr)
                                                }
                                                expect(elementText).eq(ctr)
                                            }
                                            if (k == 7) {
                                                elementText = Number(elementText.replace(/\$|,/g, '')).toFixed(2)
                                                let cost = Number(response.body.rows[i].cost).toFixed(2)
                                                expect(elementText).eq(cost)
                                            }
                                            if (k == 8) {
                                                elementText = Number(elementText.replace(/\$|,/g, '')).toFixed(0)
                                                let spend = Number(response.body.rows[i].spend).toFixed(0)
                                                expect(elementText).eq(spend)
                                            }
                                            if (k == 9) {
                                                elementText = Number(elementText.replace(/\$|,/g, '')).toFixed(0)
                                                let profit = Number(response.body.rows[i].profit).toFixed(0)
                                                expect(elementText).eq(profit)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            })

        })
    })

    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-daily-exchange-spend-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Daily exchanges spend ${yesterday.format('DD_MM_YYYY')}.csv`)).should("exist");
    })
})

describe('Daily Campaign Performance', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })

    function getCampaignPerformanceAPI(urlToTest) {
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

    it('Table rows display test', function () {
        cy.wait(8000)
        cy.selectTableRows('25', 25, 3, '#nuviad-daily-campaigns-performance-card')
        cy.selectTableRows('50', 50, 3, '#nuviad-daily-campaigns-performance-card')
        cy.selectTableRows('10', 10, 3, '#nuviad-daily-campaigns-performance-card')
    })



    it('Test date change', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-daily-campaigns-performance-card > .pt-3 > :nth-child(1) > .col-lg-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.log(yesterday.format('DD'))
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.wait(5000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/campaigns/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`, Authorization)
    })

    it('Compare table data to API data', function () {
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.selectTableRows('100', 100, 3, '#nuviad-daily-campaigns-performance-card')
        cy.get('#nuviad-daily-campaigns-performance-table > .dataTables_wrapper > .table > thead > tr > :nth-child(1)').click()
        cy.request(getCampaignPerformanceAPI(`${this.data.API_BASE_URL}/admin/stats/campaigns/daily/summary?date=${yesterday.format('YYYY-MM-DD')}`)).then(response => {
            cy.get('#nuviad-daily-campaigns-performance-table > .dataTables_wrapper > .table > tbody > tr').then($row => {
                expect($row.length).to.eq(response.body.rows.length)
                
            })
        })
        
    })

    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-daily-campaigns-performance-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Daily campaign performance ${yesterday.format('DD_MM_YYYY')}.csv`)).should("exist");
    })
})


describe('Daily exchanges requests', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })

    function getExchangesRequestsAPI(urlToTest) {
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

    it('Table rows display test', function () {
        cy.wait(8000)
        cy.selectTableRows('25', 25, 5, '#nuviad-daily-exchange-requests-card')
        cy.selectTableRows('50', 50, 5, '#nuviad-daily-exchange-requests-card')
        cy.selectTableRows('10', 10, 5, '#nuviad-daily-exchange-requests-card')
    })

    it('Refresh table', function () {
        const currentDate = dayjs()
        cy.get('#nuviad-daily-exchange-requests-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(5000)
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/daily/requests?date=${currentDate.format('YYYY-MM-DD')}`, Authorization)
    })


    it('Test date change and compare table data to API data', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-daily-exchange-requests-card > .pt-3 > :nth-child(1) > .col-lg-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get(`.react-datepicker__day--0${yesterday.format('DD')}`).eq(0).click()
        cy.wait(5000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/daily/requests?date=${yesterday.format('YYYY-MM-DD')}`, Authorization)
        cy.request(getExchangesRequestsAPI(`${this.data.API_BASE_URL}/admin/stats/exchanges/daily/requests?date=${yesterday.format('YYYY-MM-DD')}`)).then(response => {
            cy.get('#nuviad-daily-exchange-requests-table > .dataTables_wrapper > .table>tbody>tr').then($row => {
                for (let i = 0; i < response.body.rows.length; i++) {
                    for (let j = 0; j < $row.length; j++) {
                        for(let t=0;t<response.body.related_entities.exchanges.length;t++){
                            if(response.body.rows[i].exchange==response.body.related_entities.exchanges[t].id){
                                cy.get(`#nuviad-daily-exchange-requests-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(1)`).then($el => {
                                    if(response.body.related_entities.exchanges[t].name==$el.text()){

                                        for(let k=2;k<=4;k++){
                                            cy.get(`#nuviad-daily-exchange-requests-table > .dataTables_wrapper > .table > tbody > :nth-child(${j + 1}) > :nth-child(${k})`).then($element=>{
                                                if(k==2){
                                                    expect($element.text()).to.eq(response.body.rows[i].exchange)
                                                }
                                                if(k==3){
                                                    let num=Number($element.text())
                                                    expect(num).to.eq(response.body.related_entities.exchanges[t].num)
                                                }

                                            })
                                        }
                                        cy.get(`#nuviad-daily-exchange-requests-table > .dataTables_wrapper > .table > tbody > :nth-child(${j+1}) > .sorting_1`).then($req=>{
                                            let requests=$req.text()
                                            requests=Number(requests.replace(/\$|,/g, ''))
                                            expect(requests).to.eq(response.body.rows[i].requests)
                                        })
                                    }
                                })
                            }
                        }


                    }
                }
            })

        })
    })

    it('Test csv download',function(){
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('#nuviad-daily-exchange-requests-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Daily exchanges requests ${yesterday.format('DD_MM_YYYY')}.csv`)).should("exist");
    })
})
*/