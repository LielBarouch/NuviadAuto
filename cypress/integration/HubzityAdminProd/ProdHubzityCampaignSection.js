/// <reference types="Cypress" />
const path = require("path");
const dayjs = require('dayjs')
const testActorId = 'actor_QVAJjkxL4ldx4P6zF8DsgMKfqKQJO'
const testActorName = 'Patternz'

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
        cy.visit(`${this.data.HubzityAdminDashboard}/login`)
    })
    it('Login', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/')
        cy.wait(10000)

    })
    it('Enter campaigns section', function () {
        cy.get(':nth-child(5) > .nav-link').click()
        cy.wait(3000)
        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/campaigns')
    })
})

 /* describe('Daily Campaign Performance', function () {
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
        cy.selectTableRows('25', 25, 0, '#nuviad-daily-campaigns-performance-card')
        cy.selectTableRows('50', 50, 0, '#nuviad-daily-campaigns-performance-card')
        cy.selectTableRows('10', 10, 0, '#nuviad-daily-campaigns-performance-card')
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
        cy.selectTableRows('100', 100, 0, '#nuviad-daily-campaigns-performance-card')
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
        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/campaigns')
    })

    it('Search by campaign id',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(':nth-child(3) > .form-control').type(campToSearch.id)
        cy.wait(10000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns/${campToSearch.id}`, Authorization)
        cy.request(getCampaignsApi(`${this.data.API_BASE_URL}/admin/campaigns/${campToSearch.id}`)).then(response=>{
            cy.get('.DataTable_selectableRow__3ljy1 > :nth-child(1)').then($id=>{
                expect($id.text()).to.eq(response.body.id)
                expect($id.text()).to.eq(campToSearch.id)
            })
            cy.get('.DataTable_selectableRow__3ljy1 > :nth-child(2)').then($name=>{
                expect($name.text()).to.eq(response.body.name)
                expect($name.text()).to.eq(campToSearch.name)
            })
        })
    })

    it('Test margin with wrong values', function () {
        const negativeMargin = -2
        const wrongMargin = 2
        cy.get('.btn-group > :nth-child(1) > .svg-inline--fa').click()
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
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-campaigns-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click()
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

                cy.get('#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > tr').then($tableRows => {
                    for (let j = 1; j <= $tableRows.length; j++) {
                        cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(2)`).then($id => {
                            if ($id.text() == response.body[i].id) {
                                cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(3)`).then($name => {
                                    expect($name.text()).to.eq(response.body[i].name)
                                })
                                cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(5)`).then($status => {
                                    expect($status.text()).to.eq(response.body[i].status)
                                })
                                cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(6)`).then($margin => {
                                    expect(Number($margin.text())).to.eq(response.body[i].margin)
                                })
                                cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(7)`).then($spending => {
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
        cy.get('#nuviad-campaigns-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchWord)
        cy.wait(4000)
        cy.get('#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > tr').then($tableRows=>{
            for(let i=1;i<=$tableRows.length;i++){
                cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${i}) > :nth-child(3)`).then($name => {
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
                cy.get('#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > tr').then($tableRows=>{
                    for(let j=1;j<=$tableRows.length;j++){
                        cy.get(`#nuviad-campaigns-table > .dataTables_wrapper > .table >tbody > :nth-child(${j}) > :nth-child(2)`).then($idToTest=>{
                            if($idToTest.text()==response.body[i].id){
                                expect(response.body[i].margin).to.eq(newMargin)
                            }
                        })
                    }
                })
            }
        })
    })
}) */

describe('Wins Campaign Minute Spend', function () {

    let campToTest=''
    Cypress.Commands.add("campToTest", { prevSubject: true }, (value) => {
        campToTest = value;
    })
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Search for actor', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1pahdxg-control').type('Global')
        cy.get('.css-11unzgr').contains('Global').click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/campaigns?owner_id=actor_n8q7IDEMysmDeHaR3K5itxNSbono4r`, Authorization)
    })

    it('Show active campaigns', function () {
        cy.get('.col-lg-3 > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('.css-11unzgr').contains('ACTIVE').click()
        cy.wait(3000)
    })

    it('Get a campaign id to test and open the modal', function () {
        cy.get('#nuviad-campaigns-table > .dataTables_wrapper > .table > tbody > :nth-child(1) > :nth-child(2)').invoke('text').campToTest()
        cy.get(':nth-child(1) > :nth-child(8) > .btn-group > :nth-child(3) > .svg-inline--fa').click({force:true})
    })

    it('Test the campaign minute wins modal',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.modal-body > :nth-child(1) > .col-sm-12').then($title=>{
            expect($title.text()).to.contain(campToTest)
        })
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/campaign/wins/minute?campaign_id=${campToTest}&hours=3`,Authorization)
    })

    it('Close the modal',function(){
        cy.get('.modal-footer > .btn').click()
    })
})