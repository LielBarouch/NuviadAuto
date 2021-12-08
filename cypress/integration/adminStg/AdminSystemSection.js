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
        cy.wait(30000)

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

    it('Check stats',function(){
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
    function testChartHours(hourToTest){
        cy.get('.css-11unzgr').contains(hourToTest).click()
        cy.wait(30000)
        cy.get('.pt-3 > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > [width="936"] > .recharts-xAxis > .recharts-cartesian-axis-ticks > :nth-child(1) > .recharts-text > tspan').then($hourInChart => {
            let hour=$hourInChart.text()
            hour=hour.split(':')
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

    it('Exchange minute traffice chart' ,{retries:3},function(){
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
})