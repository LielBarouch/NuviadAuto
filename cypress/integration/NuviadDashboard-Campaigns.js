/// <reference types="Cypress" />
const path = require("path")
const dayjs = require('dayjs')

describe('Login test',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
    })
    it('Enter to the login page',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login',function(){
        cy.dashboardLogin(this.data.SUPER_USER,this.data.SUPER_PASS)
        cy.get('.btn').click() 
        cy.wait(6000)
    })
})
describe('Campaigns page test',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
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
    it('Go to campaigns page',function(){
        cy.get('.menu-links > :nth-child(2) > a').click()
    })
    it('APIs load test',{retries:{openMode:3}},function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/v2/campaigns?limit=15&offset=0&order=status&order=-spending_today&order=created&page_number=1&q=`, Authorization)
    })
    it('Test export data button',function(){
        cy.get('button[id="export-to-csv-button"]').click()
    })
    it('Test csv file export',function(){
        cy.get('[aria-labelledby="export-to-csv-button"] > :nth-child(1) > .ng-binding').click()
    })
    it('Verify the downloaded csv file', () => {
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, "NUVIAD_Staging_-_All_campaigns_in_Patternz.csv")).should("exist");
     })
     it('Test xlsx file export',function(){
        cy.get('button[id="export-to-csv-button"]').click()
        cy.get('[aria-labelledby="export-to-csv-button"] > :nth-child(2) > .ng-binding').click()
    })
    it('Verify the downloaded xlsx file', () => {
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, "NUVIAD_Staging_-_All_campaigns_in_Patternz.xlsx")).should("exist");
     })
    it('Test dates',function(){
        const todaysDate = dayjs()
        const monthAgo= todaysDate.subtract(30,'days')
        cy.log(todaysDate.format('YYYY-MM-DD'))
        cy.log(monthAgo.format('YYYY-MM-DD'))
    })
    it('Search test',function(){
         
        cy.request(getApiRes(this.data)).then(response=>{
            const campaign=response.body.rows[0].name
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.get('.md-body > .md-row > :nth-child(3)').should('contain.text',campaign)
            cy.get('.input-group > .form-control').clear()
            cy.get('.input-group-btn > .btn').click()
        })
    })
    it('Check if all campaigns are being displayed',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        let size=0
        cy.request(getApiRes(this.data)).then(response=>{
            const campaignsSize=response.body.total_count
            cy.log(campaignsSize)
            cy.get('[ng-click="$pagination.next()"] > .ng-scope').then(($nextBtn)=>{
                if(!$nextBtn.is(':disabled')){
                    cy.get('table').find('tbody>tr').then((rows)=>{
                        size+=rows.length
                        cy.log(size)
                    })
                    cy.wrap($nextBtn).click()
                    cy.wait(5000)
                    cy.get('table').find('tbody>tr').then((rows)=>{
                        size+=rows.length
                        cy.log(size)
                        cy.wrap(size).should('eq',campaignsSize)
                    })
                    
                }
            })
           
        }) 
    })
    
})
describe('Test campaign actions',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
    })
    function getApires(data){
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
    it('Campaign stop test',function(){
        
        cy.request(getApires(this.data)).then(response=>{
            
            const campaign=response.body.rows[0].name
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.wait(3000)
            const oldStatus=response.body.rows[0].status
            if(oldStatus=='ACTIVE'){
                cy.get('#campaignActions').click()
                cy.get('li>a[ng-click="campaign.stop()"]').eq(0).click()
                const newStatus=response.body.rows[0].status
                cy.wrap(newStatus).should('eq',oldStatus)
            }
            
        })
    })
    it('Campaign start test',function(){
        cy.request(getApires(this.data)).then(response=>{
            
            const oldStatus=response.body.rows[0].status
            if(oldStatus=='INACTIVE'){
                cy.get('#campaignActions').click()
                cy.get('li>a[ng-click="campaign.start()"]').eq(0).click()
                const newStatus=response.body.rows[0].status
                cy.wrap(newStatus).should('eq',oldStatus)
            }
            
        })
    })
    it('Campaign edit',function(){
        
        cy.request(getApires(this.data)).then(response=>{
            const id=response.body.rows[0].id
            cy.log(id)
            cy.get('#campaignActions').click()
            cy.get('[aria-labelledby="campaignActions"] > :nth-child(4) > a').eq(0).click()
            cy.wait(5000)
            cy.url().should('eq',`${this.data.NuviadDashboard}/dashboard/#/campaigns/${id}/edit`)
            cy.go('back')
            cy.wait(5000)
        })
        
    })
    it('Update bid test',function(){
        cy.request(getApires(this.data)).then(response=>{
            const campaign=response.body.rows[0].name
            const campaignId=response.body.rows[0].id
            const newMAxBid=14
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.wait(3000)
            cy.get('#campaignActions').click()
            cy.get('[aria-labelledby="campaignActions"] > :nth-child(5) > a').eq(0).click()
            cy.get('.form-group>div>div>input').click()
            cy.get('.form-group>div>div>input').clear()
            cy.get('.form-group>div>div>input').type(newMAxBid)
            cy.get('.modal-footer > .btn-primary').click()
            cy.wait(4000)
            const token = Cypress.env('token');
            const Authorization = token;
            const apiToTest = {
                method: 'GET',
                url: `${this.data.API_BASE_URL}/campaigns/${campaignId}`,
                headers: {
                    Authorization,
                },
                body:{}
            }
            cy.request(apiToTest).then(response2=>{
                cy.wrap(response2.body.billing_max_price).should('eq',newMAxBid*1000000)
            }) 

        })
        
    })

    it('Update frequency cap',function(){
        cy.request(getApires(this.data)).then(response=>{
            const campaign=response.body.rows[0].name
            const campaignId=response.body.rows[0].id
            const newFrequencyCap=14
            cy.get('.input-group > .form-control').clear()
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.wait(3000)
            cy.get('#campaignActions').click()
            cy.get('[aria-labelledby="campaignActions"] > :nth-child(6) > a').eq(0).click()
            cy.get('.ng-binding > .ng-pristine').check()
            cy.get('.ng-isolate-scope > .form-control').clear()
            cy.get('.ng-isolate-scope > .form-control').type(newFrequencyCap)
            cy.get('.modal-footer > .btn-primary').click()
            cy.wait(4000)
            const token = Cypress.env('token');
            const Authorization = token;
            const apiToTest = {
                method: 'GET',
                url: `${this.data.API_BASE_URL}/campaigns/${campaignId}`,
                headers: {
                    Authorization,
                },
                body:{}
            }
            cy.request(apiToTest).then(response2=>{
                cy.wrap(response2.body.frequencyCap).should('eq',newFrequencyCap)
            }) 
        })
    })

    it('Campaign duplicate',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.request(getApires(this.data)).then(response=>{
            const campaign=response.body.rows[0].name
            const campaignId=response.body.rows[0].id
            
            cy.get('.input-group > .form-control').clear()
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.wait(3000)
            cy.get('#campaignActions').click()
            cy.get('[aria-labelledby="campaignActions"] > :nth-child(7) > a').eq(0).click()
            cy.get('.modal-footer > .btn-primary').click()
            cy.wait(4000)
            cy.checkApiLoadPOST(`${this.data.API_BASE_URL}/campaigns/${campaignId}/duplicate`,Authorization)
            cy.request(getApires(this.data)).then(response2=>{
                cy.log(response2.body.rows[1].name)
                // cy.wrap(response2.body.rows[1].name).should('contain.value',campaign)
            })
        })
    }) 
    /* it('Campaign delete',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.request(getApires(this.data)).then(response=>{
            cy.get(':nth-child(2) > :nth-child(15) > .btn-group > #campaignActions').click()
            cy.get('[style="top: 376.25px; display: block; left: auto; right: 61.2656px;"] > :nth-child(11) > a > .fa').click()
            cy.get('.modal-footer > .btn-primary').click()
        }) 
    }) */
    /* it('Request report',function(){
        cy.request(getApires(this.data)).then(response=>{
            
            const campaign=response.body.rows[0].name
            cy.get('.input-group > .form-control').type(campaign)
            cy.get('.input-group-btn > .btn').click()
            cy.wait(3000)
            cy.get('#campaignActions').click()
            cy.get('[aria-labelledby="campaignActions"] > :nth-child(8) > a').eq(0).click() 
            cy.get('.form-group.filled > .form-control').select('GLOBAL')        
            cy.get('.form-group > .Select > .Select-control').click()
        })
    }) */
})

describe('Actions on multiply campaigns',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("sivangrisario@gmail.com", "sivan")
    })
    function getApires(data){
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
    
    it('Check Actions button is disable if not checkbox is checked',function(){
        cy.get('.input-group > .form-control').clear()
        cy.get('.input-group > .form-control').type('copy')
        cy.get('.input-group-btn > .btn').click()
        cy.wait(3000)
        cy.get('.btn-group>button').eq(0).should('have.attr','disabled')
    })
    it('Check if Action button clickable after checking an checkbox',function(){
        cy.get('md-checkbox').then((box)=>{
            for(let i=1;i<box.length;i++){
                cy.wrap(box[i]).click()
                cy.get('.btn-group>button').eq(0).should('not.have.attr','disabled')
                cy.wrap(box[i]).click()
            }
        })
    })
    it('Action -> delete -> check list of camapaigns to delete',function(){
        let campArr=[]
        
        cy.get('md-checkbox').then((box)=>{
            for(let i=1;i<box.length;i++){
                cy.get(`.md-body > :nth-child(${i}) > :nth-child(3)`).then(($el)=>{
                    let elToText=$el.text()
                    campArr[i-1]=elToText
                })
            }
        })
        cy.get('md-checkbox').eq(0).click()
        cy.get('.btn-group>button').eq(0).click()
        cy.get('.dropdown-menu-left > :nth-child(3) > .ng-binding').click().then(() => {
           for(let i=0;i<campArr.length;i++){ 
               cy.get(`div.ng-scope > ul > :nth-child(${i+1})`).should('contain.text',campArr[i])
               cy.log('checked')
           }
        })
    })
    it('Delete the selected campaigns',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const campToDelete=new Array()
        cy.request(getApires(this.data)).then(response=>{
            for(let i=0;i<response.body.rows.length;i++){
                campToDelete[i]=response.body.rows[0].id
            }
            cy.get('.modal-footer > .btn-primary').click()
            cy.wait(5000)
            for(let i=0;i<response.body.rows.length;i++){
                cy.checkApiLoadDelete(`${this.data.API_BASE_URL}/campaigns/${campToDelete[i]}`,Authorization)
            }
        })
        cy.get('.input-group > .form-control').clear()
        cy.get('.input-group-btn > .btn').click()
        cy.wait(3000)
    })
})