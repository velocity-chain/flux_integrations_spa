describe('Inventory Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display inventorys list page', () => {
    cy.visit('/inventorys')
    cy.get('h1').contains('Inventorys').should('be.visible')
    cy.get('[data-automation-id="inventory-list-new-button"]').should('be.visible')
  })

  it('should navigate to new inventory page', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="inventory-list-new-button"]').click()
    cy.url().should('include', '/inventorys/new')
    cy.get('h1').contains('New Inventory').should('be.visible')
  })

  it('should create a new inventory document', () => {
    cy.visit('/inventorys/new')
    
    const timestamp = Date.now()
    const itemName = `test-inventory-${timestamp}`
    
    cy.get('[data-automation-id="inventory-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="inventory-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="inventory-new-status-input"]').type('active')
    cy.get('[data-automation-id="inventory-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/inventorys/')
    cy.url().should('not.include', '/inventorys/new')
    
    // Verify the inventory name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for inventorys', () => {
    // First create a inventory with a unique name
    cy.visit('/inventorys/new')
    const timestamp = Date.now()
    const itemName = `search-test-inventory-${timestamp}`
    
    cy.get('[data-automation-id="inventory-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="inventory-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="inventory-new-status-input"]').type('active')
    cy.get('[data-automation-id="inventory-new-submit-button"]').click()
    cy.url().should('include', '/inventorys/')
    
    // Navigate to list page
    cy.visit('/inventorys')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the inventory
    cy.get('[data-automation-id="inventory-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the inventory
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all inventorys are shown again
    cy.get('[data-automation-id="inventory-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
