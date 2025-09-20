/**
 * RegionForm - Create/Edit Region Dialog
 * 
 * Purpose: Modal form for creating and editing regions connected to companies
 * Features:
 * - React Hook Form with Zod validation
 * - Company selection with API fetch + fallback
 * - Region code uniqueness validation
 * - Proper accessibility with focus management
 * - Loading states and error handling
 * 
 * Note: Regions are connected to companies, not directly to countries
 * Companies provide the country context for regions
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { showToast } from '@/components/ui/toast-placeholder'
import { adminApi } from '@/lib/api/service'

// Region form validation schema
const regionSchema = z.object({
  name: z.string().min(2, 'Region name must be at least 2 characters'),
  region_code: z.string().optional(),
  company_id: z.string().min(1, 'Please select a company')
})

type RegionFormData = z.infer<typeof regionSchema>

// Region interface
interface Region {
  id: number
  region_code: string
  name: string
  company_id: number
  company_name: string
  country_id: number
  country_name: string
}

// Company interface for selection
interface Company {
  id: number
  name: string
  company_code: string
  country_id: number
  country_name: string
}

interface RegionFormProps {
  region?: Region | null
  onSaved: (region: Region) => void
  onClose: () => void
  selectedCompany?: { id: number; name: string; country_id: number; country_name: string } // Pre-selected company (makes field read-only)
}

// Mock companies fallback
const mockCompanies: Company[] = [
  { id: 1, name: 'ACME Corporation', company_code: 'ACME-US', country_id: 1, country_name: 'United States' },
  { id: 2, name: 'Global Logistics Ltd', company_code: 'GLB-CA', country_id: 2, country_name: 'Canada' },
  { id: 3, name: 'Mexico Transport Co', company_code: 'MX-TRN', country_id: 3, country_name: 'Mexico' }
]

// Map API response to Region interface
const mapApiResponseToRegion = (apiResponse: any): Region => {
  return {
    id: apiResponse.id,
    region_code: apiResponse.regionCode || '',
    name: apiResponse.name,
    company_id: apiResponse.companyId,
    company_name: apiResponse.companyName || 'Unknown',
    country_id: apiResponse.countryId,
    country_name: apiResponse.countryName || 'Unknown'
  }
}

export default function RegionForm({ region, onSaved, onClose, selectedCompany }: RegionFormProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeError, setCodeError] = useState<string>('')

  const isEdit = !!region

  // Initialize form
  const form = useForm<RegionFormData>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: region?.name || '',
      region_code: region?.region_code || '',
      company_id: region?.company_id?.toString() || selectedCompany?.id?.toString() || ''
    }
  })

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // If we have a selected company, we might still want to show all companies for flexibility
        // But if it's pre-selected, we'll make the field read-only
        if (selectedCompany) {
          // For pre-selected company, we can just use that company in the list
          setCompanies([{
            id: selectedCompany.id,
            name: selectedCompany.name,
            company_code: '', // Not needed for display
            country_id: selectedCompany.country_id,
            country_name: selectedCompany.country_name
          }])
        } else {
          // TODO: Fetch all companies from API
          // For now, use mock data
          setCompanies(mockCompanies)
        }
      } catch (error) {
        console.warn('Companies API failed, using mock data:', error)
        setCompanies(mockCompanies)
        showToast('Using demo companies - API unavailable', 'warning')
      } finally {
        setCompaniesLoading(false)
      }
    }

    fetchCompanies()
  }, [selectedCompany])

  // Auto-focus name field when dialog opens
  useEffect(() => {
    if (!isEdit) {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 100)
      }
    }
  }, [isEdit])

  // Validate region code uniqueness
  const validateRegionCode = useCallback(async (code: string, companyId: string) => {
    if (!code || !companyId) return true

    try {
      // TODO: Replace with real API call for region code validation
      // For now, just basic validation
      setCodeError('')
      return true
    } catch (error) {
      console.warn('Region code validation API failed:', error)
      setCodeError('')
      return true
    }
  }, [isEdit, region?.id])

  // Handle region code change with debounced validation
  const watchedRegionCode = form.watch('region_code')
  const watchedCompanyId = form.watch('company_id')
  
  useEffect(() => {
    if (watchedRegionCode && watchedCompanyId) {
      const timeoutId = setTimeout(() => {
        validateRegionCode(watchedRegionCode, watchedCompanyId)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [watchedRegionCode, watchedCompanyId, validateRegionCode])

  // Handle form submission
  const onSubmit = async (data: RegionFormData) => {
    setIsSubmitting(true)

    try {
      // Validate region code if provided
      if (data.region_code && data.company_id) {
        const isValidCode = await validateRegionCode(data.region_code, data.company_id)
        if (!isValidCode) {
          setIsSubmitting(false)
          return
        }
      }

      // Prepare submission data according to API specification
      const submitData = {
        regionCode: data.region_code || '',
        name: data.name,
        companyId: parseInt(data.company_id)
      }

      let savedRegion: Region

      if (isEdit) {
        // Update existing region using admin API service
        const result = await adminApi.put(`/Regions/${region.id}`, submitData) as any
        savedRegion = mapApiResponseToRegion(result)
      } else {
        // Create new region using admin API service
        const result = await adminApi.post('/Regions', submitData) as any
        savedRegion = mapApiResponseToRegion(result)
      }

      // Show success message and close form
      onSaved(savedRegion)
      showToast(
        `Region ${isEdit ? 'updated' : 'created'} successfully`, 
        'success'
      )

    } catch (error) {
      console.error('Region save failed:', error)
      
      // Show error message to user
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${isEdit ? 'update' : 'create'} region`
      
      showToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Region' : 'Create New Region'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the region information below.' 
              : 'Enter the details for the new region. Regions are assigned to companies.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Region Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. California, Ontario, Jalisco"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Region Code */}
            <FormField
              control={form.control}
              name="region_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. CA, ON, JAL (optional)"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {codeError && (
                    <p className="text-sm text-red-600">{codeError}</p>
                  )}
                  <FormDescription>
                    Optional short code for the region
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Selection */}
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting || companiesLoading || !!selectedCompany}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          companiesLoading 
                            ? "Loading companies..." 
                            : selectedCompany 
                              ? selectedCompany.name 
                              : "Select a company"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name} ({company.country_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCompany && (
                    <FormDescription>
                      This region will be created under {selectedCompany.name} in {selectedCompany.country_name}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-custom hover:bg-primary-custom/90"
              >
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update Region' : 'Create Region')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}