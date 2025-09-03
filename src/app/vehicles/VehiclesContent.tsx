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
import TrailerDetailsPage, { TrailerDetails } from "../components/TrailerDetailsPage";
import TruckDetailsPage, { TruckDetails } from "../components/TruckDetailsPage";
import VehicleDetailsPage, { VehicleDetails } from "../components/VehicleDetailsPage";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type TabType = 'vehicles' | 'trucks' | 'trailers';

export default function VehiclesContent() {
  const { sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerDetails | null>(null);
  const [showTrailerDetails, setShowTrailerDetails] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckDetails | null>(null);
  const [showTruckDetails, setShowTruckDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);

  // Mock data for trucks with extended details
  const [trucks, setTrucks] = useState<TruckDetails[]>([
    { 
      id: 1, 
      truckName: "Heavy Hauler 1", 
      truckCode: "TK001", 
      registrationNumber: "ABC-123", 
      haulierCompany: "Express Logistics", 
      active: true,
      licensePlate: "ABC-123",
      capacityKL: 25.0,
      parkingAssigned: "Parking Zone A",
      owner: "Own",
      pumpAvailable: true,
      compliance: {
        id: 1,
        adrExpiryDate: "2025-08-15",
        lastInspectionDate: "2024-08-15",
        nextInspectionDue: "2025-08-15",
        certificateNumber: "TK-ADR-2024-001",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "All truck inspections up to date. Next annual inspection scheduled."
      },
      maintenance: {
        id: 1,
        lastServiceDate: "2024-07-10",
        nextServiceDue: "2024-12-10",
        serviceType: "Routine",
        mileage: 150000,
        serviceProvider: "Main Depot Workshop",
        cost: 1800.00,
        workDescription: "Full service including engine check, brake inspection, and hydraulic system maintenance.",
        status: "Completed",
        notes: "All systems operational. Recommended brake pad replacement in 3 months."
      }
    },
    { 
      id: 2, 
      truckName: "Power Truck 2", 
      truckCode: "TK002", 
      registrationNumber: "DEF-456", 
      haulierCompany: "Fast Transport", 
      active: true,
      licensePlate: "DEF-456",
      capacityKL: 30.0,
      parkingAssigned: "Parking Zone B",
      owner: "Third Party",
      pumpAvailable: false,
      compliance: {
        id: 2,
        adrExpiryDate: "2025-03-20",
        lastInspectionDate: "2024-03-20",
        nextInspectionDue: "2025-03-20",
        certificateNumber: "TK-ADR-2024-002",
        inspectionType: "Annual",
        complianceStatus: "Due Soon",
        notes: "Certificate expires in 6 months. Renewal process to be initiated."
      },
      maintenance: {
        id: 2,
        lastServiceDate: "2024-06-15",
        nextServiceDue: "2024-11-15",
        serviceType: "Routine",
        mileage: 175000,
        serviceProvider: "Authorized Service Center",
        cost: 2100.00,
        workDescription: "Routine maintenance with engine oil change, filter replacements, and safety checks.",
        status: "Completed",
        notes: "Engine running smoothly. No issues detected."
      }
    },
    { 
      id: 3, 
      truckName: "Max Capacity 3", 
      truckCode: "TK003", 
      registrationNumber: "GHI-789", 
      haulierCompany: "Mega Freight", 
      active: true,
      licensePlate: "GHI-789",
      capacityKL: 35.0,
      parkingAssigned: "Main Parking",
      owner: "Own",
      pumpAvailable: true,
      compliance: {
        id: 3,
        adrExpiryDate: "2025-11-10",
        lastInspectionDate: "2024-11-10",
        nextInspectionDue: "2025-11-10",
        certificateNumber: "TK-ADR-2024-003",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "Recently renewed. All documentation current."
      },
      maintenance: {
        id: 3,
        lastServiceDate: "2024-08-20",
        nextServiceDue: "2025-01-20",
        serviceType: "Routine",
        mileage: 135000,
        serviceProvider: "Main Depot Workshop",
        cost: 1650.00,
        workDescription: "Complete service including pump maintenance, hydraulic system check, and tire inspection.",
        status: "Completed",
        notes: "Pump system serviced and tested. All functions working properly."
      }
    },
    { 
      id: 4, 
      truckName: "Reliable Truck 4", 
      truckCode: "TK004", 
      registrationNumber: "JKL-012", 
      haulierCompany: "Express Logistics", 
      active: false,
      licensePlate: "JKL-012",
      capacityKL: 28.0,
      parkingAssigned: "North Parking",
      owner: "Own",
      pumpAvailable: false,
      compliance: {
        id: 4,
        adrExpiryDate: "2024-12-01",
        lastInspectionDate: "2023-12-01",
        nextInspectionDue: "2024-12-01",
        certificateNumber: "TK-ADR-2023-004",
        inspectionType: "Annual",
        complianceStatus: "Expired",
        notes: "Certificate expired. Truck currently inactive until renewal."
      },
      maintenance: {
        id: 4,
        lastServiceDate: "2024-02-28",
        nextServiceDue: "2024-08-28",
        serviceType: "Repair",
        mileage: 200000,
        serviceProvider: "External Service Provider",
        cost: 3200.00,
        workDescription: "Major engine repair, transmission service, and electrical system overhaul.",
        status: "Overdue",
        notes: "Truck requires additional repairs before returning to service."
      }
    },
    { 
      id: 5, 
      truckName: "Fleet Leader 5", 
      truckCode: "TK005", 
      registrationNumber: "MNO-345", 
      haulierCompany: "Prime Movers", 
      active: true,
      licensePlate: "MNO-345",
      capacityKL: 32.0,
      parkingAssigned: "South Parking",
      owner: "Third Party",
      pumpAvailable: true,
      compliance: {
        id: 5,
        adrExpiryDate: "2025-05-30",
        lastInspectionDate: "2024-05-30",
        nextInspectionDue: "2025-05-30",
        certificateNumber: "TK-ADR-2024-005",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "New truck with full compliance documentation."
      },
      maintenance: {
        id: 5,
        lastServiceDate: "2024-08-01",
        nextServiceDue: "2025-02-01",
        serviceType: "Routine",
        mileage: 85000,
        serviceProvider: "Authorized Dealer",
        cost: 1200.00,
        workDescription: "First major service since delivery. All systems checked and validated.",
        status: "Completed",
        notes: "New truck performing excellently. Standard warranty service completed."
      }
    },
  ]);

  // Mock data for trailers with extended details
  const [trailers, setTrailers] = useState<TrailerDetails[]>([
    { 
      id: 1, 
      trailerName: "Fuel Tanker 1", 
      trailerCode: "TR001", 
      registrationNumber: "XYZ-111", 
      volumeCapacity: 35000, 
      weightCapacity: 28000, 
      numberOfCompartments: 4, 
      haulierCompany: "Express Logistics", 
      active: true,
      owner: "Own",
      depotAssigned: "Main Depot",
      latLong: "51.5074, -0.1278",
      compartments: [
        {
          id: 1,
          compartmentNo: 1,
          capacity: 10000,
          minVolume: 10000, // must use + not partial = min/max = capacity
          maxVolume: 10000,
          allowedProducts: ["Diesel", "Petrol Unleaded", "Petrol Super", "Heating Oil", "Kerosene", "AdBlue", "Biodiesel", "LPG"], // All Products
          partialLoadAllowed: false,
          mustUse: true
        },
        {
          id: 2,
          compartmentNo: 2,
          capacity: 8000,
          minVolume: 0, // partial load allowed, not must use = flexible
          maxVolume: 8000,
          allowedProducts: ["Petrol Unleaded", "Petrol Super"],
          partialLoadAllowed: true,
          mustUse: false
        },
        {
          id: 3,
          compartmentNo: 3,
          capacity: 9000,
          minVolume: 0,
          maxVolume: 9000,
          allowedProducts: ["Diesel", "Biodiesel"],
          partialLoadAllowed: true,
          mustUse: false
        },
        {
          id: 4,
          compartmentNo: 4,
          capacity: 8000,
          minVolume: 0,
          maxVolume: 8000,
          allowedProducts: ["AdBlue"],
          partialLoadAllowed: true,
          mustUse: false
        }
      ],
      compliance: {
        id: 1,
        adrExpiryDate: "2025-06-15",
        lastInspectionDate: "2024-06-15",
        nextInspectionDue: "2025-06-15",
        certificateNumber: "ADR-2024-001",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "All inspections up to date. Next annual inspection scheduled."
      },
      maintenance: {
        id: 1,
        lastServiceDate: "2024-03-15",
        nextServiceDue: "2024-09-15",
        serviceType: "Routine",
        mileage: 125000,
        serviceProvider: "Authorized Service Center",
        cost: 1250.00,
        workDescription: "Full service including brake inspection, tire rotation, and system checks.",
        status: "Completed",
        notes: "All systems operational. Recommended tire replacement in 6 months."
      }
    },
    { 
      id: 2, 
      trailerName: "Diesel Tank 2", 
      trailerCode: "TR002", 
      registrationNumber: "XYZ-222", 
      volumeCapacity: 40000, 
      weightCapacity: 32000, 
      numberOfCompartments: 5, 
      haulierCompany: "Fast Transport", 
      active: true,
      owner: "Third Party",
      depotAssigned: "North Terminal",
      latLong: "52.4862, -1.8904",
      compartments: [
        {
          id: 5,
          compartmentNo: 1,
          capacity: 8000,
          minVolume: 8000, // must use + not partial = min/max = capacity
          maxVolume: 8000,
          allowedProducts: ["Diesel"],
          partialLoadAllowed: false,
          mustUse: true
        },
        {
          id: 6,
          compartmentNo: 2,
          capacity: 8000,
          minVolume: 8000, // must use + not partial = min/max = capacity
          maxVolume: 8000,
          allowedProducts: ["Diesel"],
          partialLoadAllowed: false,
          mustUse: true
        },
        {
          id: 7,
          compartmentNo: 3,
          capacity: 8000,
          minVolume: 0,
          maxVolume: 8000,
          allowedProducts: ["Diesel", "Biodiesel"],
          partialLoadAllowed: true,
          mustUse: false
        },
        {
          id: 8,
          compartmentNo: 4,
          capacity: 8000,
          minVolume: 0,
          maxVolume: 8000,
          allowedProducts: ["Heating Oil"],
          partialLoadAllowed: true,
          mustUse: false
        },
        {
          id: 9,
          compartmentNo: 5,
          capacity: 8000,
          minVolume: 0,
          maxVolume: 8000,
          allowedProducts: ["Kerosene"],
          partialLoadAllowed: true,
          mustUse: false
        }
      ],
      compliance: {
        id: 2,
        adrExpiryDate: "2025-01-20",
        lastInspectionDate: "2024-01-20",
        nextInspectionDue: "2025-01-20",
        certificateNumber: "ADR-2024-002",
        inspectionType: "Annual",
        complianceStatus: "Due Soon",
        notes: "Certificate expires in 4 months. Renewal process initiated."
      },
      maintenance: {
        id: 2,
        lastServiceDate: "2024-05-10",
        nextServiceDue: "2024-11-10",
        serviceType: "Routine",
        mileage: 98000,
        serviceProvider: "Main Depot Workshop",
        cost: 850.00,
        workDescription: "Standard maintenance service with hydraulic system check.",
        status: "Scheduled",
        notes: "Service appointment booked for next month."
      }
    },
    { 
      id: 3, 
      trailerName: "Multi-Product 3", 
      trailerCode: "TR003", 
      registrationNumber: "XYZ-333", 
      volumeCapacity: 38000, 
      weightCapacity: 30000, 
      numberOfCompartments: 6, 
      haulierCompany: "Mega Freight", 
      active: true,
      owner: "Own",
      depotAssigned: "South Hub",
      latLong: "50.8503, -0.1253",
      compartments: [],
      compliance: {
        id: 3,
        adrExpiryDate: "2024-11-30",
        lastInspectionDate: "2023-11-30",
        nextInspectionDue: "2024-11-30",
        certificateNumber: "ADR-2023-003",
        inspectionType: "Annual",
        complianceStatus: "Expired",
        notes: "URGENT: Certificate has expired. Trailer should not be used until renewal."
      },
      maintenance: {
        id: 3,
        lastServiceDate: "2024-01-20",
        nextServiceDue: "2024-07-20",
        serviceType: "Emergency",
        mileage: 156000,
        serviceProvider: "External Contractor",
        cost: 2150.00,
        workDescription: "Emergency brake system repair and compartment seal replacement.",
        status: "Overdue",
        notes: "Major service overdue. Requires immediate attention before next use."
      }
    },
    { 
      id: 4, 
      trailerName: "Heavy Duty 4", 
      trailerCode: "TR004", 
      registrationNumber: "XYZ-444", 
      volumeCapacity: 42000, 
      weightCapacity: 35000, 
      numberOfCompartments: 4, 
      haulierCompany: "Express Logistics", 
      active: false, // Inactive due to non-sequential compartments
      owner: "Own",
      depotAssigned: "Main Depot",
      latLong: "51.5074, -0.1278",
      compartments: [
        {
          id: 10,
          compartmentNo: 1,
          capacity: 10000,
          minVolume: 0,
          maxVolume: 10000,
          allowedProducts: ["Diesel"],
          partialLoadAllowed: true,
          mustUse: false
        },
        {
          id: 11,
          compartmentNo: 2,
          capacity: 10000,
          minVolume: 0,
          maxVolume: 10000,
          allowedProducts: ["Petrol Unleaded"],
          partialLoadAllowed: true,
          mustUse: false
        },
        // Missing compartment 3 - this makes the sequence incomplete
        {
          id: 12,
          compartmentNo: 4,
          capacity: 10000,
          minVolume: 0,
          maxVolume: 10000,
          allowedProducts: ["Heating Oil"],
          partialLoadAllowed: true,
          mustUse: false
        }
      ],
      compliance: {
        id: 4,
        adrExpiryDate: "2025-08-15",
        lastInspectionDate: "2024-08-15",
        nextInspectionDue: "2025-08-15",
        certificateNumber: "ADR-2024-004",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "Recently passed inspection. All documentation current."
      },
      maintenance: {
        id: 4,
        lastServiceDate: "2024-07-01",
        nextServiceDue: "2025-01-01",
        serviceType: "Routine",
        mileage: 89000,
        serviceProvider: "Authorized Service Center",
        cost: 1100.00,
        workDescription: "Full service with tire replacement and brake pad renewal.",
        status: "Completed",
        notes: "Trailer in excellent condition. Ready for service when reactivated."
      }
    },
    { 
      id: 5, 
      trailerName: "Standard Tank 5", 
      trailerCode: "TR005", 
      registrationNumber: "XYZ-555", 
      volumeCapacity: 36000, 
      weightCapacity: 29000, 
      numberOfCompartments: 5, 
      haulierCompany: "Prime Movers", 
      active: true,
      owner: "Third Party",
      depotAssigned: "West Terminal",
      latLong: "53.4808, -2.2426",
      compartments: [],
      compliance: {
        id: 5,
        adrExpiryDate: "2025-03-10",
        lastInspectionDate: "2024-03-10",
        nextInspectionDue: "2025-03-10",
        certificateNumber: "ADR-2024-005",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "Inspection completed. All safety systems verified."
      },
      maintenance: {
        id: 5,
        lastServiceDate: "2024-04-15",
        nextServiceDue: "2024-10-15",
        serviceType: "Routine",
        mileage: 112000,
        serviceProvider: "Mobile Service Unit",
        cost: 950.00,
        workDescription: "Routine maintenance with compartment cleaning system service.",
        status: "Completed",
        notes: "All systems functioning well. Next service scheduled."
      }
    },
    { 
      id: 6, 
      trailerName: "Compact Tanker 6", 
      trailerCode: "TR006", 
      registrationNumber: "XYZ-666", 
      volumeCapacity: 30000, 
      weightCapacity: 25000, 
      numberOfCompartments: 3, 
      haulierCompany: "Fast Transport", 
      active: true,
      owner: "Own",
      depotAssigned: "North Terminal",
      latLong: "52.4862, -1.8904",
      compartments: [],
      compliance: {
        id: 6,
        adrExpiryDate: "2025-12-01",
        lastInspectionDate: "2024-12-01",
        nextInspectionDue: "2025-12-01",
        certificateNumber: "ADR-2024-006",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: "Recently inspected. New trailer with full compliance."
      },
      maintenance: {
        id: 6,
        lastServiceDate: "2024-08-01",
        nextServiceDue: "2025-02-01",
        serviceType: "Routine",
        mileage: 45000,
        serviceProvider: "Main Depot Workshop",
        cost: 650.00,
        workDescription: "First major service since delivery. All systems checked.",
        status: "Completed",
        notes: "New trailer performing excellently. Low maintenance requirements."
      }
    },
  ]);

  // Mock data for vehicles (truck + trailer combinations)
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([
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

  // Handle trailer row double-click
  const handleTrailerDoubleClick = (trailerData: Trailer) => {
    const trailer = trailers.find(t => t.id === trailerData.id);
    if (trailer) {
      setSelectedTrailer(trailer);
      setShowTrailerDetails(true);
    }
  };

  const handleBackFromTrailerDetails = () => {
    setShowTrailerDetails(false);
    setSelectedTrailer(null);
  };

  const handleSaveTrailerDetails = (updatedTrailer: TrailerDetails) => {
    const updatedTrailers = trailers.map(trailer => 
      trailer.id === updatedTrailer.id ? updatedTrailer : trailer
    );
    setTrailers(updatedTrailers);
  };

  // Handle truck row double-click
  const handleTruckDoubleClick = (truckData: TruckTractor) => {
    const truck = trucks.find(t => t.id === truckData.id);
    if (truck) {
      setSelectedTruck(truck);
      setShowTruckDetails(true);
    }
  };

  const handleBackFromTruckDetails = () => {
    setShowTruckDetails(false);
    setSelectedTruck(null);
  };

  const handleSaveTruckDetails = (updatedTruck: TruckDetails) => {
    const updatedTrucks = trucks.map(truck => 
      truck.id === updatedTruck.id ? updatedTruck : truck
    );
    setTrucks(updatedTrucks);
  };

  // Handle vehicle row double-click
  const handleVehicleDoubleClick = (vehicleData: Vehicle) => {
    const vehicle = vehicles.find(v => v.id === vehicleData.id);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowVehicleDetails(true);
    }
  };

  const handleBackFromVehicleDetails = () => {
    setShowVehicleDetails(false);
    setSelectedVehicle(null);
  };

  const handleSaveVehicleDetails = (vehicleId: number, data: Partial<VehicleDetails>) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, ...data } : vehicle
    );
    setVehicles(updatedVehicles);
  };

  const handleAddTruck = (newTruck: NewTruck) => {
    const truck: TruckDetails = {
      ...newTruck,
      id: trucks.length + 1,
      active: true, // Set as active by default
      licensePlate: newTruck.registrationNumber, // Use registration number as license plate
      capacityKL: 25.0,
      parkingAssigned: "Main Parking",
      owner: "Own",
      pumpAvailable: false, // Default to false for new trucks
      compliance: {
        id: Date.now(),
        adrExpiryDate: "",
        lastInspectionDate: "",
        nextInspectionDue: "",
        certificateNumber: "",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: ""
      },
      maintenance: {
        id: Date.now() + 1,
        lastServiceDate: "",
        nextServiceDue: "",
        serviceType: "Routine",
        mileage: 0,
        serviceProvider: "",
        cost: 0,
        workDescription: "",
        status: "Completed",
        notes: ""
      }
    };
    setTrucks([...trucks, truck]);
  };

  const handleAddTrailer = (newTrailer: NewTrailer) => {
    const trailer: TrailerDetails = {
      ...newTrailer,
      id: trailers.length + 1,
      active: true, // Set as active by default
      owner: "Own", // Default owner
      depotAssigned: "Main Depot", // Default depot
      latLong: "51.5074, -0.1278", // Default coordinates
      compartments: [],
      compliance: {
        id: Date.now(),
        adrExpiryDate: "",
        lastInspectionDate: "",
        nextInspectionDue: "",
        certificateNumber: "",
        inspectionType: "Annual",
        complianceStatus: "Compliant",
        notes: ""
      },
      maintenance: {
        id: Date.now() + 1,
        lastServiceDate: "",
        nextServiceDue: "",
        serviceType: "Routine",
        mileage: 0,
        serviceProvider: "",
        cost: 0,
        workDescription: "",
        status: "Completed",
        notes: ""
      }
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
      field: "parkingAssigned",
      headerName: "Parking Assigned",
      flex: 1,
      minWidth: 150,
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

  // Grid events
  const onRowDoubleClicked = (event: { data: Trailer | TruckTractor | Vehicle }) => {
    if (activeTab === 'trailers') {
      handleTrailerDoubleClick(event.data as Trailer);
    } else if (activeTab === 'trucks') {
      handleTruckDoubleClick(event.data as TruckTractor);
    } else if (activeTab === 'vehicles') {
      handleVehicleDoubleClick(event.data as Vehicle);
    }
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
    <>
      {showTrailerDetails && selectedTrailer ? (
        <TrailerDetailsPage
          trailer={selectedTrailer}
          onBack={handleBackFromTrailerDetails}
          onSave={handleSaveTrailerDetails}
        />
      ) : showTruckDetails && selectedTruck ? (
        <TruckDetailsPage
          truck={selectedTruck}
          onBack={handleBackFromTruckDetails}
          onSave={handleSaveTruckDetails}
        />
      ) : showVehicleDetails && selectedVehicle ? (
        <VehicleDetailsPage
          vehicle={selectedVehicle}
          onBack={handleBackFromVehicleDetails}
          onSave={handleSaveVehicleDetails}
        />
      ) : (
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
              {activeTab === 'vehicles' && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Tip:</span> Double-click on any fleet vehicle row to view detailed information including tractor-trailer combinations, capacity specifications, and assignments.
                  </p>
                </div>
              )}
              {activeTab === 'trailers' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Tip:</span> Double-click on any trailer row to view detailed information including compartments, compliance, and maintenance records.
                  </p>
                </div>
              )}
              {activeTab === 'trucks' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Tip:</span> Double-click on any truck row to view detailed information including basic specifications and configuration.
                  </p>
                </div>
              )}
              <div style={{ height: (activeTab === 'trailers' || activeTab === 'trucks' || activeTab === 'vehicles') ? "calc(100% - 80px)" : "100%", width: "100%" }}>
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
                  onRowDoubleClicked={onRowDoubleClicked}
                  onGridReady={(params: GridReadyEvent) => {
                    params.api.sizeColumnsToFit();
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
