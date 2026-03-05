describe('Shipment Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display shipments list page', () => {
    cy.visit('/shipments')
    cy.get('h1').contains('Shipments').should('be.visible')
    cy.get('[data-automation-id="shipment-list-new-button"]').should('be.visible')
  })

  it('should navigate to new shipment page', () => {
    cy.visit('/shipments')
    cy.get('[data-automation-id="shipment-list-new-button"]').click()
    cy.url().should('include', '/shipments/new')
    cy.get('h1').contains('New Shipment').should('be.visible')
  })

  it('should create a new shipment document', () => {
    cy.visit('/shipments/new')
    
    const timestamp = Date.now()
    const itemName = `test-shipment-${timestamp}`
    
    cy.get('[data-automation-id="shipment-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="shipment-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="shipment-new-status-input"]').type('active')
    cy.get('[data-automation-id="shipment-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/shipments/')
    cy.url().should('not.include', '/shipments/new')
    
    // Verify the shipment name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for shipments', () => {
    // First create a shipment with a unique name
    cy.visit('/shipments/new')
    const timestamp = Date.now()
    const itemName = `search-test-shipment-${timestamp}`
    
    cy.get('[data-automation-id="shipment-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="shipment-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="shipment-new-status-input"]').type('active')
    cy.get('[data-automation-id="shipment-new-submit-button"]').click()
    cy.url().should('include', '/shipments/')
    
    // Navigate to list page
    cy.visit('/shipments')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the shipment
    cy.get('[data-automation-id="shipment-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the shipment
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all shipments are shown again
    cy.get('[data-automation-id="shipment-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
