/// <reference types="Cypress" />
let initCredit = 0
let creditToComp = 0
const qps = 120
const path = require("path");
const dayjs = require('dayjs')

const exchangeToTest = {
    name: 'Beachfront',
    id: 'exchange_sQcqbo4KvZ'
}

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
})

describe('System section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter System section', function () {
        cy.get(':nth-child(7) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url', function () {
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/system')

    })

    it('Check stats', function () {
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

})

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
    function testChartHours(hourToTest) {
        cy.get('.css-11unzgr').contains(hourToTest).click()
        cy.wait(30000)
        cy.get('.pt-3 > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > [width="936"] > .recharts-xAxis > .recharts-cartesian-axis-ticks > :nth-child(1) > .recharts-text > tspan').then($hourInChart => {
            let hour = $hourInChart.text()
            hour = hour.split(':')
            cy.log(hour[0])
            let currentTime = dayjs()
            let timeMinusHours = currentTime.subtract(hourToTest, 'hours')
            cy.log(timeMinusHours.format('hh'))
        })
    }
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
                cy.get('#nuviad-exchange-minute-qps-by-server-card > .card-body').find('.customized-legend').find('span').then($el => {
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

        cy.get('.mb-3 > .css-2b097c-container > .css-yk16xz-control').click()
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

    it('Exchange minute traffice chart', { retries: 3 }, function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchange-minute-traffic-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(8000)
        cy.get('#nuviad-exchange-minute-traffic-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=1`, Authorization)
        cy.get('.col-sm-2 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('2').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=2`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('3').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=3`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=6`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('12').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=12`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('24').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=24`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('48').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=48`, Authorization)
        cy.wait(5000)
        cy.get('.css-1gtu0rj-indicatorContainer > .css-19bqh2r').click()
        cy.get('.css-11unzgr').contains('72').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_FHTdban0dWKfSa2xOJI9qIQyXH7CLq/minute_traffic?hours=72`, Authorization)
        cy.get('#nuviad-exchange-minute-traffic-card > .card-body > .p-2 > .col-sm-4 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('Beachfront').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/exchanges/exchange_sQcqbo4KvZ/minute_traffic?hours=72`, Authorization)
    })
})

describe('Bidder status', function () {
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

    it('Table refresh test', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-bidders-status-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/bidders/status`, Authorization)
    })

    it('Test csv download', function () {
        let currentDate = dayjs()
        let yesterday = currentDate.subtract(1, 'days')
        cy.get('.DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Bidders status.csv`)).should("exist");
    })

    /* it('Compare API data with table data',function(){
        cy.get('#nuviad-bidders-status-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.request(getAPI(`${this.data.API_BASE_URL}/admin/bidders/status`)).then(response=>{
            cy.get('#nuviad-bidders-status-card').find('tbody > tr').then($tableRows=>{
                for(let i=0;i<3;i++){
                    for(let j=2;j<=$tableRows.length;j++){
                        cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(2)`).then($instanceId=>{
                            if(response.body.rows[i].instance_id==$instanceId.text()){
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(3)`).then($azInTable=>{
                                    expect($azInTable.text()).to.eq(response.body.rows[i].az)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(4)`).then($resTime=>{
                                    let restime=Number($resTime.text())
                                    expect(restime).to.eq(response.body.rows[i].resTime)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(5)`).then($errors=>{
                                    let errorsInTable=Number($errors.text())
                                    expect(errorsInTable).to.eq(response.body.rows[i].errors)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(6)`).then($instanceType=>{
                                    expect($instanceType.text()).to.eq(response.body.rows[i].instanceType)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(7)`).then($requests=>{
                                    let requestsInTable=$requests.text()
                                    requestsInTable=Number(requestsInTable.replace(/\$|,/g, ''))
                                    expect(requestsInTable).to.eq(response.body.rows[i].requests)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(8)`).then($qps=>{
                                    let qpsInTable=Number($qps.text())
                                    let qpsInApi=Number(response.body.rows[i].qps)
                                    expect(qpsInTable).to.eq(qpsInApi)
                                })
                                cy.get('#nuviad-bidders-status-card').find(`tbody > :nth-child(${j}) > :nth-child(9)`).then($bids=>{
                                    let bidsInTable=Number($bids.text())
                                    expect(bidsInTable).to.eq(response.body.rows[i].bids)
                                })
                            }
                        })
                        
                    }
                }
            })
        })
    }) */
})

describe('Detailed bidder view', function () {
    let bidderToTest = ''
    Cypress.Commands.add("bidderToTest", { prevSubject: true }, (value) => {
        bidderToTest = value
    })
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
    it('Enter to the detailed bidder view', function () {
        cy.get('tbody > :nth-child(1) > :nth-child(2)').invoke('text').bidderToTest()
        cy.get(':nth-child(1) > :nth-child(10) > a').click({ force: true })
    })
    it('Verify that we are looking a the right instance details', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.modal-content > .align-items-center > .tx-uppercase').then($title => {
            expect($title.text()).to.contain(bidderToTest)
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/bidders/instance/status?instance=${bidderToTest}`, Authorization)
    })
    it('Refresh table test', function () {
        cy.get('.modal-content > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click({ force: true })
        cy.wait(5000)
        cy.get('.modal-content > .align-items-center > .d-flex > span').then($span => {
            expect($span.text()).to.eq('just now')
        })
    })
    it('Compare table data with API data', function () {
        cy.get('#nuviad-bidders-instance-status-table > .dataTables_wrapper > .dataTables_length > label > select').select('100')
        cy.request(getAPI(`${this.data.API_BASE_URL}/admin/bidders/instance/status?instance=${bidderToTest}`)).then(res => {
            cy.get('#nuviad-bidders-instance-status-table > .dataTables_wrapper > .table > tbody > tr').then($tableRows => {
                expect($tableRows.length).to.eq(res.body.rows.length)
            })
        })
    })
    it('Test csv download', function () {
        cy.get('#nuviad-bidders-instance-status-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Bidders instance ${bidderToTest} status.csv`)).should("exist");
    })
})