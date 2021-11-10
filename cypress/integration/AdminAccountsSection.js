/// <reference types="Cypress" />

describe('Login to admin dashboard', function () {
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

describe('Accounts section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url and API load', function () {
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/accounts')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`, Authorization)
    })
})

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
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('.dataTables_info').should('contain.text',response.body.total_count) 
        })
    })
    it('Test all accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container > .css-yk16xz-control > .css-1wy0on6 > .css-tlfecz-indicatorContainer').click()
        cy.contains('ALL').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at`)).then(response => {
            cy.get('.dataTables_info').should('contain.text',response.body.total_count) 
        })
    })
    it('Test active accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ACTIVE').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=ACTIVE`)).then(response => {
            cy.get('.dataTables_info').should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"ACTIVE")
            }
        })
    })
    it('Test inactive accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('INACTIVE').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=INACTIVE`)).then(response => {
            cy.get('.dataTables_info').should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"INACTIVE")
            }
        })
    })
    it('Test suspended accounts count with the API', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('SUSPENDED').click()
        cy.request(getAccountsApi(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=SUSPENDED`)).then(response => {
            cy.get('.dataTables_info').should('contain.text',response.body.total_count) 
            for(let i=0;i<response.body.rows.length;i++){
                cy.wrap(response.body.rows[i].status).should('eq',"SUSPENDED")
            }
        })
    })
    it('Test search',function(){
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('PENDING').click()
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
            cy.get('.dataTables_info').should('contain.text',count)
            cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
            cy.wait(3000)
        })
    })
    it('Table rows display test',function(){
        cy.selectTableRows('25',25,0,'#nuviad-accounts-table')
        cy.selectTableRows('50',50,0,'#nuviad-accounts-table')
        cy.selectTableRows('100',100,0,'#nuviad-accounts-table')
        cy.selectTableRows('10',10,0,'#nuviad-accounts-table')
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
})  */

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
        cy.contains('ACTIVE').click()
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
    
}) */

describe('Allowed features',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    /* it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Allow Use JS tags, Vast tags, Create video ad, Landing pages, Audience segments, GEO traps,Targeting lists,Frequency Cap and Campaigns bulk update',function(){
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('#react-select-11-option-1').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-2').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-10').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-20').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-21').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-27').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-35').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-7').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-32').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
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

    })
    it('Login again to admin dashboard',function(){
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Disable Use JS tags, Vast tags, Create video ad, Landing pages, Audience segments, GEO traps,Targeting lists,Frequency Cap and Campaigns bulk update',function(){
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if disabled',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get(':nth-child(5) > a').click()
        cy.get('#upload-ads-button').click()
        cy.contains('Use Ad tag').should('not.be.visible')
        cy.contains('Use VAST').should('not.be.visible')
        cy.get('.menu-links>li').then($el=>{
            expect($el.length).to.eq(12)
        })
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.contains('Frequency Cap').should('not.be.visible')
        cy.get('.md-checkbox-column > .ng-scope > .md-container').click()
        cy.get(':nth-child(2) > .btn-group').click()
        cy.get('.uib-dropdown-menu>li>.ng-binding').then($el=>{
            expect($el.length).to.eq(4)
        })
    }) */
    
    it('Login again to admin dashboard',function(){
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Allow ZipCode targeting, Age targeting and Gender targeting',function(){
        cy.get('.form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.get('#react-select-11-option-25').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-30').click()
        cy.get('.css-1wy0on6 > :nth-child(3)').click()
        cy.get('#react-select-11-option-31').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if allowed',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('fieldset > :nth-child(2) > .ng-scope > .ng-binding').should('be.visible')
    })
    /* it('Login again to admin dashboard',function(){
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(3) > .nav-link').click()
        cy.wait(3000)

    })
    it('Switch to active accounts view', function () {
        cy.get('#nuviad-accounts-card > .card-body > :nth-child(1) > .col-lg-3 > .css-2b097c-container').click()
        cy.contains('ALL').click()

    })
    it('Search for a testing account',function(){
        cy.get('#nuviad-accounts-table > .dataTables_wrapper > .dataTables_filter > label > input').type('AutoTest')
        cy.wait(3000)
    })
    it('Open the allowed features modal',function(){
        cy.get(':nth-child(1) > :nth-child(12) > .btn-group > :nth-child(6) > svg').click()
    })
    it('Disable ZipCode targeting',function(){
        cy.get(':nth-child(1) > .css-19bqh2r').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(20000)
    })
    it('Check if disabled',function(){
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
        cy.dashboardLogin(this.data.TEST_USER,this.data.TEST_USER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.get('.col-md-12>div>fieldset>div>.radio').then($el=>{
            expect($el.length).to.eq(2)
        })
    }) */
})