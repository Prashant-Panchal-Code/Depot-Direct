/**
 * UserForm - Dialog form for creating and editing users
 * 
 * Purpose: Reusable form component for user CRUD operations
 * Features:
 * - Create and edit modes
 * - Company and role selection dropdowns
 * - Validation for required fields
 * - Password field (required for create, optional for edit)
 * - Phone number and active status toggle
 */

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { showToast } from '@/components/ui/toast-placeholder'
import AdminApiService, { AddUserDTO, UpdateUserDTO, User, Company } from '@/lib/api/admin'

interface UserFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user?: User | null // null/undefined for create, User object for edit
  mode: 'create' | 'edit'
  filterCountryId?: number
}

interface Role {
  id: number
  name: string
}

export default function UserForm({ open, onClose, onSuccess, user, mode, filterCountryId }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [companiesList, setCompaniesList] = useState<Company[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [formData, setFormData] = useState<AddUserDTO & { id?: number }>({
    companyId: undefined,
    roleId: 0,
    email: '',
    password: '',
    fullName: '',
    phone: '',
    active: true,
    metadata: ''
  })

  // Load companies and roles when component mounts
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const rolesData = await AdminApiService.getRoles()
        setRoles(rolesData)
        
        // Load companies for the selected country
        if (filterCountryId) {
          const companiesData = await AdminApiService.getCompanies(filterCountryId)
          setCompaniesList(companiesData)
        } else {
          // Clear companies if no country is selected
          setCompaniesList([])
        }
      } catch (error) {
        console.error('Error loading dropdown data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load form data'
        showToast(errorMessage, 'error')
      }
    }

    if (open) {
      loadDropdownData()
    }
  }, [open, filterCountryId])

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        id: user.id,
        companyId: user.companyId,
        roleId: user.roleId,
        email: user.email,
        password: '', // Don't populate password for edit
        fullName: user.fullName,
        phone: user.phone || '',
        active: user.active,
        metadata: user.metadata || ''
      })
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        companyId: undefined,
        roleId: 0,
        email: '',
        password: '',
        fullName: '',
        phone: '',
        active: true,
        metadata: ''
      })
    }
  }, [mode, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.fullName || !formData.roleId) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    if (mode === 'create' && !formData.password) {
      showToast('Password is required for new users', 'error')
      return
    }

    setLoading(true)
    
    try {
      if (mode === 'create') {
        const createData: AddUserDTO = {
          companyId: formData.companyId,
          roleId: formData.roleId,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone || undefined,
          active: formData.active,
          metadata: formData.metadata || undefined
        }
        await AdminApiService.createUser(createData)
        showToast('User created successfully', 'success')
      } else {
        const updateData: UpdateUserDTO = {
          companyId: formData.companyId,
          roleId: formData.roleId,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone || undefined,
          active: formData.active,
          metadata: formData.metadata || undefined
        }
        
        // Only include password if it was provided
        if (formData.password) {
          updateData.password = formData.password
        }
        
        await AdminApiService.updateUser(user!.id, updateData)
        showToast('User updated successfully', 'success')
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving user:', error)
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode} user`
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
            {mode === 'create' && (
              <p className="text-xs text-gray-500">
                Email addresses must be unique across all users in the system.
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password (optional)'}
              required={mode === 'create'}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Select
              value={formData.companyId?.toString() || '0'}
              onValueChange={(value) => handleInputChange('companyId', value === '0' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Company</SelectItem>
                {companiesList.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.roleId?.toString() || '0'}
              onValueChange={(value) => handleInputChange('roleId', parseInt(value))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata</Label>
            <Input
              id="metadata"
              value={formData.metadata}
              onChange={(e) => handleInputChange('metadata', e.target.value)}
              placeholder="Enter metadata (optional)"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Active User</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}