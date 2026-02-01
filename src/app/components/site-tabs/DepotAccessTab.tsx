"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Buildings, Plus, MagnifyingGlass, Funnel, Clock, CarSimple, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { UserApiService, DepotSiteSummary, Depot, CreateDepotSiteRequest, UpdateDepotSiteRequest } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";
import { SiteDetails } from "../SiteDetailsModal";

interface DepotAccessTabProps {
  site: SiteDetails;
}

// Helper function to parse error messages from API responses
function parseErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  const message = error instanceof Error ? error.message : String(error);

  try {
    const errorData = JSON.parse(message);
    return errorData.details?.replace(/^"|"$/g, '') || errorData.error || message;
  } catch {
    return message;
  }
}


export default function DepotAccessTab({ site }: DepotAccessTabProps) {
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
  const [selectedDepot, setSelectedDepot] = useState<DepotSiteSummary | null>(null);
  const [depotToDelete, setDepotToDelete] = useState<DepotSiteSummary | null>(null);

  // Data states
  const [depotAccess, setDepotAccess] = useState<DepotSiteSummary[]>([]);
  const [availableDepots, setAvailableDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch depot access for this site
  useEffect(() => {
    const fetchDepotAccess = async () => {
      try {
        setLoading(true);
        const { data: depots, error: apiError } = await UserApiService.getSiteDepots(site.id);

        if (apiError) {
          showError("Failed to load depot access", parseErrorMessage(apiError));
        } else if (depots) {
          setDepotAccess(depots);
        }
      } catch (error) {
        console.error("Failed to fetch depot access:", error);
        showError("Failed to load depot access", parseErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchDepotAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site.id]);

  // Fetch available depots for the region when adding
  const fetchAvailableDepots = async () => {
    // Get region ID from site's regions array
    const regionId = site.regions && site.regions.length > 0 ? site.regions[0].id : null;

    if (!regionId) {
      showError("Region not found", "This site does not have a region assigned");
      return;
    }

    try {
      showLoader("Loading available depots...");
      const depots = await UserApiService.getDepotsByRegion(regionId);
      setAvailableDepots(depots);
    } catch (error) {
      console.error("Failed to fetch available depots:", error);
      showError("Failed to load depots", parseErrorMessage(error));
    } finally {
      hideLoader();
    }
  };

  const filteredDepots = depotAccess.filter(depot => {
    const matchesSearch = depot.depotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.depotCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === "all" || (depot.active && filterStatus === "active") || (!depot.active && filterStatus === "inactive");
    const matchesPriorityFilter = filterPriority === "all" || (depot.isPrimary && filterPriority === "primary") || (!depot.isPrimary && filterPriority === "secondary");
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPriorityColor = (isPrimary: boolean) => {
    return isPrimary ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  // Action handlers
  const handleAddDepot = () => {
    setSelectedDepot(null);
    fetchAvailableDepots();
    setIsAddDialogOpen(true);
  };

  const handleViewDepot = (depot: DepotSiteSummary) => {
    setSelectedDepot(depot);
    setIsViewDialogOpen(true);
  };

  const handleEditDepot = (depot: DepotSiteSummary) => {
    setSelectedDepot(depot);
    setIsEditDialogOpen(true);
  };

  const handleRemoveDepot = (depot: DepotSiteSummary) => {
    setDepotToDelete(depot);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!depotToDelete) return;

    try {
      showLoader("Removing depot access...");
      const { error: apiError } = await UserApiService.deleteDepotSite(depotToDelete.id);

      if (apiError) {
        showError("Failed to remove depot access", parseErrorMessage(apiError));
        hideLoader();
        return;
      }

      setDepotAccess(prev => prev.filter(depot => depot.id !== depotToDelete.id));
      showSuccess("Depot access removed", "The depot access has been removed successfully");
      setIsDeleteDialogOpen(false);
      setDepotToDelete(null);
    } catch (error) {
      console.error("Failed to remove depot access:", error);
      showError("Failed to remove depot access", parseErrorMessage(error));
    } finally {
      hideLoader();
    }
  };

  const handleSaveDepot = async (depotData: CreateDepotSiteRequest | UpdateDepotSiteRequest, isEdit: boolean) => {
    try {
      showLoader(isEdit ? "Updating depot access..." : "Adding depot access...");

      if (isEdit && selectedDepot) {
        // Update existing depot access
        const { data: updated, error: apiError } = await UserApiService.updateDepotSite(selectedDepot.id, depotData as UpdateDepotSiteRequest);

        if (apiError || !updated) {
          showError("Failed to save depot access", parseErrorMessage(apiError || "Unknown error"));
          hideLoader();
          return;
        }

        // Update local state
        setDepotAccess(prev =>
          prev.map(depot =>
            depot.id === selectedDepot.id
              ? {
                ...depot,
                distanceKm: updated.distanceKm,
                travelTimeMins: updated.travelTimeMins,
                returnTimeMins: updated.returnTimeMins,
                active: updated.active,
                isPrimary: updated.isPrimary,
                transportRate: updated.transportRate,
                updatedAt: updated.updatedAt
              }
              : depot
          )
        );
        showSuccess("Depot access updated", "The depot access has been updated successfully");
      } else {
        // Add new depot access
        console.log("Creating depot site with data:", depotData);
        const { data: created, error: apiError } = await UserApiService.createDepotSite(depotData as CreateDepotSiteRequest);

        if (apiError || !created) {
          showError("Failed to save depot access", parseErrorMessage(apiError || "Unknown error"));
          hideLoader();
          return;
        }

        // Add to local state
        const newDepot: DepotSiteSummary = {
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

        setDepotAccess(prev => [...prev, newDepot]);
        showSuccess("Depot access added", "The depot access has been added successfully");
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedDepot(null);
    } catch (error) {
      console.error("Failed to save depot access:", error);
      const errorMessage = parseErrorMessage(error);
      showError("Failed to save depot access", errorMessage);
    } finally {
      hideLoader();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading depot access...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Statistics */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Depot Access</h3>
            <p className="text-sm text-gray-600">
              Depots that can deliver to this site, including delivery schedules and requirements.
            </p>
          </div>

          {/* Compact Statistics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Buildings size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{depotAccess.length}</span>
              </div>
              <p className="text-xs text-gray-600">Total Depots</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {depotAccess.filter(d => d.active).length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Active Depots</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <CarSimple size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {depotAccess.length > 0 ? Math.round(depotAccess.reduce((sum, depot) => sum + depot.distanceKm, 0) / depotAccess.length) : 0}km
                </span>
              </div>
              <p className="text-xs text-gray-600">Avg Distance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-orange-600" />
                <span className="text-lg font-bold text-orange-600">
                  {depotAccess.length > 0 ? Math.round(depotAccess.reduce((sum, depot) => sum + depot.travelTimeMins, 0) / depotAccess.length) : 0}min
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
              placeholder="Search depots..."
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
        <Button onClick={handleAddDepot} className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add Depot Access
        </Button>
      </div>

      {/* Depots List */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredDepots.map((depot) => (
            <div key={depot.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <Buildings size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{depot.depotName}</h4>
                    <p className="text-xs text-gray-600 truncate">({depot.depotCode})</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(depot.active)}`}>
                  {depot.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{depot.distanceKm}km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Travel:</span>
                  <span className="font-medium">{depot.travelTimeMins}min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Return:</span>
                  <span className="font-medium">{depot.returnTimeMins}min</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(depot.isPrimary)}`}>
                    {depot.isPrimary ? "Primary" : "Secondary"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">₹{depot.transportRate.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleViewDepot(depot)}
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleEditDepot(depot)}
                >
                  <PencilSimple size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-6 px-1 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveDepot(depot)}
                >
                  <Trash size={12} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDepots.length === 0 && (
          <div className="text-center py-12">
            <Buildings size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No depot access found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filters."
                : "Add depot access to get started."
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Depot Access Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedDepot(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add New Depot Access" : "Edit Depot Access"}
            </DialogTitle>
          </DialogHeader>
          <DepotAccessForm
            site={site}
            depot={selectedDepot}
            availableDepots={availableDepots}
            onSave={handleSaveDepot}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedDepot(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Depot Access Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Depot Access Details</DialogTitle>
          </DialogHeader>
          {selectedDepot && (
            <DepotAccessDetails
              depot={selectedDepot}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditDepot(selectedDepot);
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
                  Remove {depotToDelete?.depotName}?
                </h4>
                <p className="text-sm text-gray-600">
                  Are you sure you want to remove this depot access? This action cannot be undone and will permanently remove the depot from this site's access list.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDepotToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash size={16} className="mr-2" />
                Delete Depot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Depot Access Form Component
interface DepotAccessFormProps {
  site: SiteDetails;
  depot: DepotSiteSummary | null;
  availableDepots: Depot[];
  onSave: (depotData: CreateDepotSiteRequest | UpdateDepotSiteRequest, isEdit: boolean) => void;
  onCancel: () => void;
}

function DepotAccessForm({ site, depot, availableDepots, onSave, onCancel }: DepotAccessFormProps) {
  const [selectedDepotId, setSelectedDepotId] = useState<number>(depot?.depotId || 0);
  const [formData, setFormData] = useState({
    distanceKm: depot?.distanceKm?.toString() || "",
    travelTimeMins: depot?.travelTimeMins?.toString() || "",
    returnTimeMins: depot?.returnTimeMins?.toString() || "",
    active: depot?.active ?? true,
    isPrimary: depot?.isPrimary ?? false,
    transportRate: depot?.transportRate?.toString() || "",
    metadata: ""
  });

  const selectedDepotData = availableDepots.find(d => d.id === selectedDepotId);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDepotId && !depot) {
      alert("Please select a depot");
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

    if (depot) {
      // Edit mode
      onSave(baseData, true);
    } else {
      // Add mode
      const createData: CreateDepotSiteRequest = {
        ...baseData,
        depotId: selectedDepotId,
        siteId: site.id
      };
      onSave(createData, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!depot && (
        <div>
          <Label htmlFor="depotSelection">Select Depot *</Label>
          <Select value={selectedDepotId.toString()} onValueChange={(value) => setSelectedDepotId(parseInt(value))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a depot from available options" />
            </SelectTrigger>
            <SelectContent>
              {availableDepots.map((availableDepot) => (
                <SelectItem key={availableDepot.id} value={availableDepot.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{availableDepot.depotName}</span>
                    <span className="text-xs text-gray-500">{availableDepot.depotCode} • {availableDepot.town || 'N/A'}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(selectedDepotData || depot) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Depot Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Depot Name:</span>
              <span className="ml-2 font-medium">{depot?.depotName || selectedDepotData?.depotName}</span>
            </div>
            <div>
              <span className="text-gray-600">Depot Code:</span>
              <span className="ml-2 font-medium">{depot?.depotCode || selectedDepotData?.depotCode}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Town:</span>
              <span className="ml-2 font-medium">{selectedDepotData?.town || 'N/A'}</span>
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
          <Label htmlFor="isPrimary" className="cursor-pointer">Primary Depot</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90">
          {depot ? "Update Depot" : "Add Depot"}
        </Button>
      </div>
    </form>
  );
}

// Depot Access Details Component
interface DepotAccessDetailsProps {
  depot: DepotSiteSummary;
  onEdit: () => void;
  onClose: () => void;
}

function DepotAccessDetails({ depot, onEdit, onClose }: DepotAccessDetailsProps) {
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
          <h3 className="text-xl font-semibold text-gray-900">{depot.depotName}</h3>
          <p className="text-sm text-gray-600">{depot.depotCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(depot.active)}`}>
            {depot.active ? "Active" : "Inactive"}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(depot.isPrimary)}`}>
            {depot.isPrimary ? "Primary" : "Secondary"}
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
                <span className="font-medium text-gray-900">{depot.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Time:</span>
                <span className="font-medium text-gray-900">{depot.travelTimeMins} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Time:</span>
                <span className="font-medium text-gray-900">{depot.returnTimeMins} minutes</span>
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
                <span className="font-medium text-gray-900">₹{depot.transportRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(depot.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {new Date(depot.updatedAt).toLocaleDateString()}
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
          Edit Depot
        </Button>
      </div>
    </div>
  );
}
