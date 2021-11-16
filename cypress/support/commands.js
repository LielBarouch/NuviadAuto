// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
    cy.get('.form-group>.form-control').eq(0).clear()
    cy.get('.form-group>.form-control').eq(1).clear()
    cy.get('.form-group>.form-control').eq(0).type(email)
    cy.get('.form-group>.form-control').eq(1).type(password)
    cy.get('.btn').click()
})

Cypress.Commands.add('AdminLogin',(email,password)=>{
    cy.get('#email').clear()
    cy.get('#password').clear()
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    
    
})

Cypress.Commands.add('dashboardLogin',(email,password)=>{
    cy.get('input[type="email"]').clear()
    cy.get('input[type="password"]').clear()
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
})

Cypress.Commands.add('getToken',(email,password)=>{
    
    cy.request({
        method:'POST',
        url: 'https://api.nuviad.com/api/auth/user',
        body:{
            email,
            password,
        }
    }).as('loginResponse').then((response)=>{
        Cypress.env('token',response.body.token);
        return response
    }).its('status').should('eq',200)
})


Cypress.Commands.add('locationSearch',(loc)=>{
    cy.get('.search-location-field').clear()
    cy.get('.search-location-field').type(loc)
    cy.get('.ng-scope>.item>div>.ng-binding').should('include.text',loc)
    cy.get('.ng-scope>.item>div>div>small').each(($el,index,$list)=>{
        let locationsText=$el.text()
        expect(locationsText).to.include(loc)
    })
})

Cypress.Commands.add('checkApiLoad',(apiUrl,Authorization)=>{
    const apiToTest={
        method:'GET',
            url:apiUrl,
            headers:{
                Authorization,
            }
        }
    cy.request(apiToTest).its('status').should('eq',200)
    cy.request(apiToTest).its('body').should('not.be.empty')
    
})

Cypress.Commands.add('checkApiLoadDelete',(apiUrl,Authorization)=>{
    const apiToTest={
        method:'DELETE',
            url:apiUrl,
            headers:{
                Authorization,
            }
        }
    cy.request(apiToTest).its('status').should('eq',200)
})

Cypress.Commands.add('checkApiLoadPOST',(apiUrl,Authorization)=>{
    const apiToTest={
        method:'POST',
            url:apiUrl,
            headers:{
                Authorization,
            }
        }
    cy.request(apiToTest).its('status').should('eq',200)
    cy.request(apiToTest).its('body').should('not.be.empty')
    
})

Cypress.Commands.add('checkApiLoadPUT',(apiUrl,Authorization)=>{
    const apiToTest={
        method:'PUT',
            url:apiUrl,
            headers:{
                Authorization,
            }
        }
    cy.request(apiToTest).its('status').should('eq',200)
    cy.request(apiToTest).its('body').should('not.be.empty')
    
})

Cypress.Commands.add('selectTableRows',(selection,selectionToCompair,tableNum,table)=>{
    cy.get('select').eq(tableNum).select(selection)
    cy.wait(3000)
    cy.get(table).find('tbody>tr').then((rows)=>{
        if(selectionToCompair==100){
            /* cy.wrap(rows.length).should('gt',50) */
        }else{
            cy.wrap(rows.length).should('be.lte',selectionToCompair)
        }
        
    })
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

