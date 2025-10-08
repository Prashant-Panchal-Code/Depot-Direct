"use client";

import { useState, useEffect } from "react";
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
import AddParkingDialog, { Parking } from "@/app/components/AddParkingDialog";
import ParkingDetailsPage, { ParkingDetails } from "@/app/components/ParkingDetailsPage";

// Extended parking type with region information
interface ParkingWithRegion {
  id: number;
  parkingCode: string;
  parkingName: string;
  latLong: string;
  latitude?: string;
  longitude?: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  isDepot: boolean;
  regionId: number;
  regionName: string;
}

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ParkingContent() {
  const { sidebarCollapsed } = useAppContext();
  const { canAddEntities, isDataManager, companyId } = useDataManagerContext();
  const { selectedRegions, shouldFilterByRegion } = useRegionContext();
  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  // All parking data with regions
  const allParkings = [
    { id: 1, parkingCode: "PK001", parkingName: "Central Business District Lot", latLong: "34.0522, -118.2437", street: "100 Downtown Plaza", postalCode: "90210", town: "Los Angeles", active: true, priority: "High", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 2, parkingCode: "PK002", parkingName: "Airport Long-term Parking", latLong: "33.9425, -118.4081", street: "200 Airport Way", postalCode: "90045", town: "Los Angeles", active: true, priority: "High", isDepot: true, regionId: 1, regionName: "West Coast" },
    { id: 3, parkingCode: "PK003", parkingName: "Port Terminal Vehicle Lot", latLong: "33.7701, -118.1937", street: "300 Harbor Blvd", postalCode: "90731", town: "San Pedro", active: true, priority: "High", isDepot: true, regionId: 1, regionName: "West Coast" },
    { id: 4, parkingCode: "PK004", parkingName: "Industrial Fleet Parking", latLong: "33.8358, -118.3406", street: "400 Industrial Ave", postalCode: "90501", town: "Torrance", active: true, priority: "Medium", isDepot: true, regionId: 1, regionName: "West Coast" },
    { id: 5, parkingCode: "PK005", parkingName: "Beach Visitor Parking", latLong: "33.9850, -118.4695", street: "500 Ocean Front Walk", postalCode: "90291", town: "Venice", active: false, priority: "Low", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 6, parkingCode: "PK006", parkingName: "Shopping Center Garage", latLong: "34.0736, -118.4004", street: "600 Rodeo Drive", postalCode: "90210", town: "Beverly Hills", active: true, priority: "Medium", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 7, parkingCode: "PK007", parkingName: "University Campus Lot", latLong: "33.8839, -117.8850", street: "700 State College Blvd", postalCode: "92831", town: "Fullerton", active: true, priority: "High", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 8, parkingCode: "PK008", parkingName: "Hospital Staff Parking", latLong: "34.1478, -118.1445", street: "800 Medical Center Dr", postalCode: "91101", town: "Pasadena", active: true, priority: "Medium", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 9, parkingCode: "PK009", parkingName: "Transit Hub Parking", latLong: "33.8073, -117.9185", street: "900 Transit Way", postalCode: "92802", town: "Anaheim", active: true, priority: "High", isDepot: true, regionId: 1, regionName: "West Coast" },
    { id: 10, parkingCode: "PK010", parkingName: "Tech Campus Garage", latLong: "33.6846, -117.8265", street: "1000 Innovation Dr", postalCode: "92612", town: "Irvine", active: true, priority: "Medium", isDepot: false, regionId: 1, regionName: "West Coast" },
    { id: 11, parkingCode: "PK011", parkingName: "East Side Distribution Hub", latLong: "40.7128, -74.0060", street: "1100 Industrial Blvd", postalCode: "10001", town: "New York", active: true, priority: "High", isDepot: true, regionId: 2, regionName: "East Coast" },
    { id: 12, parkingCode: "PK012", parkingName: "Downtown Corporate Parking", latLong: "40.7589, -73.9851", street: "1200 Madison Ave", postalCode: "10028", town: "New York", active: true, priority: "Medium", isDepot: false, regionId: 2, regionName: "East Coast" },
    { id: 13, parkingCode: "PK013", parkingName: "Port Authority Vehicle Lot", latLong: "40.7614, -73.9776", street: "1300 Port Authority", postalCode: "10018", town: "New York", active: true, priority: "High", isDepot: true, regionId: 2, regionName: "East Coast" },
    { id: 14, parkingCode: "PK014", parkingName: "Brooklyn Logistics Center", latLong: "40.6782, -73.9442", street: "1400 Atlantic Ave", postalCode: "11238", town: "Brooklyn", active: true, priority: "Medium", isDepot: true, regionId: 2, regionName: "East Coast" },
    { id: 15, parkingCode: "PK015", parkingName: "Queens Distribution Point", latLong: "40.7282, -73.7949", street: "1500 Northern Blvd", postalCode: "11354", town: "Queens", active: true, priority: "Medium", isDepot: false, regionId: 2, regionName: "East Coast" },
    { id: 16, parkingCode: "PK016", parkingName: "Central Texas Hub", latLong: "30.2672, -97.7431", street: "1600 Interstate 35", postalCode: "78701", town: "Austin", active: true, priority: "High", isDepot: true, regionId: 3, regionName: "Central" },
    { id: 17, parkingCode: "PK017", parkingName: "Dallas Freight Terminal", latLong: "32.7767, -96.7970", street: "1700 Commerce St", postalCode: "75201", town: "Dallas", active: true, priority: "High", isDepot: true, regionId: 3, regionName: "Central" },
    { id: 18, parkingCode: "PK018", parkingName: "Houston Port Parking", latLong: "29.7604, -95.3698", street: "1800 Ship Channel", postalCode: "77020", town: "Houston", active: true, priority: "Medium", isDepot: true, regionId: 3, regionName: "Central" },
    { id: 19, parkingCode: "PK019", parkingName: "San Antonio Depot", latLong: "29.4241, -98.4936", street: "1900 Military Dr", postalCode: "78211", town: "San Antonio", active: true, priority: "Low", isDepot: true, regionId: 3, regionName: "Central" },
    { id: 20, parkingCode: "PK020", parkingName: "Oklahoma City Terminal", latLong: "35.4676, -97.5164", street: "2000 NW Expressway", postalCode: "73112", town: "Oklahoma City", active: true, priority: "Medium", isDepot: false, regionId: 3, regionName: "Central" },
  ];

  // Filter parkings based on role and selected regions
  const getFilteredParkings = () => {
    if (shouldFilterByRegion && selectedRegions.length > 0) {
      // Filter by selected regions for non-Data Manager roles
      const selectedRegionIds = selectedRegions.map(r => r.id);
      return allParkings.filter(parking => selectedRegionIds.includes(parking.regionId));
    }
    // Data Managers see all data (filtered by company in real implementation)
    return allParkings;
  };

  const [parkings, setParkings] = useState<ParkingWithRegion[]>(getFilteredParkings());

  // Update parkings when selected regions change
  useEffect(() => {
    setParkings(getFilteredParkings());
  }, [selectedRegions, shouldFilterByRegion]);

  const handleAddParking = (newParking: Parking) => {
    // For new parking, assign to first selected region or default region
    const defaultRegionId = shouldFilterByRegion && selectedRegions.length > 0 
      ? selectedRegions[0].id 
      : 1; // Default to first region
    const defaultRegionName = shouldFilterByRegion && selectedRegions.length > 0 
      ? selectedRegions[0].name 
      : "West Coast";
      
    const parking = {
      ...newParking,
      id: allParkings.length + parkings.length + 1,
      latLong: `${newParking.latitude}, ${newParking.longitude}`,
      regionId: defaultRegionId,
      regionName: defaultRegionName,
    };
    setParkings([...parkings, parking]);
  };

  const handleRowDoubleClick = (event: { data: ParkingDetails }) => {
    setSelectedParking(event.data);
  };

  const handleBackToList = () => {
    setSelectedParking(null);
  };

  const handleSave = (updatedParking: ParkingDetails) => {
    setParkings(prev => 
      prev.map(p => 
        p.id === updatedParking.id ? {
          ...updatedParking,
          regionId: p.regionId,
          regionName: p.regionName
        } as ParkingWithRegion : p
      )
    );
    setSelectedParking(null);
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
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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

  // Is Depot Cell Renderer
  const IsDepotCellRenderer = (params: ICellRendererParams) => {
    const isDepot = params.value;
    return (
      <div className="flex items-center justify-center h-full">
        {isDepot ? (
          <Check size={20} color="green" weight="bold" />
        ) : (
          <X size={20} color="red" weight="bold" />
        )}
      </div>
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
    {
      field: "isDepot",
      headerName: "Is Depot",
      flex: 1,
      minWidth: 100,
      cellRenderer: IsDepotCellRenderer,
      cellStyle: { textAlign: 'center' },
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // If a parking is selected, show details page
  if (selectedParking) {
    return (
      <ParkingDetailsPage
        parking={selectedParking}
        onBack={handleBackToList}
        onSave={handleSave}
      />
    );
  }

  return (
    <main
      className={`pt-20 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
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
              <span className="text-base"><Circle size={25} color="red" weight="duotone" /></span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-red-600">
                  {parkings.filter((p) => p.priority === "High").length}
                </span>
                <span className="text-xs text-gray-600">High</span>
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
              rowSelection="single"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
