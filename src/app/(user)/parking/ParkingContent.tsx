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
import AddParkingDialog, { NewParking } from "@/app/components/AddParkingDialog";
import ParkingDetailsPage, { ParkingDetails } from "@/app/components/ParkingDetailsPage";
import { UserApiService, ParkingSummary, Parking } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Extended parking type with regional info if needed (mapped from ParkingSummary)
interface ParkingWithRegion extends ParkingSummary {
  regionId?: number;
  regionName?: string;
}

export default function ParkingContent() {
  const { sidebarCollapsed } = useAppContext();
  const { canAddEntities, isDataManager } = useDataManagerContext();
  const { selectedRegions, shouldFilterByRegion } = useRegionContext();
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();

  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  const [showParkingDetails, setShowParkingDetails] = useState(false);
  const [parkings, setParkings] = useState<ParkingWithRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create a stable reference for selected region IDs
  const selectedRegionIds = useMemo(
    () => selectedRegions.map(r => r.id).sort().join(','),
    [selectedRegions]
  );

  // Fetch parkings from API
  useEffect(() => {
    const fetchParkings = async () => {
      setIsLoading(true);
      try {
        let parkingsPromise: Promise<ParkingWithRegion[]>;

        if (shouldFilterByRegion && selectedRegions.length > 0) {
          // If regions are selected, fetch for each and flatten
          const regionPromises = selectedRegions.map(async (region) => {
            const regionParkings = await UserApiService.getParkingsByRegion(region.id);
            return regionParkings.map(parking => ({
              ...parking,
              regionId: region.id,
              regionName: region.name,
              latLong: parking.latLong || (parking.latitude && parking.longitude ? `${parking.latitude}, ${parking.longitude}` : ""),
            }));
          });

          parkingsPromise = Promise.all(regionPromises).then(regionsParkings => regionsParkings.flat());
        } else {
          // If no regions or global (DataManager viewing all), we might need a getParkings() but the user only provided by-region
          // For now, let's assume we fetch for all regions we have or just an empty list if none selected
          parkingsPromise = Promise.resolve([]);
        }

        const parkingsResult = await parkingsPromise;
        setParkings(parkingsResult);
      } catch (error) {
        console.error("Failed to fetch parkings:", error);
        setParkings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkings();
  }, [selectedRegionIds, shouldFilterByRegion]);

  const handleAddParking = async (newParking: NewParking) => {
    if (selectedRegions.length === 0 && shouldFilterByRegion) {
      showError("No region selected", "Please select a region first");
      return;
    }

    // Default to first selected region
    const regionId = selectedRegions.length > 0 ? selectedRegions[0].id : 0;
    const regionName = selectedRegions.length > 0 ? selectedRegions[0].name : "Unknown";

    try {
      showLoader("Creating new parking...");
      const createdParking = await UserApiService.createParking({
        parkingCode: newParking.parkingCode,
        parkingName: newParking.parkingName,
        regionId: regionId
      });

      // Optimistically add to list (mapped to ParkingSummary style)
      const parkingWithRegion: ParkingWithRegion = {
        id: createdParking.id,
        parkingCode: createdParking.parkingCode,
        parkingName: createdParking.parkingName,
        town: createdParking.town,
        active: createdParking.active,
        parkingSpaces: createdParking.parkingSpaces,
        latitude: createdParking.latitude,
        longitude: createdParking.longitude,
        latLong: createdParking.latLong,
        street: createdParking.street,
        postalCode: createdParking.postalCode,
        companyId: createdParking.companyId,
        companyName: createdParking.company?.name || "",
        countryId: createdParking.countryId,
        countryName: createdParking.country?.name || "",
        createdAt: createdParking.createdAt,
        updatedAt: createdParking.updatedAt,
        regionId: regionId,
        regionName: regionName,
      };

      setParkings([...parkings, parkingWithRegion]);
      showSuccess("Parking created successfully", `${newParking.parkingName} has been added`);
    } catch (error) {
      console.error("Failed to create parking:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create parking";
      showError("Failed to create parking", errorMessage);
    } finally {
      hideLoader();
    }
  };

  const handleRowDoubleClick = async (event: { data: ParkingWithRegion }) => {
    try {
      showLoader("Loading parking details...");
      // Fetch full parking data from API
      const fullParkingData = await UserApiService.getParkingById(event.data.id);

      setSelectedParking(fullParkingData as unknown as ParkingDetails);
      setShowParkingDetails(true);
    } catch (error) {
      console.error("Failed to load parking details:", error);
      showError("Error", "Failed to load parking details");
    } finally {
      hideLoader();
    }
  };

  const handleBackFromDetails = () => {
    setShowParkingDetails(false);
    setSelectedParking(null);
  };

  const handleSaveParking = async (updatedParking: ParkingDetails) => {
    try {
      showLoader("Saving parking details...");
      // Call API to update parking
      const savedParking = await UserApiService.updateParking(updatedParking.id, updatedParking);

      // Update the list
      const updatedParkings = parkings.map((parking) =>
        parking.id === savedParking.id ? {
          ...parking,
          ...savedParking,
          // Preserve region info if it exists
          regionId: parking.regionId,
          regionName: parking.regionName
        } : parking
      );

      setParkings(updatedParkings as ParkingWithRegion[]);

      // Update selected parking to reflect changes
      setSelectedParking(savedParking as unknown as ParkingDetails);
      showSuccess("Success", "Parking details updated successfully");
    } catch (error) {
      console.error("Failed to update parking:", error);
      showError("Error", "Failed to update parking details");
    } finally {
      hideLoader();
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

  // Column Definitions
  const columnDefs: ColDef[] = [
    {
      field: "parkingName",
      headerName: "Parking Name",
      flex: 1,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "parkingCode",
      headerName: "Parking Code",
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
      field: "parkingSpaces",
      headerName: "Spaces",
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value?.toString() || "0",
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
      {showParkingDetails && selectedParking ? (
        <ParkingDetailsPage
          parking={selectedParking}
          onBack={handleBackFromDetails}
          onSave={handleSaveParking}
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
                      {parkings.length}
                    </span>
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><CheckSquare size={25} weight="duotone" color="green" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-green-600">
                      {parkings.filter((p) => p.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Active</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><XCircle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {parkings.filter((p) => !p.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Inactive</span>
                  </div>
                </div>
              </div>

              {/* Add New Parking Button - Only for Data Managers */}
              {canAddEntities && <AddParkingDialog onSave={handleAddParking} />}
            </div>

            {/* Parking Table - Takes remaining space */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
              {/* Tip Section */}
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Tip:</span> Double-click on any parking row to view detailed information including basic info and settings.
                </p>
              </div>

              <div style={{ height: "calc(100% - 60px)", width: "100%" }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <AgGridReact
                    rowData={parkings}
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
