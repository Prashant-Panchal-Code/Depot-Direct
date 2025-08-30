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
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { CheckSquare, Circle, Rows, XCircle, Check, X } from "@phosphor-icons/react";
import AddDepotDialog, { Depot } from "../components/AddDepotDialog";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DepotContent() {
  const { sidebarCollapsed } = useAppContext();
  const [depots, setDepots] = useState([
    { id: 1, depotCode: "DP001", depotName: "Main Distribution Center", latLong: "34.0522, -118.2437", street: "100 Industrial Blvd", postalCode: "90210", town: "Los Angeles", active: true, priority: "High", isParking: false },
    { id: 2, depotCode: "DP002", depotName: "Port Terminal Depot", latLong: "33.7701, -118.1937", street: "500 Harbor Drive", postalCode: "90731", town: "San Pedro", active: true, priority: "High", isParking: true },
    { id: 3, depotCode: "DP003", depotName: "Airport Fuel Terminal", latLong: "33.9425, -118.4081", street: "200 Airport Way", postalCode: "90045", town: "Los Angeles", active: true, priority: "High", isParking: true },
    { id: 4, depotCode: "DP004", depotName: "Orange County Hub", latLong: "33.8073, -117.9185", street: "300 Commerce Dr", postalCode: "92802", town: "Anaheim", active: true, priority: "Medium", isParking: false },
    { id: 5, depotCode: "DP005", depotName: "Valley Distribution", latLong: "34.1684, -118.3731", street: "400 Valley Blvd", postalCode: "91367", town: "Woodland Hills", active: false, priority: "Low", isParking: false },
    { id: 6, depotCode: "DP006", depotName: "Coastal Storage Facility", latLong: "34.0059, -118.4989", street: "600 Ocean Ave", postalCode: "90401", town: "Santa Monica", active: true, priority: "Medium", isParking: false },
    { id: 7, depotCode: "DP007", depotName: "Industrial Park Depot", latLong: "33.8358, -118.3406", street: "700 Manufacturing St", postalCode: "90501", town: "Torrance", active: true, priority: "High", isParking: true },
    { id: 8, depotCode: "DP008", depotName: "South Bay Terminal", latLong: "33.8847, -118.4109", street: "800 Terminal Way", postalCode: "90266", town: "Manhattan Beach", active: true, priority: "Medium", isParking: false },
    { id: 9, depotCode: "DP009", depotName: "Long Beach Facility", latLong: "33.7701, -118.1937", street: "900 Port Blvd", postalCode: "90802", town: "Long Beach", active: true, priority: "High", isParking: false },
    { id: 10, depotCode: "DP010", depotName: "Irvine Tech Depot", latLong: "33.6846, -117.8265", street: "1000 Innovation Dr", postalCode: "92612", town: "Irvine", active: true, priority: "Medium", isParking: false },
    { id: 11, depotCode: "DP011", depotName: "Mission Viejo Storage", latLong: "33.6000, -117.6720", street: "1100 Storage Ln", postalCode: "92692", town: "Mission Viejo", active: false, priority: "Low", isParking: false },
    { id: 12, depotCode: "DP012", depotName: "Newport Distribution", latLong: "33.6189, -117.9298", street: "1200 Distribution Ave", postalCode: "92661", town: "Newport Beach", active: true, priority: "Medium", isParking: false },
    { id: 13, depotCode: "DP013", depotName: "San Diego Central", latLong: "32.7157, -117.1611", street: "1300 Central Plaza", postalCode: "92101", town: "San Diego", active: true, priority: "High", isParking: true },
    { id: 14, depotCode: "DP014", depotName: "Oceanside Terminal", latLong: "33.1959, -117.3795", street: "1400 Marine Ave", postalCode: "92054", town: "Oceanside", active: true, priority: "Medium", isParking: false },
    { id: 15, depotCode: "DP015", depotName: "La Jolla Research Depot", latLong: "32.8470, -117.2730", street: "1500 Research Way", postalCode: "92037", town: "La Jolla", active: true, priority: "Medium", isParking: false },
    { id: 16, depotCode: "DP016", depotName: "Carlsbad Industrial", latLong: "33.1581, -117.3506", street: "1600 Industrial Pkwy", postalCode: "92008", town: "Carlsbad", active: false, priority: "Low", isParking: false },
    { id: 17, depotCode: "DP017", depotName: "Encinitas Coastal Depot", latLong: "33.0370, -117.2920", street: "1700 Coastal Hwy", postalCode: "92024", town: "Encinitas", active: true, priority: "Low", isParking: false },
    { id: 18, depotCode: "DP018", depotName: "Del Mar Premium Hub", latLong: "32.9595, -117.2653", street: "1800 Premium Blvd", postalCode: "92014", town: "Del Mar", active: true, priority: "High", isParking: false },
    { id: 19, depotCode: "DP019", depotName: "Chula Vista South", latLong: "32.6401, -117.0842", street: "1900 South Bay Dr", postalCode: "91910", town: "Chula Vista", active: true, priority: "Medium", isParking: true },
    { id: 20, depotCode: "DP020", depotName: "Point Loma Naval Depot", latLong: "32.6953, -117.2415", street: "2000 Naval Base Rd", postalCode: "92106", town: "Point Loma", active: true, priority: "High", isParking: false },
  ]);

  const handleAddDepot = (newDepot: Depot) => {
    const depot = {
      ...newDepot,
      id: depots.length + 1,
      latLong: `${newDepot.latitude}, ${newDepot.longitude}`,
    };
    setDepots([...depots, depot]);
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

  // Action Cell Renderer for Edit/Delete buttons
  const ActionCellRenderer = (params: ICellRendererParams) => {
    return (
      <div className="flex items-center gap-2 h-full">
        <Button size="sm" onClick={() => console.log("Edit", params.data)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => console.log("Delete", params.data)}
        >
          Delete
        </Button>
      </div>
    );
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

  // Is Parking Cell Renderer
  const IsParkingCellRenderer = (params: ICellRendererParams) => {
    const isParking = params.value;
    return (
      <div className="flex items-center justify-center h-full">
        {isParking ? (
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
      field: "isParking",
      headerName: "Is Parking",
      flex: 1,
      minWidth: 100,
      cellRenderer: IsParkingCellRenderer,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      pinned: "right",
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

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

          {/* Add New Depot Button */}
          <AddDepotDialog onSave={handleAddDepot} />
        </div>

        {/* Depots Table - Takes remaining space */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
          <div style={{ height: "100%", width: "100%" }}>
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
            />
          </div>
        </div>
      </div>
    </main>
  );
}
