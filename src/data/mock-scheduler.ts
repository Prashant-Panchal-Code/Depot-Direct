// Mock data for scheduler UI development
// TODO: replace with actual API data

import { addHours, addMinutes, startOfToday } from 'date-fns';

export interface Compartment {
  id: string;
  name: string;
  capacity: number; // liters
  productType: string;
  mandatoryToLoad: boolean; // must be used if product matches
  partialAllowed: boolean; // can be partially filled
  mustUse: boolean; // must be used for this trailer
}

export interface Trailer {
  id: string;
  registration: string;
  compartments: Compartment[];
  totalCapacity: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van';
  status: 'active' | 'maintenance' | 'offline';
  trailerId?: string;
  availabilityStart: Date;
  availabilityEnd: Date;
  driver?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  vehicleId?: string;
  productType: string;
  quantity: number; // liters
  priority: 'high' | 'medium' | 'low';
  start: Date;
  end: Date;
  compartmentAllocations: { compartmentId: string; quantity: number }[];
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  customerName: string;
  deliveryAddress: string;
}

export interface UnassignedOrder {
  id: string;
  orderId: string;
  productType: string;
  quantity: number; // liters
  priority: 'high' | 'medium' | 'low';
  etaWindow: { start: Date; end: Date };
  customerName: string;
  deliveryAddress: string;
  createdAt: Date;
}

// Mock trailers with compartments
export const mockTrailers: Trailer[] = [
  {
    id: 'trailer-1',
    registration: 'TRL-001',
    compartments: [
      {
        id: 'comp-1a',
        name: 'Comp 1',
        capacity: 8000,
        productType: 'diesel',
        mandatoryToLoad: true,
        partialAllowed: true,
        mustUse: false
      },
      {
        id: 'comp-1b',
        name: 'Comp 2',
        capacity: 6000,
        productType: 'petrol',
        mandatoryToLoad: false,
        partialAllowed: true,
        mustUse: false
      },
      {
        id: 'comp-1c',
        name: 'Comp 3',
        capacity: 4000,
        productType: 'kerosene',
        mandatoryToLoad: false,
        partialAllowed: false,
        mustUse: true
      }
    ],
    totalCapacity: 18000
  },
  {
    id: 'trailer-2',
    registration: 'TRL-002',
    compartments: [
      {
        id: 'comp-2a',
        name: 'Comp 1',
        capacity: 10000,
        productType: 'diesel',
        mandatoryToLoad: true,
        partialAllowed: true,
        mustUse: false
      },
      {
        id: 'comp-2b',
        name: 'Comp 2',
        capacity: 8000,
        productType: 'petrol',
        mandatoryToLoad: false,
        partialAllowed: true,
        mustUse: false
      }
    ],
    totalCapacity: 18000
  },
  {
    id: 'trailer-3',
    registration: 'TRL-003',
    compartments: [
      {
        id: 'comp-3a',
        name: 'Comp 1',
        capacity: 12000,
        productType: 'diesel',
        mandatoryToLoad: true,
        partialAllowed: true,
        mustUse: false
      }
    ],
    totalCapacity: 12000
  }
];

const today = startOfToday();

// Mock vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Truck Alpha',
    type: 'truck',
    status: 'active',
    trailerId: 'trailer-1',
    availabilityStart: addHours(today, 6),
    availabilityEnd: addHours(today, 18),
    driver: 'John Smith'
  },
  {
    id: 'vehicle-2',
    name: 'Truck Beta',
    type: 'truck',
    status: 'active',
    trailerId: 'trailer-2',
    availabilityStart: addHours(today, 7),
    availabilityEnd: addHours(today, 19),
    driver: 'Jane Doe'
  },
  {
    id: 'vehicle-3',
    name: 'Truck Gamma',
    type: 'truck',
    status: 'maintenance',
    trailerId: 'trailer-3',
    availabilityStart: addHours(today, 14),
    availabilityEnd: addHours(today, 20),
    driver: 'Mike Johnson'
  },
  {
    id: 'vehicle-4',
    name: 'Van Delta',
    type: 'van',
    status: 'active',
    availabilityStart: addHours(today, 8),
    availabilityEnd: addHours(today, 16),
    driver: 'Sarah Wilson'
  },
  {
    id: 'vehicle-5',
    name: 'Truck Echo',
    type: 'truck',
    status: 'active',
    trailerId: 'trailer-1',
    availabilityStart: addHours(today, 9),
    availabilityEnd: addHours(today, 17),
    driver: 'David Brown'
  },
  {
    id: 'vehicle-6',
    name: 'Van Foxtrot',
    type: 'van',
    status: 'offline',
    availabilityStart: addHours(today, 10),
    availabilityEnd: addHours(today, 18),
    driver: 'Lisa Garcia'
  },
  {
    id: 'vehicle-7',
    name: 'Truck Golf',
    type: 'truck',
    status: 'active',
    trailerId: 'trailer-2',
    availabilityStart: addHours(today, 5),
    availabilityEnd: addHours(today, 15),
    driver: 'Michael Torres'
  },
  {
    id: 'vehicle-8',
    name: 'Van Hotel',
    type: 'van',
    status: 'active',
    availabilityStart: addHours(today, 7),
    availabilityEnd: addHours(today, 19),
    driver: 'Jennifer Lee'
  },
  {
    id: 'vehicle-9',
    name: 'Truck India',
    type: 'truck',
    status: 'maintenance',
    trailerId: 'trailer-3',
    availabilityStart: addHours(today, 12),
    availabilityEnd: addHours(today, 22),
    driver: 'Robert Kim'
  },
  {
    id: 'vehicle-10',
    name: 'Van Juliet',
    type: 'van',
    status: 'active',
    availabilityStart: addHours(today, 6),
    availabilityEnd: addHours(today, 14),
    driver: 'Amanda Rodriguez'
  },
  {
    id: 'vehicle-11',
    name: 'Truck Kilo',
    type: 'truck',
    status: 'active',
    trailerId: 'trailer-1',
    availabilityStart: addHours(today, 8),
    availabilityEnd: addHours(today, 20),
    driver: 'Christopher Davis'
  },
  {
    id: 'vehicle-12',
    name: 'Van Lima',
    type: 'van',
    status: 'offline',
    availabilityStart: addHours(today, 9),
    availabilityEnd: addHours(today, 17),
    driver: 'Patricia Martinez'
  }
];

// Mock assigned shipments
export const mockShipments: Shipment[] = [
  {
    id: 'shipment-1',
    orderId: 'ORD-001',
    vehicleId: 'vehicle-1',
    productType: 'diesel',
    quantity: 7500,
    priority: 'high',
    start: addHours(today, 8),
    end: addHours(today, 10),
    compartmentAllocations: [{ compartmentId: 'comp-1a', quantity: 7500 }],
    status: 'assigned',
    customerName: 'Shell Station A',
    deliveryAddress: '123 Main St, City A'
  },
  {
    id: 'shipment-2',
    orderId: 'ORD-002',
    vehicleId: 'vehicle-1',
    productType: 'petrol',
    quantity: 5000,
    priority: 'medium',
    start: addHours(today, 11),
    end: addHours(today, 13),
    compartmentAllocations: [{ compartmentId: 'comp-1b', quantity: 5000 }],
    status: 'assigned',
    customerName: 'BP Station B',
    deliveryAddress: '456 Oak Ave, City B'
  },
  {
    id: 'shipment-3',
    orderId: 'ORD-003',
    vehicleId: 'vehicle-2',
    productType: 'diesel',
    quantity: 9000,
    priority: 'high',
    start: addHours(today, 9),
    end: addHours(today, 11),
    compartmentAllocations: [{ compartmentId: 'comp-2a', quantity: 9000 }],
    status: 'assigned',
    customerName: 'Texaco Station C',
    deliveryAddress: '789 Pine Rd, City C'
  },
  {
    id: 'shipment-4',
    orderId: 'ORD-004',
    vehicleId: 'vehicle-2',
    productType: 'petrol',
    quantity: 6000,
    priority: 'low',
    start: addHours(today, 14),
    end: addHours(today, 16),
    compartmentAllocations: [{ compartmentId: 'comp-2b', quantity: 6000 }],
    status: 'assigned',
    customerName: 'Mobil Station D',
    deliveryAddress: '321 Elm St, City D'
  },
  {
    id: 'shipment-5',
    orderId: 'ORD-005',
    vehicleId: 'vehicle-5',
    productType: 'diesel',
    quantity: 8000,
    priority: 'medium',
    start: addHours(today, 10),
    end: addHours(today, 12),
    compartmentAllocations: [{ compartmentId: 'comp-1a', quantity: 8000 }],
    status: 'assigned',
    customerName: 'Exxon Station E',
    deliveryAddress: '654 Birch Ln, City E'
  }
];

// Mock unassigned orders
export const mockUnassignedOrders: UnassignedOrder[] = [
  {
    id: 'unassigned-1',
    orderId: 'ORD-006',
    productType: 'diesel',
    quantity: 8500,
    priority: 'high',
    etaWindow: {
      start: addHours(today, 12),
      end: addHours(today, 16)
    },
    customerName: 'Chevron Station F',
    deliveryAddress: '987 Cedar Ave, City F',
    createdAt: addMinutes(today, -30)
  },
  {
    id: 'unassigned-2',
    orderId: 'ORD-007',
    productType: 'petrol',
    quantity: 4500,
    priority: 'medium',
    etaWindow: {
      start: addHours(today, 13),
      end: addHours(today, 17)
    },
    customerName: 'Marathon Station G',
    deliveryAddress: '147 Maple Dr, City G',
    createdAt: addMinutes(today, -15)
  },
  {
    id: 'unassigned-3',
    orderId: 'ORD-008',
    productType: 'kerosene',
    quantity: 3500,
    priority: 'low',
    etaWindow: {
      start: addHours(today, 15),
      end: addHours(today, 18)
    },
    customerName: 'Sunoco Station H',
    deliveryAddress: '258 Spruce St, City H',
    createdAt: addMinutes(today, -45)
  },
  {
    id: 'unassigned-4',
    orderId: 'ORD-009',
    productType: 'diesel',
    quantity: 12000,
    priority: 'high',
    etaWindow: {
      start: addHours(today, 14),
      end: addHours(today, 18)
    },
    customerName: 'Phillips 66 Station I',
    deliveryAddress: '369 Willow Way, City I',
    createdAt: addMinutes(today, -60)
  },
  {
    id: 'unassigned-5',
    orderId: 'ORD-010',
    productType: 'petrol',
    quantity: 7500,
    priority: 'medium',
    etaWindow: {
      start: addHours(today, 16),
      end: addHours(today, 20)
    },
    customerName: 'Citgo Station J',
    deliveryAddress: '741 Poplar Pl, City J',
    createdAt: addMinutes(today, -20)
  },
  {
    id: 'unassigned-6',
    orderId: 'ORD-011',
    productType: 'diesel',
    quantity: 9500,
    priority: 'high',
    etaWindow: {
      start: addHours(today, 8),
      end: addHours(today, 12)
    },
    customerName: 'Shell Station K',
    deliveryAddress: '852 Oak Street, City K',
    createdAt: addMinutes(today, -90)
  },
  {
    id: 'unassigned-7',
    orderId: 'ORD-012',
    productType: 'petrol',
    quantity: 6200,
    priority: 'medium',
    etaWindow: {
      start: addHours(today, 10),
      end: addHours(today, 14)
    },
    customerName: 'BP Station L',
    deliveryAddress: '963 Pine Avenue, City L',
    createdAt: addMinutes(today, -120)
  },
  {
    id: 'unassigned-8',
    orderId: 'ORD-013',
    productType: 'kerosene',
    quantity: 4800,
    priority: 'low',
    etaWindow: {
      start: addHours(today, 18),
      end: addHours(today, 22)
    },
    customerName: 'Mobil Station M',
    deliveryAddress: '741 Elm Drive, City M',
    createdAt: addMinutes(today, -75)
  },
  {
    id: 'unassigned-9',
    orderId: 'ORD-014',
    productType: 'diesel',
    quantity: 11000,
    priority: 'high',
    etaWindow: {
      start: addHours(today, 6),
      end: addHours(today, 10)
    },
    customerName: 'Texaco Station N',
    deliveryAddress: '159 Maple Boulevard, City N',
    createdAt: addMinutes(today, -180)
  },
  {
    id: 'unassigned-10',
    orderId: 'ORD-015',
    productType: 'petrol',
    quantity: 5800,
    priority: 'medium',
    etaWindow: {
      start: addHours(today, 12),
      end: addHours(today, 16)
    },
    customerName: 'Exxon Station O',
    deliveryAddress: '357 Cedar Lane, City O',
    createdAt: addMinutes(today, -50)
  },
  {
    id: 'unassigned-11',
    orderId: 'ORD-016',
    productType: 'lubricants',
    quantity: 2500,
    priority: 'low',
    etaWindow: {
      start: addHours(today, 14),
      end: addHours(today, 18)
    },
    customerName: 'Valero Station P',
    deliveryAddress: '246 Birch Street, City P',
    createdAt: addMinutes(today, -25)
  },
  {
    id: 'unassigned-12',
    orderId: 'ORD-017',
    productType: 'diesel',
    quantity: 7800,
    priority: 'medium',
    etaWindow: {
      start: addHours(today, 16),
      end: addHours(today, 20)
    },
    customerName: 'Sunoco Station Q',
    deliveryAddress: '468 Spruce Road, City Q',
    createdAt: addMinutes(today, -35)
  }
];

// Helper function to get trailer by vehicle
export const getTrailerByVehicleId = (vehicleId: string): Trailer | undefined => {
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  if (!vehicle?.trailerId) return undefined;
  return mockTrailers.find(t => t.id === vehicle.trailerId);
};

// Product color mapping for UI
export const productColors: Record<string, string> = {
  diesel: '#3B82F6', // blue
  petrol: '#EF4444', // red
  kerosene: '#10B981', // green
  lubricants: '#F59E0B', // amber
  'heating oil': '#8B5CF6' // purple
};

// Priority color mapping
export const priorityColors: Record<string, string> = {
  high: '#DC2626', // red-600
  medium: '#D97706', // amber-600
  low: '#059669' // emerald-600
};