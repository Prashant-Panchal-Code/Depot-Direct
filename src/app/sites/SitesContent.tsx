'use client';

import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Modal component for adding new sites
function AddSiteModal({ isOpen, onClose, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (site: any) => void; 
}) {
  const [formData, setFormData] = useState({
    siteCode: '',
    siteName: '',
    latitude: '',
    longitude: '',
    street: '',
    postalCode: '',
    town: '',
    active: true,
    priority: 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      siteCode: '',
      siteName: '',
      latitude: '',
      longitude: '',
      street: '',
      postalCode: '',
      town: '',
      active: true,
      priority: 'Medium'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Site</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Site Code *</label>
              <input
                type="text"
                value={formData.siteCode}
                onChange={(e) => setFormData({...formData, siteCode: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Site Name *</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Town/City</label>
              <input
                type="text"
                value={formData.town}
                onChange={(e) => setFormData({...formData, town: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-900">Active</label>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white"
            >
              Add Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SitesContent() {
  const { selectedCountry, selectedRegion, sidebarCollapsed } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sites, setSites] = useState([
    {
      id: 1,
      siteCode: 'WC001',
      siteName: 'Downtown Gas Station',
      latitude: '34.0522',
      longitude: '-118.2437',
      street: '123 Main Street',
      postalCode: '90210',
      town: 'Los Angeles',
      active: true,
      priority: 'High'
    },
    {
      id: 2,
      siteCode: 'WC002',
      siteName: 'Airport Fuel Hub',
      latitude: '34.0522',
      longitude: '-118.2437',
      street: '456 Airport Blvd',
      postalCode: '90045',
      town: 'Los Angeles',
      active: true,
      priority: 'High'
    },
    {
      id: 3,
      siteCode: 'WC003',
      siteName: 'Industrial District Station',
      latitude: '34.0194',
      longitude: '-118.4108',
      street: '789 Industrial Way',
      postalCode: '90401',
      town: 'Santa Monica',
      active: true,
      priority: 'Medium'
    },
    {
      id: 4,
      siteCode: 'WC004',
      siteName: 'Harbor Point Depot',
      latitude: '33.7701',
      longitude: '-118.1937',
      street: '321 Harbor Drive',
      postalCode: '90731',
      town: 'San Pedro',
      active: false,
      priority: 'Low'
    },
    {
      id: 5,
      siteCode: 'WC005',
      siteName: 'Suburban Shopping Center',
      latitude: '34.1478',
      longitude: '-118.1445',
      street: '654 Shopping Center Dr',
      postalCode: '91101',
      town: 'Pasadena',
      active: true,
      priority: 'Medium'
    }
  ]);

  const handleAddSite = (newSite: any) => {
    const site = {
      ...newSite,
      id: sites.length + 1,
    };
    setSites([...sites, site]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Action Cell Renderer for Edit/Delete buttons
  const ActionCellRenderer = (params: any) => {
    return (
      <div className="flex items-center gap-2 h-full">
        <button 
          onClick={() => console.log('Edit', params.data)}
          className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white"
        >
          Edit
        </button>
        <button 
          onClick={() => console.log('Delete', params.data)}
          className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 hover:bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    );
  };

  // Status Cell Renderer for Active/Inactive
  const StatusCellRenderer = (params: any) => {
    const isActive = params.value;
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Priority Cell Renderer
  const PriorityCellRenderer = (params: any) => {
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(params.value)}`}>
        {params.value}
      </span>
    );
  };

  // Lat/Long Cell Renderer
  const LatLongCellRenderer = (params: any) => {
    const { latitude, longitude } = params.data;
    if (latitude && longitude) {
      return (
        <div className="text-sm">
          <div>{latitude}</div>
          <div>{longitude}</div>
        </div>
      );
    }
    return <span className="text-gray-500">Not set</span>;
  };

  // Column Definitions
  const columnDefs: ColDef[] = [
    { 
      field: 'siteName', 
      headerName: 'Site Name', 
      flex: 1,
      minWidth: 150,
      cellStyle: { fontWeight: 'bold' }
    },
    { 
      field: 'siteCode', 
      headerName: 'Site Code', 
      flex: 1,
      minWidth: 120 
    },
    { 
      headerName: 'Lat/Long', 
      cellRenderer: LatLongCellRenderer,
      flex: 1,
      minWidth: 120,
      sortable: false,
      filter: false
    },
    { 
      field: 'street', 
      headerName: 'Street', 
      flex: 2,
      minWidth: 150,
      valueFormatter: (params) => params.value || '-'
    },
    { 
      field: 'postalCode', 
      headerName: 'Postal Code', 
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || '-'
    },
    { 
      field: 'town', 
      headerName: 'Town', 
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || '-'
    },
    { 
      field: 'active', 
      headerName: 'Active', 
      flex: 1,
      minWidth: 100,
      cellRenderer: StatusCellRenderer
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      flex: 1,
      minWidth: 100,
      cellRenderer: PriorityCellRenderer
    },
    { 
      headerName: 'Actions', 
      cellRenderer: ActionCellRenderer,
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <main className={`pt-24 min-h-screen bg-gray-50 text-gray-900 overflow-y-auto transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Sites</h1>
            <p className="text-gray-600 mt-2">
              Manage fuel delivery sites in {selectedRegion}, {selectedCountry}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
          >
            <span className="text-lg">➕</span>
            Add New Site
          </button>
        </div>

        {/* Sites Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div style={{ height: '500px', width: '100%' }}>
            <AgGridReact
              rowData={sites}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              rowHeight={60}
              headerHeight={50}
              suppressMenuHide={true}
              theme={themeQuartz}
              onGridReady={(params: GridReadyEvent) => {
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sites</p>
                <p className="text-2xl font-bold text-gray-900">{sites.length}</p>
              </div>
              <span className="text-2xl">🏪</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sites</p>
                <p className="text-2xl font-bold text-green-600">{sites.filter(s => s.active).length}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{sites.filter(s => s.priority === 'High').length}</p>
              </div>
              <span className="text-2xl">🔴</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Sites</p>
                <p className="text-2xl font-bold text-red-600">{sites.filter(s => !s.active).length}</p>
              </div>
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSite}
      />
    </main>
  );
}
