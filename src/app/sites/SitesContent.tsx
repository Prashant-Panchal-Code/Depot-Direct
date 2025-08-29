'use client';

import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Add New Site</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Site Code *</label>
              <input
                type="text"
                value={formData.siteCode}
                onChange={(e) => setFormData({...formData, siteCode: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Site Name *</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Town/City</label>
              <input
                type="text"
                value={formData.town}
                onChange={(e) => setFormData({...formData, town: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-white">Active</label>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white"
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
  const { selectedCountry, selectedRegion } = useAppContext();
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
        return 'bg-red-500/20 text-red-400';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <main className="ml-64 pt-20 min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Sites</h1>
            <p className="text-gray-400 mt-2">
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
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-4 px-6 text-white font-medium">Site Name</th>
                  <th className="py-4 px-6 text-white font-medium">Site Code</th>
                  <th className="py-4 px-6 text-white font-medium">Lat/Long</th>
                  <th className="py-4 px-6 text-white font-medium">Street</th>
                  <th className="py-4 px-6 text-white font-medium">Postal Code</th>
                  <th className="py-4 px-6 text-white font-medium">Town</th>
                  <th className="py-4 px-6 text-white font-medium">Active</th>
                  <th className="py-4 px-6 text-white font-medium">Priority</th>
                  <th className="py-4 px-6 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-700/50">
                    <td className="py-4 px-6 font-medium text-white">{site.siteName}</td>
                    <td className="py-4 px-6 text-gray-400">{site.siteCode}</td>
                    <td className="py-4 px-6 text-gray-400">
                      {site.latitude && site.longitude ? (
                        <div className="text-sm">
                          <div>{site.latitude}</div>
                          <div>{site.longitude}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not set</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400">{site.street || '-'}</td>
                    <td className="py-4 px-6 text-gray-400">{site.postalCode || '-'}</td>
                    <td className="py-4 px-6 text-gray-400">{site.town || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        site.active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {site.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(site.priority)}`}>
                        {site.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 hover:bg-red-500 text-white">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Sites</p>
                <p className="text-2xl font-bold text-white">{sites.length}</p>
              </div>
              <span className="text-2xl">🏪</span>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Sites</p>
                <p className="text-2xl font-bold text-green-400">{sites.filter(s => s.active).length}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-red-400">{sites.filter(s => s.priority === 'High').length}</p>
              </div>
              <span className="text-2xl">🔴</span>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inactive Sites</p>
                <p className="text-2xl font-bold text-red-400">{sites.filter(s => !s.active).length}</p>
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
