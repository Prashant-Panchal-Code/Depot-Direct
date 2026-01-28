"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/app/contexts/AppContext";
import { UserApiService } from "@/lib/api/user";
import { useDataManagerContext, useRegionContext } from "@/contexts/RoleBasedContext";

import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { CheckSquare, Circle, Rows, XCircle } from "@phosphor-icons/react";
import AddSiteDialog, { NewSite } from "@/app/components/AddSiteDialog";
import { Site } from "@/lib/api/user";
import { SiteDetails } from "@/app/components/SiteDetailsModal";
import SiteDetailsPage from "@/app/components/SiteDetailsPage";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Extended site type with region information
interface SiteWithRegion extends Site {
  regionId: number;
  regionName: string;
}

export default function SitesContent() {
  const { sidebarCollapsed } = useAppContext();
  const { canAddEntities, isDataManager, companyId } = useDataManagerContext();
  const { selectedRegions, shouldFilterByRegion } = useRegionContext();
  const [selectedSite, setSelectedSite] = useState<SiteDetails | null>(null);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  const [sites, setSites] = useState<SiteWithRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sites from API
  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        // Define site promise
        let sitesPromise: Promise<SiteWithRegion[]>;

        // Only fetch sites if a region is selected
        if (selectedRegions.length > 0) {
          // Fetch sites for all selected regions
          const regionPromises = selectedRegions.map(async (region) => {
            const sites = await UserApiService.getSitesByRegion(region.id);
            // Map sites to SiteWithRegion immediately to preserve region context
            return sites.map((summary): SiteWithRegion => ({
              ...summary,
              // Map known fields
              latitude: 0,
              longitude: 0,
              latLong: "",
              street: "",
              postalCode: "",
              contactPerson: "",
              phone: "",
              email: "",
              operatingHours: "",
              depotId: 0,
              deliveryStopped: false,
              pumpedRequired: false,
              metadata: "{}",
              createdBy: 0,
              lastUpdatedBy: 0,
              deletedAt: "",

              // Construct nested objects with available info
              country: {
                id: summary.countryId,
                name: summary.countryName,
                isoCode: "",
                metadata: "{}",
                createdAt: "",
                updatedAt: "",
                createdBy: 0,
                lastUpdatedBy: 0
              },
              company: {
                id: summary.companyId,
                name: summary.companyName,
                companyCode: "",
                countryId: summary.countryId,
                description: "",
                metadata: "{}",
                createdBy: 0,
                lastUpdatedBy: 0,
                createdAt: "",
                updatedAt: ""
              },
              regions: [], // We don't have this in summary

              // Extra props for Grid
              regionId: region.id,
              regionName: region.name,
              shortcode: summary.siteCode // fallback
            }));
          });

          sitesPromise = Promise.all(regionPromises).then(regionsSites => regionsSites.flat());

        } else {
          // If no regions selected (e.g. Data Manager viewing all, or initial state), fetch ALL sites
          sitesPromise = UserApiService.getSites().then(allSitesData => {
            return allSitesData.map(site => {
              const primaryRegion = site.regions && site.regions.length > 0 ? site.regions[0] : null;
              return {
                ...site,
                regionId: primaryRegion?.id || 0,
                regionName: primaryRegion?.name || "Unknown",
                // Ensure compatibility
                active: site.active,
                priority: site.priority || "Medium",
              };
            });
          });
        }

        const sitesResult = await sitesPromise;
        setSites(sitesResult);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
        setSites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, [selectedRegions]); // Re-run when selected regions change


  const handleAddSite = async (newSite: NewSite) => {
    // For new site, user current selected region
    if (selectedRegions.length === 0) {
      alert("Please select a region first");
      return;
    }

    const regionId = selectedRegions[0].id;

    try {
      // Call actual API
      const newSiteResponse = await UserApiService.createSite({
        siteCode: newSite.siteCode,
        siteName: newSite.siteName,
        regionId: regionId
      });

      // Optimistically update UI using the response from API
      // We need to map the API response to our SiteWithRegion type

      const defaultRegionName = selectedRegions[0].name;

      // The API returns the site with all fields, so we use them
      // We just need to add the region props for the grid to display correctly if it relies on them
      const site: SiteWithRegion = {
        ...newSiteResponse,
        regionId: regionId,
        regionName: defaultRegionName
      };

      setSites([...sites, site]);

    } catch (error) {
      console.error("Failed to create site", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create site";
      alert(errorMessage);
    }
  };

  const handleRowDoubleClick = (data: Site) => {
    const siteDetails: SiteDetails = {
      ...data,
      id: data.id ?? 0,
      latLong: data.latLong || `${data.latitude}, ${data.longitude}`,
      contactPerson: data.contactPerson || "",
      phone: data.phone || "",
      email: data.email || "",
      depotId: data.depotId,
      deliveryStopped: data.deliveryStopped || false,
      pumpedRequired: data.pumpedRequired || false,
    };
    setSelectedSite(siteDetails);
    setShowSiteDetails(true);
  };

  const handleBackToSites = () => {
    setShowSiteDetails(false);
    setSelectedSite(null);
  };

  const handleSaveSite = (updatedSite: SiteDetails) => {
    // Convert SiteDetails back to Site format for the sites array
    const updatedSiteData: SiteWithRegion = {
      // Spread existing properties to keep what's not in the form
      ...sites.find(s => s.id === updatedSite.id)!,

      siteCode: updatedSite.siteCode,
      siteName: updatedSite.siteName,
      // Parse lat/long
      latitude: parseFloat(updatedSite.latLong?.split(',')[0]?.trim() || "0"),
      longitude: parseFloat(updatedSite.latLong?.split(',')[1]?.trim() || "0"),
      latLong: updatedSite.latLong || "",

      street: updatedSite.street,
      postalCode: updatedSite.postalCode,
      active: updatedSite.active,
      priority: updatedSite.priority,
      town: updatedSite.town || "",
      contactPerson: updatedSite.contactPerson || "",
      phone: updatedSite.phone || "",
      email: updatedSite.email || "",
      depotId: updatedSite.depotId || 0, // number in new interface

      // Region info is not usually updated here but preserved
      regionId: sites.find(s => s.id === updatedSite.id)?.regionId || 1,
      regionName: sites.find(s => s.id === updatedSite.id)?.regionName || "West Coast",
    };

    setSites(sites.map((site: SiteWithRegion) =>
      site.id === updatedSite.id ? updatedSiteData : site
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Status Cell Renderer for Active/Inactive
  const StatusCellRenderer = (params: ICellRendererParams) => {
    const isActive = params.value;
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  // Priority Cell Renderer
  const PriorityCellRenderer = (params: ICellRendererParams) => {
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
          params.value
        )}`}
      >
        {params.value}
      </span>
    );
  };

  // Column Definitions
  const columnDefs: ColDef[] = [
    {
      field: "siteName",
      headerName: "Site Name",
      flex: 1,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "siteCode",
      headerName: "Site Code",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Lat/Long",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center' },
      valueGetter: (params) => `${params.data?.latitude}, ${params.data?.longitude}`,
    },
    {
      field: "street",
      headerName: "Street",
      flex: 2,
      minWidth: 150,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "postalCode",
      headerName: "Postal Code",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "town",
      headerName: "Town",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      minWidth: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      minWidth: 100,
      cellRenderer: PriorityCellRenderer,
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <>
      {showSiteDetails && selectedSite ? (
        <SiteDetailsPage
          site={selectedSite}
          onBack={handleBackToSites}
          onSave={handleSaveSite}
        />
      ) : (
        <main
          className={`pt-20 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"
            }`}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Header with Stats and Add Button */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              {/* Stats Cards - Same height as button */}
              <div className="flex gap-3">
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><Rows size={25} color="#02589d" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">
                      {sites.length}
                    </span>
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><CheckSquare size={25} weight="duotone" color="green" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-green-600">
                      {sites.filter((s) => s.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Active</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><Circle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {sites.filter((s) => s.priority === "High").length}
                    </span>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><XCircle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {sites.filter((s) => !s.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Inactive</span>
                  </div>
                </div>
              </div>

              {/* Add New Site Button - Only for Data Managers */}
              {canAddEntities && <AddSiteDialog onSave={handleAddSite} />}
            </div>

            {/* Sites Table - Takes remaining space */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
              {/* Tip Section */}
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Tip:</span> Double-click on any site row to view detailed information including tank details, delivery schedules, and site history.
                </p>
              </div>

              <div style={{ height: "calc(100% - 60px)", width: "100%" }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <AgGridReact
                    rowData={sites}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={20}
                    rowHeight={55}
                    headerHeight={45}
                    suppressMenuHide={true}
                    theme={themeQuartz}
                    onRowDoubleClicked={(event) => handleRowDoubleClick(event.data)}
                    onGridReady={(params: GridReadyEvent) => {
                      params.api.sizeColumnsToFit();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
