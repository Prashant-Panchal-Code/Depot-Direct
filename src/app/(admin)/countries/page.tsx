/**
 * Countries Page - Basic Admin Interface for Country Management
 * 
 * Purpose: Simple admin page for managing countries with basic CRUD operations
 * Features:
 * - DataGrid-style table for countries
 * - Create Country button with skeleton form
 * - Basic edit/delete operations
 * - Country status management (active/inactive)
 * 
 * TODO: Implement full CountryForm with validation
 * TODO: Add country-specific settings (timezone, currency, etc.)
 * TODO: Add bulk operations and data import/export
 */

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast-placeholder'

// Country interface
interface Country {
  id: number
  name: string
  iso_code: string
  active: boolean
  region_count?: number
  company_count?: number
  created_at: string
}

// Mock countries data
const mockCountries: Country[] = [
  {
    id: 1,
    name: 'United States',
    iso_code: 'US',
    active: true,
    region_count: 4,
    company_count: 8,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Canada',
    iso_code: 'CA',
    active: true,
    region_count: 3,
    company_count: 2,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Mexico',
    iso_code: 'MX',
    active: true,
    region_count: 2,
    company_count: 1,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'United Kingdom',
    iso_code: 'GB',
    active: false,
    region_count: 0,
    company_count: 0,
    created_at: '2023-06-15T00:00:00Z'
  },
  {
    id: 5,
    name: 'Germany',
    iso_code: 'DE',
    active: false,
    region_count: 0,
    company_count: 0,
    created_at: '2023-06-15T00:00:00Z'
  }
]

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [showCountryForm, setShowCountryForm] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true)
      try {
        // TODO: Add auth token
        const response = await fetch('/api/depotdirect/countries', {
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add authorization header
          }
        })

        if (response.ok) {
          const data = await response.json()
          setCountries(data.countries || data)
        } else {
          throw new Error('Countries API failed')
        }
      } catch (error) {
        console.warn('Countries API failed, using mock data:', error)
        setCountries(mockCountries)
        showToast('Using demo data - API unavailable', 'warning')
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Handle create country
  const handleCreateCountry = () => {
    setEditingCountry(null)
    setShowCountryForm(true)
  }

  // Handle edit country
  const handleEditCountry = (country: Country) => {
    setEditingCountry(country)
    setShowCountryForm(true)
  }

  // Handle toggle country status
  const handleToggleStatus = async (country: Country) => {
    try {
      // TODO: Replace with real API call
      const response = await fetch(`/api/depotdirect/countries/${country.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({ active: !country.active })
      })

      if (response.ok) {
        setCountries(prev => 
          prev.map(c => c.id === country.id ? { ...c, active: !c.active } : c)
        )
        showToast(`Country ${country.active ? 'deactivated' : 'activated'} successfully`, 'success')
      } else {
        throw new Error('Failed to update country status')
      }
    } catch (error) {
      console.warn('Update country API failed, simulating for demo:', error)
      setCountries(prev => 
        prev.map(c => c.id === country.id ? { ...c, active: !c.active } : c)
      )
      showToast(`Country ${country.active ? 'deactivated' : 'activated'} (simulated)`, 'success')
    }
  }

  // Handle delete country
  const handleDeleteCountry = async (country: Country) => {
    if (country.company_count && country.company_count > 0) {
      showToast('Cannot delete country with existing companies', 'error')
      return
    }

    if (!confirm(`Are you sure you want to delete "${country.name}"?`)) {
      return
    }

    try {
      // TODO: Replace with real API call
      const response = await fetch(`/api/depotdirect/countries/${country.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        }
      })

      if (response.ok) {
        setCountries(prev => prev.filter(c => c.id !== country.id))
        showToast('Country deleted successfully', 'success')
      } else {
        throw new Error('Failed to delete country')
      }
    } catch (error) {
      console.warn('Delete country API failed, simulating for demo:', error)
      setCountries(prev => prev.filter(c => c.id !== country.id))
      showToast('Country deleted (simulated)', 'success')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-500">Loading countries...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage countries available in the system for companies and regions.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {countries.length} countries ({countries.filter(c => c.active).length} active)
        </div>
        <Button
          onClick={handleCreateCountry}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Country
        </Button>
      </div>

      {/* Countries Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISO Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Companies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {countries.map((country) => (
              <tr key={country.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {country.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {country.iso_code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {country.region_count || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {country.company_count || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    country.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {country.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCountry(country)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(country)}
                      className={country.active 
                        ? 'text-red-600 hover:text-red-700 hover:border-red-300'
                        : 'text-green-600 hover:text-green-700 hover:border-green-300'
                      }
                    >
                      {country.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCountry(country)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                      disabled={(country.company_count || 0) > 0}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {countries.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No countries found</div>
            <Button
              onClick={handleCreateCountry}
              className="mt-4"
              variant="outline"
            >
              Create your first country
            </Button>
          </div>
        )}
      </div>

      {/* TODO: Implement CountryForm modal */}
      {showCountryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCountry ? 'Edit Country' : 'Create Country'}
            </h3>
            <p className="text-gray-600 mb-4">
              Country form will be implemented here.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Country name (required)</p>
              <p>• ISO code (required, 2-3 letters)</p>
              <p>• Active status</p>
              <p>• Timezone (optional)</p>
              <p>• Currency (optional)</p>
            </div>
            {editingCountry && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  Editing: <strong>{editingCountry.name}</strong> ({editingCountry.iso_code})
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowCountryForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowCountryForm(false)}>
                {editingCountry ? 'Update' : 'Create'} (TODO)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
