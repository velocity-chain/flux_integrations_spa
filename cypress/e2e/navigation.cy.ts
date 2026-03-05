describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('INTEGRATION DOMAIN').should('be.exist')
    cy.contains('INVENTORY DOMAIN').should('be.exist')
    cy.contains('SHIPMENT DOMAIN').should('be.exist')
    cy.contains('ORGANIZATION DOMAIN').should('be.exist')
    cy.contains('SUPPLIER DOMAIN').should('be.exist')
    cy.contains('PRODUCT DOMAIN').should('be.exist')
  })
  it('should have all integration domain links in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-integrations-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-integrations-new-link"]').should('be.visible')
  })
  it('should have all inventory domain links in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-inventorys-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-inventorys-new-link"]').should('be.visible')
  })
  it('should have all shipment domain links in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-shipments-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-shipments-new-link"]').should('be.visible')
  })
  it('should have organization domain link in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-organizations-list-link"]').should('be.visible')
  })
  it('should have supplier domain link in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-suppliers-list-link"]').should('be.visible')
  })
  it('should have product domain link in drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-products-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-inventorys-list-link"]').click()
    cy.url().should('include', '/inventorys')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/integrations')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-inventorys-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('INTEGRATION DOMAIN').should('not.be.visible')
  })
})