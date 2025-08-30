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
import { CheckSquare, Circle, Rows, XCircle } from "@phosphor-icons/react";
import AddSiteDialog, { Site } from "../components/AddSiteDialog";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SitesContent() {
  const { selectedCountry, selectedRegion, sidebarCollapsed } = useAppContext();
  const [sites, setSites] = useState([
    {
      id: 1,
      siteCode: "WC001",
      siteName: "Downtown Gas Station",
      latLong: "34.0522, -118.2437",
      street: "123 Main Street",
      postalCode: "90210",
      town: "Los Angeles",
      active: true,
      priority: "High",
    },
    {
      id: 2,
      siteCode: "WC002",
      siteName: "Airport Fuel Hub",
      latLong: "34.0522, -118.2437",
      street: "456 Airport Blvd",
      postalCode: "90045",
      town: "Los Angeles",
      active: true,
      priority: "High",
    },
    {
      id: 3,
      siteCode: "WC003",
      siteName: "Industrial District Station",
      latLong: "34.0194, -118.4108",
      street: "789 Industrial Way",
      postalCode: "90401",
      town: "Santa Monica",
      active: true,
      priority: "Medium",
    },
    {
      id: 4,
      siteCode: "WC004",
      siteName: "Harbor Point Depot",
      latLong: "33.7701, -118.1937",
      street: "321 Harbor Drive",
      postalCode: "90731",
      town: "San Pedro",
      active: false,
      priority: "Low",
    },
    {
      id: 5,
      siteCode: "WC005",
      siteName: "Suburban Shopping Center",
      latLong: "34.1478, -118.1445",
      street: "654 Shopping Center Dr",
      postalCode: "91101",
      town: "Pasadena",
      active: true,
      priority: "Medium",
    },
  ]);

  const handleAddSite = (newSite: Site) => {
    const site = {
      ...newSite,
      id: sites.length + 1,
      latLong: `${newSite.latitude}, ${newSite.longitude}`,
    };
    setSites([...sites, site]);
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

          {/* Add New Site Button */}
          <AddSiteDialog onSave={handleAddSite} />
        </div>

        {/* Sites Table - Takes remaining space */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
          <div style={{ height: "100%", width: "100%" }}>
            <AgGridReact
              rowData={sites}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              pagination={true}
              paginationPageSize={15}
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
