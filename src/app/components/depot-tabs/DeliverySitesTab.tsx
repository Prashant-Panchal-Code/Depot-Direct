"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, MagnifyingGlass, Funnel, Clock, CarSimple, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { UserApiService, DepotSiteSummary, SiteSummary, CreateDepotSiteRequest, UpdateDepotSiteRequest } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";
import { DepotDetails } from "../DepotDetailsPage";

interface DeliverySitesTabProps {
  depot: DepotDetails;
}

export default function DeliverySitesTab({ depot }: DeliverySitesTabProps) {
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<DepotSiteSummary | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<DepotSiteSummary | null>(null);

  // Data states
  const [deliverySites, setDeliverySites] = useState<DepotSiteSummary[]>([]);
  const [availableSites, setAvailableSites] = useState<SiteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch delivery sites for this depot
  useEffect(() => {
    const fetchDeliverySites = async () => {
      try {
        setLoading(true);
        const sites = await UserApiService.getDepotSites(depot.id);
        setDeliverySites(sites);
      } catch (error) {
        console.error("Failed to fetch delivery sites:", error);
        showError("Failed to load delivery sites", error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverySites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depot.id]);

  // Fetch available sites for the region when adding
  const fetchAvailableSites = async () => {
    if (!depot.regionId) {
      showError("Region not found", "This depot does not have a region assigned");
      return;
    }

    try {
      showLoader("Loading available sites...");
      const sites = await UserApiService.getSitesByRegion(depot.regionId);
      setAvailableSites(sites);
    } catch (error) {
      console.error("Failed to fetch available sites:", error);
      showError("Failed to load sites", error instanceof Error ? error.message : "Unknown error");
    } finally {
      hideLoader();
    }
  };

  const filteredSites = deliverySites.filter(site => {
    const matchesSearch = site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.siteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === "all" || (site.active && filterStatus === "active") || (!site.active && filterStatus === "inactive");
    const matchesPriorityFilter = filterPriority === "all" || (site.isPrimary && filterPriority === "primary") || (!site.isPrimary && filterPriority === "secondary");
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPriorityColor = (isPrimary: boolean) => {
    return isPrimary ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  // Action handlers
  const handleAddSite = () => {
    setSelectedSite(null);
    fetchAvailableSites();
    setIsAddDialogOpen(true);
  };

  const handleViewSite = (site: DepotSiteSummary) => {
    setSelectedSite(site);
    setIsViewDialogOpen(true);
  };

  const handleEditSite = (site: DepotSiteSummary) => {
    setSelectedSite(site);
    setIsEditDialogOpen(true);
  };

  const handleRemoveSite = (site: DepotSiteSummary) => {
    setSiteToDelete(site);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!siteToDelete) return;

    try {
      showLoader("Removing delivery site...");
      await UserApiService.deleteDepotSite(siteToDelete.id);
      setDeliverySites(prev => prev.filter(site => site.id !== siteToDelete.id));
      showSuccess("Delivery site removed", "The delivery site has been removed successfully");
      setIsDeleteDialogOpen(false);
      setSiteToDelete(null);
    } catch (error) {
      console.error("Failed to remove delivery site:", error);
      showError("Failed to remove site", error instanceof Error ? error.message : "Unknown error");
    } finally {
      hideLoader();
    }
  };

  const handleSaveSite = async (siteData: CreateDepotSiteRequest | UpdateDepotSiteRequest, isEdit: boolean) => {
    try {
      showLoader(isEdit ? "Updating delivery site..." : "Adding delivery site...");

      if (isEdit && selectedSite) {
        // Update existing site
        const updated = await UserApiService.updateDepotSite(selectedSite.id, siteData as UpdateDepotSiteRequest);

        // Update local state
        setDeliverySites(prev =>
          prev.map(site =>
            site.id === selectedSite.id
              ? {
                ...site,
                distanceKm: updated.distanceKm,
                travelTimeMins: updated.travelTimeMins,
                returnTimeMins: updated.returnTimeMins,
                active: updated.active,
                isPrimary: updated.isPrimary,
                transportRate: updated.transportRate,
                updatedAt: updated.updatedAt
              }
              : site
          )
        );
        showSuccess("Delivery site updated", "The delivery site has been updated successfully");
      } else {
        // Add new site
        console.log("Creating depot site with data:", siteData);
        const created = await UserApiService.createDepotSite(siteData as CreateDepotSiteRequest);

        // Add to local state
        const newSite: DepotSiteSummary = {
          id: created.id,
          depotId: created.depotId,
          depotCode: created.depot.depotCode,
          depotName: created.depot.depotName,
          siteId: created.siteId,
          siteCode: created.site.siteCode,
          siteName: created.site.siteName,
          distanceKm: created.distanceKm,
          travelTimeMins: created.travelTimeMins,
          returnTimeMins: created.returnTimeMins,
          active: created.active,
          isPrimary: created.isPrimary,
          transportRate: created.transportRate,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt
        };

        setDeliverySites(prev => [...prev, newSite]);
        showSuccess("Delivery site added", "The delivery site has been added successfully");
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedSite(null);
    } catch (error) {
      console.error("Failed to save delivery site:", error);
      showError("Failed to save site", error instanceof Error ? error.message : "Unknown error");
    } finally {
      hideLoader();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading delivery sites...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Statistics */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delivery Sites</h3>
            <p className="text-sm text-gray-600">
              Sites that this depot can deliver to, including delivery schedules and requirements.
            </p>
          </div>

          {/* Compact Statistics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{deliverySites.length}</span>
              </div>
              <p className="text-xs text-gray-600">Total Sites</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {deliverySites.filter(s => s.active).length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Active Sites</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <CarSimple size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {deliverySites.length > 0 ? Math.round(deliverySites.reduce((sum, site) => sum + site.distanceKm, 0) / deliverySites.length) : 0}km
                </span>
              </div>
              <p className="text-xs text-gray-600">Avg Distance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-orange-600" />
                <span className="text-lg font-bold text-orange-600">
                  {deliverySites.length > 0 ? Math.round(deliverySites.reduce((sum, site) => sum + site.travelTimeMins, 0) / deliverySites.length) : 0}min
                </span>
              </div>
              <p className="text-xs text-gray-600">Avg Travel Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Funnel size={16} />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddSite} className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add Delivery Site
        </Button>
      </div>

      {/* Sites List */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredSites.map((site) => (
            <div key={site.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{site.siteName}</h4>
                    <p className="text-xs text-gray-600 truncate">({site.siteCode})</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.active)}`}>
                  {site.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{site.distanceKm}km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Travel:</span>
                  <span className="font-medium">{site.travelTimeMins}min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Return:</span>
                  <span className="font-medium">{site.returnTimeMins}min</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(site.isPrimary)}`}>
                    {site.isPrimary ? "Primary" : "Secondary"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">₹{site.transportRate.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleViewSite(site)}
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleEditSite(site)}
                >
                  <PencilSimple size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveSite(site)}
                >
                  <Trash size={12} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery sites found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filters."
                : "Add delivery sites to get started."
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Delivery Site Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedSite(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add New Delivery Site" : "Edit Delivery Site"}
            </DialogTitle>
          </DialogHeader>
          <DeliverySiteForm
            depot={depot}
            site={selectedSite}
            availableSites={availableSites}
            onSave={handleSaveSite}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedSite(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Delivery Site Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Site Details</DialogTitle>
          </DialogHeader>
          {selectedSite && (
            <DeliverySiteDetails
              site={selectedSite}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditSite(selectedSite);
              }}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Remove {siteToDelete?.siteName}?
                </h4>
                <p className="text-sm text-gray-600">
                  Are you sure you want to remove this delivery site? This action cannot be undone and will permanently remove the site from this depot's delivery list.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSiteToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash size={16} className="mr-2" />
                Delete Site
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Delivery Site Form Component
interface DeliverySiteFormProps {
  depot: DepotDetails;
  site: DepotSiteSummary | null;
  availableSites: SiteSummary[];
  onSave: (siteData: CreateDepotSiteRequest | UpdateDepotSiteRequest, isEdit: boolean) => void;
  onCancel: () => void;
}

function DeliverySiteForm({ depot, site, availableSites, onSave, onCancel }: DeliverySiteFormProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<number>(site?.siteId || 0);
  const [formData, setFormData] = useState({
    distanceKm: site?.distanceKm?.toString() || "",
    travelTimeMins: site?.travelTimeMins?.toString() || "",
    returnTimeMins: site?.returnTimeMins?.toString() || "",
    active: site?.active ?? true,
    isPrimary: site?.isPrimary ?? false,
    transportRate: site?.transportRate?.toString() || "",
    metadata: ""
  });

  const selectedSiteData = availableSites.find(s => s.id === selectedSiteId);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSiteId && !site) {
      alert("Please select a site");
      return;
    }

    const baseData: any = {
      distanceKm: parseFloat(formData.distanceKm) || 0,
      travelTimeMins: parseInt(formData.travelTimeMins) || 0,
      returnTimeMins: parseInt(formData.returnTimeMins) || 0,
      active: formData.active,
      isPrimary: formData.isPrimary,
      transportRate: parseFloat(formData.transportRate) || 0
    };

    // Only include metadata if it has a value
    if (formData.metadata && formData.metadata.trim()) {
      baseData.metadata = formData.metadata;
    }

    if (site) {
      // Edit mode
      onSave(baseData, true);
    } else {
      // Add mode
      const createData: CreateDepotSiteRequest = {
        ...baseData,
        depotId: depot.id,
        siteId: selectedSiteId
      };
      onSave(createData, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!site && (
        <div>
          <Label htmlFor="siteSelection">Select Site *</Label>
          <Select value={selectedSiteId.toString()} onValueChange={(value) => setSelectedSiteId(parseInt(value))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a site from available options" />
            </SelectTrigger>
            <SelectContent>
              {availableSites.map((availableSite) => (
                <SelectItem key={availableSite.id} value={availableSite.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{availableSite.siteName}</span>
                    <span className="text-xs text-gray-500">{availableSite.siteCode} • {availableSite.town || 'N/A'}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(selectedSiteData || site) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Site Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Site Name:</span>
              <span className="ml-2 font-medium">{site?.siteName || selectedSiteData?.siteName}</span>
            </div>
            <div>
              <span className="text-gray-600">Site Code:</span>
              <span className="ml-2 font-medium">{site?.siteCode || selectedSiteData?.siteCode}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Town:</span>
              <span className="ml-2 font-medium">{selectedSiteData?.town || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distanceKm">Distance (km) *</Label>
          <Input
            id="distanceKm"
            type="number"
            step="0.01"
            min="0"
            value={formData.distanceKm}
            onChange={(e) => handleInputChange('distanceKm', e.target.value)}
            placeholder="0.0"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="travelTimeMins">Travel Time (mins) *</Label>
          <Input
            id="travelTimeMins"
            type="number"
            min="0"
            value={formData.travelTimeMins}
            onChange={(e) => handleInputChange('travelTimeMins', e.target.value)}
            placeholder="30"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="returnTimeMins">Return Time (mins) *</Label>
          <Input
            id="returnTimeMins"
            type="number"
            min="0"
            value={formData.returnTimeMins}
            onChange={(e) => handleInputChange('returnTimeMins', e.target.value)}
            placeholder="30"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="transportRate">Transport Rate (₹) *</Label>
          <Input
            id="transportRate"
            type="number"
            step="0.01"
            min="0"
            value={formData.transportRate}
            onChange={(e) => handleInputChange('transportRate', e.target.value)}
            placeholder="0.00"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="w-4 h-4 text-primary-custom focus:ring-primary-custom border-gray-300 rounded"
          />
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrimary"
            checked={formData.isPrimary}
            onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
            className="w-4 h-4 text-primary-custom focus:ring-primary-custom border-gray-300 rounded"
          />
          <Label htmlFor="isPrimary" className="cursor-pointer">Primary Site</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90">
          {site ? "Update Site" : "Add Site"}
        </Button>
      </div>
    </form>
  );
}

// Delivery Site Details Component
interface DeliverySiteDetailsProps {
  site: DepotSiteSummary;
  onEdit: () => void;
  onClose: () => void;
}

function DeliverySiteDetails({ site, onEdit, onClose }: DeliverySiteDetailsProps) {
  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPriorityColor = (isPrimary: boolean) => {
    return isPrimary ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{site.siteName}</h3>
          <p className="text-sm text-gray-600">{site.siteCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(site.active)}`}>
            {site.active ? "Active" : "Inactive"}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(site.isPrimary)}`}>
            {site.isPrimary ? "Primary" : "Secondary"}
          </span>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Distance & Time</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium text-gray-900">{site.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Time:</span>
                <span className="font-medium text-gray-900">{site.travelTimeMins} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Time:</span>
                <span className="font-medium text-gray-900">{site.returnTimeMins} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Transport Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Rate:</span>
                <span className="font-medium text-gray-900">₹{site.transportRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(site.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {new Date(site.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit} className="bg-primary-custom hover:bg-primary-custom/90">
          <PencilSimple size={16} className="mr-2" />
          Edit Site
        </Button>
      </div>
    </div>
  );
}
