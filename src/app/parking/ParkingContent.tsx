"use client";

import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
  RowClickedEvent,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { CheckSquare, Circle, Rows, XCircle, Check, X } from "@phosphor-icons/react";
import AddParkingDialog, { Parking } from "../components/AddParkingDialog";
import ParkingDetailsPage, { ParkingDetails } from "../components/ParkingDetailsPage";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ParkingContent() {
  const { sidebarCollapsed } = useAppContext();
  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  const [parkings, setParkings] = useState([
    { id: 1, parkingCode: "PK001", parkingName: "Central Business District Lot", latLong: "34.0522, -118.2437", street: "100 Downtown Plaza", postalCode: "90210", town: "Los Angeles", active: true, priority: "High", isDepot: false },
    { id: 2, parkingCode: "PK002", parkingName: "Airport Long-term Parking", latLong: "33.9425, -118.4081", street: "200 Airport Way", postalCode: "90045", town: "Los Angeles", active: true, priority: "High", isDepot: true },
    { id: 3, parkingCode: "PK003", parkingName: "Port Terminal Vehicle Lot", latLong: "33.7701, -118.1937", street: "300 Harbor Blvd", postalCode: "90731", town: "San Pedro", active: true, priority: "High", isDepot: true },
    { id: 4, parkingCode: "PK004", parkingName: "Industrial Fleet Parking", latLong: "33.8358, -118.3406", street: "400 Industrial Ave", postalCode: "90501", town: "Torrance", active: true, priority: "Medium", isDepot: true },
    { id: 5, parkingCode: "PK005", parkingName: "Beach Visitor Parking", latLong: "33.9850, -118.4695", street: "500 Ocean Front Walk", postalCode: "90291", town: "Venice", active: false, priority: "Low", isDepot: false },
    { id: 6, parkingCode: "PK006", parkingName: "Shopping Center Garage", latLong: "34.0736, -118.4004", street: "600 Rodeo Drive", postalCode: "90210", town: "Beverly Hills", active: true, priority: "Medium", isDepot: false },
    { id: 7, parkingCode: "PK007", parkingName: "University Campus Lot", latLong: "33.8839, -117.8850", street: "700 State College Blvd", postalCode: "92831", town: "Fullerton", active: true, priority: "High", isDepot: false },
    { id: 8, parkingCode: "PK008", parkingName: "Hospital Staff Parking", latLong: "34.1478, -118.1445", street: "800 Medical Center Dr", postalCode: "91101", town: "Pasadena", active: true, priority: "Medium", isDepot: false },
    { id: 9, parkingCode: "PK009", parkingName: "Transit Hub Parking", latLong: "33.8073, -117.9185", street: "900 Transit Way", postalCode: "92802", town: "Anaheim", active: true, priority: "High", isDepot: true },
    { id: 10, parkingCode: "PK010", parkingName: "Tech Campus Garage", latLong: "33.6846, -117.8265", street: "1000 Innovation Dr", postalCode: "92612", town: "Irvine", active: true, priority: "Medium", isDepot: false },
    { id: 11, parkingCode: "PK011", parkingName: "Coastal Recreation Lot", latLong: "33.6553, -117.9988", street: "1100 Beach Blvd", postalCode: "92648", town: "Huntington Beach", active: false, priority: "Low", isDepot: false },
    { id: 12, parkingCode: "PK012", parkingName: "Marina Boat Launch Parking", latLong: "33.9803, -118.4517", street: "1200 Marina Way", postalCode: "90292", town: "Marina Del Rey", active: true, priority: "Medium", isDepot: false },
    { id: 13, parkingCode: "PK013", parkingName: "Convention Center Garage", latLong: "32.7157, -117.1611", street: "1300 Convention Blvd", postalCode: "92101", town: "San Diego", active: true, priority: "High", isDepot: true },
    { id: 14, parkingCode: "PK014", parkingName: "Stadium Event Parking", latLong: "33.1959, -117.3795", street: "1400 Stadium Dr", postalCode: "92054", town: "Oceanside", active: true, priority: "Medium", isDepot: false },
    { id: 15, parkingCode: "PK015", parkingName: "Research Facility Lot", latLong: "32.8470, -117.2730", street: "1500 Research Pkwy", postalCode: "92037", town: "La Jolla", active: true, priority: "Medium", isDepot: false },
    { id: 16, parkingCode: "PK016", parkingName: "Resort Guest Parking", latLong: "33.1581, -117.3506", street: "1600 Resort Blvd", postalCode: "92008", town: "Carlsbad", active: false, priority: "Low", isDepot: false },
    { id: 17, parkingCode: "PK017", parkingName: "Entertainment District Garage", latLong: "34.1022, -118.3406", street: "1700 Hollywood Blvd", postalCode: "90028", town: "Hollywood", active: true, priority: "High", isDepot: false },
    { id: 18, parkingCode: "PK018", parkingName: "Corporate Headquarters Lot", latLong: "34.0211, -118.3965", street: "1800 Corporate Dr", postalCode: "90232", town: "Culver City", active: true, priority: "Medium", isDepot: true },
    { id: 19, parkingCode: "PK019", parkingName: "Tourist Attraction Parking", latLong: "33.0370, -117.2920", street: "1900 Coast Hwy 101", postalCode: "92024", town: "Encinitas", active: true, priority: "Low", isDepot: false },
    { id: 20, parkingCode: "PK020", parkingName: "Government Building Garage", latLong: "32.7341, -117.1449", street: "2000 Government Plaza", postalCode: "92103", town: "San Diego", active: true, priority: "High", isDepot: false },
  ]);

  const handleAddParking = (newParking: Parking) => {
    const parking = {
      ...newParking,
      id: parkings.length + 1,
      latLong: `${newParking.latitude}, ${newParking.longitude}`,
    };
    setParkings([...parkings, parking]);
  };

  const handleRowClick = (event: RowClickedEvent) => {
    setSelectedParking(event.data);
  };

  const handleBackToList = () => {
    setSelectedParking(null);
  };

  const handleSave = (updatedParking: ParkingDetails) => {
    setParkings(prev => 
      prev.map(p => 
        p.id === updatedParking.id ? updatedParking : p
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

          {/* Add New Parking Button */}
          <AddParkingDialog onSave={handleAddParking} />
        </div>

        {/* Parking Table - Takes remaining space */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
          <div style={{ height: "100%", width: "100%" }}>
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
              onRowClicked={handleRowClick}
              rowSelection="single"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
