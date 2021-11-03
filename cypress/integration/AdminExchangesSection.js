/// <reference types="Cypress" />
const dayjs = require('dayjs')
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
        cy.get('.with-sub > .nav-link').click()
        cy.get(':nth-child(3) > .nav-sub-link').click()
        cy.wait(3000)

    })
    it('Check the url and API load', function () {
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/exchanges')
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
})

/* describe('Table tests', function () {
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
        cy.get(`table>thead>tr> :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiUp, Authorization)
        cy.get(`table>thead>tr> :nth-child(${col})`).click()
        cy.wait(3000)
        cy.checkApiLoad(apiDown, Authorization)
    }

    function rowsLimitSelect(selection,selectionToCompair,table) {
        cy.get('select').select(selection)
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
        cy.get(':nth-child(2) > .sc-bdVaJa').click()
        cy.wait(3000)
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name`, Authorization)
    })
    it('Test search', function () {
        const searchWord = 'test1'
        const token = Cypress.env('token');
        const Authorization = token;
        cy.get('input').type(searchWord)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`, Authorization)
        cy.request(getExchangesApi(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=0&sort=-name&q=test1`)).then(response => {
            cy.get('.dataTables_info').should('contain.text', response.body.total_count + " entries")
            for (let i = 1; i <= response.body.total_count; i++) {
                cy.get(`:nth-child(${i}) > .sorting_1`).then($el => {
                    let exName = $el.text()
                    exName = exName.toLowerCase()
                    expect(exName).to.contain(searchWord)
                })
            }
        })
        cy.get('input').clear()
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
        cy.get('input').type('test')
        cy.wait(3000)
        cy.get('.paginate_button').then($el=>{
            for(let i=2;i<$el.length-1;i++){
                cy.get($el).eq(i).click()
                cy.wait(3000)
                cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/exchanges?limit=10&offset=${i*10-10}&sort=-name&q=test`,Authorization)
            }           
        })
        cy.get('input').clear()
    })
    it('Test actions',function(){
        cy.get('input').type('sivan test')
        cy.wait(3000)
        cy.get(':nth-child(5) > :nth-child(5) > .btn-group > :nth-child(1) > svg').click()
        cy.get('.modal-content').should('be.visible')
        cy.get('.btn-secondary').click()
        cy.get('input').clear()
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
        
        cy.get('input').type(searchWord)
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
        cy.get('input').clear()
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
        cy.get('input').type(searchWord)
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
        cy.get('.with-sub > .nav-link').click()
        cy.get(':nth-child(3) > .nav-sub-link').click()
        cy.wait(3000)
    })

})

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
        cy.get('input').type(searchWord)
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
            expect($el.text()).not.to.contain(searchWord)
        })
    })
    it('Go back to exchanges section', function () {
        cy.visit(`${this.data.NuviadAdminDashboard}/login`)
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()
        cy.url().should('eq', 'https://admin-stg.nuviad.com/dashboard/')
        cy.wait(10000)
        cy.get('.with-sub > .nav-link').click()
        cy.get(':nth-child(3) > .nav-sub-link').click()
        cy.wait(3000)
    })
}) */

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
        cy.get('input').type(newExchange.exchangeName)
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
    })
})