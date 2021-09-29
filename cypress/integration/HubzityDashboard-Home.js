/// <reference types="Cypress" />
const path = require("path");
const dayjs = require('dayjs')
const todaysDate = dayjs()
const monthAgo= todaysDate.subtract(30,'days')

describe('Login test',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
    })
    it('Enter to the login page',function(){
        cy.visit(`${this.data.HubzityDashborad}/login/#`)
    })
    it('Login without email and password',function(){
        cy.get('.btn').click()
        cy.get('p[ng-message="required"]').should("be.visible")
        cy.url().should('eq',`${this.data.HubzityDashborad}/login/#/`)
    })
    it('Login with wrong email',function(){
        cy.dashboardLogin("fdsfdsf",this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.get('p[ng-message="email"]').should("be.visible").should('contain.text','Email address invalid')
        cy.url().should('eq',`${this.data.HubzityDashborad}/login/#/`)
    })
    it('Login with wrong password',function(){
        cy.dashboardLogin(this.data.SUPER_USER,"dsfdsfsdf")
        cy.get('.btn').click()
        cy.get('p[class="ng-binding"]').should("be.visible")
        cy.url().should('eq',`${this.data.HubzityDashborad}/login/#/`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
})
describe('Home page data test',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
    })
    it('Create last month report',function(){
        cy.wait(5000)
        cy.get('select').eq(0).select('Past Month')
        cy.get('.form-group > .btn').click()
        cy.wait(25000)
    })
    it('Test totals',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/v2/reports/all_campaigns?end=${todaysDate.format('YYYY-MM-DD')}T23:59:59.000Z&start=${monthAgo.format('YYYY-MM-DD')}T00:00:00.000Z&timezone=UTC`,
            headers: {
                Authorization,
            },
            body:{}
        }
        cy.request(apiToTest).then(response=>{
          
            cy.get('h3').eq(1).then(($el)=>{
                let spending=$el.text()
                spending=Number(spending.replace(/\$|,/g, ''))
                expect(response.body.total.billing).to.eq(spending)
            })
            cy.get('h3').eq(2).then(($el)=>{
                let imp=$el.text()
                imp=Number(imp.replace(/\$|,/g, ''))
                expect(response.body.total.impressions).to.eq(imp)
            })
            cy.get('h3').eq(3).then(($el)=>{
                let clicks=$el.text()
                clicks=Number(clicks.replace(/\$|,/g, ''))
                expect(response.body.total.clicks).to.eq(clicks)
            })
        })
    })
    it('Test export data button',function(){
        cy.get('button[id="export-to-csv-button"]').click()
    })
    it('Test csv file export',function(){
        cy.get('.uib-dropdown-menu > :nth-child(1) > .ng-binding').click()
    })
    it('Verify the downloaded csv file', () => {
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, "NUVIAD_Staging_-_Account_stats_for_Patternz.csv")).should("exist");
     })
     it('Test xlsx file export',function(){
        cy.get('button[id="export-to-csv-button"]').click()
        cy.get('.uib-dropdown-menu > :nth-child(2) > .ng-binding').click()
    })
    it('Verify the downloaded xlsx file', () => {
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, "NUVIAD_Staging_-_Account_stats_for_Patternz.xlsx")).should("exist");
     })
    it('Test the campaigns from the campaigns API',{etries:{openMode:3}},function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/v2/reports/all_campaigns?end=${todaysDate.format('YYYY-MM-DD')}T23:59:59.000Z&start=${monthAgo.format('YYYY-MM-DD')}T00:00:00.000Z&timezone=UTC`,
            headers: {
                Authorization,
            },
            body:{}
        }
        cy.request(apiToTest).then(response=>{
            for(let i=0;i<response.body.related_entities.campaigns.length;i++){
                cy.log(response.body.related_entities.campaigns[i].name)
            }
            cy.get('tbody>tr').should('have.length',response.body.related_entities.campaigns.length)
        })
    })
    it('Test search in campaigns report',{etries:{openMode:3}},function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/v2/reports/all_campaigns?end=${todaysDate.format('YYYY-MM-DD')}T23:59:59.000Z&start=${monthAgo.format('YYYY-MM-DD')}T00:00:00.000Z&timezone=UTC`,
            headers: {
                Authorization,
            },
            body:{}
        }
        cy.request(apiToTest).then(response=>{
            for(let i=0;i<response.body.related_entities.campaigns.length;i++){
                cy.log(response.body.related_entities.campaigns[i].name)
                cy.get('.input-group > .form-control').type(response.body.related_entities.campaigns[i].name)
                cy.wait(3000)
                cy.get('.md-body > .md-row > :nth-child(2)').should('contain.text',response.body.related_entities.campaigns[i].name)
                cy.get('.input-group > .form-control').clear()
            }
        })
        
    })
})
