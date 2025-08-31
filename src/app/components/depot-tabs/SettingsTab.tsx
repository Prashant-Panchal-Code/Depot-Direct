"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DepotDetails } from "../DepotDetailsPage";
import {
  Shield,
  Bell,
  Database,
  Gear,
  Warning,
  CheckCircle,
  FloppyDisk
} from "@phosphor-icons/react";

interface SettingsTabProps {
  depot: DepotDetails;
  onSave: () => void;
}

export default function SettingsTab({ depot, onSave }: SettingsTabProps) {
  const [settings, setSettings] = useState({
    // Security Settings
    accessControl: {
      requireBadgeAccess: true,
      enableSecurityCameras: true,
      automaticLockdown: false,
      emergencyShutoff: true
    },
    
    // Operational Settings
    operations: {
      maxSimultaneousLoadings: 3,
      autoSchedulingEnabled: true,
      loadingTimeout: 30,
      qualityCheckRequired: true,
      temperatureMonitoring: true,
      inventoryTracking: true
    },
    
    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      lowInventoryThreshold: 10,
      temperatureAlerts: true,
      maintenanceReminders: true,
      loadingCompletion: true
    },
    
    // Integration Settings
    integrations: {
      emsIntegration: true,
      accountingSystem: "SAP",
      weatherDataFeed: true,
      gpsTracking: true,
      customApiEndpoint: ""
    },
    
    // Compliance Settings
    compliance: {
      environmentalReporting: true,
      safetyAudits: true,
      regulatoryCompliance: "EPA",
      documentRetention: 7, // years
      auditTrail: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    console.log("Saving depot settings:", settings);
    onSave();
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Security & Access Control</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requireBadgeAccess"
                checked={settings.accessControl.requireBadgeAccess}
                onCheckedChange={(checked) => handleSettingChange('accessControl', 'requireBadgeAccess', checked)}
              />
              <Label htmlFor="requireBadgeAccess">Require badge access for entry</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableSecurityCameras"
                checked={settings.accessControl.enableSecurityCameras}
                onCheckedChange={(checked) => handleSettingChange('accessControl', 'enableSecurityCameras', checked)}
              />
              <Label htmlFor="enableSecurityCameras">Enable security cameras</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="automaticLockdown"
                checked={settings.accessControl.automaticLockdown}
                onCheckedChange={(checked) => handleSettingChange('accessControl', 'automaticLockdown', checked)}
              />
              <Label htmlFor="automaticLockdown">Automatic lockdown on security breach</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emergencyShutoff"
                checked={settings.accessControl.emergencyShutoff}
                onCheckedChange={(checked) => handleSettingChange('accessControl', 'emergencyShutoff', checked)}
              />
              <Label htmlFor="emergencyShutoff">Emergency shutoff system</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Gear size={20} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Operational Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maxSimultaneousLoadings">Maximum Simultaneous Loadings</Label>
            <Input
              id="maxSimultaneousLoadings"
              type="number"
              min="1"
              max="10"
              value={settings.operations.maxSimultaneousLoadings}
              onChange={(e) => handleSettingChange('operations', 'maxSimultaneousLoadings', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="loadingTimeout">Loading Timeout (minutes)</Label>
            <Input
              id="loadingTimeout"
              type="number"
              min="5"
              max="120"
              value={settings.operations.loadingTimeout}
              onChange={(e) => handleSettingChange('operations', 'loadingTimeout', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoSchedulingEnabled"
                checked={settings.operations.autoSchedulingEnabled}
                onCheckedChange={(checked) => handleSettingChange('operations', 'autoSchedulingEnabled', checked)}
              />
              <Label htmlFor="autoSchedulingEnabled">Enable automatic scheduling</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="qualityCheckRequired"
                checked={settings.operations.qualityCheckRequired}
                onCheckedChange={(checked) => handleSettingChange('operations', 'qualityCheckRequired', checked)}
              />
              <Label htmlFor="qualityCheckRequired">Require quality checks before loading</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="temperatureMonitoring"
                checked={settings.operations.temperatureMonitoring}
                onCheckedChange={(checked) => handleSettingChange('operations', 'temperatureMonitoring', checked)}
              />
              <Label htmlFor="temperatureMonitoring">Enable temperature monitoring</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inventoryTracking"
                checked={settings.operations.inventoryTracking}
                onCheckedChange={(checked) => handleSettingChange('operations', 'inventoryTracking', checked)}
              />
              <Label htmlFor="inventoryTracking">Enable real-time inventory tracking</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications & Alerts</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="lowInventoryThreshold">Low Inventory Threshold (%)</Label>
            <Input
              id="lowInventoryThreshold"
              type="number"
              min="0"
              max="50"
              value={settings.notifications.lowInventoryThreshold}
              onChange={(e) => handleSettingChange('notifications', 'lowInventoryThreshold', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emailAlerts"
                checked={settings.notifications.emailAlerts}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'emailAlerts', checked)}
              />
              <Label htmlFor="emailAlerts">Enable email alerts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smsAlerts"
                checked={settings.notifications.smsAlerts}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'smsAlerts', checked)}
              />
              <Label htmlFor="smsAlerts">Enable SMS alerts</Label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="temperatureAlerts"
                checked={settings.notifications.temperatureAlerts}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'temperatureAlerts', checked)}
              />
              <Label htmlFor="temperatureAlerts">Temperature deviation alerts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="maintenanceReminders"
                checked={settings.notifications.maintenanceReminders}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'maintenanceReminders', checked)}
              />
              <Label htmlFor="maintenanceReminders">Maintenance reminders</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="loadingCompletion"
                checked={settings.notifications.loadingCompletion}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'loadingCompletion', checked)}
              />
              <Label htmlFor="loadingCompletion">Loading completion notifications</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">System Integrations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="accountingSystem">Accounting System</Label>
            <Select 
              value={settings.integrations.accountingSystem}
              onValueChange={(value) => handleSettingChange('integrations', 'accountingSystem', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAP">SAP</SelectItem>
                <SelectItem value="Oracle">Oracle</SelectItem>
                <SelectItem value="QuickBooks">QuickBooks</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customApiEndpoint">Custom API Endpoint</Label>
            <Input
              id="customApiEndpoint"
              value={settings.integrations.customApiEndpoint}
              onChange={(e) => handleSettingChange('integrations', 'customApiEndpoint', e.target.value)}
              placeholder="https://api.example.com/webhook"
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emsIntegration"
                checked={settings.integrations.emsIntegration}
                onCheckedChange={(checked) => handleSettingChange('integrations', 'emsIntegration', checked)}
              />
              <Label htmlFor="emsIntegration">EMS (Environmental Management System) integration</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="weatherDataFeed"
                checked={settings.integrations.weatherDataFeed}
                onCheckedChange={(checked) => handleSettingChange('integrations', 'weatherDataFeed', checked)}
              />
              <Label htmlFor="weatherDataFeed">Weather data feed integration</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gpsTracking"
                checked={settings.integrations.gpsTracking}
                onCheckedChange={(checked) => handleSettingChange('integrations', 'gpsTracking', checked)}
              />
              <Label htmlFor="gpsTracking">GPS tracking integration</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Warning size={20} className="text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Compliance & Regulatory</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="regulatoryCompliance">Primary Regulatory Framework</Label>
            <Select 
              value={settings.compliance.regulatoryCompliance}
              onValueChange={(value) => handleSettingChange('compliance', 'regulatoryCompliance', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EPA">EPA (Environmental Protection Agency)</SelectItem>
                <SelectItem value="OSHA">OSHA (Occupational Safety)</SelectItem>
                <SelectItem value="DOT">DOT (Department of Transportation)</SelectItem>
                <SelectItem value="ISO">ISO Standards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="documentRetention">Document Retention Period (Years)</Label>
            <Input
              id="documentRetention"
              type="number"
              min="1"
              max="25"
              value={settings.compliance.documentRetention}
              onChange={(e) => handleSettingChange('compliance', 'documentRetention', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="environmentalReporting"
                checked={settings.compliance.environmentalReporting}
                onCheckedChange={(checked) => handleSettingChange('compliance', 'environmentalReporting', checked)}
              />
              <Label htmlFor="environmentalReporting">Enable environmental reporting</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="safetyAudits"
                checked={settings.compliance.safetyAudits}
                onCheckedChange={(checked) => handleSettingChange('compliance', 'safetyAudits', checked)}
              />
              <Label htmlFor="safetyAudits">Mandatory safety audits</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auditTrail"
                checked={settings.compliance.auditTrail}
                onCheckedChange={(checked) => handleSettingChange('compliance', 'auditTrail', checked)}
              />
              <Label htmlFor="auditTrail">Maintain detailed audit trail</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Settings Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800">Security Features:</p>
            <p className="text-blue-700">
              {Object.values(settings.accessControl).filter(v => v === true).length} of 4 enabled
            </p>
          </div>
          
          <div>
            <p className="font-medium text-blue-800">Operational Settings:</p>
            <p className="text-blue-700">
              Max {settings.operations.maxSimultaneousLoadings} concurrent loadings
            </p>
          </div>
          
          <div>
            <p className="font-medium text-blue-800">Notifications:</p>
            <p className="text-blue-700">
              Alert at {settings.notifications.lowInventoryThreshold}% inventory
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <FloppyDisk size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
