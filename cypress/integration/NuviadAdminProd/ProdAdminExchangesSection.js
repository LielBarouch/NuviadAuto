/// <reference types="Cypress" />
const dayjs = require('dayjs')
const path = require("path");
const searchWord = 'sivan test 4'
let exchangeInfo = {
    status: '',
    id: ''
}
let currentDate = dayjs()
const newExchange={
    exchangeName:'liel test '+currentDate.format('m'),
    responseFormat:'OpenRTB 2.4',
    forcedMargin:2,
    admRequireFullHtml:true,
    allow_dsp_traffic:false,
    allow_unaudited_creatives:false,
    allowiFrame:true,
    jsPermitted:true,
    overrideAttrSix:false,
    useTagBillingMacro:false,
    require_vast_prefix:true,
    use_vast_cdata:true,
    useFlipMode:false,
    respectSecured:false
}


/* describe('Check Exchange section with non master account',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("stg-admin@nuviad.com", "qwerty123")
    })
    it('Enter to the admin dashboard login', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
    })
    it('Login with non master account', function () {
        cy.AdminLogin("stg-admin@nuviad.com", "qwerty123")
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)

    })
    it('Check if Exchange section is visable to the account',function(){
        cy.get('.with-sub > .nav-link').click()
        cy.get('.navbar-menu-sub>.nav-sub-item').then($el=>{
            cy.wrap($el.length).should('eq',2)
        })
    })
    it('Logout',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.NuviadAdminDashboard}/login/`)
    })
}) */

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

describe('Exchanges section', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    it('Enter Exchanges section', function () {
        cy.get(':nth-child(6) > .nav-link').click()
        cy.wait(3000)

    })
    it('Check the url and API load', function () {
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/exchanges')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
})

 /* describe('All exchanges table tests', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest) {
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
    function tableSort(col, apiUp, apiDown) {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(`#nuviad-exchanges-table > .dataTables_wrapper >table>thead>tr> :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`#nuviad-exchanges-table > .dataTables_wrapper >table>thead>tr> :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }

    function rowsLimitSelect(selection,selectionToCompair,table) {
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_length > label > select').select(selection)
        cy.wait(3000)
        cy.get(table).find('tbody>tr').then((rows) => {
            if (selectionToCompair == 100) {
                cy.wrap(rows.length).should('gt', 50)
            } else {
                cy.wrap(rows.length).should('be.lte', selectionToCompair)
            }

        })
    }

    it('Test table refreshing', function () {
        cy.get('#nuviad-exchanges-card > .align-items-center > .d-flex > :nth-child(2) > .sc-bdVaJa').click({force:true})
        cy.wait(3000)
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
    it('Test search', function () {
        const searchWord = 'test1'
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchWord)
        cy.wait(3000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`, Authorization)
        cy.request(getExchangesApi(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`)).then(response => {
            cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_info').should('contain.text', response.body.total_count + " entries")
            for (let i = 1; i <= response.body.total_count; i++) {
                cy.get(`:nth-child(${i}) > .sorting_1`).then($el => {
                    let exName = $el.text()
                    exName = exName.toLowerCase()
                    expect(exName).to.contain(searchWord)
                })
            }
        })
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
        cy.wait(3000)
    })
    it('Table sorting test', function () {
        tableSort(1, `${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=name`, `${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`)
        tableSort(2, `${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=id`, `${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-id`)
    })
    it('Table rows display test', function () {
        rowsLimitSelect('25', 25,  '#nuviad-exchanges-card')
        rowsLimitSelect('50', 50,  '#nuviad-exchanges-card')
        rowsLimitSelect('100', 100,  '#nuviad-exchanges-card')
        rowsLimitSelect('10', 10,  '#nuviad-exchanges-card')
    })
    it('Pagination test',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type('test')
        cy.wait(3000)
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_paginate').then($el=>{
            for(let i=2;i<$el.length-1;i++){
                cy.log(i)
                cy.get($el).eq(i).click()
                cy.wait(3000)
                cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=${i*10-10}&sort=-name&q=test`,Authorization)
            }           
        })
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
    })
    it('Test actions',function(){
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type('sivan test')
        cy.wait(3000)
        cy.get(':nth-child(5) > :nth-child(5) > .btn-group > :nth-child(1) > svg').click()
        cy.get('.modal-content').should('be.visible')
        cy.get('.btn-secondary').click()
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
    })
})

describe('Test Exchanges modal and details',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest) {
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

    it('Compare exchanges details in modal with API data',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchWord)
        cy.wait(3000)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=${searchWord.replace(/\s/g,'+')}`,Authorization)
        cy.get('[d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"]').click({force:true})
        cy.get('#name').should('contain.value',searchWord)
        cy.request(getExchangesApi(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=${searchWord.replace(/\s/g,'+')}`)).then(response=>{
            cy.get('.css-1uccc91-singleValue').then($el=>{
                const status=$el.text()
                expect(status.toLowerCase()).to.eq(response.body.rows[0].status)
            })
            cy.get('.modal-title').should('contain.text',response.body.rows[0].id)
        })
        cy.get('.col-sm-12 > .lh-0').click()
    })
    it('Compare advance details with API data',function(){
        cy.request(getExchangesApi(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=${searchWord.replace(/\s/g,'+')}`)).then(response=>{
            cy.get(':nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control > .css-1hwfws3 > .css-1uccc91-singleValue').should('contain.text',response.body.rows[0].response_format)
            if(response.body.rows[0].admRequireFullHtml){
                cy.get('#admRequireFullHtml').should('be.checked')
            }else{
                cy.get('#admRequireFullHtml').should('not.be.checked')
            }
            if(response.body.rows[0].allow_dsp_traffic){
                cy.get('#allow_dsp_traffic').should('be.checked')
            }else{
                cy.get('#allow_dsp_traffic').should('not.be.checked')
            }
            if(response.body.rows[0].allow_unaudited_creatives){
                cy.get('#allow_unaudited_creatives').should('be.checked')
            }else{
                cy.get('#allow_unaudited_creatives').should('not.be.checked')
            }
            if(response.body.rows[0].allowiFrame){
                cy.get('#allowiFrame').should('be.checked')
            }else{
                cy.get('#allowiFrame').should('not.be.checked')
            }
            if(response.body.rows[0].jsPermitted){
                cy.get('#jsPermitted').should('be.checked')
            }else{
                cy.get('#jsPermitted').should('not.be.checked')
            }
            if(response.body.rows[0].overrideAttrSix){
                cy.get('#overrideAttrSix').should('be.checked')
            }else{
                cy.get('#overrideAttrSix').should('not.be.checked')
            }
            if(response.body.rows[0].useTagBillingMacro){
                cy.get('#useTagBillingMacro').should('be.checked')
            }else{
                cy.get('#useTagBillingMacro').should('not.be.checked')
            }
            if(response.body.rows[0].require_vast_prefix){
                cy.get('#require_vast_prefix').should('be.checked')
            }else{
                cy.get('#require_vast_prefix').should('not.be.checked')
            }
            if(response.body.rows[0].use_vast_cdata){
                cy.get('#use_vast_cdata').should('be.checked')
            }else{
                cy.get('#use_vast_cdata').should('not.be.checked')
            }
            if(response.body.rows[0].useFlipMode){
                cy.get('#useFlipMode').should('be.checked')
            }else{
                cy.get('#useFlipMode').should('not.be.checked')
            }
            if(response.body.rows[0].use_vast_cdata){
                cy.get('#use_vast_cdata').should('be.checked')
            }else{
                cy.get('#use_vast_cdata').should('not.be.checked')
            }
            if(response.body.rows[0].respectSecured){
                cy.get('#respectSecured').should('be.checked')
            }else{
                cy.get('#respectSecured').should('not.be.checked')
            }
        })
        cy.get('.btn-secondary').click()
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').clear()
    })
})

describe('Test active exchange in actor campaign', function () {
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest) {
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
    function putExchangesApi(urlToTest) {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'PUT',
            url: urlToTest,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }

    function getExchangesInDashboard(urlToTest) {
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

    it('Change exchange to active',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchWord)
        cy.wait(3000)
        cy.get('[d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"]').click({force:true})
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1uccc91-singleValue').then($el=>{
            const status=$el.text()
            if(status=='Inactive'){
                cy.contains('Active').click()
            }
        })
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.checkApiLoadPUT(`${this.data.API_BASE_URL}/admin/exchanges/exchange_8u3r3G2ea`,Authorization)
        
        
    })

    it('Restore the exchange to all accounts',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get(':nth-child(3) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
        cy.checkApiLoadPUT(`${this.data.API_BASE_URL}/admin/exchanges/exchange_8u3r3G2ea/restore_in_all_accounts`,Authorization)
    })

    it('Login to dashboard', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
    })
    it('Go to campaign', function () {
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.wait(6000)
    })
    it('Check exchanges', function () {
        cy.request(getExchangesInDashboard(`${this.data.API_BASE_URL}/data_collections/exchanges`)).then(response => {
            let flag = false
            for (let i = 0; i < response.body.items.length; i++) {
                if (response.body.items[i].name == searchWord) {
                    flag = true
                    expect(response.body.items[i].status).to.eq('active')
                }
            }
            expect(flag).to.eq(true)
        })
        cy.get('fieldset > :nth-child(2) > .ui-select-container > .select2-choices > .select2-search-field > .select2-input').click()
        cy.get('#ui-select-choices-2>li').then($el => {
            expect($el.text()).to.contain(searchWord)
        })
    })
    it('Go back to exchanges section', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.get(':nth-child(6) > .nav-link').click()
        cy.wait(3000)
    })

}) */

describe('Test inactive exchanges in actor campaign',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest) {
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
    function putExchangesApi(urlToTest) {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'PUT',
            url: urlToTest,
            headers: {
                Authorization,
            },
            body: {}
        }
        return apiToTest
    }

    function getExchangesInDashboard(urlToTest) {
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
    it('Change exchange to inactive',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type(searchWord)
        cy.wait(3000)
        cy.get('[d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"]').click({force:true})
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1uccc91-singleValue').then($el=>{
            const status=$el.text()
            if(status=='Active'){
                cy.contains('Inactive').click()
            }
        })
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.checkApiLoadPUT(`${this.data.API_BASE_URL}/admin/exchanges/exchange_8u3r3G2ea`,Authorization)
        
        
    })
    it('Exclude the exchange from all accounts',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('.btn-group > :nth-child(2) > svg').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(3000)
        cy.checkApiLoadPUT(`${this.data.API_BASE_URL}/admin/exchanges/exchange_8u3r3G2ea/exclude_from_all_accounts`,Authorization)
    })
    it('Login to dashboard', function () {
        cy.visit(`${this.data.NuviadDashboard}/login/#`)
    })
    it('Login', function () {
        cy.dashboardLogin(this.data.SUPER_USER, this.data.SUPER_PASS)
        cy.get('.btn').click()
        cy.wait(6000)
    })
    it('Go to campaign', function () {
        cy.get('.menu-links > :nth-child(2) > a').click()
        cy.wait(3000)
        cy.get('.md-body > :nth-child(1) > :nth-child(3)').click()
        cy.wait(6000)
    })
     it('Check exchanges', function () {
        cy.request(getExchangesInDashboard(`${this.data.API_BASE_URL}/data_collections/exchanges`)).then(response => {
            let flag = false
            for (let i = 0; i < response.body.items.length; i++) {
                if (response.body.items[i].name == searchWord) {
                    flag = true
                    expect(response.body.items[i].status).to.eq('inactive')
                }
            }
            expect(flag).to.eq(true)
        })
        cy.get('fieldset > :nth-child(2) > .ui-select-container > .select2-choices > .select2-search-field > .select2-input').click()
        cy.get('#ui-select-choices-2>li').then($el => {
            expect($el).not.to.exist
        })
    }) 
    it('Go back to exchanges section', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.get(':nth-child(6) > .nav-link').click()
        cy.wait(3000)
    })
})

describe('Create new exchange',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })
    function getExchangesApi(urlToTest) {
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

    it('Enter to exchange creation modal',function(){
        cy.get(':nth-child(1) > .sc-bdVaJa').click()
        cy.get('.modal-content').should('be.visible')
    })
    it('Enter exchange name',function(){
        
        cy.get('#name').type(newExchange.exchangeName)
    })
    it('Define status as inactive',function(){
        cy.get('.css-1hwfws3').click()
        cy.get('.css-1uccc91-singleValue').then($el=>{
            const status=$el.text()
            if(status=='Active'){
                cy.contains('Inactive').click()
            }
        })
    })
    it('Edit advance settings',function(){
        cy.get('.col-sm-12 > .lh-0').click()
        cy.get(':nth-child(1) > .form-group > .css-2b097c-container > .css-yk16xz-control').click()
        cy.contains(newExchange.responseFormat).click()
        cy.get('#forced_margin').clear()
        cy.get('#forced_margin').type(newExchange.forcedMargin)
        cy.get('#admRequireFullHtml').click()
        cy.get('#allowiFrame').click()
        cy.get('#respectSecured').click()
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click()
        cy.wait(6000)
        cy.get('.btn-primary').click()
        cy.wait(3000)
    })

    it('Check new exchange details',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('#nuviad-exchanges-table > .dataTables_wrapper > .dataTables_filter > label > input').type(newExchange.exchangeName)
        cy.wait(3000)
        cy.get('[d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"]').click({force:true})
        cy.get('#name').should('contain.value',newExchange.exchangeName)
        cy.get('.css-1uccc91-singleValue').then($el=>{
            const status=$el.text()
            expect(status).to.eq('Inactive')
        })
        cy.get('.col-sm-12 > .lh-0').click()
        if(newExchange.admRequireFullHtml){
            cy.get('#admRequireFullHtml').should('be.checked')
        }else{
            cy.get('#admRequireFullHtml').should('not.be.checked')
        }
        if(newExchange.allow_dsp_traffic){
            cy.get('#allow_dsp_traffic').should('be.checked')
        }else{
            cy.get('#allow_dsp_traffic').should('not.be.checked')
        }
        if(newExchange.allow_unaudited_creatives){
            cy.get('#allow_unaudited_creatives').should('be.checked')
        }else{
            cy.get('#allow_unaudited_creatives').should('not.be.checked')
        }
        if(newExchange.allowiFrame){
            cy.get('#allowiFrame').should('be.checked')
        }else{
            cy.get('#allowiFrame').should('not.be.checked')
        }
        if(newExchange.jsPermitted){
            cy.get('#jsPermitted').should('be.checked')
        }else{
            cy.get('#jsPermitted').should('not.be.checked')
        }
        if(newExchange.overrideAttrSix){
            cy.get('#overrideAttrSix').should('be.checked')
        }else{
            cy.get('#overrideAttrSix').should('not.be.checked')
        }
        if(newExchange.useTagBillingMacro){
            cy.get('#useTagBillingMacro').should('be.checked')
        }else{
            cy.get('#useTagBillingMacro').should('not.be.checked')
        }
        if(newExchange.require_vast_prefix){
            cy.get('#require_vast_prefix').should('be.checked')
        }else{
            cy.get('#require_vast_prefix').should('not.be.checked')
        }
        if(newExchange.use_vast_cdata){
            cy.get('#use_vast_cdata').should('be.checked')
        }else{
            cy.get('#use_vast_cdata').should('not.be.checked')
        }
        if(newExchange.useFlipMode){
            cy.get('#useFlipMode').should('be.checked')
        }else{
            cy.get('#useFlipMode').should('not.be.checked')
        }
        if(newExchange.use_vast_cdata){
            cy.get('#use_vast_cdata').should('be.checked')
        }else{
            cy.get('#use_vast_cdata').should('not.be.checked')
        }
        if(newExchange.respectSecured){
            cy.get('#respectSecured').should('be.checked')
        }else{
            cy.get('#respectSecured').should('not.be.checked')
        }
        cy.get('.btn-secondary').click()
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
        cy.selectTableRows('25', 25, 2, '#nuviad-daily-exchange-spend-card')
        cy.selectTableRows('50', 50, 2, '#nuviad-daily-exchange-spend-card')
        cy.selectTableRows('10', 10, 2, '#nuviad-daily-exchange-spend-card')
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
        cy.selectTableRows('25', 25, 3, '#nuviad-daily-exchange-requests-card')
        cy.selectTableRows('50', 50, 3, '#nuviad-daily-exchange-requests-card')
        cy.selectTableRows('10', 10, 3, '#nuviad-daily-exchange-requests-card')
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

describe('Exchanges cost',function(){
    beforeEach(function () {
        cy.fixture('example').then(function (data) {
            this.data = data
        })
        cy.getToken("liel@nuviad.com", "lb123456")
    })

    function getExchangesCostAPI(urlToTest) {
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

    function rowsLimitSelect(selection,selectionToCompair,table) {
        cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .dataTables_length > label > select').select(selection)
        cy.wait(3000)
        cy.get(table).find('tbody>tr').then((rows) => {
            if (selectionToCompair == 100) {
                cy.wrap(rows.length).should('gt', 50)
            } else {
                cy.wrap(rows.length).should('be.lte', selectionToCompair)
            }

        })
    }

    it('Table rows display test', function () {
        cy.wait(8000)
        rowsLimitSelect('25', 25, '#nuviad-exchanges-cost-card')
        rowsLimitSelect('50', 50, '#nuviad-exchanges-cost-card')
        rowsLimitSelect('10', 10, '#nuviad-exchanges-cost-card')
    })

    it('Refresh table', function () {
        const currentDate = dayjs()
        const weekAgo=currentDate.subtract(6,'days')
        cy.get('#nuviad-exchanges-cost-card > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa > path').click({ force: true })
        cy.wait(10000)
        cy.get('#nuviad-exchanges-cost-card > .align-items-center > .d-flex > span').then($updated => {
            expect($updated.text()).to.eq('just now')
        })
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/cost?startDate=${weekAgo.format('YYYY-MM-DD')}&endDate=${currentDate.format('YYYY-MM-DD')}`, Authorization)
    })

    it('Search test',function(){
        cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > :nth-child(3) > label > input').type('Google')
        cy.wait(5000)
    })

    it('Change start date',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const currentDate = dayjs()
        const twoDaysAgo=currentDate.subtract(2,'days')
        cy.get(':nth-child(1) > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        cy.get(`.react-datepicker__day--0${twoDaysAgo.format('DD')}`).eq(0).click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/cost?startDate=${twoDaysAgo.format('YYYY-MM-DD')}&endDate=${currentDate.format('YYYY-MM-DD')}`, Authorization)
    })
    
    it('Change end date',function(){
        const token = Cypress.env('token');
        const Authorization = token;
        const currentDate = dayjs()
        const twoDaysAgo=currentDate.subtract(2,'days')
        const oneDaysAgo=currentDate.subtract(1,'days')
        cy.get(':nth-child(2) > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').click()
        cy.get(`.react-datepicker__day--0${oneDaysAgo.format('DD')}`).eq(0).click()
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/exchanges/cost?startDate=${twoDaysAgo.format('YYYY-MM-DD')}&endDate=${oneDaysAgo.format('YYYY-MM-DD')}`, Authorization)
    })

    it('Compare API data with table data',function(){
        const currentDate = dayjs()
        let twoDaysAgo=currentDate.subtract(2,'days')
        twoDaysAgo=twoDaysAgo.subtract(11,'months')
        const oneDaysAgo=currentDate.subtract(1,'days')
        cy.request(getExchangesCostAPI(`${this.data.API_BASE_URL}/admin/stats/exchanges/cost?startDate=${twoDaysAgo.format('YYYY-MM-DD')}&endDate=${oneDaysAgo.format('YYYY-MM-DD')}`)).then(response=>{
            for(let i=0;i<response.body.rows.length;i++){
                for(let j=0;j<response.body.related_entities.exchanges.length;j++){
                    if(response.body.rows[i].exchange==response.body.related_entities.exchanges[j].id){
                        cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .table > tbody > tr > :nth-child(1)').then($exchangeName=>{
                            if(response.body.related_entities.exchanges[j].name==$exchangeName.text()){
                                cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .table > tbody > tr > :nth-child(2)').then($exchangeId=>{
                                    expect($exchangeId.text()).to.eq(response.body.rows[i].exchange)
                                })
                                cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .table > tbody > tr > :nth-child(3)').then($exchangeNum=>{
                                    const number=Number($exchangeNum.text())
                                    expect(number).to.eq(response.body.related_entities.exchanges[j].num)
                                })
                                cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .table > tbody > tr > :nth-child(4)').then($exchangeImpressions=>{
                                    let imp=$exchangeImpressions.text()
                                    imp=Number(imp.replace(/\$|,/g, ''))
                                    expect(imp).to.eq(response.body.rows[i].impressions)
                                })
                                cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > .table > tbody > tr > .sorting_1').then($exchangeCost=>{
                                    let cost=$exchangeCost.text()
                                    cost=Number(cost.replace(/\$|,/g, '')).toFixed(2)
                                    let costFromApi=Number(response.body.rows[i].cost).toFixed(2)
                                    expect(cost).to.eq(costFromApi)
                                })
                            }
                        })
                    }
                }
            }
        })
        
    })

    it('Test csv download',function(){
        const currentDate = dayjs()
        let twoDaysAgo=currentDate.subtract(2,'days')
        twoDaysAgo=twoDaysAgo.subtract(11,'months')
        const oneDaysAgo=currentDate.subtract(1,'days')
        cy.get('#nuviad-exchanges-cost-table > .dataTables_wrapper > :nth-child(2) > .DataTable_exportButton__3uCk7').click()
        cy.wait(12000)
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, `Exchanges cost ${twoDaysAgo.format('DD_MM_YYYY')} - ${oneDaysAgo.format('DD_MM_YYYY')}.csv`)).should("exist");
    })    
})