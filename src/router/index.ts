import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/integrations'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: Integration
    {
      path: '/integrations',
      name: 'Integrations',
      component: () => import('@/pages/IntegrationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/integrations/new',
      name: 'IntegrationNew',
      component: () => import('@/pages/IntegrationNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/integrations/:id',
      name: 'IntegrationEdit',
      component: () => import('@/pages/IntegrationEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Create domain: Inventory
    {
      path: '/inventorys',
      name: 'Inventorys',
      component: () => import('@/pages/InventorysListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/inventorys/new',
      name: 'InventoryNew',
      component: () => import('@/pages/InventoryNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/inventorys/:id',
      name: 'InventoryView',
      component: () => import('@/pages/InventoryViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Create domain: Shipment
    {
      path: '/shipments',
      name: 'Shipments',
      component: () => import('@/pages/ShipmentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shipments/new',
      name: 'ShipmentNew',
      component: () => import('@/pages/ShipmentNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shipments/:id',
      name: 'ShipmentView',
      component: () => import('@/pages/ShipmentViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Consume domain: Organization
    {
      path: '/organizations',
      name: 'Organizations',
      component: () => import('@/pages/OrganizationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/organizations/:id',
      name: 'OrganizationView',
      component: () => import('@/pages/OrganizationViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Supplier
    {
      path: '/suppliers',
      name: 'Suppliers',
      component: () => import('@/pages/SuppliersListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/suppliers/:id',
      name: 'SupplierView',
      component: () => import('@/pages/SupplierViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Product
    {
      path: '/products',
      name: 'Products',
      component: () => import('@/pages/ProductsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'ProductView',
      component: () => import('@/pages/ProductViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'Integrations' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Velocity Chain Login' : 'Integrations'
})

export default router