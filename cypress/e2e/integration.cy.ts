describe('Integration Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display integrations list page', () => {
    cy.visit('/integrations')
    cy.get('h1').contains('Integrations').should('be.visible')
    cy.get('[data-automation-id="integration-list-new-button"]').should('be.visible')
  })

  it('should navigate to new integration page', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="integration-list-new-button"]').click()
    cy.url().should('include', '/integrations/new')
    cy.get('h1').contains('New Integration').should('be.visible')
  })

  it('should create a new integration', () => {
    cy.visit('/integrations/new')
    
    const timestamp = Date.now()
    const itemName = `test-integration-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="integration-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="integration-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="integration-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/integrations/')
    cy.url().should('not.include', '/integrations/new')
    
    // Verify the integration name is displayed on edit page
    cy.get('[data-automation-id="integration-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a integration', () => {
    // First create a integration
    cy.visit('/integrations/new')
    const timestamp = Date.now()
    const itemName = `test-integration-update-${timestamp}`
    const updatedName = `updated-integration-${timestamp}`
    
    cy.get('[data-automation-id="integration-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="integration-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="integration-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/integrations/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="integration-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="integration-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="integration-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="integration-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="integration-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="integration-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the integration appears with updated name
    cy.get('[data-automation-id="integration-edit-back-button"]').click()
    cy.url().should('include', '/integrations')
    
    // Search for the updated integration
    cy.get('[data-automation-id="integration-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the integration appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all integrations are shown again
    cy.get('[data-automation-id="integration-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for integrations', () => {
    // First create a integration with a unique name
    cy.visit('/integrations/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="integration-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="integration-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="integration-new-submit-button"]').click()
    cy.url().should('include', '/integrations/')
    
    // Navigate to list page
    cy.visit('/integrations')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the integration
    cy.get('[data-automation-id="integration-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the integration
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all integrations are shown again
    cy.get('[data-automation-id="integration-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
