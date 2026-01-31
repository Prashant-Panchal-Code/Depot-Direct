"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/app/contexts/AppContext";
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
import { CheckSquare, Circle, Rows, XCircle, Check, X } from "@phosphor-icons/react";
import AddDepotDialog, { NewDepot } from "@/app/components/AddDepotDialog";
import DepotDetailsPage, { DepotDetails } from "@/app/components/DepotDetailsPage";
import { UserApiService, Depot } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Extended depot type with region information
interface DepotWithRegion extends Depot {
  regionId?: number;
  regionName?: string;
}

export default function DepotContent() {
  const { sidebarCollapsed } = useAppContext();
  const { canAddEntities, isDataManager } = useDataManagerContext();
  const { selectedRegions, shouldFilterByRegion } = useRegionContext();
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();

  const [selectedDepot, setSelectedDepot] = useState<DepotDetails | null>(null);
  const [showDepotDetails, setShowDepotDetails] = useState(false);
  const [depots, setDepots] = useState<DepotWithRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create a stable reference for selected region IDs
  const selectedRegionIds = useMemo(
    () => selectedRegions.map(r => r.id).sort().join(','),
    [selectedRegions]
  );

  // Fetch depots from API
  useEffect(() => {
    const fetchDepots = async () => {
      setIsLoading(true);
      try {
        let depotsPromise: Promise<DepotWithRegion[]>;

        if (shouldFilterByRegion && selectedRegions.length > 0) {
          // If regions are selected, fetch for each and flatten
          const regionPromises = selectedRegions.map(async (region) => {
            const regionDepots = await UserApiService.getDepotsByRegion(region.id);
            return regionDepots.map(depot => ({
              ...depot,
              regionId: region.id,
              regionName: region.name,
              latLong: depot.latLong || (depot.latitude && depot.longitude ? `${depot.latitude}, ${depot.longitude}` : ""),
              active: depot.active ?? true,
              priority: depot.priority || "Medium",
              isParking: depot.isParking || false
            }));
          });

          depotsPromise = Promise.all(regionPromises).then(regionsDepots => regionsDepots.flat());
        } else {
          // If no regions or global (DataManager viewing all), fetch all
          depotsPromise = UserApiService.getDepots().then(allDepots => {
            return allDepots.map(depot => {
              const regionName = "Unknown"; // We might not have regionName in GET /Depots unless mapped
              return {
                ...depot,
                latLong: depot.latLong || (depot.latitude && depot.longitude ? `${depot.latitude}, ${depot.longitude}` : ""),
                active: depot.active ?? true,
                priority: depot.priority || "Medium",
                isParking: depot.isParking || false,
                regionName
              };
            });
          });
        }

        const depotsResult = await depotsPromise;
        setDepots(depotsResult);
      } catch (error) {
        console.error("Failed to fetch depots:", error);
        setDepots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepots();
  }, [selectedRegionIds, shouldFilterByRegion]);

  const handleAddDepot = async (newDepot: NewDepot) => {
    if (selectedRegions.length === 0 && shouldFilterByRegion) {
      showError("No region selected", "Please select a region first");
      return;
    }

    // Default to first selected region or 0/null
    const regionId = selectedRegions.length > 0 ? selectedRegions[0].id : 0;
    const regionName = selectedRegions.length > 0 ? selectedRegions[0].name : "Unknown";

    try {
      showLoader("Creating new depot...");
      const createdDepot = await UserApiService.addDepot({
        depotCode: newDepot.depotCode,
        depotName: newDepot.depotName,
        regionId: regionId
      });

      // Optimistically add to list
      const depotWithRegion: DepotWithRegion = {
        ...createdDepot,
        regionId: regionId,
        regionName: regionName,
        active: true, // Default
        priority: "Medium", // Default
        isParking: false, // Default
        latLong: "",
        latitude: 0,
        longitude: 0,
      };

      setDepots([...depots, depotWithRegion]);
      showSuccess("Depot created successfully", `${newDepot.depotName} has been added`);
    } catch (error) {
      console.error("Failed to create depot:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create depot";
      showError("Failed to create depot", errorMessage);
    } finally {
      hideLoader();
    }
  };

  const handleRowDoubleClick = async (event: { data: DepotWithRegion }) => {
    try {
      showLoader("Loading depot details...");
      // Fetch full depot data from API
      const fullDepotData = await UserApiService.getDepotById(event.data.id);

      const details: DepotDetails = {
        ...event.data,
        ...fullDepotData,
        // Ensure frontend fields are initialized
        products: [],
        loadings: []
      };

      setSelectedDepot(details);
      setShowDepotDetails(true);
    } catch (error) {
      console.error("Failed to load depot details:", error);
      showError("Error", "Failed to load depot details");
    } finally {
      hideLoader();
    }
  };

  const handleBackFromDetails = () => {
    setShowDepotDetails(false);
    setSelectedDepot(null);
  };

  const handleSaveDepot = (updatedDepot: DepotDetails) => {
    // Update the list
    const updatedDepots = depots.map((depot) =>
      depot.id === updatedDepot.id ? {
        ...depot,
        ...updatedDepot
      } : depot
    );
    setDepots(updatedDepots);
    // Update selected depot to reflect changes in the UI without closing the view
    setSelectedDepot(updatedDepot);
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
          params.value || "Medium"
        )}`}
      >
        {params.value || "Medium"}
      </span>
    );
  };

  // Column Definitions
  const columnDefs: ColDef[] = [
    {
      field: "depotName",
      headerName: "Depot Name",
      flex: 1,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "depotCode",
      headerName: "Depot Code",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Lat/Long",
      field: "latLong",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center' },
      valueGetter: (params) => {
        if (params.data.latLong) return params.data.latLong;
        if (params.data.latitude && params.data.longitude) return `${params.data.latitude}, ${params.data.longitude}`;
        return "";
      }
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
      {showDepotDetails && selectedDepot ? (
        <DepotDetailsPage
          depot={selectedDepot}
          onBack={handleBackFromDetails}
          onSave={handleSaveDepot}
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
                      {depots.length}
                    </span>
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><CheckSquare size={25} weight="duotone" color="green" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-green-600">
                      {depots.filter((d) => d.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Active</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><Circle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {depots.filter((d) => d.priority === "High").length}
                    </span>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><XCircle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {depots.filter((d) => !d.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Inactive</span>
                  </div>
                </div>
              </div>

              {/* Add New Depot Button - Only for Data Managers */}
              {canAddEntities && <AddDepotDialog onSave={handleAddDepot} />}
            </div>

            {/* Depots Table - Takes remaining space */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
              {/* Tip Section */}
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Tip:</span> Double-click on any depot row to view detailed information including basic info, delivery sites, vehicles, and settings.
                </p>
              </div>

              <div style={{ height: "calc(100% - 60px)", width: "100%" }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <AgGridReact
                    rowData={depots}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={20}
                    rowHeight={55}
                    headerHeight={45}
                    suppressMenuHide={true}
                    theme={themeQuartz}
                    onGridReady={(params: GridReadyEvent) => {
                      params.api.sizeColumnsToFit();
                    }}
                    onRowDoubleClicked={handleRowDoubleClick}
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
