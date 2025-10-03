'use client'

import { useEffect, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { CheckSquare, XCircle, Rows } from "@phosphor-icons/react"
import { showToast } from '@/components/ui/toast-placeholder'
import AdminApiService, { User, Company } from '@/lib/api/admin'
import UserForm from './UserForm'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

interface UsersGridProps {
  filterCompanyId?: number
  filterRegionId?: number
  filterCountryId?: number
}

// Static mock data outside component to prevent recreating on every render
const mockUsers: User[] = [
  {
    id: 1,
    email: 'john.doe@acme.com',
    fullName: 'John Doe',
    companyId: 1,
    roleId: 1,
    active: true,
    phone: '+1-555-0101',
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    roleName: 'Admin',
    companyName: 'ACME Corporation'
  },
  {
    id: 2,
    email: 'jane.smith@acme.com',
    fullName: 'Jane Smith',
    companyId: 1,
    roleId: 2,
    active: true,
    phone: '+1-555-0102',
    createdAt: '2023-07-15T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    roleName: 'Manager',
    companyName: 'ACME Corporation'
  },
  {
    id: 3,
    email: 'bob.wilson@techcorp.com',
    fullName: 'Bob Wilson',
    companyId: 2,
    roleId: 1,
    active: false,
    phone: '+1-555-0103',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-02-01T12:30:00Z',
    roleName: 'Admin',
    companyName: 'TechCorp'
  }
]

export default function UsersGrid({ filterCompanyId, filterRegionId, filterCountryId }: UsersGridProps) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const filters: { companyId?: number; regionId?: number; countryId?: number } = {}
      if (filterCompanyId) filters.companyId = filterCompanyId
      if (filterRegionId) filters.regionId = filterRegionId
      if (filterCountryId) filters.countryId = filterCountryId
      
      const users = await AdminApiService.getUsers(filters)
      console.log('Fetched users:', users)
      setAllUsers(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users'
      showToast(errorMessage, 'error')
      // Fall back to mock data in case of API error
      setAllUsers(mockUsers.filter(user => 
        !filterCompanyId || user.companyId === filterCompanyId
      ))
    } finally {
      setLoading(false)
    }
  }, [filterCompanyId, filterRegionId, filterCountryId])

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filter users by company (additional client-side filtering if needed)
  const filteredUsers = allUsers.filter(user => {
    if (filterCompanyId && user.companyId !== filterCompanyId) {
      return false
    }
    return true
  })

  // Actions cell renderer
  const ActionsRenderer = useCallback((params: { data: User }) => {
    const user = params.data

    const handleEdit = () => {
      setEditingUser(user)
      setFormMode('edit')
      setShowUserForm(true)
    }

    const handleToggleStatus = async () => {
      try {
        // Update user status via API
        await AdminApiService.updateUser(user.id, { active: !user.active })
        
        // Update local state to reflect the change
        setAllUsers(prev => 
          prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u)
        )
        showToast(`User ${user.active ? 'deactivated' : 'activated'} successfully`, 'success')
      } catch (error) {
        console.error('Error updating user status:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user status'
        showToast(errorMessage, 'error')
      }
    }

    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleEdit} className="h-7 px-2 text-xs">
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggleStatus}
          className={`h-7 px-2 text-xs ${
            user.active 
              ? 'text-red-600 hover:text-red-700'
              : 'text-green-600 hover:text-green-700'
          }`}
        >
          {user.active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    )
  }, [])

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => (
        <span className="font-medium text-gray-900">{params.value}</span>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'roleName',
      headerName: 'Role',
      flex: 0.8,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {params.value}
        </span>
      )
    },
    {
      field: 'companyName',
      headerName: 'Company',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 0.8,
      minWidth: 130
    },
    {
      field: 'active',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 100,
      cellRenderer: (params: any) => (
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
      width: 160,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ]

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormMode('create')
    setShowUserForm(true)
  }

  const handleFormSuccess = () => {
    // Refresh the users data after successful create/edit
    fetchUsers()
    setShowUserForm(false)
    setEditingUser(null)
    showToast('User saved successfully', 'success')
  }

  const handleFormClose = () => {
    setShowUserForm(false)
    setEditingUser(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading users...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
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
          Add User
        </Button>
      </div>

      <div className="flex-1 min-h-0" style={{ width: '100%' }}>
        <AgGridReact
          rowData={filteredUsers}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          animateRows={true}
          pagination={false}
          rowHeight={45}
          headerHeight={35}
          theme={themeQuartz}
          suppressPaginationPanel={true}
          domLayout="normal"
        />
      </div>

      <UserForm
        open={showUserForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        user={editingUser}
        mode={formMode}
        filterCountryId={filterCountryId}
      />
    </div>
  )
}