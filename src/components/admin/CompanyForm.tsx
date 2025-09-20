/**
 * CompanyForm - Fully implemented Create/Edit Company Dialog
 * 
 * Purpose: Modal form for creating and editing companies using shadcn components
 * Features:
 * - React Hook Form with Zod validation
 * - Country selection with API fetch + fallback
 * - Company code uniqueness validation
 * - Proper accessibility with focus management
 * - Loading states and error handling
 * 
 * TODO: Wire real API endpoints with authentication
 * TODO: Add server-side validation
 * TODO: Add image upload for company logo
 * TODO: Add company settings/preferences section
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


// Company form validation schema
const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_code: z.string().optional(),
  country_id: z.string().min(1, 'Please select a country'),
  description: z.string().optional()
})

type CompanyFormData = z.infer<typeof companySchema>

// Company interface
interface Company {
  id: number
  company_code: string
  name: string
  country_id: number
  country_name: string
  description: string
}

// Country interface
interface Country {
  id: number
  name: string
  iso_code: string
}

interface CompanyFormProps {
  company?: Company | null
  onSaved: (company: Company) => void
  onClose: () => void
  selectedCountry?: { id: number; name: string } // Pre-selected country (makes field read-only)
}

// Mock countries fallback
const mockCountries: Country[] = [
  { id: 1, name: 'United States', iso_code: 'US' },
  { id: 2, name: 'Canada', iso_code: 'CA' },
  { id: 3, name: 'Mexico', iso_code: 'MX' },
  { id: 4, name: 'United Kingdom', iso_code: 'GB' },
  { id: 5, name: 'Germany', iso_code: 'DE' }
]

// Map API response to Company interface
const mapApiResponseToCompany = (apiResponse: any): Company => {
  return {
    id: apiResponse.id,
    company_code: apiResponse.companyCode || '',
    name: apiResponse.name,
    country_id: apiResponse.countryId,
    country_name: apiResponse.country?.name || 'Unknown',
    description: apiResponse.description || ''
  }
}

export default function CompanyForm({ company, onSaved, onClose, selectedCountry }: CompanyFormProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeError, setCodeError] = useState<string>('')

  const isEdit = !!company

  // Initialize form
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      company_code: company?.company_code || '',
      country_id: company?.country_id?.toString() || selectedCountry?.id?.toString() || '',
      description: company?.description || ''
    }
  })

  // Fetch countries on mount (only if no selectedCountry is provided)
  useEffect(() => {
    // Skip fetching countries if selectedCountry is already provided
    if (selectedCountry) {
      setCountries([{ id: selectedCountry.id, name: selectedCountry.name, iso_code: '' }])
      setCountriesLoading(false)
      return
    }

    const fetchCountries = async () => {
      try {
        // TODO: Add auth token to request
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
        showToast('Using demo countries - API unavailable', 'warning')
      } finally {
        setCountriesLoading(false)
      }
    }

    fetchCountries()
  }, [selectedCountry])

  // Auto-focus name field when dialog opens
  useEffect(() => {
    if (!isEdit) {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 100)
      }
    }
  }, [isEdit])

  // Validate company code uniqueness
  const validateCompanyCode = useCallback(async (code: string, countryId: string) => {
    if (!code || !countryId) return true

    try {
      // TODO: Replace with real API call and add auth token
      const response = await fetch(
        `/api/depotdirect/companies?country_id=${countryId}&company_code=${encodeURIComponent(code)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add authorization header
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const existingCompany = data.companies?.[0] || data[0]
        
        // If editing, allow the same code for the current company
        if (existingCompany && (!isEdit || existingCompany.id !== company?.id)) {
          setCodeError('Company code already exists in this country')
          return false
        }
      }
    } catch (error) {
      console.warn('Company code validation API failed:', error)
      // Continue with form submission if validation API fails
    }

    setCodeError('')
    return true
  }, [isEdit, company?.id])

  // Handle company code change with debounced validation
  const watchedCompanyCode = form.watch('company_code')
  const watchedCountryId = form.watch('country_id')
  
  useEffect(() => {
    if (watchedCompanyCode && watchedCountryId) {
      const timeoutId = setTimeout(() => {
        validateCompanyCode(watchedCompanyCode, watchedCountryId)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [watchedCompanyCode, watchedCountryId, validateCompanyCode])

  // Handle form submission
  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true)

    try {
      // Validate company code if provided
      if (data.company_code && data.country_id) {
        const isValidCode = await validateCompanyCode(data.company_code, data.country_id)
        if (!isValidCode) {
          setIsSubmitting(false)
          return
        }
      }

      // Prepare submission data according to API specification
      const submitData = {
        companyCode: data.company_code || '',
        name: data.name,
        countryId: parseInt(data.country_id),
        description: data.description || ''
      }

      let savedCompany: Company

      if (isEdit) {
        // Update existing company using admin API service
        const result = await adminApi.put(`/Companies/${company.id}`, submitData) as any
        savedCompany = mapApiResponseToCompany(result)
      } else {
        // Create new company using admin API service
        const result = await adminApi.post('/Companies', submitData) as any
        savedCompany = mapApiResponseToCompany(result)
      }

      // Show success message and close form
      onSaved(savedCompany)
      showToast(
        `Company ${isEdit ? 'updated' : 'created'} successfully`, 
        'success'
      )

    } catch (error) {
      console.error('Company save failed:', error)
      
      // Show error message to user
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${isEdit ? 'update' : 'create'} company`
      
      showToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md" aria-describedby="company-form-description">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Company' : 'Create New Company'}
            </DialogTitle>
            <DialogDescription id="company-form-description">
              {isEdit 
                ? 'Update company information and settings.'
                : 'Add a new company to the system. Required fields are marked with *.'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Company Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter company name"
                        autoFocus={!isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Code */}
              <FormField
                control={form.control}
                name="company_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Code</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Optional unique identifier"
                      />
                    </FormControl>
                    <FormDescription>
                      Optional unique code for this company
                    </FormDescription>
                    {codeError && (
                      <p className="text-sm text-red-600">{codeError}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Selection */}
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    {selectedCountry ? (
                      <FormControl>
                        <Input
                          value={selectedCountry.name}
                          disabled
                          className="bg-gray-50 cursor-not-allowed"
                        />
                      </FormControl>
                    ) : (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countriesLoading ? (
                            <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                          ) : (
                            countries.map(country => (
                              <SelectItem key={country.id} value={country.id.toString()}>
                                {country.name} ({country.iso_code})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {selectedCountry && (
                      <FormDescription>
                        Country is pre-selected based on your current selection
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Optional company description"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="flex gap-3 flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !!codeError}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
