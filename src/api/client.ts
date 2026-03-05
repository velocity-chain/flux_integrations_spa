import type { 
  Integration,
  IntegrationInput,
  IntegrationUpdate,

  Inventory,
  InventoryInput,

  Shipment,
  ShipmentInput,

  Organization,

  Supplier,

  Product,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getIntegrations(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Integration>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Integration>>(`/integration${query ? `?${query}` : ''}`)
  },

  async getIntegration(integrationId: string): Promise<Integration> {
    return request<Integration>(`/integration/${integrationId}`)
  },

  async createIntegration(data: IntegrationInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/integration', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateIntegration(integrationId: string, data: IntegrationUpdate): Promise<Integration> {
    return request<Integration>(`/integration/${integrationId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints

  async getInventorys(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Inventory>>(`/inventory${query ? `?${query}` : ''}`)
  },

  async getInventory(inventoryId: string): Promise<Inventory> {
    return request<Inventory>(`/inventory/${inventoryId}`)
  },

  async createInventory(data: InventoryInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },


  async getShipments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Shipment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Shipment>>(`/shipment${query ? `?${query}` : ''}`)
  },

  async getShipment(shipmentId: string): Promise<Shipment> {
    return request<Shipment>(`/shipment/${shipmentId}`)
  },

  async createShipment(data: ShipmentInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/shipment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },



  // Consume endpoints

  async getOrganizations(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Organization>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Organization>>(`/organization${query ? `?${query}` : ''}`)
  },

  async getOrganization(organizationId: string): Promise<Organization> {
    return request<Organization>(`/organization/${organizationId}`)
  },


  async getSuppliers(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Supplier>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Supplier>>(`/supplier${query ? `?${query}` : ''}`)
  },

  async getSupplier(supplierId: string): Promise<Supplier> {
    return request<Supplier>(`/supplier/${supplierId}`)
  },


  async getProducts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Product>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Product>>(`/product${query ? `?${query}` : ''}`)
  },

  async getProduct(productId: string): Promise<Product> {
    return request<Product>(`/product/${productId}`)
  },


}

export { ApiError }
