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
        cy.visit(`${this.data.ADMIN_PROD_URL}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(20000)

    })
    /* it('Logout',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.ADMIN_PROD_URL}/login/`)
    })
    it('Login again', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.nuviad.com/dashboard/')
        cy.wait(6000)

    }) */
})
describe('Stats and APIs tests', function () {
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

})






describe('Charts', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getMinApi(urlToTest) {
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
     it('Check actors names in Wins per minutes chart',function(){
        cy.get('#nuviad-per-minute-card-wins > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
        cy.wait(7000)
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
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
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
        cy.wait(5000)
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
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
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
        cy.wait(5000)
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
            cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/minute?hours=6`)).then(response=>{
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
                cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/exchanges/minute/qps/by_country?hours=3`)).then(response => {
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
                cy.request(getMinApi(`${this.data.API_BASE_URL}/admin/stats/conversions/minute?hours=24&stage=0`)).then(response => {
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
    })

    it('Exchange by Country',function(){
        const countryCode='ISR'
        const country='Israel'
        let count=0
        cy.get('#nuviad-exchange-country-qps-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({force:true})
        cy.wait(10000)
        cy.get('#nuviad-exchange-country-qps-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
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

     it('Country by exchange',function(){
        cy.get('#nuviad-exchange-traffic-by-country-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click({force:true})
        cy.wait(5000)
        cy.get('#nuviad-exchange-traffic-by-country-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.get('#nuviad-exchange-traffic-by-country-card > .card-body > :nth-child(1) > .col-sm-4 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-1pahdxg-control > .css-1hwfws3').type(exchangeToTest.name)
        cy.get('.css-11unzgr').contains(exchangeToTest.name).click()
        cy.wait(4000)
        cy.get('#nuviad-exchange-traffic-by-country-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Country by exchange - ${exchangeToTest.name}`)).should("exist")
        cy.request(getAPI(`${this.data.API_BASE_URL}/exchanges/${exchangeToTest.id}/traffic_by_country`)).then(response=>{
            cy.get('#nuviad-exchange-traffic-by-country-table > .dataTables_wrapper > .table > tbody > tr').then($tableRows=>{
                for(let i=0;i<response.body.rows.length;i++){
                    for(let j=1;j<$tableRows.length;j++){
                        cy.get(`#nuviad-exchange-traffic-by-country-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(1)`).then($country=>{
                            if(response.body.rows[i].cc==$country.text()){
                                cy.get(`#nuviad-exchange-traffic-by-country-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > .sorting_1`).then($req=>{
                                    let reqNum=$req.text()
                                    reqNum=Number(reqNum.replace(/\$|,/g, ''))
                                    expect(reqNum).to.eq(response.body.rows[i].requests)
                                })
                                cy.get(`#nuviad-exchange-traffic-by-country-table > .dataTables_wrapper > .table > tbody > :nth-child(${j}) > :nth-child(3)`).then($qps=>{
                                    let qpsNum=$qps.text()
                                    qpsNum=Number(qpsNum).toFixed(2)
                                    let qpsFromApi=Number(response.body.rows[i].qps).toFixed(2)
                                    
                                    expect(qpsNum).to.eq(qpsFromApi)
                                })
                            }
                        })
                    }
                }
            })
        })
    }) 

    it('QPS BY COUNTRY', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchange-country-minute-qps-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(10000)
        cy.get('#nuviad-exchange-country-minute-qps-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        cy.get('.pt-3 > .p-2 > .col-sm-4 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('6').click()
        cy.wait(30000)
        cy.get('.pt-3 > :nth-child(2) > .recharts-responsive-container > .recharts-wrapper > [width="936"] > .recharts-xAxis > .recharts-cartesian-axis-ticks > :nth-child(1) > .recharts-text > tspan').then($hourInChart => {
            cy.log($hourInChart.text())
            let currentTime = dayjs()
            let timeMinusHours = currentTime.subtract(6, 'hours')
            cy.log(timeMinusHours.format('hh:mm'))
        })
    })
})


