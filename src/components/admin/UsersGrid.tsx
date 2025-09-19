/**
 * UsersGrid - Skeleton but Usable AG-Grid for User Management
 * 
 * Purpose: Admin interface for viewing and managing users with filtering
 * Features:
 * - ag-grid table with user data columns
 * - Filters by company and/or region client-side
 * - Create user button opens skeleton UserForm
 * - Basic CRUD actions with placeholder functionality
 * - User role and status management
 * 
 * TODO: Implement full UserForm with company/region multi-select
 * TODO: Add role-based permissions and user invitations
 * TODO: Add user bulk operations and CSV export
 * TODO: Add user activity and last login tracking
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridApi, GridReadyEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { CheckSquare, XCircle, Rows } from "@phosphor-icons/react"
import { showToast } from '@/components/ui/toast-placeholder'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// User data interface
interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role_name: string
  company_id: number
  company_name: string
  region_count: number
  active: boolean
  last_login?: string
  created_at: string
}

interface UsersGridProps {
  filterCompanyId?: number
  filterRegionId?: number
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    email: 'john.doe@acme.com',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    role_name: 'Admin',
    company_id: 1,
    company_name: 'ACME Corporation',
    region_count: 2,
    active: true,
    last_login: '2024-01-15T10:30:00Z',
    created_at: '2023-06-01T09:00:00Z'
  },
  {
    id: 2,
    email: 'jane.smith@acme.com',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    role_name: 'Manager',
    company_id: 1,
    company_name: 'ACME Corporation',
    region_count: 1,
    active: true,
    last_login: '2024-01-14T16:45:00Z',
    created_at: '2023-07-15T14:20:00Z'
  },
  {
    id: 3,
    email: 'bob.wilson@global.ca',
    first_name: 'Bob',
    last_name: 'Wilson',
    full_name: 'Bob Wilson',
    role_name: 'Operator',
    company_id: 2,
    company_name: 'Global Logistics Ltd',
    region_count: 2,
    active: true,
    last_login: '2024-01-12T11:20:00Z',
    created_at: '2023-08-03T10:15:00Z'
  },
  {
    id: 4,
    email: 'maria.garcia@mxtransport.mx',
    first_name: 'Maria',
    last_name: 'Garcia',
    full_name: 'Maria Garcia',
    role_name: 'Supervisor',
    company_id: 3,
    company_name: 'Mexico Transport Co',
    region_count: 1,
    active: false,
    last_login: '2023-12-20T08:30:00Z',
    created_at: '2023-05-12T13:45:00Z'
  },
  {
    id: 5,
    email: 'david.brown@acme.com',
    first_name: 'David',
    last_name: 'Brown',
    full_name: 'David Brown',
    role_name: 'Operator',
    company_id: 1,
    company_name: 'ACME Corporation',
    region_count: 1,
    active: true,
    last_login: '2024-01-13T14:15:00Z',
    created_at: '2023-09-10T11:30:00Z'
  }
]

export default function UsersGrid({ filterCompanyId, filterRegionId }: UsersGridProps) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false) // TODO: Implement UserForm
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<GridApi | null>(null)

  // Filter users by company and region
  const filteredUsers = allUsers.filter(user => {
    if (filterCompanyId && user.company_id !== filterCompanyId) {
      return false
    }
    // TODO: Add region filtering when user-region relationship is available
    // For now, just filter by company
    return true
  })

  // Actions cell renderer
  const ActionsRenderer = useCallback((params: { data: User }) => {
    const user = params.data

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      // TODO: Implement UserForm for editing
      showToast('User editing not yet implemented', 'info')
    }

    const handleDeactivate = async (e: React.MouseEvent) => {
      e.stopPropagation()
      
      const action = user.active ? 'deactivate' : 'activate'
      if (!confirm(`Are you sure you want to ${action} user "${user.full_name}"?`)) {
        return
      }

      try {
        // TODO: Replace with real API call
        const response = await fetch(`/api/depotdirect/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add authorization header
          },
          body: JSON.stringify({ active: !user.active })
        })

        if (response.ok) {
          setAllUsers(prev => 
            prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u)
          )
          showToast(`User ${action}d successfully`, 'success')
        } else {
          throw new Error(`Failed to ${action} user`)
        }
      } catch (error) {
        console.warn(`${action} user API failed, simulating for demo:`, error)
        setAllUsers(prev => 
          prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u)
        )
        showToast(`User ${action}d (simulated)`, 'success')
      }
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          className="h-7 px-2 text-xs"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDeactivate}
          className={`h-7 px-2 text-xs ${
            user.active 
              ? 'text-red-600 hover:text-red-700 hover:border-red-300'
              : 'text-green-600 hover:text-green-700 hover:border-green-300'
          }`}
        >
          {user.active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    )
  }, [])

  // Role badge renderer
  const RoleBadgeRenderer = useCallback((params: { value: string }) => {
    const role = params.value
    const getBadgeColor = (role: string) => {
      switch (role.toLowerCase()) {
        case 'admin':
          return 'bg-red-100 text-red-800'
        case 'manager':
          return 'bg-blue-100 text-blue-800'
        case 'supervisor':
          return 'bg-yellow-100 text-yellow-800'
        case 'operator':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(role)}`}>
        {role}
      </span>
    )
  }, [])

  // Date formatter
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      field: 'full_name',
      headerName: 'Name',
      width: 160,
      pinned: 'left'
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      pinned: 'left'
    },
    {
      field: 'role_name',
      headerName: 'Role',
      width: 120,
      cellRenderer: RoleBadgeRenderer
    },
    {
      field: 'company_name',
      headerName: 'Company',
      width: 180
    },
    {
      field: 'region_count',
      headerName: 'Regions',
      width: 100,
      type: 'numericColumn'
    },
    {
      field: 'last_login',
      headerName: 'Last Login',
      width: 140,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 100,
      cellRenderer: (params: { value: boolean }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          params.value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ]

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    // Don't fetch if no company is selected
    if (!filterCompanyId) {
      setAllUsers([])
      return
    }

    setLoading(true)
    try {
      // TEMPORARILY DISABLED: API endpoint not implemented yet
      // Always use mock data to prevent 404 errors and unnecessary API calls
      setAllUsers(mockUsers)
      
      // TODO: Implement users API endpoint and uncomment below
      // let url = '/api/depotdirect/users?limit=100'
      // if (filterCompanyId) {
      //   url += `&company_id=${filterCompanyId}`
      // }
      // const response = await fetch(url, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // TODO: Add authorization header
      //   }
      // })
      // if (response.ok) {
      //   const data = await response.json()
      //   setAllUsers(data.users || data)
      // } else {
      //   throw new Error('Users API failed')
      // }
    } catch (error) {
      console.warn('Users API failed, using mock data:', error)
      setAllUsers(mockUsers)
      showToast('Using demo users data - API unavailable', 'warning')
    } finally {
      setLoading(false)
    }
  }, [filterCompanyId])

  // Initialize data with debouncing to prevent rapid API calls
  useEffect(() => {
    // Debounce the API call to prevent rapid-fire requests
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 300) // 300ms debounce

    return () => {
      clearTimeout(timeoutId)
    }
  }, [fetchUsers])

  // Handle grid ready
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api
  }

  // Handle create new user
  const handleCreateUser = () => {
    // TODO: Implement UserForm component
    showToast('User creation form not yet implemented', 'info')
    setShowUserForm(true)
  }

  // Default grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Compact Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <Rows size={14} color="#02589d" weight="duotone" />
            <span className="font-medium text-gray-700">{filteredUsers.length}</span>
          </div>
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckSquare size={14} weight="duotone" color="green" />
            <span className="font-medium text-green-600">{filteredUsers.filter(u => u.active).length}</span>
          </div>
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <XCircle size={14} color="red" weight="duotone" />
            <span className="font-medium text-red-600">{filteredUsers.filter(u => !u.active).length}</span>
          </div>
        </div>
        <Button
          onClick={handleCreateUser}
          className="bg-primary-custom hover:bg-primary-custom/90 text-white text-xs h-7 px-2"
          size="sm"
        >
          Add
        </Button>
      </div>

      {/* Filter Info */}
      {(filterCompanyId || filterRegionId) && (
        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs">
          <span className="text-blue-700">
            Filtered by selection
          </span>
        </div>
      )}

      {/* Compact AG Grid */}
      <div style={{ height: '350px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredUsers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          pagination={true}
          paginationPageSize={15}
          rowHeight={40}
          headerHeight={35}
          suppressMenuHide={true}
          theme={themeQuartz}
          onGridReady={onGridReady}
        />
      </div>

      {/* TODO: Add UserForm modal when implemented */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">User Form</h3>
            <p className="text-gray-600 mb-4">
              User creation form will be implemented here.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Email (required, unique)</p>
              <p>• First name and last name (required)</p>
              <p>• Role selection (required)</p>
              <p>• Company selection (required)</p>
              <p>• Region assignments (DualList or multi-select)</p>
              <p>• Send invitation email option</p>
              <p>• Active status</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowUserForm(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary-custom hover:bg-primary-custom/90"
                onClick={() => setShowUserForm(false)}
              >
                Create (TODO)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
