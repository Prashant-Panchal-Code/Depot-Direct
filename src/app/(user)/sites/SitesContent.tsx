"use client";

import { useState } from "react";
import { useAppContext } from "@/app/contexts/AppContext";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { CheckSquare, Circle, Rows, XCircle } from "@phosphor-icons/react";
import AddSiteDialog, { Site, NewSite } from "@/app/components/AddSiteDialog";
import { SiteDetails } from "@/app/components/SiteDetailsModal";
import SiteDetailsPage from "@/app/components/SiteDetailsPage";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SitesContent() {
  const { sidebarCollapsed } = useAppContext();
  const [selectedSite, setSelectedSite] = useState<SiteDetails | null>(null);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  // Define depots for reference
  const depots = [
    { id: 1, depotCode: "DP001", depotName: "Main Distribution Center" },
    { id: 2, depotCode: "DP002", depotName: "Port Terminal Depot" },
    { id: 3, depotCode: "DP003", depotName: "Airport Fuel Terminal" },
    { id: 4, depotCode: "DP004", depotName: "Orange County Hub" },
    { id: 5, depotCode: "DP005", depotName: "Valley Distribution" },
    { id: 6, depotCode: "DP006", depotName: "Coastal Storage Facility" },
    { id: 7, depotCode: "DP007", depotName: "Industrial Park Depot" },
    { id: 8, depotCode: "DP008", depotName: "South Bay Terminal" },
    { id: 9, depotCode: "DP009", depotName: "Long Beach Facility" },
    { id: 10, depotCode: "DP010", depotName: "Irvine Tech Depot" },
  ];

  const getDepotName = (depotId: number | null) => {
    if (!depotId) return "-";
    const depot = depots.find(d => d.id === depotId);
    return depot ? depot.depotName : "Unknown Depot";
  };

  const [sites, setSites] = useState<Site[]>([
    { id: 1, siteCode: "WC001", siteName: "Downtown Gas Station", latitude: "34.0522", longitude: "-118.2437", street: "123 Main Street", postalCode: "90210", town: "Los Angeles", active: true, priority: "High", depotId: 1 },
    { id: 2, siteCode: "WC002", siteName: "Airport Fuel Hub", latitude: "34.0522", longitude: "-118.2437", street: "456 Airport Blvd", postalCode: "90045", town: "Los Angeles", active: true, priority: "High", depotId: 3 },
    { id: 3, siteCode: "WC003", siteName: "Industrial District Station", latitude: "34.0194", longitude: "-118.4108", street: "789 Industrial Way", postalCode: "90401", town: "Santa Monica", active: true, priority: "Medium", depotId: 6 },
    { id: 4, siteCode: "WC004", siteName: "Harbor Point Depot", latitude: "33.7701", longitude: "-118.1937", street: "321 Harbor Drive", postalCode: "90731", town: "San Pedro", active: false, priority: "Low", depotId: 2 },
    { id: 5, siteCode: "WC005", siteName: "Suburban Shopping Center", latitude: "34.1478", longitude: "-118.1445", street: "654 Shopping Center Dr", postalCode: "91101", town: "Pasadena", active: true, priority: "Medium", depotId: 1 },
    { id: 6, siteCode: "WC006", siteName: "Coastal Highway Station", latitude: "34.0059", longitude: "-118.4989", street: "789 Pacific Coast Hwy", postalCode: "90401", town: "Santa Monica", active: true, priority: "High", depotId: 6 },
    { id: 7, siteCode: "WC007", siteName: "Metro Center Fuel", latitude: "34.0522", longitude: "-118.2437", street: "456 Metro Blvd", postalCode: "90012", town: "Los Angeles", active: true, priority: "Medium", depotId: 1 },
    { id: 8, siteCode: "WC008", siteName: "Valley Express Station", latitude: "34.1684", longitude: "-118.3731", street: "123 Valley View Dr", postalCode: "91367", town: "Woodland Hills", active: false, priority: "Low", depotId: 5 },
    { id: 9, siteCode: "WC009", siteName: "Beverly Hills Premium", latitude: "34.0736", longitude: "-118.4004", street: "321 Rodeo Drive", postalCode: "90210", town: "Beverly Hills", active: true, priority: "High", depotId: 1 },
    { id: 10, siteCode: "WC010", siteName: "Venice Beach Station", latitude: "33.9850", longitude: "-118.4695", street: "789 Ocean Front Walk", postalCode: "90291", town: "Venice", active: true, priority: "Medium", depotId: 6 },
    { id: 11, siteCode: "WC011", siteName: "Hollywood Boulevard Fuel", latitude: "34.1022", longitude: "-118.3406", street: "456 Hollywood Blvd", postalCode: "90028", town: "Hollywood", active: true, priority: "High", depotId: 1 },
    { id: 12, siteCode: "WC012", siteName: "Culver City Station", latitude: "34.0211", longitude: "-118.3965", street: "123 Washington Blvd", postalCode: "90232", town: "Culver City", active: false, priority: "Low", depotId: 6 },
    { id: 13, siteCode: "WC013", siteName: "Marina Del Rey Fuel", latitude: "33.9803", longitude: "-118.4517", street: "321 Admiralty Way", postalCode: "90292", town: "Marina Del Rey", active: true, priority: "Medium", depotId: 6 },
    { id: 14, siteCode: "WC014", siteName: "El Segundo Airport Station", latitude: "33.9425", longitude: "-118.4081", street: "789 Sepulveda Blvd", postalCode: "90245", town: "El Segundo", active: true, priority: "High", depotId: 3 },
    { id: 15, siteCode: "WC015", siteName: "Manhattan Beach Express", latitude: "33.8847", longitude: "-118.4109", street: "456 Manhattan Beach Blvd", postalCode: "90266", town: "Manhattan Beach", active: true, priority: "Medium", depotId: 8 },
    { id: 16, siteCode: "WC016", siteName: "Redondo Beach Station", latitude: "33.8492", longitude: "-118.3887", street: "123 Pacific Coast Hwy", postalCode: "90277", town: "Redondo Beach", active: false, priority: "Low", depotId: 8 },
    { id: 17, siteCode: "WC017", siteName: "Torrance Industrial", latitude: "33.8358", longitude: "-118.3406", street: "321 Torrance Blvd", postalCode: "90501", town: "Torrance", active: true, priority: "High", depotId: 7 },
    { id: 18, siteCode: "WC018", siteName: "Long Beach Harbor", latitude: "33.7701", longitude: "-118.1937", street: "789 Harbor Scenic Dr", postalCode: "90802", town: "Long Beach", active: true, priority: "High", depotId: 9 },
    { id: 19, siteCode: "WC019", siteName: "Huntington Beach Pier", latitude: "33.6553", longitude: "-117.9988", street: "456 Main Street", postalCode: "92648", town: "Huntington Beach", active: true, priority: "Medium", depotId: 4 },
    { id: 20, siteCode: "WC020", siteName: "Newport Beach Station", latitude: "33.6189", longitude: "-117.9298", street: "123 Balboa Blvd", postalCode: "92661", town: "Newport Beach", active: false, priority: "Low", depotId: 4 },
    { id: 21, siteCode: "WC021", siteName: "Laguna Beach Scenic", latitude: "33.5427", longitude: "-117.7854", street: "321 Coast Hwy", postalCode: "92651", town: "Laguna Beach", active: true, priority: "Medium", depotId: 4 },
    { id: 22, siteCode: "WC022", siteName: "Anaheim Convention Center", latitude: "33.8073", longitude: "-117.9185", street: "789 Katella Ave", postalCode: "92802", town: "Anaheim", active: true, priority: "High", depotId: 4 },
    { id: 23, siteCode: "WC023", siteName: "Fullerton University Station", latitude: "33.8839", longitude: "-117.8850", street: "456 State College Blvd", postalCode: "92831", town: "Fullerton", active: true, priority: "Medium", depotId: 4 },
    { id: 24, siteCode: "WC024", siteName: "Buena Park Express", latitude: "33.8675", longitude: "-117.9981", street: "123 Beach Blvd", postalCode: "90620", town: "Buena Park", active: false, priority: "Low", depotId: 4 },
    { id: 25, siteCode: "WC025", siteName: "Cypress Industrial", latitude: "33.8169", longitude: "-118.0373", street: "321 Lincoln Ave", postalCode: "90630", town: "Cypress", active: true, priority: "High", depotId: 4 },
    { id: 26, siteCode: "WC026", siteName: "Garden Grove Station", latitude: "33.7739", longitude: "-117.9414", street: "789 Harbor Blvd", postalCode: "92840", town: "Garden Grove", active: true, priority: "Medium", depotId: 4 },
    { id: 27, siteCode: "WC027", siteName: "Westminster Express", latitude: "33.7514", longitude: "-117.9940", street: "456 Bolsa Ave", postalCode: "92683", town: "Westminster", active: true, priority: "Low", depotId: 4 },
    { id: 28, siteCode: "WC028", siteName: "Fountain Valley Station", latitude: "33.7092", longitude: "-117.9537", street: "123 Brookhurst St", postalCode: "92708", town: "Fountain Valley", active: false, priority: "Medium", depotId: 4 },
    { id: 29, siteCode: "WC029", siteName: "Costa Mesa Business", latitude: "33.6411", longitude: "-117.9187", street: "321 Bristol St", postalCode: "92626", town: "Costa Mesa", active: true, priority: "High", depotId: 4 },
    { id: 30, siteCode: "WC030", siteName: "Irvine Tech Center", latitude: "33.6846", longitude: "-117.8265", street: "789 Jamboree Rd", postalCode: "92612", town: "Irvine", active: true, priority: "High", depotId: 10 },
    { id: 31, siteCode: "WC031", siteName: "Mission Viejo Station", latitude: "33.6000", longitude: "-117.6720", street: "456 Marguerite Pkwy", postalCode: "92692", town: "Mission Viejo", active: true, priority: "Medium", depotId: 10 },
    { id: 32, siteCode: "WC032", siteName: "Lake Forest Express", latitude: "33.6469", longitude: "-117.6892", street: "123 Lake Forest Dr", postalCode: "92630", town: "Lake Forest", active: false, priority: "Low", depotId: 10 },
    { id: 33, siteCode: "WC033", siteName: "Aliso Viejo Station", latitude: "33.5676", longitude: "-117.7256", street: "321 Aliso Creek Rd", postalCode: "92656", town: "Aliso Viejo", active: true, priority: "Medium", depotId: 10 },
    { id: 34, siteCode: "WC034", siteName: "San Juan Capistrano", latitude: "33.5017", longitude: "-117.6625", street: "789 Ortega Hwy", postalCode: "92675", town: "San Juan Capistrano", active: true, priority: "Low", depotId: 10 },
    { id: 35, siteCode: "WC035", siteName: "Dana Point Harbor", latitude: "33.4734", longitude: "-117.6981", street: "456 Pacific Coast Hwy", postalCode: "92629", town: "Dana Point", active: true, priority: "High", depotId: 10 },
    { id: 36, siteCode: "WC036", siteName: "San Clemente Beach", latitude: "33.4270", longitude: "-117.6120", street: "123 Avenida Del Mar", postalCode: "92672", town: "San Clemente", active: false, priority: "Medium", depotId: 10 },
    { id: 37, siteCode: "WC037", siteName: "Oceanside Pier Station", latitude: "33.1959", longitude: "-117.3795", street: "321 Mission Ave", postalCode: "92054", town: "Oceanside", active: true, priority: "High", depotId: null },
    { id: 38, siteCode: "WC038", siteName: "Carlsbad Village", latitude: "33.1581", longitude: "-117.3506", street: "789 Carlsbad Village Dr", postalCode: "92008", town: "Carlsbad", active: true, priority: "Medium", depotId: null },
    { id: 39, siteCode: "WC039", siteName: "Encinitas Express", latitude: "33.0370", longitude: "-117.2920", street: "456 Coast Hwy 101", postalCode: "92024", town: "Encinitas", active: true, priority: "Low", depotId: null },
    { id: 40, siteCode: "WC040", siteName: "Solana Beach Station", latitude: "32.9911", longitude: "-117.2712", street: "123 Lomas Santa Fe Dr", postalCode: "92075", town: "Solana Beach", active: false, priority: "Medium", depotId: null },
    { id: 41, siteCode: "WC041", siteName: "Del Mar Racing", latitude: "32.9595", longitude: "-117.2653", street: "321 Jimmy Durante Blvd", postalCode: "92014", town: "Del Mar", active: true, priority: "High", depotId: null },
    { id: 42, siteCode: "WC042", siteName: "La Jolla Cove", latitude: "32.8470", longitude: "-117.2730", street: "789 Prospect St", postalCode: "92037", town: "La Jolla", active: true, priority: "High", depotId: null },
    { id: 43, siteCode: "WC043", siteName: "Pacific Beach Station", latitude: "32.7940", longitude: "-117.2348", street: "456 Garnet Ave", postalCode: "92109", town: "Pacific Beach", active: true, priority: "Medium", depotId: null },
    { id: 44, siteCode: "WC044", siteName: "Mission Beach Express", latitude: "32.7669", longitude: "-117.2526", street: "123 Mission Blvd", postalCode: "92109", town: "Mission Beach", active: false, priority: "Low", depotId: null },
    { id: 45, siteCode: "WC045", siteName: "Ocean Beach Station", latitude: "32.7481", longitude: "-117.2470", street: "321 Newport Ave", postalCode: "92107", town: "Ocean Beach", active: true, priority: "Medium", depotId: null },
    { id: 46, siteCode: "WC046", siteName: "Point Loma Naval", latitude: "32.6953", longitude: "-117.2415", street: "789 Rosecrans St", postalCode: "92106", town: "Point Loma", active: true, priority: "High", depotId: null },
    { id: 47, siteCode: "WC047", siteName: "Downtown San Diego", latitude: "32.7157", longitude: "-117.1611", street: "456 Broadway", postalCode: "92101", town: "San Diego", active: true, priority: "High", depotId: null },
    { id: 48, siteCode: "WC048", siteName: "Balboa Park Station", latitude: "32.7341", longitude: "-117.1449", street: "123 Park Blvd", postalCode: "92103", town: "San Diego", active: false, priority: "Medium", depotId: null },
    { id: 49, siteCode: "WC049", siteName: "Hillcrest Express", latitude: "32.7490", longitude: "-117.1664", street: "321 University Ave", postalCode: "92103", town: "San Diego", active: true, priority: "Low", depotId: null },
    { id: 50, siteCode: "WC050", siteName: "Chula Vista Station", latitude: "32.6401", longitude: "-117.0842", street: "789 Broadway", postalCode: "91910", town: "Chula Vista", active: true, priority: "Medium", depotId: null },
  ]);

  const handleAddSite = (newSite: NewSite) => {
    const site: Site = {
      ...newSite,
      id: sites.length + 1,
    };
    setSites([...sites, site]);
  };

  const handleRowDoubleClick = (data: Site) => {
    const siteDetails: SiteDetails = {
      ...data,
      id: data.id ?? 0,
      latLong: `${data.latitude}, ${data.longitude}`,
      // Add mock additional details that would typically come from a database
      contactPerson: `Manager ${data.siteCode}`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `manager.${data.siteCode.toLowerCase()}@company.com`,
      // Include the new depot fields
      depotId: data.depotId,
      deliveryStopped: false, // Default values
      pumpedRequired: false, // Default values
    };
    setSelectedSite(siteDetails);
    setShowSiteDetails(true);
  };

  const handleBackToSites = () => {
    setShowSiteDetails(false);
    setSelectedSite(null);
  };

  const handleSaveSite = (updatedSite: SiteDetails) => {
    // Convert SiteDetails back to Site format for the sites array
    const updatedSiteData: Site = {
      id: updatedSite.id!,  // Non-null assertion since we know it exists when saving
      siteCode: updatedSite.siteCode,
      siteName: updatedSite.siteName,
      latitude: updatedSite.latLong?.split(',')[0]?.trim() || "",
      longitude: updatedSite.latLong?.split(',')[1]?.trim() || "",
      street: updatedSite.street,
      postalCode: updatedSite.postalCode,
      town: updatedSite.town,
      active: updatedSite.active,
      priority: updatedSite.priority,
      depotId: updatedSite.depotId || null, // Include depot ID from the updated site
    };
    
    setSites(sites.map(site => 
      site.id === updatedSite.id ? updatedSiteData : site
    ));
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
      headerName: "Depot Name",
      flex: 1,
      minWidth: 180,
      sortable: true,
      filter: true,
      valueGetter: (params) => getDepotName(params.data?.depotId),
    },
    {
      headerName: "Lat/Long",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center' },
      valueGetter: (params) => `${params.data?.latitude}, ${params.data?.longitude}`,
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
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <>
      {showSiteDetails && selectedSite ? (
        <SiteDetailsPage
          site={selectedSite}
          onBack={handleBackToSites}
          onSave={handleSaveSite}
        />
      ) : (
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
              {/* Tip Section */}
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Tip:</span> Double-click on any site row to view detailed information including tank details, delivery schedules, and site history.
                </p>
              </div>
              
              <div style={{ height: "calc(100% - 60px)", width: "100%" }}>
                <AgGridReact
                  rowData={sites}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  pagination={true}
                  paginationPageSize={20}
                  rowHeight={55}
                  headerHeight={45}
                  suppressMenuHide={true}
                  theme={themeQuartz}
                  onRowDoubleClicked={(event) => handleRowDoubleClick(event.data)}
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
