/// <reference types="Cypress" />



describe('Admin dashboard', function () {
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
        cy.wait(6000)

    })
    it('Logout',function(){
        cy.get('.avatar-initial').click({force:true})
        cy.get('.dropdown-item').click({force:true})
        cy.get('.ProgressButton_wrapper__2qZuW > .btn').click({force:true})
        cy.url().should('eq',`${this.data.HubzityAdminDashboard}/login/`)
    })
    it('Login again', function () {
        cy.AdminLogin(this.data.emailAdmin, this.data.password)
        cy.get('.btn-brand-02').click()

        cy.url().should('eq', 'https://admin.hubzity.com/dashboard/')
        cy.wait(6000)

    })
    it('Check stats and charts APIs', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily/summary`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/daily`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/stats/minute`, Authorization)
        cy.checkApiLoad(`${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`, Authorization)
    })
    it('Check stats data',{retries:{openMode:3}}, function () {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/admin/stats/daily/summary`,
            headers: {
                Authorization,
            },
            body:{}
        }
        cy.get(':nth-child(2) > .sc-bdVaJa').click({force:true})
        cy.request(apiToTest).then(response=>{
            const imp=Number(response.body.impressions)
            const clicks=Number(response.body.clicks)
            const cpc=Number(response.body.cpc)+0.1
            const revenue=Number(response.body.revenue)
            const cost=Number(response.body.cost)
            const profit=Number(response.body.profit)
            const arr=[imp,clicks,cpc,revenue,cost,profit]
            var i=0

            cy.get('.tx-normal').each(($el,index,$list)=>{
                var elValue=$el.text()
                elValue=Number(elValue.replace(/\$|,/g, ''))

                cy.log(elValue)
                cy.wrap(arr[i]++).should('be.gte',elValue)

            })


        })
    })
    it('Test pending ads table', function () {
        cy.get(':nth-child(5) > .col-md-12 > .mg-b-10 > .align-items-center > .d-flex > .lh-0 > .sc-bdVaJa').click({force:true})
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/admin/ads/?limit=1000&status=PENDING_VERIFICATION`,
            headers: {
                Authorization,
            },
            body: {}
        }
        cy.request(apiToTest).then(response => {
            
            const adsCount=Number(response.body.items.length)
            cy.get('.dataTables_info').eq(0).should('contain.text',adsCount)
            cy.wrap(adsCount).should('eq',response.body.meta_data.total)
        })
    })
    it('Test pending accounts table', function () {
        const token = Cypress.env('token');
        const Authorization = token;
        const apiToTest = {
            method: 'GET',
            url: `${this.data.API_BASE_URL}/admin/accounts/?limit=10&offset=0&sort=-created_at&status=PENDING`,
            headers: {
                Authorization,
            },
            body: {}
        }
        cy.request(apiToTest).then(response => {
            
            
            cy.get('.dataTables_info').eq(1).should('contain.text',response.body.total_count)
            
        })
    })
    
})