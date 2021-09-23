/// <reference types="Cypress" />

describe('Express user login',function(){
    beforeEach(function(){
        cy.fixture('example').then(function(data){
            this.data=data
        })
    })
    it('Enter to login',function(){
        cy.visit(`${this.data.NuviadExpressBaseURL}`)
        cy.get('.top-section > .content > button.ng-scope').click()
        cy.wait(2000)
        cy.get('.user > .button').click().then(function(){
            cy.wait(2000)
            cy.url().should('eq',`${this.data.NuviadExpressBaseURL}/sign_in`)
        })
    })
     it('Trying to login in without email or password',function(){
         cy.get('.help-block').should('not.be.visible')
         cy.get('.btn').click()
         cy.url().should('eq',`${this.data.NuviadExpressBaseURL}/sign_in`)
         cy.get('.help-block').should('be.visible')
     })
     it('Trying to login in with wrong password',function(){
         cy.login(this.data.emailExpressUser,'sfsdfsf')
         cy.url().should('eq',`${this.data.NuviadExpressBaseURL}/sign_in`)
         cy.get('.alert > .ng-binding').should('contain.text','Password incorrect')
        
     })
     it('Trying to login in with wrong email',function(){
         cy.get('.form-group>.form-control').eq(0).clear()
         cy.get('.form-group>.form-control').eq(1).clear()
         cy.login('liel@sdad.com',this.data.password)
         cy.url().should('eq',`${this.data.NuviadExpressBaseURL}/sign_in`)
         //Here we should check the error
        
        
    })
    
    it('Trying to login',function(){
        cy.get('.form-group>.form-control').eq(0).clear()
        cy.get('.form-group>.form-control').eq(1).clear()
        cy.login(this.data.emailExpressUser,this.data.password)
        cy.wait(2000)
        cy.url().should('eq',`${this.data.NuviadExpressBaseURL}/campaign_planning`)
    })
})