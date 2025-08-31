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
import { 
  CheckSquare, 
  Rows, 
  XCircle, 
  Truck, 
  Car, 
  Package
} from "@phosphor-icons/react";
import AddTruckDialog, { TruckTractor, NewTruck } from "../components/AddTruckDialog";
import AddTrailerDialog, { Trailer, NewTrailer } from "../components/AddTrailerDialog";
import AddVehicleDialog, { Vehicle, NewVehicle } from "../components/AddVehicleDialog";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type TabType = 'vehicles' | 'trucks' | 'trailers';

export default function VehiclesContent() {
  const { sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');

  // Mock data for trucks
  const [trucks, setTrucks] = useState<TruckTractor[]>([
    { id: 1, truckName: "Heavy Hauler 1", truckCode: "TK001", registrationNumber: "ABC-123", capacity: 40000, haulierCompany: "Express Logistics", active: true },
    { id: 2, truckName: "Power Truck 2", truckCode: "TK002", registrationNumber: "DEF-456", capacity: 35000, haulierCompany: "Fast Transport", active: true },
    { id: 3, truckName: "Max Capacity 3", truckCode: "TK003", registrationNumber: "GHI-789", capacity: 45000, haulierCompany: "Mega Freight", active: true },
    { id: 4, truckName: "Reliable Truck 4", truckCode: "TK004", registrationNumber: "JKL-012", capacity: 38000, haulierCompany: "Express Logistics", active: false },
    { id: 5, truckName: "Fleet Leader 5", truckCode: "TK005", registrationNumber: "MNO-345", capacity: 42000, haulierCompany: "Prime Movers", active: true },
  ]);

  // Mock data for trailers
  const [trailers, setTrailers] = useState<Trailer[]>([
    { id: 1, trailerName: "Fuel Tanker 1", trailerCode: "TR001", registrationNumber: "XYZ-111", volumeCapacity: 35000, weightCapacity: 28000, numberOfCompartments: 4, haulierCompany: "Express Logistics", active: true },
    { id: 2, trailerName: "Diesel Tank 2", trailerCode: "TR002", registrationNumber: "XYZ-222", volumeCapacity: 40000, weightCapacity: 32000, numberOfCompartments: 5, haulierCompany: "Fast Transport", active: true },
    { id: 3, trailerName: "Multi-Product 3", trailerCode: "TR003", registrationNumber: "XYZ-333", volumeCapacity: 38000, weightCapacity: 30000, numberOfCompartments: 6, haulierCompany: "Mega Freight", active: true },
    { id: 4, trailerName: "Heavy Duty 4", trailerCode: "TR004", registrationNumber: "XYZ-444", volumeCapacity: 42000, weightCapacity: 35000, numberOfCompartments: 4, haulierCompany: "Express Logistics", active: false },
    { id: 5, trailerName: "Standard Tank 5", trailerCode: "TR005", registrationNumber: "XYZ-555", volumeCapacity: 36000, weightCapacity: 29000, numberOfCompartments: 5, haulierCompany: "Prime Movers", active: true },
    { id: 6, trailerName: "Compact Tanker 6", trailerCode: "TR006", registrationNumber: "XYZ-666", volumeCapacity: 30000, weightCapacity: 25000, numberOfCompartments: 3, haulierCompany: "Fast Transport", active: true },
  ]);

  // Mock data for vehicles (truck + trailer combinations)
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { 
      id: 1, 
      vehicleName: "Heavy Hauler 1 + Fuel Tanker 1", 
      vehicleCode: "VH001", 
      truckId: 1, 
      trailerId: 1,
      truckName: "Heavy Hauler 1", 
      truckRegistration: "ABC-123",
      trailerName: "Fuel Tanker 1", 
      trailerRegistration: "XYZ-111",
      volumeCapacity: 35000, 
      weightCapacity: 28000, 
      numberOfTrailers: 1, 
      haulierCompany: "Express Logistics", 
      baseLocation: "Main Depot", 
      active: true 
    },
    { 
      id: 2, 
      vehicleName: "Power Truck 2 + Diesel Tank 2", 
      vehicleCode: "VH002", 
      truckId: 2, 
      trailerId: 2,
      truckName: "Power Truck 2", 
      truckRegistration: "DEF-456",
      trailerName: "Diesel Tank 2", 
      trailerRegistration: "XYZ-222",
      volumeCapacity: 40000, 
      weightCapacity: 32000, 
      numberOfTrailers: 1, 
      haulierCompany: "Fast Transport", 
      baseLocation: "North Terminal", 
      active: true 
    },
    { 
      id: 3, 
      vehicleName: "Max Capacity 3 + Multi-Product 3", 
      vehicleCode: "VH003", 
      truckId: 3, 
      trailerId: 3,
      truckName: "Max Capacity 3", 
      truckRegistration: "GHI-789",
      trailerName: "Multi-Product 3", 
      trailerRegistration: "XYZ-333",
      volumeCapacity: 38000, 
      weightCapacity: 30000, 
      numberOfTrailers: 1, 
      haulierCompany: "Mega Freight", 
      baseLocation: "South Hub", 
      active: true 
    },
    { 
      id: 4, 
      vehicleName: "Fleet Leader 5 + Standard Tank 5", 
      vehicleCode: "VH004", 
      truckId: 5, 
      trailerId: 5,
      truckName: "Fleet Leader 5", 
      truckRegistration: "MNO-345",
      trailerName: "Standard Tank 5", 
      trailerRegistration: "XYZ-555",
      volumeCapacity: 36000, 
      weightCapacity: 29000, 
      numberOfTrailers: 1, 
      haulierCompany: "Prime Movers", 
      baseLocation: "West Terminal", 
      active: false 
    },
  ]);

  // Handle adding new items
  const handleAddTruck = (newTruck: NewTruck) => {
    const truck: TruckTractor = {
      ...newTruck,
      id: trucks.length + 1,
      active: true, // Set as active by default
    };
    setTrucks([...trucks, truck]);
  };

  const handleAddTrailer = (newTrailer: NewTrailer) => {
    const trailer: Trailer = {
      ...newTrailer,
      id: trailers.length + 1,
      active: true, // Set as active by default
    };
    setTrailers([...trailers, trailer]);
  };

  const handleAddVehicle = (newVehicle: NewVehicle) => {
    const selectedTruck = trucks.find(truck => truck.id === newVehicle.truckId);
    const selectedTrailer = trailers.find(trailer => trailer.id === newVehicle.trailerId);
    
    if (!selectedTruck || !selectedTrailer) {
      alert('Selected truck or trailer not found');
      return;
    }

    const vehicle: Vehicle = {
      ...newVehicle,
      id: vehicles.length + 1,
      truckName: selectedTruck.truckName,
      truckRegistration: selectedTruck.registrationNumber,
      trailerName: selectedTrailer.trailerName,
      trailerRegistration: selectedTrailer.registrationNumber,
      volumeCapacity: selectedTrailer.volumeCapacity,
      weightCapacity: selectedTrailer.weightCapacity,
      haulierCompany: selectedTruck.haulierCompany, // Use truck's haulier company
      numberOfTrailers: 1, // Default to 1 trailer
      baseLocation: 'Main Depot', // Default base location
      active: true, // Set as active by default
    };
    setVehicles([...vehicles, vehicle]);
  };

  // Capacity Cell Renderer
  const CapacityCellRenderer = (params: ICellRendererParams) => {
    const { volumeCapacity, weightCapacity } = params.data;
    return (
      <div className="text-sm">
        <div>{volumeCapacity?.toLocaleString()}L</div>
        <div className="text-gray-500">{weightCapacity?.toLocaleString()}kg</div>
      </div>
    );
  };

  // Vehicle Columns
  const vehicleColumnDefs: ColDef[] = [
    {
      field: "vehicleName",
      headerName: "Vehicle Name",
      flex: 2,
      minWidth: 250,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "vehicleCode",
      headerName: "Vehicle Code",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "truckName",
      headerName: "Truck Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "truckRegistration",
      headerName: "Truck Reg.",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "trailerName",
      headerName: "Trailer Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "trailerRegistration",
      headerName: "Trailer Reg.",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Capacity",
      flex: 1,
      minWidth: 120,
      cellRenderer: CapacityCellRenderer,
      sortable: false,
      filter: false,
    },
    {
      field: "numberOfTrailers",
      headerName: "No. Trailers",
      flex: 1,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "haulierCompany",
      headerName: "Haulier",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "baseLocation",
      headerName: "Base Location",
      flex: 1,
      minWidth: 150,
    },
  ];

  // Truck Columns
  const truckColumnDefs: ColDef[] = [
    {
      field: "truckName",
      headerName: "Truck Name",
      flex: 2,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "truckCode",
      headerName: "Truck Code",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "registrationNumber",
      headerName: "Registration",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "capacity",
      headerName: "Capacity (kg)",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value?.toLocaleString(),
    },
    {
      field: "haulierCompany",
      headerName: "Haulier",
      flex: 1,
      minWidth: 150,
    },
  ];

  // Trailer Columns
  const trailerColumnDefs: ColDef[] = [
    {
      field: "trailerName",
      headerName: "Trailer Name",
      flex: 2,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "trailerCode",
      headerName: "Trailer Code",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "registrationNumber",
      headerName: "Registration",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Capacity",
      flex: 1,
      minWidth: 120,
      cellRenderer: CapacityCellRenderer,
      sortable: false,
      filter: false,
    },
    {
      field: "numberOfCompartments",
      headerName: "Compartments",
      flex: 1,
      minWidth: 120,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "haulierCompany",
      headerName: "Haulier",
      flex: 1,
      minWidth: 150,
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // Get current data and columns based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'vehicles':
        return { data: vehicles, columns: vehicleColumnDefs };
      case 'trucks':
        return { data: trucks, columns: truckColumnDefs };
      case 'trailers':
        return { data: trailers, columns: trailerColumnDefs };
      default:
        return { data: vehicles, columns: vehicleColumnDefs };
    }
  };

  const { data, columns } = getCurrentData();

  // Tab configuration
  const tabs = [
    { id: 'vehicles' as TabType, label: 'Fleet List View', icon: Package, count: vehicles.length },
    { id: 'trucks' as TabType, label: 'Tractor List', icon: Truck, count: trucks.length },
    { id: 'trailers' as TabType, label: 'Trailer List', icon: Car, count: trailers.length },
  ];

  // Get stats based on current tab
  const getStats = () => {
    const currentData = data as (Vehicle | TruckTractor | Trailer)[];
    const activeCount = currentData.filter(item => item.active).length;
    const inactiveCount = currentData.filter(item => !item.active).length;
    
    return {
      total: currentData.length,
      active: activeCount,
      inactive: inactiveCount,
    };
  };

  const stats = getStats();

  // Render Add Button based on active tab
  const renderAddButton = () => {
    switch (activeTab) {
      case 'vehicles':
        return <AddVehicleDialog trucks={trucks} trailers={trailers} onSave={handleAddVehicle} />;
      case 'trucks':
        return <AddTruckDialog onSave={handleAddTruck} />;
      case 'trailers':
        return <AddTrailerDialog onSave={handleAddTrailer} />;
      default:
        return <AddVehicleDialog trucks={trucks} trailers={trailers} onSave={handleAddVehicle} />;
    }
  };

  return (
    <main
      className={`pt-20 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header with Tabs */}
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
              <p className="text-gray-600 text-sm">Manage vehicles, trucks, and trailers</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-custom text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-primary-custom/80 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Button */}
          {renderAddButton()}
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3 mb-4 flex-shrink-0">
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
            <span className="text-base"><Rows size={25} color="#02589d" weight="duotone" /></span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">{stats.total}</span>
              <span className="text-xs text-gray-600">Total</span>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
            <span className="text-base"><CheckSquare size={25} weight="duotone" color="green" /></span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-green-600">{stats.active}</span>
              <span className="text-xs text-gray-600">Active</span>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
            <span className="text-base"><XCircle size={25} color="red" weight="duotone" /></span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-red-600">{stats.inactive}</span>
              <span className="text-xs text-gray-600">Inactive</span>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
          <div style={{ height: "100%", width: "100%" }}>
            <AgGridReact
              rowData={data}
              columnDefs={columns}
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
